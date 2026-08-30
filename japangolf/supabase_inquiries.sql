-- Supabase SQL Editor에서 실행
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  budget text not null,
  region text,
  source text default 'japangolfmna',
  page text default 'GK-vs-KK',
  status text default 'new' check (status in ('new','contacted','nda_sent','closed')),
  created_at timestamp with time zone default now()
);

alter table inquiries enable row level security;

drop policy if exists "Allow service_role insert" on inquiries;
drop policy if exists "Allow service_role read" on inquiries;

create policy "Allow service_role insert" on inquiries
  for insert with check (true);

create policy "Allow service_role read" on inquiries
  for select using (true);

create index if not exists idx_inquiries_created_at on inquiries(created_at desc);
create index if not exists idx_inquiries_status on inquiries(status);
