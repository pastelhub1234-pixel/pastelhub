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
import { TradeItem } from "../types";

// --- Components ---

const TradeCard = ({ trade }: { trade: TradeItem }) => (
  <div
    className={cn(
      // ✅ [수정] 카드 전체 패딩 감소 (기존 p-6 -> p-5) / 둥근 모서리 유지
      "group relative bg-white rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full overflow-hidden",
      trade.status === 'completed'
        ? 'border-slate-100 opacity-70 bg-slate-50 grayscale-[0.5]'
        : 'border-emerald-100/60 hover:border-emerald-300/50 hover:shadow-emerald-100/50'
    )}
  >
    {/* 상단: 상태 및 위치 */}
    {/* ✅ [수정] 내부 여백 p-5로 조정하여 전체 크기 최적화 */}
    <div className="p-5 pb-0 flex justify-between items-start mb-3">
      <div className="flex gap-2">
        {/* 상태 배지 */}
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors",
          trade.status === 'active'
            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
            : "bg-slate-100 text-slate-500 border-slate-200"
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full", trade.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
          {trade.status === 'active' ? '교환중' : '교환완료'}
        </span>
        
        {/* 택배 배지 */}
        {trade.isDeliveryAvailable && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50 text-sky-600 border border-sky-100 flex items-center gap-1">
            <Box className="w-3 h-3" /> 택배
          </span>
        )}
      </div>
      
      {/* 지역 정보 */}
      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium px-2 py-1 rounded-md bg-slate-50/80">
        <MapPin className="w-3 h-3 text-slate-400" />
        {trade.region}
      </div>
    </div>

    {/* 중단: HAVE <-> WANT */}
    {/* ✅ [수정] 카드 내부 콘텐츠 패딩 p-5 */}
    <div className="flex-1 px-5 py-2 space-y-4">
      
      {/* HAVE 섹션 */}
      {/* ✅ [수정] 박스 내부 패딩(p-4)은 넉넉하게 유지하되, mb-3으로 타이틀과 태그 사이 공간 확보 */}
      <div className="bg-emerald-50/30 rounded-2xl border border-emerald-100/50 p-4 relative group-hover:bg-emerald-50/50 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-md tracking-wide">
            HAVE
          </span>
          <span className="text-xs text-emerald-600/70 font-medium">보유 굿즈</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trade.haveItems.map((item, idx) => (
            <span key={idx} className="text-sm font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-100/60 shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 화살표 아이콘 (간격 조절을 위해 -my값 수정) */}
      <div className="flex justify-center -my-5 relative z-10">
        <div className="bg-white p-1.5 rounded-full border border-slate-100 text-slate-300 shadow-sm group-hover:text-emerald-400 group-hover:border-emerald-100 transition-colors">
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* WANT 섹션 */}
      {/* ✅ [수정] 박스 내부 패딩 p-4 */}
      <div className="bg-rose-50/30 rounded-2xl border border-rose-100/50 p-4 relative group-hover:bg-rose-50/50 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-extrabold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-md tracking-wide">
            WANT
          </span>
          <span className="text-xs text-rose-600/70 font-medium">구하는 굿즈</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trade.wantItems.map((item, idx) => (
            <span key={idx} className="text-sm font-bold text-rose-800 bg-white px-3 py-1.5 rounded-xl border border-rose-100/60 shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* 하단: 액션 및 정보 */}
    {/* ✅ [수정] 하단 패딩 p-5 (상단과 통일) */}
    <div className="px-5 py-5 mt-2 bg-gradient-to-b from-white to-slate-50/50 border-t border-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Clock className="w-3.5 h-3.5" />
        <span>{formatDate(trade.createdAt)}</span>
      </div>

      {/* ✅ [수정] 버튼 패딩 확대 (px-5 py-2.5) : 버튼이 더 크고 누르기 편해짐 */}
      <a
        href={trade.openChatLink}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95",
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
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    // ✅ [수정] 전체 페이지 패딩 감소 (p-8 -> p-6) / 간격 축소 (space-y-6)
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 bg-slate-50/30">

      {/* 1. 주의사항 */}
      <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm backdrop-blur-sm">
        <div className="p-1.5 bg-amber-100 rounded-full flex-shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-amber-800">주의사항 안내</h3>
          <p className="text-sm text-amber-700 leading-relaxed">
            이곳은 팬들을 위한 순수 <strong>물물교환</strong> 공간입니다. 금전 거래는 제한됩니다.
          </p>
        </div>
      </div>

      {/* 2. 헤더 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-100">
              <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            굿즈 교환소
          </h1>
          <p className="text-slate-500 pl-[54px] md:pl-[60px] font-medium text-sm md:text-base">
            중복 굿즈는 나누고, 필요한 굿즈는 채워보세요.
          </p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-emerald-200/50 hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap">
          <ArrowRightLeft className="w-4 h-4" />
          <span>교환글 작성하기</span>
        </button>
      </div>

      {/* 3. 필터 바 */}
      {/* ✅ [수정] 검색바 컨테이너 패딩 감소 (p-6 -> p-5) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-4">
        
        {/* 검색창 */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          {/* ✅ [수정] input 높이 약간 축소 (py-3.5 -> py-3) */}
          <input
            type="text"
            placeholder="찾으시는 굿즈 이름을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 text-sm text-slate-700 font-medium"
          />
        </div>

        {/* 필터 버튼 그룹 */}
        {/* ✅ [수정] 버튼 높이 약간 축소 (py-3.5 -> py-2.5) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsRegionModalOpen(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all whitespace-nowrap min-w-[130px] justify-between group",
              mainRegion !== '전체'
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300"
            )}
          >
            <div className="flex items-center gap-2">
              <MapPin className={cn("w-4 h-4", mainRegion !== '전체' ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-500")} />
              <span className="truncate max-w-[90px]">{currentRegionLabel}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

          <button
            onClick={() => setDeliveryOnly(!deliveryOnly)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all font-bold whitespace-nowrap",
              deliveryOnly
                ? "bg-sky-50 border-sky-200 text-sky-600 shadow-sm ring-1 ring-sky-100"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            )}
          >
            <Box className={cn("w-4 h-4", deliveryOnly ? "fill-sky-100" : "")} /> 택배가능
          </button>

          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all font-bold whitespace-nowrap",
              hideCompleted
                ? "bg-slate-800 border-slate-800 text-white shadow-md ring-2 ring-slate-200"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            )}
          >
            <Filter className="w-4 h-4" /> 거래중만 보기
          </button>
        </div>
      </div>

      {/* 4. 리스트 Grid */}
      {/* ✅ [수정] 카드 간격 gap-6 (24px)로 설정하여 카드끼리 닿지 않도록 함 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">조건에 맞는 교환글이 없어요</h3>
            <p className="text-slate-400 text-sm">
              다른 검색어나 필터를 시도해보시거나,<br />
              직접 <span className="text-emerald-600 font-bold cursor-pointer hover:underline">첫 번째 교환글</span>을 작성해보세요!
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
