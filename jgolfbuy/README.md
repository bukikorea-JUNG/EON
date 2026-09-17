# tdb-cron - Cloudflare Worker Cron

매일 **08:30 KST (23:30 UTC)** 자동 실행되는 전국 체크 크론.
Cloudflare KV `tdb-log`에 365일 기록 누적.

## 현재 설정 완료 상태
- Worker: `tdb-cron`
- Cron: `30 23 * * *` (08:30 KST)
- KV Namespace: `tdb-log` (fb4ad82636b14f90aeeaa891db068ba02)
- Binding: `TDB_LOG` -> `tdb-log`

## GitHub 업로드

```bash
git init
git add .
git commit -m "feat: tdb-cron 08:30 KST + KV 연결 완료"
git branch -M main
git remote add origin https://github.com/USERNAME/tdb-cron.git
git push -u origin main
```

## 배포

```bash
npm i
npx wrangler deploy
```

## API
- https://tdb-cron.bukikorea.workers.dev/ -> 히스토리 JSON
- https://tdb-cron.bukikorea.workers.dev/health -> 상태 체크

## 로그 확인
- Cloudflare Dashboard -> tdb-cron -> Logs -> Real-time Logs
- 또는 `npx wrangler tail`
