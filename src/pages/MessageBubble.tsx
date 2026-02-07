import { ChatMessage } from '../types';

interface MessageBubbleProps {
  msg: ChatMessage;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  // 날짜 표시
  if (msg.type === "date") {
    return (
      <div className="flex justify-center my-4">
        <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full border border-gray-200/50">
          {msg.content}
        </span>
      </div>
    );
  }

  // 시간 포맷팅
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex mb-4 items-start">
      {/* ✅ [수정 1] 프로필 이미지 깨짐 방지
          - min-w-[40px]: 이미지가 절대 찌그러지지 않도록 최소 너비 고정 (핵심)
          - rounded-[16px]: 더 둥글게 처리
          - border: 연한 테두리로 깔끔하게 마감
      */}
      <div className="w-10 h-10 min-w-[40px] rounded-[16px] overflow-hidden mr-3 shrink-0 bg-gray-200 border border-black/5">
        {msg.profileImg ? (
          <img src={msg.profileImg} alt={msg.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-purple-200"></div>
        )}
      </div>

      {/* ✅ [수정 2] max-w-[360px]로 축소 
          - 460px -> 360px로 줄여서, 글자가 너무 길게 뻗지 않고 미리 줄바꿈되도록 유도
          - 이렇게 하면 프로필 이미지를 미는 압력이 줄어듭니다.
      */}
      <div className="flex flex-col max-w-[360px]">
        {/* 이름 */}
        <span className="text-[12px] text-gray-600 mb-1 pl-1 font-medium">{msg.name}</span>

        {/* 텍스트 메시지 */}
        {msg.type === "TEXT" && (
          // ✅ [수정 3] 스타일 디테일
          // text-[14px]: 가독성 좋은 크기
          // rounded-[20px]: 둥글고 부드러운 말풍선
          <div className="bg-white px-4 py-2.5 rounded-[20px] text-[14px] leading-relaxed shadow-sm whitespace-pre-wrap break-words text-gray-800">
            {msg.content}
          </div>
        )}

        {/* 이미지 메시지 */}
        {msg.type === "IMAGE" && (
          <div className="bg-white p-2 rounded-[20px] shadow-sm border border-black/5">
            <img src={msg.content} alt="전송된 이미지" className="rounded-xl max-w-full h-auto" />
          </div>
        )}

        {/* 시간 */}
        <span className="text-[10px] text-gray-400 mt-1 ml-1">
          {formatTime(msg.time)}
        </span>
      </div>
    </div>
  );
}
