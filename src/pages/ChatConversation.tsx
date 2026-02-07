import { useEffect, useRef } from 'react';
import { Search, Menu, Smile, Paperclip } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
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

// ✅ 사용자 요청: 최대 50개 메시지
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
      
      {/* 헤더 */}
      <header className="flex-none h-[60px] bg-white/80 backdrop-blur-md px-4 flex justify-between items-center z-10 border-b border-white/40">
        <div className="flex items-center gap-3 min-w-0">
          {room && (
            <img 
              src={room.roomImg} 
              alt={room.roomName} 
              // ✅ 헤더 이미지 둥글게
              className="w-[36px] h-[36px] object-cover rounded-[12px] shadow-sm"
            />
          )}
          <div className="min-w-0">
            <h2 className="text-gray-900 text-[14px] font-bold truncate">
              {room ? room.roomName : "채팅방"}
            </h2>
            <span className="text-gray-500 text-[11px]">
              참여자 {(messages?.length || 0) + 1}
            </span>
          </div>
        </div>

        <div className="flex gap-3 text-gray-500">
          <Search size={18} className="cursor-pointer hover:text-black" />
          <Menu size={18} className="cursor-pointer hover:text-black" />
        </div>
      </header>

      {/* 대화 내용 */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar"
      >
        {loading ? (
          <div className="text-center text-gray-500 py-10 text-xs">로딩 중...</div>
        ) : (
          displayMessages.length > 0 ? (
            <>
               {messages && messages.length > MAX_MESSAGES && (
                <div className="text-center py-4 text-[11px] text-gray-500 opacity-60">
                  이전 대화 불러오기
                </div>
              )}
              {displayMessages.map((m, i) => (
                 <MessageBubble key={m.id || i} msg={m} />
              ))}
            </>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
               <p>대화 내용이 없습니다.</p>
            </div>
          )
        )}
      </div>

      {/* 입력창 (둥글게) */}
      <div className="flex-none bg-white p-3 z-20 border-t border-gray-100">
        <div className="flex flex-col bg-gray-50 rounded-xl px-3 py-2">
            <textarea 
                className="w-full resize-none text-[13px] text-gray-800 placeholder:text-gray-400 bg-transparent border-none focus:ring-0 p-1 min-h-[40px] leading-relaxed custom-scrollbar"
                placeholder="메시지를 입력하세요"
            />
            <div className="flex justify-between items-center mt-1">
                <div className="flex gap-2 text-gray-400">
                    <Smile size={20} className="cursor-pointer hover:text-gray-600" />
                    <Paperclip size={20} className="cursor-pointer hover:text-gray-600" />
                </div>
                <button 
                    className="bg-[#FEE500] hover:bg-[#fdd835] text-black px-3 py-1 rounded-lg text-[12px] font-medium transition-colors"
                >
                    전송
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}