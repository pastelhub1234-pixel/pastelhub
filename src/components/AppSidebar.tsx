import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Radio } from 'lucide-react';
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

  return (
    <div className="h-full flex flex-col">
      {/* 1. 헤더 */}
      <div className="flex items-center justify-between mb-4 px-1 flex-none">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Live Now
        </h2>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </div>

      {/* 2. 멤버 리스트 */}
      <div className="flex-1 overflow-y-auto space-y-2 pb-10 pr-2 no-scrollbar">
        {liveMembers.length > 0 ? (
          liveMembers.map((member, idx) => {
            const isXSpace = member.status === 'X_live';
            const badgeText = isXSpace ? "SPACE" : "LIVE";
            
            const ringGradient = isXSpace 
              ? 'from-pink-400 to-purple-400' 
              : 'from-emerald-400 to-teal-400';

            return (
              <a 
                key={`${member.name}-${idx}`}
                href={member.liveUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="
                  flex items-center gap-3 px-3 py-2 rounded-xl 
                  bg-white border border-purple-100 shadow-sm 
                  transition-all duration-300 group
                  hover:shadow-md hover:border-purple-200 hover:-translate-y-0.5
                "
              >
                {/* 프로필 이미지 (40px 고정, 링 채움) */}
                <div className="relative flex-none">
                  <div 
                    className={`
                      w-[40px] h-[40px] rounded-full p-[2px] 
                      bg-gradient-to-br ${ringGradient}
                    `}
                  >
                    <img 
                      src={member.profileImg} 
                      alt={member.name} 
                      className="w-full h-full rounded-full object-cover bg-white"
                    />
                  </div>
                </div>

                {/* 텍스트 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-bold text-slate-800 truncate">
                      {member.name}
                    </span>
                    
                    <span className={`
                      text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tracking-wide flex-none ml-1
                      ${isXSpace ? 'bg-purple-50 text-purple-600' : 'bg-red-50 text-red-600 animate-pulse'}
                    `}>
                      {badgeText}
                    </span>
                  </div>

                  {/* ✅ [수정 완료] JS 대신 CSS truncate 사용 */}
                  <p className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors truncate">
                    {member.title || (isXSpace ? '스페이스 청취하기' : '방송 시청하기')}
                  </p>
                </div>
              </a>
            );
          })
        ) : (
          /* 방송 없음 */
          <div className="flex flex-col items-center justify-center h-20 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            <span>방송 중인 멤버가 없습니다</span>
          </div>
        )}
      </div>
    </div>
  );
}
