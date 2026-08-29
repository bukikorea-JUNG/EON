
-- 최종 안정 버전 - 소문자 snake_case만 사용 (PGRST204 완전 해결)
drop table if exists inquiries;

create table inquiries (
  id text primary key,
  name text,
  phone text,
  address text,
  pyeong text,
  roof_type text,
  message text,
  page_url text,
  status text default '신규',
  memo text default '',
  kakao_memo text default '',
  email_memo text default '',
  email_sent boolean default false,
  email_error text,
  created_at timestamp with time zone default now(),
  received_at text,
  updated_at timestamp with time zone default now()
);

alter table inquiries disable row level security;

create index if not exists idx_inquiries_created on inquiries(created_at desc);
create index if not exists idx_inquiries_status on inquiries(status);

-- PostgREST 스키마 캐시 갱신
notify pgrst, 'reload schema';
