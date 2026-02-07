import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // ✅ [수정] 간격을 30% 수준으로 축소 (p-1.5 = 6px)
    // 화면 전체 높이에서 아주 조금만 뺌
    <div className="flex justify-center items-center w-full h-screen bg-gray-50 p-1.5 font-sans">
      
      {/* 메인 컨테이너 */}
      <div className="w-full h-full bg-white rounded-xl shadow-md border border-gray-200 flex overflow-hidden font-sans">
        
        {/* 왼쪽: 채팅방 목록 (320px) */}
        <div className="w-[320px] border-r border-gray-100 flex-none bg-white z-10 flex flex-col">
          <ChatRoomList current={roomId} onSelect={setRoomId} />
        </div>
        
        {/* 오른쪽: 대화 내용 */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#b2c7da] relative">
          {roomId ? (
            <ChatConversation key={roomId} roomId={roomId} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 bg-[#b2c7da]">
               <p className="text-sm font-medium">대화 상대를 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
