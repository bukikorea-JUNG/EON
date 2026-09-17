# jgolf 최종 완성본 - 메뉴 + 0% + 엔표기 + 실시간

## 포함된 것
- index.html: TDB/TSR 전국판 대시보드 (첨부 이미지 메뉴 반영)
  - 상단: T 로고 + 47도도부현 커버리지 배지
  - 4개 요약 카드 + 8권역 칩 + 47도도부현 멀티 선택
  - 반환율: 0% 플레이권만 / 10% / 15% / 20%
  - 전부 엔 표기: 億円, 万円
- api/history.js: Cloudflare tdb-cron.bukikorea.workers.dev/ 에서 실시간 fetch (no-cache)
- api/cron.js: health check
- package.json: 의존성 없음 (ETARGET 에러 해결)
- vercel.json: {"version":2} - rewrites 제거로 /api/history 404 해결

## 배포
1. GitHub EON/jgolf/ 폴더 내용 전부 삭제
2. 이 ZIP 압축 풀어서 넣기
3. Commit
4. Vercel > jgolf-eta > Settings > Root Directory = jgolf 확인
5. Redeploy

## 확인
- https://tdb-cron.bukikorea.workers.dev/ -> JSON 배열 (Cloudflare 원본)
- https://jgolf-eta.vercel.app/api/history -> 같은 배열 (Vercel 경유)

Cloudflare가 []이면:
- https://tdb-cron.bukikorea.workers.dev/cron 접속해서 수동 트리거
- Cloudflare Dashboard > Workers > tdb-cron > Logs에서 ✅ 저장됨 확인
