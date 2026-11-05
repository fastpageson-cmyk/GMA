# GMA

GMA 프로젝트 저장소입니다.

## 시작하기

```bash
git clone https://github.com/fastpageson-cmyk/GMA.git
cd GMA
cp .env.example .env   # 필요 시 환경 변수 채우기
```

## 닿음 시제품 보기

청년 혜택 웹앱 시제품이 `src/`에 있습니다. 빌드 없이 정적 서버로 돌아갑니다. Claude 앱에서 "닿음 화면 띄워 줘"라고 하면 됩니다.

```bash
python3 -m http.server 5180 --directory src
```

브라우저에서 http://localhost:5180 을 엽니다. 판정 시험은 `node --test tests/*.test.mjs`로 돌립니다.

- 화면은 Material 3(`@material/web`)로 만들었고, 강조색은 최종 색이 정해지기 전까지 임시 보라입니다.
- 폰트(Roboto, Noto Sans KR, Material Symbols)는 Google Fonts에서 받아 `src/fonts/`에 넣어 두었습니다. 다시 받으려면 `node src/fonts/download-fonts.mjs`를 실행합니다.
- 혜택 데이터는 2026-11-04 기준 실제 공고 28건입니다. 조사 원본과 확인 못 한 항목은 `docs/data/`에 있습니다.
- 후기, 투표, 알림은 서버가 없어 이 브라우저에만 저장됩니다. 문장 질의는 언어 모델 없이 사전과 규칙으로 돌아갑니다.

## 디렉터리 구조

```
.
├── design-system/  # 디자인 시스템 후보 4종 (design-system/README.md 참고)
├── docs/      # 문서
├── src/       # 소스 코드
└── tests/     # 테스트
```
