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

  if (loading) return <div className="flex-1 flex items-center justify-center text-xs text-gray-400">목록 로딩 중...</div>;

  return (
    <>
      {/* 헤더 & 검색창 */}
      <div className="px-5 pt-6 pb-4 bg-white shrink-0">
        <h2 className="text-[20px] font-extrabold text-[#1e1e1e] mb-4 pl-1">채팅</h2>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999] w-[18px] h-[18px]" />
          <input
            type="text"
            placeholder="이름, 채팅방명 검색"
            // ✅ 검색창 둥글게 (rounded-2xl)
            className="w-full pl-10 pr-3 py-2.5 bg-[#f2f2f2] border-none rounded-2xl text-[13px] placeholder:text-[#999] focus:outline-none focus:bg-[#eaeaec] transition-all"
          />
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2 space-y-1">
        {chatRooms?.map((room) => {
          const isSelected = current === room.roomId;
          return (
            <button
              key={room.roomId}
              onClick={() => onSelect(room.roomId)}
              // ✅ 리스트 아이템 둥글게 (rounded-[20px])
              className={`
                w-full px-3 py-3 flex items-center gap-3.5 transition-all relative rounded-[20px]
                ${isSelected ? "bg-[#eef2f8] shadow-sm" : "hover:bg-[#f8f9fa] bg-white"}
              `}
            >
              {/* 채팅방 이미지 둥글게 (rounded-[18px]) */}
              <div className="relative shrink-0">
                <img 
                  src={room.roomImg} 
                  alt={room.roomName} 
                  className="w-[48px] h-[48px] rounded-[18px] object-cover border border-black/5 shadow-sm"
                />
              </div>

              {/* 텍스트 정보 */}
              <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className={`text-[14px] truncate pr-2 ${isSelected ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
                    {room.roomName}
                  </span>
                  <span className="text-[11px] text-[#9b9b9b] shrink-0 font-medium tracking-tight">
                    {formatTime(room.lastPostTime)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  {/* ✅ 인위적인 글자수 제한(substring) 제거. CSS truncate로 자연스럽게 처리 */}
                  <p className="text-[12px] text-[#707070] truncate pr-3 w-full text-left font-medium">
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