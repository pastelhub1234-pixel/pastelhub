export interface ChatMessage {
  id?: number;
  type: string;
  name?: string;
  profileImg?: string;
  content: string;
  time?: string;
}

interface MessageBubbleProps {
  msg: ChatMessage;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  // 날짜 구분선
  if (msg.type === "date") {
    return (
      <div className="flex justify-center my-4">
        <span className="px-3 py-1 text-[11px] text-white/90 bg-black/10 rounded-full backdrop-blur-sm">
          {msg.content}
        </span>
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
    <div className={`flex w-full mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
      
      {/* 상대방 프로필 이미지 */}
      {!isMe && (
        <div className="flex flex-col items-center mr-2.5 shrink-0 self-start">
          {msg.profileImg ? (
            <img 
              src={msg.profileImg} 
              alt={msg.name} 
              className="w-[38px] h-[38px] rounded-[16px] object-cover shadow-sm cursor-pointer hover:opacity-90" 
            />
          ) : (
            <div className="w-[38px] h-[38px] rounded-[16px] bg-indigo-100 border border-black/5" />
          )}
        </div>
      )}

      <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* 상대방 이름 */}
        {!isMe && <span className="text-[12px] text-[#4b4b4b] mb-1 ml-1 font-medium">{msg.name}</span>}

        <div className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
          
          {/* 말풍선 본문 */}
          {msg.type === "TEXT" && (
            <div 
              className={`
                relative px-3.5 py-2 text-[14px] leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.06)] whitespace-pre-wrap break-words
                ${isMe 
                  ? 'bg-[#FEE500] text-[#1e1e1e] rounded-[14px] rounded-tr-[2px]' // 나 (노란색)
                  : 'bg-white text-[#1e1e1e] rounded-[14px] rounded-tl-[2px]' // 상대 (흰색)
                }
              `}
            >
              {msg.content}
            </div>
          )}
          
          {/* 이미지 메시지 */}
          {msg.type === "IMAGE" && (
             <div className="rounded-[14px] overflow-hidden shadow-sm border border-black/5 max-w-[240px]">
               <img src={msg.content} alt="image" className="w-full h-auto object-cover" />
             </div>
          )}

          {/* 시간 표시 */}
          <span className="text-[10px] text-[#555] min-w-max mb-1 tracking-tight opacity-70">
            {timeString}
          </span>
        </div>
      </div>
    </div>
  );
}