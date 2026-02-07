import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // 중앙 정렬 및 전체 레이아웃 패딩 조정
    <div className="flex justify-center items-center h-[calc(100vh-60px)] w-full px-4 py-2 font-sans">
      
      {/* ✅ [수정] 크기 대폭 확대
          - h-[82vh]: 화면 높이의 82%를 차지하도록 늘림
          - max-w-[1600px]: 좌우 너비 제한을 풀어 시원하게
      */}
      <div className="w-full max-w-[1600px] h-[82vh] bg-white rounded-xl shadow-sm border border-gray-200 flex overflow-hidden font-sans">
        
        {/* 왼쪽: 채팅방 목록 */}
        <div className="w-[300px] border-r border-gray-100 flex-none bg-white z-10 flex flex-col">
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