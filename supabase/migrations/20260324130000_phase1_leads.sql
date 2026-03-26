create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text not null,
  role_title text,
  location text,
  linkedin_profile_url text,
  linkedin_profile_url_normalized text,
  status text not null check (
    status in (
      'Radar',
      'Connection Sent',
      'Connected',
      'Message Sent',
      'Conversation',
      'Interested',
      'Future Contact',
      'Ignored',
      'Rejected',
      'Not Interested'
    )
  ),
  hiring_flag boolean not null default false,
  notes text,
  next_action text,
  follow_up_date date,
  date_added timestamptz not null default now(),
  last_interaction_date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_status_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  previous_status text,
  new_status text not null,
  changed_at timestamptz not null default now(),
  changed_via text not null check (changed_via in ('app', 'extension'))
);

create index if not exists leads_company_name_idx on public.leads (company_name);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_hiring_flag_idx on public.leads (hiring_flag);
create index if not exists leads_last_interaction_idx on public.leads (last_interaction_date desc);
create unique index if not exists leads_linkedin_profile_url_normalized_uq
  on public.leads (linkedin_profile_url_normalized)
  where linkedin_profile_url_normalized is not null;

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.leads enable row level security;
alter table public.lead_status_history enable row level security;

drop policy if exists leads_authenticated_all on public.leads;
create policy leads_authenticated_all
on public.leads
for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists lead_status_history_authenticated_all on public.lead_status_history;
create policy lead_status_history_authenticated_all
on public.lead_status_history
for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create or replace function public.update_lead_status(
  p_lead_id uuid,
  p_new_status text,
  p_changed_via text
)
returns public.leads
language plpgsql
security invoker
as $$
declare
  current_lead public.leads;
  updated_lead public.leads;
begin
  if p_new_status not in (
    'Radar',
    'Connection Sent',
    'Connected',
    'Message Sent',
    'Conversation',
    'Interested',
    'Future Contact',
    'Ignored',
    'Rejected',
    'Not Interested'
  ) then
    raise exception 'Invalid lead status.';
  end if;

  if p_changed_via not in ('app', 'extension') then
    raise exception 'Invalid changed_via value.';
  end if;

  select *
  into current_lead
  from public.leads
  where id = p_lead_id
  for update;

  if not found then
    raise exception 'Lead not found.';
  end if;

  if current_lead.status = p_new_status then
    return current_lead;
  end if;

  update public.leads
  set
    status = p_new_status,
    last_interaction_date = now()
  where id = p_lead_id
  returning * into updated_lead;

  insert into public.lead_status_history (
    lead_id,
    previous_status,
    new_status,
    changed_via
  )
  values (
    p_lead_id,
    current_lead.status,
    p_new_status,
    p_changed_via
  );

  return updated_lead;
end;
$$;

grant execute on function public.update_lead_status(uuid, text, text) to authenticated;
