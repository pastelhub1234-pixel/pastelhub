import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // ✅ [수정] 화면 중앙 정렬
    // h-screen: 화면 전체 높이 사용
    // p-2: 바깥 여백을 최소화 (아주 얇은 간격)
    <div className="flex justify-center items-center w-full h-screen bg-gray-50 p-2 font-sans">
      
      {/* ✅ [수정] 메인 컨테이너
          - w-full: 가로 꽉 채움
          - h-[96%] 또는 h-[94vh]: 부모 높이의 대부분을 사용하고 살짝만 남김
          - rounded-xl, shadow-sm: 둥근 카드 디자인 유지
      */}
      <div className="w-full h-[96%] bg-white rounded-xl shadow-md border border-gray-200 flex overflow-hidden font-sans">
        
        {/* 왼쪽: 채팅방 목록 (320px로 확대하여 균형 맞춤) */}
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