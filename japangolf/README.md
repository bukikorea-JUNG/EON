# JAPANGOLFMNA v4.2 FINAL - Clean Upload

## 구조
- index.html : 프론트엔드 (골프장 매물)
- admin.html : 관리자 (500KB lite, 로그아웃 버튼 포함) 비번 1234
- admin/index.html : /admin 경로용 (admin.html과 동일)
- vercel.json : /admin -> /admin.html rewrite 필수
- api/ : Supabase 연동 API
- public/ : 로고

## 설치
1. GitHub EON/japangolf 레포 파일 전체 삭제 (google 인증 파일 2개 제외 가능)
2. 이 폴더 안에 있는 모든 파일/폴더를 루트에 업로드
3. Commit -> Vercel 자동 배포 Ready

## 접속
- https://japangolf.vercel.app/admin.html
- https://www.japangolfmna.com/admin.html
- https://www.japangolfmna.com/admin (vercel.json 있을 때만)

## 관리자
비번: 1234
로그아웃: 상단 오른쪽 🚪 버튼
