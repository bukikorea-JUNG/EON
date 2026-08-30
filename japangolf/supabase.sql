-- Japangolfmna 전용 inquiries 테이블 (Gmail + Supabase 하이브리드)
drop table if exists inquiries cascade;

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  budget text,
  region text, -- 관심 권역
  company_type text, -- GK 단독 / GK-TK 등
  message text, -- 문의 내용
  email_sent boolean default false,
  email_error text,
  source text default 'japangolfmna',
  page text default 'GK-vs-KK',
  status text default 'new' check (status in ('new','contacted','nda_sent','closed')),
  created_at timestamp with time zone default now()
);

alter table inquiries enable row level security;

-- service_role이 모든 작업 가능
create policy "Allow service_role all" on inquiries
  for all using (true) with check (true);

create index idx_inquiries_created_at on inquiries(created_at desc);
create index idx_inquiries_email_sent on inquiries(email_sent);

-- 스키마 캐시 리로드 (중요!)
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- 확인
select column_name, data_type from information_schema.columns where table_name='inquiries' order by ordinal_position;
