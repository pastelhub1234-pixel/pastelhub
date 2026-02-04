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
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  const truncateText = (text: string | undefined, limit: number) => {
    if (!text) return "대화 내용이 없습니다.";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  if (loading) {
    return (
      <div className="w-[240px] h-full bg-white border-r border-gray-100 flex items-center justify-center shrink-0">
        <span className="text-xs text-gray-400">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="w-[240px] h-full flex flex-col bg-white border-r border-[#ececec] min-h-0 shrink-0">
      
      {/* 고정 헤더 (스크롤 안됨) */}
      <div className="px-4 py-3 border-b border-[#ececec] flex-shrink-0 bg-white z-10">
        <h2 className="font-bold text-gray-800 text-base">채팅</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chatRooms?.map((room) => {
          const isSelected = current === room.roomId;
          
          return (
            <button
              key={room.roomId}
              onClick={() => onSelect(room.roomId)}
              className={`w-full flex items-center px-3 py-2.5 transition-colors text-left group
                ${isSelected ? "bg-[#eaeaec]" : "hover:bg-[#f5f5f5] bg-white"}`}
            >
              {/* 프로필 이미지 */}
              <div className="relative shrink-0">
                <img 
                  src={room.roomImg} 
                  alt={room.roomName} 
                  className="w-[44px] h-[44px] rounded-[16px] object-cover border border-black/5 shadow-sm"
                />
              </div>

              {/* 텍스트 영역 */}
              <div className="flex-1 ml-3 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`text-[13px] truncate ${isSelected ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
                    {room.roomName}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-1 shrink-0">
                    {formatTime(room.lastPostTime)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-[11px] text-gray-500 truncate pr-2">
                    {truncateText(room.lastPost, 21)}
                  </p>
                  
                  {room.todayPostCount > 0 && (
                    <span className="bg-[#fe4e4e] text-white text-[9px] font-bold px-1.5 h-[16px] flex items-center justify-center rounded-full min-w-[16px] shrink-0">
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