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

  // ✅ [수정] 달력 날짜 배경색 로직 (이미지 참고)
  // 생일 -> 분홍색 배경
  // 그 외 이벤트 -> 연두색 배경
  const getDateCellStyle = (event: ScheduleItem | undefined, isToday: boolean, isSelected: boolean) => {
    // 1. 오늘 날짜 (이벤트 유무 상관없이 테두리)
    if (isToday) return 'border-[2px] border-gray-400 text-gray-600 bg-white';
    
    // 2. 이벤트가 있는 경우 (배경색 적용)
    if (event) {
      if (event.type === 'birthday') {
        return 'bg-[#FFECF0] text-[#E03E52] font-bold'; // 분홍색 (생일)
      }
      return 'bg-[#E3F6ED] text-[#2D8A63] font-bold'; // 연두색 (일반 이벤트)
    }

    // 3. 기본 날짜
    return 'text-gray-400 hover:bg-gray-50';
  };

  return (
    <div className="w-full h-full flex gap-8">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

        {/* =======================
            1. [Left] Details Panel
           ======================= */}
        <div className="w-[340px] flex-none bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden h-full">
          {selectedEvent ? (
            <div className="animate-in fade-in zoom-in duration-300 h-full flex flex-col items-center w-full">
               
               <div className="w-28 h-28 flex-shrink-0 aspect-square mx-auto bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center text-5xl mb-6 border border-gray-50 mt-4">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-5 rounded-full bg-purple-50 text-purple-600 text-[11px] font-bold uppercase tracking-widest">
                {selectedEvent.type}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight text-center break-keep line-clamp-2 h-[4rem] flex items-center">
                {selectedEvent.title}
              </h2>
              
              <p className="text-sm text-gray-400 mb-8 leading-relaxed text-center px-2 break-keep line-clamp-3">
                {selectedEvent.description}
              </p>

              <div className="w-full bg-white rounded-[24px] p-6 text-left border border-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.03)] mt-auto mb-2">
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                      <CalendarIcon size={18} />
                    </div>
                    <div className="min-w-0 flex flex-col pt-0.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Date</p>
                      <p className="text-[14px] font-bold text-gray-800">
                        {new Date(selectedEvent.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}.
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-gray-50"></div>

                   <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0 flex flex-col pt-0.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Location</p>
                      <p className="text-[14px] font-bold text-gray-800">Seoul, Korea</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4 select-none opacity-50">
              <Info className="w-12 h-12 opacity-20" />
              <p className="text-sm font-medium">일정을 선택해주세요</p>
            </div>
          )}
        </div>

        {/* =======================
            2. [Center] Calendar
            ✅ 이미지 스타일 적용: 넓은 간격, 둥근 사각형 날짜 배경
           ======================= */}
        <div className="flex-1 min-w-0 bg-white rounded-[32px] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 px-4">
            <h3 className="text-gray-800 font-bold flex items-center gap-3 text-[28px] tracking-tight">
              <CalendarIcon className="w-8 h-8 text-purple-500" />
              {monthNames[currentDate.getMonth()]} <span className="text-purple-200 font-medium">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="w-10 h-10 hover:bg-gray-50 rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-400" />
              </button>
              <button onClick={nextMonth} className="w-10 h-10 hover:bg-gray-50 rounded-full flex items-center justify-center transition-colors">
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-6 px-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-y-4 gap-x-2 content-start">
              {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const event = getEventsForDate(day);
                
                // 오늘 날짜 확인 (2026년 2월 7일 기준)
                const isToday = day === 7 && currentDate.getMonth() === 1 && currentDate.getFullYear() === 2026;
                const isSelected = selectedEvent && new Date(selectedEvent.date).getDate() === day && new Date(selectedEvent.date).getMonth() === currentDate.getMonth();

                return (
                  <button
                    key={day}
                    onClick={() => event && setSelectedEvent(event)}
                    className="flex flex-col items-center justify-center w-full aspect-square relative"
                    disabled={!event}
                  >
                    {/* ✅ [디자인 포인트] 날짜 숫자 배경색 (아이콘 대신 배경색으로 표현) */}
                    <div className={`
                      w-12 h-12 flex items-center justify-center rounded-[18px] text-[16px] transition-all duration-200
                      ${getDateCellStyle(event, isToday, !!isSelected)}
                    `}>
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
        <div className="w-[320px] flex-none bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden h-full">
          <div className="flex items-center gap-2 mb-6 pl-1 flex-shrink-0">
            <Clock className="w-5 h-5 text-purple-500" />
            <h4 className="text-gray-800 font-bold text-lg">Upcoming</h4>
          </div>
           
          <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pr-1 pb-2">
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
                    w-full px-5 py-4 rounded-[24px] transition-all duration-200 text-left flex items-start gap-5 group
                    ${isSelected 
                      ? 'bg-[#F8F5FF] shadow-sm'  // 선택됨: 연보라색 배경
                      : 'hover:bg-gray-50 bg-white border border-transparent'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center min-w-[2.5rem] pt-0.5">
                    <span className={`text-[11px] font-bold uppercase mb-0.5 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`}>
                      {monthNames[eventDate.getMonth()].slice(0, 3)}
                    </span>
                    <span className={`text-xl font-bold leading-none ${isSelected ? 'text-purple-900' : 'text-gray-600'}`}>
                      {eventDate.getDate()}
                    </span>
                  </div>
                  
                  <div className="min-w-0 flex-1 flex flex-col justify-center h-full pt-0.5">
                    <p className={`text-[14px] font-bold truncate leading-tight mb-1.5 ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
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
