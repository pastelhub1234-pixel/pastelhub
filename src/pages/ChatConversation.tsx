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

  // 최신 50개 메시지만 표시
  const displayMessages = messages ? messages.slice(-MAX_MESSAGES) : [];

  // 스크롤 최하단 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, roomId]);

  return (
    // 배경색 적용: 카카오톡 기본 스킨 (#b2c7da)
    <div className="flex-1 h-full flex flex-col bg-[#b2c7da] min-w-0 min-h-0">
      
      {/* 1. 헤더: 반투명 흰색 + 블러 효과 */}
      <header className="flex-none h-14 bg-white/90 backdrop-blur-md px-4 flex items-center justify-between z-10 border-b border-white/30 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          {room && (
            <img 
              src={room.roomImg} 
              alt={room.roomName} 
              className="w-9 h-9 rounded-[14px] object-cover shadow-sm"
            />
          )}
          <div className="min-w-0">
            <h2 className="text-gray-900 text-[14px] font-bold truncate flex items-center gap-1.5">
              {room ? room.roomName : "채팅방"}
              <span className="text-gray-500 text-xs font-normal">
                {(messages?.length || 0) + 1}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex gap-3.5 text-gray-600 opacity-80">
          <Search size={18} className="cursor-pointer hover:text-black transition-colors" />
          <Menu size={18} className="cursor-pointer hover:text-black transition-colors" />
        </div>
      </header>

      {/* 2. 스크롤 영역 (메시지 리스트) */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-1 custom-scrollbar"
      >
        {loading ? (
          <div className="text-center text-white/70 py-8 text-xs">로딩 중...</div>
        ) : (
          displayMessages.length > 0 ? (
            <>
              {messages && messages.length > MAX_MESSAGES && (
                <div className="text-center py-4 text-xs text-black/40">
                  이전 대화 불러오기...
                </div>
              )}
              {displayMessages.map((m, i) => (
                 <MessageBubble key={m.id || i} msg={m} />
              ))}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-black/30 text-sm gap-2">
               <p>대화 내용이 없습니다.</p>
            </div>
          )
        )}
      </div>

      {/* 3. 입력창 (Footer): 반투명 흰색 */}
      <div className="flex-none p-3 bg-white/90 backdrop-blur-md border-t border-white/30 relative z-10">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-[18px] border border-slate-200 focus-within:border-slate-400 transition-colors shadow-sm">
            <div className="flex gap-2 shrink-0 text-slate-400">
                 <Paperclip size={20} className="cursor-pointer hover:text-slate-700 transition-colors" />
                 <Smile size={20} className="cursor-pointer hover:text-slate-700 transition-colors" />
            </div>

            <textarea 
                className="flex-1 resize-none text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none h-[24px] py-0.5 leading-normal bg-transparent"
                placeholder="메시지를 입력하세요"
            />

            {/* 전송 버튼: 카카오톡 노란색 */}
            <button className="bg-[#FEE500] hover:bg-[#fdd835] text-black w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 shadow-sm">
                <Send size={14} className="ml-0.5 fill-current" />
            </button>
        </div>
      </div>
    </div>
  );
}