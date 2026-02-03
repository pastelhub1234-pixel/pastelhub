interface ChatMessage {
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
  if (msg.type === "date") {
    return (
      <div className="flex justify-center my-4">
        <span className="px-3 py-1 text-xs text-gray-700 bg-gray-300/50 rounded-full">
          {msg.content}
        </span>
      </div>
    );
  }

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
      <div className="w-10 h-10 rounded-xl overflow-hidden mr-3 shrink-0 bg-gray-200">
        {msg.profileImg ? (
          <img src={msg.profileImg} alt={msg.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-purple-200"></div>
        )}
      </div>

      <div className="flex flex-col max-w-[75%]">
        <span className="text-xs text-gray-700 mb-1 font-medium">{msg.name}</span>

        {msg.type === "TEXT" && (
          <div className="bg-white px-4 py-2.5 rounded-2xl text-[15px] leading-snug shadow-sm whitespace-pre-wrap">
            {msg.content}
          </div>
        )}

        {msg.type === "IMAGE" && (
          <div className="bg-white p-2 rounded-2xl shadow-sm">
            <img src={msg.content} alt="전송된 이미지" className="rounded-lg max-w-full h-auto" />
          </div>
        )}

        <span className="text-[11px] text-gray-500 mt-1 ml-1">
          {formatTime(msg.time)}
        </span>
      </div>
    </div>
  );
}