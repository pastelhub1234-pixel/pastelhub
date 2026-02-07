import { useEffect, useRef } from 'react';
import { Search, Menu, Smile, Paperclip } from 'lucide-react';
// ✅ 경로 수정: ../hooks
import { useJsonData } from '../../../hooks/useJsonData';
// ✅ 경로 수정: ./MessageBubble, ../types
import { MessageBubble } from './MessageBubble';
import { ChatMessage } from '../../../types'; 

interface ChatRoom {
  roomId: string;
  roomName: string;
  roomImg: string;
}

interface ChatConversationProps {
  roomId: string;
}

const MAX_MESSAGES = 50; 

export function ChatConversation({ roomId }: ChatConversationProps) {
  const { data: chatRooms } = useJsonData<ChatRoom[]>('chat_rooms');
  const { data: messages, loading } = useJsonData<ChatMessage[]>(roomId);
  
  const room = chatRooms?.find(r => r.roomId === roomId);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayMessages = messages ? messages.slice(-MAX_MESSAGES) : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, roomId]);

  return (
    // ✅ 배경색 #bacee0 (PC 카톡 기본 하늘색)
    // ✅ min-w-0: 레이아웃 깨짐 방지
    <div className="flex-1 h-full flex flex-col bg-[#bacee0] min-w-0 relative">
      
      {/* 헤더 (네모난 스타일, 투명도 제거) */}
      <header className="flex-none h-[60px] bg-[#bacee0]/95 px-4 flex justify-between items-center z-10 border-b border-[#aabfd3]">
        <div className="flex items-center gap-2.5 min-w-0">
          {room && (
            <img 
              src={room.roomImg} 
              alt={room.roomName} 
              // ✅ rounded-[3px]: 네모난 프로필
              className="w-[36px] h-[36px] rounded-[3px] object-cover border border-black/5 cursor-pointer"
            />
          )}
          <div className="min-w-0">
            <h2 className="text-[#1e1e1e] text-[14px] font-bold truncate flex items-center gap-1">
              {room ? room.roomName : "채팅방"}
              <span className="text-[#666] text-[12px] font-normal">
                ({(messages?.length || 0) + 1})
              </span>
            </h2>
          </div>
        </div>

        <div className="flex gap-3 text-[#555] opacity-60">
          <Search size={18} className="cursor-pointer hover:opacity-100" />
          <Menu size={18} className="cursor-pointer hover:opacity-100" />
        </div>
      </header>

      {/* 대화 내용 영역 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar"
      >
        {loading ? (
          <div className="text-center text-black/30 py-10 text-xs">로딩 중...</div>
        ) : (
          displayMessages.length > 0 ? (
            <>
               {messages && messages.length > MAX_MESSAGES && (
                <div className="text-center py-4 text-[11px] text-gray-500">
                  이전 대화 불러오기
                </div>
              )}
              {displayMessages.map((m, i) => (
                 <MessageBubble key={m.id || i} msg={m} />
              ))}
            </>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-black/20 text-sm gap-2">
               <p>대화 내용이 없습니다.</p>
            </div>
          )
        )}
      </div>

      {/* 입력창 (완전 네모난 흰색 박스) */}
      <div className="flex-none bg-white p-0 z-20 h-[120px] flex flex-col border-t border-[#dcdcdc]">
        {/* 텍스트 에어리어 */}
        <textarea 
            className="w-full flex-1 resize-none text-[13px] text-[#1e1e1e] placeholder:text-[#bbb] bg-transparent border-none focus:ring-0 p-3 leading-relaxed custom-scrollbar"
            placeholder="메시지를 입력하세요"
        />
        
        {/* 하단 툴바 및 전송 버튼 */}
        <div className="flex justify-between items-center px-3 pb-3">
            <div className="flex gap-3 text-[#888]">
                <Smile size={20} className="cursor-pointer hover:text-black transition-colors" />
                <Paperclip size={20} className="cursor-pointer hover:text-black transition-colors" />
            </div>
            {/* ✅ 전송 버튼: 카톡 노랑 + 네모 */}
            <button 
                className="bg-[#feec34] hover:bg-[#fdd835] border border-[#f5d000] text-[#1e1e1e] px-4 py-1.5 rounded-[2px] text-[12px] font-normal transition-all"
            >
                전송
            </button>
        </div>
      </div>
    </div>
  );
}