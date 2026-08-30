-- JAPANGOLFMNA v4 Japan Only
create table if not exists inquiries (id uuid primary key default gen_random_uuid(), name text not null, phone text not null, email text not null, budget text, region text, company_type text, message text, email_sent boolean default false, email_error text, source text default 'japangolfmna', page text default 'GK-vs-KK', status text default 'new', internal_notes jsonb default '[]'::jsonb, assigned_to text, linked_listing_id uuid, follow_up_date date, feedback_score int, updated_at timestamptz default now(), created_at timestamptz default now());
create table if not exists feedbacks (id uuid primary key default gen_random_uuid(), inquiry_id uuid references inquiries(id) on delete cascade, customer_email text, type text, rating int, comment text, created_at timestamptz default now());
create table if not exists golf_listings (id uuid primary key default gen_random_uuid(), name text not null, region text, holes int, price text, status text default '검토중', memo text, features text, created_at timestamptz default now(), updated_at timestamptz default now());
alter table inquiries enable row level security; alter table feedbacks enable row level security; alter table golf_listings enable row level security;
drop policy if exists "Allow all" on inquiries; create policy "Allow all" on inquiries for all using (true) with check (true);
drop policy if exists "Allow all" on feedbacks; create policy "Allow all" on feedbacks for all using (true) with check (true);
drop policy if exists "Allow all" on golf_listings; create policy "Allow all" on golf_listings for all using (true) with check (true);
delete from golf_listings;
insert into golf_listings (name, region, holes, price, status, memo, features) values
('Nasuno Country Club','간토 - 도치기',27,'80억','검토중','도쿄 2시간, 온천 인근','온천, 리조트'),
('Kansai Hills Golf Club','간사이 - 효고',18,'65억','NDA진행','간사이 중심 접근성','도심 접근성'),
('Hokkaido Powder Resort Golf','홋카이도 - 니세코',18,'120억','실사','스키장 연계 사계절 리조트','스키장, 파우더 스노우'),
('Kyushu Ocean & Onsen Resort','규슈 - 미야자키',18,'95억','검토중','오션뷰 온천 리조트','오션뷰, 온천'),
('Chiba Coastal Golf','간토 - 치바',18,'70억','검토중','도쿄 근교 해안 골프장','해안, 도심 근접'),
('Shizuoka Fuji View CC','주부 - 시즈오카',27,'110억','NDA진행','후지산 뷰','후지산 뷰, 리조트'),
('Tohoku Highland CC','도호쿠 - 미야기',18,'45억','보류','고원 지대 자연 친화','자연 친화'),
('Hiroshima Setouchi Golf','주고쿠 - 히로시마',18,'60억','검토중','세토내해 전망','세토내해 전망'),
('Okinawa Resort Golf','오키나와',18,'85억','제안중','리조트형 남국 골프','리조트, 남국'),
('Nagano Alpine Golf','주부 - 나가노',18,'55억','검토중','알프스 산악 뷰','산악 뷰, 온천');
NOTIFY pgrst, 'reload schema';
