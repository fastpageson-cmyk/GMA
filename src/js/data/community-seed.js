// 커뮤니티 시범 글. 서버가 붙기 전까지 게시판이 비어 보이지 않게 넣어 둔 예시다.
// benefitId가 있으면 그 정책 카드의 댓글 칸에도 같이 나온다. 제목이 없으면 정책 카드에 단 댓글이다.
// 모든 시범 글은 화면에 '시범 글' 표시가 붙는다.
export const SEED_POSTS = [
  {
    id: 'seed-claude-basic-income',
    benefitId: 'gg-basic-income',
    body: '청년 기본소득은 지역화폐로 들어온다고 하던데, 받으면 어디서 쓸 수 있나요?',
    author: 'Claude (시범)',
    createdAt: '2026-11-05T10:00:00+09:00',
    comments: [
      { id: 'seed-claude-basic-income-c1', author: 'Claude (시범)', body: '사는 시·군의 지역화폐 가맹점에서 쓸 수 있어요. 가맹점은 지역화폐 앱에서 찾아보세요. 커뮤니티에서 단 이 답글도 정책 카드의 댓글 수에 같이 세어져요.', createdAt: '2026-11-05T10:05:00+09:00' },
    ],
  },
  {
    id: 'seed-claude-interview',
    benefitId: 'gg-interview-allowance',
    title: '면접 수당 다음 모집 전에 준비할 서류 정리했어요',
    body: '이번 모집은 끝났지만 다음 모집 때 바로 내려고 정리해 봤어요.\n1. 주민등록 등본 또는 초본\n2. 지원한 회사의 채용공고문\n3. 면접확인서 (못 받으면 대체서약서와 면접 증빙)\n면접 볼 때 면접확인서를 미리 부탁해 두면 편해요. 아래 연결된 정책 카드를 누르면 정책 상세로 넘어가요.',
    author: 'Claude (시범)',
    createdAt: '2026-11-05T10:10:00+09:00',
    comments: [],
  },
  {
    id: 'seed-welcome',
    title: '닿음 커뮤니티가 열렸어요',
    body: '혜택을 받아 본 이야기, 신청하다 막힌 점, 같이 준비할 사람 찾기까지 자유롭게 남겨 주세요.\n정책 카드에 단 댓글도 여기 함께 올라와요. 글에 정책을 연결하면 그 정책 카드에서도 보여요.',
    author: '닿음 운영',
    createdAt: '2026-11-01T09:00:00+09:00',
    comments: [
      { id: 'seed-welcome-c1', author: '용인 대학생', body: '정책 카드에서 바로 댓글 다는 거 편하네요!', createdAt: '2026-11-01T12:30:00+09:00' },
    ],
  },
  {
    id: 'seed-basic-income',
    benefitId: 'gg-basic-income',
    body: '분기마다 25만 원이 지역화폐로 들어와요. 이번 신청은 12월 1일까지니까 만 24세 친구들 놓치지 마세요.',
    author: '수지구 취준생',
    createdAt: '2026-11-03T21:10:00+09:00',
    comments: [
      { id: 'seed-basic-income-c1', author: '기흥 사는 사람', body: '경기도에 3년 넘게 살아야 한다고 해서 전입일 먼저 확인했어요. 초본에 나와요.', createdAt: '2026-11-04T08:40:00+09:00' },
    ],
  },
  {
    id: 'seed-dream',
    benefitId: 'hufs-dream-global-2026-2',
    body: '서류가 10개라 하루 만에 준비하기 빠듯해요. 성적·재학 증명은 학교 포털에서 바로 뽑히니까 먼저 해 두세요.',
    author: '글캠 3학년',
    createdAt: '2026-11-04T15:05:00+09:00',
    comments: [],
  },
  {
    id: 'seed-learning-card',
    benefitId: 'national-learning-card',
    title: '내일배움카드, 졸업 2년 남은 대학생은 못 받나요?',
    body: '3학년 1학기인데 신청하려다 막혔어요. 상세 화면 알아둘 점에 졸업까지 2년 넘게 남은 재학생은 안 된다고 적혀 있네요. 4학년 때 다시 봐야 할 것 같아요.',
    author: '컴활 준비 중',
    createdAt: '2026-11-02T19:20:00+09:00',
    comments: [
      { id: 'seed-learning-card-c1', author: '닿음 운영', body: '맞아요. 정부24 안내도 같은 기준이에요. 4학년이 되면 다시 확인해 보세요.', createdAt: '2026-11-02T20:00:00+09:00' },
      { id: 'seed-learning-card-c2', author: '처인구 4학년', body: '저는 4학년 2학기에 발급받았어요. 강좌마다 자기 부담금이 달라서 고를 때 같이 보세요.', createdAt: '2026-11-03T10:15:00+09:00' },
    ],
  },
  {
    id: 'seed-scholarship',
    benefitId: 'kosaf-national-type1',
    title: '국가장학금 다음 신청 언제 열리는지 아는 분?',
    body: '지금은 곧 열림으로 나와요. 알림 걸어 두면 열릴 때 메일 오나요?',
    author: '새내기',
    createdAt: '2026-11-04T22:45:00+09:00',
    comments: [
      { id: 'seed-scholarship-c1', author: '닿음 운영', body: '상세 화면 오른쪽 알림 받기로 신청해 두면 열릴 때 알려 드려요. 지금은 시제품이라 실제 메일은 가지 않아요.', createdAt: '2026-11-05T09:10:00+09:00' },
    ],
  },
];
