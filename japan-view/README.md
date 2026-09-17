# tdb-cron (Vercel 버전)

Cloudflare Worker → **Vercel Cron + Vercel KV**로 변환한 버전.
매일 **08:30 KST (23:30 UTC)** 자동 실행.

## 구조
```
/api/cron.js    → 매일 08:30 KST 실행, KV에 누적
/api/history.js → GET /api/history → 대시보드용 JSON
vercel.json     → 크론 스케줄 정의
```

## Vercel 배포 (GitHub 연동)

### 1. GitHub 푸시
```bash
git init
git add .
git commit -m "feat: vercel cron 08:30 KST"
git remote add origin https://github.com/USERNAME/tdb-cron.git
git push -u origin main
```

### 2. Vercel에서 Import
1. https://vercel.com/new → GitHub 레포 선택
2. Framework: `Other` (또는 Next.js)
3. **Storage** 탭 → `Create Database` → `KV (Upstash Redis)` → `tdb-log` 생성
   → 자동으로 `KV_URL`, `KV_REST_API_URL` 등 환경변수 연결됨
4. Deploy

### 3. Cron 확인
Vercel Dashboard → 프로젝트 → `Cron Jobs` 탭 → `30 23 * * *` 보이면 성공
로그: `Logs` → `Crons` 필터

### 4. 수동 테스트
```bash
curl https://your-project.vercel.app/api/cron
curl https://your-project.vercel.app/api/history
```

## 로컬 개발
```bash
npm i
vercel link
vercel env pull .env.local
npm run dev
# http://localhost:3000/api/cron
```

## 대시보드 연동
```js
const res = await fetch("https://your-project.vercel.app/api/history");
const history = await res.json(); // [{time, tdb, tsr}, ...]
```

## Cloudflare KV 계속 쓸 경우
Vercel에서 Cloudflare KV REST API를 쓰고 싶으면:
- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_KV_NAMESPACE_ID`, `CLOUDFLARE_API_TOKEN` 환경변수 설정
- `api/cron.js`에서 `@vercel/kv` 대신 Cloudflare API 호출로 교체
