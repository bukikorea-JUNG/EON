# 솔라루프 백엔드 (알림톡 없이)

## 기능
- / : 기존 사이트 (전화 010-3194-7270)
- /admin : 관리자 페이지 (비번 7270)
  - 문의 리스트, 상태 변경, 메모, 카톡/이메일 관리, 엑셀 다운로드

## API
- POST /api/inquiry : 문의 접수 -> Gmail 발송 + data/inquiries.json 저장
- GET /api/inquiries : 리스트
- PATCH /api/inquiries : 상태/메모 업데이트
- DELETE /api/inquiries?id=xxx : 삭제

## 배포
Vercel에 ZIP 업로드 또는 GitHub push
환경변수 3개 유지:
GMAIL_USER, GMAIL_APP_PASSWORD, KEPCO_API_KEY

## 카톡 관리
알림톡 없이 무료:
- 관리자 페이지에서 카톡 버튼 -> 카카오 비즈니스 센터로 이동 + 전화번호 복사
- 카톡 상담 내용 메모 필드에 기록
