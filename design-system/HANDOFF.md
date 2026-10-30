# 디자인 시스템 시작 가이드

## 지금 하는 일

GMA 화면을 **디자인 시스템 하나**로 통일하려고 합니다. 후보는 Google Material 3, Uber Base Web, GitLab Pajamas, Microsoft Fluent 2 네 가지입니다. 각자 네 가지를 설치해서 둘러보고, 마음에 드는 하나를 고르는 단계입니다.

설치와 확인은 Claude가 합니다. 사람이 할 일은 아래 3단계뿐입니다.

## 1단계: 프로그램 3개 설치 (처음 한 번만)

순서대로 설치합니다. 이미 있으면 건너뜁니다.

| 순서 | 프로그램 | 다운로드 링크 | 무엇을 받나 |
|---|---|---|---|
| 1 | Git | https://git-scm.com/downloads | 내 운영체제(macOS/Windows) 버전 |
| 2 | Node.js | https://nodejs.org/ko/download | **LTS** 버전 |
| 3 | Claude 데스크톱 앱 | https://claude.com/download | 설치 후 로그인, 왼쪽 위 **Code** 탭 사용 |

Figma 파일을 열어 보려면 무료 Figma 계정도 필요합니다: https://www.figma.com/signup

## 2단계: Claude에게 한 줄 입력

Claude 앱의 **Code** 탭에서 새 세션을 열고, 아래 문장을 그대로 붙여 넣습니다.

```
https://github.com/fastpageson-cmyk/GMA 레포를 받아 줘. 이미 내 컴퓨터에 있으면 그 폴더에서 최신으로 업데이트해 줘. 그다음 레포의 CLAUDE.md를 읽고 거기 적힌 순서대로 ① design-system 설치 ② 비교 페이지 열기까지 해 줘. 끝나면 지금 우리가 뭘 하는 중인지, 내가 할 일이 뭔지(Figma 파일 보기, 의견 남기기) 짧게 알려 줘.
```

Claude가 레포 받기, 설치, 확인, 비교 페이지 열기까지 알아서 합니다. 중간에 폴더 위치나 권한을 물으면 허용하면 됩니다. 5~10분쯤 걸립니다.

## 3단계: 둘러보고 의견 남기기

1. Claude가 연 **비교 페이지**에서 네 시스템의 색, 글자, 모서리, 그림자, 버튼을 나란히 봅니다.
2. 더 자세히 보고 싶으면 아래 **Figma 파일** 링크를 엽니다. 팀이 함께 보는 파일이라 복사할 필요 없이 링크만 열면 됩니다.
3. 마음에 드는 시스템 하나와 이유를 팀 대화방에 남깁니다.

| | Figma 파일 (팀 공유) | 공식 문서 | 컴포넌트 미리보기 |
|---|---|---|---|
| Material 3 | [Material 3 Design Kit](https://www.figma.com/design/vtsIW24M4Kt6p68FtjLu88/Material-3-Design-Kit--Community-) | https://m3.material.io | https://material-web.dev |
| Uber Base | [Base Gallery](https://www.figma.com/design/09cjcozFxN8qeM9ifoZXBf/Base-Gallery--Community-) | https://baseweb.design | https://baseweb.design/components/ |
| GitLab Pajamas | [Pajamas Component library](https://www.figma.com/design/P2m2ca70FaXbA8Mq5rT3KG/Component-library--Community-) | https://design.gitlab.com | https://gitlab-org.gitlab.io/gitlab-ui/ |
| Microsoft Fluent 2 | [Fluent 2 Web](https://www.figma.com/design/z93KF8UjOdylHlqZKcdng3/Microsoft-Fluent-2-Web--Community-) | https://fluent2.microsoft.design | https://react.fluentui.dev |

고를 때 볼 점:

- 우리 서비스 분위기에 맞는지
- 필요한 컴포넌트(버튼, 입력창, 표, 모달 등)가 다 있는지
- Figma 파일을 바로 쓸 수 있는지

Figma 파일은 보기 전용입니다. 직접 고쳐 보고 싶으면 Figma 상단 파일 이름 옆 메뉴에서 **"복사본 만들기"(Duplicate)**를 누르면 내 Drafts에 내 것이 생깁니다.

## 막히면

오류 메시지를 Claude에게 그대로 붙여 넣으세요. 해결 방법은 Claude가 알고 있습니다.
