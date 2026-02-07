// ✅ 경로 수정: ../types (상위 폴더의 types)
import { ChatMessage } from '../../../types';

interface MessageBubbleProps {
  msg: ChatMessage;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  // 날짜 표시 (PC 카톡 스타일: 얇은 라인 + 텍스트)
  if (msg.type === "date") {
    return (
      <div className="flex items-center justify-center my-4 px-4">
        <div className="flex-1 h-[1px] bg-[#a6b6c5]/40"></div>
        <span className="px-3 text-[11px] text-[#555] font-medium">
          {msg.content}
        </span>
        <div className="flex-1 h-[1px] bg-[#a6b6c5]/40"></div>
      </div>
    );
  }

  const isMe = msg.name === 'Me' || msg.name === '나';

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };
  const timeString = msg.time || formatTime(new Date().toISOString());

  return (
    <div className={`flex w-full mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      
      {/* 상대방 프로필 (네모난 모양) */}
      {!isMe && (
        <div className="flex flex-col items-center mr-2 shrink-0 self-start cursor-pointer">
          {msg.profileImg ? (
            <img 
              src={msg.profileImg} 
              alt={msg.name} 
              // ✅ rounded-sm: 거의 네모남
              className="w-[40px] h-[40px] rounded-[3px] object-cover border border-black/5" 
            />
          ) : (
            <div className="w-[40px] h-[40px] rounded-[3px] bg-[#d1d1d1]" />
          )}
        </div>
      )}

      <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* 상대방 이름 */}
        {!isMe && <span className="text-[12px] text-[#4b4b4b] mb-1 ml-0.5">{msg.name}</span>}

        <div className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
          
          {/* 말풍선 (네모난 스타일) */}
          {msg.type === "TEXT" && (
            <div 
              className={`
                relative px-3 py-1.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words border border-black/5
                ${isMe 
                  ? 'bg-[#feec34] text-black rounded-[2px]' // 나: 카톡 노랑 + 네모
                  : 'bg-white text-black rounded-[2px]' // 상대: 흰색 + 네모
                }
              `}
            >
              {msg.content}
            </div>
          )}
          
          {/* 이미지 메시지 */}
          {msg.type === "IMAGE" && (
             <div className="rounded-[2px] overflow-hidden border border-black/5 max-w-[240px]">
               <img src={msg.content} alt="image" className="w-full h-auto object-cover" />
             </div>
          )}

          {/* 시간 표시 */}
          <span className="text-[10px] text-[#555] min-w-max mb-0.5 tracking-tight">
            {timeString}
          </span>
        </div>
      </div>
    </div>
  );
}