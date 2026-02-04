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
  // 경로: hooks 폴더 위치에 맞게 수정해주세요.
  const { data: chatRooms, loading } = useJsonData<ChatRoom[]>('chat_rooms');

  // 시간 포맷팅 함수
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  // 텍스트 말줄임 함수
  const truncateText = (text: string | undefined, limit: number) => {
    if (!text) return "대화 내용이 없습니다.";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <span className="text-xs text-gray-400">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 검색창 영역 */}
      <div className="p-3 pb-2 flex-none">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="이름 검색"
            className="w-full pl-9 pr-3 py-1.5 bg-[#f5f5f5] border-none rounded-[12px] text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200 transition-all"
          />
        </div>
      </div>

      {/* 채팅방 리스트 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chatRooms?.map((room) => {
          const isSelected = current === room.roomId;
          
          return (
            <button
              key={room.roomId}
              onClick={() => onSelect(room.roomId)}
              className={`
                w-full px-3 py-3 flex items-center gap-3 transition-colors relative
                ${isSelected 
                  ? 'bg-[#ececec]' // 선택됨: 진한 회색
                  : 'hover:bg-[#f7f7f7] bg-white' // 호버: 연한 회색
                }
              `}
            >
              {/* 프로필 이미지 */}
              <div className="relative shrink-0">
                <img 
                  src={room.roomImg} 
                  alt={room.roomName} 
                  className="w-[44px] h-[44px] rounded-[16px] object-cover border border-black/5 shadow-sm"
                />
              </div>

              {/* 텍스트 정보 */}
              <div className="flex-1 min-w-0 text-left self-stretch flex flex-col justify-center gap-0.5">
                <div className="flex justify-between items-center w-full">
                  <span className={`text-[13px] truncate ${isSelected ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
                    {room.roomName}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-1 shrink-0 font-normal">
                    {formatTime(room.lastPostTime)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center w-full">
                  <p className="text-[11px] text-gray-500 truncate pr-2 font-medium">
                    {truncateText(room.lastPost, 20)}
                  </p>
                  
                  {/* 안 읽은 메시지 뱃지 (빨간색) */}
                  {room.todayPostCount > 0 && (
                    <span className="bg-[#fe4e4e] text-white text-[9px] font-bold px-1.5 h-[16px] flex items-center justify-center rounded-full min-w-[16px] shrink-0 shadow-sm">
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