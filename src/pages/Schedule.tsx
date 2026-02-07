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
  
  // 기준 날짜를 2026년 2월로 설정 (이미지와 동일하게)
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

  // ✅ [핵심] 미니멀한 날짜 스타일 (원형 배경)
  const getDateStyle = (event: ScheduleItem | undefined, isToday: boolean, isSelected: boolean) => {
    const baseStyle = "w-10 h-10 flex items-center justify-center rounded-full text-[15px] transition-all duration-200 mb-2";
    
    // 1. 오늘 날짜 (이벤트 유무 상관없이 회색 테두리 원)
    if (isToday) {
      return `${baseStyle} border-[1.5px] border-gray-400 text-gray-500 bg-transparent font-medium`;
    }

    // 2. 이벤트가 있는 경우 (파스텔 톤 배경)
    if (event) {
      if (event.type === 'birthday') {
        return `${baseStyle} bg-[#FCE7F3] text-[#9D174D] font-bold`; // 연한 핑크 (생일)
      }
      return `${baseStyle} bg-[#DCFCE7] text-[#166534] font-bold`; // 연한 민트 (일반 이벤트)
    }

    // 3. 기본 날짜
    return `${baseStyle} text-gray-400 hover:bg-gray-50 font-medium`;
  };

  return (
    <div className="w-full h-full flex gap-6">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

        {/* =======================
            1. [Left] Details Panel
           ======================= */}
        <div className="w-[300px] flex-none bg-white rounded-[24px] p-6 shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex flex-col relative overflow-hidden h-full border border-gray-50">
          {selectedEvent ? (
            <div className="animate-in fade-in zoom-in duration-300 h-full flex flex-col items-center w-full pt-4">
               
               {/* 아이콘 박스 (더 심플하게) */}
               <div className="w-24 h-24 flex-shrink-0 aspect-square mx-auto bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-center text-4xl mb-5 border border-gray-50">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              <div className="inline-flex items-center justify-center px-4 py-1 mb-5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-widest">
                {selectedEvent.type}
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight text-center break-keep line-clamp-2 h-[3.5rem] flex items-center justify-center px-2">
                {selectedEvent.title}
              </h2>
              
              <p className="text-xs text-gray-400 mb-6 leading-relaxed text-center px-4 break-keep line-clamp-3">
                {selectedEvent.description}
              </p>

              {/* 하단 정보 카드 (미니멀 디자인) */}
              <div className="w-full bg-[#FAFAFA] rounded-[20px] p-5 text-left border border-gray-100 mt-auto mb-2">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-purple-400 shadow-sm shrink-0">
                      <CalendarIcon size={16} />
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Date</p>
                      <p className="text-[13px] font-bold text-gray-700">
                        {new Date(selectedEvent.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}.
                      </p>
                    </div>
                  </div>

                   <div className="flex items-center gap-4">
                     <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-pink-400 shadow-sm shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Location</p>
                      <p className="text-[13px] font-bold text-gray-700">Seoul, Korea</p>
                    </div>
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
           ======================= */}
        <div className="flex-1 min-w-0 bg-white rounded-[24px] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex flex-col overflow-hidden h-full border border-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-gray-800 font-bold flex items-center gap-2 text-[22px] tracking-tight">
              <span className="text-purple-500"><CalendarIcon className="w-6 h-6" /></span>
              {monthNames[currentDate.getMonth()]} <span className="text-purple-200 font-medium">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="w-8 h-8 hover:bg-gray-50 rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <button onClick={nextMonth} className="w-8 h-8 hover:bg-gray-50 rounded-full flex items-center justify-center transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-4 px-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 px-1">
            <div className="grid grid-cols-7 gap-y-2 gap-x-2 content-start">
              {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const event = getEventsForDate(day);
                
                // 오늘 날짜 (2026-02-07 고정)
                const isToday = day === 7 && currentDate.getMonth() === 1 && currentDate.getFullYear() === 2026;
                const isSelected = selectedEvent && new Date(selectedEvent.date).getDate() === day && new Date(selectedEvent.date).getMonth() === currentDate.getMonth();

                return (
                  <button
                    key={day}
                    onClick={() => event && setSelectedEvent(event)}
                    className="flex flex-col items-center justify-center w-full aspect-square relative group"
                    disabled={!event && !isToday}
                  >
                    {/* ✅ [수정] 원형 날짜 배경 (아이콘 제거) */}
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
           ======================= */}
        <div className="w-[300px] flex-none bg-white rounded-[24px] p-6 shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex flex-col overflow-hidden h-full border border-gray-50">
          <div className="flex items-center gap-2 mb-6 pl-1 flex-shrink-0">
            <Clock className="w-4 h-4 text-purple-500" />
            <h4 className="text-gray-800 font-bold text-[15px]">Upcoming</h4>
          </div>
           
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pr-1 pb-2">
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
                    w-full px-4 py-3.5 rounded-[18px] transition-all duration-200 text-left flex items-start gap-4 group
                    ${isSelected 
                      ? 'bg-[#FAF5FF] shadow-sm' 
                      : 'hover:bg-gray-50 bg-white border border-transparent'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center min-w-[2.5rem] pt-0.5">
                    <span className={`text-[10px] font-bold uppercase mb-0.5 ${isSelected ? 'text-purple-500' : 'text-gray-400'}`}>
                      {monthNames[eventDate.getMonth()].slice(0, 3)}
                    </span>
                    <span className={`text-lg font-bold leading-none ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>
                      {eventDate.getDate()}
                    </span>
                  </div>
                  
                  <div className="min-w-0 flex-1 flex flex-col justify-center h-full pt-0.5">
                    <p className={`text-[13px] font-bold truncate leading-tight mb-1 ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
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
  );
}
