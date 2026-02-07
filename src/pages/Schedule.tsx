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
  
  // 기준 날짜를 2026년 2월로 설정
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

  // ✅ 달력 날짜 배경색 로직 (이미지 참고)
  const getDateCellStyle = (event: ScheduleItem | undefined, isToday: boolean, isSelected: boolean) => {
    // 1. 오늘 날짜
    if (isToday) return 'border-[1.5px] border-gray-400 text-gray-600 bg-white';
    
    // 2. 이벤트가 있는 경우
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
    // ✅ [수정 1] 전체 컨테이너에 p-4 추가 (위아래 좌우 여백 확보) 및 gap-4로 축소
    <div className="w-full h-full flex gap-4 p-4">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

        {/* =======================
            1. [Left] Details Panel
            ✅ 너비 축소: w-[340px] -> w-[280px]
            ✅ 패딩 축소: p-8 -> p-5
           ======================= */}
        <div className="w-[280px] flex-none bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden h-full">
          {selectedEvent ? (
            <div className="animate-in fade-in zoom-in duration-300 h-full flex flex-col items-center w-full pt-1">
               
               {/* 아이콘 크기 축소: w-28 -> w-20 */}
               <div className="w-20 h-20 flex-shrink-0 aspect-square mx-auto bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center text-4xl mb-4 border border-gray-50 mt-2">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-widest">
                {selectedEvent.type}
              </div>

              {/* 폰트 사이즈 및 마진 축소 */}
              <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight text-center break-keep line-clamp-2 h-[3rem] flex items-center justify-center">
                {selectedEvent.title}
              </h2>
              
              <p className="text-xs text-gray-400 mb-6 leading-relaxed text-center px-2 break-keep line-clamp-3">
                {selectedEvent.description}
              </p>

              {/* 하단 정보 박스 패딩 축소 */}
              <div className="w-full bg-white rounded-[20px] p-4 text-left border border-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.03)] mt-auto mb-1">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                      <CalendarIcon size={16} />
                    </div>
                    <div className="min-w-0 flex flex-col pt-0.5">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Date</p>
                      <p className="text-[13px] font-bold text-gray-800">
                        {new Date(selectedEvent.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}.
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-gray-50"></div>

                   <div className="flex items-start gap-3">
                     <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div className="min-w-0 flex flex-col pt-0.5">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Location</p>
                      <p className="text-[13px] font-bold text-gray-800">Seoul, Korea</p>
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
            2. [Center] Calendar
            ✅ 패딩 축소: p-10 -> p-6
            ✅ 헤더 마진 축소: mb-10 -> mb-4
           ======================= */}
        <div className="flex-1 min-w-0 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-gray-800 font-bold flex items-center gap-2 text-2xl tracking-tight">
              <CalendarIcon className="w-7 h-7 text-purple-500" />
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
          <div className="grid grid-cols-7 mb-2 px-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-y-2 gap-x-1 content-start">
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
                    {/* 날짜 숫자 배경색 */}
                    <div className={`
                      w-10 h-10 flex items-center justify-center rounded-[14px] text-[14px] transition-all duration-200
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
            ✅ 너비 축소: w-[320px] -> w-[280px]
            ✅ 패딩 축소: p-8 -> p-5
           ======================= */}
        <div className="w-[280px] flex-none bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden h-full">
          <div className="flex items-center gap-2 mb-4 pl-1 flex-shrink-0">
            <Clock className="w-4 h-4 text-purple-500" />
            <h4 className="text-gray-800 font-bold text-base">Upcoming</h4>
          </div>
           
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pr-1 pb-1">
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
                    w-full px-4 py-3 rounded-[18px] transition-all duration-200 text-left flex items-start gap-4 group
                    ${isSelected 
                      ? 'bg-[#F8F5FF] shadow-sm'  // 선택됨: 연보라색 배경
                      : 'hover:bg-gray-50 bg-white border border-transparent'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center min-w-[2.5rem] pt-0.5">
                    <span className={`text-[10px] font-bold uppercase mb-0.5 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`}>
                      {monthNames[eventDate.getMonth()].slice(0, 3)}
                    </span>
                    <span className={`text-lg font-bold leading-none ${isSelected ? 'text-purple-900' : 'text-gray-600'}`}>
                      {eventDate.getDate()}
                    </span>
                  </div>
                  
                  <div className="min-w-0 flex-1 flex flex-col justify-center h-full pt-0.5">
                    <p className={`text-[13px] font-bold truncate leading-tight mb-1 ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                      {event.title}
                    </p>
                    <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide truncate">
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
