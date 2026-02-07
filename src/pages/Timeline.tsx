import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // ✅ [수정 1] 상하좌우 간격 동일하게 맞춤 (p-4 = 16px)
    // h-[calc(100vh-60px)]: 상단 네비게이션(60px)을 뺀 나머지 높이 전체 사용
    <div className="flex justify-center items-center w-full h-[calc(100vh-60px)] p-4 font-sans bg-gray-50">
      
      {/* ✅ [수정 2] 내부 창을 부모 크기에 100% 꽉 채움 (w-full, h-full) */}
      <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 flex overflow-hidden font-sans">
        
        {/* 왼쪽: 채팅방 목록 (너비 320px 고정) */}
        <div className="w-[320px] border-r border-gray-100 flex-none bg-white z-10 flex flex-col">
          <ChatRoomList current={roomId} onSelect={setRoomId} />
        </div>
        
        {/* 오른쪽: 대화 내용 (나머지 공간 꽉 채움) */}
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