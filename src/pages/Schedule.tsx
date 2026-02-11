import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Info
} from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
import { ScheduleItem } from '../types';

const monthNames = [
  '1월','2월','3월','4월','5월','6월',
  '7월','8월','9월','10월','11월','12월'
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
      case 'birthday': return 'bg-pink-100 text-pink-600';
      case 'album': return 'bg-purple-100 text-purple-600';
      case 'concert': return 'bg-blue-100 text-blue-600';
      case 'broadcast': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="w-full min-h-screen p-4 flex justify-center">

      <div className="max-w-[1400px] w-full">

        {/* ============================
            📱 MOBILE LAYOUT (추가)
        ============================ */}
        <div className="md:hidden flex flex-col gap-6">

          {/* Calendar (맨 위) */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-purple-50">

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-500" />
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="flex gap-2">
                <button onClick={previousMonth}><ChevronLeft /></button>
                <button onClick={nextMonth}><ChevronRight /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-xs text-center font-bold text-gray-400 mb-2">
              {['일','월','화','수','목','금','토'].map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((day, i) => {
                const event = getEventsForDate(day);
                return (
                  <button
                    key={i}
                    onClick={() => day && event && setSelectedEvent(event)}
                    className="h-12 rounded-xl flex flex-col items-center justify-center text-sm"
                  >
                    {day}
                    {event && <span>{getEventIcon(event.type)}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details (가로형) */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-white/60">

            {selectedEvent ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl border">
                  {getEventIcon(selectedEvent.type)}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold">{selectedEvent.title}</h2>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center">
                일정을 선택해주세요
              </div>
            )}

          </div>
        </div>

        {/* ============================
            💻 PC LAYOUT (기존 그대로)
        ============================ */}
        <div className="hidden md:grid md:grid-cols-4 gap-6" style={{ height: '560px' }}>
  
          <div className="col-span-1 bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-white/60 flex flex-col justify-center text-center h-full relative overflow-hidden">
            {selectedEvent ? (
              <div className="animate-in fade-in zoom-in duration-300 h-full flex flex-col items-center justify-center w-full pt-8 pb-8">
                 
                 {/* 이벤트 아이콘 */}
                 <div className="w-24 h-24 flex-shrink-0 aspect-square mx-auto bg-white rounded-xl shadow-sm flex items-center justify-center text-5xl mb-8 border border-purple-50">
                  {getEventIcon(selectedEvent.type)}
                </div>
                
                {/* 이벤트 타입 태그 */}
                <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-purple-50 text-purple-600 text-[11px] font-bold uppercase tracking-widest border border-purple-100 flex-shrink-0">
                  {selectedEvent.type}
                </div>
  
                {/* 제목 및 설명 */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-tight px-1 w-full break-keep">
                  {selectedEvent.title}
                </h2>
                
                <p className="text-sm text-gray-500 leading-relaxed px-1 break-keep line-clamp-4 mb-8">
                  {selectedEvent.description}
                </p>
  
                {/* 일시 및 장소 메타 정보 */}
                <div className="w-full bg-white/60 rounded-3xl p-5 text-left border border-white/80 space-y-4 shadow-sm mt-auto flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
                      <CalendarIcon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Date</p>
                      <p className="text-sm font-bold text-gray-700 mt-0.5 truncate">
                        {new Date(selectedEvent.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Location</p>
                      <p className="text-sm font-bold text-gray-700 mt-0.5 truncate">Seoul, Korea</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* 선택된 이벤트가 없을 때 표시되는 Placeholder */
              <div className="text-gray-300 flex flex-col items-center gap-4 select-none opacity-50">
                <Info className="w-20 h-20 opacity-20" />
                <p className="text-base font-medium">일정을 선택해주세요</p>
              </div>
            )}
          </div>
  
          {/* =======================
              2. [중앙] 메인 캘린더 (Calendar)
             ======================= */}
          <div className="col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-purple-50 flex flex-col h-full overflow-hidden">
            {/* 캘린더 상단 헤더: 월/연도 및 이동 버튼 */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0 px-4 pt-2">
              <h3 className="text-gray-800 font-bold flex items-center gap-3 text-2xl tracking-tight">
                <CalendarIcon className="w-7 h-7 text-purple-500" />
                {monthNames[currentDate.getMonth()]} <span className="text-purple-300 font-light">{currentDate.getFullYear()}</span>
              </h3>
              <div className="flex gap-2">
                <button onClick={previousMonth} className="w-9 h-9 hover:bg-purple-50 rounded-full flex items-center justify-center transition-colors border border-transparent hover:border-purple-100">
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <button onClick={nextMonth} className="w-9 h-9 hover:bg-purple-50 rounded-full flex items-center justify-center transition-colors border border-transparent hover:border-purple-100">
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
  
            {/* 요일 행 */}
            <div className="grid grid-cols-7 mb-2 px-2 flex-shrink-0">
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div key={day} className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>
  
            {/* 캘린더 그리드 바디 */}
            <div className="flex-1 px-1 pb-1">
              <div className="grid grid-cols-7 grid-rows-6 gap-3 h-full content-start">
                {calendarCells.map((day, i) => {
                  const event = getEventsForDate(day);
                  // 오늘 날짜 및 선택된 날짜 여부 판단
                  const isToday = day && new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
                  const isSelected = selectedEvent && day && new Date(selectedEvent.date).getDate() === day && new Date(selectedEvent.date).getMonth() === currentDate.getMonth();
  
                  return (
                    <button
                      key={i}
                      onClick={() => day && event && setSelectedEvent(event)}
                      disabled={!day} 
                      className={`
                        w-full h-16 self-center rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 gap-0.5
                        ${day && event 
                          ? `${getEventColor(event.type)} hover:scale-[1.05] shadow-sm cursor-pointer` 
                          : 'hover:bg-gray-50/50 text-gray-400'}
                        ${isToday ? 'ring-2 ring-purple-400 ring-offset-2 z-10' : ''}
                        ${isSelected ? 'ring-2 ring-gray-400 ring-offset-2 z-10 scale-95' : ''}
                        ${!day ? 'invisible pointer-events-none' : ''} 
                      `}
                    >
                      {day && (
                        <>
                          <span className={`text-base leading-none ${event ? 'font-bold opacity-90' : ''}`}>{day}</span>
                          {/* 이벤트가 있는 날짜에만 아이콘 표시 */}
                          {event && <span className="text-2xl leading-none group-hover:-translate-y-1 transition-transform">{getEventIcon(event.type)}</span>}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
  
          {/* =======================
              3. [우측] 다가오는 일정 리스트 (Upcoming Panel)
             ======================= */}
          <div className="col-span-1 bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-white/60 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-2 mb-4 pl-1 flex-shrink-0">
              <Clock className="w-5 h-5 text-purple-500" />
              <h4 className="text-gray-800 font-bold text-lg">Upcoming</h4>
            </div>
            
            {/* 전체 일정 스크롤 목록 */}
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide pr-1 pb-2">
              {schedules?.map((event) => {
                const eventDate = new Date(event.date);
                const isSelected = selectedEvent?.id === event.id;
                
                return (
                  <button
                    key={event.id}
                    onClick={() => {
                      setSelectedEvent(event);
                      setCurrentDate(new Date(event.date)); // 리스트 클릭 시 해당 월로 캘린더 이동
                    }}
                    className={`
                      w-full px-4 py-3 rounded-xl transition-all duration-200 text-left flex items-center gap-3 group
                      ${isSelected 
                        ? 'bg-purple-50 border-purple-100 ring-1 ring-purple-100' 
                        : 'hover:bg-white/50 border border-transparent'}
                    `}
                  >
                    {/* 날짜 배지 */}
                    <div className={`
                      flex flex-col items-center justify-center min-w-[3rem] border-r pr-3
                      ${isSelected ? 'border-purple-200 text-purple-600' : 'border-gray-200 text-gray-400'}
                    `}>
                      <span className="text-[10px] font-bold uppercase">{monthNames[eventDate.getMonth()].slice(0, 3)}</span>
                      <span className="text-lg font-bold leading-none">{eventDate.getDate()}</span>
                    </div>
                    
                    {/* 일정 정보 요약 */}
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
    </div>
  );
}
