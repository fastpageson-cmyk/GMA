// 자격 판정 규칙 검사. 실행: node --test tests/
import assert from 'node:assert/strict';
import test from 'node:test';
import { BENEFITS } from '../src/js/data/benefits.js';
import { daysLeft, effectiveStatus, INCOME_BANDS, judge, missingFields, neededFields, onlyDirectLeft } from '../src/js/judge.js';
import { changedSlots, directHits, hasPersonalNumber, heardAnything, namedBenefits, parseSentence, searchBenefits, turnProfile } from '../src/js/search.js';
import { addNextAlert, getAlert, getConfirmed, getProfile, removeNextAlert, saveAlert, saveProfile } from '../src/js/store.js';
import { answerHeading, benefitCard, closingSoon, EMAIL_PATTERN, fold, judgeNotice, openBenefits, rankBenefits, similarOpen, verdictTag } from '../src/js/ui.js';
import { answerLead, blockedLine, recommend } from '../src/js/views/ask.js';
import { verdictBand } from '../src/js/views/detail.js';
import { home } from '../src/js/views/home.js';
import { results } from '../src/js/views/list.js';

const base = { eligibility: { birthYearMin: 1992, birthYearMax: 2007, regions: ['경기도 용인시'], statuses: ['student', 'jobseeker'] } };
const me = { birthYear: 2002, sido: '경기도', sigungu: '용인시', status: 'student', income: 'low' };

test('모든 조건이 확인되고 맞으면 받을 수 있음', () => {
  assert.equal(judge(base, me).verdict, 'eligible');
});

test('입력이 없으면 판정하지 않는다', () => {
  assert.equal(judge(base, null).verdict, 'unknown');
});

test('하나라도 확실히 틀리면 대상 아님', () => {
  const r = judge(base, { ...me, birthYear: 1990 });
  assert.equal(r.verdict, 'no');
  assert.equal(r.failed[0].key, 'age');
});

test('출생연도 경계값은 포함', () => {
  assert.equal(judge(base, { ...me, birthYear: 1992 }).verdict, 'eligible');
  assert.equal(judge(base, { ...me, birthYear: 2007 }).verdict, 'eligible');
  assert.equal(judge(base, { ...me, birthYear: 2008 }).verdict, 'no');
});

test('other가 있으면 절대 받을 수 있음이 아니다', () => {
  const b = { eligibility: { ...base.eligibility, other: ['중복 지원 불가'] } };
  assert.equal(judge(b, me).verdict, 'check');
});

test('거주 기간 요건은 확인 필요', () => {
  const b = { eligibility: { ...base.eligibility, residencyMonths: 6 } };
  assert.equal(judge(b, me).verdict, 'check');
});

test('소득을 모르면 소득 기준 있는 혜택은 확인 필요', () => {
  const b = { eligibility: { incomeMaxPercent: 150 } };
  assert.equal(judge(b, { income: 'unknown' }).verdict, 'check');
});

test('소득 구간이 기준에 걸치면 확인 필요, 구간이 확실하면 판정', () => {
  const b = { eligibility: { incomeMaxPercent: 100 } };
  assert.equal(judge(b, { income: 'low' }).verdict, 'eligible');
  assert.equal(judge(b, { income: 'mid' }).verdict, 'check');
  assert.equal(judge(b, { income: 'high' }).verdict, 'no');
});

test('시·도만 알고 시·군·구 요건이면 확인 필요', () => {
  const b = { eligibility: { regions: ['경기도 용인시'] } };
  assert.equal(judge(b, { sido: '경기도' }).verdict, 'check');
  assert.equal(judge(b, { sido: '서울특별시' }).verdict, 'no');
  assert.equal(judge(b, { sido: '경기도', sigungu: '수원시' }).verdict, 'no');
});

test('도 단위 요건은 시·군·구와 무관하게 맞다', () => {
  assert.equal(judge({ eligibility: { regions: ['경기도'] } }, { sido: '경기도', sigungu: '수원시' }).verdict, 'eligible');
});

test('도 사업이어도 제외 시군이면 대상 아님', () => {
  const b = { eligibility: { regions: ['경기도'], excludedRegions: ['경기도 용인시'] } };
  assert.equal(judge(b, { sido: '경기도', sigungu: '용인시' }).verdict, 'no');
  assert.equal(judge(b, { sido: '경기도', sigungu: '수원시' }).verdict, 'eligible');
  assert.equal(judge(b, { sido: '경기도' }).verdict, 'check');
});

test('직접 확인할 조건을 모두 체크해야 받을 수 있음', () => {
  const b = { id: 'x', eligibility: { regions: ['경기도'], other: ['가', '나'] } };
  assert.equal(judge(b, { sido: '경기도', confirmed: { x: ['가'] } }).verdict, 'check');
  assert.equal(judge(b, { sido: '경기도', confirmed: { x: ['가', '나'] } }).verdict, 'eligible');
  assert.equal(judge(b, { sido: '서울특별시', confirmed: { x: ['가', '나'] } }).verdict, 'no');
});

test('상태 그 밖에는 틀렸다고 단정하지 않는다', () => {
  assert.equal(judge({ eligibility: { statuses: ['student'] } }, { status: 'other' }).verdict, 'check');
});

test('조건 정보가 없는 혜택은 받을 수 있음으로 단정하지 않는다', () => {
  assert.equal(judge({ eligibility: {} }, me).verdict, 'check');
});

test('기간이 지난 혜택은 데이터가 open이어도 마감', () => {
  const b = { status: 'open', period: { end: '2026-10-31' } };
  assert.equal(effectiveStatus(b, new Date('2026-11-04T12:00:00')).status, 'closed');
  assert.equal(effectiveStatus(b, new Date('2026-10-31T23:00:00')).status, 'open');
});

test('상시 모집은 D-day가 없다', () => {
  assert.equal(daysLeft({ period: { always: true } }), null);
});

test('D-day는 날짜 기준', () => {
  assert.equal(daysLeft({ period: { end: '2026-12-04' } }, new Date('2026-11-04T23:00:00')), 30);
});

test('바로 자격 확인은 많아야 4칸', () => {
  const b = { eligibility: { birthYearMin: 1990, regions: ['경기도'], statuses: ['student'], incomeMaxPercent: 100, schoolIds: ['hufs'] } };
  assert.equal(neededFields(b).length, 4);
});

test('문장에서 조건을 알아듣는다', () => {
  const p = parseSentence('용인 사는 24살 대학생인데 토익 지원 있어?', 2026);
  assert.equal(p.sigungu, '용인시');
  assert.equal(p.sido, '경기도');
  assert.equal(p.birthYear, 2002);
  assert.equal(p.status, 'student');
  assert.deepEqual(p.interests, ['study']);
});

test('출생연도 두 자리도 알아듣는다', () => {
  assert.equal(parseSentence('02년생 취준생', 2026).birthYear, 2002);
  assert.equal(parseSentence('98년생', 2026).birthYear, 1998);
});

test('광주는 경기가 없으면 광주광역시', () => {
  assert.equal(parseSentence('광주 사는데', 2026).sido, '광주광역시');
  assert.equal(parseSentence('경기 광주 사는데', 2026).sigungu, '광주시');
});

test('청년이 쓰는 말이 0건이 되지 않는다', () => {
  const benefits = [
    { title: '자격시험 응시료 지원', keywords: ['어학'], category: 'study' },
    { title: '월세 지원', keywords: [], category: 'housing' },
    { title: '등록금 지원', keywords: ['장학'], category: 'scholarship' },
  ];
  for (const word of ['토익', '자격증', '월세', '장학금 지원']) assert.ok(searchBenefits(word, benefits).length > 0, word);
});

test('시범 데이터: 필수 칸이 있고 id가 겹치지 않는다', () => {
  assert.equal(new Set(BENEFITS.map((b) => b.id)).size, BENEFITS.length);
  for (const b of BENEFITS) {
    assert.ok(b.title && b.amount?.text && b.originalUrl && b.category, b.id);
    if (b.apply?.url) assert.match(b.apply.url, /^https?:/, b.id);
  }
});

test('시범 데이터: 실제 공고로 만든 검색어가 0건이 아니다', () => {
  for (const word of ['토익', '자격증', '월세', '장학금 지원']) assert.ok(searchBenefits(word, BENEFITS).length > 0, word);
});

test('시범 데이터: 용인 청년에게 응시료가 열려 있다고 하지 않는다', () => {
  const b = BENEFITS.find((x) => x.id === 'gg-exam-fee');
  assert.equal(judge(b, { sido: '경기도', sigungu: '용인시' }).verdict, 'no');
});

test('직접 확인만 남은 혜택은 판정은 그대로 확인 필요다', () => {
  const b = { id: 'x', eligibility: { regions: ['경기도'], other: ['가'] } };
  const r = judge(b, { sido: '경기도' });
  assert.equal(r.verdict, 'check');
  assert.equal(onlyDirectLeft(r), true);
  // 입력으로 맞춘 조건이 없으면 '조건이 맞다'고 말하지 않는다
  assert.equal(onlyDirectLeft(judge({ id: 'y', eligibility: { other: ['가'] } }, { sido: '경기도' })), false);
  // 입력이 더 필요한 조건이 남아 있어도 아니다
  assert.equal(onlyDirectLeft(judge({ id: 'z', eligibility: { regions: ['경기도'], incomeMaxPercent: 100, other: ['가'] } }, { sido: '경기도' })), false);
});

test('정렬: 받을 수 있음 → 직접 확인만 남음(적은 순) → 그 밖의 확인 필요', () => {
  const p = { sido: '경기도', confirmed: { done: ['가'] } };
  const make = (id, extra) => ({ id, period: { always: true }, eligibility: { regions: ['경기도'], ...extra } });
  const items = [
    make('needs-input', { incomeMaxPercent: 100 }),
    make('two-left', { other: ['가', '나'] }),
    make('one-left', { other: ['가'] }),
    make('done', { other: ['가'] }),
  ];
  assert.deepEqual(rankBenefits(items, p).map((b) => b.id), ['done', 'one-left', 'two-left', 'needs-input']);
});

test('시범 데이터: 조건을 다 입력한 대학생에게 직접 확인만 남은 혜택이 앞에 온다', () => {
  const p = { birthYear: 2002, sido: '경기도', sigungu: '용인시', status: 'student', schoolId: 'hufs', income: 'low' };
  const ranked = rankBenefits(BENEFITS.filter((b) => judge(b, p).verdict === 'check'), p);
  const flags = ranked.map((b) => onlyDirectLeft(judge(b, p)));
  assert.ok(flags.includes(true));
  assert.equal(flags.lastIndexOf(true), flags.indexOf(false) === -1 ? flags.length - 1 : flags.indexOf(false) - 1);
});

test('질문에서 뽑은 값은 사본에만 들어가고 저장값을 바꾸지 않는다', () => {
  const saved = Object.freeze({ birthYear: 2002, sido: '경기도', sigungu: '용인시', status: 'student', schoolId: 'hufs' });
  const turn = turnProfile(saved, parseSentence('취준생인데 면접 볼 때 받을 수 있는 돈', 2026));
  assert.equal(turn.status, 'jobseeker');
  assert.equal(saved.status, 'student');
  assert.equal(turn.schoolId, 'hufs');
  assert.deepEqual(changedSlots(turn, saved), ['status']);
});

test('아무것도 알아듣지 못한 질문은 바꿀 조건이 없다', () => {
  const saved = { birthYear: 2002, status: 'student' };
  assert.deepEqual(changedSlots(turnProfile(saved, parseSentence('장학금 있어?', 2026)), saved), []);
});

test('질문에서 시·도가 바뀌면 옛 시·군·구를 끌고 오지 않는다', () => {
  const saved = { sido: '경기도', sigungu: '용인시' };
  const turn = turnProfile(saved, parseSentence('부산 사는데 월세 지원 있어?', 2026));
  assert.equal(turn.sido, '부산광역시');
  assert.equal(turn.sigungu, undefined);
  assert.deepEqual(changedSlots(turn, saved), ['sido', 'sigungu']);
  // 같은 시·도를 말하면 시·군·구는 그대로다
  assert.equal(turnProfile(saved, parseSentence('경기 사는데', 2026)).sigungu, '용인시');
});

test('저장된 조건이 없어도 질문 조건은 반영을 물을 수 있다', () => {
  assert.deepEqual(changedSlots(turnProfile(null, parseSentence('02년생 취준생', 2026)), null), ['birthYear', 'status']);
});

test('비어 있는 칸만 다시 묻는다', () => {
  const b = { eligibility: { birthYearMin: 1990, regions: ['경기도 용인시'], statuses: ['jobseeker'] } };
  assert.deepEqual(missingFields(b, { birthYear: 2002, sido: '경기도', sigungu: '용인시' }), ['status']);
  // 시·군·구를 건너뛰었으면 사는 곳을 다시 연다
  assert.deepEqual(missingFields(b, { birthYear: 2002, sido: '경기도', status: 'jobseeker' }), ['region']);
  assert.deepEqual(missingFields(b, null), ['birthYear', 'region', 'status']);
});

test('이미 답한 칸은 판정이 확인 필요여도 다시 묻지 않는다', () => {
  const b = { eligibility: { statuses: ['student'], incomeMaxPercent: 100 } };
  assert.deepEqual(missingFields(b, { status: 'other', income: 'unknown' }), []);
  assert.deepEqual(missingFields(b, { status: 'student', income: 'mid' }), []);
});

test('다섯 조건이 있어도 네 칸을 채우면 남은 칸을 묻는다', () => {
  const b = { eligibility: { birthYearMin: 1990, regions: ['경기도'], statuses: ['student'], incomeMaxPercent: 100, schoolIds: ['hufs'] } };
  assert.deepEqual(missingFields(b, { birthYear: 2002, sido: '경기도', status: 'student', schoolId: 'hufs' }), ['income']);
});

test('값이 없는 프로필은 입력하지 않은 것으로 본다', () => {
  const data = new Map();
  globalThis.localStorage = { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
  assert.equal(saveProfile({ sigungu: undefined }), null);
  assert.equal(getProfile(), null);
  data.set('daeum.v1', JSON.stringify({ profile: {} }));
  assert.equal(getProfile(), null);
  saveProfile({ birthYear: 2002 });
  assert.equal(getProfile().birthYear, 2002);
});

test('다음 모집 알림은 기존 알림을 지우지 않고 더한다', () => {
  const data = new Map();
  globalThis.localStorage = { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
  saveAlert({ email: 'a@test.com', cats: ['job', 'study'], kinds: ['new'], benefits: [] });
  addNextAlert('yongin-exam-fee', 'a@test.com');
  addNextAlert('yongin-exam-fee', 'a@test.com');
  const alert = getAlert();
  assert.deepEqual(alert.cats, ['job', 'study']);
  assert.deepEqual(alert.kinds, ['new']);
  assert.deepEqual(alert.benefits, ['yongin-exam-fee']);
});

test('이메일은 점 있는 도메인까지 있어야 한다', () => {
  const re = new RegExp(`^${EMAIL_PATTERN}$`);
  for (const bad of ['a@b', 'me@test', '@b.com', 'a b@c.com']) assert.equal(re.test(bad), false, bad);
  assert.equal(re.test('me@test.com'), true);
});

test('알아듣지 못한 문장은 추천하지 않는다', () => {
  for (const q of ['아무말', 'ㅁㄴㅇㄹ', '!!!', '1234', '방학 때 뭐하지', '고양이 키우는데 지원']) assert.equal(heardAnything(parseSentence(q, 2026)), false, q);
  for (const q of ['토익', '24살', '용인 사는데', '취준생']) assert.equal(heardAnything(parseSentence(q, 2026)), true, q);
});

test('시범 데이터: 월세를 물으면 지방 근속 장려금이 걸리지 않는다', () => {
  for (const q of ['월세', '자취 월세', '서울 사는 30살 직장인 전세']) {
    const ids = searchBenefits(q, openBenefits()).map((b) => b.id);
    assert.ok(ids.includes('yongin-realtor-fee-discount'), q);
    assert.ok(!ids.includes('youth-job-leap-incentive'), q);
  }
});

test('넓은 연결어만 걸린 다른 분야 혜택은 빼고, 쓴 낱말이 있으면 분야가 달라도 넣는다', () => {
  const benefits = [
    { id: 'in', title: '시험 지원', category: 'study' },
    { id: 'link', title: '자격 요건 안내', category: 'job' },
    { id: 'word', title: '일자리 사업', keywords: ['토익'], category: 'job' },
  ];
  assert.deepEqual(searchBenefits('토익', benefits).map((b) => b.id).sort(), ['in', 'word']);
});

test('시범 데이터: 찾던 혜택이 마감이면 쓴 낱말로 찾아낸다', () => {
  const closed = BENEFITS.filter((b) => effectiveStatus(b, new Date('2026-11-04T12:00:00')).status === 'closed');
  assert.ok(directHits('토익 지원 있어?', closed).some((b) => b.id === 'yongin-exam-fee'));
  assert.ok(directHits('자취 월세', closed).some((b) => b.id === 'yongin-youth-rent'));
});

test('후기의 개인 숫자는 순서와 상관없이 걸러낸다', () => {
  const blocked = ['학점 4.3인데 됐어요', '평점 3.8', '소득 3000', '연봉 3천만원', '토익 900', '2.5/4.5', '4.3학점이에요', '월급 200만원', '300만 원 받음', '연봉 삼천만원', '3억 대출', '3.8 / 4.5 받았어요'];
  for (const text of blocked) assert.equal(hasPersonalNumber(text), true, text);
  const allowed = ['신청 3일 만에 됐어요', '서류 2개면 돼요', '학점은 안 봐요', '2주 걸렸어요', '토익 없어도 돼요', '탈락이 억울해요', '학점은 안 봐요. 2주 걸렸어요.'];
  for (const text of allowed) assert.equal(hasPersonalNumber(text), false, text);
});

test('시범 데이터: 용인 혜택의 대안에 용인을 제외한 사업을 넣지 않는다', () => {
  const b = BENEFITS.find((x) => x.id === 'yongin-exam-fee');
  const ids = similarOpen(b, null).map((x) => x.id);
  assert.ok(!ids.includes('gg-exam-fee'));
  assert.ok(ids.includes('national-learning-card'));
});

test('소득 구간은 쉬운 말이 앞에 온다', () => {
  for (const key of ['low', 'mid', 'high']) assert.match(INCOME_BANDS[key].label, /^(낮은 편|중간쯤|높은 편) \(기준 중위소득/);
});

test('카드는 남은 확인 수를 판정 상자에 합치고 조건 문장을 싣지 않는다', () => {
  const b = { id: 'x', title: '시범', sourceName: '용인시', amount: { text: '10만 원' }, period: { always: true }, eligibility: { regions: ['경기도'], other: ['가', '나'] } };
  const html = benefitCard(b, { sido: '경기도' });
  assert.match(html, /확인 필요 · 2가지/);
  assert.doesNotMatch(html, /남음|예: /);
  assert.equal(verdictTag('eligible').includes('가지'), false);
  // 아직 판정 전이면 상자가 없다
  assert.doesNotMatch(benefitCard(b, null), /class="verdict/);
});

test('곧 마감은 마감일이 있는 열린 혜택을 빠른 순으로 준다', () => {
  const left = closingSoon(6).map((b) => daysLeft(b));
  assert.ok(left.length > 0 && left.length <= 6);
  assert.deepEqual(left, [...left].sort((a, c) => a - c));
  assert.ok(left.every((n) => n !== null));
});

test('접힌 묶음은 내용이 없으면 그리지 않고, open이면 펼쳐 둔다', () => {
  assert.equal(fold('제목', 0), '');
  assert.match(fold('제목', '내용', true), /<details class="fold" open>/);
  assert.doesNotMatch(fold('제목', '내용', false), / open>/);
});

test('목록 머리는 같은 숫자를 반복하지 않는다', () => {
  const p = { birthYear: 2002, sido: '경기도', sigungu: '용인시', status: 'student', schoolId: 'hufs', income: 'low' };
  const html = results(p);
  assert.doesNotMatch(html, /count-row/);
  // 첫 묶음 제목은 페이지 제목과 같은 말이라 화면에서 숨긴다
  assert.match(html.match(/<h2[^>]*>/)[0], /visually-hidden/);
  assert.match(html, /대상 아님 \d+개/);
});

const heard = (q, saved = null) => {
  const parsed = parseSentence(q, 2026);
  const turn = { q, parsed, profile: turnProfile(saved, parsed) };
  return answerLead(turn, recommend(turn));
};

test('시범 데이터: 찾던 혜택이 마감이면 답 문장이 먼저 마감이라고 말한다', () => {
  assert.deepEqual(heard('용인 사는 24살 대학생인데 토익 지원 있어?'), ['찾던 혜택은 지금 마감이에요', '대신 지금 열린 혜택을 골랐어요.']);
});

test('시범 데이터: 낱말이 걸린 열린 혜택이 있으면 마감으로 답하지 않는다', () => {
  assert.notEqual(heard('장학금 있어?', { birthYear: 2002, sido: '경기도', sigungu: '용인시', status: 'student', schoolId: 'hufs' })[0], '찾던 혜택은 지금 마감이에요');
});

test('열린 혜택이 없으면 없다고 답한다', () => {
  const none = { cards: [], matched: false, closed: [] };
  assert.deepEqual(answerLead({ q: '월세', profile: {} }, none), ['지금 열린 혜택 중에는 맞는 게 없어요']);
  assert.equal(answerLead({ q: '월세', profile: {} }, { ...none, closed: [{ title: '마감된 혜택' }] })[0], '찾던 혜택은 지금 마감이에요');
});

test('곧 열림은 시작일 당일부터 열리고, 마감 다음날 닫힌다', () => {
  const b = { status: 'upcoming', period: { start: '2026-11-05', end: '2026-11-17' } };
  assert.equal(effectiveStatus(b, new Date('2026-11-04T23:59:00')).status, 'upcoming');
  assert.equal(effectiveStatus(b, new Date('2026-11-05T00:00:00')).status, 'open');
  assert.equal(effectiveStatus(b, new Date('2026-11-17T23:00:00')).status, 'open');
  assert.equal(effectiveStatus(b, new Date('2026-11-18T00:00:00')).status, 'closed');
  // 시작일을 모르는 혜택은 곧 열림에 머문다
  assert.equal(effectiveStatus({ status: 'upcoming', period: {} }, new Date('2026-11-05T12:00:00')).status, 'upcoming');
});

const answerTo = (q, saved = null) => {
  const parsed = parseSentence(q, 2026);
  const turn = { q, parsed, profile: turnProfile(saved, parsed) };
  const found = recommend(turn);
  return { found, lead: answerLead(turn, found) };
};

test('시범 데이터: 혜택 이름 그대로 물으면 28건 모두 답에 나온다', () => {
  for (const b of BENEFITS) {
    const { found } = answerTo(b.title);
    const shown = [...found.cards, ...found.closed, ...found.soon, ...found.blocked];
    assert.ok(shown.some((x) => x.id === b.id), b.title);
  }
});

test('이름은 띄어쓰기와 조사가 달라도 찾고, 짧은 분야 낱말은 이름으로 보지 않는다', () => {
  const ids = (q) => namedBenefits(q, BENEFITS).map((b) => b.id);
  assert.deepEqual(ids('내일배움카드가 뭐야'), ['national-learning-card']);
  assert.deepEqual(ids('부동산복비할인'), ['yongin-realtor-fee-discount']);
  assert.deepEqual(ids('국가장학금 있어?'), ['kosaf-national-type1', 'kosaf-national-type2']);
  for (const q of ['장학금', '장학금 지원', '토익 지원', '지원사업 있어?']) assert.deepEqual(ids(q), [], q);
});

test('시범 데이터: 찾던 혜택이 곧 열리면 곧 열린다고 답하고 카드에 섞지 않는다', () => {
  const { found, lead } = answerTo('국가장학금');
  assert.equal(lead[0], '찾던 혜택은 곧 열려요');
  assert.deepEqual(found.soon.map((b) => b.id), ['kosaf-national-type1', 'kosaf-national-type2']);
  assert.ok(found.cards.every((b) => effectiveStatus(b).status === 'open'));
  assert.equal(answerTo('장학금 지원').found.soon.length, 2);
});

test('시범 데이터: 이름을 부른 마감 혜택은 낱말이 걸린 열린 혜택이 있어도 마감이라고 답한다', () => {
  assert.equal(answerTo('청년 월세 지원').lead[0], '찾던 혜택은 지금 마감이에요');
  assert.deepEqual(answerTo('부동산 복비 할인').found.cards.map((b) => b.id), ['yongin-realtor-fee-discount']);
});

test('시·군·구 혜택은 그 지역 밖 사람에게 조건이 맞는다고 하지 않는다', () => {
  const coaching = BENEFITS.find((b) => b.id === 'yongin-ai-job-coaching');
  const busan = { birthYear: 2004, sido: '부산광역시', sigungu: '해운대구', status: 'student', income: 'unknown' };
  const r = judge(coaching, busan);
  assert.equal(r.outside, '용인시');
  assert.equal(r.verdict, 'check');
  assert.equal(onlyDirectLeft(r), false);
  assert.match(benefitCard(coaching, busan), /용인시 혜택이에요\. 사는 곳을 확인해 주세요/);
  // 같은 시·도 다른 시, 시·도만 입력해도 지역 밖을 안다
  assert.equal(judge(coaching, { ...busan, sido: '경기도', sigungu: '수원시' }).outside, '용인시');
  assert.equal(judge(coaching, { ...busan, sigungu: undefined }).outside, '용인시');
  assert.equal(judge(coaching, { ...busan, sido: '경기도', sigungu: undefined }).outside, null);
  assert.equal(onlyDirectLeft(judge(coaching, { ...busan, sido: '경기도', sigungu: '용인시' })), true);
  // 사는 곳 요건을 모르는 기관 혜택은 지역 밖으로 보지 않는다
  assert.equal(judge(BENEFITS.find((b) => b.id === 'yongin-solo-startup-office'), busan).outside, null);
});

test('입력값으로 답이 나오는 직접 확인 문장은 다시 묻지 않는다', () => {
  const get = (id) => BENEFITS.find((b) => b.id === id);
  const left = (id, p) => judge(get(id), p).unknown.map((c) => c.label);
  const yongin = { birthYear: 2002, sido: '경기도', sigungu: '용인시', status: 'student' };
  assert.deepEqual(left('yongin-ai-job-coaching', yongin), ['올해 이 사업을 신청한 적이 없어요']);
  assert.equal(left('yongin-ai-job-coaching', { ...yongin, sigungu: '수원시' }).length, 2);
  const job = { birthYear: 2004, status: 'jobseeker' };
  assert.deepEqual(left('national-employment-support', job), ['유형별 소득·재산·취업 경험 조건을 고용24에서 확인했어요']);
  // 34세를 넘으면 병역 문장은 본인이 봐야 한다
  assert.equal(left('national-employment-support', { ...job, birthYear: 1990 }).length, 2);
});

test('직접 확인 체크만 저장해도 조건을 입력한 것으로 치지 않는다', () => {
  const data = new Map();
  globalThis.localStorage = { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
  saveProfile({ confirmed: { a: ['가'] } });
  assert.equal(getProfile(), null);
  assert.deepEqual(getConfirmed(), { a: ['가'] });
  const learning = BENEFITS.find((b) => b.id === 'national-learning-card');
  saveProfile({ confirmed: { [learning.id]: learning.eligibility.other } });
  assert.equal(judge(learning, { confirmed: getConfirmed() }).verdict, 'eligible');
  saveProfile({ birthYear: 2002 });
  assert.deepEqual(getProfile().confirmed[learning.id], learning.eligibility.other);
});

test('혜택 소식 하나만 끊고, 남는 알림이 없으면 신청을 지운다', () => {
  const data = new Map();
  globalThis.localStorage = { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
  saveAlert({ cats: [], kinds: [], email: 'a@b.co', benefits: ['x', 'y'] });
  removeNextAlert('x');
  assert.deepEqual(getAlert().benefits, ['y']);
  removeNextAlert('y');
  assert.equal(getAlert(), null);
  saveAlert({ cats: ['job'], kinds: ['new'], email: 'a@b.co', benefits: ['x'] });
  removeNextAlert('x');
  assert.deepEqual(getAlert().cats, ['job']);
});

test('후기의 만점·분위·등급과 한글 숫자도 걸러낸다', () => {
  for (const text of ['4.3 만점에 3.9', '3분위', '1등급', '연봉 삼천인데 탈락', '학점 사점오']) assert.equal(hasPersonalNumber(text), true, text);
  for (const text of ['신청 3일 만에 됐어요', '10분이면 돼요', '서류 3장이면 끝', '소득 서류가 많아요', '일이 많아요']) assert.equal(hasPersonalNumber(text), false, text);
});

test('앱의 분야 이름 낱말은 알아듣고, 등록되지 않은 말은 추천하지 않는다', () => {
  for (const q of ['공부', '생활', '취업', '이사', '복비']) assert.equal(heardAnything(parseSentence(q, 2026)), true, q);
  for (const q of ['교통비', '유학', '육아', '도서관']) assert.equal(heardAnything(parseSentence(q, 2026)), false, q);
});

test('판정 안내는 판정이 있을 때만 붙는다', () => {
  assert.match(judgeNotice({ birthYear: 2002 }), /공고 기준으로 다시 확인하세요/);
  assert.equal(judgeNotice(null), '');
});

test('곧 마감은 조건을 넣은 사람에게 쓸 수 없는 혜택을 뺀다', () => {
  const profile = { birthYear: 2002, sido: '경기도', sigungu: '용인시', status: 'student', income: 'low' };
  assert.ok(closingSoon(28).some((b) => judge(b, profile).verdict === 'no'));
  const mine = closingSoon(28, profile);
  assert.ok(mine.length > 0);
  assert.ok(mine.every((b) => judge(b, profile).verdict !== 'no' && !judge(b, profile).outside));
  const busan = { ...profile, sido: '부산광역시', sigungu: '해운대구' };
  assert.ok(closingSoon(28, busan).every((b) => !judge(b, busan).outside));
});

test('내 조건 한 줄 답은 앞선 묶음을 말하고 프로필이 없으면 열린 수를 말한다', () => {
  const eligible = { eligibility: { birthYearMin: 1990 } };
  const direct = { eligibility: { birthYearMin: 1990, other: ['직접 볼 조건'] } };
  const unknown = { eligibility: { birthYearMin: 1990, incomeMaxPercent: 100 } };
  const p = { birthYear: 2002 };
  assert.equal(answerHeading([eligible, direct], null), '지금 열린 혜택 2개');
  assert.equal(answerHeading([eligible, direct], p), '지금 받을 수 있는 혜택 1개');
  assert.equal(answerHeading([direct, unknown], p), '입력한 조건이 맞는 혜택 1개');
  assert.equal(answerHeading([unknown], p, '월세·집 '), '지금 확인해 볼 월세·집 혜택 1개');
});

test('조건을 넣은 사람의 홈은 내 혜택 보기가 주 행동이고 실제 수를 말한다', () => {
  const render = (profile) => {
    const data = new Map(profile ? [['daeum.v1', JSON.stringify({ profile })]] : []);
    globalThis.localStorage = { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
    const root = { innerHTML: '', querySelector: () => ({ addEventListener() {} }) };
    home(root);
    return root.innerHTML;
  };
  const fresh = render(null);
  assert.match(fresh, /<md-filled-button href="#\/check">30초 자격 체크/);
  assert.doesNotMatch(fresh, /내 혜택 보기/);
  const back = render({ birthYear: 2002, sido: '경기도', sigungu: '용인시', status: 'student', income: 'low' });
  assert.match(back, /<md-filled-button href="#\/list">내 혜택 보기/);
  assert.match(back, /<md-text-button href="#\/check">조건 고치기/);
  assert.doesNotMatch(back, /30초 자격 체크/);
  assert.match(back, /혜택 \d+개예요/);
  assert.doesNotMatch(back, /가장 먼저 끝나요/);
});

test('판정 띠는 끝난 조건을 접고 남은 일만 펼친다', () => {
  const b = { id: 'x', eligibility: { birthYearMin: 1990, other: ['직접 볼 조건'] } };
  const p = { birthYear: 2002 };
  const before = verdictBand(judge(b, p), true);
  const opened = before.split('<details')[0];
  assert.match(opened, /data-confirm/);
  assert.match(before, /맞은 조건 1가지/);
  assert.match(before, /공고 기준으로 다시 확인하세요/);
  const after = verdictBand(judge(b, { ...p, confirmed: { x: ['직접 볼 조건'] } }), true);
  assert.doesNotMatch(after.split('<details')[0], /data-confirm/);
  assert.match(after, /맞은 조건 2가지/);
  assert.match(after, /<details[\s\S]*data-confirm/);
  assert.match(after, /공고 기준으로 다시 확인하세요/);
});

test('대상 아님 띠의 행동은 글자 버튼뿐이다', () => {
  const b = { id: 'x', eligibility: { birthYearMin: 2010 } };
  const band = verdictBand(judge(b, { birthYear: 2002 }), true, 'https://example.com');
  assert.doesNotMatch(band, /md-(outlined|filled)/);
  assert.match(band, /<md-text-button data-tab-go="2">/);
});

test('질문 답변의 대상 아님은 회색 판정 상자를 쓰고 상세로 간다', () => {
  const b = { id: 'x', title: '혜택', eligibility: { birthYearMin: 2010 } };
  const line = blockedLine(b, { birthYear: 2002 });
  assert.match(line, /class="verdict no"/);
  assert.match(line, /href="#\/b\/x"/);
  assert.match(line, /안 맞는 조건: 나이/);
});
