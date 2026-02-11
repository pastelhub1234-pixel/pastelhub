import React, { useState, useEffect } from "react";
import { MapPin, X, ChevronRight, Check } from "lucide-react";
import { cn } from "../lib/utils";

// 데이터는 기존과 동일하게 유지
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        style={{ width: '540px', height: '540px', maxWidth: '95vw', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. 헤더 */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h3 className="font-extrabold text-slate-800 flex items-center gap-2.5 text-lg">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <MapPin className="w-5 h-5" />
            </div>
            지역 선택
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 컨텐츠 영역 (좌우 분할) */}
        {/* ✅ [수정] 높이 고정 (h-[400px]) - 스크롤 영역 확보 */}
        <div className="flex-1 flex overflow-hidden h-[400px] bg-white">
          
          {/* [좌측] 시/도 리스트 (35% 너비) */}
          <div className="w-[35%] bg-slate-50 border-r border-slate-100 overflow-y-auto custom-scrollbar">
            {MAIN_REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setTempMain(region);
                  setTempSub("");
                  // 하위 지역이 없거나 '전체'인 경우 자동 선택
                  if (region === "전체" || REGION_DATA[region].length === 0) {
                    setTempSub("전체");
                  }
                }}
                className={cn(
                  "w-full text-left px-5 py-3.5 text-sm font-medium transition-all flex justify-between items-center relative",
                  tempMain === region
                    ? "bg-white text-indigo-700 font-bold shadow-sm z-10" // 선택됨: 흰색 배경 + 그림자
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700" // 기본
                )}
              >
                {/* 선택 시 좌측 인디케이터 바 */}
                {tempMain === region && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                )}
                {region}
                {tempMain === region && (
                  <ChevronRight className="w-4 h-4 text-indigo-500" />
                )}
              </button>
            ))}
          </div>

          {/* [우측] 시/군/구 리스트 (65% 너비) */}
          <div className="flex-1 overflow-y-auto bg-white p-5 custom-scrollbar">
            {tempMain !== "전체" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* 전체 선택 버튼 */}
                <button
                  onClick={() => setTempSub("전체")}
                  className={cn(
                    "px-2 py-2.5 rounded-xl text-xs font-bold border text-center transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95",
                    tempSub === "전체" || tempSub === ""
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-200"
                      : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
                  )}
                >
                  {tempSub === "전체" && <Check className="w-3.5 h-3.5" />}
                  전체
                </button>

                {/* 세부 지역 리스트 */}
                {REGION_DATA[tempMain]?.map(
                  (sub) =>
                    sub !== "전체" && (
                      <button
                        key={sub}
                        onClick={() => setTempSub(sub)}
                        className={cn(
                          "px-2 py-2.5 rounded-xl text-xs font-bold border text-center transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95",
                          tempSub === sub
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-200"
                            : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
                        )}
                      >
                        {tempSub === sub && <Check className="w-3.5 h-3.5" />}
                        {sub}
                      </button>
                    )
                )}
              </div>
            ) : (
              // 시/도 미선택 시 안내
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm gap-3">
                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                  <MapPin className="w-6 h-6 text-slate-300" />
                </div>
                <p>좌측에서 지역을 먼저 선택해주세요</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. 푸터 */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="text-sm text-slate-500">
            선택된 지역:{" "}
            <span className="font-bold text-indigo-600 ml-1.5 bg-indigo-50 px-2 py-0.5 rounded text-xs border border-indigo-100">
              {tempMain}
              {tempSub && tempSub !== "전체" ? ` · ${tempSub}` : ""}
            </span>
          </div>
          <button
            onClick={() => {
              onSelect(tempMain, tempSub || "전체");
              onClose();
            }}
            disabled={!tempMain}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
          >
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}
