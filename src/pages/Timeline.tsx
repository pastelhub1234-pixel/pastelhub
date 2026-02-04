import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList';
import { ChatConversation } from './ChatConversation';
import { MessageCircle } from 'lucide-react';

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    <div className="w-full h-[calc(100vh-100px)] bg-white rounded-[24px] shadow-xl border border-slate-200/80 overflow-hidden flex font-sans">
      
      {/* 왼쪽: 채팅방 목록 (고정 너비 320px) */}
      <div className="w-[320px] border-r border-slate-100 flex-none bg-white z-10">
        <ChatRoomList current={roomId} onSelect={setRoomId} />
      </div>
      
      {/* 오른쪽: 대화 내용 (카카오톡 스타일 배경색 적용) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#b2c7da] relative">
        {roomId ? (
          <ChatConversation key={roomId} roomId={roomId} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500/50 gap-3">
             <div className="p-4 bg-white/20 rounded-full mb-2">
               <MessageCircle className="w-12 h-12 text-white/80" />
             </div>
             <p className="text-sm font-medium text-white/80">채팅방을 선택해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}