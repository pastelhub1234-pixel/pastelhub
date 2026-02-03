import { useState, useMemo } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { TIMELINE_MESSAGES } from '../constants';
import { ChatRoom, TimelineMessage } from '../types';

function formatTimeAgo(timestamp: string): string {
  const now = new Date('2026-02-03T15:00:00');
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return past.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export default function Timeline() {
  // 멤버별로 메시지 그룹화하여 채팅방 생성
  const chatRooms: ChatRoom[] = useMemo(() => {
    const grouped = TIMELINE_MESSAGES.reduce((acc, msg) => {
      if (!acc[msg.name]) {
        acc[msg.name] = {
          id: msg.name,
          name: msg.name,
          profileImg: msg.profileImg,
          messages: [],
        };
      }
      acc[msg.name].messages.push(msg);
      return acc;
    }, {} as Record<string, ChatRoom>);

    // 시간순 정렬
    Object.values(grouped).forEach(room => {
      room.messages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    });

    return Object.values(grouped);
  }, []);

  const [selectedRoomId, setSelectedRoomId] = useState(chatRooms[0]?.id || '');
  const selectedChat = chatRooms.find(chat => chat.id === selectedRoomId);

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col md:flex-row gap-0 -m-6">
      {/* 왼쪽: 채팅방 리스트 (모바일에서는 상단) */}
      <div className="md:w-80 flex-shrink-0 bg-white/60 backdrop-blur-sm border-b md:border-r border-slate-200 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 bg-white/80">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <MessageCircle className="size-5 text-purple-500" />
            멤버 채팅
          </h2>
        </div>
        
        <div className="divide-y divide-slate-100">
          {chatRooms.map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const isSelected = chat.id === selectedRoomId;
            
            return (
              <button
                key={chat.id}
                onClick={() => setSelectedRoomId(chat.id)}
                className={`w-full p-4 flex items-center gap-3 transition-colors hover:bg-white/80
                  ${isSelected ? 'bg-purple-50 border-l-4 border-purple-500' : ''}`}
              >
                <img
                  src={chat.profileImg}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-800 truncate">{chat.name}</h3>
                    {lastMessage && (
                      <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                        {formatTimeAgo(lastMessage.time)}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="text-sm text-slate-600 truncate">
                      {lastMessage.content}
                    </p>
                  )}
                  {chat.messages.length > 0 && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {chat.messages.length}개의 메시지
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 오른쪽: 채팅 내용 */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-50/30 to-pink-50/30">
        {selectedChat ? (
          <>
            {/* 채팅방 헤더 */}
            <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center gap-3">
              <img
                src={selectedChat.profileImg}
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-slate-800">{selectedChat.name}</h3>
                <p className="text-xs text-slate-500">{selectedChat.messages.length}개의 메시지</p>
              </div>
            </div>

            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((message, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <img
                      src={message.profileImg}
                      alt={message.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 max-w-[70%]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-800">
                          {message.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatTimeAgo(message.time)}
                        </span>
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none shadow-sm p-3">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <MessageCircle className="size-12 mb-2" />
                  <p>아직 메시지가 없습니다</p>
                </div>
              )}
            </div>

            {/* 입력창 (읽기 전용 표시) */}
            <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-slate-200">
              <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-3">
                <input
                  type="text"
                  placeholder="메시지를 보낼 수 없습니다 (읽기 전용)"
                  disabled
                  className="flex-1 bg-transparent text-sm text-slate-600 outline-none"
                />
                <Send className="size-5 text-slate-400" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <MessageCircle className="size-16 mb-4" />
            <p>채팅방을 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
