import { Member } from '../types';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  // 방어 코드: 상태가 없거나 오프라인이면 렌더링하지 않음
  if (!member.status || member.status === 'OFFLINE' || member.status === 'offline') return null;

  const isXSpace = member.status === 'X_live';
  const badgeText = isXSpace ? "SPACE" : "LIVE";
  
  // 링 그라데이션 설정: 스페이스는 핑크/퍼플, 라이브는 민트/초록
  const ringGradient = isXSpace 
    ? 'from-pink-400 to-purple-400' 
    : 'from-emerald-400 to-teal-400';

  return (
    <a 
      href={member.liveUrl} 
      target="_blank" 
      rel="noreferrer" 
      // ✅ 카드 스타일 강화: bg-white, shadow-sm, border 추가 및 호버 효과 정의
      className="
        group flex items-center gap-2.5 px-2.5 py-2 w-full mb-1.5
        rounded-xl transition-all duration-200 cursor-pointer
        bg-white shadow-sm border border-purple-100/50
        hover:shadow-md hover:border-purple-200 hover:bg-purple-50/30
        active:scale-[0.98]
      "
    >
      {/* ✅ 이미지와 링 사이 틈 없애기: 패딩 제거 및 이미지 자체 테두리 적용 */}
      <div 
        className={`
          flex-none relative flex items-center justify-center 
          w-[32px] h-[32px] min-w-[32px] rounded-full 
          bg-gradient-to-br ${ringGradient} 
          transition-transform duration-300 group-hover:rotate-3
        `}
      >
        {/* 이미지 자체에 흰색 테두리를 주어 그라데이션 링 안에 꽉 차게 만듦 */}
        <img 
          src={member.profileImg} 
          alt={member.name} 
          className="w-full h-full rounded-full object-cover border-[1.5px] border-white" 
        />
        
        {/* 상태 점: 우측 하단에 위치 */}
        <span className={`absolute bottom-0 right-0 size-2 border-[1.5px] border-white rounded-full ${isXSpace ? 'bg-purple-500' : 'bg-green-500'}`}></span>
      </div>
      
      <div className="flex flex-col justify-center flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between w-full">
          {/* 이름 폰트 text-xs로 설정 */}
          <span className="text-xs font-bold text-slate-700 truncate group-hover:text-slate-900 transition-colors">
            {member.name}
          </span>
          {/* LIVE/SPACE 뱃지 */}
          <span className={`
            text-[8px] font-extrabold px-1 py-[1px] rounded-[4px] tracking-wide ml-1 flex-none
            ${isXSpace ? 'bg-purple-50 text-purple-600' : 'bg-red-50 text-red-600 animate-pulse'}
          `}>
            {badgeText}
          </span>
        </div>
        
        {/* 방송 제목: 말줄임 처리 및 폰트 크기 조정 */}
        <p className="text-[10px] text-gray-400 mt-0.5 truncate group-hover:text-gray-500 transition-colors font-medium">
          {member.title || (isXSpace ? '스페이스 청취하기' : '방송 시청하기')}
        </p>
      </div>
    </a>
  );
}