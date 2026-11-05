// 알림 받기: 로그인 없이 이메일만 남긴다. 신청한 내용이 있으면 먼저 보여 주고 바꾸거나 끊을 수 있게 한다.
import { categoryLabel } from '../data/lookups.js';
import { categoryChips, checkField, EMAIL_PATTERN, esc, findBenefit, focusCentered, icon, profileFields, profileSummary, readCategoryChips, readFields, wireFields } from '../ui.js';
import { clearAlert, getAlert, getProfile, removeNextAlert, saveAlert, saveProfile } from '../store.js';

const KINDS = [
  { id: 'new', label: '새 혜택이 열릴 때', on: true },
  { id: 'soon', label: '마감 3일 전', on: true },
  { id: 'next', label: '다음 모집이 열릴 때', on: false },
];

const row = (label, value) => (value ? `<div class="info-row"><dt>${label}</dt><dd>${esc(value)}</dd></div>` : '');

function summary(saved) {
  const followed = (saved.benefits ?? []).map(findBenefit).filter(Boolean);
  return `<div class="narrow">
    <h1 class="page-title" tabindex="-1">알림을 받고 있어요</h1>
    <p class="page-sub">시제품이라 실제 메일은 아직 가지 않아요.</p>
    <div class="alert-summary">
      <dl class="info-list">
        ${row('받을 곳', saved.email)}
        ${row('관심 분야', saved.cats?.map(categoryLabel).join(', '))}
        ${row('언제', saved.kinds?.map((id) => KINDS.find((k) => k.id === id)?.label).join(', '))}
      </dl>
      ${followed.length ? `<div><p class="info-sub">소식 받는 혜택</p><ul class="followed-list">${followed.map((b) => `<li><span>${esc(b.title)}</span><md-text-button data-unfollow="${esc(b.id)}" aria-label="${esc(b.title)} 소식 끊기">끊기</md-text-button></li>`).join('')}</ul></div>` : ''}
      <div class="button-row">
        <md-outlined-button id="alert-edit">바꾸기</md-outlined-button>
        <md-text-button id="alert-stop">그만 받기</md-text-button>
      </div>
    </div>
  </div>`;
}

function formHtml(saved, profile, target) {
  const kindOn = (k) => (saved ? saved.kinds?.includes(k.id) : k.on) || (target && k.id === 'next');
  // 혜택 소식을 받으면 그것만으로도 알림이 가므로 관심 분야는 비워도 된다
  const catsOptional = target || saved?.benefits?.length;
  return `<div class="alert-layout">
    <div>
      <h1 class="page-title" tabindex="-1">새 혜택이 생기면 알려 드려요</h1>
      <p class="page-sub">로그인도 회원가입도 없어요. 이메일 하나면 돼요.</p>
      ${target ? `<p class="notice-line">${icon('notifications')}${esc(target.title)} 소식도 함께 보내 드려요.</p>` : ''}
      <form id="alert-form" class="stack" novalidate>
        <fieldset class="field-group plain"><legend class="field-title">1. 관심 분야 <span class="hint">${catsOptional ? '비워도 돼요' : '하나 이상'}</span></legend>
          ${categoryChips(saved?.cats)}
          <p class="field-error" id="cat-error" role="alert" hidden>관심 분야를 하나 이상 골라 주세요</p>
        </fieldset>
        <div class="field-group"><p class="field-title">2. 내 조건${profile ? '' : ' <span class="hint">비워도 돼요</span>'}</p>
          ${profile
            ? `<div class="condition-bar"><p>${profileSummary(profile)}</p><md-text-button type="button" id="alert-edit-conditions">수정</md-text-button></div>`
            : `<div id="alert-conditions">${profileFields(['birthYear', 'region', 'status'], null)}</div>`}
        </div>
        <fieldset class="field-group plain"><legend class="field-title">3. 언제 알려 드릴까요</legend>
          ${KINDS.map((k) => `<label class="check-row"><md-checkbox touch-target="wrapper" name="kind" value="${k.id}"${kindOn(k) ? ' checked' : ''}></md-checkbox><span>${k.label}</span></label>`).join('')}
          <p class="field-error" id="kind-error" role="alert" hidden>언제 받을지 하나 이상 골라 주세요</p>
        </fieldset>
        <div class="field-group"><p class="field-title">4. 받을 곳</p>
          <md-outlined-text-field name="email" type="email" label="이메일" no-asterisk value="${esc(saved?.email ?? '')}" pattern="${EMAIL_PATTERN}" required error-text="이메일을 확인해 주세요"></md-outlined-text-field>
          <label class="check-row"><md-checkbox touch-target="wrapper" name="consent"${saved ? ' checked' : ''}></md-checkbox><span>알림 메일 받기에 동의해요. 메일에서 언제든 끊을 수 있어요.</span></label>
          <p class="field-error" id="consent-error" role="alert" hidden>메일을 보내려면 동의가 필요해요</p>
        </div>
        <div class="sticky-cta"><md-filled-button type="submit">알림 받기</md-filled-button></div>
      </form>
    </div>
    <aside class="mail-preview" aria-label="메일 미리보기">
      <p class="hint">메일 미리보기</p>
      <div class="mail">
        <p class="mail-from">${icon('mail')}닿음</p>
        <p class="mail-subject">내 조건에 맞는 새 혜택이 열렸어요</p>
        <p>새로 열린 혜택의 금액과 마감일을 한눈에 보내 드려요. 버튼을 누르면 혜택 상세로 바로 가요.</p>
        <p class="hint">[혜택 이름] · [금액] · [마감일]</p>
        <md-outlined-button disabled>혜택 보러 가기</md-outlined-button>
      </div>
    </aside>
  </div>`;
}

export function alert(root, { query }) {
  const target = query.benefit ? findBenefit(query.benefit) : null;
  let editing = false;

  const bindForm = (saved) => {
    const form = root.querySelector('#alert-form');
    wireFields(form);
    // 자격 체크로 나가면 고른 분야와 이메일이 사라지므로 이 자리에서 고친다
    form.querySelector('#alert-edit-conditions')?.addEventListener('click', () => {
      form.querySelector('.condition-bar').outerHTML = `<div id="alert-conditions">${profileFields(['birthYear', 'region', 'status'], getProfile())}</div>`;
      const conditions = form.querySelector('#alert-conditions');
      wireFields(conditions);
      const first = conditions.querySelector('md-outlined-select');
      first.updateComplete.then(() => first.focus());
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cats = readCategoryChips(form);
      const kinds = [...form.querySelectorAll('md-checkbox[name="kind"]')].filter((c) => c.checked).map((c) => c.value);
      const email = form.querySelector('md-outlined-text-field');
      const consent = form.querySelector('md-checkbox[name="consent"]');
      const emailOk = checkField(email);
      const benefits = [...new Set([...(saved?.benefits ?? []), target?.id].filter(Boolean))];
      const catsMissing = !cats.length && !benefits.length;
      const kindsMissing = !kinds.length && !benefits.length;
      form.querySelector('#cat-error').hidden = !catsMissing;
      form.querySelector('#kind-error').hidden = !kindsMissing;
      form.querySelector('#consent-error').hidden = consent.checked;
      // 고정 버튼을 눌러도 오류가 화면 밖에 남지 않게 첫 오류 칸으로 옮긴다
      const first = (catsMissing && form.querySelector('md-filter-chip')) || (kindsMissing && form.querySelector('md-checkbox[name="kind"]')) || (!emailOk && email) || (!consent.checked && consent);
      if (first) return focusCentered(first);

      const conditions = form.querySelector('#alert-conditions');
      if (conditions) {
        const data = readFields(conditions);
        if (data.status && data.status !== 'student') data.schoolId = undefined;
        saveProfile(data);
      }
      saveAlert({ email: email.value, cats, kinds, benefits });
      root.querySelector('.alert-layout').innerHTML = `<div class="narrow done-card">
        <h1 class="page-title" tabindex="-1">알림을 신청했어요</h1>
        <p>보낼 곳: ${esc(email.value)}</p>
        <p>시제품이라 실제 메일은 아직 가지 않아요.</p>
        <div class="button-row"><md-filled-tonal-button href="#/list">혜택 보러 가기</md-filled-tonal-button></div>
      </div>`;
      root.querySelector('h1').focus();
      return undefined;
    });
  };

  const paint = () => {
    const saved = getAlert();
    // 이미 신청했으면 요약부터. 새 혜택 소식을 더하러 온 경우만 바로 폼을 연다
    const addingTarget = target && !saved?.benefits?.includes(target.id);
    if (saved && !editing && !addingTarget) {
      root.innerHTML = summary(saved);
      root.querySelector('#alert-edit').addEventListener('click', () => {
        editing = true;
        paint();
        root.querySelector('h1').focus();
      });
      root.querySelector('#alert-stop').addEventListener('click', () => {
        clearAlert();
        paint();
        root.querySelector('h1').focus();
        window.M3.showSnackbar('알림을 끊었어요');
      });
      root.querySelectorAll('[data-unfollow]').forEach((btn) => btn.addEventListener('click', () => {
        removeNextAlert(btn.dataset.unfollow);
        paint();
        root.querySelector('h1').focus();
        window.M3.showSnackbar('이 혜택 소식을 끊었어요');
      }));
      return;
    }
    root.innerHTML = formHtml(saved, getProfile(), target);
    bindForm(saved);
  };

  paint();
}
