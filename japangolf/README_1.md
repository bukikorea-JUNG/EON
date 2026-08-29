# JAPANGOLFMNA - 일본 골프장 M&A

국내 골프장 2개 홀 가격으로, 일본 18홀 골프장의 오너가 되십시오.

**라이브:** https://japangolfmna.com (Vercel 배포 예정)

## 프로젝트 소개
- 10억엔대 예산으로 완성하는 일본 골프장 M&A 및 흑자 전환 솔루션
- 1인 10억 신디케이션으로 100억대 프라이빗 골프장 오너십 (10구좌 한정)
- Risk-Free 8대 리스크 완벽 차단 (회원 예탁금 부채 클린 딜, 세금 최적화, 외환 신고 원스톱, 운영 PMI)

## 연락처
- **문의 전화:** 010-3194-7270
- **문의 접수:** bukikorea@gmail.com
- **카카오톡:** http://pf.kakao.com/_xbVTxaX/chat

## 기술 스택
- Pure HTML / CSS / JS (프레임워크 없음, Vercel 정적 호스팅)
- Noto Sans KR, Tailwind CSS CDN
- OG 이미지 최적화 (카카오톡 공유)

## 폴더 구조
```
.
├── index.html          # 랜딩페이지 (33KB)
├── images/             # 이미지 10종
│   ├── kakao_og_image.webp (카톡 공유 이미지)
│   ├── hero_mt_fuji.webp
│   ├── logo_japangolfmna.png
│   └── ...
├── vercel.json         # Vercel 설정 (캐싱, 보안 헤더)
└── README.md
```

## 로컬 실행
```bash
npx serve .
# 또는
python -m http.server 8000
```

## 배포

### Vercel (권장)
1. GitHub에 push
2. https://vercel.com/new 에서 Import Git Repository
3. Framework: Other 선택
4. Deploy

### 수동
```bash
vercel --prod
```

## 도메인 연결
Vercel > Settings > Domains > japangolfmna.com
- A: 76.76.21.21
- CNAME: cname.vercel-dns.com

## 라이선스
© 2026 주식회사 이온 EON. All rights reserved.
