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
    // ✅ [수정] gap-6 -> gap-4로 축소하여 콤팩트하게 배치
    <div className="w-full h-full flex gap-4">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

        {/* =======================
            1. [Left] Details Panel
            ✅ w-[320px] -> w-[280px] 축소
            ✅ p-6 -> p-5 내부 여백 축소
           ======================= */}
        <div className="w-[280px] flex-none bg-white/60 backdrop-blur-xl rounded-[24px] p-5 shadow-sm border border-white/60 flex flex-col relative overflow-hidden h-full">
          {selectedEvent ? (
            <div className="animate-in fade-in zoom-in duration-300 h-full flex flex-col items-center justify-center w-full py-1">
               
               {/* 아이콘 크기 및 마진 축소 */}
               <div className="w-20 h-20 flex-shrink-0 aspect-square mx-auto bg-white rounded-[1.5rem] shadow-sm flex items-center justify-center text-4xl mb-4 border border-purple-50">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-widest border border-purple-100 flex-shrink-0">
                {selectedEvent.type}
              </div>

              {/* 제목 폰트 사이즈 및 높이 조절 */}
              <h2 className="text-xl font-bold text-gray-800 mb-3 leading-tight px-2 w-full break-keep text-center line-clamp-2 h-[3rem] flex items-center justify-center">
                {selectedEvent.title}
              </h2>
              
              <p className="text-xs text-gray-500 mb-4 leading-relaxed px-2 break-keep text-center line-clamp-5 h-[4.5rem] overflow-hidden">
                {selectedEvent.description}
              </p>

              <div className="w-full bg-white/60 rounded-2xl p-4 text-left border border-white/80 space-y-3 shadow-sm mt-auto flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
                    <CalendarIcon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Date</p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5 truncate">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                 <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Location</p>
                    <p className="text-xs font-bold text-gray-700 mt-0.5 truncate">Seoul, Korea</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-300 flex flex-col items-center gap-3 select-none opacity-50 justify-center h-full">
              <Info className="w-12 h-12 opacity-20" />
              <p className="text-xs font-medium">일정을 선택해주세요</p>
            </div>
          )}
        </div>

        {/* =======================
            2. [Center] Calendar
            ✅ p-8 -> p-6 내부 여백 축소
            ✅ 그리드 간격 gap-4 -> gap-2로 축소
           ======================= */}
        <div className="flex-1 min-w-0 bg-white/60 backdrop-blur-xl rounded-[24px] p-6 shadow-sm border border-purple-50 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0 px-1">
            <h3 className="text-gray-800 font-bold flex items-center gap-2 text-2xl tracking-tight">
              <CalendarIcon className="w-6 h-6 text-purple-500" />
              {monthNames[currentDate.getMonth()]} <span className="text-purple-300 font-light">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-1.5">
              <button onClick={previousMonth} className="w-8 h-8 hover:bg-purple-50 rounded-full flex items-center justify-center transition-colors border border-transparent hover:border-purple-100">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={nextMonth} className="w-8 h-8 hover:bg-purple-50 rounded-full flex items-center justify-center transition-colors border border-transparent hover:border-purple-100">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-2 px-2 flex-shrink-0">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 px-1 pb-1">
            <div className="grid grid-cols-7 gap-2 h-full content-start p-1">
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
                      w-full aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-300
                      ${event 
                        ? `${getEventColor(event.type)} hover:scale-105 shadow-sm hover:shadow-md cursor-pointer` 
                        : 'hover:bg-gray-50 text-gray-400'}
                      ${isToday ? 'ring-2 ring-purple-400 ring-offset-2 z-10' : ''}
                      ${isSelected ? 'ring-2 ring-gray-400 ring-offset-2 z-10 scale-95' : ''}
                    `}
                  >
                    <span className={`text-sm mb-0.5 ${event ? 'font-bold' : ''}`}>{day}</span>
                    {event && <span className="text-lg group-hover:-translate-y-1 transition-transform">{getEventIcon(event.type)}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =======================
            3. [Right] Upcoming Panel
            ✅ w-[320px] -> w-[280px] 축소
            ✅ p-6 -> p-5 축소
           ======================= */}
        <div className="w-[280px] flex-none bg-white/60 backdrop-blur-xl rounded-[24px] p-5 shadow-sm border border-white/60 flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-3 pl-1 flex-shrink-0">
            <Clock className="w-4 h-4 text-purple-500" />
            <h4 className="text-gray-800 font-bold text-base">Upcoming</h4>
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
                    w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-left flex items-center gap-3 group
                    ${isSelected 
                      ? 'bg-purple-50 border-purple-100 ring-1 ring-purple-100' 
                      : 'hover:bg-white/50 border border-transparent'}
                  `}
                >
                  <div className={`
                    flex flex-col items-center justify-center min-w-[2.5rem] border-r pr-2.5
                    ${isSelected ? 'border-purple-200 text-purple-600' : 'border-gray-200 text-gray-400'}
                  `}>
                    <span className="text-[9px] font-bold uppercase">{monthNames[eventDate.getMonth()].slice(0, 3)}</span>
                    <span className="text-base font-bold leading-none">{eventDate.getDate()}</span>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                      {event.title}
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-medium uppercase tracking-wide">
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
