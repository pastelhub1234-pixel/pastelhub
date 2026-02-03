import React, { useState, useEffect } from "react";
import { MapPin, X, ChevronRight, Check } from "lucide-react";
import { cn } from "../lib/utils"; 

export const REGION_DATA: Record<string, string[]> = {
  전체: [],
  서울: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  경기: ["수원시", "고양시", "용인시", "성남시", "부천시", "화성시", "안산시", "남양주시", "안양시", "평택시", "시흥시", "파주시", "의정부시", "김포시", "광주시", "광명시", "군포시", "하남시", "오산시", "양주시", "이천시", "구리시", "안성시", "포천시", "의왕시", "양평군", "여주시", "동두천시", "가평군", "과천시", "연천군"],
  인천: ["전체", "중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  부산: ["전체"],
  대구: ["전체"],
  광주: ["전체"],
  대전: ["전체"],
  울산: ["전체"],
  강원: ["전체"],
  경남: ["전체"],
  경북: ["전체"],
  전남: ["전체"],
  전북: ["전체"],
  충남: ["전체"],
  충북: ["전체"],
  제주: ["전체"],
  전국: ["전체"],
};

const MAIN_REGIONS = Object.keys(REGION_DATA);

interface RegionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (main: string, sub: string) => void;
  selectedMain: string;
  selectedSub: string;
}

export function RegionSelector({
  isOpen,
  onClose,
  onSelect,
  selectedMain,
  selectedSub,
}: RegionSelectorProps) {
  const [tempMain, setTempMain] = useState(selectedMain);
  const [tempSub, setTempSub] = useState(selectedSub);

  useEffect(() => {
    if (isOpen) {
      setTempMain(selectedMain);
      setTempSub(selectedSub);
    }
  }, [isOpen, selectedMain, selectedSub]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        // ✅ [수정 1] 위치 및 크기 조정
        // -mt-20: 중앙보다 살짝 위로 올림
        // max-w-md: 너비를 기존 lg보다 작게 설정
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md -mt-20 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        {/* ✅ [수정 2] 패딩 축소 (px-5 py-4 -> px-4 py-3) */}
        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-violet-500" />
            </div>
            지역 선택
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 컨텐츠 (2단 컬럼) */}
        {/* ✅ [수정 3] 높이 축소 (min-h-[320px] -> h-[280px]) */}
        <div className="flex-1 flex overflow-hidden h-[280px] bg-slate-50/50">
          
          {/* 1. 시/도 선택 */}
          <div className="w-[38%] bg-white border-r border-slate-100 overflow-y-auto custom-scrollbar">
            {MAIN_REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setTempMain(region);
                  setTempSub("");
                  if (region === "전체" || REGION_DATA[region].length === 0) {
                    setTempSub("전체");
                  }
                }}
                className={cn(
                  // ✅ [수정 4] 리스트 패딩 축소 (py-3.5 -> py-2.5)
                  "w-full text-left px-4 py-2.5 text-sm font-medium transition-all flex justify-between items-center border-l-4",
                  tempMain === region
                    ? "bg-violet-50 text-violet-700 border-l-violet-500"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 border-l-transparent"
                )}
              >
                {region}
                {tempMain === region && (
                  <ChevronRight className="w-3.5 h-3.5 text-violet-400" />
                )}
              </button>
            ))}
          </div>

          {/* 2. 시/군/구 선택 */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {tempMain !== "전체" ? (
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setTempSub("전체")}
                  className={cn(
                    // ✅ [수정 5] 버튼 패딩 축소 (py-2.5 -> py-2)
                    "px-2 py-2 rounded-xl text-xs font-medium border text-center transition-all flex items-center justify-center gap-1 shadow-sm",
                    tempSub === "전체" || tempSub === ""
                      ? "bg-violet-500 border-violet-500 text-white shadow-violet-200"
                      : "bg-white border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 hover:bg-white"
                  )}
                >
                  {tempSub === "전체" && <Check className="w-3 h-3" />}
                  전체
                </button>
                {REGION_DATA[tempMain]?.map(
                  (sub) =>
                    sub !== "전체" && (
                      <button
                        key={sub}
                        onClick={() => setTempSub(sub)}
                        className={cn(
                          "px-2 py-2 rounded-xl text-xs font-medium border text-center transition-all flex items-center justify-center gap-1 shadow-sm",
                          tempSub === sub
                            ? "bg-violet-500 border-violet-500 text-white shadow-violet-200"
                            : "bg-white border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600 hover:bg-white"
                        )}
                      >
                        {tempSub === sub && <Check className="w-3 h-3" />}
                        {sub}
                      </button>
                    )
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                  <MapPin className="w-5 h-5 text-slate-300" />
                </div>
                <p>좌측에서 시/도를 선택해주세요</p>
              </div>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center bg-white">
          <div className="text-xs text-slate-500">
            선택:{" "}
            <span className="font-bold text-violet-600 ml-1">
              {tempMain}
              {tempSub && tempSub !== "전체" ? ` ${tempSub}` : ""}
            </span>
          </div>
          <button
            onClick={() => {
              onSelect(tempMain, tempSub || "전체");
              onClose();
            }}
            disabled={!tempMain}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}