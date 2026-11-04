// 혜택 상세 (가장 중요한 화면). 금액 → 이름 → 결과 → 얼마·누구·언제까지 → 탭.
// 마감된 혜택도 같은 틀을 쓴다. SNS 링크로 바로 들어와도 이 화면에서 끝낼 수 있어야 한다.
import { categoryLabel } from '../data/lookups.js';
import { cardGrid, checkField, checkFields, deadlineText, EMAIL_PATTERN, esc, findBenefit, fmtDate, focusCentered, icon, profileFields, readFields, similarOpen, VERDICTS, wireFields } from '../ui.js';
import { effectiveStatus, judge, missingFields, neededFields, STATUS_LABELS } from '../judge.js';
import { addNextAlert, addReview, getAlert, getMyVote, getProfile, getReviews, getVotes, isSignedIn, saveProfile, signIn, vote } from '../store.js';
import { hasPersonalNumber } from '../search.js';

const REASONS = [
  { id: 'age', label: '나이 기준' },
  { id: 'income', label: '소득 기준' },
  { id: 'region', label: '사는 곳 기준' },
  { id: 'status', label: '학적·취업 상태 기준' },
  { id: 'other', label: '기타' },
];
const ALTERNATIVES = '대신 받을 수 있는 혜택 보기';
const REVIEW_RESULTS = { selected: '선정됨', rejected: '탈락', pending: '신청 중' };
const CLOSED_REASON = { period: '신청 기간이 끝났어요.', budget: '예산이 모두 소진돼 일찍 끝났어요.', other: '모집이 끝났어요.' };

const conditionList = (title, items, cls, iconName) => (items.length ? `<div class="cond-block"><p class="cond-title">${title}</p><ul class="cond-list ${cls}">${items.map((c) => `<li>${icon(iconName)}<span>${esc(c.label)}</span></li>`).join('')}</ul></div>` : '');

/** 데이터로 판정 못 하는 조건은 본인이 직접 확인한다. 모두 체크하면 입력으로 확인된 것으로 본다 */
function selfCheckList(result) {
  const items = [...result.unknown, ...result.met].filter((c) => c.key === 'other');
  if (!items.length) return '';
  return `<div class="cond-block"><p class="cond-title">직접 확인할 조건</p>
    ${items.map((c) => `<label class="check-row"><md-checkbox touch-target="wrapper" data-confirm="${esc(c.label)}"${c.result === 'met' ? ' checked' : ''}></md-checkbox><span>${esc(c.label)}</span></label>`).join('')}
  </div>`;
}

const extLink = (url, label) => `<a class="ext-link m3-interactive" href="${esc(url)}" target="_blank" rel="noopener"><md-ripple></md-ripple><md-focus-ring></md-focus-ring>${label}${icon('open_in_new')}</a>`;

const bandTitle = (verdict) => `${icon(VERDICTS[verdict].icon)}${VERDICTS[verdict].label}`;

/** 띠 아래 행동. 대상이 아니면 신청 링크는 고정 버튼에서 내려와 여기에 남는다 */
function bandActions(verdict, canEdit, noticeUrl) {
  const actions = [
    verdict === 'no' && '<md-outlined-button data-tab-go="2">이 기준 때문에 못 받아요</md-outlined-button>',
    canEdit && '<md-text-button data-edit-conditions>조건 고치기</md-text-button>',
    verdict === 'no' && noticeUrl && extLink(noticeUrl, '공고 직접 보기'),
  ].filter(Boolean);
  return actions.length ? `<div class="band-actions">${actions.join('')}</div>` : '';
}

function verdictBand(result, canEdit, noticeUrl) {
  const { verdict } = result;
  if (verdict === 'unknown') return '';
  return `<div class="band ${verdict}">
    <p class="band-title" role="status" tabindex="-1">${bandTitle(verdict)}</p>
    ${conditionList('안 맞는 조건', result.failed, 'failed', 'close')}
    ${conditionList('입력이 더 필요한 조건', result.unknown.filter((c) => c.key !== 'other' && c.key !== 'residency'), 'unknown', 'help')}
    ${conditionList('공고에서 확인할 조건', result.unknown.filter((c) => c.key === 'residency'), 'unknown', 'help')}
    ${verdict === 'no' ? '' : selfCheckList(result)}
    ${conditionList('맞은 조건', result.met.filter((c) => c.key !== 'other'), 'met', 'check')}
    <p class="band-note">입력한 조건으로 본 결과예요. 공고 기준으로 다시 확인하세요.</p>
    ${bandActions(verdict, canEdit, noticeUrl)}
  </div>`;
}

function whoText(b) {
  const { birthYearMin: min, birthYearMax: max } = b.eligibility ?? {};
  // 공고 나이 문구에 출생연도가 이미 있으면 덧붙이지 않는다
  const year = min && max && !/년생|일생|출생/.test(b.ageText ?? '') ? `${min}~${max}년생` : '';
  return [b.ageText, year].filter(Boolean).join(' · ') || '나이 제한 확인 필요';
}

function whenText(b, closed) {
  if (closed) return b.period?.end ? `마감 (원래 ${fmtDate(b.period.end)}까지)` : '마감';
  if (b.period?.always) return '상시 모집';
  if (!b.period?.end && b.nextExpected) return b.nextExpected;
  if (b.period?.end) return `${fmtDate(b.period.end)}까지`;
  return '확인 필요';
}

const row = (label, value) => `<div class="info-row"><dt>${label}</dt><dd>${value}</dd></div>`;
const yesNoUnknown = (v, yes, no) => (v === undefined ? '확인 필요' : v ? yes : no);

function infoPanel(b) {
  const a = b.apply ?? {};
  const e = b.eligibility ?? {};
  const method = { online: '온라인', visit: '방문', both: '온라인·방문' }[a.method] ?? '확인 필요';
  const conditions = [
    (e.birthYearMin || e.birthYearMax) && `나이: ${whoText(b)}`,
    e.regions?.length && `사는 곳: ${e.regions.join(', ')}`,
    e.excludedRegions?.length && `제외 지역: ${e.excludedRegions.join(', ')}`,
    e.residencyMonths && `거주 기간: ${e.residencyMonths}개월 이상`,
    e.statuses?.length && `상태: ${e.statuses.map((s) => STATUS_LABELS[s]).join(', ')}`,
    e.incomeMaxPercent && `가구 소득: 기준 중위소득 ${e.incomeMaxPercent}% 이하`,
    ...(e.other ?? []),
  ].filter(Boolean);
  return `
    <section class="info-section"><h2 class="info-title">어떻게 신청해요</h2>
      <dl class="info-list">
        ${row('방법', method)}
        ${row('로그인 필요', yesNoUnknown(a.loginRequired, '필요해요', '없어요'))}
        ${row('걸리는 시간', a.minutes ? `약 ${a.minutes}분` : '확인 필요')}
        ${row('내 돈', a.cost ? (a.cost === 'free' ? '무료' : '자부담 있음') : '확인 필요')}
      </dl>
    </section>
    <section class="info-section"><h2 class="info-title">준비할 서류</h2>
      ${b.documents?.length
        ? `<ul class="doc-list">${b.documents.map((d) => `<li><span class="doc-name">${esc(d.name)}</span><span class="doc-sub">${esc([d.issuer, d.cost].filter(Boolean).join(' · '))}</span></li>`).join('')}</ul>`
        : '<p>서류 목록을 아직 정리하지 못했어요. 원문 공고에서 확인해 주세요.</p>'}
    </section>
    <section class="info-section"><h2 class="info-title">자세한 조건</h2>
      ${conditions.length ? `<ul class="plain-list">${conditions.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : '<p>조건을 원문 공고에서 확인해 주세요.</p>'}
    </section>
    ${b.cautions?.length ? `<section class="info-section"><h2 class="info-title">알아둘 점</h2><ul class="plain-list">${b.cautions.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></section>` : ''}
    <section class="info-section source-box">
      <p class="source-name">${esc(b.officialTitle)}</p>
      ${extLink(b.originalUrl, '원문 공고 보기')}
      ${b.linkCheckedAt ? `<p class="hint">링크 확인 ${fmtDate(b.linkCheckedAt)}</p>` : ''}
    </section>`;
}

function reviewForm() {
  if (!isSignedIn()) {
    return `<div class="sign-in-box"><p class="info-title">후기 남기기</p><p>도배를 막으려고 글을 쓸 때만 간편 로그인을 받아요. 읽기는 로그인 없이 돼요.</p>
      <div class="button-row"><md-outlined-button data-sign-in>카카오로 계속</md-outlined-button><md-outlined-button data-sign-in>네이버로 계속</md-outlined-button></div></div>`;
  }
  return `<form class="review-form" id="review-form" novalidate><p class="info-title">후기 남기기</p>
    <md-chip-set class="single-chips" data-name="result" role="group" aria-label="결과">
      ${Object.entries(REVIEW_RESULTS).map(([v, l]) => `<md-filter-chip label="${l}" data-value="${v}"></md-filter-chip>`).join('')}
    </md-chip-set>
    <p class="field-error" role="alert" hidden>선정됨, 탈락, 신청 중 가운데 하나를 골라 주세요</p>
    <md-outlined-text-field name="text" label="한 줄 후기" no-asterisk supporting-text="학점·소득 같은 개인 숫자는 빼 주세요" maxlength="100" required error-text="한 줄만 써 주세요"></md-outlined-text-field>
    <div class="button-row"><md-filled-tonal-button type="submit">올리기</md-filled-tonal-button></div>
  </form>`;
}

function reviewPanel(b) {
  const reviews = getReviews(b.id);
  return `
    <p class="notice-line">${icon('info')}후기는 참고용이에요. 조건은 공식 정보를 기준으로 봐 주세요.</p>
    ${reviewForm()}
    ${reviews.length
      ? `<ul class="review-list">${reviews.map((r) => `<li class="review"><p class="review-head"><span class="review-tag">참고용</span><b>${REVIEW_RESULTS[r.result]}</b><span class="hint">${esc(r.date)}</span></p><p>${esc(r.text)}</p><md-text-button data-report>신고</md-text-button></li>`).join('')}</ul>`
      : '<p class="empty">아직 후기가 없어요. 첫 후기를 남겨 주세요.</p>'}`;
}

function reasonPanel(b) {
  const votes = getVotes(b.id);
  const mine = getMyVote(b.id);
  const total = Object.values(votes).reduce((a, n) => a + n, 0);
  return `
    <p class="info-title">이 기준 때문에 못 받아요</p>
    <p>나를 막은 기준을 눌러 주세요. 로그인은 필요 없어요.</p>
    <div class="reason-list">
      ${REASONS.map((r) => {
        const n = votes[r.id] ?? 0;
        const pct = total ? Math.round((n / total) * 100) : 0;
        return `<button class="reason-row m3-interactive" type="button" data-reason="${r.id}" aria-pressed="${mine === r.id}">
          <md-ripple></md-ripple><md-focus-ring></md-focus-ring>
          <span class="reason-text"><span>${r.label}</span><span class="reason-count">${n}명</span></span>
          <span class="reason-track"><span class="reason-bar" style="width: ${pct}%"></span></span>
        </button>`;
      }).join('')}
    </div>
    <p class="hint">시제품이라 이 브라우저에서 누른 것만 세어요.</p>
    <div class="button-row panel-next"><md-outlined-button href="#/list?all=1">${ALTERNATIVES}</md-outlined-button></div>`;
}

/** 프로필 유무가 아니라 이 혜택에 비어 있는 칸으로 입력칸을 정한다. 고치기를 누르면 필요한 칸을 모두 연다 */
function quickFields(b, profile, verdict, editing) {
  if (editing || !profile) return neededFields(b);
  return verdict === 'no' ? [] : missingFields(b, profile);
}

function quickCheck(profile, fields, editing) {
  if (!fields.length) {
    if (profile) return '';
    return `<div class="side-card">
      <h2 class="info-title">바로 자격 확인</h2>
      <p>이 혜택은 고를 조건 없이 직접 확인할 조건만 있어요. 자격 체크를 마치면 여기서 하나씩 체크할 수 있어요.</p>
      <md-filled-tonal-button href="#/check">30초 자격 체크</md-filled-tonal-button>
    </div>`;
  }
  return `<form class="side-card" id="quick-check" novalidate>
    <h2 class="info-title" tabindex="-1">${editing ? '조건 고치기' : '바로 자격 확인'}</h2>
    <p>${editing ? '바꿀 칸만 고치고 확인을 눌러 주세요.' : `이 혜택에 ${profile ? '더 ' : ''}필요한 ${fields.length}가지만 골라 주세요.`}</p>
    ${profileFields(fields, profile, { schoolAlways: true })}
    <div class="sticky-cta"><md-filled-button type="submit">확인</md-filled-button></div>
  </form>`;
}

function applyBox(b, status, verdict, needsCheck) {
  const a = b.apply ?? {};
  const external = (label, url, emphasis) => `<md-${emphasis}-button href="${esc(url)}" target="_blank" rel="noopener" trailing-icon>${label}${icon('open_in_new', 'icon')}</md-${emphasis}-button>`;
  if (status === 'closed') return '<md-filled-button disabled>신청 마감</md-filled-button>';
  if (verdict === 'no') return `<md-filled-button href="#/list?all=1">${ALTERNATIVES}</md-filled-button>`;
  if (status === 'upcoming') return '<md-filled-button disabled>아직 열리지 않았어요</md-filled-button>';
  const emphasis = needsCheck ? 'outlined' : 'filled';
  if (a.method === 'visit') return `${external('방문 신청 안내 보기', a.url ?? b.originalUrl, emphasis)}<p class="hint">이 혜택은 온라인 신청이 없어요.</p>`;
  const url = a.url ?? b.originalUrl;
  const note = a.url ? (a.loginRequired ? '해당 사이트에서 로그인이 필요해요.' : '해당 공고 페이지로 바로 가요.') : '신청 페이지를 아직 찾지 못해 원문 공고로 가요.';
  return `${external(a.url ? '신청 페이지로 바로 가기' : '원문 공고로 가기', url, emphasis)}<p class="hint">${note}</p>`;
}

const NEXT_ALERT_DONE = `<p class="info-title">${icon('check_circle')}다음 모집이 열리면 메일로 알려 드릴게요</p><p class="hint">시제품이라 실제 메일은 가지 않아요.</p>`;

function nextAlert(b) {
  const saved = getAlert();
  if (saved?.benefits?.includes(b.id)) return `<div class="next-alert">${NEXT_ALERT_DONE}</div>`;
  return `<form class="next-alert" id="next-alert" novalidate>
      <h2 class="info-title">다음 모집 알림 받기</h2>
      <p>로그인 없이 이메일만 있으면 돼요.</p>
      <div class="inline-form">
        <md-outlined-text-field name="email" type="email" label="이메일" no-asterisk value="${esc(saved?.email ?? '')}" pattern="${EMAIL_PATTERN}" required error-text="이메일을 확인해 주세요"></md-outlined-text-field>
        <md-filled-tonal-button type="submit">알림 받기</md-filled-tonal-button>
      </div>
    </form>`;
}

function closedBlock(b, reason, profile) {
  const similar = similarOpen(b, profile);
  return `
    <section class="band closed"><p class="band-title">${icon('schedule')}왜 끝났나요</p>
      <p>${CLOSED_REASON[reason]}${b.period?.end ? ` 원래 마감일은 ${fmtDate(b.period.end)}이에요.` : ''}</p>
      <p>다음 모집: ${esc(b.nextExpected ?? '아직 공지되지 않았어요')}</p>
    </section>
    ${nextAlert(b)}
    <section class="section-tight"><h2 class="section-title">지금 열린 비슷한 혜택</h2>
      ${similar.length ? cardGrid(similar, profile) : '<p>비슷한 혜택이 지금은 없어요.</p><div class="button-row panel-next"><md-outlined-button href="#/list?all=1">전체 혜택 보기</md-outlined-button></div>'}
    </section>`;
}

export function detail(root, { params, query }) {
  const b = findBenefit(params[0]);
  if (!b) {
    root.innerHTML = '<div class="narrow"><h1 class="page-title" tabindex="-1">찾는 혜택이 없어요</h1><p>링크가 바뀌었거나 삭제된 혜택이에요.</p><md-filled-button href="#/list">혜택 목록 보기</md-filled-button></div>';
    return;
  }

  let tab = { info: 0, review: 1, reason: 2 }[query.tab] ?? 0;
  let editing = false;

  const paint = () => {
    const profile = getProfile();
    const { status, reason } = effectiveStatus(b);
    const closed = status === 'closed';
    const result = judge(b, profile);
    const fields = closed ? [] : quickFields(b, profile, result.verdict, editing);
    const needsCheck = fields.length > 0;
    const sticky = !closed && !needsCheck && (status === 'open' || result.verdict === 'no');
    const noticeUrl = status === 'open' ? b.apply?.url ?? b.originalUrl : null;
    const back = profile ? ['#/list', '맞춤 혜택 목록'] : ['#/', '홈'];

    root.innerHTML = `
      <div class="detail-layout">
        <div class="detail-head">
          <a class="back-link m3-interactive" href="${back[0]}"><md-ripple></md-ripple><md-focus-ring></md-focus-ring>${icon('arrow_back')}${back[1]}</a>
          <p class="detail-meta"><span class="source-tag">${esc(b.sourceName)}</span><span>${esc(categoryLabel(b.category))}</span><span class="deadline">${esc(deadlineText(b))}</span></p>
          <p class="detail-amount${closed ? ' is-dim' : ''}">${esc(b.amount.text)}</p>
          <h1 class="detail-title" tabindex="-1">${esc(b.title)}</h1>
          <p class="detail-one">${esc(b.oneLine)}</p>
          ${closed ? '' : verdictBand(result, neededFields(b).length > 0 && !editing, noticeUrl)}
        </div>
        <aside class="detail-side" aria-label="신청">
          ${closed ? '' : quickCheck(profile, fields, editing)}
          <div class="apply-box${sticky ? ' sticky' : ''}">${applyBox(b, status, result.verdict, needsCheck)}</div>
          <div class="side-actions">
            <md-outlined-button id="share">${icon('share', 'icon')}공유</md-outlined-button>
            ${closed ? '' : `<md-outlined-button href="#/alert?benefit=${esc(b.id)}">${icon('notifications', 'icon')}알림 받기</md-outlined-button>`}
            <p class="hint share-note" id="share-note" role="status" hidden></p>
          </div>
        </aside>
        <div class="detail-body">
          ${closed ? closedBlock(b, reason, profile) : ''}
          <dl class="key-facts">
            <div><dt>얼마</dt><dd>${esc(b.amount.text)}${b.amount.note ? `<span class="fact-note">${esc(b.amount.note)}</span>` : ''}</dd></div>
            <div><dt>누구</dt><dd>${esc(whoText(b))}</dd></div>
            <div><dt>언제까지</dt><dd${closed ? ' class="is-dim"' : ''}>${esc(whenText(b, closed))}</dd></div>
          </dl>
          <md-tabs id="tabs" aria-label="혜택 정보" active-tab-index="${tab}">
            <md-primary-tab>정보</md-primary-tab>
            <md-primary-tab>후기</md-primary-tab>
            <md-primary-tab>못 받는 이유</md-primary-tab>
          </md-tabs>
          <div class="tab-panel" role="tabpanel" id="panel">${[infoPanel, reviewPanel, reasonPanel][tab](b)}</div>
        </div>
      </div>`;

    wireFields(root);
    bind(result);
  };

  const showTab = (index, scroll) => {
    tab = index;
    const tabs = root.querySelector('#tabs');
    tabs.activeTabIndex = index;
    root.querySelector('#panel').innerHTML = [infoPanel, reviewPanel, reasonPanel][index](b);
    wireFields(root.querySelector('#panel'));
    bindPanel();
    if (scroll) tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const bindPanel = () => {
    const panel = root.querySelector('#panel');
    panel.querySelectorAll('[data-sign-in]').forEach((btn) => btn.addEventListener('click', () => {
      signIn();
      window.M3.showSnackbar('시제품이라 실제 로그인 없이 넘어갔어요');
      showTab(1);
    }));
    panel.querySelector('#review-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const field = form.querySelector('md-outlined-text-field');
      const chip = [...form.querySelectorAll('md-filter-chip')].find((c) => c.selected);
      field.value = field.value.trim();
      field.errorText = '한 줄만 써 주세요';
      const textOk = checkField(field);
      form.querySelector('.field-error').hidden = Boolean(chip);
      if (!chip) return focusCentered(form.querySelector('md-filter-chip'));
      if (!textOk) return focusCentered(field);
      if (hasPersonalNumber(field.value)) {
        field.errorText = '학점·소득 같은 숫자는 빼 주세요';
        field.error = true;
        return focusCentered(field);
      }
      addReview(b.id, { result: chip.dataset.value, text: field.value, date: fmtDate(new Date().toISOString().slice(0, 10)) });
      showTab(1);
      window.M3.showSnackbar('후기를 올렸어요');
      return undefined;
    });
    panel.querySelectorAll('[data-report]').forEach((btn) => btn.addEventListener('click', () => window.M3.showSnackbar('신고를 받았어요')));
    panel.querySelectorAll('[data-reason]').forEach((btn) => btn.addEventListener('click', () => {
      vote(b.id, btn.dataset.reason);
      showTab(2);
      window.M3.showSnackbar('의견을 남겼어요');
    }));
  };

  const bind = () => {
    root.querySelector('[data-edit-conditions]')?.addEventListener('click', () => {
      editing = true;
      paint();
      focusCentered(root.querySelector('#quick-check .info-title'));
    });
    root.querySelector('#tabs').addEventListener('change', (e) => showTab(e.target.activeTabIndex));
    root.querySelectorAll('[data-tab-go]').forEach((btn) => btn.addEventListener('click', () => showTab(Number(btn.dataset.tabGo), true)));
    root.querySelector('#share').addEventListener('click', async () => {
      const url = location.href.split('?')[0];
      try {
        if (navigator.share) await navigator.share({ title: b.title, url });
        else {
          await navigator.clipboard.writeText(url);
          window.M3.showSnackbar('링크를 복사했어요');
        }
      } catch (error) {
        if (error.name === 'AbortError') return; // 공유 창을 닫은 경우
        const note = root.querySelector('#share-note');
        note.textContent = `링크를 복사하지 못했어요. 주소: ${url}`;
        note.hidden = false;
      }
    });
    root.querySelector('#quick-check')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      if (!checkFields(form)) return;
      const picked = readFields(form);
      // 시·군·구까지 봐야 판정되는 혜택은 시·도만으로 넘기면 다시 확인 필요에 머문다
      const sigungu = form.querySelector('[name="sigungu"]');
      if (sigungu && judge(b, { ...getProfile(), ...picked }).unknown.some((c) => c.key === 'region')) {
        sigungu.error = true;
        return focusCentered(sigungu);
      }
      saveProfile(picked);
      editing = false;
      paint();
      root.querySelector('.band')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // 새로 그린 띠는 낭독되지 않을 수 있어 판정 제목으로 포커스를 옮긴다
      root.querySelector('.band-title')?.focus({ preventScroll: true });
      return undefined;
    });
    root.querySelectorAll('[data-confirm]').forEach((box) => box.addEventListener('change', () => {
      const profile = getProfile();
      const mine = new Set(profile.confirmed?.[b.id] ?? []);
      if (box.checked) mine.add(box.dataset.confirm); else mine.delete(box.dataset.confirm);
      saveProfile({ confirmed: { ...profile.confirmed, [b.id]: [...mine] } });
      // 판정 글자와 띠 모양만 바꾼다. 체크칸을 다시 그리면 키보드 포커스를 잃는다
      const { verdict } = judge(b, getProfile());
      const band = root.querySelector('.band');
      band.className = `band ${verdict}`;
      band.querySelector('.band-title').innerHTML = bandTitle(verdict);
    }));
    root.querySelector('#next-alert')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const field = e.target.querySelector('md-outlined-text-field');
      if (!checkField(field)) return;
      addNextAlert(b.id, field.value);
      e.target.innerHTML = NEXT_ALERT_DONE;
    });
    bindPanel();
  };

  paint();
}
