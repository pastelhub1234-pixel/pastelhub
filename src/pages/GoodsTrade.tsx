import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Box, ExternalLink, RefreshCw, Clock, Filter, 
  ArrowRightLeft, AlertCircle, Loader2, ChevronDown 
} from 'lucide-react';
import { useJsonData } from "../hooks/useJsonData"; 
import { cn, formatDate } from '../lib/utils';
import { RegionSelector } from './region-selector';
import { TradeItem } from "../types";

export default function GoodsTrade() {
  const { data: trades, isLoading } = useJsonData<TradeItem[]>('goodstrade');

  // --- State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [mainRegion, setMainRegion] = useState('전체');
  const [subRegion, setSubRegion] = useState('');
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  // --- Filter Logic ---
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
        {/* 로딩 스피너 색상도 Teal로 변경 */}
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 bg-transparent">
      
      {/* 1. 주의사항 (Warm Amber Theme) */}
      {/* rounded-2xl 적용 */}
      <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5 flex items-start gap-4 shadow-sm backdrop-blur-sm">
        <div className="p-1.5 bg-amber-100 rounded-full flex-shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-800">주의사항 안내</h3>
          <p className="text-sm text-amber-700/90 leading-relaxed">
            이곳은 팬들을 위한 순수 <strong>물물교환</strong> 공간입니다. 
            금전 요구, 계좌 거래 유도 행위 적발 시 이용이 제한될 수 있습니다.
          </p>
        </div>
      </div>

      {/* 2. 헤더 Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100/80 pb-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            {/* 아이콘 배경: Teal -> Violet 그라데이션, rounded-2xl */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-violet-400 flex items-center justify-center shadow-lg shadow-teal-100">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            굿즈 교환소
          </h1>
          <p className="text-slate-500 pl-[60px] font-medium text-base">
            중복 굿즈는 교환하고, 없는 굿즈는 채워보세요.
          </p>
        </div>

        {/* 교환글 쓰기 버튼 (Teal Theme) */}
        {/* rounded-xl -> rounded-2xl */}
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-teal-200/50 hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap">
          <ArrowRightLeft className="w-4 h-4" />
          <span>교환글 작성하기</span>
        </button>
      </div>

      {/* 3. 필터 바 & 컨트롤 */}
      {/* rounded-2xl -> rounded-3xl, p-5 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-5">
        
        {/* [왼쪽] 검색창 */}
        <div className="relative flex-1 min-w-[280px]">
          {/* 아이콘 위치: left-5 */}
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="굿즈 이름 검색 (예: 유니 아크릴)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // 패딩: pl-14 (56px) 적용, rounded-2xl
            className="w-full pl-14 pr-5 py-3.5 bg-slate-50/80 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 text-sm text-slate-700 font-medium"
          />
        </div>

        {/* [오른쪽] 필터 버튼 그룹 */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* 지역 선택 */}
          <button
            onClick={() => setIsRegionModalOpen(true)}
            // rounded-2xl 적용
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-bold transition-all whitespace-nowrap min-w-[130px] justify-between group",
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

          <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block" />

          {/* 택배 (Blue Theme) */}
          <button
            onClick={() => setDeliveryOnly(!deliveryOnly)}
            // rounded-2xl 적용
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm transition-all font-bold whitespace-nowrap",
              deliveryOnly 
                ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm ring-1 ring-blue-100" 
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            )}
          >
            <Box className={cn("w-4 h-4", deliveryOnly ? "fill-blue-100" : "")} /> 택배가능
          </button>

          {/* 거래중 (Slate Theme) */}
          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            // rounded-2xl 적용
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm transition-all font-bold whitespace-nowrap",
              hideCompleted
                ? "bg-slate-800 border-slate-800 text-white shadow-md ring-2 ring-slate-200"
                : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            )}
          >
            <Filter className="w-4 h-4" /> 거래중만 보기
          </button>
        </div>
      </div>

      {/* 리스트 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <div 
              key={trade.id} 
              // rounded-3xl 적용, 테두리 색상 파스텔톤(Teal)으로 변경
              className={cn(
                "group relative bg-white rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full overflow-hidden",
                trade.status === 'completed' 
                  ? 'border-slate-100 opacity-70 bg-slate-50 grayscale-[0.5]' 
                  : 'border-slate-100 hover:border-teal-200 hover:shadow-teal-100/40'
              )}
            >
              {/* 상단 정보 */}
              <div className="p-6 pb-2 flex justify-between items-start">
                <div className="flex gap-2">
                  <span className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors",
                    trade.status === 'active' 
                      ? "bg-teal-50 text-teal-600 border-teal-100" 
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", trade.status === 'active' ? "bg-teal-400 animate-pulse" : "bg-slate-400")} />
                    {trade.status === 'active' ? '교환중' : '교환완료'}
                  </span>
                  {trade.isDeliveryAvailable && (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                      <Box className="w-3.5 h-3.5" /> 택배
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium px-2.5 py-1.5 rounded-xl bg-slate-50">
                  <MapPin className="w-3.5 h-3.5 text-slate-300" />
                  {trade.region}
                </div>
              </div>

              {/* 메인: HAVE <-> WANT */}
              <div className="flex-1 px-6 py-3 space-y-4">
                
                {/* HAVE 섹션 (Teal Theme) */}
                {/* rounded-2xl 적용 */}
                <div className="bg-teal-50/30 rounded-2xl border border-teal-100/60 p-5 relative group-hover:bg-teal-50/50 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-extrabold text-teal-600 bg-teal-100/80 px-2.5 py-1 rounded-lg tracking-wide">
                      HAVE
                    </span>
                    <span className="text-xs text-teal-600/70 font-medium">보유 굿즈</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trade.haveItems.map((item, idx) => (
                      <span key={idx} className="text-sm font-bold text-teal-800 bg-white px-3 py-2 rounded-xl border border-teal-100/50 shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 화살표 아이콘 */}
                <div className="flex justify-center -my-6 relative z-10">
                  <div className="bg-white p-2 rounded-full border border-slate-100 text-slate-300 shadow-sm group-hover:text-teal-400 group-hover:border-teal-100 transition-colors">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                </div>

                {/* WANT 섹션 (Pink Theme) */}
                {/* rounded-2xl 적용 */}
                <div className="bg-pink-50/30 rounded-2xl border border-pink-100/60 p-5 relative group-hover:bg-pink-50/50 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-extrabold text-pink-600 bg-pink-100/80 px-2.5 py-1 rounded-lg tracking-wide">
                      WANT
                    </span>
                    <span className="text-xs text-pink-600/70 font-medium">구하는 굿즈</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trade.wantItems.map((item, idx) => (
                      <span key={idx} className="text-sm font-bold text-pink-800 bg-white px-3 py-2 rounded-xl border border-pink-100/50 shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 하단 액션 */}
              <div className="px-6 py-5 mt-2 bg-gradient-to-b from-white to-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                     <span className="font-bold text-slate-600">{trade.author.name}</span>
                     {trade.author.level === 'cafe' && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-lg font-medium">
                          카페인증
                        </span>
                     )}
                  </div>
                   <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Clock className="w-3 h-3" /> {formatDate(trade.createdAt)}
                   </div>
                </div>
                
                <a 
                  href={trade.openChatLink} 
                  target="_blank" 
                  rel="noreferrer"
                  // rounded-xl 적용
                  className={cn(
                    "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95",
                    trade.status === 'active'
                      ? "bg-[#FAE100] text-[#371D1E] hover:bg-[#FCE620] hover:shadow-md border border-[#F5DA00]/50" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  )}
                  onClick={(e) => trade.status === 'completed' && e.preventDefault()}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  오픈톡
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white/50 rounded-[32px] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-700 font-bold text-lg mb-2">조건에 맞는 교환글이 없습니다.</p>
            <p className="text-slate-400 text-sm">
              다른 검색어나 필터를 시도해보시거나,<br/>
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
