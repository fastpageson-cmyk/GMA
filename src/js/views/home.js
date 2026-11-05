// 홈: 큰 제목 → 30초 자격 체크 → 챗봇 질문 입력 → 필요한 것 고르기 → 놓치는 금액
import { CATEGORIES } from '../data/lookups.js';
import { esc, icon } from '../ui.js';

// 놓치는 금액 칸에 보여 줄 청년 정책 지원금 총액. 문구는 팀이 정한 값이다.
// 출처를 확인해 바꿀 때는 이 한 줄만 고치면 된다 (보도 기준 2026년 중앙정부 청년정책 예산은 약 30조 원).
const YOUTH_SUPPORT_TOTAL = '120조';

// 물결 한 주기(600)를 두 번 이어 그려, 절반만큼 옮기면 처음 모양과 이어진다
const WAVE = 'M0 14 Q150 0 300 14 T600 14 T900 14 T1200 14 V48 H0 Z';
const wave = (cls) => `<svg class="wave ${cls}" viewBox="0 0 1200 48" preserveAspectRatio="none" aria-hidden="true"><path d="${WAVE}"/></svg>`;

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
      <md-icon class="piggy" aria-hidden="true">savings</md-icon>
      <div class="water" aria-hidden="true">${wave('back')}${wave('front')}</div>
      <p class="missed-total">지금 청년 정책 지원금 <strong>${YOUTH_SUPPORT_TOTAL}</strong></p>
    </section>`;

  root.querySelector('#home-ask').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = e.target.elements.q.value.trim();
    location.hash = q ? `#/ask?q=${encodeURIComponent(q)}` : '#/ask';
  });
}
