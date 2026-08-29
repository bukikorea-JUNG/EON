
## Gmail SMTP 설정 방법 (Resend 가입 불필요 - 2분)

### 1단계: Gmail 2단계 인증 켜기
1. https://myaccount.google.com/security 접속 (bukikorea@gmail.com 로그인)
2. [2단계 인증] -> 사용

### 2단계: 앱 비밀번호 생성 (16자리)
1. 같은 페이지에서 [앱 비밀번호] 검색 또는 https://myaccount.google.com/apppasswords
2. 앱 선택: 메일, 기기: 기타 -> "Vercel Solarroof" 입력
3. 생성 -> 16자리 비밀번호 복사 (예: abcd efgh ijkl mnop) - 공백 제거해서 저장

### 3단계: Vercel 환경변수 설정
Vercel Dashboard -> 해당 프로젝트 -> Settings -> Environment Variables

- `GMAIL_USER` = `bukikorea@gmail.com`
- `GMAIL_APP_PASSWORD` = `16자리 비밀번호` (공백 없이 붙여서)
- `KEPCO_API_KEY` = `OyI2AGBsFpYqCkJ569TxzVmWrs346x1xQfBIv6d4`

Save 후 Redeploy (Deployments -> ... -> Redeploy)

### 4단계: 테스트
폼 제출하면 bukikorea@gmail.com으로 메일 도착 + 받은 메일함에서 확인
스팸함도 확인

### 왜 앱 비밀번호?
- 일반 Gmail 비밀번호로는 SMTP 불가 (구글 정책)
- 앱 비밀번호는 16자리 전용 비밀번호, 2단계 인증 계정만 생성 가능

### 보안
- 앱 비밀번호는 Vercel 환경변수에만 저장, 코드에 노출 안 됨
- 프론트 index.html에는 키 없음
