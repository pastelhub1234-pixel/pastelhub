import { useState } from 'react';
// ✅ 경로 수정: 같은 폴더 내 파일들 ./
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 
import { MessageCircle } from 'lucide-react';

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] w-full p-6 font-sans">
      
      {/* ✅ 메인 창: rounded-[32px] (매우 둥글게) */}
      <div className="w-full max-w-[1100px] h-[85vh] max-h-[850px] bg-white rounded-[32px] shadow-2xl border border-white/60 overflow-hidden flex ring-1 ring-black/5">
        
        {/* 왼쪽: 채팅방 목록 */}
        <div className="w-[340px] border-r border-[#ececec] flex-none bg-white z-10 flex flex-col">
          <ChatRoomList current={roomId} onSelect={setRoomId} />
        </div>
        
        {/* 오른쪽: 대화 내용 */}
        {/* ✅ min-w-0: 내용 깨짐 방지 */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#b2c7da] relative">
          {roomId ? (
            <ChatConversation key={roomId} roomId={roomId} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#999] gap-4 bg-[#b2c7da]">
               <div className="p-6 bg-white/20 rounded-[24px] mb-2 backdrop-blur-sm shadow-sm border border-white/10">
                 <MessageCircle className="w-16 h-16 text-white opacity-90" />
               </div>
               <p className="text-[16px] font-bold text-white/90 drop-shadow-sm tracking-tight">
                 채팅방을 선택해주세요
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}