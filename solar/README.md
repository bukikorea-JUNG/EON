# SOLARROOF - Vercel 배포용 최종 클린 버전

## 구조 (중복 없음)
```
vercel-solarroof-clean/
├── index.html (고객용 - API키 숨김, 30초 조회, 120평 5640만원 정정, 모바일 스크롤 수정, OG 이미지)
├── images/
│   ├── 01-hero-factory-solar.webp
│   ├── 02-why-leak-roof.webp
│   ├── 03-why-waterproof-construction.webp
│   ├── 04-case-a-contract-handshake.webp
│   ├── 05-case-c-longterm-solar-sunset.webp
│   ├── 06-platform-trust-certificates.webp
│   └── og-kakao-preview.webp (카톡 미리보기)
├── api/
│   ├── kepco.js (한전 API 프록시)
│   └── inquiry.js (문의 → bukikorea@gmail.com)
├── vercel.json
└── package.json
```

## 배포
1. https://vercel.com/new → 이 폴더 드래그
2. Environment Variables:
   - RESEND_API_KEY = re_xxx (https://resend.com 에서 발급)
   - FROM_EMAIL = noreply@yourdomain.com
   - KEPCO_API_KEY = OyI2AGBsFpYqCkJ569TxzVmWrs346x1xQfBIv6d4
3. Deploy

## 압축 해제 시 주의
- 반드시 "새 폴더에 압축 풀기"로 풀어야 중복 파일이 안 생깁니다.
- Windows에서 같은 폴더에 여러 번 풀면 index_1.html 처럼 번호가 붙습니다.
- 이미 풀었다면 기존 폴더 삭제 후 다시 풀기

문의: bukikorea@gmail.com
카톡: http://pf.kakao.com/_BqTxaX/chat
