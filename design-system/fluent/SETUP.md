# Microsoft Fluent 2

- 공식 문서: https://fluent2.microsoft.design
- 컴포넌트 미리보기: https://react.fluentui.dev
- 소스: https://github.com/microsoft/fluentui

## 설치

```bash
cd design-system/fluent
npm ci
```

## 받는 것

| 패키지 | 내용 | 라이선스 |
|---|---|---|
| `@fluentui/react-components` | 컴포넌트(React), 테마 토큰(`webLightTheme`, `webDarkTheme`) | MIT |
| `@fluentui/react-icons` | Fluent 아이콘(React 컴포넌트) | MIT |
| `react`, `react-dom` (18) | Fluent가 요구하는 React | MIT |

설치 용량이 약 380MB로 네 시스템 중 가장 큽니다. 대부분이 아이콘 패키지이고, 컴포넌트 패키지가 이 아이콘 패키지를 필요로 해서 뺄 수 없습니다.

## 폰트: Segoe UI는 받을 수 없습니다

Fluent의 기본 폰트는 `Segoe UI`입니다. Windows에 들어 있는 Microsoft 폰트라서 따로 배포되지 않습니다. 그래서 Windows에서는 원래 모습으로 보이고, macOS에서는 테마에 지정된 대체 폰트(`-apple-system` 등)로 보입니다.

## 파일 위치

- 테마 토큰: `@fluentui/react-components`의 `webLightTheme`, `webDarkTheme` (JS 객체)
- 글자 스타일: `@fluentui/react-components`의 `typographyStyles`
- 아이콘: `node_modules/@fluentui/react-icons/`

## 사용 예

```jsx
import { FluentProvider, webLightTheme, Button } from '@fluentui/react-components';
import { CalendarMonthRegular } from '@fluentui/react-icons';

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Button appearance="primary" icon={<CalendarMonthRegular />}>확인</Button>
    </FluentProvider>
  );
}
```

## 설치 확인

```bash
ls node_modules/@fluentui/react-components/lib/index.js
ls node_modules/@fluentui/react-icons/package.json
```

## Figma

팀 공유 파일(링크만 열면 됨): [열기](https://www.figma.com/design/z93KF8UjOdylHlqZKcdng3/Microsoft-Fluent-2-Web--Community-)

원본 Microsoft 공식 키트: [Microsoft Fluent 2 Web](https://www.figma.com/community/file/836828295772957889)
