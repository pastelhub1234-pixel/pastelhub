import { ChatMessage } from '../types';

interface MessageBubbleProps {
  msg: ChatMessage;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  // 날짜 표시: 분석하신 코드의 색상(gray-700)과 배경(gray-300/50) 적용
  if (msg.type === "date") {
    return (
      <div className="flex justify-center my-4">
        <span className="px-3 py-1 text-xs text-gray-700 bg-gray-300/50 rounded-full">
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
    <div className="flex mb-5 items-start">
      {/* 프로필 이미지: flex-none으로 고정하여 메시지 길이에 영향을 받지 않음 */}
      <div className="flex-none w-10 h-10 rounded-xl overflow-hidden mr-3 bg-gray-200">
        {msg.profileImg ? (
          <img src={msg.profileImg} alt={msg.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-purple-200"></div>
        )}
      </div>

      {/* 메시지 영역: 분석하신 max-w-[75%] 적용 및 줄바꿈 최적화 */}
      <div className="flex flex-col min-w-0 max-w-[75%]">
        {/* 이름: text-xs, text-gray-700, font-medium 적용 */}
        <span className="text-xs text-gray-700 mb-1 font-medium">{msg.name}</span>

        {/* 텍스트 메시지: text-[15px], leading-snug 적용 및 강제 줄바꿈(break-all) 추가 */}
        {msg.type === "TEXT" && (
          <div className="bg-white px-4 py-2.5 rounded-2xl text-[15px] leading-snug shadow-sm whitespace-pre-wrap break-all text-gray-800">
            {msg.content}
          </div>
        )}

        {/* 이미지 메시지: p-2 및 둥근 모서리 적용 */}
        {msg.type === "IMAGE" && (
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-black/5">
            <img src={msg.content} alt="전송된 이미지" className="rounded-lg max-w-full h-auto" />
          </div>
        )}

        {/* 시간: text-[11px], text-gray-500 적용 */}
        <span className="text-[11px] text-gray-500 mt-1 ml-1">
          {formatTime(msg.time)}
        </span>
      </div>
    </div>
  );
}
