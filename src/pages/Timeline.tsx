import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // ✅ [수정] p-0으로 간격 완전 제거, h-full로 높이 꽉 채움
    // 부모 컨테이너(레이아웃)에서 남겨준 공간을 빈틈없이 사용합니다.
    <div className="flex justify-center items-center w-full h-full p-0 font-sans bg-gray-50">
      
      {/* 메인 컨테이너: 테두리(border)는 유지하되 꽉 차게 */}
      <div className="w-full h-full bg-white shadow-sm border border-gray-200 flex overflow-hidden font-sans rounded-none">
        
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