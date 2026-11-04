// 질문하기: 문장에서 조건을 알아듣고, 우리 데이터의 지금 열린 혜택만 카드로 보여 준다.
// 언어 모델이 붙기 전까지는 search.js의 사전과 규칙으로 돌아간다.
import { BENEFITS } from '../data/benefits.js';
import { categoryLabel } from '../data/lookups.js';
import { benefitCard, categoryChips, checkFields, esc, focusCentered, fold, icon, openBenefits, profileFields, rankBenefits, readCategoryChips, readFields, wireFields } from '../ui.js';
import { effectiveStatus, INCOME_BANDS, judge, STATUS_LABELS } from '../judge.js';
import { changedSlots, directHits, heardAnything, parseSentence, searchBenefits, turnProfile } from '../search.js';
import { getProfile, saveProfile } from '../store.js';

const EXAMPLES = ['용인 사는 24살 대학생인데 토익 지원 있어?', '취준생인데 면접 볼 때 받을 수 있는 돈', '자취하는데 월세 지원 받고 싶어'];
const SHORT_EXAMPLES = ['토익 지원', '자취 월세', '장학금 있어?'];
const MISSING_SLOTS = { age: 'birthYear', region: 'region', status: 'status', income: 'income' };
const SLOT_QUESTIONS = { birthYear: '태어난 해를 알려 주세요.', region: '어디 사세요?', status: '지금 상태가 어떻게 되세요?', income: '가구 소득 구간을 아세요?' };

let turns = [];

// 관심 분야는 문장에서 뽑은 값을 쓰되, 사용자가 고쳤으면 고친 값을 따른다
const interestsOf = (turn) => turn.interests ?? turn.parsed.interests;

export function recommend(turn) {
  const profile = turn.profile;
  const interests = interestsOf(turn);
  const open = openBenefits();
  const found = turn.interests ? open.filter((b) => interests.includes(b.category)) : searchBenefits(turn.q, open);
  const scoped = interests.length ? found : open;
  const usable = rankBenefits(scoped, profile).filter((b) => judge(b, profile).verdict !== 'no');
  const blocked = found.filter((b) => judge(b, profile).verdict === 'no').slice(0, 2);
  // 추천은 열린 것만 한다. 찾던 혜택이 마감이면 없는 척하지 않고 그 사실을 알린다
  const closed = directHits(turn.q, BENEFITS.filter((b) => effectiveStatus(b).status === 'closed' && interests.includes(b.category)))
    .filter((b) => judge(b, profile).verdict !== 'no').slice(0, 2);
  return { cards: usable.slice(0, 4), matched: found.length > 0, blocked, closed };
}

/** 답을 한 문장으로 먼저 말한다. 찾던 것이 마감이면 마감이라고, 없으면 없다고 한다 */
export function answerLead(turn, { cards, matched, closed }) {
  if (closed.length && !directHits(turn.q, cards).length) return ['찾던 혜택은 지금 마감이에요', cards.length ? '대신 지금 열린 혜택을 골랐어요.' : '지금 열린 혜택 중에는 맞는 게 없어요.'];
  if (!cards.length) return ['지금 열린 혜택 중에는 맞는 게 없어요'];
  if (!matched) return ['딱 맞는 혜택은 없어요', '지금 열린 혜택 중 가까운 것을 골랐어요. 이걸 찾으셨나요?'];
  const eligible = cards.filter((b) => judge(b, turn.profile).verdict === 'eligible').length;
  return [eligible ? `받을 수 있는 혜택 ${eligible}개를 찾았어요` : `지금 열린 혜택 ${cards.length}개를 골랐어요`];
}

/** 판정에 꼭 필요한데 비어 있는 조건 하나. 한 번만 묻는다. */
function missingSlot(cards, profile) {
  const counts = {};
  cards.forEach((b) => judge(b, profile).unknown.forEach((c) => {
    const slot = MISSING_SLOTS[c.key];
    const empty = { birthYear: !profile.birthYear, region: !profile.sido, status: !profile.status, income: !profile.income }[slot];
    if (slot && empty) counts[slot] = (counts[slot] ?? 0) + 1;
  }));
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
}

/** 접어 둔 줄에 보이는 알아들은 내용 */
function heardLine(turn) {
  const p = turn.profile;
  return [[p.sido, p.sigungu].filter(Boolean).join(' '), p.birthYear && `${p.birthYear}년생`, STATUS_LABELS[p.status], interestsOf(turn).map(categoryLabel).join(', ')].filter(Boolean).join(' · ');
}

function understoodChips(turn, index) {
  const p = turn.profile;
  const interests = interestsOf(turn).map(categoryLabel).join(', ');
  const chip = (slot, label, value) => `<md-assist-chip label="${esc(`${label}: ${value ?? '모름'}`)}" data-edit="${slot}" data-turn="${index}">${icon('edit', 'icon')}</md-assist-chip>`;
  return `<md-chip-set aria-label="알아들은 내용">
    ${chip('region', '사는 곳', [p.sido, p.sigungu].filter(Boolean).join(' ') || undefined)}
    ${chip('birthYear', '나이', p.birthYear ? `${p.birthYear}년생` : undefined)}
    ${chip('status', '상태', STATUS_LABELS[p.status])}
    ${chip('income', '소득', p.income === 'unknown' ? undefined : INCOME_BANDS[p.income]?.label)}
    ${chip('interest', '관심 분야', interests || undefined)}
  </md-chip-set>`;
}

function slotEditor(turn, index, slot, question) {
  return `<form class="slot-editor" data-slot="${slot}" data-turn="${index}" tabindex="-1" novalidate>
    <p class="slot-question">${esc(question)}</p>
    ${slot === 'interest' ? categoryChips(interestsOf(turn)) : profileFields([slot], turn.profile)}
    <div class="button-row">
      <md-filled-tonal-button type="submit">적용</md-filled-tonal-button>
      <md-text-button type="button" data-skip="${index}">모르겠어요</md-text-button>
    </div>
  </form>`;
}

/** 문장에서 뽑은 조건은 그 질문에만 쓴다. 저장은 사용자가 고를 때만 한다 */
function saveOffer(turn, index) {
  if (index !== turns.length - 1 || !changedSlots(turn.profile, getProfile()).length) return '';
  return `<div class="save-offer"><p>이 조건은 이번 질문에만 썼어요. 내 조건에도 반영할까요?</p><md-outlined-button data-save="${index}">내 조건에 반영</md-outlined-button></div>`;
}

const turnShell = (turn, body) => `<article class="turn" tabindex="-1">
    <p class="bubble">${esc(turn.q)}</p>
    <div class="answer">${body}</div>
  </article>`;

const notUnderstood = (turn) => turnShell(turn, `
  <h2 class="answer-lead">무슨 말인지 잘 모르겠어요</h2>
  <p>찾는 분야나 내 상황을 넣어 다시 물어봐 주세요.</p>
  <md-chip-set aria-label="예시 문장">${SHORT_EXAMPLES.map((q) => `<md-suggestion-chip label="${esc(q)}" data-example="${esc(q)}"></md-suggestion-chip>`).join('')}</md-chip-set>
  <div class="button-row"><md-filled-tonal-button href="#/check">30초 자격 체크</md-filled-tonal-button></div>`);

const closedNote = (b) => `<div class="notice-line closed-hit">${icon('schedule')}<span>${esc(b.title)} (${esc(b.sourceName)})</span><md-text-button href="#/b/${esc(b.id)}">다음 모집 알림</md-text-button></div>`;

function turnHtml(turn, index) {
  if (!heardAnything(turn.parsed)) return notUnderstood(turn);
  const found = recommend(turn);
  const { cards, blocked, closed } = found;
  const [lead, sub] = answerLead(turn, found);
  const blockedNote = blocked.map((b) => `<p class="notice-line">${icon('block')}<span><b>대상 아님</b> ${esc(b.title)} · 안 맞는 조건: ${esc(judge(b, turn.profile).failed[0].label)}</span></p>`).join('');
  const slot = turn.editing ?? (turn.asked ? null : missingSlot(cards, turn.profile));
  const answer = !cards.length
    ? '<div class="button-row"><md-outlined-button href="#/list">전체 혜택 보기</md-outlined-button></div>'
    : `<div class="card-grid two">${cards.map((b) => {
         const r = judge(b, turn.profile);
         return benefitCard(b, turn.profile, r.verdict === 'eligible' ? '조건이 맞고 지금 신청할 수 있어요' : b.oneLine);
       }).join('')}</div>
       <p class="notice-line">${icon('info')}판정은 입력한 조건으로 본 결과예요. 공고 기준으로 다시 확인하세요.</p>`;
  const editor = slot ? slotEditor(turn, index, slot, turn.editing ? '맞게 고쳐 주세요.' : SLOT_QUESTIONS[slot]) : '';
  const heard = `<p class="hint">눌러서 고칠 수 있어요</p>${understoodChips(turn, index)}${turn.editing ? editor : ''}`;
  return turnShell(turn, `
      <h2 class="answer-lead">${lead}</h2>
      ${sub ? `<p>${sub}</p>` : ''}
      ${closed.map(closedNote).join('')}
      ${blockedNote}
      ${answer}
      ${turn.editing ? '' : editor}
      ${fold(`이렇게 알아들었어요 <span class="hint">${esc(heardLine(turn))}</span>`, heard, Boolean(turn.editing))}
      ${saveOffer(turn, index)}`);
}

function intro() {
  return `<div>
    <h1 class="page-title" tabindex="-1">내 상황을 문장으로 물어보세요</h1>
    <p class="page-sub">등록된 혜택에서만 찾고, 마감된 것은 추천하지 않아요.</p>
    <md-chip-set aria-label="예시 문장">${EXAMPLES.map((q) => `<md-suggestion-chip label="${esc(q)}" data-example="${esc(q)}"></md-suggestion-chip>`).join('')}</md-chip-set>
  </div>`;
}

export function ask(root, { query }) {
  const focusTurn = (index) => root.querySelectorAll('.turn')[index]?.focus({ preventScroll: true });

  const submit = (q) => {
    const parsed = parseSentence(q);
    turns.push({ q, parsed, profile: turnProfile(getProfile(), parsed) });
    paint();
    root.querySelector('.turn:last-of-type')?.scrollIntoView({ block: 'start' });
  };

  root.innerHTML = `
    <div class="ask-layout">
      <div id="ask-head"></div>
      <div class="turns" aria-live="polite"></div>
      <form class="ask-input" id="ask-form">
        <div class="m3-search-bar">
          ${icon('help_center')}
          <input name="q" aria-label="내 상황을 문장으로 물어보기" placeholder="상황을 문장으로 써 주세요" autocomplete="off">
          <md-icon-button type="submit" aria-label="보내기">${icon('send')}</md-icon-button>
        </div>
      </form>
    </div>`;

  // 입력창은 다시 그리지 않아 보낸 뒤에도 포커스가 남고 바로 이어서 물을 수 있다
  const paint = () => {
    root.querySelector('#ask-head').innerHTML = turns.length ? '<h1 class="visually-hidden" tabindex="-1">질문하기</h1>' : intro();
    const area = root.querySelector('.turns');
    area.innerHTML = turns.map(turnHtml).join('');
    wireFields(area);
  };

  root.onsubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.id === 'ask-form') {
      const q = form.elements.q.value.trim();
      form.reset();
      if (q) submit(q);
      return;
    }
    if (form.matches('.slot-editor')) {
      const index = Number(form.dataset.turn);
      const turn = turns[index];
      if (form.dataset.slot === 'interest') turn.interests = readCategoryChips(form);
      else if (!checkFields(form)) return;
      else turn.profile = { ...turn.profile, ...readFields(form) };
      turn.asked = true;
      turn.editing = null;
      paint();
      focusTurn(index);
    }
  };
  root.onclick = (e) => {
    const example = e.target.closest('[data-example]');
    if (example) {
      submit(example.dataset.example);
      return focusTurn(turns.length - 1);
    }
    const save = e.target.closest('[data-save]');
    if (save) {
      const { profile } = turns[Number(save.dataset.save)];
      saveProfile(Object.fromEntries(changedSlots(profile, getProfile()).map((k) => [k, profile[k]])));
      paint();
      return window.M3.showSnackbar('내 조건에 반영했어요');
    }
    const edit = e.target.closest('[data-edit]');
    if (edit) {
      turns[Number(edit.dataset.turn)].editing = edit.dataset.edit;
      paint();
      return focusCentered(root.querySelector(`.slot-editor[data-turn="${edit.dataset.turn}"]`));
    }
    const skip = e.target.closest('[data-skip]');
    if (skip) {
      const turn = turns[Number(skip.dataset.skip)];
      turn.asked = true;
      turn.editing = null;
      paint();
      focusTurn(Number(skip.dataset.skip));
    }
    return undefined;
  };

  paint();
  if (query.q && !turns.some((t) => t.q === query.q)) submit(query.q);
}
