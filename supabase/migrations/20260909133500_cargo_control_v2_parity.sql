-- Cargo Control V2: paridad funcional con la versión 12 de la herramienta.
-- Amplía el modelo ya desplegado sin borrar datos existentes.

alter table public.cargo_suppliers
  add column if not exists city text,
  add column if not exists incoterm text,
  add column if not exists preferred_port text,
  add column if not exists preparation_days integer not null default 0,
  add column if not exists active boolean not null default true;
alter table public.cargo_suppliers drop constraint if exists cargo_suppliers_preparation_days_check;
alter table public.cargo_suppliers add constraint cargo_suppliers_preparation_days_check check (preparation_days between 0 and 365);

alter table public.cargo_forwarders
  add column if not exists country text,
  add column if not exists active boolean not null default true;

alter table public.cargo_purchase_orders
  add column if not exists origin text;
alter table public.cargo_purchase_orders drop constraint if exists cargo_purchase_orders_status_check;
alter table public.cargo_purchase_orders add constraint cargo_purchase_orders_status_check
  check (status in ('draft','confirmed','in_production','ready','requested','booked','in_transit','delivered','cancelled','archived'));

alter table public.cargo_upcoming_vessels
  add column if not exists service text,
  add column if not exists routing text,
  add column if not exists transit_days integer,
  add column if not exists frequency text,
  add column if not exists forwarder_id uuid;
alter table public.cargo_upcoming_vessels drop constraint if exists cargo_upcoming_vessels_transit_days_check;
alter table public.cargo_upcoming_vessels add constraint cargo_upcoming_vessels_transit_days_check check (transit_days is null or transit_days between 0 and 180);
alter table public.cargo_upcoming_vessels drop constraint if exists cargo_upcoming_vessels_forwarder_fkey;
alter table public.cargo_upcoming_vessels add constraint cargo_upcoming_vessels_forwarder_fkey
  foreign key (organization_id, forwarder_id) references public.cargo_forwarders(organization_id, id);

alter table public.cargo_transport_requests
  add column if not exists vessel_id uuid,
  add column if not exists forwarder_id uuid,
  add column if not exists booking_reference text;
alter table public.cargo_transport_requests drop constraint if exists cargo_transport_requests_vessel_fkey;
alter table public.cargo_transport_requests add constraint cargo_transport_requests_vessel_fkey
  foreign key (organization_id, vessel_id) references public.cargo_upcoming_vessels(organization_id, id);
alter table public.cargo_transport_requests drop constraint if exists cargo_transport_requests_forwarder_fkey;
alter table public.cargo_transport_requests add constraint cargo_transport_requests_forwarder_fkey
  foreign key (organization_id, forwarder_id) references public.cargo_forwarders(organization_id, id);
alter table public.cargo_transport_requests drop constraint if exists cargo_transport_requests_booking_check;
alter table public.cargo_transport_requests add constraint cargo_transport_requests_booking_check
  check (status <> 'booked' or nullif(trim(booking_reference), '') is not null);

alter table public.cargo_shipments
  add column if not exists transport_name text,
  add column if not exists imo text,
  add column if not exists initial_arrival_at timestamptz,
  add column if not exists destination_days integer not null default 0,
  add column if not exists tracking_url text,
  add column if not exists notes text,
  add column if not exists source text;
alter table public.cargo_shipments drop constraint if exists cargo_shipments_destination_days_check;
alter table public.cargo_shipments add constraint cargo_shipments_destination_days_check check (destination_days between 0 and 365);
alter table public.cargo_shipments drop constraint if exists cargo_shipments_imo_check;
alter table public.cargo_shipments add constraint cargo_shipments_imo_check check (imo is null or imo ~ '^[0-9]{7}$');

create table if not exists public.cargo_shipment_lines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.cargo_organizations(id) on delete cascade,
  shipment_id uuid not null,
  purchase_order_line_id uuid not null,
  quantity numeric(15,3) not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (shipment_id, purchase_order_line_id),
  foreign key (organization_id, shipment_id) references public.cargo_shipments(organization_id, id) on delete cascade,
  foreign key (organization_id, purchase_order_line_id) references public.cargo_purchase_order_lines(organization_id, id)
);

alter table public.cargo_quotes
  alter column transport_request_id drop not null,
  add column if not exists mode text,
  add column if not exists service_type text,
  add column if not exists origin text,
  add column if not exists destination text,
  add column if not exists incoterm text,
  add column if not exists valid_from date,
  add column if not exists equipment text,
  add column if not exists frequency text,
  add column if not exists transit_days integer,
  add column if not exists contact text,
  add column if not exists forwarder_reference text;
alter table public.cargo_quotes drop constraint if exists cargo_quotes_mode_check;
alter table public.cargo_quotes add constraint cargo_quotes_mode_check check (mode is null or mode in ('sea','air','road'));

alter table public.cargo_quote_items
  add column if not exists cost_block text,
  add column if not exists presentation text,
  add column if not exists currency text,
  add column if not exists calculation_unit text,
  add column if not exists equipment text,
  add column if not exists minimum_amount numeric(15,2),
  add column if not exists percentage numeric(8,4),
  add column if not exists free_days integer,
  add column if not exists included boolean not null default false;
alter table public.cargo_quote_items drop constraint if exists cargo_quote_items_cost_block_check;
alter table public.cargo_quote_items add constraint cargo_quote_items_cost_block_check check (cost_block is null or cost_block in ('origin','freight','destination'));
alter table public.cargo_quote_items drop constraint if exists cargo_quote_items_presentation_check;
alter table public.cargo_quote_items add constraint cargo_quote_items_presentation_check check (presentation is null or presentation in ('detail','flat_rate'));

alter table public.cargo_documents drop constraint if exists cargo_documents_entity_type_check;
alter table public.cargo_documents add constraint cargo_documents_entity_type_check
  check (entity_type in ('purchase_order','transport_request','shipment','quote','supplier','forwarder','upcoming_vessel'));

drop trigger if exists cargo_audit on public.cargo_shipment_lines;
create trigger cargo_audit after insert or update or delete on public.cargo_shipment_lines
  for each row execute function private.cargo_write_audit();

alter table public.cargo_shipment_lines enable row level security;
revoke all on table public.cargo_shipment_lines from anon, authenticated;
grant select, insert, update, delete on table public.cargo_shipment_lines to authenticated;
drop policy if exists cargo_org_select on public.cargo_shipment_lines;
create policy cargo_org_select on public.cargo_shipment_lines for select to authenticated
  using ((select private.cargo_is_member(organization_id)));
drop policy if exists cargo_org_insert on public.cargo_shipment_lines;
create policy cargo_org_insert on public.cargo_shipment_lines for insert to authenticated
  with check ((select private.cargo_is_member(organization_id)));
drop policy if exists cargo_org_update on public.cargo_shipment_lines;
create policy cargo_org_update on public.cargo_shipment_lines for update to authenticated
  using ((select private.cargo_is_member(organization_id)))
  with check ((select private.cargo_is_member(organization_id)));
drop policy if exists cargo_org_delete on public.cargo_shipment_lines;
create policy cargo_org_delete on public.cargo_shipment_lines for delete to authenticated
  using ((select private.cargo_is_member(organization_id)));

create index if not exists cargo_shipment_lines_shipment_idx on public.cargo_shipment_lines(organization_id, shipment_id);
create index if not exists cargo_shipment_lines_order_line_idx on public.cargo_shipment_lines(organization_id, purchase_order_line_id);
create index if not exists cargo_vessels_forwarder_idx on public.cargo_upcoming_vessels(organization_id, forwarder_id);
create index if not exists cargo_requests_vessel_idx on public.cargo_transport_requests(organization_id, vessel_id);
create index if not exists cargo_requests_forwarder_idx on public.cargo_transport_requests(organization_id, forwarder_id);

