// 화면 전체가 같이 쓰는 분류표와 검색어 사전.

// 설문 필요 분야 순서 그대로 (10_화면기획.md 3-2)
export const CATEGORIES = [
  { id: 'job', label: '취업 준비', icon: 'work' },
  { id: 'living', label: '생활비', icon: 'payments' },
  { id: 'study', label: '자격증·공부', icon: 'edit_note' },
  { id: 'housing', label: '월세·집', icon: 'home' },
  { id: 'asset', label: '목돈', icon: 'savings' },
  { id: 'scholarship', label: '장학금', icon: 'school' },
];
export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const SOURCES = [
  { id: 'national', label: '정부' },
  { id: 'province', label: '도' },
  { id: 'city', label: '시·군·구' },
  { id: 'school', label: '우리 학교' },
  { id: 'foundation', label: '장학재단' },
];

// 교내 장학은 한국외대부터. 다음 차례는 용인 소재 대학 (research/02 4장)
export const SCHOOLS = [
  { id: 'hufs', label: '한국외국어대학교' },
  { id: 'dankook', label: '단국대학교 죽전캠퍼스' },
  { id: 'mju', label: '명지대학교 자연캠퍼스' },
  { id: 'yongin', label: '용인대학교' },
  { id: 'kangnam', label: '강남대학교' },
  { id: 'khu', label: '경희대학교 국제캠퍼스' },
  { id: 'etc', label: '그 밖의 학교' },
];
export const schoolLabel = (id) => SCHOOLS.find((s) => s.id === id)?.label ?? id;

// 청년이 쓰는 말 → 혜택 키워드·분야 (20_데이터_명세.md 4장)
export const DICTIONARY = [
  { words: ['토익', '토플', '오픽', '텝스', '영어시험', '어학'], link: ['어학', '응시료', '자격'], category: 'study' },
  { words: ['자격증', '컴활', 'SQLD', '한국사', '기사시험', '시험비', '응시료', '공부'], link: ['자격', '응시료'], category: 'study' },
  { words: ['월세', '집세', '방값', '자취', '전세', '보증금', '자취방', '원룸', '주거', '이사', '부동산', '복비'], link: ['주거', '월세'], category: 'housing' },
  { words: ['알바', '알바비', '생활비', '용돈', '현금', '돈이', '지원금', '생활'], link: ['생활비', '현금'], category: 'living' },
  { words: ['장학금', '장학', '등록금', '학비'], link: ['장학', '학자금'], category: 'scholarship' },
  { words: ['취업', '취준', '면접', '구직', '일자리', '자소서', '인턴', '정장'], link: ['취업', '면접', '구직'], category: 'job' },
  { words: ['적금', '목돈', '저축', '통장', '재테크', '모으기'], link: ['적금', '자산'], category: 'asset' },
  { words: ['창업', '사업'], link: ['창업'], category: 'job' },
  { words: ['공연', '문화', '영화', '전시'], link: ['문화'], category: 'living' },
];
