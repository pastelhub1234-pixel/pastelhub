import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Info } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
import { ScheduleItem } from '../types';

const monthNames = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
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

  const totalSlots = 42; 
  const calendarCells = [
    ...Array(startingDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ...Array(totalSlots - (startingDayOfWeek + daysInMonth)).fill(null)
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedEvent(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedEvent(null);
  };

  const getEventsForDate = (day: number | null) => {
    if (!day || !schedules) return null;
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

  const getEventColor = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'birthday': return 'bg-pink-100 text-pink-600 ring-pink-200';
      case 'album': return 'bg-purple-100 text-purple-600 ring-purple-200';
      case 'concert': return 'bg-blue-100 text-blue-600 ring-blue-200';
      case 'broadcast': return 'bg-yellow-100 text-yellow-700 ring-yellow-200';
      default: return 'bg-green-100 text-green-600 ring-green-200';
    }
  };

  return (
    <div className="w-full min-h-screen md:h-screen p-2 md:p-4 flex justify-center items-center overflow-y-auto md:overflow-hidden bg-gray-50/50">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 메인 레이아웃: 모바일 flex-col, 데스크톱 grid */}
      <div 
        className="w-full max-w-[1400px] flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-6 md:min-w-[1000px] md:h-[560px]"
      >
        
        {/* =======================
            1. 상세 정보 패널 (모바일: 하단 가로 / 데스크톱: 좌측 세로)
           ======================= */}
        <div className="order-2 md:order-1 col-span-1 bg-white/70 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-sm border border-white/60 flex flex-col justify-center h-auto md:h-full relative overflow-hidden">
          {selectedEvent ? (
            <div className="animate-in fade-in zoom-in duration-300 flex flex-row md:flex-col items-center gap-4 md:gap-0 md:justify-center w-full">
               
               {/* 이벤트 아이콘 - 모바일 크기 축소 */}
               <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0 aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl md:text-5xl md:mb-8 border border-purple-50">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              <div className="flex flex-col flex-1 md:items-center text-left md:text-center">
                {/* 이벤트 타입 태그 */}
                <div className="inline-flex w-fit items-center justify-center px-3 py-1 md:mb-6 rounded-full bg-purple-50 text-purple-600 text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-purple-100 mb-1">
                  {selectedEvent.type}
                </div>

                <h2 className="text-lg md:text-2xl font-bold text-gray-800 md:mb-4 leading-tight break-keep">
                  {selectedEvent.title}
                </h2>
                
                {/* 설명: 모바일에서는 생략하거나 짧게 처리 가능 */}
                <p className="hidden md:block text-sm text-gray-500 leading-relaxed px-1 break-keep line-clamp-4 mb-8">
                  {selectedEvent.description}
                </p>

                {/* 메타 정보: 모바일에서는 더 간결하게 */}
                <div className="w-full md:bg-white/60 md:rounded-3xl md:p-5 text-left md:border md:border-white/80 space-y-2 md:space-y-4 md:shadow-sm md:mt-auto">
                  <div className="flex items-center gap-2 md:gap-4">
                    <CalendarIcon size={14} className="text-purple-500 md:hidden" />
                    <div className="hidden md:flex w-10 h-10 rounded-2xl bg-purple-50 items-center justify-center text-purple-500 flex-shrink-0">
                      <CalendarIcon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="hidden md:block text-[10px] text-gray-400 uppercase tracking-wider font-bold">Date</p>
                      <p className="text-xs md:text-sm font-bold text-gray-700">
                        {new Date(selectedEvent.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-300 flex flex-col items-center gap-2 py-4 md:py-0 select-none opacity-50">
              <Info className="w-10 h-10 md:w-20 md:h-20 opacity-20" />
              <p className="text-sm md:text-base font-medium">일정을 선택해주세요</p>
            </div>
          )}
        </div>

        {/* =======================
            2. 메인 캘린더 (모바일: 상단 / 데스크톱: 중앙)
           ======================= */}
        <div className="order-1 md:order-2 md:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-sm border border-purple-50 flex flex-col h-[450px] md:h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4 flex-shrink-0 px-2">
            <h3 className="text-gray-800 font-bold flex items-center gap-2 md:gap-3 text-xl md:text-2xl tracking-tight">
              <CalendarIcon className="w-5 h-5 md:w-7 md:h-7 text-purple-500" />
              {monthNames[currentDate.getMonth()]} <span className="text-purple-300 font-light">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-1 md:gap-2">
              <button onClick={previousMonth} className="w-8 h-8 md:w-9 md:h-9 hover:bg-purple-50 rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </button>
              <button onClick={nextMonth} className="w-8 h-8 md:w-9 md:h-9 hover:bg-purple-50 rounded-full flex items-center justify-center transition-colors">
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2 px-1 flex-shrink-0">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div key={day} className="text-center text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          <div className="flex-1 px-1 pb-1">
            <div className="grid grid-cols-7 grid-rows-6 gap-1 md:gap-3 h-full content-start">
              {calendarCells.map((day, i) => {
                const event = getEventsForDate(day);
                const isToday = day && new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
                const isSelected = selectedEvent && day && new Date(selectedEvent.date).getDate() === day && new Date(selectedEvent.date).getMonth() === currentDate.getMonth();

                return (
                  <button
                    key={i}
                    onClick={() => day && event && setSelectedEvent(event)}
                    disabled={!day} 
                    className={`
                      w-full h-12 md:h-16 self-center rounded-xl md:rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300
                      ${day && event 
                        ? `${getEventColor(event.type)} hover:scale-[1.05] shadow-sm cursor-pointer` 
                        : 'hover:bg-gray-50/50 text-gray-400'}
                      ${isToday ? 'ring-2 ring-purple-400 ring-offset-1 md:ring-offset-2 z-10' : ''}
                      ${isSelected ? 'ring-2 ring-gray-400 ring-offset-1 md:ring-offset-2 z-10 scale-95' : ''}
                      ${!day ? 'invisible pointer-events-none' : ''} 
                    `}
                  >
                    {day && (
                      <>
                        <span className={`text-sm md:text-base leading-none ${event ? 'font-bold opacity-90' : ''}`}>{day}</span>
                        {event && <span className="text-xl md:text-2xl leading-none mt-0.5">{getEventIcon(event.type)}</span>}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =======================
            3. 다가오는 일정 리스트 (모바일: 숨김 / 데스크톱: 우측)
           ======================= */}
        <div className="hidden md:flex md:order-3 md:col-span-1 bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-white/60 flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4 pl-1 flex-shrink-0">
            <Clock className="w-5 h-5 text-purple-500" />
            <h4 className="text-gray-800 font-bold text-lg">Upcoming</h4>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide pr-1 pb-2">
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
                    w-full px-4 py-3 rounded-xl transition-all duration-200 text-left flex items-center gap-3 group
                    ${isSelected 
                      ? 'bg-purple-50 border-purple-100 ring-1 ring-purple-100' 
                      : 'hover:bg-white/50 border border-transparent'}
                  `}
                >
                  <div className={`
                    flex flex-col items-center justify-center min-w-[3rem] border-r pr-3
                    ${isSelected ? 'border-purple-200 text-purple-600' : 'border-gray-200 text-gray-400'}
                  `}>
                    <span className="text-[10px] font-bold uppercase">{monthNames[eventDate.getMonth()].slice(0, 3)}</span>
                    <span className="text-lg font-bold leading-none">{eventDate.getDate()}</span>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-bold truncate ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                      {event.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wide">
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
