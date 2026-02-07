import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // ✅ [수정 1] items-start: 위쪽으로 정렬 (중앙 정렬 해제 -> 위쪽 간격 제거)
    // ✅ [수정 2] pt-2: 상단 여백 최소화 (8px), px-0: 좌우 여백 없음 (외부 여백 활용)
    // ✅ [수정 3] h-screen: 화면 전체 높이 사용
    <div className="flex justify-center items-start w-full h-screen bg-gray-50 pt-2 px-0 pb-2 font-sans">
      
      {/* ✅ [수정 4] rounded-[24px]: 모서리 둥글게 복구 */}
      {/* h-[calc(100%-10px)]: 하단 여백 살짝 남김 */}
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