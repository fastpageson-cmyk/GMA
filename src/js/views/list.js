// 맞춤 혜택 목록: 정부 정책과 학교 장학을 한 목록에. 모집 중이 기본, 대상 아님·마감은 접어 둔다.
// 걸러보기(지원 형태·분야·모집 중·정렬)는 제목 바로 아래 가로 띠에 칩으로 둔다.
import { BENEFITS } from '../data/benefits.js';
import { CATEGORIES, categoryLabel, SUPPORT_TYPES, supportLabel } from '../data/lookups.js';
import { benefitCard, cardGrid, esc, fold, profileSummary, rankBenefits } from '../ui.js';
import { daysLeft, effectiveStatus, judge } from '../judge.js';
import { getProfile } from '../store.js';

// 상세에 다녀올 때만 걸러보기를 이어 간다. 다른 길로 들어오면 전체 목록에서 시작한다
const filters = { openOnly: true, types: new Set(), cats: new Set(), sort: 'deadline' };

const amountOf = (b) => b.amount?.maxWon ?? 0;
const SORTS = {
  deadline: (a, b) => (daysLeft(a) ?? 9999) - (daysLeft(b) ?? 9999),
  amount: (a, b) => amountOf(b) - amountOf(a),
};

const SORT_LABELS = { deadline: '마감 빠른 순', amount: '금액 큰 순' };

/** 가로 걸러보기 띠. 줄마다 이름표 하나와 칩 여러 개 */
function filterBar() {
  const chip = (group, id, label, on) => `<md-filter-chip label="${esc(label)}" data-group="${group}" data-id="${id}"${on ? ' selected' : ''}></md-filter-chip>`;
  const row = (title, chips) => `<div class="filter-row"><p class="filter-name">${title}</p><md-chip-set aria-label="${title}">${chips}</md-chip-set></div>`;
  return `
    ${row('지원 형태', SUPPORT_TYPES.map((t) => chip('types', t.id, t.label, filters.types.has(t.id))).join(''))}
    ${row('분야', CATEGORIES.map((c) => chip('cats', c.id, c.label, filters.cats.has(c.id))).join(''))}
    <div class="filter-row">
      <p class="filter-name">정렬</p>
      <md-chip-set aria-label="정렬">${Object.entries(SORT_LABELS).map(([id, label]) => chip('sort', id, label, filters.sort === id)).join('')}</md-chip-set>
      <label class="open-only"><span>모집 중만</span><md-switch data-filter="openOnly"${filters.openOnly ? ' selected' : ''} aria-label="모집 중만"></md-switch></label>
    </div>`;
}

function matches(b) {
  if (filters.types.size && !filters.types.has(b.support)) return false;
  if (filters.cats.size && !filters.cats.has(b.category)) return false;
  return true;
}

const activeFilters = () => [...[...filters.types].map((id) => ['types', id, supportLabel(id)]), ...[...filters.cats].map((id) => ['cats', id, categoryLabel(id)])];

/** 목록에 카드로 나오는 수. 대상 아님은 접혀 있어 세지 않는다 */
const shownCount = (profile) => BENEFITS.filter(matches)
  .filter((b) => effectiveStatus(b).status === 'open' && (!profile || judge(b, profile).verdict !== 'no')).length;

/** 0건일 때 지우면 가장 많이 나오는 걸러보기 하나를 알려 준다 */
function clearSuggestion(profile) {
  const best = activeFilters().map(([group, id, label]) => {
    filters[group].delete(id);
    const count = shownCount(profile);
    filters[group].add(id);
    return { label, count };
  }).sort((a, b) => b.count - a.count)[0];
  return best?.count ? `‘${best.label}’ 걸러보기를 지우면 ${best.count}개가 나와요.` : '걸러보기를 줄여 보세요.';
}

/** 목록 제목. 걸러보기 띠 위에 따로 그린다 */
export function resultHeading(profile) {
  const open = BENEFITS.filter(matches).filter((b) => effectiveStatus(b).status === 'open');
  const scope = activeFilters().length ? `${activeFilters().map(([, , label]) => label).join('·')} ` : '';
  if (!profile) return `지금 열린 ${scope}혜택 ${open.length}개`;
  return `내 조건에 맞는 ${scope}혜택 ${open.filter((b) => judge(b, profile).verdict !== 'no').length}개`;
}

/** 열린 혜택은 한 목록으로 보여 준다. 받을 수 있는 것이 앞에 오고, 대상 아님·곧 열림·마감은 접어 둔다 */
export function results(profile) {
  const all = BENEFITS.filter(matches);
  const by = (status) => all.filter((b) => effectiveStatus(b).status === status);
  const open = by('open');
  const fits = open.filter((b) => judge(b, profile).verdict !== 'no');
  const no = open.filter((b) => judge(b, profile).verdict === 'no');
  const upcoming = by('upcoming');
  const closed = by('closed');
  // 고른 정렬을 따르고, 값이 같으면 조건이 더 확실한 것이 앞선다
  const order = (items) => rankBenefits(items, profile).sort(SORTS[filters.sort]);

  const folded = upcoming.length || no.length || closed.length;
  const empty = `<div class="empty-card"><p class="empty-title">이 조건으로는 지금 열린 혜택이 없어요.</p>
    <p>${clearSuggestion(profile)}${folded ? ' 아래 접어 둔 혜택도 살펴보세요.' : ''}</p>
    <md-outlined-button id="reset-filters">걸러보기 지우기</md-outlined-button></div>`;

  return `
    ${fits.length ? `<section class="verdict-group"><h2 class="visually-hidden">혜택 목록</h2>${cardGrid(order(fits), profile)}</section>` : empty}
    ${fold(`곧 열리는 혜택 ${upcoming.length}개`, upcoming.length && cardGrid(upcoming, profile), !filters.openOnly)}
    ${fold(`조건이 안 맞는 혜택 ${no.length}개`, no.length && `<div class="card-grid">${no.map((b) => benefitCard(b, profile)).join('')}</div>`, !filters.openOnly)}
    ${fold(`마감된 혜택 ${closed.length}개`, closed.length && cardGrid(closed, profile), !filters.openOnly)}`;
}

export function list(root, { query, from }) {
  const profile = getProfile();
  if (query.all || !from?.startsWith('/b/')) {
    filters.types.clear();
    filters.cats.clear();
    if (query.cat) filters.cats.add(query.cat);
  }

  root.innerHTML = `
    ${profile
      ? `<div class="condition-bar"><p class="condition-text"><span class="label">내 조건</span> ${profileSummary(profile)}</p><md-text-button href="#/check">수정</md-text-button></div>`
      : `<div class="condition-bar invite"><p class="condition-text">조건을 고르면 내가 받을 수 있는 혜택만 골라 드려요.</p><md-filled-tonal-button href="#/check">30초 자격 체크</md-filled-tonal-button></div>`}
    <h1 class="page-title list-title" tabindex="-1" id="list-title"></h1>
    <div class="filter-bar" aria-label="걸러보기">${filterBar()}</div>
    <div id="results"></div>`;

  const area = root.querySelector('#results');
  const bar = root.querySelector('.filter-bar');
  const clearAddress = () => history.replaceState(null, '', '#/list');
  const paint = () => {
    root.querySelector('#list-title').textContent = resultHeading(profile);
    area.innerHTML = results(profile);
    area.querySelector('#reset-filters')?.addEventListener('click', () => {
      filters.types.clear();
      filters.cats.clear();
      clearAddress();
      bar.innerHTML = filterBar();
      paint();
    });
  };

  // 칩은 누를 때마다 선택이 바뀐다. 정렬은 하나만 고르는 칩이라 늘 하나가 켜져 있게 다시 그린다
  bar.addEventListener('click', (e) => {
    const chip = e.target.closest('md-filter-chip[data-group]');
    if (!chip) return;
    const { group, id } = chip.dataset;
    if (group === 'sort') {
      filters.sort = id;
      bar.querySelectorAll('md-filter-chip[data-group="sort"]').forEach((c) => { c.selected = c.dataset.id === id; });
    } else {
      if (chip.selected) filters[group].add(id); else filters[group].delete(id);
      clearAddress();
    }
    paint();
  });
  bar.addEventListener('change', (e) => {
    if (!e.target.matches('[data-filter="openOnly"]')) return;
    filters.openOnly = e.target.selected;
    paint();
  });
  paint();
}
