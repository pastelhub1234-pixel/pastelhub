import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Box, ExternalLink, RefreshCw, Clock, Filter, 
  ArrowRightLeft, AlertCircle, Loader2, ChevronDown 
} from 'lucide-react';
import { useJsonData } from "../hooks/useJsonData"; 
import { cn, formatDate } from '../lib/utils';
import { RegionSelector } from './region-selector';
import { TradeItem } from "../types";

// --- Components ---

const TradeCard = ({ trade }: { trade: TradeItem }) => (
  <div
    className={cn(
      // ✅ [Design] 이미지 참고: 둥근 모서리(28px), 연한 테두리, 흰색 배경
      "group relative bg-white rounded-custom-3xl border border-custom transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full overflow-hidden",
      trade.status === 'completed'
        ? 'opacity-60 bg-slate-50 grayscale'
        : 'hover:border-indigo-200'
    )}
  >
    {/* 상단: 상태 및 위치 */}
    <div className="p-6 pb-2 flex justify-between items-start">
      <div className="flex gap-2">
        {/* 교환중 배지 (Green) */}
        <span className={cn(
          "px-3 py-1.5 rounded-custom-xl text-xs font-bold flex items-center gap-1.5",
          trade.status === 'active'
            ? "bg-badge-green text-badge-green" // CSS 변수 사용
            : "bg-slate-100 text-slate-500"
        )}>
          {trade.status === 'active' ? '교환중' : '교환완료'}
        </span>
        
        {/* 택배 배지 (Blue) */}
        {trade.isDeliveryAvailable && (
          <span className="px-3 py-1.5 rounded-custom-xl text-xs font-bold bg-badge-blue text-badge-blue flex items-center gap-1">
            <Box className="w-3.5 h-3.5" /> 택배
          </span>
        )}
      </div>
      
      {/* 지역 정보 */}
      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium px-2.5 py-1.5">
        <MapPin className="w-3.5 h-3.5 text-slate-300" />
        {trade.region}
      </div>
    </div>

    {/* 중단: HAVE <-> WANT */}
    <div className="flex-1 px-6 py-4 space-y-6">
      
      {/* HAVE 섹션 (Blue/Purple text) */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-extrabold text-have uppercase tracking-wider">
            HAVE
          </span>
          <span className="text-xs text-slate-400 font-medium">보유 굿즈</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trade.haveItems.map((item, idx) => (
            // 이미지처럼 깔끔한 흰색 박스에 연한 테두리
            <span key={idx} className="text-[13px] font-bold text-slate-700 bg-white px-4 py-2.5 rounded-custom-xl border border-custom shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 화살표 아이콘 (중앙) */}
      <div className="flex justify-center -my-2 opacity-30">
        <ArrowRightLeft className="w-5 h-5 text-slate-400" />
      </div>

      {/* WANT 섹션 (Pink/Red text) */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-extrabold text-want uppercase tracking-wider">
            WANT
          </span>
          <span className="text-xs text-slate-400 font-medium">구하는 굿즈</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trade.wantItems.map((item, idx) => (
            <span key={idx} className="text-[13px] font-bold text-slate-700 bg-white px-4 py-2.5 rounded-custom-xl border border-custom shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* 하단: 날짜 및 오픈채팅 */}
    <div className="px-6 py-5 mt-2 flex items-center justify-between border-t border-slate-50">
      <div className="flex flex-col gap-0.5">
         <span className="text-xs font-bold text-slate-600">{trade.author.name}</span>
         <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{formatDate(trade.createdAt)}</span>
         </div>
      </div>

      {/* ✅ [Design] 카카오톡 노란색 버튼 */}
      <a
        href={trade.openChatLink}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "flex items-center gap-1.5 px-5 py-2.5 rounded-custom-xl text-xs font-bold transition-all shadow-sm active:scale-95",
          trade.status === 'active'
            ? "bg-kakao text-kakao hover:brightness-95" // CSS 변수 사용
            : "bg-slate-100 text-slate-400 cursor-not-allowed"
        )}
        onClick={(e) => trade.status === 'completed' && e.preventDefault()}
      >
        <ExternalLink className="w-3.5 h-3.5" />
        오픈톡
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

  // ... Filter Logic ...
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
      <div className="flex h-[50vh] w-full items-center justify-center bg-page">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    // ✅ [Design] 배경색: 연한 라벤더 (bg-page)
    <div className="w-full min-h-screen bg-page p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. 주의사항 (상단 배너 스타일) */}
        <div className="bg-orange-50/80 border border-orange-100 rounded-custom-2xl p-4 flex items-center gap-3 text-sm text-orange-800 shadow-sm">
          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <p>
            <span className="font-bold mr-1">주의사항 안내:</span> 
            이곳은 팬들을 위한 순수 <strong>물물교환</strong> 공간입니다. 금전 거래는 제한됩니다.
          </p>
        </div>

        {/* 2. 헤더 Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-slate-300" />
              굿즈 교환소
            </h1>
            <p className="text-slate-500 font-medium text-base">
              중복 굿즈는 나누고, 필요한 굿즈는 채워보세요.
            </p>
          </div>

          {/* ✅ [Design] 교환글 작성 버튼: 이미지의 보라/블루 컬러 적용 */}
          <button className="bg-primary hover-bg-primary-dark text-white px-6 py-3.5 rounded-custom-2xl font-bold text-sm transition-all shadow-lg hover:shadow-indigo-200/50 hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap">
            <ArrowRightLeft className="w-4 h-4" />
            <span>교환글 작성하기</span>
          </button>
        </div>

        {/* 3. 필터 바 (White Box) */}
        <div className="bg-white p-6 rounded-custom-3xl shadow-sm flex flex-col lg:flex-row gap-5">
          
          {/* 검색창 */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="찾으시는 굿즈 이름을 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // ✅ 둥근 모서리 적용
              className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border-transparent rounded-custom-2xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder:text-slate-300 text-sm text-slate-700 font-medium"
            />
          </div>

          {/* 필터 버튼 그룹 */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 지역 선택 */}
            <button
              onClick={() => setIsRegionModalOpen(true)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-custom-2xl border text-sm font-bold transition-all whitespace-nowrap min-w-[130px] justify-between group",
                mainRegion !== '전체'
                  ? "bg-white border-indigo-200 text-primary shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-2">
                <MapPin className={cn("w-4 h-4", mainRegion !== '전체' ? "text-primary" : "text-slate-300")} />
                <span className="truncate max-w-[90px]">{currentRegionLabel}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            </button>

            <div className="w-px h-8 bg-slate-100 mx-1 hidden sm:block" />

            {/* 택배 필터 */}
            <button
              onClick={() => setDeliveryOnly(!deliveryOnly)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-custom-2xl border text-sm transition-all font-bold whitespace-nowrap",
                deliveryOnly
                  ? "bg-white border-blue-200 text-badge-blue shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              )}
            >
              <Box className={cn("w-4 h-4", deliveryOnly ? "text-badge-blue" : "text-slate-300")} /> 택배가능
            </button>

            {/* 거래중 필터 */}
            <button
              onClick={() => setHideCompleted(!hideCompleted)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-custom-2xl border text-sm transition-all font-bold whitespace-nowrap",
                hideCompleted
                  ? "bg-slate-800 border-slate-800 text-white shadow-md"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              )}
            >
              <Filter className="w-4 h-4" /> 거래중만 보기
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
            <div className="col-span-full py-32 text-center bg-white rounded-custom-3xl border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-600 font-bold text-lg mb-2">조건에 맞는 교환글이 없어요</p>
              <p className="text-slate-400 text-sm">
                다른 검색어나 필터를 시도해보세요.
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
    </div>
  );
}
