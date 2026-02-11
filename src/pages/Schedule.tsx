import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Info } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
import { ScheduleItem } from '../types';

/**
 * 캘린더 월 이름 상수
 */
const monthNames = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
];

export default function Schedule() {
  const { data: schedules } = useJsonData<ScheduleItem[]>('schedules');
  
  // 상태 관리: 현재 조회 중인 날짜 (초기값: 2026년 1월 1일)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  // 상태 관리: 사용자가 선택한 상세 이벤트 정보
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    if (schedules && schedules.length > 0 && !selectedEvent) {
      setSelectedEvent(schedules[0]);
    }
  }, [schedules, selectedEvent]);

  // 특정 월의 총 일수와 시작 요일 계산
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

  // 7x6 캘린더 그리드 생성
  const totalSlots = 42; 
  const calendarCells = [
    ...Array(startingDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ...Array(totalSlots - (startingDayOfWeek + daysInMonth)).fill(null)
  ];

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
    <div className="w-full h-screen p-2 md:p-6 flex justify-center items-center overflow-hidden bg-gray-50/50">
      {/* 전역 스크롤바 숨김 */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* 메인 컨테이너: PC(grid-cols-4), 모바일(flex-col) */}
      <div className="w-full h-full max-w-[1400px] flex flex-col md:grid md:grid-cols-4 gap-3 md:gap-6">
        
        {/* ==========================================
            1. [중앙] 메인 캘린더 
            (모바일: 1번 배치, 높이 65% / PC: 2번 배치, 전체 높이)
           ========================================== */}
        <div className="order-1 md:order-2 md:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-sm border border-purple-50 flex flex-col h-[65%] md:h-full overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-2 md:mb-4 flex-shrink-0">
            <h3 className="text-gray-800 font-bold flex items-center gap-2 text-lg md:text-2xl tracking-tight">
              <CalendarIcon className="w-5 h-5 md:w-7 md:h-7 text-purple-500" />
              {monthNames[currentDate.getMonth()]} <span className="text-purple-300 font-light">{currentDate.getFullYear()}</span>
            </h3>
            <div className="flex gap-1 md:gap-2">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                className="p-1 hover:bg-purple-50 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                className="p-1 hover:bg-purple-50 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* 요일 */}
          <div className="grid grid-cols-7 mb-1 md:mb-2 text-center text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => <div key={day}>{day}</div>)}
          </div>

          {/* 그리드 바디 */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-7 grid-rows-6 gap-1 md:gap-3 h-full">
              {calendarCells.map((day, i) => {
                const event = getEventsForDate(day);
                const isSelected = selectedEvent && day && new Date(selectedEvent.date).getDate() === day && new Date(selectedEvent.date).getMonth() === currentDate.getMonth();

                return (
                  <button
                    key={i}
                    onClick={() => day && event && setSelectedEvent(event)}
                    disabled={!day}
                    className={`
                      w-full h-full rounded-lg md:rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300
                      ${day && event 
                        ? `${getEventColor(event.type)} shadow-sm cursor-pointer` 
                        : 'hover:bg-gray-50/50 text-gray-400'}
                      ${isSelected ? 'ring-2 ring-gray-400 ring-offset-1 md:ring-offset-2 z-10 scale-95' : ''}
                      ${!day ? 'invisible pointer-events-none' : ''} 
                    `}
                  >
                    {day && (
                      <>
                        <span className={`text-xs md:text-base leading-none ${event ? 'font-bold opacity-90' : ''}`}>{day}</span>
                        {event && <span className="text-xl md:text-2xl leading-none mt-0.5">{getEventIcon(event.type)}</span>}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==========================================
            2. [좌측] 상세 정보 패널
            (모바일: 2번 배치, 가로형, 높이 35% / PC: 1번 배치, 세로형, 전체 높이)
           ========================================== */}
        <div className="order-2 md:order-1 md:col-span-1 bg-white/70 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-sm border border-white/60 flex flex-col justify-center h-[35%] md:h-full overflow-hidden">
          {selectedEvent ? (
            <div className="flex flex-row md:flex-col items-center gap-4 md:gap-6 h-full w-full">
              {/* 아이콘 */}
              <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-white rounded-2xl shadow-sm flex items-center justify-center text-4xl md:text-5xl border border-purple-50">
                {getEventIcon(selectedEvent.type)}
              </div>
              
              <div className="flex flex-col flex-1 min-w-0 md:items-center md:text-center justify-center">
                <span className="inline-block w-fit px-2 py-0.5 mb-1 md:mb-4 rounded-full bg-purple-50 text-purple-600 text-[10px] md:text-[11px] font-bold uppercase border border-purple-100">
                  {selectedEvent.type}
                </span>
                <h2 className="text-base md:text-2xl font-bold text-gray-800 leading-tight truncate md:whitespace-normal md:break-keep">
                  {selectedEvent.title}
                </h2>
                {/* 설명문은 PC에서만 표시하여 공간 확보 */}
                <p className="hidden md:block text-sm text-gray-500 mt-4 line-clamp-3 break-keep">
                  {selectedEvent.description}
                </p>
                
                <div className="flex items-center gap-2 mt-2 md:mt-auto text-gray-600">
                  <CalendarIcon size={14} className="text-purple-400" />
                  <span className="text-xs md:text-sm font-semibold">{new Date(selectedEvent.date).toLocaleDateString()}</span>
                  <MapPin size={14} className="ml-2 text-pink-400 hidden md:inline" />
                  <span className="text-xs font-semibold hidden md:inline">Seoul, Korea</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center opacity-30 gap-2">
              <Info className="w-8 h-8 md:w-16 md:h-16" />
              <p className="text-xs md:text-base font-medium">일정을 선택해주세요</p>
            </div>
          )}
        </div>

        {/* ==========================================
            3. [우측] Upcoming 리스트 (PC 전용)
           ========================================== */}
        <div className="hidden md:flex md:order-3 md:col-span-1 bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/60 flex-col h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4 flex-shrink-0">
            <Clock className="w-5 h-5 text-purple-500" />
            <h4 className="text-gray-800 font-bold text-lg">Upcoming</h4>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {schedules?.map((event) => (
              <button
                key={event.id}
                onClick={() => { setSelectedEvent(event); setCurrentDate(new Date(event.date)); }}
                className={`
                  w-full p-3 rounded-xl transition-all flex items-center gap-3 border
                  ${selectedEvent?.id === event.id ? 'bg-purple-50 border-purple-100 ring-1 ring-purple-100' : 'bg-transparent border-transparent hover:bg-white/50'}
                `}
              >
                <div className="text-center min-w-[40px] border-r pr-3 border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{monthNames[new Date(event.date).getMonth()].slice(0, 3)}</p>
                  <p className="text-base font-bold text-gray-700 leading-none">{new Date(event.date).getDate()}</p>
                </div>
                <p className="text-sm font-bold text-gray-600 truncate flex-1 text-left">{event.title}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
