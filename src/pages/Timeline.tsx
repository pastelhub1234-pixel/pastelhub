import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList';
import { ChatConversation } from './ChatConversation';
import { MessageCircle } from 'lucide-react';

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // 전체 컨테이너: 카톡 창 느낌 (둥근 모서리, 그림자, 테두리)
    <div className="flex justify-center items-center h-[calc(100vh-80px)] p-4 font-sans antialiased">
      <div className="w-full max-w-[1100px] h-full bg-white rounded-[20px] shadow-xl border border-[#dcdcdc] overflow-hidden flex">
        
        {/* 왼쪽: 채팅방 목록 (고정 너비 320px) */}
        <div className="w-[320px] border-r border-[#ececec] flex-none bg-white z-10 flex flex-col">
          <ChatRoomList current={roomId} onSelect={setRoomId} />
        </div>
        
        {/* 오른쪽: 대화 내용 (배경색 #b2c7da - 카톡 기본 테마) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#b2c7da] relative">
          {roomId ? (
            <ChatConversation key={roomId} roomId={roomId} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#999] gap-4 bg-[#b2c7da]">
               <div className="p-5 bg-white/20 rounded-full mb-1 backdrop-blur-sm shadow-sm">
                 <MessageCircle className="w-16 h-16 text-white opacity-90" />
               </div>
               <p className="text-[15px] font-medium text-white/90 drop-shadow-sm">채팅방을 선택해주세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}