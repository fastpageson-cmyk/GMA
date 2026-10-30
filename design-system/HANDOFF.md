# 인수인계: 디자인 시스템 후보 3종

## 1. 지금 상황

- Material 3, Uber Base Web, GitLab Pajamas 세 가지를 후보로 준비했습니다.
- 프론트엔드 프레임워크는 아직 정하지 않았습니다.
- 각자 세 시스템을 받아서 써 보고, 하나를 골라 그 시스템으로 화면을 통일하는 것이 목표입니다.

## 2. 준비물

- Git
- Node.js 18 이상과 npm. `node -v`로 확인합니다.

## 3. 받는 법

처음이면 레포를 clone합니다.

```bash
git clone https://github.com/fastpageson-cmyk/GMA.git
cd GMA
```

이미 받았다면 최신 내용을 가져옵니다.

```bash
git pull
```

그다음 세 시스템을 모두 설치합니다. 반드시 `npm install`이 아니라 `npm ci`를 쓰세요. `npm ci`는 `package-lock.json`에 적힌 버전 그대로 설치해서 모두 같은 버전을 받게 해 줍니다.

```bash
cd design-system/material && npm ci && cd ../base-web && npm ci && cd ../pajamas && npm ci && cd ../..
```

설치에 몇 분 걸리고, 합쳐서 약 300MB를 받습니다. `node_modules/`는 `.gitignore`에 들어 있어서 커밋되지 않습니다.

## 4. Claude로 받기

Claude Code에서 GMA 폴더를 열고 아래 문장을 그대로 붙여 넣으면 됩니다.

> `design-system/HANDOFF.md`를 읽고 3번 "받는 법"대로 세 디자인 시스템을 설치해 줘. 그다음 각 폴더 `SETUP.md`의 "설치 확인" 명령을 실행해서 결과를 알려 줘. `package.json`과 `package-lock.json`은 수정하지 마.

## 5. 설치 확인

각 폴더의 `SETUP.md`에 있는 "설치 확인" 명령을 실행합니다. 폰트, 토큰, 아이콘 파일이 나오면 설치가 끝난 것입니다.

## 6. 규칙

- **패키지를 추가하거나 버전을 올릴 때는 팀에 먼저 알려 주세요.** `npm install <패키지>`를 실행하면 `package-lock.json`이 바뀌고, 그 변경을 커밋해야 다른 사람도 같은 버전을 받습니다.
- **`node_modules/`나 폰트 파일을 직접 커밋하지 마세요.** 모두 npm으로 받습니다.
- **Uber Move 폰트는 구해서 넣지 마세요.** 비공개 폰트이고, 이 레포는 공개 레포입니다.
- **시스템끼리 섞어 쓰지 마세요.** 예를 들어 Material 버튼과 Pajamas 입력창을 한 화면에 쓰지 않습니다.

## 7. 다음 단계

1. 각자 세 시스템의 공식 문서와 컴포넌트를 둘러봅니다. 링크는 [README.md](README.md)에 있습니다.
2. 같은 화면 하나(예: 로그인 화면)를 기준으로 비교합니다.
3. 하나를 고르고, 그 시스템에 맞춰 프레임워크를 정합니다.
4. 고르지 않은 두 폴더를 지우고, `src/`에서 실제 개발을 시작합니다.
