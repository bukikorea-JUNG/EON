# TDB/TSR 전국판 최종 완전판

## Vercel (프론트)
- index.html: 숙박 유무 별도 카테고리 + 홀수 인덱싱(9H/18H/27H/36H/45H+) + 출처 검증 링크 + 등록일/마감일
- api/history.js: Cloudflare tdb-cron.bukikorea.workers.dev/ 에서 실시간 fetch

## Cloudflare (백엔드) - 전체 기능 포함
- worker.js: 
  - parseHoles(): 이름에서 18H/36홀 추출 -> holes, holesLabel
  - parseHotel(): 호텔/온천/료칸/리조트 판정 -> hasHotel, hotelType, hotelLabel
  - 등록일 time + 마감일 deadline(등록+60일) + D-Day 계산
  - debtNum, tochi, jikayu, atp 전부 포함
  - Yahoo! 뉴스 검색 URL + TDB 검색 URL 자동 생성
  - 기존 KV 데이터 병합 (중복 id 제거) + scheduled에서 D-Day 재계산
- wrangler.toml: KV ID fb4ad82636b14f90aeeaa891db068ba02, cron 08:30 JST

## 배포 순서
1. Cloudflare: dash.cloudflare.com > Workers > tdb-cron > Edit code에 cloudflare/worker.js 붙여넣기 > Deploy > /cron 접속
2. Vercel: EON/jgolf/에 vercel/ 폴더 내용 덮어쓰기 (index.html, api/)

현재 KV 3건 저장됨, 업데이트 후 5건 데모로 확장
