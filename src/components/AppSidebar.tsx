import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useJsonData } from '../hooks/useJsonData';
import { Member } from '../types';

export function AppSidebar() {
  useLocation(); 
  const { data: members } = useJsonData<Member[]>('status');

  // 1. 방송 중인 사람만 필터링
  const liveMembers = useMemo(() => {
    return members?.filter(member =>
      member.status && member.status.toLowerCase().includes('live')
    ) || [];
  }, [members]);

  return (
    <div className="h-full flex flex-col">
      {/* ✅ 레퍼런스 레이아웃 적용 
         - px-3 py-4: 전체 여백 설정
         - space-y-2: 카드 간 간격 좁힘 (컴팩트함)
         - custom-scrollbar: 스크롤바 스타일 클래스 유지
      */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
        
        {/* 방송 없음 상태 */}
        {liveMembers.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-400">
            현재 방송 중인 멤버가 없습니다.
          </div>
        )}

        {liveMembers.map((member, idx) => {
          const isXSpace = member.status === 'X_live';
          const badgeText = isXSpace ? "SPACE" : "LIVE";
          
          // ✅ 링 색상 스타일 (그라데이션)
          const ringStyle = isXSpace 
            ? { background: 'linear-gradient(to bottom right, #ec4899, #a855f7)' } // X: 핑크/퍼플
            : { background: 'linear-gradient(to bottom right, #00ffa3, #00c7a9)' }; // 치지직: 민트/초록

          return (
            <a 
              key={`${member.name}-${idx}`}
              href={member.liveUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="
                flex items-center gap-3 px-3 py-2 rounded-xl 
                bg-white border border-purple-100 shadow-sm 
                transition-all duration-300 cursor-pointer group
                hover:shadow-md hover:border-purple-200
              "
            >
              {/* ✅ 프로필 이미지 영역
                  - group-hover:scale-105: 마우스 올리면 살짝 커지는 효과
                  - p-[2px]: 링 두께
              */}
              <div 
                className="relative rounded-full flex items-center justify-center flex-shrink-0 p-[2px] transition-transform group-hover:scale-105"
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  minWidth: '40px',
                  ...ringStyle // 그라데이션 적용
                }} 
              >
                <img 
                  src={member.profileImg} 
                  alt={member.name} 
                  // border-2 border-white: 링과 이미지 사이 흰색 구분선 (레퍼런스 코드 반영)
                  className="w-full h-full rounded-full object-cover bg-white border-2 border-white" 
                />
              </div>
              
              {/* 텍스트 영역 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold truncate text-gray-900">
                    {member.name}
                  </span>
                  
                  {/* 뱃지 스타일 */}
                  <span className="text-[10px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full animate-pulse tracking-tight flex-none ml-1">
                    {badgeText}
                  </span>
                </div>
                
                {/* 방송 제목 */}
                <p className="text-xs text-gray-400 truncate mt-0.5 group-hover:text-gray-500 transition-colors">
                  {member.title || (isXSpace ? '스페이스 청취하기' : '방송 시청하기')}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
