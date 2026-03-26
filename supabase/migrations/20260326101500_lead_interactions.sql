create table if not exists public.lead_interactions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  created_via text not null check (created_via in ('app'))
);

create index if not exists lead_interactions_lead_id_created_at_idx
  on public.lead_interactions (lead_id, created_at desc);

alter table public.lead_interactions enable row level security;

drop policy if exists lead_interactions_authenticated_all on public.lead_interactions;
create policy lead_interactions_authenticated_all
on public.lead_interactions
for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
