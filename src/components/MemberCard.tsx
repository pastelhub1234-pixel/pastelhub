import { Member } from '../types';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  // 1. 방어 코드
  if (!member.status || member.status === 'OFFLINE' || member.status === 'offline') return null;

  // 2. 플랫폼 구분
  const isXSpace = member.status === 'X_live';
  const badgeText = isXSpace ? "SPACE" : "LIVE";
  
  // 3. 링 색상 설정 (Inline Style 방식 - 가장 확실하게 적용됨)
  const ringStyle = isXSpace 
    ? { background: 'linear-gradient(to bottom right, #ec4899, #a855f7)' } // 핑크/퍼플
    : { background: 'linear-gradient(to bottom right, #00ffa3, #00c7a9)' }; // 민트/초록

  return (
    <a 
      href={member.liveUrl} 
      target="_blank" 
      rel="noreferrer" 
      className="
        group flex items-center gap-3 px-3 py-2 w-full mb-2
        rounded-xl border border-purple-100 transition-all duration-300
        bg-white shadow-sm hover:shadow-md hover:border-purple-200
        cursor-pointer
      "
    >
      {/* ✅ 핵심 수정: 
        1. flex-shrink-0: 절대 찌그러지지 않게 함
        2. style={{ width, height, minWidth }}: 크기를 강력하게 고정
      */}
      <div 
        className="relative rounded-full flex items-center justify-center flex-shrink-0 p-[2px] transition-transform group-hover:scale-105"
        style={{ 
          width: '40px', 
          height: '40px', 
          minWidth: '40px', // 공간이 좁아져도 절대 줄어들지 않음
          ...ringStyle 
        }} 
      >
        <img 
          src={member.profileImg} 
          alt={member.name} 
          className="w-full h-full rounded-full object-cover bg-white border-2 border-white" 
        />
      </div>
      
      {/* 텍스트 영역 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold truncate text-gray-900">
            {member.name}
          </span>
          {/* LIVE 뱃지 */}
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
}
