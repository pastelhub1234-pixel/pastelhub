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
    return title.length > 18 ? title.slice(0, 18) + '...' : title;
  };

  return (
    <div className="h-full flex flex-col pt-2">
      <div className="flex-1 space-y-3 pb-10 pr-2">
        {liveMembers.length > 0 ? (
          liveMembers.map((member, idx) => {
            const isXSpace = member.status === 'X_live';
            const badgeText = isXSpace ? "SPACE" : "LIVE";
            
            // 링 색상 스타일
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
                  flex items-center gap-3 px-3 py-2.5 rounded-xl 
                  bg-white border border-slate-100 shadow-sm 
                  transition-all duration-300 group
                  hover:shadow-md hover:border-purple-100 hover:-translate-y-0.5
                "
              >
                {/* ✅ [수정] 크기 강제 고정 (Inline Style 사용) */}
                {/* min-width를 줘서 절대 찌그러지거나 커지지 않음 */}
                <div 
                  className="relative flex-none" 
                  style={{ width: '42px', height: '42px', minWidth: '42px' }}
                >
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{ 
                      background: ringGradient,
                      padding: '2px' // 이 패딩값이 링의 두께가 됩니다.
                    }}
                  >
                    {/* ✅ [수정] border-white 제거 -> 링과 이미지가 딱 붙음 */}
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
                      text-[10px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wide flex-none ml-2
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