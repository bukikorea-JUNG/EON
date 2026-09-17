# jgolf - TDB/TSR 대시보드

빌드 에러 수정본 (package.json에서 @vercel/kv 제거)

- index.html: 대시보드
- api/: 크론/API (KV 없이도 동작)
- vercel.json: 정적 라우팅

Vercel에서 Root Directory = jgolf 로 설정하고 배포하면 404/ETARGET 해결
