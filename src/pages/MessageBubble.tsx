// ✅ ChatMessage 타입을 여기에서 정의하고 export 합니다.
export interface ChatMessage {
  id?: number;
  type: string; // "TEXT", "IMAGE", "date"
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
      <div className="flex justify-center my-5">
        <span className="px-3 py-1 text-[11px] text-white/90 bg-black/10 rounded-full backdrop-blur-[2px] shadow-sm">
          {msg.content}
        </span>
      </div>
    );
  }

  // 본인 확인 (이름이 'Me' 또는 '나'인 경우)
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
      
      {/* 상대방 프로필: 완전 원형 */}
      {!isMe && (
        <div className="flex flex-col items-center mr-2.5 shrink-0 self-start mt-0.5">
          {msg.profileImg ? (
            <img 
              src={msg.profileImg} 
              alt={msg.name} 
              className="w-[42px] h-[42px] rounded-full object-cover shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-black/5 hover:opacity-90 cursor-pointer" 
            />
          ) : (
            <div className="w-[42px] h-[42px] rounded-full bg-slate-200" />
          )}
        </div>
      )}

      <div className={`flex flex-col max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* 상대방 이름 */}
        {!isMe && <span className="text-[12px] text-[#555] mb-1.5 ml-1 font-medium">{msg.name}</span>}

        <div className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
          
          {/* 말풍선 */}
          {msg.type === "TEXT" && (
            <div 
              className={`
                relative px-3.5 py-2 text-[14px] leading-snug shadow-[0_1px_1px_rgba(0,0,0,0.08)] whitespace-pre-wrap break-words
                ${isMe 
                  ? 'bg-[#FEE500] text-[#1e1e1e] rounded-[16px] rounded-tr-[2px]' // 나: 노란색, 우상단 뾰족
                  : 'bg-white text-[#1e1e1e] rounded-[16px] rounded-tl-[2px]' // 상대: 흰색, 좌상단 뾰족
                }
              `}
            >
              {msg.content}
            </div>
          )}
          
          {/* 이미지 메시지 */}
          {msg.type === "IMAGE" && (
             <div className="rounded-[16px] overflow-hidden shadow-sm border border-black/5 max-w-[240px]">
               <img src={msg.content} alt="image" className="w-full h-auto object-cover" />
             </div>
          )}

          {/* 시간 표시 */}
          <span className="text-[10px] text-[#555] min-w-max mb-0.5 leading-none tracking-tight">
            {timeString}
          </span>
        </div>
      </div>
    </div>
  );
}