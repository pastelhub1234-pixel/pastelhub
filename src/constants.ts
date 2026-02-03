import { Member, ScheduleEvent, Tweet, Activity, ExchangeItem, TimelineMessage } from './types';

export const MEMBERS: Member[] = [
  {
    id: 'm1',
    name: '민지',
    profileImage: 'https://images.unsplash.com/photo-1728067276769-d5e51e31006b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrcG9wJTIwaWRvbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwMTExOTYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'LIVE',
    message: '오늘도 힘내세요! 💖',
    channelUrl: 'https://youtube.com',
  },
  {
    id: 'm2',
    name: '하린',
    profileImage: 'https://images.unsplash.com/photo-1697510364485-e900c2fe7524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMHNpbmdlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDExMTk2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'SPACE',
    message: '곧 돌아올게요 ✨',
    channelUrl: 'https://youtube.com',
  },
  {
    id: 'm3',
    name: '서아',
    profileImage: 'https://images.unsplash.com/photo-1676083192960-2a4873858487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB3b21hbiUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzcwMTExOTYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'OFFLINE',
    message: '오늘 하루도 행복하게 💜',
    channelUrl: 'https://youtube.com',
  },
  {
    id: 'm4',
    name: '유나',
    profileImage: 'https://images.unsplash.com/photo-1672390933634-6ccb1da5fa40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzAwMDQ2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'OFFLINE',
    message: '항상 감사합니다 🌸',
    channelUrl: 'https://youtube.com',
  },
];

export const SCHEDULES: ScheduleEvent[] = [
  {
    id: 's1',
    title: '컴백 쇼케이스',
    date: '2026-02-15',
    time: '18:00',
    type: 'comeback',
    description: '새 앨범 발매 기념 쇼케이스',
  },
  {
    id: 's2',
    title: '민지 생일',
    date: '2026-03-07',
    type: 'birthday',
    description: '민지 생일 축하해요! 🎂',
  },
  {
    id: 's3',
    title: '팬 미팅',
    date: '2026-02-28',
    time: '19:00',
    type: 'event',
    description: '올림픽공원 체조경기장',
  },
  {
    id: 's4',
    title: '음악방송 출연',
    date: '2026-02-20',
    time: '17:00',
    type: 'event',
    description: '뮤직뱅크 출연',
  },
  {
    id: 's5',
    title: '데뷔 2주년',
    date: '2026-04-15',
    type: 'anniversary',
    description: '데뷔 2주년 기념일 🎉',
  },
];

export const TWEETS: Tweet[] = [
  {
    id: 't1',
    memberId: 'm1',
    memberName: '민지',
    memberAvatar: MEMBERS[0].profileImage,
    content: '안녕하세요~ 오늘 날씨 너무 좋네요! 다들 좋은 하루 보내세요 💕',
    timestamp: '2026-02-03T14:30:00',
  },
  {
    id: 't2',
    memberId: 'm2',
    memberName: '하린',
    memberAvatar: MEMBERS[1].profileImage,
    content: '연습실에서 열심히 연습 중이에요! 곧 좋은 모습으로 보여드릴게요 🎵',
    timestamp: '2026-02-03T12:15:00',
  },
  {
    id: 't3',
    memberId: 'm3',
    memberName: '서아',
    memberAvatar: MEMBERS[2].profileImage,
    content: '오늘 점심 뭐 드셨어요? 저는 파스타 먹었어요! 너무 맛있었답니다 😋',
    timestamp: '2026-02-03T11:45:00',
  },
  {
    id: 't4',
    memberId: 'm1',
    memberName: '민지',
    memberAvatar: MEMBERS[0].profileImage,
    content: '컴백 준비 열심히 하고 있어요! 많이 기대해주세요 ✨',
    timestamp: '2026-02-02T20:00:00',
  },
  {
    id: 't5',
    memberId: 'm4',
    memberName: '유나',
    memberAvatar: MEMBERS[3].profileImage,
    content: '팬분들 덕분에 항상 힘이 나요. 정말 감사합니다 💜',
    timestamp: '2026-02-02T18:30:00',
  },
  {
    id: 't6',
    memberId: 'm2',
    memberName: '하린',
    memberAvatar: MEMBERS[1].profileImage,
    content: '오늘 춤 연습 완료! 근육통이 올 것 같아요 ㅎㅎ',
    timestamp: '2026-02-02T16:20:00',
  },
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    type: 'poll',
    title: '다음 앨범 컨셉 투표',
    description: '다음 앨범의 컨셉을 투표로 결정해요!',
    createdAt: '2026-02-01T10:00:00',
    pollOptions: [
      { id: 'p1', text: '🌸 봄 느낌의 상큼한 컨셉', votes: 342 },
      { id: 'p2', text: '🌙 몽환적이고 신비로운 컨셉', votes: 287 },
      { id: 'p3', text: '⚡ 파워풀하고 강렬한 컨셉', votes: 195 },
    ],
  },
  {
    id: 'a2',
    type: 'poll',
    title: '좋아하는 타이틀곡은?',
    description: '역대 타이틀곡 중 가장 좋아하는 곡을 골라주세요!',
    createdAt: '2026-01-28T14:00:00',
    pollOptions: [
      { id: 'p4', text: 'Sweet Dreams', votes: 421 },
      { id: 'p5', text: 'Starlight', votes: 389 },
      { id: 'p6', text: 'Forever', votes: 256 },
    ],
  },
  {
    id: 'a3',
    type: 'karaoke',
    title: '노래방 - Sweet Dreams',
    description: '같이 불러봐요! 🎤',
    createdAt: '2026-01-25T16:00:00',
    karaokeUrl: 'https://youtube.com',
  },
];

export const EXCHANGE_ITEMS: ExchangeItem[] = [
  {
    id: 'e1',
    title: '[양도] 2월 28일 팬미팅 티켓 양도합니다',
    region: '서울',
    category: '티켓',
    url: 'https://example.com/post1',
    createdAt: '2026-02-03T09:00:00',
  },
  {
    id: 'e2',
    title: '[교환] 1집 앨범 포토카드 교환해요',
    region: '부산',
    category: '포토카드',
    url: 'https://example.com/post2',
    createdAt: '2026-02-03T08:30:00',
  },
  {
    id: 'e3',
    title: '[구매] 2집 한정판 앨범 구합니다',
    region: '인천',
    category: '앨범',
    url: 'https://example.com/post3',
    createdAt: '2026-02-02T20:15:00',
  },
  {
    id: 'e4',
    title: '[양도] 민지 포토카드 양도해요',
    region: '대구',
    category: '포토카드',
    url: 'https://example.com/post4',
    createdAt: '2026-02-02T18:45:00',
  },
  {
    id: 'e5',
    title: '[교환] 콘서트 응원봉 교환 원합니다',
    region: '서울',
    category: '굿즈',
    url: 'https://example.com/post5',
    createdAt: '2026-02-02T15:20:00',
  },
  {
    id: 'e6',
    title: '[양도] 음악방송 사전녹화 티켓',
    region: '서울',
    category: '티켓',
    url: 'https://example.com/post6',
    createdAt: '2026-02-01T22:00:00',
  },
];

// 타임라인 데이터 (채팅방 형식)
export const TIMELINE_MESSAGES: TimelineMessage[] = [
  {
    type: "TEXT",
    name: "리코",
    profileImg: "https://firebasestorage.googleapis.com/v0/b/pastelhub-1aefc.firebasestorage.app/o/image%20(3).png?alt=media&token=79f25728-1c9c-40a9-aa72-ad53b28d8bee",
    content: "눈을 떴더니 장염을 걸린건에 대하여....",
    time: "2026-01-16T04:53:47.295Z"
  },
  {
    type: "TEXT",
    name: "민지",
    profileImg: "https://images.unsplash.com/photo-1728067276769-d5e51e31006b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrcG9wJTIwaWRvbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwMTExOTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    content: "안녕하세요~ 오늘 날씨 너무 좋네요!",
    time: "2026-01-16T10:30:00.000Z"
  },
  {
    type: "TEXT",
    name: "하린",
    profileImg: "https://images.unsplash.com/photo-1697510364485-e900c2fe7524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMHNpbmdlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDExMTk2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    content: "연습 열심히 하고 있어요! 다들 건강 조심하세요 💕",
    time: "2026-01-16T12:15:00.000Z"
  },
  {
    type: "TEXT",
    name: "리코",
    profileImg: "https://firebasestorage.googleapis.com/v0/b/pastelhub-1aefc.firebasestorage.app/o/image%20(3).png?alt=media&token=79f25728-1c9c-40a9-aa72-ad53b28d8bee",
    content: "다행히 괜찮아졌어요! 걱정해주셔서 감사합니다 ㅠㅠ",
    time: "2026-01-16T15:20:00.000Z"
  },
  {
    type: "TEXT",
    name: "서아",
    profileImg: "https://images.unsplash.com/photo-1676083192960-2a4873858487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB3b21hbiUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzcwMTExOTYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    content: "오늘 저녁은 치킨 먹을까요? 🍗",
    time: "2026-01-16T18:00:00.000Z"
  },
  {
    type: "TEXT",
    name: "유나",
    profileImg: "https://images.unsplash.com/photo-1672390933634-6ccb1da5fa40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzAwMDQ2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    content: "좋아요! 저도 치킨 땡겨요 ㅎㅎ",
    time: "2026-01-16T18:05:00.000Z"
  },
  {
    type: "TEXT",
    name: "민지",
    profileImg: "https://images.unsplash.com/photo-1728067276769-d5e51e31006b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrcG9wJTIwaWRvbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwMTExOTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    content: "컴백 준비 열심히 하고 있어요! 많이 기대해주세요 ✨",
    time: "2026-01-17T14:30:00.000Z"
  },
];

export const REGIONS = ['전체', '서울', '경기', '인천', '부산', '대구', '광주', '대전', '기타'];
export const CATEGORIES = ['전체', '티켓', '앨범', '포토카드', '굿즈', '기타'];