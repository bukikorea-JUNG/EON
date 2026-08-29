# Supabase 연동 버전

## 1. Supabase 프로젝트 생성
https://supabase.com -> New Project (무료)

## 2. SQL 실행
SQL Editor -> supabase.sql 내용 붙여넣기 -> Run

## 3. Vercel 환경변수 추가 (기존 3개 + 2개)
기존:
GMAIL_USER=bukikorea@gmail.com
GMAIL_APP_PASSWORD=16자리
KEPCO_API_KEY=OyI2...

추가:
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
또는
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (권장 - RLS 우회)

Supabase Dashboard -> Settings -> API에서 확인

## 4. 배포
GitHub push -> Vercel 자동 배포 -> /admin에서 Supabase 데이터 확인

## 장점
- data/inquiries.json은 Vercel 재배포시 초기화됨
- Supabase는 영구 저장, 500MB 무료, 엑셀보다 검색 빠름
