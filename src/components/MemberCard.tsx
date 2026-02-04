import { Member } from '../types';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  // 1. 방어 코드
  if (!member.status || member.status === 'OFFLINE' || member.status === 'offline') return null;

  // 2. 플랫폼 구분 및 테마 설정
  const isXSpace = member.status === 'X_live';
  const badgeText = isXSpace ? "SPACE" : "LIVE";
  
  // 스페이스: 핑크/보라, 라이브: 민트/초록 (그라데이션 링)
  const ringGradient = isXSpace 
    ? 'from-pink-400 to-purple-400' 
    : 'from-emerald-400 to-teal-400';

  return (
    <a 
      href={member.liveUrl} 
      target="_blank" 
      rel="noreferrer" 
      // ✅ 제공해주신 SidebarMenuButton 스타일 적용
      // - h-auto py-3: 높이 자동, 패딩 넉넉하게
      // - rounded-2xl: 모서리 둥글게
      // - hover:scale-[1.01]: 살짝 커지는 효과
      className="
        group flex items-center gap-3 px-3 py-3 w-full
        rounded-2xl border border-transparent transition-all duration-300
        bg-white/50 hover:bg-white/90 hover:border-purple-100 hover:shadow-sm hover:scale-[1.02]
      "
    >
      {/* ✅ 프로필 이미지 영역 (아이콘 박스와 동일한 40px 규격) 
        - flex-shrink-0: 이미지 찌그러짐 방지
      */}
      <div 
        className={`
          relative flex items-center justify-center flex-shrink-0 
          w-[40px] h-[40px] rounded-full p-[2px] 
          bg-gradient-to-br ${ringGradient} 
          transition-transform duration-300 group-hover:scale-110
        `}
      >
        <img 
          src={member.profileImg} 
          alt={member.name} 
          className="w-full h-full rounded-full object-cover bg-white border-2 border-white" 
        />
        
        {/* 우측 하단 상태 점 (선택 사항) */}
        <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      
      {/* ✅ 텍스트 영역 
        - min-w-0: ★말줄임(truncate)이 작동하기 위한 필수 속성★ 
      */}
      <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold text-slate-700 truncate group-hover:text-slate-900 transition-colors">
            {member.name}
          </span>
          {/* LIVE 뱃지 */}
          <span className={`
            text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wider ml-1 flex-none
            ${isXSpace ? 'bg-pink-100 text-pink-600' : 'bg-red-100 text-red-600 animate-pulse'}
          `}>
            {badgeText}
          </span>
        </div>
        
        {/* 방송 제목 (최대 1줄) */}
        <p className="text-[11px] text-gray-400 mt-0.5 truncate group-hover:text-gray-500 transition-colors">
          {member.title || (isXSpace ? '스페이스 청취하기' : '방송 시청하기')}
        </p>
      </div>
    </a>
  );
}
