import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Info } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
import { ScheduleItem } from '../types';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Schedule() {
  const { data: schedules } = useJsonData<ScheduleItem[]>('schedules');
  
  // 기준 날짜 (2026년 2월)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); 
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    if (schedules && schedules.length > 0 && !selectedEvent) {
      setSelectedEvent(schedules[0]);
    }
  }, [schedules]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { 
      daysInMonth: lastDay.getDate(), 
      startingDayOfWeek: firstDay.getDay() 
    };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedEvent(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedEvent(null);
  };

  const getEventsForDate = (day: number) => {
    if (!schedules) return null;
    return schedules.find((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === currentDate.getFullYear() &&
        itemDate.getMonth() === currentDate.getMonth() &&
        itemDate.getDate() === day
      );
    });
  };

  const getEventIcon = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'album': return '💿';
      case 'concert': return '🎤';
      case 'broadcast': return '📺';
      case 'event': return '🎉';
      default: return '📅';
    }
  };

  // ✅ [디자인 수정] 달력 날짜 스타일 (미니멀 원형)
  // - 이미지를 참고하여 녹색(일반) / 핑크(생일) / 회색 테두리(오늘) 적용
  const getDateStyle = (event: ScheduleItem | undefined, isToday: boolean, isSelected: boolean) => {
    // 기본 베이스: 36px 원형 (콤팩트)
    const baseStyle = "w-9 h-9 flex items-center justify-center rounded-full text-[14px] transition-all duration-200 mb-1";
    
    // 1. 선택된 날짜 (가장 우선) - 진한 테두리나 그림자 추가
    const selectedStyle = isSelected ? "ring-2 ring-gray-300 ring-offset-1" : "";

    // 2. 이벤트가 있는 경우 (파스텔 톤 배경)
    if (event) {
      if (event.type === 'birthday') {
        return `${baseStyle} ${selectedStyle} bg-[#FCE7F3] text-[#BE185D] font-bold`; // 핑크 (생일)
      }
      return `${baseStyle} ${selectedStyle} bg-[#DCFCE7] text-[#15803D] font-bold`; // 그린 (일반)
    }

    // 3. 오늘 날짜 (이벤트 없을 때 회색 테두리)
    if (isToday) {
      return `${baseStyle} ${selectedStyle} border-[1.5px] border-gray-300 text-gray-600 font-semibold`;
    }

    // 4. 평일
    return `${baseStyle} ${selectedStyle} text-gray-400 hover:bg-gray-50`;
  };

  return (
    // ✅ 전체 높이 고정 (h-[500px]) 및 중앙 정렬
    <div className="w-full h-full flex justify-center items-center p-4">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 컨테이너: 최대 너비 제한, 높이 고정, Flex 레이아웃 */}
      <div className="w-full max-w-[1080px] h-[500px] flex gap-4">
        
        {/* =======================
            1. [Left] Details Panel
            ✅ 디자인: 화이트 카드, 그림자, 하단 정보박스 분리
           ======================= */}
        <div className="w-[280px] flex-none bg-white rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col relative overflow-hidden h-full border border-gray-100/50">
          {selectedEvent ? (
            <div className="animate-in fade-in zoom-in duration-300 h-full flex flex-col items-center w-full pt-2">
               
               {/* 아이콘 박스 */}
               <div className="w-[72px] h-[72px] flex-shrink-0 aspect-square mx-auto bg-white rounded-[18px] shadow-sm flex items-center justify-center text-3xl mb-4 border border-gray-100">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              {/* 태그 */}
              <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-[#F3E8FF] text-[#7E22CE] text-[10px] font-bold uppercase tracking-widest">
                {selectedEvent.type}
              </div>

              {/* 제목 */}
              <h2 className="text-lg font-bold text-gray-800 mb-2 leading-tight text-center break-keep line-clamp-2 h-[3rem] flex items-center justify-center px-2">
                {selectedEvent.title}
              </h2>
              
              {/* 설명 */}
              <p className="text-xs text-gray-400 mb-4 leading-relaxed text-center px-2 break-keep line-clamp-3 h-[3rem] overflow-hidden">
                {selectedEvent.description}
              </p>

              {/* 하단 정보 박스 (이미지와 동일한 스타일) */}
              <div className="w-full bg-[#FAFAFA] rounded-[18px] p-4 text-left border border-gray-100 space-y-3 mt-auto mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[#A855F7] shadow-sm shrink-0">
                    <CalendarIcon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Date</p>
                    <p className="text-[12px] font-bold text-gray-700 mt-0.5 truncate">
                      {new Date(selectedEvent.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}.
                    </p>
                  </div>
                </div>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[#EC4899] shadow-sm shrink-0">
                    <MapPin size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Location</p>
                    <p className="text-[12px] font-bold text-gray-700 mt-0.5 truncate">Seoul, Korea</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3 select-none opacity-50">
              <Info className="w-10 h-10 opacity-20" />
              <p className="text-xs font-medium">일정을 선택해주세요</p>
            </div>
          )}
        </div>

        {/* =======================
            2. [Center] Calendar (Minimal)
            ✅ 디자인: 전체적인 크기 축소, 버튼 명확화, 그리드 콤팩트
           ======================= */}
        <div className="flex-1 min-w-0 bg-white rounded-[24px] px-6 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden h-full border border-gray-100/50">
          {/* Header: 월/연도 좌측, 버튼 우측 */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0 pl-1 pr-1 mt-1">
            <h3 className="text-gray-800 font-bold flex items-center gap-2 text-xl tracking-tight">
              <span className="text-[#A855F7]"><CalendarIcon className="w-5 h-5" /></span>
              {monthNames[currentDate.getMonth()]} <span className="text-gray-300 font-normal">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-1">
              {/* 버튼 스타일 개선: hover 효과 및 크기 확보 */}
              <button onClick={previousMonth} className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-500">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-2 px-1 flex-shrink-0">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid: gap-1로 아주 콤팩트하게 */}
          <div className="flex-1 px-1">
            <div className="grid grid-cols-7 gap-y-1 gap-x-1 content-start">
              {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const event = getEventsForDate(day);
                const isToday = day === 7 && currentDate.getMonth() === 1 && currentDate.getFullYear() === 2026;
                const isSelected = selectedEvent && new Date(selectedEvent.date).getDate() === day && new Date(selectedEvent.date).getMonth() === currentDate.getMonth();

                return (
                  <button
                    key={day}
                    onClick={() => event && setSelectedEvent(event)}
                    className="flex flex-col items-center justify-center w-full aspect-square relative group"
                    disabled={!event && !isToday}
                  >
                    <div className={getDateStyle(event, isToday, !!isSelected)}>
                      {day}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =======================
            3. [Right] Upcoming Panel
            ✅ 디자인: Upcoming 중앙 정렬
           ======================= */}
        <div className="w-[280px] flex-none bg-white rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col h-full overflow-hidden border border-gray-100/50">
          
          {/* ✅ [수정] 헤더 중앙 정렬 (justify-center) */}
          <div className="flex items-center justify-center gap-2 mb-4 flex-shrink-0 pt-1">
            <Clock className="w-4 h-4 text-[#A855F7]" />
            <h4 className="text-gray-800 font-bold text-[15px]">Upcoming</h4>
          </div>
           
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide pr-1 pb-1">
            {schedules?.map((event) => {
              const eventDate = new Date(event.date);
              const isSelected = selectedEvent?.id === event.id;
              
              return (
                <button
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setCurrentDate(new Date(event.date));
                  }}
                  className={`
                    w-full px-4 py-3 rounded-[16px] transition-all duration-200 text-left flex items-start gap-4 group
                    ${isSelected 
                      ? 'bg-[#FAF5FF] shadow-sm ring-1 ring-[#F3E8FF]' // 선택: 연보라 배경
                      : 'hover:bg-gray-50 bg-white border border-transparent'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center min-w-[2.5rem] pt-0.5">
                    <span className={`text-[10px] font-bold uppercase mb-0.5 ${isSelected ? 'text-[#9333EA]' : 'text-gray-400'}`}>
                      {monthNames[eventDate.getMonth()].slice(0, 3)}
                    </span>
                    <span className={`text-lg font-bold leading-none ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                      {eventDate.getDate()}
                    </span>
                  </div>
                  
                  <div className="min-w-0 flex-1 flex flex-col justify-center h-full pt-0.5">
                    <p className={`text-[13px] font-bold truncate leading-tight mb-1 ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                      {event.title}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide truncate">
                      {event.type}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
