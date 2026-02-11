import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Box,
  ExternalLink,
  RefreshCw,
  Clock,
  Filter,
  ArrowRightLeft,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { cn, formatDate } from "../lib/utils";
import { RegionSelector } from "./region-selector";
import { useJsonData } from "../hooks/useJsonData";
// ✅ 데이터 정의를 ../types에서 import
import { TradeItem } from "../types";

// TradeCard 컴포넌트 분리
const TradeCard = ({ trade }: { trade: TradeItem }) => (
  <div
    className={cn(
      "group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full overflow-hidden",
      trade.status === 'completed'
        ? 'border-slate-100 opacity-70 bg-slate-50 grayscale-[0.5]'
        : 'border-indigo-100 hover:border-indigo-200'
    )}
  >
    {/* 상단 상태 및 위치 정보 */}
    <div className="p-5 pb-4 flex justify-between items-start mb-2.5">
      <div className="flex gap-2 flex-wrap mb-0.5">
        {/* ✅ 배지 개별 mb-0.5 추가 */}
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 mb-0.5",
          trade.status === 'active'
            ? "bg-green-50 text-green-600 border-green-200"
            : "bg-slate-200 text-slate-500 border-slate-300"
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full mb-0.5", trade.status === 'active' ? "bg-green-500 animate-pulse" : "bg-slate-400")} />
          <span className="mb-0.5">{trade.status === 'active' ? '교환중' : '교환완료'}</span>
        </span>
        {trade.isDeliveryAvailable && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1 mb-0.5">
            <Box className="w-3 h-3 mb-0.5" /> <span className="mb-0.5">택배가능</span>
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md mb-0.5">
        <MapPin className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
        <span className="mb-0.5">{trade.region}</span>
      </div>
    </div>

    {/* 메인: HAVE <-> WANT */}
    <div className="flex-1 px-5 space-y-2 mb-0.5">
      {/* HAVE 섹션 */}
      <div className="bg-indigo-50/50 rounded-xl border border-indigo-100 p-3.5 relative group-hover:bg-indigo-50 transition-colors mb-2.5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-md tracking-wide mb-0.5">
            HAVE
          </span>
          <span className="text-xs text-indigo-400 font-medium mb-0.5">보유중인 굿즈</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-0.5">
          {trade.haveItems.map((item, idx) => (
            <span key={idx} className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1.5 rounded-lg border border-indigo-100 shadow-sm mb-0.5">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 화살표 아이콘 */}
      <div className="flex justify-center -my-3 relative z-10 mb-2.5">
        <div className="bg-white p-1.5 rounded-full border border-slate-200 text-slate-400 shadow-sm mb-0.5">
          <ArrowRightLeft className="w-3.5 h-3.5 mb-0.5" />
        </div>
      </div>

      {/* WANT 섹션 */}
      <div className="bg-pink-50/50 rounded-xl border border-pink-100 p-3.5 relative group-hover:bg-pink-50 transition-colors mb-2.5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-extrabold text-pink-600 bg-pink-100 px-2.5 py-1 rounded-md tracking-wide mb-0.5">
            WANT
          </span>
          <span className="text-xs text-pink-400 font-medium mb-0.5">원하는 굿즈</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-0.5">
          {trade.wantItems.map((item, idx) => (
            <span key={idx} className="text-xs font-bold text-pink-700 bg-white px-2.5 py-1.5 rounded-lg border border-pink-100 shadow-sm mb-0.5">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* 하단 액션 */}
    <div className="p-4 mt-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between mb-0.5">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
        <Clock className="w-3.5 h-3.5 mb-0.5" />
        <span className="mb-0.5">{formatDate(trade.createdAt)}</span>
      </div>

      <a
        href={trade.openChatLink}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 mb-0.5",
          trade.status === 'active'
            ? "bg-[#FAE100] text-[#371D1E] hover:bg-[#FCE620] hover:shadow-md border border-[#F5DA00]"
            : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
        )}
        onClick={(e) => trade.status === 'completed' && e.preventDefault()}
      >
        <ExternalLink className="w-3.5 h-3.5 mb-0.5" />
        <span className="mb-0.5">오픈채팅</span>
      </a>
    </div>
  </div>
);

export default function GoodsTrade() {
  const { data: trades, isLoading } = useJsonData<TradeItem[]>('goodstrade');

  const [searchQuery, setSearchQuery] = useState('');
  const [mainRegion, setMainRegion] = useState('전체');
  const [subRegion, setSubRegion] = useState('');
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  const filteredTrades = useMemo(() => {
    if (!trades || !Array.isArray(trades)) return [];

    return trades.filter((trade) => {
      if (hideCompleted && trade.status === 'completed') return false;
      if (deliveryOnly && !trade.isDeliveryAvailable) return false;

      if (mainRegion !== '전체') {
        if (!trade.region.includes(mainRegion)) return false;
        if (subRegion && subRegion !== '전체' && !trade.region.includes(subRegion)) return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchTarget = [...trade.haveItems, ...trade.wantItems, trade.region];
        return searchTarget.some(item => item.toLowerCase().includes(query));
      }
      return true;
    });
  }, [trades, searchQuery, mainRegion, subRegion, deliveryOnly, hideCompleted]);

  const handleRegionSelect = (main: string, sub: string) => {
    setMainRegion(main);
    setSubRegion(sub);
  };

  const currentRegionLabel = mainRegion === '전체'
    ? '모든 지역'
    : `${mainRegion}${subRegion && subRegion !== '전체' ? ` ${subRegion}` : ''}`;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center mb-0.5">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-0.5" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 mb-0.5">

      {/* 1. 주의사항 */}
      <div className="bg-orange-50/80 border border-orange-200/60 rounded-2xl p-4 flex items-start gap-4 shadow-sm backdrop-blur-sm mb-4.5">
        <div className="p-2 bg-orange-100 rounded-full flex-shrink-0 mb-0.5">
            <AlertCircle className="w-5 h-5 text-orange-600 mb-0.5" />
        </div>
        <div className="space-y-1 pt-0.5 mb-0.5">
            <h3 className="text-sm font-bold text-orange-800 mb-0.5">주의사항 안내</h3>
            <p className="text-sm text-orange-700 leading-relaxed mb-0.5">
            이곳은 팬들을 위한 <strong>물물교환</strong> 전용 공간입니다.<br className="hidden sm:block mb-0.5"/>
            금전 요구, 계좌 거래 유도 행위 적발 시 이용이 제한될 수 있습니다.
            </p>
        </div>
      </div>

      {/* 2. 헤더 Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6 mb-6.5">
        <div className="space-y-2 mb-0.5">
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 mb-0.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 mb-0.5">
                <RefreshCw className="w-6 h-6 text-white mb-0.5" />
            </div>
            <span className="mb-0.5">굿즈 교환소</span>
            </h1>
            <p className="text-slate-500 pl-[60px] font-medium mb-0.5">
            중복 굿즈는 나누고, 필요한 굿즈는 채워보세요.
            </p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap mb-0.5">
            <ArrowRightLeft className="w-4 h-4 mb-0.5" />
            <span className="mb-0.5">교환글 작성하기</span>
        </button>
      </div>

      {/* 3. 필터 바 & 컨트롤 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-5 mb-6.5">
        <div className="relative flex-1 min-w-[280px] mb-0.5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none mb-0.5" />
          <input
            type="text"
            placeholder="찾으시는 굿즈 이름을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-sm text-slate-700 font-medium mb-0.5"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mb-0.5">
            <button
                onClick={() => setIsRegionModalOpen(true)}
                className={cn(
                "flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-bold transition-all whitespace-nowrap min-w-[140px] justify-between group mb-0.5",
                mainRegion !== '전체'
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                )}
            >
                <div className="flex items-center gap-2 mb-0.5">
                <MapPin className={cn("w-4 h-4 mb-0.5", mainRegion !== '전체' ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-500")} />
                <span className="truncate max-w-[100px] mb-0.5">{currentRegionLabel}</span>
                </div>
                <ChevronDown className="w-4 h-4 opacity-50 mb-0.5" />
            </button>

            <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block mb-0.5" />

            <button
                onClick={() => setDeliveryOnly(!deliveryOnly)}
                className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all font-bold whitespace-nowrap mb-0.5",
                deliveryOnly
                    ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm ring-1 ring-blue-100"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
            >
                <Box className={cn("w-4 h-4 mb-0.5", deliveryOnly ? "fill-blue-100" : "")} /> <span className="mb-0.5">택배가능</span>
            </button>

            <button
                onClick={() => setHideCompleted(!hideCompleted)}
                className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all font-bold whitespace-nowrap mb-0.5",
                hideCompleted
                    ? "bg-slate-800 border-slate-800 text-white shadow-md ring-2 ring-slate-200"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
            >
                <Filter className="w-4 h-4 mb-0.5" /> <span className="mb-0.5">거래중만 보기</span>
            </button>
        </div>
      </div>

      {/* 4. 리스트 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-0.5">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 mb-0.5">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 mb-0.5">
              <Search className="w-10 h-10 text-slate-300 mb-0.5" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2.5">조건에 맞는 교환글이 없어요</h3>
          </div>
        )}
      </div>

      <RegionSelector
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedMain={mainRegion}
        selectedSub={subRegion}
        onSelect={handleRegionSelect}
      />
    </div>
  );
}
