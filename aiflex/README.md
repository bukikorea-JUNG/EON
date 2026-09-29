# AIFLEX38 - Kick 13 Q4 - GitHub 배포용 (이미지 파일명 수정版)

## 수정 사항
- 기존 `image-1.png` 등 불명확한 파일명 → 의미있는 파일명으로 변경
- 실제 파일 형식은 모두 JPEG이므로 확장자 `.jpg`로 통일 (기존 png/webp 선언 오류 수정)
- 이미지 참조 경로 `src: var` 가 올바르게 매칭되도록 재빌드

## 파일 구조
```
├── index.html (최적화, assets 참조)
├── original-single-file.html (원본 단일 파일, 이미지 임베드 - 파일명 문제 없는 버전)
├── assets/
│   ├── hero-aiflex38-gold-dark.jpg
│   ├── shaft-lineup-01.jpg
│   ├── shaft-detail-01.jpg
│   ├── shaft-detail-02.jpg
│   ├── shaft-spec-01.jpg
│   ├── shaft-spec-02.jpg
│   ├── test-data-chart-01.jpg
│   ├── test-data-chart-02.jpg
│   └── test-data-chart-03.jpg
├── .github/workflows/pages.yml
├── README.md
└── .gitignore
```

## 배포
1. 이 ZIP 압축 해제 후 GitHub Repo에 push
2. Settings → Pages → Source: GitHub Actions
3. 배포 URL: https://USERNAME.github.io/REPO/

만약 이미지가 여전히 안 보이면 `original-single-file.html`을 `index.html`로 이름 변경해서 사용하세요. (이미지 임베드라 파일명 이슈 없음)

## 로컬 테스트
python -m http.server 8000
