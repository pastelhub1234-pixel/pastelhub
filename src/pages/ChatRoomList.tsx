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
    <div className="w-full h-full flex flex-col bg-white border-r border-[#ececec] min-h-0 shrink-0">
      
      {/* ✅ [수정] 높이를 80px로 고정하여 위아래 공간을 확실하게 확보 */}
      {/* flex items-center로 텍스트를 정중앙에 배치 */}
      <div className="h-[80px] px-6 border-b border-[#ececec] flex-shrink-0 bg-white z-10 flex items-center">
        <h2 className="font-bold text-gray-800 text-[20px]">채팅</h2>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chatRooms?.map((room) => {
          const isSelected = current === room.roomId;
          return (
            <button
              key={room.roomId}
              onClick={() => onSelect(room.roomId)}
              className={`
                w-full flex items-center px-5 py-3 transition-colors text-left group
                ${isSelected ? "bg-[#eaeaec]" : "hover:bg-[#f5f5f5] bg-white"}
              `}
            >
              <div className="relative shrink-0">
                <img 
                  src={room.roomImg} 
                  alt={room.roomName} 
                  className="w-[44px] h-[44px] min-w-[44px] min-h-[44px] rounded-[16px] object-cover border border-black/5 shadow-sm"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center ml-3.5 gap-0.5">
                <div className="flex justify-between items-center">
                  <span className={`text-[15px] font-bold truncate pr-2 ${isSelected ? 'text-black' : 'text-gray-800'}`}>
                    {room.roomName}
                  </span>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {formatTime(room.lastPostTime)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center w-full">
                  <p className="text-[13px] text-gray-500 w-full pr-2 break-all line-clamp-1 leading-snug">
                    {truncateText(room.lastPost, 20)}
                  </p>
                  
                  {room.todayPostCount > 0 && (
                    <span className="bg-[#ff4b4b] text-white text-[10px] font-bold h-[18px] min-w-[18px] px-1.5 flex items-center justify-center rounded-full shrink-0 shadow-sm">
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