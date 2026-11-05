// 맞춤 혜택 목록: 정부 정책과 학교 장학을 한 목록에. 모집 중이 기본, 대상 아님·마감은 접어 둔다.
import { BENEFITS } from '../data/benefits.js';
import { CATEGORIES, categoryLabel, SOURCES } from '../data/lookups.js';
import { answerHeading, benefitCard, cardGrid, esc, fold, icon, judgeNotice, profileSummary, rankBenefits } from '../ui.js';
import { daysLeft, effectiveStatus, judge, onlyDirectLeft } from '../judge.js';
import { getProfile } from '../store.js';

// 상세에 다녀올 때만 걸러보기를 이어 간다. 다른 길로 들어오면 전체 목록에서 시작한다
const filters = { openOnly: true, sources: new Set(), cats: new Set(), sort: 'deadline' };

const amountOf = (b) => b.amount?.maxWon ?? 0;
const SORTS = {
  deadline: (a, b) => (daysLeft(a) ?? 9999) - (daysLeft(b) ?? 9999),
  amount: (a, b) => amountOf(b) - amountOf(a),
};

function filterPanel() {
  const check = (group, id, label, on) => `<label class="check-row"><md-checkbox touch-target="wrapper" data-group="${group}" value="${id}"${on ? ' checked' : ''}></md-checkbox><span>${esc(label)}</span></label>`;
  return `
    <div class="m3-setting-row compact-row">
      <div class="text"><p class="title">모집 중만</p></div>
      <md-switch data-filter="openOnly"${filters.openOnly ? ' selected' : ''} aria-label="모집 중만"></md-switch>
    </div>
    <fieldset class="filter-group"><legend>어디서 주는지</legend>${SOURCES.map((s) => check('sources', s.id, s.label, filters.sources.has(s.id))).join('')}</fieldset>
    <fieldset class="filter-group"><legend>분야</legend>${CATEGORIES.map((c) => check('cats', c.id, c.label, filters.cats.has(c.id))).join('')}</fieldset>
    <fieldset class="filter-group"><legend>정렬</legend>
      <label class="radio-row"><md-radio name="sort" value="deadline" touch-target="wrapper"${filters.sort === 'deadline' ? ' checked' : ''}></md-radio><span>마감 빠른 순</span></label>
      <label class="radio-row"><md-radio name="sort" value="amount" touch-target="wrapper"${filters.sort === 'amount' ? ' checked' : ''}></md-radio><span>금액 큰 순</span></label>
    </fieldset>`;
}

function matches(b) {
  if (filters.sources.size && !filters.sources.has(b.source)) return false;
  if (filters.cats.size && !filters.cats.has(b.category)) return false;
  return true;
}

const sourceLabel = (id) => SOURCES.find((s) => s.id === id)?.label ?? id;
const activeFilters = () => [...[...filters.sources].map((id) => ['sources', id, sourceLabel(id)]), ...[...filters.cats].map((id) => ['cats', id, categoryLabel(id)])];

/** 켜진 걸러보기는 결과 위에 칩으로 보여 준다. 칩을 누르면 지워진다 */
function filterChips() {
  const active = activeFilters();
  if (!active.length) return '';
  return `<md-chip-set class="active-filters" aria-label="켜진 걸러보기">
    ${active.map(([group, id, label]) => `<md-input-chip remove-only label="${esc(label)}" aria-label-remove="${esc(label)} 걸러보기 지우기" data-group="${group}" data-id="${id}"></md-input-chip>`).join('')}
  </md-chip-set>`;
}

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

export function results(profile) {
  const all = BENEFITS.filter(matches);
  const by = (status) => all.filter((b) => effectiveStatus(b).status === status);
  const open = by('open');
  const verdicts = (v) => open.filter((b) => judge(b, profile).verdict === v);
  // 묶음 안에서는 고른 정렬을 따르고, 값이 같으면 남은 확인이 적은 것이 앞선다
  const order = (items) => rankBenefits(items, profile).sort(SORTS[filters.sort]);
  const eligible = order(verdicts('eligible'));
  const check = verdicts('check');
  const direct = order(check.filter((b) => onlyDirectLeft(judge(b, profile))));
  const others = order(check.filter((b) => !onlyDirectLeft(judge(b, profile))));
  const no = verdicts('no');
  const upcoming = by('upcoming');
  const closed = by('closed');
  const scope = activeFilters().length ? `${activeFilters().map(([, , label]) => label).join(', ')} ` : '';

  const folded = upcoming.length || no.length || closed.length;
  const empty = `<div class="empty-card"><p class="empty-title">이 조건으로는 지금 열린 혜택이 없어요.</p>
    <p>${clearSuggestion(profile)}${folded ? ' 아래 접어 둔 혜택도 살펴보세요.' : ''}</p>
    <md-outlined-button id="reset-filters">걸러보기 지우기</md-outlined-button></div>`;

  // 첫 묶음은 페이지 제목과 같은 말이라 눈에는 숨기고 제목 구조만 남긴다
  const groups = [['받을 수 있어요', eligible], ['조건이 맞아요. 직접 확인만 남았어요', direct], ['더 확인해야 해요', others]].filter(([, items]) => items.length);
  const group = ([title, items], i) => `<section class="verdict-group"><h2 class="${i ? 'section-title' : 'visually-hidden'}">${title} ${items.length}개</h2>${cardGrid(items, profile)}</section>`;
  const shown = profile
    ? groups.map(group).join('')
    : open.length ? `<section class="verdict-group"><h2 class="visually-hidden">지금 열린 혜택</h2>${cardGrid(order(open), null)}</section>` : '';

  return `
    <h1 class="page-title" tabindex="-1">${answerHeading(open, profile, scope)}</h1>
    ${profile && !eligible.length && direct.length ? '<p class="result-sub">상세에서 직접 확인을 마치면 받을 수 있음으로 바뀌어요.</p>' : ''}
    ${filterChips()}
    ${shown || empty}
    ${judgeNotice(profile)}
    ${fold(`곧 열리는 혜택 ${upcoming.length}개`, upcoming.length && cardGrid(upcoming, profile), !filters.openOnly)}
    ${fold(`대상 아님 ${no.length}개 · 못 받는 이유 남기기`, no.length && `<div class="card-grid">${no.map((b) => benefitCard(b, profile)).join('')}</div>`, !filters.openOnly)}
    ${fold(`마감된 혜택 ${closed.length}개`, closed.length && cardGrid(closed, profile), !filters.openOnly)}`;
}

export function list(root, { query, from }) {
  const profile = getProfile();
  if (query.all || !from?.startsWith('/b/')) {
    filters.sources.clear();
    filters.cats.clear();
    if (query.cat) filters.cats.add(query.cat);
  }

  const filterButton = `<md-outlined-button class="filter-open" data-open="#filter-sheet">${icon('filter_list', 'icon')}<span id="filter-label">걸러보기</span></md-outlined-button>`;
  root.innerHTML = `
    ${profile
      ? `<div class="condition-bar"><p class="condition-text"><span class="label">내 조건</span> ${profileSummary(profile)}</p><md-text-button href="#/check">조건 수정</md-text-button>${filterButton}</div>`
      : `<div class="condition-bar invite"><p class="condition-text">조건을 고르면 내가 받을 수 있는 혜택만 골라 드려요.</p><md-filled-tonal-button href="#/check">30초 자격 체크</md-filled-tonal-button>${filterButton}</div>`}
    <div class="list-layout">
      <aside class="filter-side" aria-label="걸러보기">${filterPanel()}</aside>
      <div id="results"></div>
    </div>
    <dialog class="m3-sheet bottom" id="filter-sheet" aria-label="걸러보기">
      <span class="handle"></span>
      <div class="sheet-body">${filterPanel()}</div>
      <div class="sheet-actions"><md-filled-button data-close id="sheet-result">결과 보기</md-filled-button></div>
    </dialog>`;

  const area = root.querySelector('#results');
  const syncPanels = (except) => root.querySelectorAll('.filter-side, .sheet-body').forEach((p) => {
    if (!except || !p.contains(except)) p.innerHTML = filterPanel();
  });
  const clearAddress = () => history.replaceState(null, '', '#/list');
  const paint = () => {
    area.innerHTML = results(profile);
    const on = activeFilters().length;
    root.querySelector('#filter-label').textContent = on ? `걸러보기 ${on}` : '걸러보기';
    root.querySelector('#sheet-result').textContent = `결과 ${shownCount(profile)}개 보기`;
    area.querySelector('#reset-filters')?.addEventListener('click', () => {
      filters.sources.clear();
      filters.cats.clear();
      clearAddress();
      syncPanels();
      paint();
    });
    // md-input-chip의 remove는 거품이 올라오지 않고 × 칸(34)에서만 난다. 칩 전체를 누름 영역으로 쓴다
    area.querySelectorAll('md-input-chip').forEach((chip) => {
      const removeChip = (e) => {
        e.preventDefault();
        filters[chip.dataset.group].delete(chip.dataset.id);
        clearAddress();
        syncPanels();
        paint();
      };
      chip.addEventListener('remove', removeChip);
      chip.addEventListener('click', removeChip);
    });
  };

  // 넓은 화면의 왼쪽 칸과 좁은 화면의 시트가 같은 걸러보기를 쓴다
  root.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('[data-filter="openOnly"]')) filters.openOnly = t.selected;
    else if (t.matches('md-checkbox[data-group]')) {
      const set = filters[t.dataset.group];
      if (t.checked) set.add(t.value); else set.delete(t.value);
    } else if (t.matches('md-radio[name="sort"]')) filters.sort = t.value;
    else return;
    paint();
    syncPanels(t);
  });
  paint();
}
