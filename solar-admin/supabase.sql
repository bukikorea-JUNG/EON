-- Supabase SQL Editor에 붙여넣기
create table if not exists inquiries (
  id text primary key,
  name text,
  phone text,
  address text,
  pyeong text,
  roofType text,
  message text,
  pageUrl text,
  status text default '신규',
  memo text default '',
  kakaoMemo text default '',
  emailMemo text default '',
  emailSent boolean default false,
  emailError text,
  createdAt timestamp with time zone default now(),
  receivedAt text,
  updatedAt timestamp with time zone default now()
);

-- RLS 끄기 (관리자만 쓰므로 간단하게)
alter table inquiries disable row level security;

-- 또는 RLS 켜고 모두 허용 (보안 필요하면 service_role 키 사용)
-- alter table inquiries enable row level security;
-- create policy "Allow all" on inquiries for all using (true) with check (true);

-- 인덱스
create index if not exists idx_inquiries_created on inquiries(createdAt desc);
create index if not exists idx_inquiries_status on inquiries(status);
