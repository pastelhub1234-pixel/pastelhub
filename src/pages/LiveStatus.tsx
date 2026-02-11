import { useMemo } from 'react';
import { Radio, Mic, Tv, Calendar, Moon, Loader2, ChevronRight } from "lucide-react";
import { useJsonData } from '../hooks/useJsonData';
import { BroadcastItem } from '../types';

type ViewStatus = 'chzzk' | 'space' | 'scheduled' | 'off';

const STATUS_CONFIG = {
  chzzk: {
    // 치지직: 네온 그린
    ringGradient: 'linear-gradient(to bottom right, #00ffa3, #00c7a9)',
    bgStyle: 'bg-emerald-50/30 border-emerald-100', // 카드 배경 (연하게)
    badge: 'bg-emerald-100 text-emerald-600',
    dotColor: 'bg-[#00ffa3]', // 확실한 네온 컬러
    icon: <Tv className="w-3 h-3 mr-1" />,
    label: 'CHZZK',
  },
  space: {
    // 스페이스: 보라
    ringGradient: 'linear-gradient(to bottom right, #ec4899, #a855f7)',
    bgStyle: 'bg-purple-50/30 border-purple-100',
    badge: 'bg-purple-100 text-purple-600',
    dotColor: 'bg-purple-500',
    icon: <Mic className="w-3 h-3 mr-1" />,
    label: 'SPACE',
  },
  scheduled: {
    // 방송예정: 노랑
    ringGradient: 'linear-gradient(to bottom right, #fbbf24, #f59e0b)',
    bgStyle: 'bg-amber-50/10 border-amber-50',
    badge: 'bg-amber-100 text-amber-600',
    dotColor: 'bg-amber-400',
    icon: <Calendar className="w-3 h-3 mr-1" />,
    label: '방송예정',
  },
  off: {
    // 휴방: 회색
    ringGradient: 'linear-gradient(to bottom right, #e2e8f0, #cbd5e1)',
    bgStyle: 'bg-white/50 border-transparent opacity-60',
    badge: 'bg-gray-100 text-gray-400',
    dotColor: 'bg-gray-300',
    icon: <Moon className="w-3 h-3 mr-1" />,
    label: 'OFF',
  },
} as const;

const getViewStatus = (status: string, title: string): ViewStatus => {
  if (status === 'chzzk_live') return 'chzzk';
  if (status === 'X_live') return 'space';
  if (status === 'offline' && title.includes('예정')) return 'scheduled';
  return 'off';
};

export default function LiveStatus() {
  const { data: statusList, loading } = useJsonData<BroadcastItem[]>('status');

  const sortedList = useMemo(() => {
    if (!statusList) return [];
    return [...statusList].sort((a, b) => {
      const getScore = (item: BroadcastItem) => {
        const viewStatus = getViewStatus(item.status, item.title);
        if (viewStatus === 'chzzk' || viewStatus === 'space') return 2;
        if (viewStatus === 'scheduled') return 1;
        return 0;
      };
      return getScore(b) - getScore(a);
    });
  }, [statusList]);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/60 min-h-[150px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        <span className="text-gray-400 text-xs">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 h-full flex flex-col overflow-hidden">
      
      {/* 헤더: ON AIR 제거, 심플하게 유지 */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-50/50">
        <div className="flex items-center gap-2">
           {/* 모바일에서는 아이콘 크기 약간 조절 */}
           <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 animate-pulse" />
           <h3 className="text-gray-800 font-bold text-base sm:text-lg">방송 현황</h3>
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 space-y-2 custom-scrollbar">
        {sortedList.map((item, idx) => {
          const statusType = getViewStatus(item.status, item.title);
          const config = STATUS_CONFIG[statusType];
          const isOff = statusType === 'off';
          const Component = isOff ? 'div' : 'a';

          // Live 상태 여부 (Pulse 애니메이션용)
          const isLive = statusType === 'chzzk' || statusType === 'space';

          return (
            <Component
              key={`${item.name}-${idx}`}
              href={!isOff ? item.liveUrl : undefined}
              target={!isOff ? "_blank" : undefined}
              rel={!isOff ? "noreferrer" : undefined}
              className={`
                group relative flex items-center justify-between 
                /* 모바일 패딩(p-2.5) vs PC 패딩(p-3) */
                p-2.5 sm:p-3 rounded-xl border transition-all duration-200
                ${config.bgStyle}
                ${!isOff ? 'hover:shadow-md cursor-pointer hover:bg-white' : 'cursor-default'}
              `}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                
                {/* 1. 프로필 이미지 Wrapper (Gradient Ring) */}
                <div 
                  className="relative flex-none"
                  // 모바일(w-10) vs PC(w-12) 크기 반응형
                  style={{ width: 'auto', height: 'auto' }} 
                >
                  {/* 링(Ring) 그라데이션 - Hover 여부 상관없이 항상 보임 */}
                  <div 
                    className="rounded-full flex items-center justify-center p-[2px] shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ background: config.ringGradient }}
                  >
                    <img 
                      src={item.profileImg} 
                      alt={item.name} 
                      // 모바일: w-10 h-10 (40px), PC: w-11 h-11 (44px)
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white bg-white block ${isOff ? 'grayscale' : ''}`}
                    />
                  </div>
                  
                  {/* 2. 상태 표시 점 (Live Pulse) - 우측 하단 고정 */}
                  {!isOff && (
                    <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1">
                      {isLive && (
                         // Pulse 애니메이션 (뒤에서 퍼지는 효과)
                         <span 
                           className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${config.dotColor}`} 
                           style={{ width: '100%', height: '100%' }}
                         ></span>
                      )}
                      {/* 실제 보이는 점 */}
                      <span 
                        className={`relative inline-flex rounded-full border-2 border-white ${config.dotColor}`}
                        // 점 크기: 모바일(w-3 h-3) vs PC(w-3.5 h-3.5)
                        style={{ width: '12px', height: '12px' }}
                      ></span>
                    </div>
                  )}
                </div>

                {/* 3. 텍스트 정보 */}
                <div className="flex flex-col min-w-0 pr-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-bold truncate ${isOff ? 'text-gray-500' : 'text-gray-800'}`}>
                      {item.name}
                    </span>
                    {/* 상태 뱃지 */}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center flex-shrink-0 ${config.badge}`}>
                      {config.icon} {config.label}
                    </span>
                  </div>
                  {/* 제목 (모바일 1줄, PC도 1줄이지만 너비 차이) */}
                  <p className={`text-xs truncate w-full ${isOff ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.title || (isOff ? '' : '제목 없음')}
                  </p>
                </div>
              </div>

              {/* 우측 화살표 (이동 가능 시) */}
              {!isOff && (
                <div className="pl-1 text-gray-300 group-hover:text-purple-400 transition-colors flex-shrink-0">
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              )}
            </Component>
          );
        })}
      </div>
    </div>
  );
}
