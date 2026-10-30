# GitLab Pajamas

- 공식 문서: https://design.gitlab.com
- 컴포넌트 미리보기: https://gitlab-org.gitlab.io/gitlab-ui/
- 소스: https://gitlab.com/gitlab-org/gitlab-ui

## 설치

```bash
cd design-system/pajamas
npm ci
```

## 받는 것

| 패키지 | 내용 | 라이선스 |
|---|---|---|
| `@gitlab/ui` | 컴포넌트(Vue 2), 디자인 토큰, Tailwind 설정 | MIT |
| `@gitlab/svgs` | 아이콘, 일러스트 | MIT |
| `@gitlab/fonts` | GitLab Sans, GitLab Mono 폰트 | OFL-1.1 |
| `vue` (2.7), `tailwindcss` (3), `pikaday`, `dompurify`, `emoji-regex` | `@gitlab/ui`가 요구하는 패키지 | MIT 등 |

`@gitlab/ui`는 Vue 2.7에서만 동작합니다. Vue 3에서는 쓸 수 없습니다.

## 파일 위치

- 토큰(CSS 변수): `node_modules/@gitlab/ui/src/tokens/build/css/tokens.css`, `tokens.dark.css`
- 토큰(JS): `node_modules/@gitlab/ui/dist/tokens/build/js/tokens.js`
- 컴포넌트 CSS: `node_modules/@gitlab/ui/dist/index.css`
- 아이콘: `node_modules/@gitlab/svgs/dist/icons.svg`, 이름 목록은 `icons.json`
- 폰트: `node_modules/@gitlab/fonts/gitlab-sans/`, `node_modules/@gitlab/fonts/gitlab-mono/`

## 사용 예

```js
import Vue from 'vue';
import '@gitlab/ui/dist/index.css';
import { GlButton } from '@gitlab/ui';

new Vue({
  components: { GlButton },
  template: '<gl-button variant="confirm">확인</gl-button>',
}).$mount('#app');
```

## 설치 확인

```bash
ls node_modules/@gitlab/ui/src/tokens/build/css
ls node_modules/@gitlab/fonts/gitlab-sans
ls node_modules/@gitlab/svgs/dist/icons.svg
```

## Figma

Figma 커뮤니티에서 "Pajamas UI Kit"를 검색하면 GitLab 공식 키트가 나옵니다. 레포에는 넣지 않습니다.
