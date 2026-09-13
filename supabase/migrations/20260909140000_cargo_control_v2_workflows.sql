-- Cargo Control V2: operaciones compuestas seguras.
-- Las funciones son SECURITY INVOKER: la sesión conserva RLS y permisos.

create unique index if not exists cargo_shipments_one_per_request_idx
  on public.cargo_shipments (organization_id, transport_request_id)
  where transport_request_id is not null;

create or replace function public.cargo_replace_order_lines(
  p_order_id uuid,
  p_lines jsonb
) returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_organization_id uuid;
begin
  if jsonb_typeof(coalesce(p_lines, '[]'::jsonb)) <> 'array' then
    raise exception 'Las líneas deben enviarse como una lista.';
  end if;

  select organization_id
    into v_organization_id
    from public.cargo_purchase_orders
   where id = p_order_id
   for update;

  if v_organization_id is null then
    raise exception 'Pedido no encontrado o sin permiso.';
  end if;

  if exists (
    select 1
      from jsonb_to_recordset(coalesce(p_lines, '[]'::jsonb)) as x(
        line_number integer,
        sku text,
        description text,
        quantity numeric,
        unit text,
        unit_price numeric
      )
     where x.line_number is null
        or x.line_number <= 0
        or nullif(trim(x.description), '') is null
        or x.quantity is null
        or x.quantity <= 0
        or coalesce(x.unit_price, 0) < 0
  ) then
    raise exception 'Hay líneas con número, descripción, cantidad o precio no válidos.';
  end if;

  if exists (
    select x.line_number
      from jsonb_to_recordset(coalesce(p_lines, '[]'::jsonb)) as x(line_number integer)
     group by x.line_number
    having count(*) > 1
  ) then
    raise exception 'No puede repetirse el número de línea.';
  end if;

  delete from public.cargo_purchase_order_lines
   where organization_id = v_organization_id
     and purchase_order_id = p_order_id;

  insert into public.cargo_purchase_order_lines (
    organization_id,
    purchase_order_id,
    line_number,
    sku,
    description,
    quantity,
    unit,
    unit_price
  )
  select
    v_organization_id,
    p_order_id,
    x.line_number,
    nullif(trim(x.sku), ''),
    trim(x.description),
    x.quantity,
    nullif(trim(x.unit), ''),
    coalesce(x.unit_price, 0)
  from jsonb_to_recordset(coalesce(p_lines, '[]'::jsonb)) as x(
    line_number integer,
    sku text,
    description text,
    quantity numeric,
    unit text,
    unit_price numeric
  );

  update public.cargo_purchase_orders
     set total_amount = coalesce((
       select sum(quantity * unit_price)
         from public.cargo_purchase_order_lines
        where organization_id = v_organization_id
          and purchase_order_id = p_order_id
     ), 0)
   where organization_id = v_organization_id
     and id = p_order_id;
end;
$$;

create or replace function public.cargo_save_request_orders(
  p_request_id uuid,
  p_order_ids uuid[]
) returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_organization_id uuid;
  v_request_status text;
  v_old_order_ids uuid[];
  v_shipment_id uuid;
begin
  select organization_id, status
    into v_organization_id, v_request_status
    from public.cargo_transport_requests
   where id = p_request_id
   for update;

  if v_organization_id is null then
    raise exception 'Solicitud no encontrada o sin permiso.';
  end if;

  if coalesce(array_length(p_order_ids, 1), 0) <> (
    select count(distinct order_id)
      from unnest(coalesce(p_order_ids, '{}'::uuid[])) as order_id
  ) then
    raise exception 'La selección contiene pedidos repetidos.';
  end if;

  if exists (
    select 1
      from unnest(coalesce(p_order_ids, '{}'::uuid[])) as selected(order_id)
      left join public.cargo_purchase_orders po
        on po.id = selected.order_id
       and po.organization_id = v_organization_id
     where po.id is null
  ) then
    raise exception 'Hay pedidos que no existen o pertenecen a otra organización.';
  end if;

  select coalesce(array_agg(purchase_order_id), '{}'::uuid[])
    into v_old_order_ids
    from public.cargo_transport_request_orders
   where organization_id = v_organization_id
     and transport_request_id = p_request_id;

  delete from public.cargo_transport_request_orders
   where organization_id = v_organization_id
     and transport_request_id = p_request_id;

  insert into public.cargo_transport_request_orders (
    organization_id,
    transport_request_id,
    purchase_order_id
  )
  select v_organization_id, p_request_id, selected.order_id
    from unnest(coalesce(p_order_ids, '{}'::uuid[])) as selected(order_id);

  update public.cargo_transport_requests
     set status = case
       when status = 'booked' then 'booked'
       when coalesce(array_length(p_order_ids, 1), 0) = 0 then 'draft'
       else 'requested'
     end
   where organization_id = v_organization_id
     and id = p_request_id;

  update public.cargo_purchase_orders po
     set status = case when v_request_status = 'booked' then 'booked' else 'requested' end
   where po.organization_id = v_organization_id
     and po.id = any(coalesce(p_order_ids, '{}'::uuid[]))
     and po.status not in ('in_transit', 'delivered', 'cancelled', 'archived');

  update public.cargo_purchase_orders po
     set status = case
       when exists (
         select 1
           from public.cargo_transport_request_orders tro
           join public.cargo_transport_requests tr
             on tr.organization_id = tro.organization_id
            and tr.id = tro.transport_request_id
          where tro.organization_id = v_organization_id
            and tro.purchase_order_id = po.id
            and tr.status = 'booked'
       ) then 'booked'
       when exists (
         select 1
           from public.cargo_transport_request_orders tro
          where tro.organization_id = v_organization_id
            and tro.purchase_order_id = po.id
       ) then 'requested'
       else 'ready'
     end
   where po.organization_id = v_organization_id
     and po.id = any(v_old_order_ids)
     and not (po.id = any(coalesce(p_order_ids, '{}'::uuid[])))
     and po.status in ('requested', 'booked');

  select id
    into v_shipment_id
    from public.cargo_shipments
   where organization_id = v_organization_id
     and transport_request_id = p_request_id
   limit 1;

  if v_shipment_id is not null then
    delete from public.cargo_shipment_lines
     where organization_id = v_organization_id
       and shipment_id = v_shipment_id;

    insert into public.cargo_shipment_lines (
      organization_id,
      shipment_id,
      purchase_order_line_id,
      quantity
    )
    select
      v_organization_id,
      v_shipment_id,
      pol.id,
      pol.quantity
    from public.cargo_transport_request_orders tro
    join public.cargo_purchase_order_lines pol
      on pol.organization_id = tro.organization_id
     and pol.purchase_order_id = tro.purchase_order_id
    where tro.organization_id = v_organization_id
      and tro.transport_request_id = p_request_id;
  end if;
end;
$$;

create or replace function public.cargo_confirm_request(
  p_request_id uuid,
  p_booking_reference text,
  p_shipment_number text
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_request public.cargo_transport_requests%rowtype;
  v_vessel public.cargo_upcoming_vessels%rowtype;
  v_shipment_id uuid;
begin
  if nullif(trim(p_booking_reference), '') is null then
    raise exception 'La referencia de booking es obligatoria.';
  end if;
  if nullif(trim(p_shipment_number), '') is null then
    raise exception 'El número de envío es obligatorio.';
  end if;

  select *
    into v_request
    from public.cargo_transport_requests
   where id = p_request_id
   for update;

  if v_request.id is null then
    raise exception 'Solicitud no encontrada o sin permiso.';
  end if;

  if not exists (
    select 1
      from public.cargo_transport_request_orders
     where organization_id = v_request.organization_id
       and transport_request_id = p_request_id
  ) then
    raise exception 'Añade al menos un pedido antes de confirmar la solicitud.';
  end if;

  if v_request.vessel_id is not null then
    select *
      into v_vessel
      from public.cargo_upcoming_vessels
     where organization_id = v_request.organization_id
       and id = v_request.vessel_id;
  end if;

  select id
    into v_shipment_id
    from public.cargo_shipments
   where organization_id = v_request.organization_id
     and transport_request_id = p_request_id
   for update;

  if v_shipment_id is null then
    insert into public.cargo_shipments (
      organization_id,
      shipment_number,
      transport_request_id,
      forwarder_id,
      vessel_id,
      mode,
      status,
      tracking_reference,
      origin,
      destination,
      departure_at,
      initial_arrival_at,
      estimated_arrival_at,
      transport_name,
      source
    ) values (
      v_request.organization_id,
      trim(p_shipment_number),
      p_request_id,
      v_request.forwarder_id,
      v_request.vessel_id,
      v_request.mode,
      'booked',
      trim(p_booking_reference),
      v_request.origin,
      v_request.destination,
      v_vessel.etd::timestamptz,
      v_vessel.eta::timestamptz,
      v_vessel.eta::timestamptz,
      v_vessel.vessel_name,
      'transport_request'
    ) returning id into v_shipment_id;
  else
    update public.cargo_shipments
       set shipment_number = trim(p_shipment_number),
           forwarder_id = v_request.forwarder_id,
           vessel_id = v_request.vessel_id,
           mode = v_request.mode,
           status = 'booked',
           tracking_reference = trim(p_booking_reference),
           origin = v_request.origin,
           destination = v_request.destination,
           departure_at = coalesce(v_vessel.etd::timestamptz, departure_at),
           initial_arrival_at = coalesce(initial_arrival_at, v_vessel.eta::timestamptz),
           estimated_arrival_at = coalesce(v_vessel.eta::timestamptz, estimated_arrival_at),
           transport_name = coalesce(v_vessel.vessel_name, transport_name),
           source = 'transport_request'
     where organization_id = v_request.organization_id
       and id = v_shipment_id;
  end if;

  update public.cargo_transport_requests
     set status = 'booked',
         booking_reference = trim(p_booking_reference)
   where organization_id = v_request.organization_id
     and id = p_request_id;

  update public.cargo_purchase_orders po
     set status = 'booked'
   where po.organization_id = v_request.organization_id
     and po.id in (
       select tro.purchase_order_id
         from public.cargo_transport_request_orders tro
        where tro.organization_id = v_request.organization_id
          and tro.transport_request_id = p_request_id
     )
     and po.status not in ('in_transit', 'delivered', 'cancelled', 'archived');

  delete from public.cargo_shipment_lines
   where organization_id = v_request.organization_id
     and shipment_id = v_shipment_id;

  insert into public.cargo_shipment_lines (
    organization_id,
    shipment_id,
    purchase_order_line_id,
    quantity
  )
  select
    v_request.organization_id,
    v_shipment_id,
    pol.id,
    pol.quantity
  from public.cargo_transport_request_orders tro
  join public.cargo_purchase_order_lines pol
    on pol.organization_id = tro.organization_id
   and pol.purchase_order_id = tro.purchase_order_id
  where tro.organization_id = v_request.organization_id
    and tro.transport_request_id = p_request_id;

  return v_shipment_id;
end;
$$;

create or replace function public.cargo_replace_quote_items(
  p_quote_id uuid,
  p_items jsonb
) returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_organization_id uuid;
begin
  if jsonb_typeof(coalesce(p_items, '[]'::jsonb)) <> 'array' then
    raise exception 'Los conceptos deben enviarse como una lista.';
  end if;

  select organization_id
    into v_organization_id
    from public.cargo_quotes
   where id = p_quote_id
   for update;

  if v_organization_id is null then
    raise exception 'Cotización no encontrada o sin permiso.';
  end if;

  if exists (
    select 1
      from jsonb_to_recordset(coalesce(p_items, '[]'::jsonb)) as x(
        concept text,
        amount numeric,
        cost_block text,
        presentation text,
        currency text,
        calculation_unit text,
        equipment text,
        minimum_amount numeric,
        percentage numeric,
        free_days integer,
        included boolean,
        notes text
      )
     where nullif(trim(x.concept), '') is null
        or coalesce(x.amount, 0) < 0
        or x.cost_block not in ('origin', 'freight', 'destination')
        or x.presentation not in ('detail', 'flat_rate')
  ) then
    raise exception 'Hay conceptos de cotización no válidos.';
  end if;

  delete from public.cargo_quote_items
   where organization_id = v_organization_id
     and quote_id = p_quote_id;

  insert into public.cargo_quote_items (
    organization_id,
    quote_id,
    concept,
    amount,
    cost_block,
    presentation,
    currency,
    calculation_unit,
    equipment,
    minimum_amount,
    percentage,
    free_days,
    included,
    notes
  )
  select
    v_organization_id,
    p_quote_id,
    trim(x.concept),
    coalesce(x.amount, 0),
    x.cost_block,
    x.presentation,
    nullif(trim(x.currency), ''),
    nullif(trim(x.calculation_unit), ''),
    nullif(trim(x.equipment), ''),
    x.minimum_amount,
    x.percentage,
    x.free_days,
    coalesce(x.included, false),
    nullif(trim(x.notes), '')
  from jsonb_to_recordset(coalesce(p_items, '[]'::jsonb)) as x(
    concept text,
    amount numeric,
    cost_block text,
    presentation text,
    currency text,
    calculation_unit text,
    equipment text,
    minimum_amount numeric,
    percentage numeric,
    free_days integer,
    included boolean,
    notes text
  );

  update public.cargo_quotes
     set total_amount = coalesce((
       select sum(amount)
         from public.cargo_quote_items
        where organization_id = v_organization_id
          and quote_id = p_quote_id
          and included = false
     ), 0)
   where organization_id = v_organization_id
     and id = p_quote_id;
end;
$$;

revoke all on function public.cargo_replace_order_lines(uuid, jsonb) from public, anon;
revoke all on function public.cargo_save_request_orders(uuid, uuid[]) from public, anon;
revoke all on function public.cargo_confirm_request(uuid, text, text) from public, anon;
revoke all on function public.cargo_replace_quote_items(uuid, jsonb) from public, anon;

grant execute on function public.cargo_replace_order_lines(uuid, jsonb) to authenticated;
grant execute on function public.cargo_save_request_orders(uuid, uuid[]) to authenticated;
grant execute on function public.cargo_confirm_request(uuid, text, text) to authenticated;
grant execute on function public.cargo_replace_quote_items(uuid, jsonb) to authenticated;
