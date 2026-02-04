
// ============================================
// Chat Types (Updated)
// ============================================
export interface ChatRoom {
  roomId: string;
  roomName: string;
  roomImg: string;
  todayPostCount: number;
  lastPost: string;
  lastPostTime: string;
}

export interface ChatMessage {
  type: 'TEXT' | 'IMAGE' | 'date' | 'file'; // 'date'는 날짜 구분선용
  name: string;
  profileImg: string;
  content: string; // 텍스트 내용 또는 이미지 URL
  time: string;
}


// ============================================
// Broadcast Types
// ============================================
export interface BroadcastItem {
  name: string;
  message: string;
  image: string;
  link: string;
}

export interface BroadcastGroup {
  id: string;
  title: string;
  color: string;
  items: BroadcastItem[];
}


// ============================================
// Tweet Types
// ============================================
export interface Tweet {
  id: string;
  author: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
}

export interface FeedItem {
  id?: string;
  type: "TEXT" | "IMAGE" | "VIDEO";
  name: string;
  profileImg: string;
  content: string;
  time: string;
}

// ============================================
// Schedule Types
// ============================================
export interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'broadcast' | 'event' | 'release' | 'other';
  description?: string;
}

export interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'birthday' | 'album' | 'concert' | 'broadcast' | 'event';
}


// ============================================
// Goods Trade Types (New)
// ============================================

export interface TradeAuthor {
  id: string;
  name: string;
  level: 'user' | 'cafe' | 'admin'; // 'cafe'는 카페 인증 회원
}

export interface TradeItem {
  id: string;
  status: 'active' | 'completed'; // 교환 중 | 교환 완료
  region: string; // '서울', '경기' 등
  isDeliveryAvailable: boolean; // 택배 거래 가능 여부
  
  haveItems: string[]; // 보유 중인 굿즈 (예: ['유니 아크릴', '시로 키링'])
  wantItems: string[]; // 원하는 굿즈 (예: ['칸나 포카', '리제 아크릴'])
  
  author: TradeAuthor; // 작성자 정보
  openChatLink: string; // 카카오톡 오픈채팅방 링크
  createdAt: string; // 작성일 (ISO String)
}

