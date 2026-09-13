-- Importaciones Excel transaccionales para Cargo Control.
-- La función es SECURITY INVOKER: conserva RLS y no eleva privilegios.

alter table public.cargo_purchase_order_lines
  add column if not exists source_line_key text,
  add column if not exists need_date date;

create unique index if not exists cargo_order_lines_source_key_idx
  on public.cargo_purchase_order_lines (purchase_order_id, source_line_key)
  where source_line_key is not null;

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
  select organization_id into v_organization_id
    from public.cargo_purchase_orders where id = p_order_id for update;
  if v_organization_id is null then raise exception 'Pedido no encontrado o sin permiso.'; end if;
  if exists (
    select 1 from jsonb_to_recordset(coalesce(p_lines, '[]'::jsonb)) as x(
      line_number integer, description text, quantity numeric, unit_price numeric
    ) where x.line_number is null or x.line_number <= 0
       or nullif(trim(x.description), '') is null or x.quantity is null
       or x.quantity <= 0 or coalesce(x.unit_price, 0) < 0
  ) then raise exception 'Hay líneas con número, descripción, cantidad o precio no válidos.'; end if;
  if exists (
    select x.line_number from jsonb_to_recordset(coalesce(p_lines, '[]'::jsonb)) as x(line_number integer)
     group by x.line_number having count(*) > 1
  ) then raise exception 'No puede repetirse el número de línea.'; end if;
  delete from public.cargo_purchase_order_lines
   where organization_id = v_organization_id and purchase_order_id = p_order_id;
  insert into public.cargo_purchase_order_lines (
    organization_id, purchase_order_id, line_number, source_line_key, sku,
    description, quantity, unit, unit_price, need_date
  )
  select v_organization_id, p_order_id, x.line_number,
    nullif(trim(x.source_line_key), ''), nullif(trim(x.sku), ''), trim(x.description),
    x.quantity, nullif(trim(x.unit), ''), coalesce(x.unit_price, 0), x.need_date
  from jsonb_to_recordset(coalesce(p_lines, '[]'::jsonb)) as x(
    line_number integer, source_line_key text, sku text, description text,
    quantity numeric, unit text, unit_price numeric, need_date date
  );
  update public.cargo_purchase_orders set total_amount = coalesce((
    select sum(quantity * unit_price) from public.cargo_purchase_order_lines
     where organization_id = v_organization_id and purchase_order_id = p_order_id
  ), 0) where organization_id = v_organization_id and id = p_order_id;
end;
$$;

alter table public.cargo_upcoming_vessels
  add column if not exists source_key text;

create unique index if not exists cargo_vessels_source_key_idx
  on public.cargo_upcoming_vessels (organization_id, source_key)
  where source_key is not null;

alter table public.cargo_quotes
  add column if not exists source_key text;

create unique index if not exists cargo_quotes_source_key_idx
  on public.cargo_quotes (organization_id, source_key)
  where source_key is not null;

create or replace function public.cargo_import_excel(
  p_organization_id uuid,
  p_kind text,
  p_payload jsonb
) returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  r jsonb;
  item jsonb;
  v_supplier_id uuid;
  v_forwarder_id uuid;
  v_shipment_id uuid;
  v_order_id uuid;
  v_line_id uuid;
  v_quote_id uuid;
  v_count integer := 0;
  v_detail_count integer := 0;
begin
  if (select auth.uid()) is null then
    raise exception 'Debes iniciar sesión para importar.';
  end if;
  if not (select private.cargo_can_manage(p_organization_id)) then
    raise exception 'No tienes permisos para importar en esta organización.';
  end if;
  if p_kind not in ('general', 'quotes', 'vessels') then
    raise exception 'Tipo de importación no permitido.';
  end if;
  if jsonb_typeof(coalesce(p_payload, '{}'::jsonb)) <> 'object' then
    raise exception 'El contenido de la importación no es válido.';
  end if;

  if p_kind = 'general' then
    if jsonb_array_length(coalesce(p_payload->'shipments', '[]'::jsonb)) > 500
       or jsonb_array_length(coalesce(p_payload->'lines', '[]'::jsonb)) > 3000 then
      raise exception 'El fichero supera el máximo de 500 envíos o 3.000 líneas.';
    end if;

    for r in select value from jsonb_array_elements(coalesce(p_payload->'shipments', '[]'::jsonb)) loop
      v_supplier_id := null;
      if nullif(trim(r->>'supplier_name'), '') is not null then
        select id into v_supplier_id
          from public.cargo_suppliers
         where organization_id = p_organization_id
           and lower(name) = lower(trim(r->>'supplier_name'))
         order by created_at
         limit 1;
        if v_supplier_id is null then
          insert into public.cargo_suppliers (organization_id, name, active)
          values (p_organization_id, trim(r->>'supplier_name'), true)
          returning id into v_supplier_id;
        end if;
      end if;

      insert into public.cargo_shipments (
        organization_id, shipment_number, mode, status, tracking_reference,
        transport_name, imo, origin, destination, departure_at,
        initial_arrival_at, estimated_arrival_at, destination_days,
        tracking_url, notes, source
      ) values (
        p_organization_id, trim(r->>'shipment_number'), r->>'mode', r->>'status',
        nullif(trim(r->>'tracking_reference'), ''), nullif(trim(r->>'transport_name'), ''),
        nullif(trim(r->>'imo'), ''), nullif(trim(r->>'origin'), ''),
        nullif(trim(r->>'destination'), ''), nullif(r->>'departure_at', '')::timestamptz,
        nullif(r->>'initial_arrival_at', '')::timestamptz,
        nullif(r->>'estimated_arrival_at', '')::timestamptz,
        coalesce((r->>'destination_days')::integer, 0), nullif(trim(r->>'tracking_url'), ''),
        nullif(trim(r->>'notes'), ''), 'Excel'
      )
      on conflict (organization_id, shipment_number) do update set
        mode = excluded.mode, status = excluded.status,
        tracking_reference = excluded.tracking_reference, transport_name = excluded.transport_name,
        imo = excluded.imo, origin = excluded.origin, destination = excluded.destination,
        departure_at = excluded.departure_at, initial_arrival_at = excluded.initial_arrival_at,
        estimated_arrival_at = excluded.estimated_arrival_at,
        destination_days = excluded.destination_days, tracking_url = excluded.tracking_url,
        notes = excluded.notes, source = excluded.source
      returning id into v_shipment_id;
      v_count := v_count + 1;
    end loop;

    for r in select value from jsonb_array_elements(coalesce(p_payload->'lines', '[]'::jsonb)) loop
      select id into v_shipment_id
        from public.cargo_shipments
       where organization_id = p_organization_id
         and shipment_number = trim(r->>'shipment_number');
      if v_shipment_id is null then
        raise exception 'La línea % apunta a un envío inexistente.', r->>'source_line_key';
      end if;

      select s.id into v_supplier_id
        from public.cargo_suppliers s
       where s.organization_id = p_organization_id
         and lower(s.name) = lower(coalesce(r->>'supplier_name', ''))
       order by s.created_at limit 1;

      insert into public.cargo_purchase_orders (
        organization_id, order_number, supplier_id, status, origin, ready_date, created_by
      ) values (
        p_organization_id, trim(r->>'order_number'), v_supplier_id, 'in_transit',
        nullif(trim(r->>'origin'), ''), nullif(r->>'need_date', '')::date, (select auth.uid())
      )
      on conflict (organization_id, order_number) do update set
        supplier_id = coalesce(excluded.supplier_id, cargo_purchase_orders.supplier_id),
        origin = coalesce(excluded.origin, cargo_purchase_orders.origin)
      returning id into v_order_id;

      select id into v_line_id
        from public.cargo_purchase_order_lines
       where organization_id = p_organization_id
         and purchase_order_id = v_order_id
         and source_line_key = trim(r->>'source_line_key');
      if v_line_id is null then
        insert into public.cargo_purchase_order_lines (
          organization_id, purchase_order_id, line_number, source_line_key,
          sku, description, quantity, unit, unit_price, need_date
        ) values (
          p_organization_id, v_order_id, coalesce((
            select max(line_number) + 1 from public.cargo_purchase_order_lines
             where organization_id = p_organization_id and purchase_order_id = v_order_id
          ), 1), trim(r->>'source_line_key'), nullif(trim(r->>'sku'), ''),
          trim(r->>'description'), (r->>'quantity')::numeric,
          nullif(trim(r->>'unit'), ''), 0, nullif(r->>'need_date', '')::date
        ) returning id into v_line_id;
      else
        update public.cargo_purchase_order_lines set
          sku = nullif(trim(r->>'sku'), ''), description = trim(r->>'description'),
          quantity = (r->>'quantity')::numeric, unit = nullif(trim(r->>'unit'), ''),
          need_date = nullif(r->>'need_date', '')::date
         where organization_id = p_organization_id and id = v_line_id;
      end if;

      insert into public.cargo_shipment_lines (
        organization_id, shipment_id, purchase_order_line_id, quantity
      ) values (p_organization_id, v_shipment_id, v_line_id, (r->>'quantity')::numeric)
      on conflict (shipment_id, purchase_order_line_id) do update set quantity = excluded.quantity;
      v_detail_count := v_detail_count + 1;
    end loop;

  elsif p_kind = 'vessels' then
    if jsonb_array_length(coalesce(p_payload->'vessels', '[]'::jsonb)) > 1000 then
      raise exception 'El fichero supera el máximo de 1.000 barcos.';
    end if;
    for r in select value from jsonb_array_elements(coalesce(p_payload->'vessels', '[]'::jsonb)) loop
      v_forwarder_id := null;
      if nullif(trim(r->>'forwarder_name'), '') is not null then
        select id into v_forwarder_id from public.cargo_forwarders
         where organization_id = p_organization_id and lower(name) = lower(trim(r->>'forwarder_name'))
         order by created_at limit 1;
        if v_forwarder_id is null then
          insert into public.cargo_forwarders (organization_id, name, modes, active)
          values (p_organization_id, trim(r->>'forwarder_name'), array['sea'], true)
          returning id into v_forwarder_id;
        end if;
      end if;
      insert into public.cargo_upcoming_vessels (
        organization_id, source_key, vessel_name, voyage_number, carrier,
        origin_port, destination_port, service, routing, etd, eta,
        transit_days, frequency, forwarder_id, status, notes
      ) values (
        p_organization_id, trim(r->>'source_key'), trim(r->>'vessel_name'),
        nullif(trim(r->>'voyage_number'), ''), nullif(trim(r->>'carrier'), ''),
        trim(r->>'origin_port'), trim(r->>'destination_port'), nullif(trim(r->>'service'), ''),
        nullif(trim(r->>'routing'), ''), nullif(r->>'etd', '')::date,
        nullif(r->>'eta', '')::date, nullif(r->>'transit_days', '')::integer,
        nullif(trim(r->>'frequency'), ''), v_forwarder_id, r->>'status', nullif(trim(r->>'notes'), '')
      )
      on conflict (organization_id, source_key) where source_key is not null do update set
        vessel_name = excluded.vessel_name, voyage_number = excluded.voyage_number,
        carrier = excluded.carrier, origin_port = excluded.origin_port,
        destination_port = excluded.destination_port, service = excluded.service,
        routing = excluded.routing, etd = excluded.etd, eta = excluded.eta,
        transit_days = excluded.transit_days, frequency = excluded.frequency,
        forwarder_id = excluded.forwarder_id, status = excluded.status, notes = excluded.notes;
      v_count := v_count + 1;
    end loop;

  else
    if jsonb_array_length(coalesce(p_payload->'quotes', '[]'::jsonb)) > 1000
       or jsonb_array_length(coalesce(p_payload->'items', '[]'::jsonb)) > 5000 then
      raise exception 'El fichero supera el máximo de 1.000 cotizaciones o 5.000 conceptos.';
    end if;
    for r in select value from jsonb_array_elements(coalesce(p_payload->'forwarders', '[]'::jsonb)) loop
      select id into v_forwarder_id from public.cargo_forwarders
       where organization_id = p_organization_id and lower(name) = lower(trim(r->>'name'))
       order by created_at limit 1;
      if v_forwarder_id is null then
        insert into public.cargo_forwarders (
          organization_id, code, name, contact_name, email, phone, country, active, notes
        ) values (
          p_organization_id, nullif(trim(r->>'code'), ''), trim(r->>'name'),
          nullif(trim(r->>'contact_name'), ''), nullif(trim(r->>'email'), ''),
          nullif(trim(r->>'phone'), ''), nullif(trim(r->>'country'), ''),
          coalesce((r->>'active')::boolean, true), nullif(trim(r->>'notes'), '')
        ) returning id into v_forwarder_id;
      else
        update public.cargo_forwarders set
          contact_name = coalesce(nullif(trim(r->>'contact_name'), ''), contact_name),
          email = coalesce(nullif(trim(r->>'email'), ''), email),
          phone = coalesce(nullif(trim(r->>'phone'), ''), phone),
          country = coalesce(nullif(trim(r->>'country'), ''), country),
          active = coalesce((r->>'active')::boolean, active),
          notes = coalesce(nullif(trim(r->>'notes'), ''), notes)
        where organization_id = p_organization_id and id = v_forwarder_id;
      end if;
    end loop;

    for r in select value from jsonb_array_elements(coalesce(p_payload->'quotes', '[]'::jsonb)) loop
      select id into v_forwarder_id from public.cargo_forwarders
       where organization_id = p_organization_id and lower(name) = lower(trim(r->>'forwarder_name'))
       order by created_at limit 1;
      if v_forwarder_id is null then
        insert into public.cargo_forwarders (organization_id, name, modes, active)
        values (p_organization_id, trim(r->>'forwarder_name'), array[r->>'mode'], true)
        returning id into v_forwarder_id;
      end if;

      insert into public.cargo_quotes (
        organization_id, source_key, forwarder_id, quote_reference, mode,
        service_type, origin, destination, incoterm, valid_from, valid_until,
        equipment, transit_days, frequency, currency, status, contact,
        forwarder_reference, notes
      ) values (
        p_organization_id, trim(r->>'source_key'), v_forwarder_id,
        nullif(trim(r->>'quote_reference'), ''), r->>'mode', nullif(trim(r->>'service_type'), ''),
        nullif(trim(r->>'origin'), ''), nullif(trim(r->>'destination'), ''),
        nullif(trim(r->>'incoterm'), ''), nullif(r->>'valid_from', '')::date,
        nullif(r->>'valid_until', '')::date, nullif(trim(r->>'equipment'), ''),
        nullif(r->>'transit_days', '')::integer, nullif(trim(r->>'frequency'), ''),
        coalesce(nullif(trim(r->>'currency'), ''), 'EUR'), r->>'status',
        nullif(trim(r->>'contact'), ''), nullif(trim(r->>'forwarder_reference'), ''),
        nullif(trim(r->>'notes'), '')
      )
      on conflict (organization_id, source_key) where source_key is not null do update set
        forwarder_id = excluded.forwarder_id, quote_reference = excluded.quote_reference,
        mode = excluded.mode, service_type = excluded.service_type, origin = excluded.origin,
        destination = excluded.destination, incoterm = excluded.incoterm,
        valid_from = excluded.valid_from, valid_until = excluded.valid_until,
        equipment = excluded.equipment, transit_days = excluded.transit_days,
        frequency = excluded.frequency, currency = excluded.currency,
        status = excluded.status, contact = excluded.contact,
        forwarder_reference = excluded.forwarder_reference, notes = excluded.notes
      returning id into v_quote_id;

      delete from public.cargo_quote_items
       where organization_id = p_organization_id and quote_id = v_quote_id;
      for item in select value from jsonb_array_elements(coalesce(p_payload->'items', '[]'::jsonb))
                   where value->>'quote_source_key' = r->>'source_key' loop
        insert into public.cargo_quote_items (
          organization_id, quote_id, concept, amount, cost_block, presentation,
          currency, calculation_unit, equipment, minimum_amount, percentage,
          free_days, included, notes
        ) values (
          p_organization_id, v_quote_id, trim(item->>'concept'),
          coalesce((item->>'amount')::numeric, 0), item->>'cost_block', item->>'presentation',
          nullif(trim(item->>'currency'), ''), nullif(trim(item->>'calculation_unit'), ''),
          nullif(trim(item->>'equipment'), ''), nullif(item->>'minimum_amount', '')::numeric,
          nullif(item->>'percentage', '')::numeric, nullif(item->>'free_days', '')::integer,
          coalesce((item->>'included')::boolean, false), nullif(trim(item->>'notes'), '')
        );
        v_detail_count := v_detail_count + 1;
      end loop;
      update public.cargo_quotes q set total_amount = coalesce((
        select sum(i.amount) from public.cargo_quote_items i
         where i.organization_id = p_organization_id and i.quote_id = v_quote_id
           and i.included = false and upper(coalesce(i.currency, q.currency)) = upper(q.currency)
      ), 0) where q.organization_id = p_organization_id and q.id = v_quote_id;
      v_count := v_count + 1;
    end loop;
  end if;

  return jsonb_build_object('kind', p_kind, 'records', v_count, 'details', v_detail_count);
end;
$$;

revoke all on function public.cargo_import_excel(uuid, text, jsonb) from public, anon;
grant execute on function public.cargo_import_excel(uuid, text, jsonb) to authenticated;
