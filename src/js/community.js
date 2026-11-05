// 커뮤니티 글과 댓글. 시범 글과 이 브라우저에서 쓴 글을 한 목록으로 합친다.
// 정책에 연결된 글(benefitId)은 정책 카드의 댓글 칸과 커뮤니티 게시판에 같이 나온다.
import { SEED_POSTS } from './data/community-seed.js';
import { getCommunity, saveComment, savePost } from './store.js';

const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
// 시각은 시간대 표기가 섞여 있어(+09:00, Z) 글자가 아니라 숫자로 비교한다
const lastActivity = (p) => Math.max(...[p.createdAt, ...p.comments.map((c) => c.createdAt)].map(Date.parse));

/** 모든 글. 최근에 글이나 댓글이 달린 순 */
export function allPosts() {
  const { posts, comments } = getCommunity();
  return [...posts, ...SEED_POSTS.map((p) => ({ ...p, seed: true }))]
    .map((p) => ({ ...p, comments: [...p.comments.map((c) => ({ ...c, seed: p.seed })), ...(comments[p.id] ?? [])] }))
    .sort((a, b) => lastActivity(b) - lastActivity(a));
}

export const getPost = (id) => allPosts().find((p) => p.id === id);
export const postsFor = (benefitId) => allPosts().filter((p) => p.benefitId === benefitId);

/** 정책 카드에 보이는 댓글 수: 연결된 글과 그 글의 댓글을 모두 센다 */
export const talkCount = (benefitId) => postsFor(benefitId).reduce((n, p) => n + 1 + p.comments.length, 0);

export function addPost({ title = '', body, benefitId, author }) {
  const post = { id: newId('post'), title: title.trim(), body: body.trim(), benefitId: benefitId || undefined, author: author.trim() || '익명', createdAt: new Date().toISOString(), comments: [] };
  savePost(post);
  return post;
}

export function addComment(postId, { body, author }) {
  const comment = { id: newId('c'), body: body.trim(), author: author.trim() || '익명', createdAt: new Date().toISOString() };
  saveComment(postId, comment);
  return comment;
}

/** '방금', 'N분 전', 'N시간 전', 'N일 전', 그보다 오래면 날짜 */
export function timeAgo(iso, now = Date.now()) {
  const sec = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (sec < 60) return '방금';
  if (sec < 3600) return `${Math.floor(sec / 60)}분 전`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}시간 전`;
  if (sec < 86400 * 7) return `${Math.floor(sec / 86400)}일 전`;
  return new Date(iso).toLocaleDateString('ko-KR');
}
