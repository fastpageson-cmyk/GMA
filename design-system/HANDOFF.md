# 인수인계: 디자인 시스템 후보 3종

> **가장 쉬운 방법:** Claude Code에서 GMA 폴더를 열고 "뭐라는지 알려줘"라고 입력하세요. Claude가 이 문서를 읽고 순서대로 안내해 줍니다. 설치도 "설치해 줘" 한마디면 됩니다.

## 이 작업의 목적

GMA 프론트엔드를 **디자인 시스템 하나**로 통일해서, 누가 만든 화면이든 같은 색, 글꼴, 버튼, 간격으로 보이게 하려는 것입니다. 그 전에 후보 세 가지를 직접 써 보고 하나를 고릅니다.

## 건우가 한 일 (2026-10-30)

- 후보 세 가지를 골랐습니다: **Google Material 3**, **Uber Base Web**, **GitLab Pajamas**.
- 각 시스템의 컴포넌트, 폰트, 아이콘, 디자인 토큰을 받을 수 있게 `design-system/` 폴더에 정리했습니다. 버전도 고정해서 모두 같은 버전을 받습니다.
- 명령 한 줄(`node design-system/setup.mjs`)로 세 시스템을 모두 설치하고 확인하는 스크립트를 만들었습니다.
- 공식 문서와 Figma 키트 링크를 아래 표에 모았습니다.
- 프론트엔드 프레임워크(React, Vue 등)는 **아직 정하지 않았습니다.** 고르는 디자인 시스템에 따라 함께 정합니다.

## 할 일 (순서대로)

### 1. 설치하기 (약 5분)

Claude에게 **"설치해 줘"**라고 하면 끝입니다. 직접 하려면 아래처럼 합니다.

처음 받는 경우:

```bash
git clone https://github.com/fastpageson-cmyk/GMA.git
cd GMA
node design-system/setup.mjs
```

이미 받은 경우:

```bash
git pull
node design-system/setup.mjs
```

- 준비물: Git, Node.js 18 이상. `node -v`로 버전을 확인합니다. 없으면 https://nodejs.org 에서 LTS를 설치합니다.
- 합쳐서 약 300MB를 받습니다. 받은 파일(`node_modules/`)은 커밋되지 않습니다.
- 마지막에 "세 디자인 시스템 설치와 확인이 모두 끝났습니다."가 나오면 성공입니다.

### 2. 세 시스템 둘러보기 (약 30분)

아래 링크를 열어서 분위기, 컴포넌트 종류, 문서가 얼마나 친절한지 봅니다. Figma 키트는 "Open in Figma" 또는 "복사본 받기"를 누르면 내 Figma에 복사됩니다. 무료 Figma 계정이 필요합니다.

| | 공식 문서 | 컴포넌트 미리보기 | Figma 키트 |
|---|---|---|---|
| Material 3 | https://m3.material.io | https://material-web.dev | [Material 3 Design Kit](https://www.figma.com/community/file/1035203688168086460) |
| Uber Base | https://baseweb.design | https://baseweb.design/components/ | [Base Gallery](https://www.figma.com/community/file/805195278314519508) |
| GitLab Pajamas | https://design.gitlab.com | https://gitlab-org.gitlab.io/gitlab-ui/ | [Pajamas Component library](https://www.figma.com/community/file/781156790581391771) |

시스템별 자세한 내용은 각 폴더의 `SETUP.md`에 있습니다: [material](material/SETUP.md), [base-web](base-web/SETUP.md), [pajamas](pajamas/SETUP.md).

### 3. 의견 남기기 (약 10분)

마음에 드는 시스템 하나와 그 이유를 팀 대화방에 남깁니다. 아래 세 가지를 보면 고르기 쉽습니다.

- 우리 서비스 분위기에 맞는지
- 필요한 컴포넌트(버튼, 입력창, 표, 모달 등)가 다 있는지
- Figma 키트를 바로 쓸 수 있는지

### 4. 그 뒤 (건우가 진행)

하나로 정해지면 그 시스템에 맞춰 프레임워크를 정하고 `src/`에서 개발을 시작합니다.

## 알아 두면 좋은 점

- **Uber Base의 폰트(Uber Move)는 받을 수 없습니다.** Uber 전용 폰트라서 대신 운영체제 기본 폰트로 보입니다. 구해서 넣지 마세요. 이 레포는 공개 레포입니다.
- **Uber Base Gallery Figma 파일은** Uber 내부 라이브러리와 연결되어 있어서, 복사해도 Assets 패널에 컴포넌트가 바로 나오지 않을 수 있습니다. 보고 참고하는 용도로는 문제없습니다.
- **Pajamas는 Vue 2 전용, Base Web은 React 전용입니다.** Material은 어느 프레임워크에서나 씁니다.
- **패키지를 추가하거나 버전을 올릴 때는 팀에 먼저 알려 주세요.** `package-lock.json`이 바뀌면 그 변경을 커밋해야 다른 사람도 같은 버전을 받습니다.

## 문제가 생기면

| 증상 | 해결 |
|---|---|
| `node: command not found` | https://nodejs.org 에서 LTS 설치 후 터미널을 다시 엽니다. |
| `Node.js 18 이상이 필요합니다` | Node.js를 최신 LTS로 업데이트합니다. |
| `npm ci` 중 네트워크 오류 | 인터넷 연결을 확인하고 `node design-system/setup.mjs`를 다시 실행합니다. |
| `design-system` 폴더가 안 보임 | `git pull`을 실행합니다. 그래도 없으면 `git checkout main` 후 다시 `git pull`. |

Claude에게 오류 메시지를 그대로 붙여 넣어도 해결해 줍니다.
