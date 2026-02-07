import { useJsonData } from '../hooks/useJsonData';
import { ChatRoom } from '../types';

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

  const truncateText = (text: string | undefined, limit: number) => {
    if (!text) return "대화 내용이 없습니다.";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-xs text-gray-400">...</div>;

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-100 min-h-0 shrink-0">
      
      {/* ✅ [수정] 검색창 제거, 타이틀만 깔끔하게 유지 */}
      <div className="px-5 pt-6 pb-4 bg-white shrink-0">
        <h2 className="text-[20px] font-bold text-[#1e1e1e]">채팅</h2>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
        {chatRooms?.map((room) => {
          const isSelected = current === room.roomId;
          return (
            <button
              key={room.roomId}
              onClick={() => onSelect(room.roomId)}
              className={`
                w-full px-3 py-3 flex items-center gap-3 transition-all relative rounded-xl mb-0.5
                ${isSelected ? "bg-gray-100" : "hover:bg-gray-50 bg-white"}
              `}
            >
              {/* 이미지 찌그러짐 방지 */}
              <div className="relative shrink-0">
                <img 
                  src={room.roomImg} 
                  alt={room.roomName} 
                  className="w-[48px] h-[48px] min-w-[48px] min-h-[48px] rounded-[18px] object-cover border border-black/5 bg-gray-200"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center h-full text-left">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[14px] font-bold text-[#1e1e1e] truncate pr-2">
                    {room.roomName}
                  </span>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {formatTime(room.lastPostTime)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center w-full">
                  <p className="text-[13px] text-gray-500 w-full pr-2 break-all line-clamp-1">
                    {truncateText(room.lastPost, 20)}
                  </p>
                  
                  {room.todayPostCount > 0 && (
                    <span className="bg-[#ff4b4b] text-white text-[10px] font-bold h-[18px] min-w-[18px] px-1.5 flex items-center justify-center rounded-full shrink-0">
                      {room.todayPostCount > 300 ? "300+" : room.todayPostCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}