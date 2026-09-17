# tdb-cron - TDB/TSR 전국 체크

매일 **08:30 KST (23:30 UTC)** 에 실행되는 Cloudflare Worker 크론.

## 기능
- Cron: `30 23 * * *` (매일 08:30 KST)
- KV `tdb-log`에 히스토리 누적 (365일)
- `GET /` → JSON 히스토리 API (대시보드에서 fetch)
- `GET /health` → 헬스체크

## 설치

```bash
# 1. 클론
git clone <your-repo>
cd tdb-cron

# 2. KV 생성
npx wrangler kv namespace create tdb-log
# 나온 id를 wrangler.toml에 붙여넣기

# 3. 배포
npm run deploy
# 또는
npx wrangler deploy
```

## Cloudflare 대시보드 설정 (코드 없이)
이미 만든 경우:
1. Worker `tdb-cron` → 설정 → 트리거 → Cron `30 23 * * *` 추가
2. 스토리지 및 데이터베이스 → Workers KV → `tdb-log` 생성
3. Worker → 설정 → 바인딩 → KV 네임스페이스 → 변수 `TDB_LOG` → `tdb-log` 선택
4. 코드 붙여넣기 후 배포

## API
- `https://tdb-cron.<your-subdomain>.workers.dev/` → `[{time, tdb, tsr, ...}]`
- 대시보드에서:
```js
const res = await fetch("https://tdb-cron.<your-subdomain>.workers.dev/");
const history = await res.json();
```

## 다음 단계
`src/index.js`의 TODO 부분에 TDB/TSR 실제 크롤링 로직 추가:
```js
async function fetchTDB() { /* scraping */ }
```

## 로그 확인
```bash
npx wrangler tail
# 또는 대시보드 → tdb-cron → 로그 → 실시간 로그 시작
```
