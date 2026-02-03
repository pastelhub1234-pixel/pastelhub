import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList'; // 경로 확인 필요
import { ChatConversation } from './ChatConversation'; // 아래 코드 참고
import { MessageCircle } from 'lucide-react';

export default function Timeline() {
  const [roomId, setRoomId] = useState<string>("group_stellive_all");

  return (
    <div className="w-full h-[calc(100vh-100px)] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex font-sans">
      
      {/* 왼쪽: 채팅방 목록 (고정 너비, 흰색 배경) */}
      <div className="w-80 border-r border-slate-100 flex-none bg-white z-10">
        <ChatRoomList current={roomId} onSelect={setRoomId} />
      </div>
      
      {/* 오른쪽: 대화 내용 (카카오톡 스타일 배경) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#b2c7da] relative">
        {roomId ? (
          // flex-1, h-full을 전달하여 내부 스크롤이 꽉 차게 함
          <ChatConversation key={roomId} roomId={roomId} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500/50 gap-3">
             <MessageCircle className="w-16 h-16 opacity-20" />
             <p className="text-sm font-medium opacity-60">채팅방을 선택해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}