import { Search } from 'lucide-react';
import { useJsonData } from '../../hooks/useJsonData';

interface ChatRoom {
  roomId: string;
  roomName: string;
  roomImg: string;
  todayPostCount: number;
  lastPost: string;
  lastPostTime: string;
}

interface ChatRoomListProps {
  onSelect: (roomId: string) => void;
  current: string;
}

export function ChatRoomList({ onSelect, current }: ChatRoomListProps) {
  const { data: chatRooms, loading } = useJsonData<ChatRoom[]>('chat_rooms');

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth();
      if (isToday) return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
      return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-xs text-gray-400">목록 로딩 중...</div>;

  return (
    <>
      {/* 헤더 & 검색창 */}
      <div className="px-5 pt-6 pb-2 bg-white shrink-0">
        <h2 className="text-[20px] font-extrabold text-[#1e1e1e] mb-4">채팅</h2>
        <div className="relative group mb-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999] w-[16px] h-[16px]" />
          <input
            type="text"
            placeholder="이름, 채팅방명 검색"
            className="w-full pl-9 pr-3 py-2 bg-[#f5f5f5] border-none rounded-[14px] text-[13px] placeholder:text-[#999] focus:outline-none focus:bg-[#ececec] transition-colors"
          />
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-0.5 pb-2">
        {chatRooms?.map((room) => {
          const isSelected = current === room.roomId;
          return (
            <button
              key={room.roomId}
              onClick={() => onSelect(room.roomId)}
              className={`
                w-full px-3 py-3 flex items-center gap-3.5 transition-colors relative rounded-[16px]
                ${isSelected ? "bg-[#eaeaec]" : "hover:bg-[#f9f9f9] bg-white"}
              `}
            >
              {/* 채팅방 이미지 */}
              <div className="relative shrink-0">
                <img 
                  src={room.roomImg} 
                  alt={room.roomName} 
                  className="w-[48px] h-[48px] rounded-[18px] object-cover border border-black/5"
                />
              </div>

              {/* 텍스트 정보 (min-w-0 필수) */}
              <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-[14px] font-bold text-[#1e1e1e] truncate pr-2">
                    {room.roomName}
                  </span>
                  <span className="text-[10px] text-[#a0a0a0] shrink-0 font-medium">
                    {formatTime(room.lastPostTime)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-[12px] text-[#767676] truncate pr-3 w-full text-left">
                    {room.lastPost || "대화 내용이 없습니다."}
                  </p>
                  
                  {room.todayPostCount > 0 && (
                    <span className="bg-[#ff4b4b] text-white text-[10px] font-bold h-[18px] min-w-[18px] px-1.5 flex items-center justify-center rounded-full shadow-sm shrink-0">
                      {room.todayPostCount > 300 ? "300+" : room.todayPostCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}