-- 기존 테이블 완전 삭제 후 재생성 (데이터 없으면 이걸로)
drop table if exists inquiries cascade;

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  budget text not null,
  region text, -- 관심 권역 (홋카이도 - 리조트형 등)
  company_type text, -- 법인 형태 (GK 단독 등)
  message text, -- 문의 내용
  source text default 'japangolfmna',
  page text default 'GK-vs-KK',
  status text default 'new' check (status in ('new','contacted','nda_sent','closed')),
  created_at timestamp with time zone default now()
);

alter table inquiries enable row level security;

create policy "Allow service_role all" on inquiries
  for all using (true) with check (true);

create index idx_inquiries_created_at on inquiries(created_at desc);
create index idx_inquiries_email on inquiries(email);

-- PostgREST 스키마 캐시 강제 리로드 (중요!)
NOTIFY pgrst, 'reload schema';

-- 확인
select column_name, data_type from information_schema.columns where table_name='inquiries' order by ordinal_position;
