# Microsoft Fluent 2 — Figma에서 가져온 값

- 팀 공유 파일: [Microsoft Fluent 2 Web](https://www.figma.com/design/z93KF8UjOdylHlqZKcdng3/Microsoft-Fluent-2-Web--Community-)
- 원본: [Figma Community](https://www.figma.com/community/file/836828295772957889)
- 추출일: 2026-10-30

## 들어 있는 파일

| 파일 | 내용 |
|---|---|
| `tokens.json` | 주요 색(라이트/다크, 상태별 Rest 값), 글자 스타일 16종, 버튼 모서리, 그림자 6단계 |
| `cover.png` | 키트 표지 |
| `buttons.png` | 버튼 모음(크기 3종 × 모양 5종 × 상태) |

## 키트 구성

- 변수 묶음 27개. 핵심은 `Mode`(의미 색 359개, Light/Dark)와 ` Global`(기본 팔레트 751개)입니다. 나머지는 컴포넌트별 변수(카드 여백, 아바타 색 등)입니다.
- 글자 스타일 16개, 그림자 스타일 7개(그림자 6단계 + 아크릴 흐림).
- 컴포넌트 페이지 46개: Accordion, Avatars, Badge, Breadcrumb, Button, Card, Carousel, Checkbox, DataGrid, Dialog, Divider, Drawer, Dropdown, Field, Info label, Input, Label, Link, List, Material acrylic, Menu, Message bar, Nav, Persona, Popover, Progress bar, Radio group, Rating, SearchBox, Skeleton, Slider, Spin button, Spinner, Status indicator, Swatch picker, Switch, Tablist, Tag & Interaction tag, Tag picker, Teaching popover, Textarea, Toast, Toolbar, Tooltip, Tree, Subcomponents
- 폰트는 Segoe UI입니다. Windows 밖에서는 Figma에서도 대체 폰트로 보일 수 있습니다.

## 코드(npm)와 비교

대부분 같고, 세 군데가 다릅니다.

| 항목 | Figma | `@fluentui/react-components` |
|---|---|---|
| 주 색, 글자색, 배경, 테두리, 오류·성공 색 | 같음 (예: 주 색 `#0f6cbd`) | 같음 |
| Large Title 줄 높이 | 56px | 52px |
| 그림자 28, 64의 진하기 | 20% / 24% | 12% / 14% |
| 다크 모드 경고 글자색 | `#f98845` | `#faa06b` |

Fluent를 고르면 코드(`webLightTheme`, `webDarkTheme`) 값을 기준으로 하고, Figma의 위 세 값을 코드에 맞추면 됩니다.
