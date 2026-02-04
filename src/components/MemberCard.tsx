import { Member } from '../types';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  // 방어 코드
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
      {/* ✅ [문제 해결 포인트]
        1. flex-none: Flexbox 안에서 크기가 변하는 것을 막습니다.
        2. min-w-[36px]: 최소 너비를 강제하여 찌그러짐을 방지합니다.
        3. w-[36px] h-[36px]: 고정 크기를 지정합니다.
      */}
      <div 
        className={`
          flex-none relative flex items-center justify-center 
          w-[36px] h-[36px] min-w-[36px] rounded-full p-[2px] 
          bg-gradient-to-br ${ringGradient} 
          transition-transform duration-300 group-hover:rotate-3
        `}
      >
        <img 
          src={member.profileImg} 
          alt={member.name} 
          className="w-full h-full rounded-full object-cover bg-white border-[1.5px] border-white" 
        />
        
        {/* 상태 점 */}
        <span className={`absolute bottom-0 right-0 size-2.5 border-2 border-white rounded-full ${isXSpace ? 'bg-purple-500' : 'bg-green-500'}`}></span>
      </div>
      
      {/* 텍스트 영역 */}
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
