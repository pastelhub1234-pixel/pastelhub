import { useMemo } from 'react';
import { Radio, Mic, Tv, Calendar, Moon, Loader2, ChevronRight } from "lucide-react";
import { useJsonData } from '../hooks/useJsonData';
import { BroadcastItem } from '../types';

type ViewStatus = 'chzzk' | 'space' | 'scheduled' | 'off';

const STATUS_CONFIG = {
  chzzk: {
    ringGradient: 'linear-gradient(to bottom right, #00ffa3, #00c7a9)',
    bgStyle: 'bg-emerald-50/30 border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-600',
    dotColor: 'bg-[#00ffa3]',
    icon: <Tv className="w-3 h-3 mr-1" />,
    label: 'CHZZK',
  },
  space: {
    ringGradient: 'linear-gradient(to bottom right, #ec4899, #a855f7)',
    bgStyle: 'bg-purple-50/30 border-purple-100',
    badge: 'bg-purple-100 text-purple-600',
    dotColor: 'bg-purple-500',
    icon: <Mic className="w-3 h-3 mr-1" />,
    label: 'SPACE',
  },
  scheduled: {
    ringGradient: 'linear-gradient(to bottom right, #fbbf24, #f59e0b)',
    bgStyle: 'bg-amber-50/10 border-amber-50',
    badge: 'bg-amber-100 text-amber-600',
    dotColor: 'bg-amber-400',
    icon: <Calendar className="w-3 h-3 mr-1" />,
    label: '방송예정',
  },
  off: {
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
      
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-50/50">
        <div className="flex items-center gap-2">
           <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 animate-pulse" />
           <h3 className="text-gray-800 font-bold text-base sm:text-lg">방송 현황</h3>
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4 space-y-2 custom-scrollbar">
        {sortedList.map((item, idx) => {
          const statusType = getViewStatus(item.status, item.title);
          const config = STATUS_CONFIG[statusType];
          const isOff = statusType === 'off';
          const Component = isOff ? 'div' : 'a';
          
          // ✅ 방송 중(Live)인지 체크: Scheduled, Off 제외
          const isLive = statusType === 'chzzk' || statusType === 'space';

          return (
            <Component
              key={`${item.name}-${idx}`}
              href={!isOff ? item.liveUrl : undefined}
              target={!isOff ? "_blank" : undefined}
              rel={!isOff ? "noreferrer" : undefined}
              className={`
                group relative flex items-center justify-between 
                p-2 sm:p-3 rounded-xl border transition-all duration-200
                ${config.bgStyle}
                ${!isOff ? 'hover:shadow-md cursor-pointer hover:bg-white' : 'cursor-default'}
              `}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                
                {/* 1. 프로필 이미지 Wrapper */}
                <div className="relative flex-none w-10 h-10 sm:w-12 sm:h-12">
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center p-[2px] transition-transform duration-300 group-hover:scale-105"
                    style={{ background: config.ringGradient }}
                  >
                    <img 
                      src={item.profileImg} 
                      alt={item.name} 
                      className={`w-full h-full rounded-full object-cover bg-white block border-[1.5px] border-white ${isOff ? 'grayscale' : ''}`}
                    />
                  </div>
                  
                  {/* ✅ 2. 상태 표시 점 (Live일 때만 노출) 
                     - translate 제거하여 위치를 안쪽으로 당김
                     - border-white를 사용하여 프로필과 경계 구분
                  */}
                  {isLive && (
                    <div className="absolute bottom-0 right-0 z-10">
                       {/* Pulse 애니메이션 */}
                       <span 
                         className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${config.dotColor}`} 
                       ></span>
                       {/* 실제 점 */}
                       <span 
                         className={`relative inline-flex rounded-full border-2 border-white ${config.dotColor}`}
                         // 점 크기: 모바일(10px), PC(12px) - 살짝 작게 조정하여 밀착감 향상
                         style={{ width: '10px', height: '10px' }}
                         // PC에서는 점 크기를 CSS 클래스로 조금 키워도 됨 (선택사항)
                         // className 내부에 sm:w-3 sm:h-3 등을 추가하여 반응형 처리 가능
                       ></span>
                    </div>
                  )}
                </div>

                {/* 3. 텍스트 정보 */}
                <div className="flex flex-col min-w-0 pr-1 gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm sm:text-base font-bold truncate ${isOff ? 'text-gray-500' : 'text-gray-800'}`}>
                      {item.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold flex items-center flex-shrink-0 ${config.badge}`}>
                      {config.icon} {config.label}
                    </span>
                  </div>
                  <p className={`text-xs truncate w-full ${isOff ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.title || (isOff ? '' : '제목 없음')}
                  </p>
                </div>
              </div>

              {/* 우측 화살표 */}
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
