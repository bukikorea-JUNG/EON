# JAPANGOLFMNA - Vercel 배포 (첨부파일 그대로)

이 폴더는 첨부해주신 Japangolfmna.html 파일을 그대로 Vercel에 배포하기 위한 패키지입니다.

## 포함 내용
- index.html: 첨부파일 그대로 (7.7MB, React 기반 단일 파일, 이미지 내장)
  - 문의 전화: 010-3194-7270 (tel:01031947270)
  - 문의 접수: bukikorea@gmail.com
  - 카카오톡: http://pf.kakao.com/_xbVTxaX/chat
  - OG 이미지: 후지산 일출 골프장 (내장)
- vercel.json: public 오류 해결 (outputDirectory: ., framework: null)
- images/: 백업용 OG 이미지 (실제 배포는 index.html 단일 파일로 동작)

## 배포 방법

### Vercel 대시보드 (가장 쉬움) - 지금 오류 해결
1. Vercel > 프로젝트 EON > Settings > Build and Deployment
2. Framework Preset: Other
3. Build Command: (빈 칸)
4. Output Directory: . (점 하나)
5. Install Command: (빈 칸)
6. Save
7. Deployments > 최신 배포 > ... > Redeploy

### GitHub로 재배포
```bash
cd vercel_attached_final
git init
git add .
git commit -m "JAPANGOLFMNA - attached file vercel ready - 010-3194-7270"
git branch -M main
git remote add origin https://github.com/당신아이디/japangolfmna.git
git push -f origin main
```

### Vercel CLI
```bash
npm i -g vercel
cd vercel_attached_final
vercel --prod
```

## 확인 사항
- index.html 단일 파일로 7.7MB - 이미지, CSS, JS 모두 내장되어 별도 폴더 없이 동작
- vercel.json에서 build를 하지 않으므로 public 오류 없음
