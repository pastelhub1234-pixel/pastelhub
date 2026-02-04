import { Member } from '../types';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  if (!member.status || member.status === 'OFFLINE' || member.status === 'offline') return null;

  const isXSpace = member.status === 'X_live';
  const badgeText = isXSpace ? "SPACE" : "LIVE";
  
  const ringStyle = isXSpace 
    ? { background: 'linear-gradient(to bottom right, #ec4899, #a855f7)' } 
    : { background: 'linear-gradient(to bottom right, #00ffa3, #00c7a9)' };

  return (
    <a 
      href={member.liveUrl} 
      target="_blank" 
      rel="noreferrer" 
      className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer group border bg-white shadow-sm border-purple-100 hover:shadow-md hover:border-purple-200"
    >
      {/* 프로필 이미지 (40px 고정) */}
      <div 
        className="relative rounded-full flex items-center justify-center flex-shrink-0 p-[2px] transition-transform group-hover:scale-105"
        style={{ width: '40px', height: '40px', minWidth: '40px', ...ringStyle }} 
      >
        <img 
          src={member.profileImg} 
          alt={member.name} 
          className="w-full h-full rounded-full object-cover bg-white border-2 border-white" 
        />
      </div>
      
      {/* 텍스트 정보 영역 */}
      {/* ✅ min-w-0: 이게 있어야 내부 truncate가 작동합니다! 필수! */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold truncate text-gray-900">{member.name}</span>
          {/* LIVE 뱃지 */}
          <span className="text-[10px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full animate-pulse tracking-tight flex-none ml-1">
            {badgeText}
          </span>
        </div>
        
        {/* ✅ 제목 말줄임 처리 (truncate) */}
        <p className="text-xs text-gray-400 truncate mt-0.5 group-hover:text-gray-500 transition-colors">
          {member.title || (isXSpace ? '스페이스 청취하기' : '방송 시청하기')}
        </p>
      </div>
    </a>
  );
}