import { useMemo } from 'react';
import { Radio, ExternalLink, Mic, Tv, Calendar, Moon, Loader2 } from "lucide-react";
import { useJsonData } from '../hooks/useJsonData';
import { BroadcastItem } from '../types'; // 정의된 타입 import

// UI 내부적으로 사용할 상태 타입 (View Logic)
type ViewStatus = 'chzzk' | 'space' | 'scheduled' | 'off';

// 상태별 디자인/설정 상수 (컴포넌트 외부에 선언하여 메모리 절약)
const STATUS_CONFIG = {
  chzzk: {
    color: 'emerald',
    wrapper: 'border-emerald-200 bg-emerald-50/60',
    badge: 'bg-emerald-100 text-emerald-600',
    dot: 'bg-emerald-500',
    icon: <Tv className="w-3 h-3 mr-1" />,
    label: 'CHZZK',
    btn: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 text-white',
    btnText: 'LIVE',
    isLive: true,
  },
  space: {
    color: 'violet',
    wrapper: 'border-violet-200 bg-violet-50/60',
    badge: 'bg-violet-100 text-violet-600',
    dot: 'bg-violet-500',
    icon: <Mic className="w-3 h-3 mr-1" />,
    label: 'SPACE',
    btn: 'bg-violet-600 hover:bg-violet-700 shadow-violet-200 text-white',
    btnText: 'LISTEN',
    isLive: true,
  },
  scheduled: {
    color: 'amber',
    wrapper: 'border-amber-100 bg-white',
    badge: 'bg-amber-100 text-amber-600',
    dot: 'bg-amber-400',
    icon: <Calendar className="w-3 h-3 mr-1" />,
    label: '방송예정',
    btn: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    btnText: '대기',
    isLive: false,
  },
  off: {
    color: 'gray',
    wrapper: 'border-gray-100 bg-gray-50/40 opacity-75',
    badge: 'bg-gray-100 text-gray-400',
    dot: 'bg-gray-300',
    icon: <Moon className="w-3 h-3 mr-1" />,
    label: 'OFF',
    btn: 'hidden',
    btnText: '',
    isLive: false,
  },
} as const;

// 상태 판별 헬퍼 함수
const getViewStatus = (status: string, title: string): ViewStatus => {
  if (status === 'chzzk_live') return 'chzzk';
  if (status === 'X_live') return 'space';
  if (status === 'offline' && title.includes('예정')) return 'scheduled';
  return 'off';
};

export default function LiveStatus() {
  const { data: statusList, loading } = useJsonData<BroadcastItem[]>('status');

  // 데이터 가공 및 정렬 메모이제이션
  const sortedList = useMemo(() => {
    if (!statusList) return [];
    
    return [...statusList].sort((a, b) => {
      const getScore = (item: BroadcastItem) => {
        const viewStatus = getViewStatus(item.status, item.title);
        // 우선순위: Live(2) > Scheduled(1) > Off(0)
        if (viewStatus === 'chzzk' || viewStatus === 'space') return 2;
        if (viewStatus === 'scheduled') return 1;
        return 0;
      };
      return getScore(b) - getScore(a);
    });
  }, [statusList]);

  // 로딩 UI
  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100/50 min-h-[180px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        <span className="text-gray-400 text-sm">멤버 상태 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/60 space-y-5">
      
      {/* 헤더 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-white rounded-lg shadow-sm border border-purple-50">
            <Radio className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-gray-800 font-bold text-lg">방송 현황</h3>
        </div>
        
        {/* 라이브 상태 인디케이터 */}
        {sortedList.some(i => i.status.includes('live')) && (
          <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-[11px] font-bold text-red-500">ON AIR</span>
          </div>
        )}
      </div>

      {/* 리스트 */}
      <div className="flex flex-col gap-3">
        {sortedList.length > 0 ? (
          sortedList.map((item, idx) => {
            const statusType = getViewStatus(item.status, item.title);
            const config = STATUS_CONFIG[statusType];

            return (
              <div 
                key={`${item.name}-${idx}`} 
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 hover:shadow-md ${config.wrapper}`}
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  {/* 프로필 이미지 & 상태 닷 */}
                  <div className="relative flex-shrink-0">
                    <img 
                      src={item.profileImg} 
                      alt={item.name} 
                      className={`w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm transition-transform ${statusType === 'off' ? 'grayscale opacity-70' : 'hover:scale-105'}`} 
                    />
                    <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1">
                      {config.isLive && (
                        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${config.dot}`}></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white ${config.dot}`}></span>
                    </div>
                  </div>

                  {/* 정보 텍스트 */}
                  <div className="min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${statusType === 'off' ? 'text-gray-500' : 'text-gray-800'}`}>
                        {item.name}
                      </span>
                      <span className={`flex items-center text-[10px] font-extrabold px-1.5 py-0.5 rounded ${config.badge}`}>
                        {config.icon}
                        {config.label}
                      </span>
                    </div>
                    <p className={`text-xs truncate max-w-[160px] sm:max-w-[220px] ${statusType === 'off' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.title || '제목 없음'}
                    </p>
                  </div>
                </div>

                {/* 버튼 (Off 상태가 아닐 때만 노출) */}
                {statusType !== 'off' && (
                  <a 
                    href={item.liveUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`flex-shrink-0 flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl transition-transform active:scale-95 ml-2 ${config.btn}`}
                  >
                    {config.btnText}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">데이터가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
