// 자격 체크(내 조건 선택): 몇 가지만 고르면 맞춤 혜택 목록으로 간다.
import { checkFields, profileFields, readFields, wireFields } from '../ui.js';
import { clearProfile, getProfile, saveProfile } from '../store.js';

export function check(root) {
  const profile = getProfile();
  root.innerHTML = `
    <div class="narrow">
      <h1 class="page-title" tabindex="-1">내 조건 선택</h1>
      <form id="check-form" class="stack" novalidate>
        ${profileFields(['birthYear', 'region', 'status', 'school', 'income'], profile)}
        <div class="sticky-cta">
          <md-filled-button type="submit">결과 보기</md-filled-button>
        </div>
      </form>
      ${profile ? '<md-text-button id="reset">입력한 내용 지우기</md-text-button>' : ''}
    </div>`;

  const form = root.querySelector('#check-form');
  wireFields(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!checkFields(form)) return;
    const data = readFields(form);
    if (data.status !== 'student') data.schoolId = undefined;
    saveProfile(data);
    location.hash = '#/list';
  });

  root.querySelector('#reset')?.addEventListener('click', () => {
    clearProfile();
    check(root);
  });
}
