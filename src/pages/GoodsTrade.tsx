import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Box, ExternalLink, RefreshCw, Clock, Filter, 
  ArrowRightLeft, AlertCircle, Loader2, ChevronDown 
} from 'lucide-react';
import { cn, formatDate } from "../lib/utils";
import { RegionSelector } from "./region-selector";
import { useJsonData } from "../hooks/useJsonData";
import { TradeItem } from "../types";

// --- Components ---

const TradeCard = ({ trade }: { trade: TradeItem }) => (
  <div
    className={cn(
      "group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full overflow-hidden",
      trade.status === 'completed'
        ? 'border-slate-100 opacity-60 bg-slate-50 grayscale-[0.5]'
        : 'border-slate-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/40 hover:-translate-y-1'
    )}
  >
    {/* 상단: 상태 및 위치 */}
    <div className="p-6 pb-3 flex justify-between items-start">
      <div className="flex gap-2">
        {/* 상태 배지 (Mint) */}
        <span className={cn(
          // ✅ [Fix] rounded-xl 적용
          "px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-colors",
          trade.status === 'active'
            ? "bg-teal-50 text-teal-600 border-teal-100"
            : "bg-slate-100 text-slate-500 border-slate-200"
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full", trade.status === 'active' ? "bg-teal-400 animate-pulse" : "bg-slate-400")} />
          {trade.status === 'active' ? '교환중' : '교환완료'}
        </span>
        
        {/* 택배 배지 (Soft Blue) */}
        {trade.isDeliveryAvailable && (
          <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
            <Box className="w-3.5 h-3.5" /> 택배
          </span>
        )}
      </div>
      
      {/* 지역 정보 */}
      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium px-3 py-1.5 rounded-xl bg-slate-50">
        <MapPin className="w-3.5 h-3.5 text-slate-300" />
        {trade.region}
      </div>
    </div>

    {/* 메인: HAVE <-> WANT */}
    <div className="flex-1 px-5 space-y-3">
      <div className="bg-indigo-50/60 rounded-xl border border-indigo-100/60 p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
            HAVE (보유)
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {trade.haveItems.map((item, idx) => (
            <span key={idx} className="text-xs font-medium text-indigo-900 bg-white px-2 py-1.5 rounded-lg border border-indigo-50 shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-center -my-1">
        <div className="bg-slate-50 p-1.5 rounded-full border border-slate-100 text-slate-400 shadow-sm z-10">
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="bg-pink-50/60 rounded-xl border border-pink-100/60 p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
            WANT (구함)
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {trade.wantItems.map((item, idx) => (
            <span key={idx} className="text-xs font-medium text-pink-900 bg-white px-2 py-1.5 rounded-lg border border-pink-50 shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* 하단: 액션 및 정보 */}
    <div className="px-6 py-5 mt-4 bg-gradient-to-b from-white to-slate-50 border-t border-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Clock className="w-3.5 h-3.5" />
        <span>{formatDate(trade.createdAt)}</span>
      </div>

      <a
        href={trade.openChatLink}
        target="_blank"
        rel="noreferrer"
        className={cn(
          // ✅ [Fix] 버튼 둥글기 rounded-xl
          "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 mb-3",
          trade.status === 'active'
            ? "bg-[#FAE100] text-[#371D1E] hover:bg-[#FCE620] hover:shadow-md border border-[#F5DA00]/50"
            : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
        )}
        onClick={(e) => trade.status === 'completed' && e.preventDefault()}
      >
        <ExternalLink className="w-3.5 h-3.5" />
        오픈채팅
      </a>
    </div>
  </div>
);

// --- Main Layout ---

export default function GoodsTrade() {
  const { data: trades, isLoading } = useJsonData<TradeItem[]>('goodstrade');

  const [searchQuery, setSearchQuery] = useState('');
  const [mainRegion, setMainRegion] = useState('전체');
  const [subRegion, setSubRegion] = useState('');
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  // ... Filter Logic (동일) ...
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

  const currentRegionLabel = mainRegion === '전체'
    ? '모든 지역'
    : `${mainRegion}${subRegion && subRegion !== '전체' ? ` ${subRegion}` : ''}`;

  const handleRegionSelect = (main: string, sub: string) => {
    setMainRegion(main);
    setSubRegion(sub);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* 1. 주의사항 (상단 배치) */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 text-sm text-orange-800 shadow-sm">
        <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">주의사항:</span> 이곳은 순수한 <strong>물물교환</strong>만을 위한 공간입니다. 
          금전 요구, 계좌 거래 유도 행위 적발 시 이용이 제한될 수 있습니다.
        </p>
      </div>

      {/* 2. 헤더 Title */}
      <div className="flex flex-col justify-center gap-2 border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-indigo-500" />
          </div>
          굿즈 교환소
        </h1>
        <p className="text-slate-500 text-sm ml-[52px]">
          중복 굿즈는 교환하고, 없는 굿즈는 채워보세요.
        </p>
      </div>

      {/* 3. 필터 바 */}
      {/* ✅ [Fix] rounded-3xl 적용 */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4">
        
        {/* 검색창 */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          
          {/* ✅ [Fix] rounded-2xl 적용 및 배경색 투명도 제거(bg-slate-50) */}
          <input
            type="text"
            placeholder="     찾으시는 굿즈 이름을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 text-sm text-slate-700 font-medium"
          />
        </div>

        {/* 필터 버튼 그룹 */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 지역 선택 */}
          <button
            onClick={() => setIsRegionModalOpen(true)}
            // ✅ [Fix] rounded-2xl
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all whitespace-nowrap min-w-[130px] justify-between group",
              mainRegion !== '전체'
                ? "bg-teal-50 border-teal-200 text-teal-700 shadow-sm"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300"
            )}
          >
            <div className="flex items-center gap-2">
              <MapPin className={cn("w-4 h-4", mainRegion !== '전체' ? "text-teal-600" : "text-slate-400 group-hover:text-slate-500")} />
              <span className="truncate max-w-[90px]">{currentRegionLabel}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

          {/* 택배 필터 */}
          <button
            onClick={() => setDeliveryOnly(!deliveryOnly)}
            // ✅ [Fix] rounded-2xl
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm transition-all font-bold whitespace-nowrap",
              deliveryOnly
                ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm ring-1 ring-blue-100"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            )}
          >
            <Box className={cn("w-4 h-4", deliveryOnly ? "fill-blue-100" : "")} /> 택배가능
          </button>

          {/* 거래중 필터 */}
          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            // ✅ [Fix] rounded-2xl
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm transition-all font-bold whitespace-nowrap",
              hideCompleted
                ? "bg-slate-800 border-slate-800 text-white shadow-md ring-2 ring-slate-200"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            )}
          >
            <Filter className="w-4 h-4" /> 거래중만 보기
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap ml-auto lg:ml-2">
            <ArrowRightLeft className="w-4 h-4" />
            <span>교환글 쓰기</span>
          </button>
        </div>
      </div>

      {/* 4. 리스트 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">조건에 맞는 교환글이 없어요</h3>
            <p className="text-slate-400 text-sm">
              다른 검색어나 필터를 시도해보시거나,<br />
              직접 <span className="text-teal-600 font-bold cursor-pointer hover:underline">첫 번째 교환글</span>을 작성해보세요!
            </p>
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
