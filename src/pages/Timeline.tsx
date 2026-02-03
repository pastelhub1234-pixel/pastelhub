import { useState } from 'react';
import { ChatRoomList } from './ChatRoomList';
import { ChatConversation } from './ChatConversation';

export default function Timeline() {
  // 초기 채팅방 ID는 빈 문자열로 두거나, 특정 기본값을 설정할 수 있습니다.
  // ChatRoomList가 로드된 후 사용자가 선택하게 됩니다.
  const [roomId, setRoomId] = useState<string>("");

  return (
    // 기존 Timeline의 높이 계산(h-[calc(100vh-200px)])을 유지하면서
    // AllTweets의 스타일(rounded-xl, shadow-sm, border)을 적용했습니다.
    <div className="w-full h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-gray-200 flex overflow-hidden font-sans">
      {/* 왼쪽: 채팅방 목록 */}
      <ChatRoomList current={roomId} onSelect={setRoomId} />
      
      {/* 오른쪽: 대화 내용 */}
      {/* roomId가 없을 경우 빈 화면을 보여주는 로직은 ChatConversation 내부 혹은 여기서 처리 가능합니다. */}
      {roomId ? (
        <ChatConversation key={roomId} roomId={roomId} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#b2c7da] text-gray-500 text-sm opacity-60">
           <p>채팅방을 선택해주세요.</p>
        </div>
      )}
    </div>
  );
}