import { useMemo } from 'react';
import { Radio, Mic, Tv, Calendar, Moon, Loader2, ChevronRight } from "lucide-react";
import { useJsonData } from '../hooks/useJsonData';
import { BroadcastItem } from '../types';

type ViewStatus = 'chzzk' | 'space' | 'scheduled' | 'off';

const STATUS_CONFIG = {
  chzzk: {
    ringGradient: 'linear-gradient(to bottom right, #00ffa3, #00c7a9)', 
    wrapper: 'bg-white hover:bg-emerald-50/50 hover:border-emerald-200 border-transparent',
    badge: 'bg-emerald-50 text-emerald-600',
    icon: <Tv className="w-3 h-3 mr-1" />,
    label: 'CHZZK',
  },
  space: {
    ringGradient: 'linear-gradient(to bottom right, #ec4899, #a855f7)',
    wrapper: 'bg-white hover:bg-purple-50/50 hover:border-purple-200 border-transparent',
    badge: 'bg-purple-50 text-purple-600',
    icon: <Mic className="w-3 h-3 mr-1" />,
    label: 'SPACE',
  },
  scheduled: {
    ringGradient: 'linear-gradient(to bottom right, #fbbf24, #f59e0b)',
    wrapper: 'bg-white hover:bg-amber-50/50 hover:border-amber-200 border-transparent',
    badge: 'bg-amber-50 text-amber-600',
    icon: <Calendar className="w-3 h-3 mr-1" />,
    label: '방송예정',
  },
  off: {
    ringGradient: 'linear-gradient(to bottom right, #e2e8f0, #cbd5e1)',
    wrapper: 'bg-white opacity-60 hover:opacity-100 border-transparent',
    badge: 'bg-gray-100 text-gray-400',
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
      
      {/* ✅ 헤더 패딩 증가: px-6 py-5 (벽과 간격 확보) */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50/50">
        <h3 className="text-gray-800 font-bold text-lg">방송 현황</h3>
        {sortedList.some(i => i.status.includes('live')) && (
          <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[11px] font-bold text-red-500">ON AIR</span>
          </div>
        )}
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
        {sortedList.map((item, idx) => {
          const statusType = getViewStatus(item.status, item.title);
          const config = STATUS_CONFIG[statusType];
          const isOff = statusType === 'off';
          const Component = isOff ? 'div' : 'a';

          return (
            <Component
              key={`${item.name}-${idx}`}
              href={!isOff ? item.liveUrl : undefined}
              target={!isOff ? "_blank" : undefined}
              rel={!isOff ? "noreferrer" : undefined}
              className={`
                group relative flex items-center justify-between 
                px-3 py-2 rounded-xl border transition-all duration-200
                ${config.wrapper}
                ${!isOff ? 'hover:shadow-md cursor-pointer' : 'cursor-default'}
              `}
            >
              {/* ✅ 여기서 overflow-hidden을 제거하여 이미지가 잘리지 않게 함 */}
              <div className="flex items-center gap-3 flex-1">
                
                {/* 1. 프로필 이미지 + 그라데이션 링 */}
                {/* pl-1을 추가하여 scale시 왼쪽 벽에 닿지 않게 공간 확보 */}
                <div 
                  className="relative flex-none transition-transform duration-300 group-hover:scale-105 pl-1"
                  style={{ width: '46px', height: '44px' }} 
                >
                  <div 
                    className="w-[44px] h-[44px] rounded-full flex items-center justify-center shadow-sm"
                    style={{ 
                      background: config.ringGradient, 
                      padding: '2px' 
                    }}
                  >
                    <img 
                      src={item.profileImg} 
                      alt={item.name} 
                      className={`w-full h-full rounded-full object-cover bg-white block ${isOff ? 'grayscale' : ''}`}
                    />
                  </div>
                  
                  {/* Live 뱃지: 위치를 미세 조정하여 링 위에 겹치지 않게 함 */}
                  {!isOff && statusType !== 'scheduled' && (
                    <span className="absolute bottom-0 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse shadow-sm"></span>
                  )}
                </div>

                {/* 2. 텍스트 정보 */}
                {/* ✅ overflow-hidden을 텍스트 컨테이너에 적용 (truncate 작동 보장) */}
                <div className="flex flex-col min-w-0 pr-2 overflow-hidden">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-bold truncate ${isOff ? 'text-gray-500' : 'text-gray-800'}`}>
                      {item.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center flex-shrink-0 ${config.badge}`}>
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
                <div className="pl-2 text-gray-300 group-hover:text-purple-400 transition-colors flex-shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </Component>
          );
        })}
      </div>
    </div>
  );
}
