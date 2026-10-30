# design-system

GMA 프론트엔드를 하나의 디자인 시스템으로 통일하기 위한 후보 3종을 모아 둔 폴더입니다.

라이브러리 코드와 폰트 파일은 레포에 직접 넣지 않았습니다. 각 폴더의 `package.json`과 `package-lock.json`이 받을 패키지와 버전을 고정해 두므로, 설치 스크립트를 실행하면 모두 같은 버전을 받습니다.

처음 받는 분은 [HANDOFF.md](HANDOFF.md)부터 읽어 주세요. 설치는 Claude에게 "설치해 줘"라고 하면 됩니다.

## 후보 비교

| | Material 3 | Uber Base Web | GitLab Pajamas |
|---|---|---|---|
| 폴더 | [material/](material/SETUP.md) | [base-web/](base-web/SETUP.md) | [pajamas/](pajamas/SETUP.md) |
| 컴포넌트 | `@material/web` (Web Components) | `baseui` (React 18 + Styletron) | `@gitlab/ui` (Vue 2.7 + Tailwind 3) |
| 프레임워크 제약 | 없음. React·Vue·순수 HTML 어디서나 동작 | React 전용 | Vue 2 전용 |
| 기본 폰트 | Roboto, Roboto Flex (+ Google Sans, Google Sans Flex, Google Sans Code) | Uber Move — **비공개, 받을 수 없음** | GitLab Sans, GitLab Mono |
| 아이콘 | Material Symbols | `baseui/icon` 내장 | `@gitlab/svgs` |
| 디자인 토큰 | `@material/web/tokens` (Sass) | `baseui/themes`, `baseui/tokens` (JS) | `tokens.css`, `tokens.dark.css` (CSS 변수) |
| 라이선스 | Apache-2.0 / 폰트 OFL-1.1 | MIT | MIT / 폰트 OFL-1.1 |
| 공식 문서 | https://m3.material.io | https://baseweb.design | https://design.gitlab.com |
| Figma 키트 | [Material 3 Design Kit](https://www.figma.com/community/file/1035203688168086460) | [Base Gallery](https://www.figma.com/community/file/805195278314519508) | [Pajamas Component library](https://www.figma.com/community/file/781156790581391771) |

## 고를 때 볼 점

- **프레임워크가 아직 정해지지 않았습니다.** 시스템을 고르면 프레임워크도 사실상 함께 정해집니다. Base Web은 React, Pajamas는 Vue 2를 쓰고, Material은 둘 다 가능합니다.
- **폰트까지 같은 화면을 만들 수 있는지 확인해 주세요.** Base Web의 Uber Move는 공개 폰트가 아니라서 `system-ui`로 대체해야 합니다. 그래서 공식 문서의 화면과 똑같이 보이지 않습니다.

## 폴더 구조

```
design-system/
├── README.md        # 이 문서
├── HANDOFF.md       # 시작 가이드: 필요한 프로그램, 3단계 진행 순서
├── setup.mjs        # 세 시스템 설치 + 확인 스크립트
├── compare.html     # 세 시스템 색·글자·모서리·그림자·버튼 비교 페이지
├── material/        # package.json, package-lock.json, SETUP.md, figma/
├── base-web/        # package.json, package-lock.json, SETUP.md, figma/
└── pajamas/         # package.json, package-lock.json, SETUP.md, figma/
```

각 `figma/` 폴더에는 Figma 키트에서 뽑은 색·글자·그림자 값(`tokens.json`), 설명(`README.md`), 표지와 버튼 스크린샷이 있습니다.
