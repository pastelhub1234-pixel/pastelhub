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
      {/* ✅ [핵심 수정 1] flex-none 사용
          - shrink-0보다 강력하게 "나는 크기 변화에 참여하지 않겠다"고 선언
          - 어떤 상황에서도 40px 너비를 사수합니다.
      */}
      <div className="flex-none w-10 h-10 rounded-2xl overflow-hidden mr-3 bg-gray-200 border border-black/5">
        {msg.profileImg ? (
          <img src={msg.profileImg} alt={msg.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-purple-200"></div>
        )}
      </div>

      {/* ✅ [핵심 수정 2] min-w-0 및 break-all
          - min-w-0: Flex 자식이 부모 너비를 무시하고 팽창하는 버그 방지
          - max-w-[320px]: 말풍선 최대 너비
      */}
      <div className="flex flex-col min-w-0 max-w-[320px]">
        {/* 이름 */}
        <span className="text-[12px] text-gray-600 mb-1 pl-1 font-medium">{msg.name}</span>

        {/* 텍스트 메시지 */}
        {msg.type === "TEXT" && (
          // ✅ break-all: URL이나 긴 영어 단어도 강제로 줄바꿈시킴 (레이아웃 깨짐 방지)
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
