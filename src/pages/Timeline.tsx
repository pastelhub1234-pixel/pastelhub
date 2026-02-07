import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // ✅ [수정 1] 위쪽 간격 최소화를 위해 items-end 사용 (아래로 붙임)
    // h-[calc(100vh-10px)]: 화면 높이에서 10px만 뺌 (거의 꽉 참)
    // pb-2: 하단에 아주 살짝 숨구멍만 줌
    <div className="flex justify-center items-end w-full h-[calc(100vh-10px)] px-2 pb-2 pt-0 font-sans bg-gray-50">
      
      {/* ✅ [수정 2] 모서리 둥글게 복구 (rounded-[24px]) */}
      <div className="w-full h-full bg-white rounded-[24px] shadow-lg border border-gray-200 flex overflow-hidden font-sans">
        
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