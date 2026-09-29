# AIFLEX38 SEO Fixed - AI 검색 가시성 100점 대응

## 수정 내용 (리포트 대응)

원본 구조 100% 유지 + 아래 11개 이슈 해결:

### 원본 대비 추가된 것
- **서버 HTML 본문**: <div id="root"> 안에 정적 semantic HTML 삽입 (AI 크롤러가 JS 없이 읽음, 인간은 React 앱으로 덮어씀)
- **H1**: 플렉스 고르는 시대는 끝났다... (seo_no_h1 해결)
- **H2/H3**: 7개 H2, 9개 H3 (STRUCT-001 해결)
- **메타 설명**: 880,000원, 38g, 6.5°, 1168mm 포함 (seo_no_desc 해결)
- **canonical, OG, Twitter**: (seo_no_canonical, seo_no_og 해결)
- **JSON-LD 5개**: Organization(with sameAs), Product, FAQPage, WebSite, BreadcrumbList (SCHEMA-001, ENTITY-001, seo_no_schema, rich_none 해결)
- **정량 데이터 테이블**: 38g, 42g, 1168mm, 6.5°, 59.4/65.6/72.5m/s, T/C 0.66, C/B 0.53 (EXTRACT-001 해결)
- **출처/인용**: GCQuad, SDSS, 공식 홈페이지 링크 (EXTRACT-002 해결)
- **정의형 문장**: 'X는 Y이다' 4개 이상 (EXTRACT-003 해결)
- **FAQ 블록**: FAQPage JSON-LD + HTML Q/A 5개 (STRUCT-003 해결)
- **robots.txt**: GPTBot, ClaudeBot, PerplexityBot 허용 명시 (CRAWL-002 해결)
- **sitemap.xml, llms.txt**: (seo_no_sitemap, seo_no_llms 해결)
- **main/article, nav, 내부 링크**: (seo_no_main, seo_few_internal 해결)

### 예상 점수
- 이전 25/100 D등급 → 90~100/100 예상 (Crawlability 25/25, Schema 25/25, Structure 20/20, Extractability 20/20, Entity 10/10)

## 배포
1. GitHub Repo에 push
2. Settings → Pages → Source: GitHub Actions
3. https://www.aiflex.co.kr/robots.txt, /sitemap.xml, /llms.txt 확인

## 파일 목록
- index.html (SEO Fixed, React 앱 + SSR fallback)
- robots.txt
- sitemap.xml
- llms.txt
- assets/ (9개 이미지, .jpg)
- .github/workflows/pages.yml

생성일: 2026-09-30
