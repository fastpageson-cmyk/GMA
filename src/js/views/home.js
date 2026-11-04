// 홈: 큰 제목 → 30초 자격 체크 → 질문 입력 → 필요한 것 고르기 → 곧 마감
import { CATEGORIES } from '../data/lookups.js';
import { benefitCard, esc, icon, openBenefits } from '../ui.js';
import { daysLeft } from '../judge.js';
import { getProfile } from '../store.js';

export function home(root) {
  const profile = getProfile();
  const soon = openBenefits()
    .filter((b) => daysLeft(b) !== null)
    .sort((a, b) => daysLeft(a) - daysLeft(b))
    .slice(0, 6);

  root.innerHTML = `
    <section class="hero">
      <div class="hero-main">
      <h1 class="hero-title" tabindex="-1">나도 받을 수 있는<br>지금 열린 혜택</h1>
      <p class="hero-sub">조건 몇 가지만 고르면 받을 수 있는 혜택과 금액을 바로 알려 드려요. 로그인은 없어요.</p>
      <div class="hero-actions">
        <md-filled-button href="#/check">30초 자격 체크</md-filled-button>
        ${profile ? '<md-outlined-button href="#/list">내 혜택 다시 보기</md-outlined-button>' : ''}
      </div>
      <form class="m3-search-bar hero-search" role="search" id="home-ask">
        ${icon('search')}
        <input name="q" aria-label="내 상황을 문장으로 물어보기" placeholder="용인 사는 24살 대학생인데 토익 지원 있어?" autocomplete="off">
        <md-icon-button type="submit" aria-label="보내기">${icon('send')}</md-icon-button>
      </form>
      </div>
      ${soon.length ? `<div class="hero-side">
        <h2 class="section-title">가장 먼저 끝나요</h2>
        ${soon.slice(0, 2).map((b) => benefitCard(b, profile)).join('')}
      </div>` : ''}
    </section>

    <section class="section" aria-labelledby="need-title">
      <h2 class="section-title" id="need-title">필요한 것 고르기</h2>
      <div class="need-grid">
        ${CATEGORIES.map((c) => `<a class="need-tile m3-interactive" href="#/list?cat=${c.id}"><md-ripple></md-ripple><md-focus-ring></md-focus-ring>${icon(c.icon)}<span>${esc(c.label)}</span></a>`).join('')}
      </div>
    </section>

    <section class="section" aria-labelledby="soon-title">
      <div class="section-head">
        <h2 class="section-title" id="soon-title">곧 마감</h2>
        <md-text-button href="#/list">전체 보기</md-text-button>
      </div>
      ${soon.length ? `<div class="card-grid four soon-grid">${soon.map((b) => benefitCard(b, profile)).join('')}</div>` : '<p class="empty">마감이 정해진 혜택이 지금은 없어요.</p>'}
    </section>`;

  root.querySelector('#home-ask').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = e.target.elements.q.value.trim();
    location.hash = q ? `#/ask?q=${encodeURIComponent(q)}` : '#/ask';
  });
}
