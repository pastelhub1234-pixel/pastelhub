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
// ✅ 데이터 정의를 외부에서 import
import { TradeItem } from "../types";

// TradeCard 컴포넌트 분리
const TradeCard = ({ trade }: { trade: TradeItem }) => (
  <div
    className={cn(
      "group relative bg-white rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full overflow-hidden",
      trade.status === 'completed'
        ? 'border-slate-100 opacity-70 bg-slate-50 grayscale-[0.5]'
        : 'border-emerald-100 hover:border-emerald-200'
    )}
  >
    {/* 1. 상단 정보 섹션 (mb-5 적용) */}
    <div className="p-5 flex justify-between items-start mb-1">
      <div className="flex gap-2">
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1",
          trade.status === 'active'
            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
            : "bg-slate-200 text-slate-500 border-slate-300"
        )}>
          <div className={cn("w-1.5 h-1.5 rounded-full", trade.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
          {trade.status === 'active' ? '교환중' : '교환완료'}
        </span>
        {trade.isDeliveryAvailable && (
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
            <Box className="w-3 h-3" /> 택배가능
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md">
        <MapPin className="w-3.5 h-3.5 text-slate-400" />
        {trade.region}
      </div>
    </div>

    {/* 2. 메인 컨텐츠 영역 (mb 활용) */}
    <div className="flex-1 px-5">
      {/* HAVE 섹션 - mb-4 적용 */}
      <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-4 mb-4 relative group-hover:bg-emerald-50 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-md tracking-wide">
            HAVE
          </span>
          <span className="text-xs text-emerald-500 font-bold">보유중</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trade.haveItems.map((item, idx) => (
            <span key={idx} className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 화살표 - mb-4 적용 */}
      <div className="flex justify-center -mt-6 mb-2 relative z-10">
        <div className="bg-white p-2 rounded-full border border-slate-200 text-slate-400 shadow-sm">
          <ArrowRightLeft className="w-4 h-4" />
        </div>
      </div>

      {/* WANT 섹션 - mb-6 적용 (하단 액션바와 간격 확보) */}
      <div className="bg-pink-50/50 rounded-2xl border border-pink-100 p-4 mb-6 relative group-hover:bg-pink-50 transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-extrabold text-pink-600 bg-pink-100 px-2.5 py-1 rounded-md tracking-wide">
            WANT
          </span>
          <span className="text-xs text-pink-500 font-bold">구함</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trade.wantItems.map((item, idx) => (
            <span key={idx} className="text-xs font-bold text-pink-700 bg-white px-3 py-1.5 rounded-xl border border-pink-100 shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* 3. 하단 액션 섹션 (mt-auto로 하단 고정) */}
    <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between mt-auto">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <Clock className="w-3.5 h-3.5" />
        <span>{formatDate(trade.createdAt)}</span>
      </div>

      <a
        href={trade.openChatLink}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95",
          trade.status === 'active'
            ? "bg-[#FAE100] text-[#371D1E] hover:bg-[#FCE620] hover:shadow-md border border-[#F5DA00]"
            : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
        )}
        onClick={(e) => trade.status === 'completed' && e.preventDefault()}
      >
        <ExternalLink className="w-3.5 h-3.5" />
        오픈채팅
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* 주의사항 */}
      <div className="bg-orange-50/80 border border-orange-200/60 rounded-3xl p-5 flex items-start gap-4 shadow-sm backdrop-blur-sm">
        <div className="p-2.5 bg-orange-100 rounded-2xl flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-orange-600" />
        </div>
        <div className="space-y-1 pt-0.5">
          <h3 className="text-sm font-extrabold text-orange-800">주의사항 안내</h3>
          <p className="text-sm text-orange-700 leading-relaxed font-medium">
            이곳은 팬들을 위한 <strong>물물교환</strong> 전용 공간입니다.<br className="hidden sm:block"/>
            금전 요구, 계좌 거래 유도 행위 적발 시 이용이 제한될 수 있습니다.
          </p>
        </div>
      </div>

      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-14 h-14 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-200/50">
              <RefreshCw className="w-7 h-7 text-white" />
            </div>
            굿즈 교환소
          </h1>
          <p className="text-slate-500 pl-[68px] font-bold text-base">
            중복 굿즈는 나누고, 필요한 굿즈는 채워보세요.
          </p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg hover:shadow-emerald-200/50 hover:-translate-y-1 flex items-center gap-2 whitespace-nowrap active:scale-95">
          <ArrowRightLeft className="w-5 h-5" />
          <span>교환글 작성하기</span>
        </button>
      </div>

      {/* 필터 바 */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="찾으시는 굿즈 이름을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400 text-sm font-bold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsRegionModalOpen(true)}
            className={cn(
              "flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-black transition-all min-w-[160px] justify-between group",
              mainRegion !== '전체'
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center gap-2">
              <MapPin className={cn("w-4 h-4", mainRegion !== '전체' ? "text-emerald-600" : "text-slate-400")} />
              <span>{currentRegionLabel}</span>
            </div>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setDeliveryOnly(!deliveryOnly)}
            className={cn(
              "flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-black transition-all",
              deliveryOnly
                ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
          >
            <Box className="w-4 h-4" /> 택배가능
          </button>

          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            className={cn(
              "flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-black transition-all",
              hideCompleted
                ? "bg-slate-800 border-slate-800 text-white shadow-lg"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
          >
            <Filter className="w-4 h-4" /> 거래중만
          </button>
        </div>
      </div>

      {/* 리스트 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))
        ) : (
          <div className="col-span-full py-40 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-slate-100">
              <Search className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-700 mb-3">조건에 맞는 교환글이 없어요</h3>
            <p className="text-slate-400 font-bold">
              다른 검색어나 필터를 시도해보세요!
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
