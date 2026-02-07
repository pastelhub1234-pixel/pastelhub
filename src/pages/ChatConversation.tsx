import { useEffect, useRef } from 'react';
import { Search, Menu, Smile, Paperclip } from 'lucide-react';
// ✅ 경로 수정: ../hooks
import { useJsonData } from '../hooks/useJsonData';
// ✅ 경로 수정: 같은 폴더 ./
import { MessageBubble } from './MessageBubble';
import { ChatMessage } from '../types'; 

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
    // ✅ 배경색: 부드러운 파스텔톤 유지
    <div className="flex-1 h-full flex flex-col bg-[#b2c7da] min-w-0 relative">
      
      {/* 헤더 */}
      <header className="flex-none h-[64px] bg-white/80 backdrop-blur-md px-5 flex justify-between items-center z-20 shadow-sm border-b border-white/50">
        <div className="flex items-center gap-3 min-w-0">
          {room && (
            <img 
              src={room.roomImg} 
              alt={room.roomName} 
              // ✅ 헤더 이미지 둥글게 (rounded-2xl)
              className="w-[40px] h-[40px] rounded-2xl object-cover shadow-sm"
            />
          )}
          <div className="min-w-0">
            <h2 className="text-[#1e1e1e] text-[15px] font-bold truncate">
              {room ? room.roomName : "채팅방"}
            </h2>
            <span className="text-[#666] text-[11px] font-medium flex items-center gap-1">
              {(messages?.length || 0) + 1}명 참여 중
            </span>
          </div>
        </div>

        <div className="flex gap-4 text-[#555]">
          <Search size={20} className="cursor-pointer hover:text-black transition-colors" />
          <Menu size={20} className="cursor-pointer hover:text-black transition-colors" />
        </div>
      </header>

      {/* 대화 내용 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-1 custom-scrollbar"
      >
        {loading ? (
          <div className="text-center text-white/60 py-10 text-xs">로딩 중...</div>
        ) : (
          displayMessages.length > 0 ? (
            <>
               {messages && messages.length > MAX_MESSAGES && (
                <div className="text-center py-4 text-xs text-white/70">
                  이전 대화 보기
                </div>
              )}
              {displayMessages.map((m, i) => (
                 <MessageBubble key={m.id || i} msg={m} />
              ))}
            </>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-white/50 text-sm gap-2">
               <p>대화 내용이 없습니다.</p>
            </div>
          )
        )}
      </div>

      {/* 입력창: 둥근 캡슐 스타일 */}
      <div className="flex-none bg-white p-4 border-t border-[#ececec] z-20">
        <div className="flex flex-col bg-[#f5f5f5] rounded-[24px] px-4 py-3 focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-[#ececec] transition-all duration-300">
            <textarea 
                className="w-full resize-none text-[14px] text-[#1e1e1e] placeholder:text-[#999] bg-transparent border-none focus:ring-0 p-0 min-h-[24px] max-h-[100px] leading-relaxed custom-scrollbar mb-2 font-medium"
                placeholder="메시지 입력..."
                rows={1}
            />
            <div className="flex justify-between items-center">
                <div className="flex gap-3 text-[#999]">
                    <Smile size={22} className="cursor-pointer hover:text-indigo-400 transition-colors" />
                    <Paperclip size={22} className="cursor-pointer hover:text-indigo-400 transition-colors" />
                </div>
                <button 
                    className="bg-[#FEE500] hover:bg-[#fdd835] active:scale-95 text-[#1e1e1e] px-4 py-1.5 rounded-full text-[12px] font-bold transition-all shadow-sm"
                >
                    전송
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}