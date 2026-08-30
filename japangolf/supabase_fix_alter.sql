-- 기존 테이블 유지하면서 컬럼 추가 (데이터 보존하고 싶을 때)

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS budget text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS company_type text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS message text;
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS source text DEFAULT 'japangolfmna';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS page text DEFAULT 'GK-vs-KK';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status text DEFAULT 'new';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- RLS 정책 재생성
drop policy if exists "Allow service_role all" on inquiries;
drop policy if exists "Allow service_role insert" on inquiries;
drop policy if exists "Allow service_role read" on inquiries;

alter table inquiries enable row level security;
create policy "Allow service_role all" on inquiries for all using (true) with check (true);

-- 스키마 캐시 리로드 (이게 핵심!)
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- 5초 후 확인
select * from inquiries limit 1;
