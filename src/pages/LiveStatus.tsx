import { useMemo } from 'react';
import { Radio, Mic, Tv, Calendar, Moon, Loader2, ChevronRight } from "lucide-react";
import { useJsonData } from '../hooks/useJsonData';
import { BroadcastItem } from '../types';

type ViewStatus = 'chzzk' | 'space' | 'scheduled' | 'off';

const STATUS_CONFIG = {
  chzzk: {
    wrapper: 'border-emerald-100 bg-emerald-50/40 hover:border-emerald-300 hover:shadow-emerald-100/50',
    badge: 'bg-emerald-100 text-emerald-600',
    dot: 'bg-emerald-500',
    icon: <Tv className="w-3 h-3 mr-1" />,
    label: 'CHZZK',
    isLive: true,
  },
  space: {
    wrapper: 'border-purple-100 bg-purple-50/40 hover:border-purple-300 hover:shadow-purple-100/50',
    badge: 'bg-purple-100 text-purple-600',
    dot: 'bg-purple-500',
    icon: <Mic className="w-3 h-3 mr-1" />,
    label: 'SPACE',
    isLive: true,
  },
  scheduled: {
    wrapper: 'border-amber-100 bg-white hover:border-amber-300 hover:shadow-amber-100/50',
    badge: 'bg-amber-100 text-amber-600',
    dot: 'bg-amber-400',
    icon: <Calendar className="w-3 h-3 mr-1" />,
    label: '방송예정',
    isLive: false,
  },
  off: {
    wrapper: 'border-gray-100 bg-gray-50/30 opacity-60 cursor-default',
    badge: 'bg-gray-100 text-gray-400',
    dot: 'bg-gray-300',
    icon: <Moon className="w-3 h-3 mr-1" />,
    label: 'OFF',
    isLive: false,
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
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/60 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-gray-800 font-bold text-lg">방송 현황</h3>
        {sortedList.some(i => i.status.includes('live')) && (
          <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[11px] font-bold text-red-500">ON AIR</span>
          </div>
        )}
      </div>

      {/* 리스트 */}
      <div className="flex flex-col gap-2.5">
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
                group relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200
                ${config.wrapper}
                ${!isOff ? 'hover:scale-[1.01] hover:shadow-md cursor-pointer' : ''}
              `}
            >
              {/* 왼쪽 영역: 이미지 + 텍스트 */}
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                
                {/* 1. 프로필 이미지 영역 (크기 고정 및 축소 방지) */}
                <div className="relative flex-shrink-0">
                  <img 
                    src={item.profileImg} 
                    alt={item.name} 
                    // ✅ w-10 h-10으로 크기 고정 (약 40px), flex-shrink-0 추가
                    className={`w-10 h-10 rounded-full object-cover border border-white shadow-sm transition-transform ${!isOff ? 'group-hover:scale-105' : 'grayscale'}`} 
                  />
                  {config.isLive && (
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${config.dot} animate-pulse`}></span>
                  )}
                </div>

                {/* 2. 텍스트 정보 */}
                <div className="flex flex-col min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-bold ${isOff ? 'text-gray-500' : 'text-gray-800'}`}>
                      {item.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center ${config.badge}`}>
                      {config.icon} {config.label}
                    </span>
                  </div>
                  <p className={`text-xs truncate w-full ${isOff ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.title || (isOff ? '' : '제목 없음')}
                  </p>
                </div>
              </div>

              {/* 우측 화살표 (이동 가능할 때만) */}
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
