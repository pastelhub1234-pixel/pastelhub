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

  // ✅ 제목 글자수 자르기 (혹시 CSS truncate가 안 먹힐 때를 대비한 안전장치)
  const formatTitle = (title: string) => {
    if (!title) return '';
    return title.length > 20 ? title.slice(0, 20) + '...' : title;
  };

  return (
    <div className="h-full flex flex-col pt-2">
      {/* ❌ [삭제됨] Live Now 헤더 및 빨간점 제거 
         요청하신 대로 바로 리스트가 나옵니다.
      */}

      <div className="flex-1 space-y-3 pb-10 pr-2">
        {liveMembers.length > 0 ? (
          liveMembers.map((member, idx) => {
            const isXSpace = member.status === 'X_live';
            const badgeText = isXSpace ? "SPACE" : "LIVE";
            
            // ✅ [수정] 링 색상 설정 (Inline Style 사용)
            // Tailwind 클래스 인식이 안 될 경우를 대비해 직접 스타일 주입
            const ringStyle = isXSpace 
             ? { background: 'linear-gradient(to bottom right, #ec4899, #a855f7)' } // 핑크/퍼플
             : { background: 'linear-gradient(to bottom right, #00ffa3, #00c7a9)' }; // 민트/초록

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
                {/* ✅ [수정] 프로필 이미지 & 링 
                    - w-[42px] h-[42px]: 크기 고정
                    - p-[2px]: 링 두께
                    - flex-none: 찌그러짐 방지
                */}
                <div className="relative flex-none">
                  <div 
                    className="w-[42px] h-[42px] rounded-full p-[2px]"
                    style={ringStyle} // 👈 여기서 스타일 직접 적용
                  >
                    <img 
                      src={member.profileImg} 
                      alt={member.name} 
                      className="w-full h-full rounded-full object-cover bg-white border-2 border-white"
                    />
                  </div>
                </div>

                {/* 텍스트 정보 */}
                {/* min-w-0: Flex 자식요소가 부모보다 커지는 것을 방지 (Truncate 필수조건) */}
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

                  {/* 방송 제목 */}
                  <p className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors truncate">
                    {/* CSS truncate와 JS 자르기를 이중으로 적용 */}
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