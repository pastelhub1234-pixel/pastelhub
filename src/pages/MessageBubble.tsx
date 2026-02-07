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
      {/* 프로필 이미지 */}
      {/* rounded-2xl: 모서리 둥글게 (표준 클래스 사용) */}
      <div className="w-10 h-10 min-w-[40px] rounded-2xl overflow-hidden mr-3 shrink-0 bg-gray-200 border border-black/5">
        {msg.profileImg ? (
          <img src={msg.profileImg} alt={msg.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-purple-200"></div>
        )}
      </div>

      {/* ✅ [수정 1] 너비 제한 확실하게 (320px) */}
      <div className="flex flex-col max-w-[320px]">
        {/* 이름 */}
        <span className="text-[12px] text-gray-600 mb-1 pl-1 font-medium">{msg.name}</span>

        {/* 텍스트 메시지 */}
        {msg.type === "TEXT" && (
          // ✅ [수정 2] 디자인 및 줄바꿈 해결
          // rounded-2xl: 네모난 현상 해결 (확실히 둥글게)
          // break-all: 긴 단어/반복 문자 강제 줄바꿈 (너비 무시 방지)
          <div className="bg-white px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm whitespace-pre-wrap break-all text-gray-800">
            {msg.content}
          </div>
        )}

        {/* 이미지 메시지 */}
        {msg.type === "IMAGE" && (
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-black/5">
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
