import { Search } from 'lucide-react';
// ✅ 경로 수정: ../hooks
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

  // ✅ [복구] 글자수 제한 함수
  const truncateText = (text: string | undefined, limit: number) => {
    if (!text) return "대화 내용이 없습니다.";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-xs text-gray-400">...</div>;

  return (
    <>
      {/* 헤더 & 검색창 */}
      <div className="px-5 pt-6 pb-4 bg-white shrink-0">
        <h2 className="text-[22px] font-extrabold text-[#1e1e1e] mb-4 pl-1">채팅</h2>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] w-[18px] h-[18px]" />
          <input
            type="text"
            placeholder="검색"
            className="w-full pl-11 pr-4 py-3 bg-[#f3f4f6] border-none rounded-[24px] text-[14px] placeholder:text-[#999] focus:outline-none focus:bg-[#eef0f2] transition-all"
          />
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3 space-y-1">
        {chatRooms?.map((room) => {
          const isSelected = current === room.roomId;
          return (
            <button
              key={room.roomId}
              onClick={() => onSelect(room.roomId)}
              // ✅ 리스트 아이템 둥글게
              className={`
                w-full px-3 py-3 flex items-center gap-3.5 transition-all relative rounded-[20px]
                ${isSelected ? "bg-[#eef2f8]" : "hover:bg-[#f8f9fa] bg-white"}
              `}
            >
              {/* 프로필 이미지 */}
              <div className="relative shrink-0">
                <img 
                  src={room.roomImg} 
                  alt={room.roomName} 
                  className="w-[50px] h-[50px] rounded-[18px] object-cover border border-black/5 shadow-sm"
                />
              </div>

              {/* 텍스트 정보 */}
              <div className="flex-1 min-w-0 flex flex-col justify-center h-full text-left">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`text-[15px] truncate pr-2 ${isSelected ? "font-bold text-[#1e1e1e]" : "font-bold text-[#1e1e1e]"}`}>
                    {room.roomName}
                  </span>
                  <span className="text-[11px] text-[#9b9b9b] shrink-0 font-medium">
                    {formatTime(room.lastPostTime)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center w-full">
                  {/* ✅ truncateText 적용 (21자 제한) */}
                  <p className="text-[13px] text-[#707070] w-full pr-2 font-medium">
                    {truncateText(room.lastPost, 21)}
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