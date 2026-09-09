-- Provision the initial workspace only for existing SmartWorkIA administrators.
with organization as (
  insert into public.cargo_organizations (name, slug)
  values ('SmartWorkIA', 'smartworkia')
  on conflict (slug) do update set name = excluded.name
  returning id
)
insert into public.cargo_organization_members (organization_id, user_id, role)
select organization.id, users.id, 'owner'
from organization
join auth.users users on true
left join public.profiles profiles on profiles.id = users.id
where coalesce(profiles.role, users.raw_app_meta_data ->> 'role') = 'admin'
on conflict (organization_id, user_id) do update set role = 'owner';
