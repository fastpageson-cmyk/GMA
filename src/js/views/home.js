// 홈: 큰 제목 → 30초 자격 체크 → 챗봇 질문 입력 → 필요한 것 고르기 → 놓치는 금액
import { CATEGORIES } from '../data/lookups.js';
import { esc, icon } from '../ui.js';

// 놓치는 금액 칸에 보여 줄 청년 정책 지원금 총액. 문구는 팀이 정한 값이다.
// 출처를 확인해 바꿀 때는 이 한 줄만 고치면 된다 (보도 기준 2026년 중앙정부 청년정책 예산은 약 30조 원).
const YOUTH_SUPPORT_TOTAL = '120조';

// 돼지 저금통 모양 (Material Symbols 'savings', 채운 모양과 테두리). 채운 모양으로 물을 잘라 저금통 안에 담는다
const PIG_FILL = 'M668.5-531.5Q680-543 680-560t-11.5-28.5Q657-600 640-600t-28.5 11.5Q600-577 600-560t11.5 28.5Q623-520 640-520t28.5-11.5ZM320-620h200v-60H320v60ZM180-120q-34-114-67-227.5T80-580q0-92 64-156t156-64h200q29-38 70.5-59t89.5-21q25 0 42.5 17.5T720-820q0 5-5 23-4 11-7.5 22.5T702-751l91 91h87v279l-113 37-67 224H480v-80h-80v80H180Z';
const PIG_LINE = 'M668.5-531.5Q680-543 680-560t-11.5-28.5Q657-600 640-600t-28.5 11.5Q600-577 600-560t11.5 28.5Q623-520 640-520t28.5-11.5ZM320-620h200v-60H320v60ZM180-120q-34-114-67-227.5T80-580q0-92 64-156t156-64h200q29-38 70.5-59t89.5-21q25 0 42.5 17.5T720-820q0 6-1.5 12t-3.5 11q-4 11-7.5 22.5T702-751l91 91h87v279l-113 37-67 224H480v-80h-80v80H180Zm45-60h115v-80h200v80h115l63-210 102-35v-175h-52L640-728q1-25 6.5-48.5T658-824q-38 10-72 29.5T534-740H300q-66.29 0-113.14 46.86Q140-646.29 140-580q0 103.16 29 201.58Q198-280 225-180Z';
// 물결 한 주기 480을 네 번 이어 그려(폭 1920), 절반(960)만큼 옮기면 처음 모양과 이어진다
const wavePath = (y, h) => `M0 ${y} Q120 ${y - h} 240 ${y} T480 ${y} T720 ${y} T960 ${y} T1200 ${y} T1440 ${y} T1680 ${y} T1920 ${y} V0 H0 Z`;

const piggy = () => `<svg class="piggy" viewBox="0 -960 960 960" aria-hidden="true">
  <defs><clipPath id="pig-clip"><path d="${PIG_FILL}"/></clipPath></defs>
  <g clip-path="url(#pig-clip)">
    <rect class="pig-empty" x="0" y="-960" width="960" height="960"/>
    <path class="pig-wave back" d="${wavePath(-450, 46)}"/>
    <path class="pig-wave front" d="${wavePath(-420, 36)}"/>
  </g>
  <path class="pig-line" d="${PIG_LINE}"/>
</svg>`;

// 문장을 타고 흘러내리는 물줄기. 위치(--x)와 늦춤(--d)을 달리해 줄줄 흐르게 한다
const RUNOFF = [[8, 0.2], [21, 1.1], [33, 0.6], [47, 1.6], [58, 0.1], [71, 0.9], [84, 1.4], [93, 0.5]];

export function home(root) {
  root.innerHTML = `
    <section class="hero">
      <h1 class="hero-title" tabindex="-1">장학부터 정부 지원까지<br>한번에</h1>
      <div class="hero-actions">
        <md-filled-button href="#/check">30초 자격 체크</md-filled-button>
        <p class="hero-sub">조건 고르고 내게 맞는 장학금, 정부 지원 찾기</p>
      </div>
      <form class="hero-search" role="search" id="home-ask">
        <div class="m3-search-bar">
          ${icon('help_center')}
          <input id="home-q" name="q" placeholder="챗봇에게 물어보기" aria-label="챗봇에게 물어보기" autocomplete="off">
          <md-icon-button type="submit" aria-label="보내기">${icon('send')}</md-icon-button>
        </div>
      </form>
    </section>

    <section class="section" aria-labelledby="need-title">
      <h2 class="section-title" id="need-title">필요한 것 고르기</h2>
      <div class="need-grid">
        ${CATEGORIES.map((c) => `<a class="need-tile m3-interactive" href="#/list?cat=${c.id}"><md-ripple></md-ripple><md-focus-ring></md-focus-ring>${icon(c.icon)}<span>${esc(c.label)}</span></a>`).join('')}
      </div>
    </section>

    <section class="section missed" aria-labelledby="missed-title">
      <h2 class="section-title" id="missed-title">내가 지금 놓치는 금액은?</h2>
      <div class="pig-scene">
        ${piggy()}
        <div class="pour" aria-hidden="true"><span class="stream"></span><i></i><i></i><i></i></div>
      </div>
      <div class="wet-block">
        <p class="missed-total">청년 정책 지원금 <strong>${YOUTH_SUPPORT_TOTAL}</strong></p>
        <div class="runoff" aria-hidden="true">${RUNOFF.map(([x, d]) => `<i style="--x:${x}%;--d:${d}s"></i>`).join('')}</div>
      </div>
    </section>`;

  root.querySelector('#home-ask').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = e.target.elements.q.value.trim();
    location.hash = q ? `#/ask?q=${encodeURIComponent(q)}` : '#/ask';
  });
}
