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
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
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

  // ✅ [디자인 포인트] 달력 아이콘 배경색 (투명하게 처리하거나 심플하게)
  const getEventIconClass = (type: ScheduleItem['type']) => {
    return "text-2xl drop-shadow-sm";
  };

  return (
    // 전체 컨테이너: 배경 투명 (MainLayout 배경 사용)
    <div className="w-full h-full flex gap-8">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

        {/* =======================
            1. [Left] Details Panel
            ✅ 디자인 변경: 깔끔한 흰색 카드, 하단 정보 박스 분리
           ======================= */}
        <div className="w-[340px] flex-none bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden h-full">
          {selectedEvent ? (
            <div className="animate-in fade-in zoom-in duration-300 h-full flex flex-col items-center w-full">
               
               {/* 아이콘 박스 */}
               <div className="w-28 h-28 flex-shrink-0 aspect-square mx-auto bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center text-5xl mb-6 border border-gray-50 mt-4">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              {/* 태그 */}
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-purple-50 text-purple-600 text-[11px] font-bold uppercase tracking-widest">
                {selectedEvent.type}
              </div>

              {/* 제목 */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight text-center break-keep">
                {selectedEvent.title}
              </h2>
              
              {/* 설명 */}
              <p className="text-sm text-gray-400 mb-8 leading-relaxed text-center px-2 break-keep line-clamp-2">
                {selectedEvent.description}
              </p>

              {/* ✅ [디자인 포인트] 하단 Date/Location 카드 (이미지와 동일하게 구현) */}
              <div className="w-full bg-white rounded-[24px] p-5 text-left border border-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.03)] mt-auto mb-2">
                <div className="flex flex-col gap-5">
                  
                  {/* Date Row */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                      <CalendarIcon size={18} />
                    </div>
                    <div className="min-w-0 flex flex-col pt-0.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Date</p>
                      <p className="text-[13px] font-bold text-gray-700">
                        {new Date(selectedEvent.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}.
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-gray-50"></div>

                  {/* Location Row */}
                   <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0 flex flex-col pt-0.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Location</p>
                      <p className="text-[13px] font-bold text-gray-700">Seoul, Korea</p>
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
            ✅ 디자인 변경: 완전히 하얀 배경, 노란색 선택 원, 깔끔한 그리드
           ======================= */}
        <div className="flex-1 min-w-0 bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 px-2 pt-2">
            <h3 className="text-gray-800 font-bold flex items-center gap-2 text-[26px] tracking-tight">
              <span className="text-purple-500"><CalendarIcon className="w-7 h-7" /></span>
              {monthNames[currentDate.getMonth()]} <span className="text-gray-300 font-light">{currentDate.getFullYear()}</span>
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
              <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 px-1 pb-2">
            <div className="grid grid-cols-7 gap-y-2 gap-x-2 h-full content-start">
              {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const event = getEventsForDate(day);
                const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
                const isSelected = selectedEvent && new Date(selectedEvent.date).getDate() === day && new Date(selectedEvent.date).getMonth() === currentDate.getMonth();

                return (
                  <button
                    key={day}
                    onClick={() => event && setSelectedEvent(event)}
                    className={`
                      w-full aspect-[0.9] rounded-2xl flex flex-col items-center justify-start pt-2 relative transition-all duration-200 group
                      ${event ? 'hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-default'}
                    `}
                  >
                    {/* ✅ [디자인 포인트] 선택된 날짜: 노란색(파스텔톤) 원형 배경 */}
                    <div className={`
                      w-8 h-8 flex items-center justify-center rounded-full text-[15px] mb-1 transition-all
                      ${isSelected ? 'bg-[#FCEDAF] text-gray-800 font-bold shadow-sm' : ''}
                      ${!isSelected && isToday ? 'text-purple-600 font-bold' : ''}
                      ${!isSelected && !isToday && event ? 'text-gray-700 font-medium' : ''}
                    `}>
                      {day}
                    </div>

                    {/* 이벤트 아이콘 (날짜 아래에 배치) */}
                    {event && (
                      <span className={`
                        mt-1 text-xl transition-transform duration-300 
                        ${isSelected ? 'scale-110' : 'group-hover:-translate-y-1 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100'}
                      `}>
                        {getEventIcon(event.type)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =======================
            3. [Right] Upcoming Panel
            ✅ 디자인 변경: 깔끔한 리스트, 활성 아이템 보라색 배경, 왼쪽 날짜/오른쪽 내용 분리
           ======================= */}
        <div className="w-[320px] flex-none bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden h-full">
          <div className="flex items-center gap-2 mb-6 pl-1 flex-shrink-0">
            <Clock className="w-5 h-5 text-purple-500" />
            <h4 className="text-gray-800 font-bold text-lg">Upcoming</h4>
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
                    w-full px-5 py-4 rounded-[20px] transition-all duration-200 text-left flex items-start gap-5 group
                    ${isSelected 
                      ? 'bg-purple-50 shadow-sm' 
                      : 'hover:bg-gray-50 bg-white border border-transparent'}
                  `}
                >
                  {/* 날짜 영역 (왼쪽) */}
                  <div className="flex flex-col items-center justify-center min-w-[2.5rem] pt-0.5">
                    <span className={`text-[11px] font-bold uppercase mb-0.5 ${isSelected ? 'text-purple-500' : 'text-gray-400'}`}>
                      {monthNames[eventDate.getMonth()].slice(0, 3)}
                    </span>
                    <span className={`text-xl font-bold leading-none ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                      {eventDate.getDate()}
                    </span>
                  </div>
                  
                  {/* 내용 영역 (오른쪽) */}
                  <div className="min-w-0 flex-1 flex flex-col justify-center h-full pt-0.5">
                    <p className={`text-[14px] font-bold truncate leading-tight mb-1 ${isSelected ? 'text-gray-800' : 'text-gray-700'}`}>
                      {event.title}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide truncate">
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
