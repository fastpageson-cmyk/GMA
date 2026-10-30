# Uber Base — Figma에서 가져온 값

- 팀 공유 파일: [Base Gallery](https://www.figma.com/design/0R2a5OdoblLjo5gbap5XZf/Base-Gallery--Community-)
- 원본: [Figma Community](https://www.figma.com/community/file/805195278314519508)
- 추출일: 2026-10-30

## 들어 있는 파일

| 파일 | 내용 |
|---|---|
| `tokens.json` | 기본 색 9개, 8단계 팔레트 8종, 글자 스타일 18종, 그림자 6종 |
| `cover.png` | 키트 표지 |
| `buttons.png` | 버튼 모음(크기 4종 × 모양별) |

## 키트 구성

- 변수(Variables)는 없고 스타일만 있습니다: 색 81개, 글자 18개, 그림자 6개.
- 컴포넌트는 Uber 내부 라이브러리에 연결되어 있어서, 이 파일 안에서는 컴포넌트 정의를 읽을 수 없습니다. 화면 모음(Button, Input, Date picker, List, Banner, Snackbar 등)으로 참고만 할 수 있습니다.
- 글자 스타일의 폰트 이름도 읽히지 않습니다. Uber Move가 비공개 폰트이기 때문입니다.

## 코드(npm)와 비교 — 주의

**Figma 키트의 색 팔레트가 `baseui` 18 코드보다 오래된 버전입니다.** 같은 이름이라도 값이 다릅니다.

| 이름 | Figma | `baseui` 18 |
|---|---|---|
| Blue 400 | `#276ef1` | `#6DAAFB` (`#276EF1`은 Blue 600) |
| Red 400 | `#d44333` | `#FC7F79` |
| Green 400 | `#3aa76d` | `#06C167` |
| Gray 500 | `#757575` | `#868686` |

- 글자 크기와 줄 높이는 같습니다(예: Heading Large 32/40, Display Large 96/112).
- Base를 고르면 색은 `baseui` 코드 값을 기준으로 하고, Figma 색을 코드에 맞춰 고쳐야 합니다.
