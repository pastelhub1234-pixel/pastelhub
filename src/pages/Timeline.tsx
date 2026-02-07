import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // ✅ [수정 포인트]
    // 1. items-center -> items-start: 수직 중앙 정렬을 해제하여 위쪽 붕 뜨는 간격 제거
    // 2. pt-2: 상단에 최소한의 여백(8px)만 부여 (답답하지 않게)
    // 3. px-0: 옆쪽 간격은 현재 좋다고 하셨으니 0으로 유지 (외부 여백 활용)
    <div className="flex justify-center items-start w-full h-screen bg-gray-50 pt-2 px-0 pb-2 font-sans">
      
      {/* ✅ [디자인 복구] 
          - rounded-[24px]: 둥근 모서리 다시 적용
          - shadow-lg: 입체감 추가 
          - h-[calc(100%-10px)]: 하단 여백 확보를 위해 높이 미세 조정
      */}
      <div className="w-full h-[calc(100%-8px)] bg-white rounded-[24px] shadow-lg border border-gray-200 flex overflow-hidden font-sans">
        
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