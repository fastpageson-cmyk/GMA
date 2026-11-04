// 여러 화면이 같이 쓰는 조각: 글자 처리, 혜택 카드, 판정 표시, 조건 입력칸.
import { BENEFITS } from './data/benefits.js';
import { CATEGORIES, SCHOOLS, schoolLabel } from './data/lookups.js';
import { REGIONS, SIDO_LIST } from './data/regions.js';
import { daysLeft, effectiveStatus, INCOME_BANDS, judge, onlyDirectLeft, STATUS_LABELS } from './judge.js';

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const icon = (name, slot) => `<md-icon${slot ? ` slot="${slot}"` : ''} aria-hidden="true">${name}</md-icon>`;
export const fmtDate = (s) => (s ? s.replaceAll('-', '.') : '');
/** 점 있는 도메인까지 있어야 메일이 닿는다. 브라우저 기본 검사는 a@b도 통과시킨다 */
export const EMAIL_PATTERN = '[^@\\s]+@[^@\\s]+\\.[^@\\s]+';

export const VERDICTS = {
  eligible: { label: '받을 수 있어요', short: '받을 수 있음', icon: 'check_circle' },
  check: { label: '확인이 필요해요', short: '확인 필요', icon: 'help' },
  no: { label: '대상이 아니에요', short: '대상 아님', icon: 'block' },
};

/** 판정 3단계는 색만이 아니라 모양으로도 구분한다: 채운 상자, 점선 테두리, 회색 */
export const verdictTag = (verdict) => {
  const v = VERDICTS[verdict];
  return v ? `<span class="verdict ${verdict}">${icon(v.icon)}${v.short}</span>` : '';
};

export function deadlineText(benefit) {
  const { status } = effectiveStatus(benefit);
  if (status === 'closed') return '마감';
  if (status === 'upcoming') return benefit.period?.start ? `${fmtDate(benefit.period.start)} 열림` : '곧 열림';
  if (benefit.period?.always) return '상시';
  const left = daysLeft(benefit);
  if (left === null) return '기간 확인 필요';
  return left === 0 ? '오늘 마감' : `D-${left}`;
}

/** 카드 한 줄: 온라인·서류 N개, 또는 확인할 조건. 조건 문장은 단정처럼 읽히지 않게 예시로 따로 둔다 */
function cardLine(benefit, result) {
  if (result.verdict === 'check' && result.unknown[0]) {
    return { line: `${onlyDirectLeft(result) ? '직접 확인' : '확인'} ${result.unknown.length}가지 남음`, example: `예: ${result.unknown[0].label}` };
  }
  if (result.verdict === 'no' && result.failed[0]) return { line: `안 맞는 조건: ${result.failed[0].label}` };
  const method = { online: '온라인', visit: '방문', both: '온라인·방문' }[benefit.apply?.method];
  const docs = benefit.documents?.length;
  return { line: [method && `${method} 신청`, docs ? `서류 ${docs}개` : null, benefit.apply?.cost === 'copay' ? '자부담 있음' : null].filter(Boolean).join(' · ') || benefit.oneLine };
}

export function benefitCard(benefit, profile, reason) {
  const result = judge(benefit, profile);
  const closed = effectiveStatus(benefit).status === 'closed';
  const { line, example } = reason ? { line: reason } : cardLine(benefit, result);
  return `<a class="m3-card outlined m3-interactive benefit-card${closed ? ' is-closed' : ''}" href="#/b/${esc(benefit.id)}">
    <md-ripple></md-ripple><md-focus-ring></md-focus-ring>
    <p class="card-meta"><span>${esc(benefit.sourceName)}</span><span class="deadline">${esc(deadlineText(benefit))}</span></p>
    <p class="card-amount">${esc(benefit.amount.text)}</p>
    <h3 class="card-title">${esc(benefit.title)}</h3>
    <p class="card-line">${esc(line)}</p>
    ${example ? `<p class="card-example">${esc(example)}</p>` : ''}
    ${verdictTag(result.verdict)}
  </a>`;
}

export const cardGrid = (benefits, profile) => `<div class="card-grid">${benefits.map((b) => benefitCard(b, profile)).join('')}</div>`;

/** 내 조건 요약 한 줄. 조각마다 묶어 줄이 바뀌어도 가운뎃점이 줄 끝에 남는다 */
export function profileSummary(p) {
  if (!p) return '';
  const parts = [
    p.birthYear && `${p.birthYear}년생`,
    [p.sido, p.sigungu].filter(Boolean).join(' '),
    STATUS_LABELS[p.status],
    p.schoolId && schoolLabel(p.schoolId),
    INCOME_BANDS[p.income]?.label,
  ].filter(Boolean);
  return parts.map((t, i) => `<span class="summary-part">${esc(t)}${i < parts.length - 1 ? ' ·' : ''}</span>`).join(' ');
}

const option = (value, label, selected) => `<md-select-option value="${esc(value)}"${selected ? ' selected' : ''}><div slot="headline">${esc(label)}</div></md-select-option>`;
const sigunguSelect = (sido, selected) => `<md-outlined-select name="sigungu" label="시·군·구" menu-positioning="popover" no-asterisk error-text="시·군·구를 골라 주세요"${REGIONS[sido]?.length ? '' : ' disabled'}>${(REGIONS[sido] ?? []).map((n) => option(n, n, n === selected)).join('')}</md-outlined-select>`;

function birthYearField(p) {
  const year = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, i) => year - 15 - i);
  return `<div class="field" data-field="birthYear">
    <md-outlined-select name="birthYear" label="연도 고르기" no-asterisk menu-positioning="popover" required error-text="태어난 해를 골라 주세요">
      ${years.map((y) => option(y, `${y}년`, y === p.birthYear)).join('')}
    </md-outlined-select>
  </div>`;
}

function regionField(p) {
  return `<div class="field field-row" data-field="region">
    <md-outlined-select name="sido" label="시·도" no-asterisk menu-positioning="popover" required error-text="사는 곳을 골라 주세요">
      ${SIDO_LIST.map((n) => option(n, n, n === p.sido)).join('')}
    </md-outlined-select>
    ${sigunguSelect(p.sido, p.sigungu)}
  </div>
  <p class="hint">시·군·구까지 고르면 더 정확해요.</p>`;
}

const singleChips = (name, label, options, value) => `<md-chip-set class="single-chips" data-name="${name}" role="group" aria-label="${esc(label)}">
  ${options.map(([v, l]) => `<md-filter-chip label="${esc(l)}" data-value="${esc(v)}"${v === value ? ' selected' : ''}></md-filter-chip>`).join('')}
</md-chip-set>`;

const statusField = (p) => `<div class="field" data-field="status">${singleChips('status', '지금 상태', Object.entries(STATUS_LABELS), p.status)}<p class="field-error" role="alert" hidden>지금 상태를 골라 주세요</p></div>`;

const schoolField = (p, always) => `<div class="field" data-field="school"${always || p.status === 'student' ? '' : ' hidden'}>
  <md-outlined-select name="schoolId" label="학교 고르기" menu-positioning="popover">${SCHOOLS.map((s) => option(s.id, s.label, s.id === p.schoolId)).join('')}</md-outlined-select>
</div>`;

const incomeField = (p) => `<p class="hint">우리 집 소득이 전국 가구의 가운데쯤이면 100%예요.</p>
<div class="field radio-list" data-field="income" role="radiogroup" aria-label="가구 소득">
  ${Object.entries(INCOME_BANDS).map(([v, band]) => `<label class="radio-row"><md-radio name="income" value="${v}" touch-target="wrapper"${(p.income ?? 'unknown') === v ? ' checked' : ''}></md-radio><span>${v === 'unknown' ? '모르겠어요' : esc(band.label)}</span></label>`).join('')}
</div>`;

const FIELD_HTML = { birthYear: birthYearField, region: regionField, status: statusField, income: incomeField };
const FIELD_TITLES = { birthYear: '태어난 해', region: '사는 곳', status: '지금 상태', school: '학교', income: '가구 소득' };

/** 조건 입력칸 묶음. 자격 체크, 바로 자격 확인, 알림 조건, 질문 고치기가 모두 이 함수를 쓴다. */
export function profileFields(fields, profile, { schoolAlways = false } = {}) {
  const p = profile ?? {};
  return fields.map((f) => {
    const body = f === 'school' ? schoolField(p, schoolAlways) : FIELD_HTML[f](p);
    const hint = f === 'school' ? '<span class="hint">대학생일 때만</span>' : '';
    if (f === 'school' && !schoolAlways) return `<div class="field-group" data-group="school"${p.status === 'student' ? '' : ' hidden'}><p class="field-title">${FIELD_TITLES[f]} ${hint}</p>${body.replace(' hidden', '')}</div>`;
    return `<div class="field-group"><p class="field-title">${FIELD_TITLES[f]}</p>${body}</div>`;
  }).join('');
}

/** 관심 분야 고르기. 알림 신청과 질문 고치기가 같이 쓴다 */
export const categoryChips = (selected = []) => `<md-chip-set aria-label="관심 분야">
  ${CATEGORIES.map((c) => `<md-filter-chip label="${esc(c.label)}" data-cat="${c.id}"${selected.includes(c.id) ? ' selected' : ''}></md-filter-chip>`).join('')}
</md-chip-set>`;
export const readCategoryChips = (root) => [...root.querySelectorAll('md-filter-chip[data-cat]')].filter((c) => c.selected).map((c) => c.dataset.cat);

const clearErrorOnEdit = (field) => ['input', 'change'].forEach((type) => field.addEventListener(type, () => { field.error = false; }));

/** 입력칸 동작 연결: 시·도를 고르면 시·군·구가 바뀌고, 대학생이면 학교칸이 나타난다. */
export function wireFields(root) {
  root.querySelectorAll('md-outlined-select[name="sido"]').forEach((sido) => {
    sido.addEventListener('change', () => {
      // md-select는 옵션을 갈아 끼워도 고른 값을 놓지 않아 칸을 새로 만든다
      sido.parentElement.querySelector('[name="sigungu"]').outerHTML = sigunguSelect(sido.value);
      clearErrorOnEdit(sido.parentElement.querySelector('[name="sigungu"]'));
    });
  });
  root.querySelectorAll('.single-chips').forEach((set) => {
    set.addEventListener('click', (e) => {
      const chip = e.target.closest('md-filter-chip');
      if (!chip) return;
      set.querySelectorAll('md-filter-chip').forEach((c) => { if (c !== chip) c.selected = false; });
      const error = set.parentElement.querySelector('.field-error');
      if (error) error.hidden = true;
      const group = root.querySelector('[data-group="school"]');
      if (set.dataset.name === 'status' && group) group.hidden = !(chip.selected && chip.dataset.value === 'student');
    });
  });
  root.querySelectorAll('[error-text]').forEach(clearErrorOnEdit);
}

/** 고정 띠나 상단 바에 가리지 않게 화면 가운데로 옮기고 포커스를 준다. */
export function focusCentered(el) {
  el.scrollIntoView({ block: 'center' });
  el.focus({ preventScroll: true });
}

/** 칸 하나를 검사한다. reportValidity는 브라우저 기본 문구를 띄우므로 error로 칸에 적어 둔 문구를 낸다. */
export function checkField(field) {
  field.error = !field.checkValidity();
  return !field.error;
}

/** 조건 입력칸 묶음을 검사하고 처음 빈 칸으로 포커스를 옮긴다. */
export function checkFields(root) {
  const required = [...root.querySelectorAll('md-outlined-select[required]')];
  required.forEach(checkField);
  const status = root.querySelector('[data-field="status"]');
  const statusMissing = status && !readFields(root).status;
  if (status) status.querySelector('.field-error').hidden = !statusMissing;
  const first = required.find((s) => s.error) ?? (statusMissing ? status.querySelector('md-filter-chip') : null);
  if (first) focusCentered(first);
  return !first;
}

/** 입력칸에서 값을 읽어 프로필 조각으로 돌려준다. 빈칸은 뺀다. */
export function readFields(root) {
  const value = (name) => root.querySelector(`md-outlined-select[name="${name}"]`)?.value || undefined;
  const status = [...root.querySelectorAll('.single-chips[data-name="status"] md-filter-chip')].find((c) => c.selected);
  const radio = [...root.querySelectorAll('md-radio[name="income"]')].find((r) => r.checked);
  const patch = {
    birthYear: value('birthYear') ? Number(value('birthYear')) : undefined,
    sido: value('sido'),
    sigungu: value('sigungu'),
    status: status?.dataset.value,
    schoolId: value('schoolId'),
    income: radio?.value,
  };
  const filled = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
  // 시·도를 바꿔 시·군·구가 비면 저장된 옛 시·군·구도 지워야 한다
  return root.querySelector('md-outlined-select[name="sigungu"]') ? { sigungu: undefined, ...filled } : filled;
}

/** 받을 수 있음 → 직접 확인만 남음 → 그 밖의 확인 필요 순. 같은 단에서는 남은 확인이 적고 마감이 빠른 순 */
export function rankBenefits(benefits, profile) {
  const tier = (r) => ({ eligible: 0, check: onlyDirectLeft(r) ? 1 : 2, unknown: 3, no: 4 })[r.verdict];
  const left = (b) => daysLeft(b) ?? 9999;
  return [...benefits].sort((a, b) => {
    const [x, y] = [judge(a, profile), judge(b, profile)];
    return tier(x) - tier(y) || x.unknown.length - y.unknown.length || left(a) - left(b);
  });
}

export const openBenefits = () => BENEFITS.filter((b) => effectiveStatus(b).status === 'open');
export const findBenefit = (id) => BENEFITS.find((b) => b.id === id);

/** 마감 혜택의 대안: 같은 분야에서 지금 열린 것. 원래 혜택의 지역을 제외한 사업은 대안이 아니다 */
export function similarOpen(benefit, profile, limit = 3) {
  const regions = benefit.eligibility?.regions ?? [];
  const open = openBenefits().filter((b) => b.id !== benefit.id && b.category === benefit.category
    && !regions.some((r) => b.eligibility?.excludedRegions?.includes(r)));
  return rankBenefits(open, profile).filter((b) => judge(b, profile).verdict !== 'no').slice(0, limit);
}
