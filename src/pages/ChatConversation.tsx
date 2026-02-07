import { useEffect, useRef } from 'react';
import { Search, Menu, Smile, Paperclip } from 'lucide-react';
import { useJsonData } from '../../hooks/useJsonData';
import { MessageBubble, ChatMessage } from './MessageBubble';

interface ChatRoom {
  roomId: string;
  roomName: string;
  roomImg: string;
}

interface ChatConversationProps {
  roomId: string;
}

// ✅ 최근 메시지 제한 (50개)
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
    // ✅ 배경색 #bacee0 (레퍼런스 이미지 색상)
    // ✅ min-w-0: 플렉스 레이아웃 깨짐 방지 (가장 중요)
    <div className="flex-1 h-full flex flex-col bg-[#bacee0] min-w-0 relative">
      
      {/* 헤더 (배경색과 통일감을 주되 살짝 투명하게) */}
      <header className="flex-none h-[60px] bg-[#bacee0]/95 backdrop-blur-sm px-5 flex justify-between items-center z-20 shadow-sm border-b border-black/5">
        <div className="flex items-center gap-3 min-w-0">
          {room && (
            <img 
              src={room.roomImg} 
              alt={room.roomName} 
              className="w-[36px] h-[36px] rounded-[14px] object-cover shadow-sm cursor-pointer hover:opacity-90"
            />
          )}
          <div className="min-w-0">
            <h2 className="text-[#1e1e1e] text-[15px] font-bold truncate flex items-center gap-1.5">
              {room ? room.roomName : "채팅방"}
              <span className="text-[#777] text-[12px] font-medium opacity-80">
                {(messages?.length || 0) + 1}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex gap-4 text-[#555] opacity-70">
          <Search size={20} className="cursor-pointer hover:opacity-100" />
          <Menu size={20} className="cursor-pointer hover:opacity-100" />
        </div>
      </header>

      {/* 대화 내용 */}
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
                <div className="text-center py-4">
                  <span className="px-3 py-1 bg-black/5 text-black/40 text-[10px] rounded-full">
                    이전 대화 보기
                  </span>
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

      {/* 입력창 (레퍼런스 스타일: 흰색 배경 + 노란 버튼) */}
      <div className="flex-none bg-white p-3 z-20">
        <div className="flex flex-col h-full">
            <textarea 
                className="w-full resize-none text-[14px] text-[#1e1e1e] placeholder:text-[#bbb] bg-transparent border-none focus:ring-0 p-1 min-h-[50px] leading-relaxed custom-scrollbar mb-1"
                placeholder="메시지를 입력하세요"
            />
            <div className="flex justify-between items-center">
                <div className="flex gap-3 text-[#888] px-1">
                    <Paperclip size={20} className="cursor-pointer hover:text-black transition-colors" />
                    <Smile size={20} className="cursor-pointer hover:text-black transition-colors" />
                </div>
                <button 
                    className="bg-[#FEE500] hover:bg-[#fdd835] active:scale-95 text-[#1e1e1e] px-4 py-1.5 rounded-[4px] text-[12px] font-medium shadow-sm transition-all"
                >
                    전송
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}