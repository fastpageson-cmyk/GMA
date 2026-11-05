// 홈: 큰 제목 → 30초 자격 체크 → 챗봇 질문 입력 → 필요한 것 고르기
import { CATEGORIES } from '../data/lookups.js';
import { esc, icon } from '../ui.js';

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
    </section>`;

  root.querySelector('#home-ask').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = e.target.elements.q.value.trim();
    location.hash = q ? `#/ask?q=${encodeURIComponent(q)}` : '#/ask';
  });
}
