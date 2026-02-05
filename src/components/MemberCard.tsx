import { Member } from '../types';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  if (!member.status || member.status === 'OFFLINE' || member.status === 'offline') return null;

  const isXSpace = member.status === 'X_live';
  const badgeText = isXSpace ? "SPACE" : "LIVE";
  
  const ringGradient = isXSpace 
    ? 'from-pink-400 to-purple-400' 
    : 'from-emerald-400 to-teal-400';

  return (
    <a 
      href={member.liveUrl} 
      target="_blank" 
      rel="noreferrer" 
      className="
        group flex items-center gap-3 px-3 py-2.5 w-full mb-2
        rounded-xl border border-purple-100 transition-all duration-300
        bg-white shadow-sm hover:shadow-md hover:border-purple-200
        cursor-pointer
      "
    >
      {/* ✅ 프로필 이미지 크기 확대: 40px -> 44px */}
      <div 
        className={`
          relative flex items-center justify-center flex-shrink-0 
          w-[44px] h-[44px] min-w-[44px] rounded-full p-[2px] 
          bg-gradient-to-br ${ringGradient} 
          transition-transform duration-300 group-hover:scale-105
        `}
      >
        <img 
          src={member.profileImg} 
          alt={member.name} 
          className="w-full h-full rounded-full object-cover bg-white border-2 border-white" 
        />
      </div>
      
      {/* 텍스트 영역 */}
      <div className="flex-1 min-w-0 flex flex-col justify-center h-[44px]"> {/* 높이 고정으로 정렬 유지 */}
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-bold truncate text-gray-900">
            {member.name}
          </span>
          {/* LIVE 뱃지 */}
          <span className="text-[10px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full animate-pulse tracking-tight flex-none ml-1">
            {badgeText}
          </span>
        </div>
        
        {/* ✅ 방송 제목: max-w 설정으로 글자 수 제한 효과 강화 */}
        <p className="text-xs text-gray-400 truncate group-hover:text-gray-500 transition-colors max-w-[130px]">
          {member.title || (isXSpace ? '스페이스 청취하기' : '방송 시청하기')}
        </p>
      </div>
    </a>
  );
}