# GitLab Pajamas — Figma에서 가져온 값

- 원본: [Pajamas Component library (Figma Community)](https://www.figma.com/community/file/781156790581391771)
- 추출일: 2026-10-30

## 들어 있는 파일

| 파일 | 내용 |
|---|---|
| `tokens.json` | 글자 스타일 20종(제목은 화면 폭별 2크기), 그림자 3단계, 배지 변수 |
| `cover.png` | 키트 표지 |
| `buttons.png` | 버튼 스티커 시트 |

## 키트 구성

- 글자 스타일 64개, 그림자 17개(그중 다수가 DEPRECATED), 로컬 변수 3개.
- **색 변수는 이 파일에 없습니다.** GitLab 내부 "Design tokens" 라이브러리에 있어서 커뮤니티 복사본에서는 읽을 수 없습니다. 색은 npm의 `@gitlab/ui` `tokens.css`, `tokens.dark.css`를 기준으로 씁니다.
- 컴포넌트 페이지: Accordion, Alert, Avatar, Attribute list, Badge, Banner, Breadcrumb, Broadcast message, Button, Button group, Card, Date picker, Drawer, Dropdown, Forms, Label, Link, Modal, Pagination, Popover, Progress bar, Skeleton loader, Sorting, Spinner, Table, Tabs, Toast, Toggle, Token, Tooltip, Tree

## 코드(npm)와 비교

- 폰트는 GitLab Sans, GitLab Mono로 `@gitlab/fonts`와 같습니다.
- 글자 크기는 아직 코드 토큰과 하나씩 맞춰 보지 않았습니다.
