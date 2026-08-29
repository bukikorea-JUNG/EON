
-- 기존 테이블 완전 삭제 후 재생성 (컬럼명 문제 해결)
drop table if exists inquiries;

create table inquiries (
  id text primary key,
  name text,
  phone text,
  address text,
  pyeong text,
  "roofType" text,
  message text,
  "pageUrl" text,
  status text default '신규',
  memo text default '',
  "kakaoMemo" text default '',
  "emailMemo" text default '',
  "emailSent" boolean default false,
  "emailError" text,
  "createdAt" timestamp with time zone default now(),
  "receivedAt" text,
  "updatedAt" timestamp with time zone default now()
);

alter table inquiries disable row level security;

create index if not exists idx_inquiries_created on inquiries("createdAt" desc);
create index if not exists idx_inquiries_status on inquiries(status);
