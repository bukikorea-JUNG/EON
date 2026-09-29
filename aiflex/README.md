# AIFLEX38 - Kick 13 Q4 Landing

38g 초경량 원플렉스 드라이버 샤프트 랜딩 페이지 - GitHub Pages 배포용

## 📁 구조
```
.
├── index.html                           # 메인 페이지 (이미지 분리 최적화 버전)
├── Aiflex38-Kick-13-Q4-original.html    # 원본 단일 파일 버전
├── assets/                              # 이미지 에셋 (base64에서 분리)
├── README.md
├── .gitignore
└── .github/workflows/pages.yml          # GitHub Pages 자동 배포
```

## 🚀 GitHub Pages 배포 방법

### 방법 1: 자동 배포 (권장)
1. GitHub에서 새 Repository 생성
2. 이 ZIP 압축 해제 후 모든 파일을 push
   ```bash
   git init
   git add .
   git commit -m "feat: AIFLEX38 landing"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. GitHub Repo → Settings → Pages → Source: `GitHub Actions` 선택
4. main 브랜치 push시 자동 배포됨

### 방법 2: 수동 Pages 설정
1. Repo → Settings → Pages
2. Branch: `main` / Folder: `/ (root)` 선택
3. Save → `https://YOUR_USERNAME.github.io/YOUR_REPO/` 에서 확인

## 🛠 로컬 실행
```bash
# Python 간단 서버
python -m http.server 8000
# 또는
npx serve .
```

## 📄 페이지 정보
- **제품**: AIFLEX38 38g / 42g 드라이버 샤프트
- **핵심 기술**: 듀얼 킥포인트 시스템, 멀티소재 카본 Multiplex System, MADE IN JAPAN 핸드메이드
- **컨셉**: 70~110mph 전 구간 원플렉스 - 플렉스 고르는 시대는 끝났다

## 📝 수정
`index.html`은 빌드된 단일 파일입니다. 
원본 React 소스 수정이 필요하면 원본 아티팩트를 다시 빌드하세요.

---
제작: AIFLEX / 배포 패키지 생성일: 2026-09-30
