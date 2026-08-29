# JAPANGOLFMNA - Vercel 배포용

## 배포 방법

### 1. Vercel 대시보드 (가장 쉬움)
1. https://vercel.com/new 접속
2. `vercel_japangolfmna` 폴더를 드래그 앤 드롭
   - 또는 GitHub에 업로드 후 Import
3. Framework Preset: **Other** 선택 (정적 HTML)
4. Deploy 클릭 - 30초 후 https://japangolfmna.vercel.app 형태로 배포됨

### 2. Vercel CLI
```bash
npm i -g vercel
cd vercel_japangolfmna
vercel --prod
```

### 3. GitHub 연동
```bash
cd vercel_japangolfmna
git init
git add .
git commit -m "JAPANGOLFMNA landing - 010-3194-7270 bukikorea@gmail.com"
git remote add origin https://github.com/your-id/japangolfmna.git
git push -u origin main
# Vercel에서 GitHub Import
```

## 포함된 파일
- index.html (23KB, 일본골프장 매수 문의, 010-3194-7270, bukikorea@gmail.com)
- images/
  - logo_japangolfmna.png
  - hero_mt_fuji.webp (히어로)
  - offering_kyushu.webp, offering_hokkaido.webp, offering_osaka.webp
  - risk_meeting.webp
  - why_tohoku.webp
  - kakao_og_image.webp (카카오톡 공유 이미지, OG)
  - og-image.jpg (호환용)
- vercel.json (캐싱, 보안 헤더)

## 연락처 설정
- 문의 전화: 010-3194-7270 (tel:01031947270)
- 문의 접수: bukikorea@gmail.com (mailto)
- 카카오톡: http://pf.kakao.com/_xbVTxaX/chat
- OG 이미지: https://japangolfmna.com/images/kakao_og_image.webp (Vercel 도메인으로 자동 변경됨)

## 도메인 연결
Vercel 대시보드 > Settings > Domains > japangolfmna.com 추가
- A 레코드: 76.76.21.21
- CNAME: cname.vercel-dns.com

배포 후 카카오톡에 링크 공유 시 OG 이미지가 자동 노출됩니다.
