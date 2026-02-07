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
    <div className="flex-1 h-full flex flex-col bg-[#b2c7da] min-w-0 min-h-0 relative">
      
      {/* ✅ [수정] 헤더 패딩(py-4) 확대 및 간격(gap-4) 조정 */}
      <header className="bg-[#b2c7da]/95 backdrop-blur-sm px-5 py-4 flex justify-between items-center border-b border-black/5 flex-shrink-0 z-10">
        <div className="flex items-center gap-4 min-w-0"> {/* gap-4로 이미지와 텍스트 간격 넓힘 */}
          {room && (
            <img 
              src={room.roomImg} 
              alt={room.roomName} 
              className="w-9 h-9 rounded-[13px] object-cover shadow-sm cursor-pointer hover:opacity-90"
            />
          )}
          <div className="min-w-0">
            <h2 className="text-gray-900 text-[15px] font-bold truncate">
              {room ? room.roomName : "채팅방"}
            </h2>
            <div className="flex items-center gap-1.5 text-gray-700 opacity-70 mt-0.5">
              <span className="text-[11px]">
                참여자 {(messages?.length || 0) + 1}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 text-gray-700 opacity-60">
          <Search size={20} className="cursor-pointer hover:opacity-100" />
          <Menu size={20} className="cursor-pointer hover:opacity-100" />
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
             <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2 opacity-60">
               <p>대화 내용이 없습니다.</p>
            </div>
          )
        )}
      </div>

      {/* 입력창 */}
      <div className="flex-none bg-white p-4 z-20 border-t border-gray-100">
        <div className="flex flex-col bg-gray-50 rounded-xl px-4 py-3">
            <textarea 
                className="w-full resize-none text-[14px] text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:ring-0 p-1 min-h-[40px] leading-relaxed custom-scrollbar"
                placeholder="메시지를 입력하세요"
            />
            <div className="flex justify-between items-center mt-2">
                <div className="flex gap-3 text-gray-400">
                    <Smile size={22} className="cursor-pointer hover:text-gray-600 transition-colors" />
                    <Paperclip size={22} className="cursor-pointer hover:text-gray-600 transition-colors" />
                </div>
                <button 
                    className="bg-[#FEE500] hover:bg-[#fdd835] text-black px-4 py-1.5 rounded-[10px] text-[13px] font-medium transition-colors"
                >
                    전송
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}