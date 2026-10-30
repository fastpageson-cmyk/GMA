# Uber Base Web

- 공식 문서: https://baseweb.design
- 소스: https://github.com/uber/baseweb

## 설치

```bash
cd design-system/base-web
npm ci
```

## 받는 것

| 패키지 | 내용 | 라이선스 |
|---|---|---|
| `baseui` | 컴포넌트(React), 테마, 아이콘 | MIT |
| `styletron-engine-monolithic`, `styletron-react` | Base Web이 스타일을 입힐 때 쓰는 엔진 | MIT |
| `react`, `react-dom` (18) | Base Web이 요구하는 React | MIT |

## 폰트: Uber Move는 받을 수 없습니다

Base Web의 기본 폰트는 `UberMove`, `UberMoveText`입니다. 이 폰트는 Uber 전용이라 공개 배포가 없습니다. 테마에는 `system-ui` 대체 폰트가 함께 지정되어 있어서, 폰트를 따로 넣지 않으면 운영체제 기본 폰트로 보입니다.

다른 폰트를 쓰고 싶으면 테마를 만들 때 `typography`를 바꿉니다. 어떤 폰트로 할지는 팀이 정합니다.

## 파일 위치

- 테마: `node_modules/baseui/themes/` (`light-theme`, `dark-theme`)
- 색 토큰: `node_modules/baseui/tokens/`
- 아이콘: `node_modules/baseui/icon/`

## 사용 예

```jsx
import { Client as Styletron } from 'styletron-engine-monolithic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import { Button } from 'baseui/button';

const engine = new Styletron();

export default function App() {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Button>확인</Button>
      </BaseProvider>
    </StyletronProvider>
  );
}
```

## 설치 확인

```bash
ls node_modules/baseui/themes
ls node_modules/baseui/tokens
ls node_modules/baseui/button | head -3
```

## Figma

팀 공유 파일(링크만 열면 됨): [열기](https://www.figma.com/design/09cjcozFxN8qeM9ifoZXBf/Base-Gallery--Community-)

원본 Uber 공식 키트: [Base Gallery](https://www.figma.com/community/file/805195278314519508)

이 파일은 Uber 내부 라이브러리와 연결되어 있어서, 복사해도 Assets 패널에 컴포넌트가 바로 나오지 않을 수 있습니다. 화면과 컴포넌트를 참고하는 용도로 씁니다.
