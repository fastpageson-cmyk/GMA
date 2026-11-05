// 브라우저 저장소. 자격 체크 입력은 서버로 보내지 않는다 (20_데이터_명세.md 6장).
// 후기·투표·알림은 실제 서버가 붙기 전까지 이 브라우저에만 남는 시제품 저장이다.
const KEY = 'daeum.v1';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

function write(patch) {
  const next = { ...read(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // 시크릿 창처럼 저장이 막혀도 화면은 계속 돌아간다
  }
  return next;
}

// 값이 하나도 없는 프로필은 입력하지 않은 것과 같다. 직접 확인 체크만 있어도 조건을 입력한 것은 아니다
const hasValue = (profile) => Object.entries(profile ?? {}).some(([k, v]) => k !== 'confirmed' && v !== undefined);

export function getProfile() {
  const { profile } = read();
  return hasValue(profile) ? profile : null;
}

export function saveProfile(patch) {
  const profile = { ...read().profile, ...patch };
  return hasValue(profile) || profile.confirmed ? write({ profile }).profile : null;
}

export const getConfirmed = () => read().profile?.confirmed ?? {};

export const clearProfile = () => write({ profile: null });

export const getReviews = (id) => read().reviews?.[id] ?? [];
export function addReview(id, review) {
  const reviews = read().reviews ?? {};
  write({ reviews: { ...reviews, [id]: [review, ...(reviews[id] ?? [])] } });
}

export const getVotes = (id) => read().votes?.[id] ?? {};
export const getMyVote = (id) => read().myVotes?.[id];
export function vote(id, reason) {
  const { votes = {}, myVotes = {} } = read();
  const mine = myVotes[id];
  if (mine === reason) return;
  const counts = { ...votes[id] };
  if (mine) counts[mine] = Math.max(0, (counts[mine] ?? 1) - 1);
  counts[reason] = (counts[reason] ?? 0) + 1;
  write({ votes: { ...votes, [id]: counts }, myVotes: { ...myVotes, [id]: reason } });
}

export const isSignedIn = () => Boolean(read().signedIn);
export const signIn = () => write({ signedIn: true });

export const getAlert = () => read().alert ?? null;
export const saveAlert = (alert) => write({ alert });
export const clearAlert = () => write({ alert: null });

/** 혜택 하나만 끊는다. 남는 알림이 없으면 신청 자체를 지운다 */
export function removeNextAlert(id) {
  const saved = getAlert();
  const benefits = saved.benefits.filter((b) => b !== id);
  if (benefits.length || saved.cats?.length || saved.kinds?.length) saveAlert({ ...saved, benefits });
  else clearAlert();
}

// 질문 기록은 탭이 열려 있는 동안만 둔다
const TURNS_KEY = 'daeum.turns';
export function getTurns() {
  try {
    return JSON.parse(sessionStorage.getItem(TURNS_KEY)) ?? [];
  } catch {
    return [];
  }
}
export function saveTurns(turns) {
  try {
    sessionStorage.setItem(TURNS_KEY, JSON.stringify(turns));
  } catch {
    // 저장이 막혀도 대화는 이어진다
  }
}

/** 다음 모집 알림은 기존 알림 설정을 지우지 않고 혜택만 더한다 */
export function addNextAlert(id, email) {
  const saved = getAlert();
  saveAlert({ cats: [], kinds: [], ...saved, email, benefits: [...new Set([...(saved?.benefits ?? []), id])] });
}
