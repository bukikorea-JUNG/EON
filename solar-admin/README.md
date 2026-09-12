
# SOLARROOF.KR Final - Vercel 배포용

## 구조
- public/index.html : 최종 프론트 (공장 창고 지붕임대 메인, 골프장 등 대형주차장 서브, E-E-A-T, 3만~10만/kW·년, 블로그 6개 고유, 푸터 이미지 동일)
- api/inquiry.js : 문의 접수 API (Supabase 저장 + 카카오 알림)
- api/grid-capacity.js : 한전 계통용량 조회 API (KEPCO_API_KEY 있으면 실호출, 없으면 mock 12,500/3,200/850 5.9%)
- vercel.json : 라우팅 설정
- package.json : @supabase/supabase-js 포함

## 배포 방법
1. Vercel 대시보드 > Settings > Environment Variables 에 키 등록:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - KEPCO_API_KEY (한전 파워플래너)
   - KAKAO_CHANNEL_TOKEN (선택)

2. Supabase 테이블 생성 SQL:
   ```sql
   create table inquiries (
     id bigint generated always as identity primary key,
     company text,
     contact_name text,
     contact text,
     address text,
     area numeric,
     unit_price numeric,
     message text,
     created_at timestamp default now()
   );
   ```

3. Git push:
   ```
   git init
   git add .
   git commit -m "final"
   git remote add origin YOUR_REPO
   git push origin main
   ```
   Vercel이 자동 배포

4. 동작 확인:
   - 프론트: / (public/index.html)
   - API: /api/inquiry POST, /api/grid-capacity?addr=화성&reqKw=99 GET
   - 키 없어도 프론트는 목업으로 동작, 키 있으면 실DB/실API로 자동 전환 (프론트 fetch 실패시 폴백 로직 내장)

## 프론트 특징
- Hero H1 26자: "공장 창고 지붕임대 - 3만~10만/kW·년 현실 기준" (구글 최적)
- H2 22자: "골프장 등 대형주차장 태양광까지 비교"
- Footer: 첨부 이미지 100% 동일 (70,000원/kW·년 표준 배지, 회사정보, 카카오 버튼)
- Range 30,000~100,000원 기본 40,000원, 3만/4만기준/5만/7만/10만 퀵버튼
- Blog 6개 완전 차별화 (120평 화성~1500평 천안)
- Counters 180/8 클린, 그래프 h-[160px] 고정, 계통 SEO 2000+, 비교표, E-E-A-T
