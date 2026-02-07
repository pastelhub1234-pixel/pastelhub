import { Search } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';

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
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  // ✅ 사용자 요청 로직: 글자수 제한
  const truncateText = (text: string | undefined, limit: number) => {
    if (!text) return "대화 내용이 없습니다.";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-xs text-gray-400">...</div>;

  return (
    <>
      {/* 헤더 */}
      <div className="px-4 pt-5 pb-3 bg-white shrink-0">
        <h2 className="text-[18px] font-bold text-gray-800 mb-3">채팅</h2>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[14px] h-[14px]" />
          <input
            type="text"
            placeholder="검색"
            // ✅ 검색창 둥글게 (부모 컨테이너와 통일감)
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:bg-gray-100 transition-colors"
          />
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
        {chatRooms?.map((room) => {
          const isSelected = current === room.roomId;
          return (
            <button
              key={room.roomId}
              onClick={() => onSelect(room.roomId)}
              // ✅ 리스트 아이템 둥글게 (rounded-xl)
              className={`
                w-full px-3 py-3 flex items-center gap-3 transition-all relative rounded-xl mb-0.5
                ${isSelected ? "bg-gray-100" : "hover:bg-gray-50 bg-white"}
              `}
            >
              <div className="relative shrink-0">
                <img 
                  src={room.roomImg} 
                  alt={room.roomName} 
                  // ✅ 이미지도 둥글게
                  className="w-[44px] h-[44px] rounded-[14px] object-cover border border-black/5"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center h-full text-left">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[14px] font-bold text-gray-800 truncate pr-2">
                    {room.roomName}
                  </span>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {formatTime(room.lastPostTime)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center w-full">
                  {/* ✅ truncateText 적용 */}
                  <p className="text-[12px] text-gray-500 w-full pr-2 break-all">
                    {truncateText(room.lastPost, 20)}
                  </p>
                  
                  {room.todayPostCount > 0 && (
                    <span className="bg-[#ff4b4b] text-white text-[10px] font-bold h-[16px] min-w-[16px] px-1 flex items-center justify-center rounded-full shrink-0">
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