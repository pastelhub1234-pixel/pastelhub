import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // ✅ 1. 전체 컨테이너: 화면 높이(헤더 제외)를 꽉 채움
    <div className="w-full h-[calc(100vh-60px)] bg-gray-50 flex justify-center items-center p-6">
      
      {/* ✅ 2. 채팅창 본체: 
          - w-full h-full: 부모가 준 공간(패딩 제외)을 100% 다 씁니다.
          - max-w: 너무 넓어지는 게 싫으면 여기서 조절 (지금은 제한 없음)
      */}
      <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 flex overflow-hidden font-sans">
        
        {/* 왼쪽: 채팅방 목록 (너비 300px 고정) */}
        <div className="w-[300px] border-r border-gray-100 flex-none bg-white z-10 flex flex-col">
          <ChatRoomList current={roomId} onSelect={setRoomId} />
        </div>
        
        {/* 오른쪽: 대화 내용 (나머지 공간 자동 채움) */}
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