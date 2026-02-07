import { useEffect, useRef } from 'react';
import { Search, Menu, Smile, Paperclip } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
import { MessageBubble } from './MessageBubble';
import { ChatRoom, ChatMessage } from '../types'; 

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
    <div className="flex-1 h-full flex flex-col bg-[#b2c7da] min-w-0 relative">
      
      {/* ✅ [수정] 헤더 높이 확대 (h-[80px]) - 비율 예쁘게 */}
      <header className="flex-none h-[80px] bg-[#b2c7da] px-6 flex justify-between items-center z-10 border-b border-black/5">
        <div className="flex items-center gap-4 min-w-0">
          {room && (
            <img 
              src={room.roomImg} 
              alt={room.roomName} 
              // 프로필 이미지 크기 유지 (44px)
              style={{ width: '44px', height: '44px', minWidth: '44px', objectFit: 'cover' }}
              className="rounded-[16px] shadow-sm bg-gray-200 cursor-pointer hover:opacity-90"
            />
          )}
          <div className="min-w-0 flex flex-col justify-center">
            <h2 className="text-[#1e1e1e] text-[17px] font-bold truncate leading-tight">
              {room ? room.roomName : "채팅방"}
            </h2>
            <div className="flex items-center gap-1.5 text-[#555] opacity-80 mt-1">
              <span className="text-[13px] font-medium">
                참여자 {(messages?.length || 0) + 1}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-5 text-[#555] opacity-70">
          <Search size={22} className="cursor-pointer hover:text-black transition-colors" />
          <Menu size={22} className="cursor-pointer hover:text-black transition-colors" />
        </div>
      </header>

      {/* 대화 내용 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar"
      >
        {loading ? (
          <div className="text-center text-gray-500 py-10 text-xs">로딩 중...</div>
        ) : (
          displayMessages.length > 0 ? (
            <>
               {messages && messages.length > MAX_MESSAGES && (
                <div className="text-center py-4 text-[11px] text-[#555] opacity-60">
                  이전 대화 불러오기
                </div>
              )}
              {displayMessages.map((m, i) => (
                 <MessageBubble key={m.id || i} msg={m} />
              ))}
            </>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm gap-2 opacity-60">
               <p>대화 내용이 없습니다.</p>
            </div>
          )
        )}
      </div>

      {/* 입력창 */}
      <div className="flex-none bg-white p-4 z-20 border-t border-gray-100">
        <div className="flex flex-col bg-gray-50 rounded-2xl px-4 py-3">
            <textarea 
                className="w-full resize-none text-[14px] text-[#1e1e1e] placeholder:text-gray-400 bg-transparent border-none focus:ring-0 p-0 min-h-[40px] leading-relaxed custom-scrollbar"
                placeholder="메시지를 입력하세요"
            />
            <div className="flex justify-between items-center mt-2">
                <div className="flex gap-3 text-gray-400">
                    <Smile size={22} className="cursor-pointer hover:text-gray-600 transition-colors" />
                    <Paperclip size={22} className="cursor-pointer hover:text-gray-600 transition-colors" />
                </div>
                <button 
                    className="bg-[#FEE500] hover:bg-[#fdd835] text-[#1e1e1e] px-4 py-1.5 rounded-[10px] text-[13px] font-bold transition-colors shadow-sm"
                >
                    전송
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}