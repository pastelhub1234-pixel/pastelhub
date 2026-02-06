import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useJsonData } from '../hooks/useJsonData';
import { Member } from '../types';

export function AppSidebar() {
  useLocation(); 
  const { data: members } = useJsonData<Member[]>('status');

  const liveMembers = useMemo(() => {
    return members?.filter(member =>
      member.status && member.status.toLowerCase().includes('live')
    ) || [];
  }, [members]);

  const formatTitle = (title: string) => {
    if (!title) return '';
    return title.length > 15 ? title.slice(0, 15) + '...' : title;
  };

  return (
    <div className="h-full flex flex-col">
      {/* ✅ [요청 수치 적용] 전체 리스트 여백: px-3 py-4 */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
        
        {liveMembers.length > 0 ? (
          liveMembers.map((member, idx) => {
            const isXSpace = member.status === 'X_live';
            const badgeText = isXSpace ? "SPACE" : "LIVE";
            
            const ringGradient = isXSpace 
              ? 'linear-gradient(to bottom right, #ec4899, #a855f7)' 
              : 'linear-gradient(to bottom right, #00ffa3, #00c7a9)';

            return (
              <a 
                key={`${member.name}-${idx}`}
                href={member.liveUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="
                  /* ✅ [요청 수치 적용] 
                     - flex items-center gap-3: 이미지와 텍스트 사이 12px
                     - px-3 py-2: 카드 내부 여백 (좌우 12px, 상하 8px)
                  */
                  flex items-center gap-3 px-3 py-2 rounded-xl 
                  bg-white border border-slate-100 shadow-sm 
                  transition-all duration-300 group
                  hover:shadow-md hover:border-purple-200
                "
              >
                {/* 프로필 이미지 (40px 고정) */}
                <div 
                  className="relative flex-none transition-transform duration-300 group-hover:scale-105" 
                  style={{ width: '40px', height: '40px', minWidth: '40px' }}
                >
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{ 
                      background: ringGradient,
                      padding: '2px'
                    }}
                  >
                    <img 
                      src={member.profileImg} 
                      alt={member.name} 
                      className="w-full h-full rounded-full object-cover bg-white block"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-bold text-slate-800 truncate">
                      {member.name}
                    </span>
                    
                    <span className={`
                      text-[10px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wide flex-none ml-1
                      ${isXSpace ? 'bg-purple-50 text-purple-600' : 'bg-red-50 text-red-600 animate-pulse'}
                    `}>
                      {badgeText}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors truncate">
                    {formatTitle(member.title || (isXSpace ? '스페이스 청취하기' : '방송 시청하기'))}
                  </p>
                </div>
              </a>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-24 bg-white/50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            <span>방송 중인 멤버가 없습니다</span>
          </div>
        )}
      </div>
    </div>
  );
}