// 화면 틀과 주소 처리. 주소가 곧 화면이라 SNS 링크로 어느 혜택이든 바로 열린다.
import { alert } from './views/alert.js';
import { ask } from './views/ask.js';
import { check } from './views/check.js';
import { detail } from './views/detail.js';
import { home } from './views/home.js';
import { list } from './views/list.js';
import { findBenefit } from './ui.js';

/** 공유한 링크가 어떤 혜택인지 탭 제목만 봐도 알 수 있게 한다 */
function detailTitle([id]) {
  const b = findBenefit(id);
  return b ? `${b.title} · ${b.amount.text}` : '혜택 상세';
}

const ROUTES = [
  { path: /^\/$/, view: home, title: '닿음', nav: 'home' },
  { path: /^\/check$/, view: check, title: '자격 체크', nav: 'find' },
  { path: /^\/list$/, view: list, title: '맞춤 혜택 목록', nav: 'find' },
  { path: /^\/b\/([\w-]+)$/, view: detail, title: detailTitle, nav: 'find' },
  { path: /^\/ask$/, view: ask, title: '질문하기', nav: 'ask' },
  { path: /^\/alert$/, view: alert, title: '알림 받기', nav: 'alert' },
];

function parseHash() {
  const [path, search = ''] = location.hash.slice(1).split('?');
  return { path: path || '/', query: Object.fromEntries(new URLSearchParams(search)) };
}

let lastPath;

// 뒤로 가기로 돌아오면 보던 자리로 간다. 위치는 주소 기록 칸마다 적어 둔다. 새 칸은 비어 있어 맨 위에서 시작한다
history.scrollRestoration = 'manual';
let scrollTimer;
const rememberScroll = () => history.replaceState({ y: window.scrollY }, '');
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(rememberScroll, 150);
}, { passive: true });
document.addEventListener('click', rememberScroll, true);

function render() {
  clearTimeout(scrollTimer);
  const { path, query } = parseHash();
  const route = ROUTES.find((r) => r.path.test(path)) ?? ROUTES[0];
  const params = route.path.exec(path)?.slice(1) ?? [];
  const main = document.querySelector('#view');

  // 화면마다 새 요소로 갈아 끼워 이전 화면의 이벤트가 남지 않게 한다
  const fresh = main.cloneNode(false);
  main.replaceWith(fresh);
  route.view(fresh, { params, query, from: lastPath });
  lastPath = path;

  const title = typeof route.title === 'function' ? route.title(params) : route.title;
  document.title = title === '닿음' ? '닿음 · 나도 받을 수 있는 지금 열린 혜택' : `${title} · 닿음`;
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === route.nav) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.querySelector('#nav-drawer')?.close();
  window.scrollTo(0, history.state?.y ?? 0);
  fresh.querySelector('h1')?.focus({ preventScroll: true });
}

window.addEventListener('hashchange', render);
// 해시를 #view로 바꾸면 라우터가 홈으로 보내므로 주소는 두고 포커스만 옮긴다
document.querySelector('.skip-link').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#view').focus();
});

// 화면 부품은 CDN에서 온다. 약한 망에서는 늦게라도 그리고, 오래 걸리면 다시 시도할 길을 준다
const LOAD_LIMIT_MS = 10000;
const slow = setTimeout(() => {
  document.querySelector('#view').innerHTML = `<div class="narrow load-failed">
    <h1 class="page-title">화면을 불러오지 못했어요</h1>
    <p>인터넷 연결을 확인하고 다시 시도해 주세요.</p>
    <button class="retry-button m3-interactive" type="button">다시 시도</button>
  </div>`;
  document.querySelector('.retry-button').addEventListener('click', () => location.reload());
}, LOAD_LIMIT_MS);
await customElements.whenDefined('md-filled-button');
clearTimeout(slow);
render();
