# Material 3 — Figma에서 가져온 값

- 팀 공유 파일: [Material 3 Design Kit](https://www.figma.com/design/vtsIW24M4Kt6p68FtjLu88/Material-3-Design-Kit--Community-)
- 원본: [Figma Community](https://www.figma.com/community/file/1035203688168086460)
- 추출일: 2026-10-30

## 들어 있는 파일

| 파일 | 내용 |
|---|---|
| `tokens.json` | 색(Light/Dark), 상태 레이어 투명도, 글자 스타일 15종, 모서리 둥글기, 그림자 5단계 |
| `cover.png` | 키트 표지 |
| `buttons.png` | Filled 버튼(크기 5종 × 상태) |

## 키트 구성

- 변수 4묶음: `M3`(색 197개, 32개 모드), `Typescale`(90개), `Font theme`(7개), `Shape`(10개)
- 색 모드: Light, Dark, 고대비 4종, 단색, 색상 테마 24종. `tokens.json`에는 Light와 Dark만 넣었습니다.
- 컴포넌트 페이지: App bars, Badges, Buttons, Cards, Carousel, Checkboxes, Chips, Date & time pickers, Dialogs, Dividers, Lists, Loading & progress, Menu, Navigation, Radio button, Search, Sheets, Sliders, Snackbar, Switch, Tabs, Text fields, Toolbars, Tooltips

## 코드(npm)와 비교

- 기본 색 `Primary #6750a4`가 `@material/web` 토큰과 같습니다.
- 글자는 Roboto를 씁니다. `@fontsource/roboto`로 받은 폰트와 같습니다.
