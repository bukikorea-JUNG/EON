# TDB/TSR 골프장 모닝 모니터 - Vercel 업로드용

첨부한 `Tdb-Tsr.html` 대시보드를 Vercel에 바로 배포하는 완성본입니다.

## 포함된 것
- `index.html` : 업로드한 대시보드 (React + Tailwind, 47도도부현 전국판)
- `api/cron.js` : 매일 08:30 KST 자동 실행 → Vercel KV에 누적
- `api/history.js` : `GET /api/history` → 누적 기록 JSON (대시보드가 fetch)
- `vercel.json` : Cron 스케줄 `30 23 * * *` (08:30 KST)

## Vercel 배포 (가장 쉬운 방법 - 드래그)

1. 이 폴더 `vercel-tdb-tsr-dashboard` 전체를 압축 해제
2. https://vercel.com/new → `Browse` → 폴더 드래그 → Deploy
   - Framework Preset: `Other` 선택
3. Storage → Create Database → KV (Upstash Redis) → `tdb-log` 생성
   - 환경변수는 자동 연결됨
4. 배포 완료 후 주소: `https://your-project.vercel.app/`

## GitHub 연동으로 배포 (EON 모노레포 쓰는 경우)

EON 레포에 넣을 경우 반드시 Root Directory 설정!

1. GitHub에 `tdb-tsr` 폴더로 업로드 (EON/tdb-tsr/)
2. Vercel → New Project → EON 레포 선택
3. **Configure Project**에서:
   - Root Directory: `tdb-tsr` 또는 `EON/tdb-tsr`로 설정 (Edit 클릭)
   - Framework: Other
4. Storage → KV 생성 → Deploy
5. Deployments → Redeploy

이렇게 안 하면 EON 전체를 빌드하려고 해서 404가 뜹니다 (jgolfbuy, jgolf-eta 404 원인과 동일).

## API
- `/` : 대시보드
- `/api/history` : 누적 데이터 JSON
- `/api/cron` : 수동 실행 테스트 (curl)

## Cloudflare KV와 연동하고 싶으면
현재는 Vercel KV를 씁니다. Cloudflare KV(`fb4ad82636b14f90aeeaa891db068ba02`)를 계속 쓰려면 `api/cron.js`에서 Cloudflare REST API 호출로 교체하면 됩니다.
