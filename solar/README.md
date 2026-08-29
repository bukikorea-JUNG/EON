# SOLARROOF Vercel 최종 배포본 (이미지 포함)

## 파일 정리
```
vercel-solarroof-final-organized/
├── index.html
│   ├── 30~3000평 슬라이더
│   ├── 한전 API 연동 (변전소/주변압기/배전선로 여유용량)
│   ├── 실시간 문의 5개+하루 5개
│   ├── 도입사례 3가지 모델
│   ├── 중계 플랫폼 3트랙 + 프로세스 4단계
│   ├── FAQ SEO 12개
│   └── 문의폼 + 카톡 플로팅
├── images/
│   ├── 01-hero-factory-solar.webp (히어로 - 공장 옥상 태양광)
│   ├── 02-why-leak-roof.webp (왜 지금 - 누수 지붕)
│   ├── 03-why-waterproof-construction.webp (왜 지금 - 방수 시공 / CASE B)
│   ├── 04-case-a-contract-handshake.webp (CASE A - 계약 체결)
│   ├── 05-case-c-longterm-solar-sunset.webp (CASE C - 장기 고정수익 sunset)
│   └── 06-platform-trust-certificates.webp (플랫폼 신뢰 - 보증서/보험)
├── api/
│   └── kepco.js (한전 API 프록시 - CORS 해결)
├── vercel.json
└── package.json
```

## 배포
1. https://vercel.com/new → 이 폴더 업로드
2. 환경변수 KEPCO_API_KEY = OyI2AGBsFpYqCkJ569TxzVmWrs346x1xQfBIv6d4 (선택)
3. Deploy

## 이미지 출처
섹션별 AI 생성 - 공장 지붕 임대, 물류창고 지붕 임대, 방수 공사, 계약, 장기 수익, 보증서 등
