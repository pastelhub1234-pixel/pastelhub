import { Search } from 'lucide-react';
// ✅ 경로 수정: ../hooks
import { useJsonData } from '../../../hooks/useJsonData';

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
      return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
    } catch {
      return '';
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-xs text-gray-400">...</div>;

  return (
    <>
      {/* 헤더 (네모난 디자인) */}
      <div className="px-4 pt-4 pb-3 bg-white shrink-0 border-b border-[#ececec]">
        <h2 className="text-[18px] font-bold text-[#1e1e1e] mb-3">채팅</h2>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999] w-[14px] h-[14px]" />
          <input
            type="text"
            placeholder="이름, 채팅방명 검색"
            // ✅ 검색창도 약간 각지게 (rounded-sm)
            className="w-full pl-8 pr-2 py-1.5 bg-[#f2f2f2] border border-[#e2e2e2] rounded-[2px] text-[12px] placeholder:text-[#999] focus:outline-none focus:bg-white focus:border-[#dcdcdc] transition-colors"
          />
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chatRooms?.map((room) => {
          const isSelected = current === room.roomId;
          return (
            <button
              key={room.roomId}
              onClick={() => onSelect(room.roomId)}
              // ✅ rounded-none: 완전 직사각형 리스트
              className={`
                w-full px-4 py-3 flex items-center gap-3 transition-colors text-left
                ${isSelected ? "bg-[#e8ecef]" : "hover:bg-[#f5f5f5] bg-white"}
              `}
            >
              {/* 프로필 이미지 (네모) */}
              <div className="relative shrink-0">
                <img 
                  src={room.roomImg} 
                  alt={room.roomName} 
                  className="w-[44px] h-[44px] rounded-[4px] object-cover border border-black/5"
                />
              </div>

              {/* 텍스트 정보 (min-w-0로 텍스트 잘림 보장) */}
              <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[13px] font-semibold text-[#1e1e1e] truncate pr-2">
                    {room.roomName}
                  </span>
                  <span className="text-[11px] text-[#9b9b9b] shrink-0">
                    {formatTime(room.lastPostTime)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  {/* ✅ truncate: 글자수 제한 (한 줄 넘어가면 ... 처리) */}
                  <p className="text-[12px] text-[#767676] truncate pr-2 w-full">
                    {room.lastPost || "대화 내용이 없습니다."}
                  </p>
                  
                  {room.todayPostCount > 0 && (
                    <span className="bg-[#ff3b3b] text-white text-[10px] font-bold min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full shrink-0">
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