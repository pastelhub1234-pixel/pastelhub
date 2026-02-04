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
        rounded-2xl border border-transparent transition-all duration-300
        bg-white hover:bg-white hover:border-purple-100 hover:shadow-md hover:scale-[1.02]
        active:scale-[0.98]
      "
    >
      {/* ✅ 이미지 크기 축소: 40px -> 36px */}
      <div 
        className={`
          relative flex items-center justify-center flex-shrink-0 
          w-[36px] h-[36px] rounded-full p-[2px] 
          bg-gradient-to-br ${ringGradient} 
          transition-transform duration-300 group-hover:rotate-3
        `}
      >
        <img 
          src={member.profileImg} 
          alt={member.name} 
          className="w-full h-full rounded-full object-cover bg-white border-[1.5px] border-white" 
        />
        
        {/* 우측 하단 점도 비율에 맞춰 약간 축소 (size-3 -> size-2.5) */}
        <span className={`absolute bottom-0 right-0 size-2.5 border-2 border-white rounded-full ${isXSpace ? 'bg-purple-500' : 'bg-green-500'}`}></span>
      </div>
      
      <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-bold text-slate-700 truncate group-hover:text-slate-900 transition-colors">
            {member.name}
          </span>
          <span className={`
            text-[9px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wider ml-1 flex-none
            ${isXSpace ? 'bg-purple-50 text-purple-600' : 'bg-red-50 text-red-600 animate-pulse'}
          `}>
            {badgeText}
          </span>
        </div>
        
        <p className="text-[11px] text-gray-400 mt-0.5 truncate group-hover:text-gray-500 transition-colors font-medium">
          {member.title || (isXSpace ? '스페이스 청취하기' : '방송 시청하기')}
        </p>
      </div>
    </a>
  );
}
