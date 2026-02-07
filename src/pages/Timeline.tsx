import { useState } from 'react';
// ✅ 경로 수정: ./components/chat... (같은 폴더에 있다면 ./ChatRoomList)
// 파일 구조상 src/pages/Timeline.tsx라면 ../components/chat/... 이 맞습니다.
// 사용자가 "4코드 다 같은 위치"라고 하셨으므로 가정을 src/components/chat/Timeline.tsx 라고 한다면 ./ 가 맞습니다.
// 여기서는 안전하게 상대경로 ./ 로 통일합니다. (사용자 요청 반영)
import { ChatRoomList } from './ChatRoomList'; 
import { ChatConversation } from './ChatConversation'; 
import { MessageCircle } from 'lucide-react';

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // 전체 컨테이너
    <div className="flex justify-center items-center h-[calc(100vh-60px)] w-full p-6 font-sans">
      
      {/* ✅ 메인 창 디자인 수정 
         - rounded-none: 네모난 창 (PC버전 느낌)
         - border-[#999]: 진한 테두리
      */}
      <div className="w-full max-w-[1000px] h-[85vh] max-h-[800px] bg-white shadow-xl border border-[#999] flex overflow-hidden">
        
        {/* 왼쪽: 채팅방 목록 */}
        <div className="w-[300px] border-r border-[#dcdcdc] flex-none bg-white z-10 flex flex-col">
          <ChatRoomList current={roomId} onSelect={setRoomId} />
        </div>
        
        {/* 오른쪽: 대화 내용 */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#bacee0] relative">
          {roomId ? (
            <ChatConversation key={roomId} roomId={roomId} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#999] gap-4 bg-[#bacee0]">
               <div className="p-5 bg-white/20 rounded-full mb-1 backdrop-blur-sm shadow-sm border border-white/10">
                 <MessageCircle className="w-12 h-12 text-white opacity-80" />
               </div>
               <p className="text-[14px] text-white/80 drop-shadow-sm">
                 대화 상대를 선택해주세요
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}