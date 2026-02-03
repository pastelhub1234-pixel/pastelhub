import { Member } from '../types';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  // 1. 상태가 없거나 오프라인이면 렌더링하지 않음
  if (!member.status || member.status === 'OFFLINE') return null;

  // 2. 플랫폼 구분 (참고 코드 로직 반영: 'X_live' 체크)
  const isXSpace = member.status === 'X_live';
  const badgeText = isXSpace ? "SPACE" : "LIVE";

  // 3. 링 색상 설정 (참고 코드와 동일한 그라데이션)
  const ringStyle = isXSpace 
    ? { background: 'linear-gradient(to bottom right, #ec4899, #a855f7)' } // X: 핑크/퍼플
    : { background: 'linear-gradient(to bottom right, #00ffa3, #00c7a9)' }; // 치지직: 민트/초록

  // liveUrl이 없으면 # 처리 (안전장치 유지)
  const liveUrl = member.liveUrl || member.channelUrl || '#'; 

  return (
    <a 
      href={liveUrl} 
      target="_blank" 
      rel="noreferrer" 
      // 스타일 동기화: py-2, bg-white, shadow-sm 등 HomeSidebarContent와 동일하게 맞춤
      className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer group border bg-white shadow-sm border-purple-100 hover:shadow-md hover:border-purple-200"
    >
      {/* 이미지 크기 40px로 통일 & 도넛 모양 링 적용 */}
      <div 
        className="relative rounded-full flex items-center justify-center flex-shrink-0 p-[2px] transition-transform group-hover:scale-105"
        style={{ 
          width: '40px', 
          height: '40px', 
          minWidth: '40px', // flex 축소 방지
          ...ringStyle 
        }} 
      >
        <img 
          src={member.profileImg} 
          alt={member.name} 
          // 링과 이미지 사이 흰색 여백 유지
          className="w-full h-full rounded-full object-cover bg-white border-2 border-white" 
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          {/* 텍스트 색상 gray-900으로 변경 */}
          <span className="text-sm font-bold truncate text-gray-900">{member.name}</span>
          {/* LIVE 뱃지: ring 제거, 심플한 스타일 적용 */}
          <span className="text-[10px] font-extrabold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full animate-pulse tracking-tight flex-none ml-1">
            {badgeText}
          </span>
        </div>
        
        {/* 방송 제목: gray-400으로 변경 */}
        <p className="text-xs text-gray-400 truncate mt-0.5 group-hover:text-gray-500 transition-colors">
          {member.title || (isXSpace ? '스페이스 청취하기' : '방송 시청하기')}
        </p>
      </div>
    </a>
  );
}