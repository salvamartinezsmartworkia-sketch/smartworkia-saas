-- Follow-up indexes and policy split identified by Supabase advisors.
create index if not exists cargo_documents_uploaded_by_idx on public.cargo_documents(uploaded_by);
create index if not exists cargo_orders_created_by_idx on public.cargo_purchase_orders(created_by);
create index if not exists cargo_orders_supplier_idx on public.cargo_purchase_orders(organization_id, supplier_id);
create index if not exists cargo_quotes_forwarder_idx on public.cargo_quotes(organization_id, forwarder_id);
create index if not exists cargo_shipments_forwarder_idx on public.cargo_shipments(organization_id, forwarder_id);
create index if not exists cargo_shipments_request_idx on public.cargo_shipments(organization_id, transport_request_id);
create index if not exists cargo_shipments_vessel_idx on public.cargo_shipments(organization_id, vessel_id);
create index if not exists cargo_request_orders_order_idx on public.cargo_transport_request_orders(organization_id, purchase_order_id);
create index if not exists cargo_requests_created_by_idx on public.cargo_transport_requests(created_by);

drop policy if exists cargo_members_manage on public.cargo_organization_members;
drop policy if exists cargo_members_insert on public.cargo_organization_members;
drop policy if exists cargo_members_update on public.cargo_organization_members;
drop policy if exists cargo_members_delete on public.cargo_organization_members;
create policy cargo_members_insert on public.cargo_organization_members for insert to authenticated
with check ((select private.cargo_can_manage(organization_id)));
create policy cargo_members_update on public.cargo_organization_members for update to authenticated
using ((select private.cargo_can_manage(organization_id))) with check ((select private.cargo_can_manage(organization_id)));
create policy cargo_members_delete on public.cargo_organization_members for delete to authenticated
using ((select private.cargo_can_manage(organization_id)));
