create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  primary_stack text not null,
  linkedin_url text,
  location text,
  years_of_experience text,
  english_level text,
  rate text,
  notes text,
  original_cv_file_path text,
  formatted_cv_file_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_candidates_updated_at on public.candidates;
create trigger set_candidates_updated_at
before update on public.candidates
for each row
execute function public.set_updated_at();

alter table public.candidates enable row level security;

drop policy if exists candidates_authenticated_all on public.candidates;
create policy candidates_authenticated_all
on public.candidates
for all
to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
