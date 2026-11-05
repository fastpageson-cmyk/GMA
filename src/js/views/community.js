// 커뮤니티: 게시판 목록, 글 보기, 글쓰기. 정책 카드의 댓글 칸도 여기 조각을 같이 쓴다.
// 정책에 연결된 글은 정책 카드 → 커뮤니티, 커뮤니티 → 정책 카드로 서로 넘어간다.
import { addComment, addPost, allPosts, getPost, postsFor, timeAgo } from '../community.js';
import { BENEFITS } from '../data/benefits.js';
import { benefitCard, checkField, esc, findBenefit, focusCentered, icon } from '../ui.js';
import { getNickname, getProfile, saveNickname } from '../store.js';

const KINDS = { all: '전체', free: '자유글', policy: '정책 이야기' };
let kind = 'all';

const seedTag = (item) => (item.seed ? '<span class="seed-tag">시범 글</span>' : '');
const postTitle = (p) => p.title || `‘${findBenefit(p.benefitId)?.title ?? '정책'}’에 남긴 댓글`;
const paragraphs = (text) => esc(text).split('\n').map((line) => `<p>${line}</p>`).join('');
const snippet = (text, n = 90) => (text.length > n ? `${text.slice(0, n)}…` : text);

/** 정책으로 가는 작은 링크. 커뮤니티 글 어디서나 같은 모양 */
const policyLink = (benefitId, hash = '') => {
  const b = findBenefit(benefitId);
  return b ? `<a class="policy-link m3-interactive" href="#/b/${esc(b.id)}${hash}"><md-ripple></md-ripple><md-focus-ring></md-focus-ring>${icon('description')}<span>${esc(b.title)}</span>${icon('chevron_right')}</a>` : '';
};

/** 댓글 쓰기 칸. 정책 카드와 글 보기 화면이 같이 쓴다 */
export const talkForm = (id, label, placeholder) => `<form class="talk-form" id="${id}" novalidate>
  <md-outlined-text-field type="textarea" name="body" label="${label}" placeholder="${esc(placeholder)}" rows="3" maxlength="500" required no-asterisk error-text="내용을 써 주세요"></md-outlined-text-field>
  <div class="talk-form-row">
    <md-outlined-text-field name="author" label="닉네임 (선택)" value="${esc(getNickname())}" maxlength="20"></md-outlined-text-field>
    <md-filled-tonal-button type="submit">등록</md-filled-tonal-button>
  </div>
</form>`;

/** 폼 값을 읽어 검사한다. 빈 글이면 null */
function readTalk(form) {
  const body = form.querySelector('[name="body"]');
  body.value = body.value.trim();
  if (!checkField(body)) {
    focusCentered(body);
    return null;
  }
  const author = form.querySelector('[name="author"]').value.trim();
  saveNickname(author);
  return { body: body.value, author };
}

const commentItem = (c) => `<li class="talk-item">
  <p class="talk-meta"><b>${esc(c.author)}</b><span>${timeAgo(c.createdAt)}</span>${seedTag(c)}</p>
  <div class="talk-body">${paragraphs(c.body)}</div>
</li>`;

/* ── 정책 카드(혜택 상세)의 댓글 탭 ── */

export function policyTalk(b) {
  const posts = postsFor(b.id);
  return `
    <p class="notice-line">${icon('forum')}여기 남긴 댓글은 <a class="inline-link" href="#/community">커뮤니티</a>에도 함께 올라가요.</p>
    ${talkForm('policy-talk-form', '댓글', '이 정책에 대해 궁금한 점이나 받아 본 이야기를 남겨 주세요')}
    ${posts.length
      ? `<ul class="talk-list">${posts.map((p) => `<li class="talk-item">
          <p class="talk-meta"><b>${esc(p.author)}</b><span>${timeAgo(p.createdAt)}</span>${seedTag(p)}</p>
          ${p.title ? `<p class="talk-title">${esc(p.title)}</p>` : ''}
          <div class="talk-body">${paragraphs(p.body)}</div>
          <a class="talk-go m3-interactive" href="#/community/${esc(p.id)}"><md-ripple></md-ripple><md-focus-ring></md-focus-ring>${icon('forum')}<span>답글 ${p.comments.length}개 · 커뮤니티에서 보기</span>${icon('chevron_right')}</a>
        </li>`).join('')}</ul>`
      : '<p class="empty">아직 댓글이 없어요. 첫 댓글을 남겨 주세요.</p>'}`;
}

/** 정책 카드 댓글 등록. 커뮤니티에 정책 이야기 글로 올라간다 */
export function bindPolicyTalk(panel, b, done) {
  panel.querySelector('#policy-talk-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const talk = readTalk(e.target);
    if (!talk) return;
    addPost({ ...talk, benefitId: b.id });
    done();
    window.M3.showSnackbar('댓글을 남겼어요. 커뮤니티에도 올라갔어요');
  });
}

/* ── 게시판 목록 ── */

function postRow(p) {
  const kindLabel = p.benefitId && !p.title ? '정책 댓글' : p.benefitId ? '정책 이야기' : '자유글';
  return `<li class="post-row">
    <a class="post-link m3-interactive" href="#/community/${esc(p.id)}"><md-ripple></md-ripple><md-focus-ring></md-focus-ring>
      <p class="post-kind"><span class="kind-tag">${kindLabel}</span>${seedTag(p)}</p>
      <h2 class="post-title">${esc(postTitle(p))}</h2>
      <p class="post-snippet">${esc(snippet(p.body))}</p>
      <p class="post-meta"><span>${esc(p.author)}</span><span>${timeAgo(p.createdAt)}</span><span>${icon('chat_bubble')}댓글 ${p.comments.length}</span></p>
    </a>
    ${p.benefitId ? policyLink(p.benefitId) : ''}
  </li>`;
}

export function community(root) {
  const paint = () => {
    const posts = allPosts().filter((p) => kind === 'all' || (kind === 'policy' ? p.benefitId : !p.benefitId));
    root.innerHTML = `
      <div class="community">
        <div class="community-head">
          <div>
            <h1 class="page-title" tabindex="-1">커뮤니티</h1>
            <p class="page-sub">혜택 이야기를 자유롭게 나눠요. 정책 카드에 단 댓글도 여기 올라와요.</p>
          </div>
          <md-filled-button href="#/community/write">${icon('edit', 'icon')}글쓰기</md-filled-button>
        </div>
        <md-chip-set class="kind-chips" aria-label="글 종류">
          ${Object.entries(KINDS).map(([id, label]) => `<md-filter-chip label="${label}" data-kind="${id}"${kind === id ? ' selected' : ''}></md-filter-chip>`).join('')}
        </md-chip-set>
        ${posts.length ? `<ul class="post-list">${posts.map(postRow).join('')}</ul>` : '<p class="empty">아직 글이 없어요. 첫 글을 남겨 주세요.</p>'}
        <p class="hint community-note">시제품이라 내가 쓴 글과 댓글은 이 브라우저에만 저장돼요.</p>
      </div>`;
    root.querySelector('.kind-chips').addEventListener('click', (e) => {
      const chip = e.target.closest('md-filter-chip');
      if (!chip) return;
      kind = chip.dataset.kind;
      paint();
    });
  };
  paint();
}

/* ── 글 보기 ── */

export function communityPost(root, { params }) {
  const paint = () => {
    const p = getPost(params[0]);
    if (!p) {
      root.innerHTML = `<div class="narrow"><h1 class="page-title" tabindex="-1">글을 찾을 수 없어요</h1>
        <p class="page-sub">지워졌거나 다른 브라우저에서 쓴 글이에요.</p><md-filled-button href="#/community">커뮤니티로 가기</md-filled-button></div>`;
      return;
    }
    const b = p.benefitId && findBenefit(p.benefitId);
    root.innerHTML = `
      <article class="narrow post">
        <a class="back-link m3-interactive" href="#/community"><md-ripple></md-ripple><md-focus-ring></md-focus-ring>${icon('arrow_back')}커뮤니티</a>
        <p class="post-kind">${seedTag(p)}</p>
        <h1 class="page-title" tabindex="-1">${esc(postTitle(p))}</h1>
        <p class="talk-meta"><b>${esc(p.author)}</b><span>${timeAgo(p.createdAt)}</span></p>
        <div class="post-body">${paragraphs(p.body)}</div>
        ${b ? `<section class="linked-policy" aria-labelledby="linked-title">
          <h2 class="info-title" id="linked-title">연결된 정책</h2>
          ${benefitCard(b, getProfile())}
          <md-text-button href="#/b/${esc(b.id)}?tab=talk">${icon('forum', 'icon')}이 정책의 댓글 모두 보기</md-text-button>
        </section>` : ''}
        <section class="post-comments" aria-labelledby="comments-title">
          <h2 class="info-title" id="comments-title">댓글 ${p.comments.length}개</h2>
          ${p.comments.length ? `<ul class="talk-list">${p.comments.map(commentItem).join('')}</ul>` : '<p class="empty">아직 댓글이 없어요.</p>'}
          ${talkForm('comment-form', '댓글', '댓글을 남겨 주세요')}
        </section>
      </article>`;
    root.querySelector('#comment-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const talk = readTalk(e.target);
      if (!talk) return;
      addComment(p.id, talk);
      paint();
      window.M3.showSnackbar('댓글을 남겼어요');
    });
  };
  paint();
}

/* ── 글쓰기 ── */

export function communityWrite(root, { query }) {
  const picked = findBenefit(query.benefit)?.id ?? '';
  root.innerHTML = `
    <div class="narrow">
      <a class="back-link m3-interactive" href="#/community"><md-ripple></md-ripple><md-focus-ring></md-focus-ring>${icon('arrow_back')}커뮤니티</a>
      <h1 class="page-title" tabindex="-1">글쓰기</h1>
      <form id="write-form" class="stack write-form" novalidate>
        <md-outlined-text-field name="title" label="제목" maxlength="60" required no-asterisk error-text="제목을 써 주세요"></md-outlined-text-field>
        <md-outlined-text-field type="textarea" name="body" label="내용" rows="8" maxlength="2000" required no-asterisk error-text="내용을 써 주세요"></md-outlined-text-field>
        <div class="field-group">
          <md-outlined-select name="benefit" label="연결할 정책 (선택)" menu-positioning="popover" supporting-text="연결하면 그 정책 카드의 댓글 칸에도 보여요">
            <md-select-option value=""${picked ? '' : ' selected'}><div slot="headline">연결 안 함</div></md-select-option>
            ${BENEFITS.map((b) => `<md-select-option value="${esc(b.id)}"${b.id === picked ? ' selected' : ''}><div slot="headline">${esc(b.title)}</div></md-select-option>`).join('')}
          </md-outlined-select>
        </div>
        <md-outlined-text-field name="author" label="닉네임 (선택)" value="${esc(getNickname())}" maxlength="20"></md-outlined-text-field>
        <div class="button-row"><md-filled-button type="submit">올리기</md-filled-button></div>
      </form>
    </div>`;

  root.querySelector('#write-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const field = (name) => form.querySelector(`[name="${name}"]`);
    ['title', 'body'].forEach((n) => { field(n).value = field(n).value.trim(); });
    const bad = ['title', 'body'].map(field).find((f) => !checkField(f));
    if (bad) return focusCentered(bad);
    saveNickname(field('author').value.trim());
    const post = addPost({ title: field('title').value, body: field('body').value, benefitId: field('benefit').value, author: field('author').value });
    location.hash = `#/community/${post.id}`;
    return undefined;
  });
}
