# 🧮 Dev Calculator

> 개발자가 매번 헷갈리는 변환을 한 곳에서 — 진수, 타임스탬프, 바이트, 색상, JWT, URL, Base64, Hash, JSON

[![Deploy](https://github.com/Dev-2A/dev-calculator/actions/workflows/deploy.yml/badge.svg)](https://github.com/Dev-2A/dev-calculator/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://dev-2a.github.io/dev-calculator/)

![screenshot-dark](https://dev-2a.github.io/dev-calculator/og-image.png)

## ✨ 주요 기능

| 탭 | 기능 | 하이라이트 |
| --- | --- | --- |
| 🔢 진수 변환 | 2 / 8 / 10 / 16진수 실시간 변환 | 4자리 구분 포맷팅, 빠른 참조 카드 |
| 🕐 Unix 타임스탬프 | 타임스탬프 ↔ 날짜 양방향 변환 | 실시간 시계, 초/밀리초 자동 감지, 날짜 분해 |
| 💾 바이트 변환 | B ↔ KB ↔ MB ↔ GB ↔ TB ↔ PB | Binary(1024) / SI(1000) 전환 |
| 🎨 색상 코드 | HEX ↔ RGB ↔ HSL | 실시간 프리뷰, RGB 슬라이더, HSL 게이지 |
| 🔑 JWT 디코더 | Header / Payload 파싱 | 토큰 구조 색상 분리, 만료 여부 배지, 시간 클레임 분석 |
| 🔗 URL 인코더 | 인코딩 / 디코딩 / URL 분석 | encodeURI vs encodeURIComponent, 이중 인코딩 감지, 쿼리 파라미터 분리 |
| 📦 Base64 | 인코딩 / 디코딩 | URL-safe 모드, 이미지 감지 + 프리뷰, Hex Dump |
| 🔒 Hash 생성 | MD5 / SHA-1 / SHA-256 / SHA-384 / SHA-512 | 보안 등급 표시, 해시 비교 기능 |
| 📋 JSON 정리 | Prettify / Minify / Validate | 구문 하이라이팅, Tree View, JSON 분석 통계 |

## 🎯 공통 기능

- **실시간 변환** — 입력 즉시 결과 반영
- **원클릭 복사** — 모든 결과에 복사 버튼 + 글로벌 토스트 알림
- **다크/라이트 테마** — 시스템 설정 자동 감지 + 수동 전환
- **반응형 디자인** — 모바일/태블릿/데스크톱 대응
- **빠른 참조** — 각 도구마다 자주 쓰는 값 카드 제공

## 🛠️ 기술 스택

- **React 18** + **Vite**
- **Tailwind CSS v4**
- **GitHub Pages** (GitHub Actions 자동 배포)
- 외부 라이브러리 없이 순수 JavaScript로 모든 변환 로직 구현

## 🚀 로컬 실행

```bash
git clone https://github.com/Dev-2A/dev-calculator.git
cd dev-calculator
npm install
npm run dev
```

## 📁 프로젝트 구조

```text
src/
├── components/
│   ├── common/
│   │   ├── Layout.jsx          # 전체 레이아웃 + 테마 토글
│   │   ├── TabNav.jsx          # 탭 네비게이션 (좌우 스크롤)
│   │   └── CopyButton.jsx      # 공용 복사 버튼
│   └── tools/
│       ├── BaseConverter.jsx    # 진수 변환
│       ├── UnixTimestamp.jsx    # Unix 타임스탬프
│       ├── ByteConverter.jsx    # 바이트 변환
│       ├── ColorConverter.jsx   # 색상 코드 변환
│       ├── JwtDecoder.jsx       # JWT 디코더
│       ├── UrlEncoder.jsx       # URL 인코더/디코더
│       ├── Base64Encoder.jsx    # Base64 인코더/디코더
│       ├── HashGenerator.jsx    # Hash 생성기
│       └── JsonFormatter.jsx    # JSON Formatter
├── hooks/
│   ├── useTheme.jsx             # 다크/라이트 테마
│   ├── useToast.jsx             # 글로벌 토스트 알림
│   └── useCopyToClipboard.js    # 클립보드 복사 훅
├── utils/
│   ├── tabConfig.js             # 탭 설정
│   └── converters.js            # 모든 변환 로직
├── App.jsx
├── index.css
└── main.jsx
```

## 🧩 시리즈

개발자가 자주 쓰지만 매번 헷갈리는 문법을 시각화하는 도구 시리즈:

1. **Regex Playground** — 정규표현식 시각화
2. **Cron Expression Builder** — Cron 표현식 빌더
3. **Dev Calculator** — 개발자 전용 만능 계산기 ← *이 프로젝트*

## 📜 License

MIT © Dev-2A
