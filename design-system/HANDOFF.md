# 디자인 시스템 시작 가이드

## 지금 하는 일

GMA 화면을 **디자인 시스템 하나**로 통일하려고 합니다. 후보는 Google Material 3, Uber Base Web, GitLab Pajamas 세 가지입니다. 각자 세 가지를 설치해서 둘러보고, 마음에 드는 하나를 고르는 단계입니다.

설치와 확인은 Claude가 합니다. 사람이 할 일은 아래 3단계뿐입니다.

## 1단계: 프로그램 3개 설치 (처음 한 번만)

순서대로 설치합니다. 이미 있으면 건너뜁니다.

| 순서 | 프로그램 | 다운로드 링크 | 무엇을 받나 |
|---|---|---|---|
| 1 | Git | https://git-scm.com/downloads | 내 운영체제(macOS/Windows) 버전 |
| 2 | Node.js | https://nodejs.org/ko/download | **LTS** 버전 |
| 3 | Claude 데스크톱 앱 | https://claude.com/download | 설치 후 로그인, 왼쪽 위 **Code** 탭 사용 |

Figma 키트를 열어 보려면 무료 Figma 계정도 필요합니다: https://www.figma.com/signup

## 2단계: Claude에게 한 줄 입력

Claude 앱의 **Code** 탭에서 새 세션을 열고, 아래 문장을 그대로 붙여 넣습니다.

```
https://github.com/fastpageson-cmyk/GMA 레포를 받고, 레포의 CLAUDE.md를 읽은 뒤 거기 적힌 대로 design-system 설치해 줘
```

이미 GMA 폴더가 있다면 그 폴더를 열고 **"설치해 줘"**만 입력하면 됩니다.

Claude가 레포 받기, 설치, 확인, 둘러볼 링크 정리까지 알아서 합니다. 중간에 폴더 위치나 권한을 물으면 허용하면 됩니다. 5분쯤 걸립니다.

## 2-1단계 (선택): Figma 키트를 내 Figma로 복사하기

Figma에서 직접 만져 보고 싶을 때만 합니다. 색, 글자, 그림자 값과 스크린샷은 이미 레포의 `design-system/<시스템>/figma/` 폴더에 들어 있어서, 보기만 할 거라면 건너뛰어도 됩니다.

1. 아래 링크 3개를 하나씩 엽니다. Figma에 로그인되어 있어야 합니다.
   - [Material 3 Design Kit](https://www.figma.com/community/file/1035203688168086460)
   - [Base Gallery](https://www.figma.com/community/file/805195278314519508)
   - [Pajamas Component library](https://www.figma.com/community/file/781156790581391771)
2. 각 페이지 오른쪽 위의 **"Open in Figma"**(한국어 화면은 "Figma에서 열기")를 누릅니다. 내 Figma의 **Drafts**에 복사본이 생깁니다.
3. 끝입니다. 복사본은 마음대로 수정해도 원본과 다른 사람에게 영향이 없습니다.

복사본의 값을 Claude가 다시 읽어 오게 하려면, 열린 파일의 주소창 URL을 Claude에게 붙여 넣고 **"이 Figma에서 토큰 뽑아 줘"**라고 하면 됩니다. 이때는 Claude 앱 설정의 커넥터(Connectors)에서 **Figma**를 연결해 둬야 합니다.

## 3단계: 둘러보고 의견 남기기

가장 먼저 Claude에게 **"비교 페이지 열어 줘"**라고 하세요. 세 시스템의 색, 글자, 모서리, 그림자, 버튼이 한 화면에 나란히 나옵니다. 더 보고 싶으면 아래 링크를 열어 봅니다. 각 시스템의 버튼 모음과 색·글자 값은 `design-system/<시스템>/figma/README.md`에서 바로 볼 수 있습니다. 그다음 마음에 드는 시스템 하나와 이유를 팀 대화방에 남깁니다.

| | 공식 문서 | 컴포넌트 미리보기 | Figma 키트 |
|---|---|---|---|
| Material 3 | https://m3.material.io | https://material-web.dev | [Material 3 Design Kit](https://www.figma.com/community/file/1035203688168086460) |
| Uber Base | https://baseweb.design | https://baseweb.design/components/ | [Base Gallery](https://www.figma.com/community/file/805195278314519508) |
| GitLab Pajamas | https://design.gitlab.com | https://gitlab-org.gitlab.io/gitlab-ui/ | [Pajamas Component library](https://www.figma.com/community/file/781156790581391771) |

고를 때 볼 점:

- 우리 서비스 분위기에 맞는지
- 필요한 컴포넌트(버튼, 입력창, 표, 모달 등)가 다 있는지
- Figma 키트를 바로 쓸 수 있는지

## 막히면

오류 메시지를 Claude에게 그대로 붙여 넣으세요. 해결 방법은 Claude가 알고 있습니다.
