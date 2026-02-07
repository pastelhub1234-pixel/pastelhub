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
      {/* ✅ [수정] 프로필 이미지 영역 
         - min-w-[40px]: 이미지가 절대 찌그러지지 않도록 최소 너비 고정 (핵심)
         - border border-black/5: 이미지 외곽선을 줘서 깔끔하게 마감
      */}
      <div className="w-10 h-10 min-w-[40px] rounded-[16px] overflow-hidden mr-3 shrink-0 bg-gray-200 border border-black/5">
        {msg.profileImg ? (
          <img src={msg.profileImg} alt={msg.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-purple-200"></div>
        )}
      </div>

      {/* 메시지 영역 */}
      <div className="flex flex-col max-w-[460px]">
        {/* 이름 */}
        <span className="text-[12px] text-gray-600 mb-1 pl-1">{msg.name}</span>

        {/* 텍스트 메시지 */}
        {msg.type === "TEXT" && (
          // ✅ [수정] text-[14px]로 변경하여 오밀조밀하고 깔끔한 느낌
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
