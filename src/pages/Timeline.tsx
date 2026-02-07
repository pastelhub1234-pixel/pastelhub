import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList'; // 경로 확인 필요
import { ChatConversation } from './ChatConversation'; // 경로 확인 필요
import { MessageCircle } from 'lucide-react';

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    // 배경은 투명(상위 페이지 그라데이션 보임), 화면 정중앙 배치
    <div className="flex justify-center items-center h-[calc(100vh-64px)] w-full p-6 font-sans">
      
      {/* ✅ 메인 컨테이너 디자인 개선
        - h-[85vh]: 화면 높이의 85%를 채워서 시원하게 (AllTweets의 600px보다 좋음)
        - rounded-[24px]: 모서리를 더 둥글게 깎아서 파스텔톤 UI와 어울리게
        - shadow-2xl: 깊이감 있는 그림자 추가
      */}
      <div className="w-full max-w-[1100px] h-[85vh] max-h-[850px] bg-white rounded-[24px] shadow-2xl border border-white/50 overflow-hidden flex ring-1 ring-black/5">
        
        {/* 왼쪽: 채팅방 목록 (너비 340px로 살짝 넓힘) */}
        <div className="w-[340px] border-r border-[#ececec] flex-none bg-white z-10 flex flex-col">
          <ChatRoomList current={roomId} onSelect={setRoomId} />
        </div>
        
        {/* 오른쪽: 대화 내용 */}
        {/* ✅ min-w-0: 이게 있어야 내부 글자가 세로로 깨지는 현상이 사라짐 */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#b2c7da] relative">
          {roomId ? (
            <ChatConversation key={roomId} roomId={roomId} />
          ) : (
            // 채팅방 선택 안 했을 때 나오는 대기 화면
            <div className="flex-1 flex flex-col items-center justify-center text-[#999] gap-4 bg-[#b2c7da]">
               <div className="p-6 bg-white/20 rounded-[24px] mb-2 backdrop-blur-sm shadow-sm border border-white/10">
                 <MessageCircle className="w-16 h-16 text-white opacity-90" />
               </div>
               <p className="text-[16px] font-bold text-white/90 drop-shadow-sm tracking-tight">
                 채팅방을 선택해주세요
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
