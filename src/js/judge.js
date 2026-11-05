// 자격 판정. handoff/20_데이터_명세.md 3장 규칙을 그대로 옮긴 순수 함수.
// 원칙: 애매하면 무조건 '확인 필요'. 틀리게 '받을 수 있음'을 띄우는 게 가장 나쁜 실패다.

// 2026년 기준 중위소득(월, 보건복지부 고시). 구간 옆에 실제 금액을 보여 줄 때 쓴다.
export const MEDIAN_INCOME_2026 = { 1: 2564238, 4: 6494738 };
const manwon = (won) => `${Math.round(won / 10000).toLocaleString('ko-KR')}만 원`;
const band = (min, max) => ({
  label: `중위소득 ${max}% 이하 (1인 월 ${manwon(MEDIAN_INCOME_2026[1] * max / 100)} · 4인 월 ${manwon(MEDIAN_INCOME_2026[4] * max / 100)})`,
  short: `중위소득 ${max}% 이하`,
  min,
  max,
});

// 가구 소득 구간. 값은 기준 중위소득 %. 경계는 시범 데이터의 소득 기준(50·100·150·200·300%)에 맞춰
// 구간 하나로 답이 갈리지 않게 했다. 구간이 기준에 걸치면 '확인 필요'로 둔다.
export const INCOME_BANDS = {
  p50: band(0, 50),
  p100: band(50, 100),
  p150: band(100, 150),
  p200: band(150, 200),
  p300: band(200, 300),
  over300: { label: `중위소득 300% 넘음 (1인 월 ${manwon(MEDIAN_INCOME_2026[1] * 3)} · 4인 월 ${manwon(MEDIAN_INCOME_2026[4] * 3)} 넘음)`, short: '중위소득 300% 넘음', min: 300, max: Infinity },
  unknown: { label: '소득 모름', short: '소득 모름' },
};

export const STATUS_LABELS = { student: '대학생', jobseeker: '구직 중', employed: '일하는 중', other: '그 밖에' };

const DAY = 86400000;
const parseDay = (s) => new Date(`${s}T00:00:00`);

/** 공고 기간을 오늘과 비교해 실제 상태를 낸다. 데이터가 open이어도 기간이 지났으면 마감이다. */
export function effectiveStatus(benefit, today = new Date()) {
  const { status, period = {}, closedReason } = benefit;
  if (status === 'closed') return { status: 'closed', reason: closedReason ?? 'other' };
  if (!period.always && period.end && parseDay(period.end).getTime() + DAY <= today.getTime()) {
    return { status: 'closed', reason: 'period' };
  }
  if (period.start && parseDay(period.start).getTime() > today.getTime()) return { status: 'upcoming' };
  return { status };
}

/** 마감까지 남은 날. 상시이거나 기간을 모르면 null. */
export function daysLeft(benefit, today = new Date()) {
  const end = benefit.period?.end;
  if (!end || benefit.period?.always) return null;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((parseDay(end) - start) / DAY);
}

const cond = (key, label, result) => ({ key, label, result });

function ageCondition({ birthYearMin: min, birthYearMax: max }, profile) {
  if (min === undefined && max === undefined) return null;
  const range = min !== undefined && max !== undefined ? `${min}~${max}년생` : min !== undefined ? `${min}년 이후 출생` : `${max}년 이전 출생`;
  if (!profile.birthYear) return cond('age', `나이 (${range})`, 'unknown');
  const fits = (min === undefined || profile.birthYear >= min) && (max === undefined || profile.birthYear <= max);
  return cond('age', `나이 (${range})`, fits ? 'met' : 'failed');
}

function regionCondition({ regions, excludedRegions = [] }, { sido, sigungu }) {
  if (!regions?.length) return null;
  const excluded = excludedRegions.map((r) => r.split(' ').pop()).join('·');
  const label = `사는 곳 (${regions.join(', ')}${excluded ? `, ${excluded} 제외` : ''})`;
  if (!sido) return cond('region', label, 'unknown');
  const here = sigungu ? `${sido} ${sigungu}` : sido;
  if (excludedRegions.includes(here)) return cond('region', label, 'failed');
  if (regions.some((r) => r === sido || r === here)) {
    // 도 안에 제외 지역이 있는데 시·군·구를 모르면 아직 단정할 수 없다
    return cond('region', label, !sigungu && excludedRegions.length ? 'unknown' : 'met');
  }
  // 시·군·구까지 봐야 하는데 시·도만 알면 아직 모르는 것
  if (!sigungu && regions.some((r) => r.startsWith(`${sido} `))) return cond('region', label, 'unknown');
  return cond('region', label, 'failed');
}

function statusCondition({ statuses }, { status }) {
  if (!statuses?.length) return null;
  const label = `지금 상태 (${statuses.map((s) => STATUS_LABELS[s]).join(', ')})`;
  // '그 밖에'는 휴학·졸업유예처럼 뜻이 넓어 틀렸다고 단정하지 않는다
  if (!status || status === 'other') return cond('status', label, statuses.includes(status) ? 'met' : 'unknown');
  return cond('status', label, statuses.includes(status) ? 'met' : 'failed');
}

function incomeCondition({ incomeMaxPercent: limit }, { income }) {
  if (limit === undefined) return null;
  const label = `가구 소득 (기준 중위소득 ${limit}% 이하)`;
  const band = INCOME_BANDS[income];
  if (!band || band.max === undefined) return cond('income', label, 'unknown');
  if (band.max <= limit) return cond('income', label, 'met');
  if (band.min >= limit) return cond('income', label, 'failed');
  return cond('income', label, 'unknown');
}

function schoolCondition({ schoolIds }, { schoolId }) {
  if (!schoolIds?.length) return null;
  if (!schoolId) return cond('school', '다니는 학교', 'unknown');
  return cond('school', '다니는 학교', schoolIds.includes(schoolId) ? 'met' : 'failed');
}

/**
 * @returns {{verdict: 'eligible'|'check'|'no'|'unknown', met: object[], unknown: object[], failed: object[]}}
 * verdict 'unknown'은 아직 아무 조건도 입력하지 않은 상태다.
 */
export function judge(benefit, profile) {
  const e = benefit.eligibility ?? {};
  const p = profile ?? {};
  const conditions = [
    ageCondition(e, p), regionCondition(e, p), statusCondition(e, p), incomeCondition(e, p), schoolCondition(e, p),
    e.residencyMonths ? cond('residency', `사는 곳에 ${e.residencyMonths}개월 이상 살았는지`, 'unknown') : null,
    // 데이터로 판정 못 하는 조건은 사람이 직접 확인해 주면 입력으로 친다
    ...(e.other ?? []).map((text) => cond('other', text, p.confirmed?.[benefit.id]?.includes(text) ? 'met' : 'unknown')),
  ].filter(Boolean);
  const pick = (result) => conditions.filter((c) => c.result === result);
  const result = { met: pick('met'), unknown: pick('unknown'), failed: pick('failed') };

  if (!profile) return { verdict: 'unknown', ...result };
  if (result.failed.length) return { verdict: 'no', ...result };
  // 조건 정보가 하나도 없는 혜택도 '받을 수 있음'으로 단정하지 않는다
  if (result.unknown.length || !conditions.length) return { verdict: 'check', ...result };
  return { verdict: 'eligible', ...result };
}

/** 입력한 조건은 모두 맞고 사람이 직접 볼 조건만 남았는지. 판정 자체는 그대로 '확인 필요'다. */
export function onlyDirectLeft({ verdict, met, unknown }) {
  const direct = (c) => c.key === 'other' || c.key === 'residency';
  return verdict === 'check' && met.some((c) => c.key !== 'other') && unknown.length > 0 && unknown.every(direct);
}

function conditionFields(benefit) {
  const e = benefit.eligibility ?? {};
  return [
    (e.birthYearMin !== undefined || e.birthYearMax !== undefined) && 'birthYear',
    e.regions?.length && 'region',
    e.statuses?.length && 'status',
    e.schoolIds?.length && 'school',
    e.incomeMaxPercent !== undefined && 'income',
  ].filter(Boolean);
}

/** 이 혜택 판정에 입력이 필요한 항목. 바로 자격 확인 상자에 보여 준다. */
export const neededFields = (benefit) => conditionFields(benefit).slice(0, 4);

const FIELD_OF = { age: 'birthYear', region: 'region', status: 'status', school: 'school', income: 'income' };

/** 값이 없어 판정을 막고 있는 칸. '그 밖에' 상태와 '모르겠어요' 소득은 이미 답한 것이라 다시 묻지 않는다. */
export function missingFields(benefit, profile) {
  const p = profile ?? {};
  const blocking = judge(benefit, p).unknown.map((c) => FIELD_OF[c.key]);
  const answered = { status: p.status, income: p.income };
  return conditionFields(benefit).filter((f) => blocking.includes(f) && !answered[f]).slice(0, 4);
}
