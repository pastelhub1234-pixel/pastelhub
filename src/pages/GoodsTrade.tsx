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
import { cn } from "../lib/utils";
import { RegionSelector, REGION_DATA } from "./region-selector";

// 샘플 데이터 타입
interface TradeItem {
  id: string;
  haveItems: string[];
  wantItems: string[];
  region: string;
  status: "active" | "completed";
  isDeliveryAvailable: boolean;
  createdAt: string;
  openChatLink: string;
  author: {
    name: string;
    level: string;
  };
}

// 샘플 데이터
const SAMPLE_TRADES: TradeItem[] = [
  {
    id: "1",
    haveItems: ["유니 아크릴", "시온 포카"],
    wantItems: ["레이 아크릴", "레이 포카"],
    region: "서울 강남구",
    status: "active",
    isDeliveryAvailable: true,
    createdAt: "2024-01-15",
    openChatLink: "#",
    author: { name: "덕후123", level: "cafe" },
  },
  {
    id: "2",
    haveItems: ["앨범 포카 A", "앨범 포카 B"],
    wantItems: ["앨범 포카 C"],
    region: "경기 수원시",
    status: "active",
    isDeliveryAvailable: false,
    createdAt: "2024-01-14",
    openChatLink: "#",
    author: { name: "굿즈덕", level: "normal" },
  },
  {
    id: "3",
    haveItems: ["콘서트 슬로건"],
    wantItems: ["팬미팅 포카"],
    region: "인천 연수구",
    status: "completed",
    isDeliveryAvailable: true,
    createdAt: "2024-01-10",
    openChatLink: "#",
    author: { name: "컬렉터", level: "cafe" },
  },
  {
    id: "4",
    haveItems: ["시즌그리팅 포카", "다이어리"],
    wantItems: ["캘린더", "스티커"],
    region: "서울 마포구",
    status: "active",
    isDeliveryAvailable: true,
    createdAt: "2024-01-13",
    openChatLink: "#",
    author: { name: "굿즈매니아", level: "cafe" },
  },
  {
    id: "5",
    haveItems: ["럭키드로우 A", "럭키드로우 B"],
    wantItems: ["럭키드로우 C", "럭키드로우 D"],
    region: "부산",
    status: "active",
    isDeliveryAvailable: false,
    createdAt: "2024-01-12",
    openChatLink: "#",
    author: { name: "부산덕", level: "normal" },
  },
  {
    id: "6",
    haveItems: ["팬싸 포카 세트"],
    wantItems: ["응모권"],
    region: "대구",
    status: "active",
    isDeliveryAvailable: true,
    createdAt: "2024-01-11",
    openChatLink: "#",
    author: { name: "대구팬", level: "cafe" },
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

const MAIN_REGIONS = ["전체", ...Object.keys(REGION_DATA).filter(k => k !== "전체")];

export default function GoodsTrade() {
  const [isLoading] = useState(false);
  const trades = SAMPLE_TRADES;

  // --- State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [mainRegion, setMainRegion] = useState("전체");
  const [subRegion, setSubRegion] = useState("전체");
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  // --- Filter Logic ---
  const filteredTrades = useMemo(() => {
    if (!trades || !Array.isArray(trades)) return [];

    return trades.filter((trade) => {
      if (hideCompleted && trade.status === "completed") return false;
      if (deliveryOnly && !trade.isDeliveryAvailable) return false;

      // 지역 필터
      if (mainRegion !== "전체") {
        if (!trade.region.includes(mainRegion)) return false;
        if (
          subRegion !== "전체" &&
          subRegion !== "" &&
          !trade.region.includes(subRegion)
        )
          return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchTarget = [
          ...trade.haveItems,
          ...trade.wantItems,
          trade.region,
        ];
        return searchTarget.some((item) => item.toLowerCase().includes(query));
      }
      return true;
    });
  }, [trades, searchQuery, mainRegion, subRegion, deliveryOnly, hideCompleted]);

  // 메인 지역 변경 핸들러
  const handleMainRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMainRegion(e.target.value);
    setSubRegion("전체");
  };

  const handleRegionSelect = (main: string, sub: string) => {
    setMainRegion(main);
    setSubRegion(sub);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        {/* 헤더 */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-accent" />
              </div>
              굿즈 교환소
            </h1>
            <p className="text-muted-foreground text-sm mt-2 ml-[52px]">
              중복 굿즈는 교환하고, 없는 굿즈는 채워보세요
            </p>
          </div>
          <button className="bg-foreground hover:bg-foreground/90 text-background px-5 py-3 rounded-md font-semibold text-sm transition-all flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            교환글 쓰기
          </button>
        </header>

        {/* 주의사항 */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-foreground/80 leading-relaxed">
            <span className="font-semibold text-foreground">주의사항:</span>{" "}
            이곳은 순수한 <strong>물물교환(Barter)</strong>만을 위한 공간입니다.
            금전 요구, 계좌 거래 유도 행위 적발 시 이용이 제한될 수 있습니다.
          </p>
        </div>

        {/* 필터 바 */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-3">
          {/* 검색창 */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="굿즈 이름 검색 (예: 유니 아크릴)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-md focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all placeholder:text-muted-foreground text-sm text-foreground"
            />
          </div>

          {/* 필터 그룹 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 지역 선택 버튼 (모달 트리거) */}
            <button
              onClick={() => setIsRegionModalOpen(true)}
              className="flex items-center gap-2 pl-3 pr-3 py-2.5 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary transition-colors min-w-[130px]"
            >
              <MapPin className="w-4 h-4 text-accent" />
              <span className="truncate">
                {mainRegion === "전체"
                  ? "전체 지역"
                  : `${mainRegion}${subRegion !== "전체" ? ` ${subRegion}` : ""}`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
            </button>

            {/* 시/도 Select (숨김처리 - 모달 대체) */}
            <div className="relative hidden">
              <select
                value={mainRegion}
                onChange={handleMainRegionChange}
                className="appearance-none pl-9 pr-8 py-2.5 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent/30 cursor-pointer min-w-[110px]"
              >
                {MAIN_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

            {/* 토글 버튼들 */}
            <button
              onClick={() => setDeliveryOnly(!deliveryOnly)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 rounded-md border text-sm transition-all font-medium whitespace-nowrap",
                deliveryOnly
                  ? "bg-accent/10 border-accent/50 text-accent"
                  : "bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Box className="w-4 h-4" /> 택배
            </button>

            <button
              onClick={() => setHideCompleted(!hideCompleted)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 rounded-md border text-sm transition-all font-medium whitespace-nowrap",
                hideCompleted
                  ? "bg-foreground border-foreground text-background"
                  : "bg-card border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Filter className="w-4 h-4" /> 거래중
            </button>
          </div>
        </div>

        {/* 결과 카운트 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            총 <span className="font-semibold text-foreground">{filteredTrades.length}</span>개의 교환글
          </p>
        </div>

        {/* 리스트 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrades.length > 0 ? (
            filteredTrades.map((trade) => (
              <article
                key={trade.id}
                className={cn(
                  "group relative bg-card rounded-lg border transition-all hover:border-accent/30 flex flex-col h-full",
                  trade.status === "completed"
                    ? "border-border/50 opacity-60"
                    : "border-border"
                )}
              >
                {/* 상단 정보 */}
                <div className="p-4 pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-semibold",
                          trade.status === "active"
                            ? "bg-success/10 text-success"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {trade.status === "active" ? "교환중" : "완료"}
                      </span>
                      {trade.isDeliveryAvailable && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-accent/10 text-accent flex items-center gap-1">
                          <Box className="w-3 h-3" /> 택배
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(trade.createdAt)}
                    </span>
                  </div>

                  {/* 지역 */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    {trade.region}
                  </div>
                </div>

                {/* 메인: HAVE <-> WANT */}
                <div className="flex-1 px-4 space-y-3">
                  {/* HAVE */}
                  <div className="bg-secondary/50 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        HAVE
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {trade.haveItems.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium text-foreground bg-card px-2 py-1 rounded border border-border"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 화살표 */}
                  <div className="flex justify-center">
                    <div className="bg-secondary p-1.5 rounded-full text-muted-foreground">
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* WANT */}
                  <div className="bg-destructive/5 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">
                        WANT
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {trade.wantItems.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium text-foreground bg-card px-2 py-1 rounded border border-border"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 하단 액션 */}
                <div className="p-4 pt-4 flex items-center justify-between border-t border-border mt-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {trade.author.name}
                      </span>
                      {trade.author.level === "cafe" && (
                        <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded font-medium">
                          인증
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={trade.openChatLink}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all",
                      trade.status === "active"
                        ? "bg-[#FEE500] text-[#000000] hover:bg-[#FDD800]"
                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                    )}
                    onClick={(e) =>
                      trade.status === "completed" && e.preventDefault()
                    }
                  >
                    <ExternalLink className="w-3 h-3" /> 오픈톡
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                조건에 맞는 교환글이 없습니다
              </p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                다른 검색어나 필터를 시도해보세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 지역 선택 모달 */}
      <RegionSelector
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        onSelect={handleRegionSelect}
        selectedMain={mainRegion}
        selectedSub={subRegion}
      />
    </div>
  );
}