export interface ChatMessage {
  id?: number;
  type: string; 
  name?: string;
  profileImg?: string;
  content: string;
  time?: string;
  createdAt?: string;
}

interface MessageBubbleProps {
  msg: ChatMessage;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  // 날짜 구분선 (type === "date" 인 경우)
  if (msg.type === "date") {
    return (
      <div className="flex justify-center my-3">
        <span className="px-3 py-1 text-[10px] text-white/90 bg-black/10 rounded-full backdrop-blur-sm">
          {msg.content}
        </span>
      </div>
    );
  }

  // 예시: 'Me'라는 이름이나 특정 ID로 본인 확인 (여기서는 name='Me'로 가정)
  // 실제 사용 시에는 로그인한 유저 정보와 비교해야 합니다.
  const isMe = msg.name === 'Me' || msg.name === '나';

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // 시간이 있으면 쓰고, 없으면 현재 시간 포맷팅 (예시)
  const timeString = msg.time || formatTime(new Date().toISOString());

  return (
    <div className={`flex mb-3 items-start gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      
      {/* 상대방 프로필 이미지 */}
      {!isMe && (
        <div className="flex flex-col items-center mt-1">
          {msg.profileImg ? (
            <img src={msg.profileImg} alt={msg.name} className="w-[38px] h-[38px] rounded-[14px] object-cover shadow-sm" />
          ) : (
            <div className="w-[38px] h-[38px] rounded-[14px] bg-slate-200"></div>
          )}
        </div>
      )}

      <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* 상대방 이름 */}
        {!isMe && <span className="text-[11px] text-gray-600 mb-1 ml-1">{msg.name}</span>}

        <div className="flex items-end gap-1.5">
          {/* 내 메시지 시간 (왼쪽) */}
          {isMe && <span className="text-[9px] text-slate-500 min-w-max mb-0.5">{timeString}</span>}

          {/* 말풍선 */}
          {msg.type === "TEXT" && (
            <div 
              className={`
                px-3.5 py-2 text-[13px] leading-snug shadow-sm whitespace-pre-wrap break-words
                ${isMe 
                  ? 'bg-[#FEE500] text-black rounded-l-xl rounded-tr-sm rounded-br-xl' // 나: 노란색
                  : 'bg-white text-slate-900 rounded-r-xl rounded-tl-sm rounded-bl-xl' // 상대: 흰색
                }
              `}
            >
              {msg.content}
            </div>
          )}
          
          {/* 이미지 메시지 등 다른 타입 처리 (필요시 확장) */}
          {msg.type === "IMAGE" && (
             <div className="rounded-xl overflow-hidden shadow-sm border border-black/5 max-w-[200px]">
               {/* 이미지 렌더링 로직 추가 가능 */}
               <div className="bg-slate-200 w-[200px] h-[200px] flex items-center justify-center text-xs text-slate-500">이미지</div>
             </div>
          )}

          {/* 상대방 메시지 시간 (오른쪽) */}
          {!isMe && <span className="text-[9px] text-slate-500 min-w-max mb-0.5">{timeString}</span>}
        </div>
      </div>
    </div>
  );
}