// 말로 찾기와 문장 알아듣기. 언어 모델 없이 사전과 규칙으로 돌아가는 시제품 판이다.
// 결과는 언제나 우리 데이터 안에서만 나온다 (20_데이터_명세.md 5장).
import { DICTIONARY } from './data/lookups.js';
import { REGIONS, SIDO_SHORT } from './data/regions.js';

const haystack = (b) => [b.title, b.officialTitle, b.oneLine, b.sourceName, ...(b.keywords ?? [])].join(' ').toLowerCase();

function dictionaryHits(text) {
  const lower = text.toLowerCase();
  return DICTIONARY.filter((d) => d.words.some((w) => lower.includes(w.toLowerCase())));
}

/** 사용자가 실제로 쓴 사전 낱말 */
function typedWords(text) {
  const lower = text.toLowerCase();
  return dictionaryHits(text).flatMap((h) => h.words).map((w) => w.toLowerCase()).filter((w) => lower.includes(w));
}

/** 사용자가 쓴 낱말이 혜택 글에 그대로 있는 것만 고른다. */
export function directHits(text, benefits) {
  const words = typedWords(text);
  return benefits.filter((b) => words.some((w) => haystack(b).includes(w)));
}

// 혜택 이름은 띄어쓰기·문장부호·괄호 설명을 빼고 비교한다
const squash = (s) => String(s ?? '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[\s·,.!?'"~-]/g, '');
const NAME_MIN = 4; // '장학금'처럼 짧은 말은 분야로 찾고 이름으로 보지 않는다
const PARTICLE = /[은는이가을를도요]$/;

/** 문장에 혜택 이름이 들어 있거나 문장이 이름의 일부면 그 혜택을 고른다. 사전보다 먼저 본다 */
export function namedBenefits(text, benefits) {
  const whole = squash(text);
  const words = text.split(/\s+/).map((w) => squash(w).replace(PARTICLE, '')).filter((w) => w.length >= NAME_MIN);
  return benefits.filter((b) => {
    const title = squash(b.title);
    const official = squash(b.officialTitle);
    return whole.includes(title) || whole.includes(official)
      || (whole.length >= NAME_MIN && (title.includes(whole) || official.includes(whole)))
      || words.some((w) => title.includes(w));
  });
}

/** 문장에서 찾아야 할 낱말과 분야를 뽑아 혜택을 고른다. 넓은 연결어만 걸린 다른 분야 혜택은 넣지 않는다. */
export function searchBenefits(text, benefits) {
  const hits = dictionaryHits(text);
  const terms = [...new Set(hits.flatMap((h) => [...h.link, ...h.words]))].map((t) => t.toLowerCase());
  const categories = new Set(hits.map((h) => h.category));
  const direct = new Set(directHits(text, benefits));
  const scored = benefits.filter((b) => categories.has(b.category) || direct.has(b)).map((b) => {
    const hay = haystack(b);
    const score = terms.filter((t) => hay.includes(t)).length + (categories.has(b.category) ? 1 : 0);
    return { b, score };
  });
  return scored.sort((x, y) => y.score - x.score).map((s) => s.b);
}

// 지역 이름이 들어 있지만 지역이 아닌 말
const NOT_PLACE = /고양이|이천만/g;

function findRegion(sentence) {
  const text = sentence.replace(NOT_PLACE, '');
  // '광주'만 쓰면 광주광역시로 본다. 경기도 광주시는 '경기'가 함께 있을 때만
  if (text.includes('광주') && !text.includes('경기')) return { sido: '광주광역시' };
  for (const [sido, list] of Object.entries(REGIONS)) {
    for (const name of list) {
      if (!/[시군]$/.test(name)) continue; // 구 이름은 겹치는 게 많아 시·군만 알아듣는다
      const short = name.slice(0, -1);
      if (short.length >= 2 && text.includes(short)) return { sido, sigungu: name };
    }
  }
  for (const [short, sido] of Object.entries(SIDO_SHORT)) {
    if (text.includes(short)) return { sido };
  }
  return {};
}

function findBirthYear(text, year) {
  const born = text.match(/(\d{2,4})\s*년생/);
  if (born) {
    const n = Number(born[1]);
    return n > 1900 ? n : n <= (year % 100) ? 2000 + n : 1900 + n;
  }
  const age = text.match(/(?:만\s*)?(\d{2})\s*(?:살|세)/);
  return age ? year - Number(age[1]) : undefined;
}

function findStatus(text) {
  if (/대학생|대학원생|학생|재학|휴학|복학/.test(text)) return 'student';
  if (/취준|취업\s*준비|구직|백수|무직|쉬고\s*있/.test(text)) return 'jobseeker';
  if (/직장인|회사원|재직|다니는\s*중|일하는\s*중/.test(text)) return 'employed';
  return undefined;
}

const SLOTS = ['birthYear', 'sido', 'sigungu', 'status', 'income'];

/** 문장에서 뽑은 값은 그 질문에서만 쓴다. 저장된 내 조건은 건드리지 않고 합친 사본을 돌려준다. */
export function turnProfile(saved, parsed) {
  const filled = SLOTS.filter((k) => parsed[k] !== undefined).map((k) => [k, parsed[k]]);
  const merged = { ...saved, ...Object.fromEntries(filled) };
  if (parsed.sido && parsed.sido !== saved?.sido && !parsed.sigungu) delete merged.sigungu;
  return merged;
}

/** 질문에서 쓴 조건 중 저장된 내 조건과 다른 칸 */
export function changedSlots(profile, saved) {
  return SLOTS.filter((k) => profile[k] !== saved?.[k]);
}

/** 분야도 조건도 하나 못 뽑은 문장인지 가른다. 알아듣지 못했으면 추천하지 않는다 */
export const heardAnything = (parsed) => parsed.interests.length > 0 || SLOTS.some((k) => parsed[k] !== undefined);

const PERSONAL_WORD = /학점|평점|점수|성적|소득|연봉|월급|시급|재산|토익|토플|오픽|텝스/;
const PERSONAL_NUMBER = [
  /\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?/,                                  // 3.8/4.5
  /\d[\d,.]*\s*(학점|점|억|천\s*만|백\s*만|(천|백|만)?\s*원)/,            // 300만 원, 3천만원, 4.3학점
  /[일이삼사오육칠팔구십백천](억|천만|백만|만\s*원)/,                      // 삼천만원
  /\d(\.\d+)?\s*만점/,                                               // 4.3 만점
  /\d+\s*(분위|등급)/,                                                // 3분위, 1등급
];
const KOREAN_NUMBER = /[일이삼사오육칠팔구](천|백|점\s*[일이삼사오육칠팔구])/;   // 연봉 삼천, 학점 사점오

/** 후기에 학점·소득 같은 개인 숫자가 있는지 본다. 낱말과 숫자가 한 문장에 있으면 순서와 상관없이 걸러낸다 */
export function hasPersonalNumber(text) {
  return text.split(/[!?\n]|\.(?=\s|$)/).some((s) => PERSONAL_NUMBER.some((re) => re.test(s)) || (PERSONAL_WORD.test(s) && (/\d/.test(s) || KOREAN_NUMBER.test(s))));
}

/** 문장을 자격 판정 입력과 관심 분야로 바꾼다. 알아듣지 못한 칸은 비워 둔다. */
export function parseSentence(text, year = new Date().getFullYear()) {
  return {
    ...findRegion(text),
    birthYear: findBirthYear(text, year),
    status: findStatus(text),
    interests: [...new Set(dictionaryHits(text).map((h) => h.category))],
  };
}
