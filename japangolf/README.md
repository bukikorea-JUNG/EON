# JAPANGOLFMNA - Vercel Deploy

## 배포 방법
1. Supabase SQL Editor에서 supabase_inquiries.sql 실행
2. Vercel 대시보드 > Settings > Environment Variables 에 추가:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
3. 이 폴더를 Vercel에 배포 (vercel --prod 또는 GitHub 연결)

## 구조
- index.html : 최종 랜딩페이지 (파비콘/OG 포함, 개발자 설정 제거됨)
- public/ : favicon, og-image, logo, 골프 이미지 4개
- api/inquiry.js : Supabase inquiries 테이블에 저장
- vercel.json : 라우팅 설정

## 회사 정보
주식회사 이온 / 대표이사 정치은 / 서울시 서초구 남부순환로 335길 35 / bukikorea@gmail.com
