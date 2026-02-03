export type MemberStatus = 'LIVE' | 'SPACE' | 'OFFLINE';

export interface Member {
  id: string;
  name: string;
  profileImage: string;
  status: MemberStatus;
  message: string;
  channelUrl: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  time?: string;
  type: 'comeback' | 'concert' | 'birthday' | 'event' | 'anniversary';
  description?: string;
}

export interface Tweet {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  content: string;
  timestamp: string; // ISO date string
  images?: string[];
}

// 새로운 타임라인 메시지 타입
export interface TimelineMessage {
  type: 'TEXT';
  name: string;
  profileImg: string;
  content: string;
  time: string; // ISO date string
}

// 채팅방 타입
export interface ChatRoom {
  id: string;
  name: string;
  profileImg: string;
  messages: TimelineMessage[];
}

export interface Activity {
  id: string;
  type: 'poll' | 'karaoke';
  title: string;
  description: string;
  createdAt: string;
  pollOptions?: PollOption[];
  karaokeUrl?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface ExchangeItem {
  id: string;
  title: string;
  region: string;
  category: string;
  url: string;
  createdAt: string;
}