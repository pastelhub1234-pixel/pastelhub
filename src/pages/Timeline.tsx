import { useState } from 'react';
// ✅ 같은 폴더(src/pages) 내 컴포넌트 호출
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // ✅ [수정] 상단 여백(pt) 0, 나머지 여백 최소화 (px-2, pb-2)
    // h-[calc(100vh-10px)]: 화면 꽉 채우되 아래쪽만 살짝 띄움
    <div className="flex justify-center items-end w-full h-[calc(100vh-10px)] px-2 pb-2 pt-0 font-sans bg-gray-50">
      
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