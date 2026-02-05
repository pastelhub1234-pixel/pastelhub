import { Radio } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
import { Member } from '../types';

export default function Home() {
  const { data: members } = useJsonData<Member[]>('status');

  const liveMembers = members?.filter(
    (member) => member.status && member.status.toLowerCase().includes('live')
  ) || [];

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-500">
      
      {/* 1. Welcome Section (로고 삭제됨) */}
      <div className="text-center space-y-4">
        {/* ✅ [수정] 로고 삭제, 텍스트만 깔끔하게 유지 */}
        <p className="text-slate-600 text-lg md:text-xl font-medium">
          팬덤을 위한 모든 정보가 한곳에 ✨
        </p>
        <p className="text-slate-400 text-sm md:text-base">
          상단 메뉴나 사이드바를 통해 원하는 정보를 확인하세요.
        </p>
      </div>

      {/* 2. Mobile Live Section */}
      {/* ✅ [수정] md:hidden -> 768px 미만(모바일)에서만 보임. 
          (노트북에선 사이드바가 보이니까 이건 숨김) */}
      <div className="w-full max-w-md md:hidden px-4">
        {liveMembers.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Live Now
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {liveMembers.map((member, idx) => {
                const isXSpace = member.status === 'X_live';
                const badgeText = isXSpace ? "SPACE" : "LIVE";
                const ringGradient = isXSpace ? 'from-pink-400 to-purple-400' : 'from-emerald-400 to-teal-400';

                return (
                  <a 
                    key={`${member.name}-${idx}`}
                    href={member.liveUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white shadow-sm border border-slate-100 active:scale-[0.98] transition-all"
                  >
                    <div className={`relative flex-none w-[44px] h-[44px] rounded-full p-[2px] bg-gradient-to-br ${ringGradient}`}>
                      <img src={member.profileImg} alt={member.name} className="w-full h-full rounded-full object-cover bg-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-800 truncate">{member.name}</span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${isXSpace ? 'bg-purple-50 text-purple-600' : 'bg-red-50 text-red-600 animate-pulse'}`}>
                          {badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {member.title || (isXSpace ? '스페이스 청취하기' : '방송 시청하기')}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 space-y-2 opacity-70">
            <Radio className="size-6 mb-1" />
            <span className="text-xs">현재 방송 중인 멤버가 없습니다</span>
          </div>
        )}
      </div>
    </div>
  );
}
