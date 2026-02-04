import { useEffect, useRef } from 'react';
import { Search, Menu, Smile, Paperclip, Send } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
import { MessageBubble, ChatMessage } from './MessageBubble';

interface ChatRoom {
  roomId: string;
  roomName: string;
  roomImg: string;
  todayPostCount: number;
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
    // ✅ 배경색 강제 적용 (#b2c7da)
    <div className="flex-1 h-full flex flex-col bg-[#b2c7da] min-w-0 relative">
      
      {/* 1. 헤더: 흰색 배경 */}
      <header className="flex-none h-[64px] bg-white/95 backdrop-blur-sm px-5 flex justify-between items-center border-b border-[#dcdcdc] z-20">
        <div className="flex items-center gap-3 min-w-0">
          {room && (
            <img 
              src={room.roomImg} 
              alt={room.roomName} 
              className="w-[42px] h-[42px] rounded-[16px] object-cover border border-black/5 cursor-pointer hover:opacity-90"
            />
          )}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
                <h2 className="text-[#1e1e1e] text-[15px] font-bold truncate cursor-pointer hover:underline decoration-1 underline-offset-2">
                {room ? room.roomName : "채팅방"}
                </h2>
                <span className="text-[#999] text-xs font-medium pt-0.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#bbb]"></span>
                    {(messages?.length || 0) + 1}
                </span>
            </div>
          </div>
        </div>

        <div className="flex gap-5 text-[#333]">
          <Search size={20} strokeWidth={1.5} className="cursor-pointer hover:opacity-60 transition-opacity" />
          <Menu size={20} strokeWidth={1.5} className="cursor-pointer hover:opacity-60 transition-opacity" />
        </div>
      </header>

      {/* 2. 스크롤 영역 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar"
      >
        {loading ? (
          <div className="text-center text-black/30 py-10 text-xs">로딩 중...</div>
        ) : (
          displayMessages.length > 0 ? (
            <>
              {messages && messages.length > MAX_MESSAGES && (
                <div className="text-center py-6 text-xs text-black/30">
                  이전 대화 불러오기...
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

      {/* 3. 입력창 (Footer): 흰색 배경 위 회색 박스 */}
      <div className="flex-none bg-white p-4 border-t border-[#ececec] z-20">
        <div className="flex flex-col bg-[#f5f5f5] rounded-[20px] px-4 py-3 border border-transparent focus-within:bg-white focus-within:border-[#dcdcdc] transition-all shadow-sm">
            
            <textarea 
                className="w-full resize-none text-[14px] text-[#1e1e1e] placeholder:text-[#999] bg-transparent border-none focus:ring-0 p-0 min-h-[60px] max-h-[150px] leading-relaxed custom-scrollbar mb-2"
                placeholder="메시지 입력"
                rows={2}
            />

            <div className="flex justify-between items-center">
                <div className="flex gap-4 text-[#777]">
                    <Smile size={22} strokeWidth={1.5} className="cursor-pointer hover:text-black transition-colors" />
                    <Paperclip size={22} strokeWidth={1.5} className="cursor-pointer hover:text-black transition-colors" />
                </div>
                
                <button 
                    className="bg-[#FEE500] hover:bg-[#fdd835] text-[#1e1e1e] px-4 py-1.5 rounded-[12px] text-[12px] font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    전송
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
