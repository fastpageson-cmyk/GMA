# Material Design 3

- 공식 문서: https://m3.material.io
- 컴포넌트 문서: https://material-web.dev
- 색 테마 만들기: https://material-foundation.github.io/material-theme-builder/

## 설치

```bash
cd design-system/material
npm ci
```

## 받는 것

| 패키지 | 내용 | 라이선스 |
|---|---|---|
| `@material/web` | 컴포넌트(Web Components), 토큰, 글자 단계 | Apache-2.0 |
| `@material/material-color-utilities` | 기준 색 하나로 전체 색 팔레트를 만드는 도구 | Apache-2.0 |
| `material-symbols` | 아이콘 폰트(Outlined, Rounded, Sharp) | Apache-2.0 |
| `@fontsource/roboto` | Roboto, Material 기본 폰트 | OFL-1.1 |
| `@fontsource-variable/roboto-flex` | Roboto Flex 가변 폰트 | OFL-1.1 |
| `@fontsource-variable/google-sans` | Google Sans 가변 폰트 | OFL-1.1 |
| `@fontsource-variable/google-sans-flex` | Google Sans Flex 가변 폰트 | OFL-1.1 |
| `@fontsource/google-sans-code` | Google Sans Code 고정폭 폰트 | OFL-1.1 |

## 파일 위치

- 토큰(Sass): `node_modules/@material/web/tokens/`
- 글자 단계 CSS: `node_modules/@material/web/typography/md-typescale-styles.css`
- 아이콘 폰트: `node_modules/material-symbols/`
- 폰트: `node_modules/@fontsource/*/`, `node_modules/@fontsource-variable/*/`

## 사용 예

번들러(Vite 등)를 쓰는 프로젝트에서 이렇게 불러옵니다.

```js
import '@fontsource-variable/google-sans';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import 'material-symbols/outlined.css';
import '@material/web/all.js';
```

```html
<md-filled-button>확인</md-filled-button>
<span class="material-symbols-outlined">search</span>
```

## 설치 확인

```bash
ls node_modules/@material/web/tokens | head -3
ls node_modules/material-symbols/*.woff2
ls node_modules/@fontsource-variable/google-sans/files | head -3
```

## Figma

팀 공유 파일(링크만 열면 됨): [열기](https://www.figma.com/design/vtsIW24M4Kt6p68FtjLu88/Material-3-Design-Kit--Community-)

원본 Google 공식 키트: [Material 3 Design Kit](https://www.figma.com/community/file/1035203688168086460)

색 테마를 바꾸려면 Figma 플러그인 "Material Theme Builder"를 함께 씁니다.
