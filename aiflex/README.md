# AIFLEX38 - Vercel 배포용

## 메인 카피
```
플렉스 고르는 시대는
끝났다.
모든 스피드 완벽대응
AIFLEX38 드라이버 샤프트 출시!
```

## 최종 수정 사항
- AIFLEX • SINCE 2026 (2026년 표기)
- DUAL ACTION KICK SYSTEM • MID KICK POINT
- 하단 AIFLEX38 정가 안내 섹션 통삭제 (상단 고정바 정가 880,000원 유지)
- 텍스트를 이미지로 삽입한 부분 전부 삭제 → 실제 HTML 텍스트로 교체
  - WHY WE NEED / 3-ZONE / Foresight 데이터 테이블 / SDSS AB-Map T/C 0.66 / C/B 0.53 모두 텍스트화
- 제품이미지/테스트 관련 이미지만 유지 (a01.png, 5-shafts stack, robot room, logo)
- 섹션별 중복 설명 금지, 본문 디자인 구조 재정렬

## 배포 방법
### Vercel Dashboard
1. vercel-aiflex38.zip 압축 해제 또는 zip 그대로 업로드
2. Vercel → Add New → Project → Upload
3. Framework Preset: Other
4. Build Command: (empty)
5. Output Directory: ./
6. Deploy

### Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

## 구조
- index.html: 최종본 (텍스트 이미지화 제거, SINCE 2026)
- public/assets/: 제품 이미지 4개
- vercel.json: 라우팅 및 캐시 설정
- package.json

## SEO
- canonical: https://aiflex.co.kr/aiflex38
- JSON-LD: Product (880000 KRW), Organization, FAQPage
- main/article/H1/H2/H3 계층 구조
