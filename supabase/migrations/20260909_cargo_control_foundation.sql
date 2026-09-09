-- Cargo Control: multi-tenant operational model and private document storage.
-- Safe to run repeatedly: objects are created conditionally and policies/triggers are replaced.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table if not exists public.cargo_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cargo_organization_members (
  organization_id uuid not null references public.cargo_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create or replace function private.cargo_is_member(target_organization_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.cargo_organization_members m where m.organization_id = target_organization_id and m.user_id = (select auth.uid())) $$;
revoke all on function private.cargo_is_member(uuid) from public, anon;
grant execute on function private.cargo_is_member(uuid) to authenticated;

create or replace function private.cargo_can_manage(target_organization_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.cargo_organization_members m where m.organization_id = target_organization_id and m.user_id = (select auth.uid()) and m.role in ('owner','admin')) $$;
revoke all on function private.cargo_can_manage(uuid) from public, anon;
grant execute on function private.cargo_can_manage(uuid) to authenticated;

create or replace function private.cargo_path_organization(object_name text)
returns uuid language plpgsql immutable set search_path = ''
as $$ begin return split_part(object_name, '/', 1)::uuid; exception when invalid_text_representation then return null; end $$;
revoke all on function private.cargo_path_organization(text) from public, anon;
grant execute on function private.cargo_path_organization(text) to authenticated;

create table if not exists public.cargo_suppliers (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.cargo_organizations(id) on delete cascade,
  name text not null, code text, contact_name text, email text, phone text, country text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (organization_id, id), unique (organization_id, code)
);
create table if not exists public.cargo_forwarders (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.cargo_organizations(id) on delete cascade,
  name text not null, code text, contact_name text, email text, phone text, modes text[] not null default '{}', notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (organization_id, id), unique (organization_id, code)
);
create table if not exists public.cargo_purchase_orders (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.cargo_organizations(id) on delete cascade,
  order_number text not null, supplier_id uuid, status text not null default 'draft' check (status in ('draft','confirmed','in_production','ready','in_transit','delivered','cancelled')),
  order_date date, ready_date date, currency text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'), total_amount numeric(15,2) not null default 0 check (total_amount >= 0), notes text,
  created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (organization_id, id), unique (organization_id, order_number),
  foreign key (organization_id, supplier_id) references public.cargo_suppliers(organization_id, id)
);
create table if not exists public.cargo_purchase_order_lines (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null, purchase_order_id uuid not null,
  line_number integer not null check (line_number > 0), sku text, description text not null,
  quantity numeric(15,3) not null check (quantity > 0), unit text, unit_price numeric(15,4) not null default 0 check (unit_price >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (organization_id, id), unique (purchase_order_id, line_number),
  foreign key (organization_id, purchase_order_id) references public.cargo_purchase_orders(organization_id, id) on delete cascade
);
create table if not exists public.cargo_upcoming_vessels (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.cargo_organizations(id) on delete cascade,
  vessel_name text not null, voyage_number text, carrier text, origin_port text not null, destination_port text not null,
  etd date, eta date, cutoff_at timestamptz, status text not null default 'scheduled' check (status in ('scheduled','open','closed','departed','arrived','cancelled')),
  notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (organization_id, id)
);
create table if not exists public.cargo_transport_requests (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.cargo_organizations(id) on delete cascade,
  request_number text not null, mode text not null check (mode in ('sea','air','road')), status text not null default 'draft' check (status in ('draft','requested','quoted','approved','booked','cancelled')),
  origin text, destination text, requested_pickup_date date, requested_delivery_date date, notes text,
  created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (organization_id, id), unique (organization_id, request_number)
);
create table if not exists public.cargo_transport_request_orders (
  organization_id uuid not null, transport_request_id uuid not null, purchase_order_id uuid not null, created_at timestamptz not null default now(),
  primary key (transport_request_id, purchase_order_id),
  foreign key (organization_id, transport_request_id) references public.cargo_transport_requests(organization_id, id) on delete cascade,
  foreign key (organization_id, purchase_order_id) references public.cargo_purchase_orders(organization_id, id) on delete cascade
);
create table if not exists public.cargo_shipments (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.cargo_organizations(id) on delete cascade,
  shipment_number text not null, transport_request_id uuid, forwarder_id uuid, vessel_id uuid,
  mode text not null check (mode in ('sea','air','road')), status text not null default 'planned' check (status in ('planned','booked','picked_up','in_transit','customs','delivered','cancelled')),
  tracking_reference text, origin text, destination text, departure_at timestamptz, arrival_at timestamptz, estimated_arrival_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (organization_id, id), unique (organization_id, shipment_number),
  foreign key (organization_id, transport_request_id) references public.cargo_transport_requests(organization_id, id),
  foreign key (organization_id, forwarder_id) references public.cargo_forwarders(organization_id, id),
  foreign key (organization_id, vessel_id) references public.cargo_upcoming_vessels(organization_id, id)
);
create table if not exists public.cargo_quotes (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.cargo_organizations(id) on delete cascade,
  transport_request_id uuid not null, forwarder_id uuid not null, quote_reference text, currency text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  total_amount numeric(15,2) not null default 0 check (total_amount >= 0), valid_until date, status text not null default 'received' check (status in ('received','selected','rejected','expired')),
  notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (organization_id, id),
  foreign key (organization_id, transport_request_id) references public.cargo_transport_requests(organization_id, id) on delete cascade,
  foreign key (organization_id, forwarder_id) references public.cargo_forwarders(organization_id, id)
);
create table if not exists public.cargo_quote_items (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null, quote_id uuid not null, concept text not null,
  amount numeric(15,2) not null check (amount >= 0), notes text, created_at timestamptz not null default now(), unique (organization_id, id),
  foreign key (organization_id, quote_id) references public.cargo_quotes(organization_id, id) on delete cascade
);
create table if not exists public.cargo_documents (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.cargo_organizations(id) on delete cascade,
  storage_path text not null, file_name text not null, mime_type text, size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  entity_type text not null check (entity_type in ('purchase_order','transport_request','shipment','quote','supplier','forwarder')),
  entity_id uuid not null, uploaded_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(), unique (organization_id, id), unique (storage_path),
  check (storage_path like organization_id::text || '/%')
);
create table if not exists public.cargo_audit_events (
  id bigint generated always as identity primary key, organization_id uuid not null references public.cargo_organizations(id) on delete restrict,
  table_name text not null, record_id uuid, action text not null check (action in ('INSERT','UPDATE','DELETE')),
  actor_user_id uuid, old_data jsonb, new_data jsonb, created_at timestamptz not null default now()
);

create or replace function private.cargo_touch_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end $$;
revoke all on function private.cargo_touch_updated_at() from public, anon, authenticated;
create or replace function private.cargo_write_audit() returns trigger language plpgsql security definer set search_path = '' as $$
declare org uuid; rid uuid;
begin
  org := case when tg_op = 'DELETE' then old.organization_id else new.organization_id end;
  rid := case when tg_op = 'DELETE' then old.id else new.id end;
  insert into public.cargo_audit_events(organization_id,table_name,record_id,action,actor_user_id,old_data,new_data)
  values(org,tg_table_name,rid,tg_op,(select auth.uid()),case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end);
  return case when tg_op = 'DELETE' then old else new end;
end $$;
revoke all on function private.cargo_write_audit() from public, anon, authenticated;

create or replace function private.cargo_validate_document_entity() returns trigger language plpgsql set search_path = '' as $$
declare valid boolean;
begin
  execute format('select exists(select 1 from public.%I where organization_id = $1 and id = $2)',
    case new.entity_type
      when 'purchase_order' then 'cargo_purchase_orders' when 'transport_request' then 'cargo_transport_requests'
      when 'shipment' then 'cargo_shipments' when 'quote' then 'cargo_quotes'
      when 'supplier' then 'cargo_suppliers' when 'forwarder' then 'cargo_forwarders'
    end) into valid using new.organization_id, new.entity_id;
  if not valid then raise exception 'Document entity must belong to the same organization'; end if;
  return new;
end $$;
revoke all on function private.cargo_validate_document_entity() from public, anon, authenticated;
drop trigger if exists cargo_validate_document_entity on public.cargo_documents;
create trigger cargo_validate_document_entity before insert or update on public.cargo_documents for each row execute function private.cargo_validate_document_entity();

do $$
declare t text;
begin
  foreach t in array array['cargo_organizations','cargo_suppliers','cargo_forwarders','cargo_purchase_orders','cargo_purchase_order_lines','cargo_upcoming_vessels','cargo_transport_requests','cargo_shipments','cargo_quotes'] loop
    execute format('drop trigger if exists cargo_touch on public.%I', t);
    execute format('create trigger cargo_touch before update on public.%I for each row execute function private.cargo_touch_updated_at()', t);
  end loop;
  foreach t in array array['cargo_suppliers','cargo_forwarders','cargo_purchase_orders','cargo_purchase_order_lines','cargo_upcoming_vessels','cargo_transport_requests','cargo_shipments','cargo_quotes','cargo_quote_items','cargo_documents'] loop
    execute format('drop trigger if exists cargo_audit on public.%I', t);
    execute format('create trigger cargo_audit after insert or update or delete on public.%I for each row execute function private.cargo_write_audit()', t);
  end loop;
end $$;

do $$
declare t text;
begin
  foreach t in array array['cargo_organizations','cargo_organization_members','cargo_suppliers','cargo_forwarders','cargo_purchase_orders','cargo_purchase_order_lines','cargo_upcoming_vessels','cargo_transport_requests','cargo_transport_request_orders','cargo_shipments','cargo_quotes','cargo_quote_items','cargo_documents','cargo_audit_events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant select on table public.%I to authenticated', t);
  end loop;
  foreach t in array array['cargo_suppliers','cargo_forwarders','cargo_purchase_orders','cargo_purchase_order_lines','cargo_upcoming_vessels','cargo_transport_requests','cargo_transport_request_orders','cargo_shipments','cargo_quotes','cargo_quote_items','cargo_documents'] loop
    execute format('grant insert, update, delete on table public.%I to authenticated', t);
    execute format('drop policy if exists cargo_org_select on public.%I', t);
    execute format('drop policy if exists cargo_org_insert on public.%I', t);
    execute format('drop policy if exists cargo_org_update on public.%I', t);
    execute format('drop policy if exists cargo_org_delete on public.%I', t);
    execute format('create policy cargo_org_select on public.%I for select to authenticated using ((select private.cargo_is_member(organization_id)))', t);
    execute format('create policy cargo_org_insert on public.%I for insert to authenticated with check ((select private.cargo_is_member(organization_id)))', t);
    execute format('create policy cargo_org_update on public.%I for update to authenticated using ((select private.cargo_is_member(organization_id))) with check ((select private.cargo_is_member(organization_id)))', t);
    execute format('create policy cargo_org_delete on public.%I for delete to authenticated using ((select private.cargo_is_member(organization_id)))', t);
  end loop;
end $$;

drop policy if exists cargo_organizations_select on public.cargo_organizations;
create policy cargo_organizations_select on public.cargo_organizations for select to authenticated using ((select private.cargo_is_member(id)));
drop policy if exists cargo_organizations_update on public.cargo_organizations;
create policy cargo_organizations_update on public.cargo_organizations for update to authenticated using ((select private.cargo_can_manage(id))) with check ((select private.cargo_can_manage(id)));
grant update (name, slug) on public.cargo_organizations to authenticated;

drop policy if exists cargo_members_select on public.cargo_organization_members;
create policy cargo_members_select on public.cargo_organization_members for select to authenticated using ((select private.cargo_is_member(organization_id)));
drop policy if exists cargo_members_manage on public.cargo_organization_members;
create policy cargo_members_manage on public.cargo_organization_members for all to authenticated using ((select private.cargo_can_manage(organization_id))) with check ((select private.cargo_can_manage(organization_id)));
grant insert, update (role), delete on public.cargo_organization_members to authenticated;

drop policy if exists cargo_audit_select on public.cargo_audit_events;
create policy cargo_audit_select on public.cargo_audit_events for select to authenticated using ((select private.cargo_is_member(organization_id)));
revoke insert, update, delete, truncate on public.cargo_audit_events from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cargo-private','cargo-private',false,26214400,array['application/pdf','image/jpeg','image/png','text/csv','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
on conflict (id) do update set name=excluded.name, public=false, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists cargo_private_select on storage.objects;
create policy cargo_private_select on storage.objects for select to authenticated using (bucket_id='cargo-private' and (select private.cargo_is_member(private.cargo_path_organization(name))));
drop policy if exists cargo_private_insert on storage.objects;
create policy cargo_private_insert on storage.objects for insert to authenticated with check (bucket_id='cargo-private' and owner_id=(select auth.uid())::text and (select private.cargo_is_member(private.cargo_path_organization(name))));
drop policy if exists cargo_private_update on storage.objects;
create policy cargo_private_update on storage.objects for update to authenticated using (bucket_id='cargo-private' and (select private.cargo_is_member(private.cargo_path_organization(name)))) with check (bucket_id='cargo-private' and (select private.cargo_is_member(private.cargo_path_organization(name))));
drop policy if exists cargo_private_delete on storage.objects;
create policy cargo_private_delete on storage.objects for delete to authenticated using (bucket_id='cargo-private' and (select private.cargo_is_member(private.cargo_path_organization(name))));

create index if not exists cargo_members_user_idx on public.cargo_organization_members(user_id, organization_id);
create index if not exists cargo_suppliers_org_name_idx on public.cargo_suppliers(organization_id, name);
create index if not exists cargo_forwarders_org_name_idx on public.cargo_forwarders(organization_id, name);
create index if not exists cargo_orders_org_status_date_idx on public.cargo_purchase_orders(organization_id, status, order_date desc);
create index if not exists cargo_order_lines_order_idx on public.cargo_purchase_order_lines(organization_id, purchase_order_id);
create index if not exists cargo_vessels_org_eta_idx on public.cargo_upcoming_vessels(organization_id, eta);
create index if not exists cargo_requests_org_status_date_idx on public.cargo_transport_requests(organization_id, status, requested_pickup_date);
create index if not exists cargo_request_orders_org_idx on public.cargo_transport_request_orders(organization_id, transport_request_id);
create index if not exists cargo_shipments_org_status_eta_idx on public.cargo_shipments(organization_id, status, estimated_arrival_at);
create index if not exists cargo_quotes_request_idx on public.cargo_quotes(organization_id, transport_request_id, status);
create index if not exists cargo_quote_items_quote_idx on public.cargo_quote_items(organization_id, quote_id);
create index if not exists cargo_documents_entity_idx on public.cargo_documents(organization_id, entity_type, entity_id);
create index if not exists cargo_audit_org_created_idx on public.cargo_audit_events(organization_id, created_at desc);
