import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Info } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
import { ScheduleItem } from '../types';

const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default function Schedule() {
  const { data: schedules } = useJsonData<ScheduleItem[]>('schedules');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  // 초기 로드 시 첫 번째 이벤트 선택
  useEffect(() => {
    if (schedules && schedules.length > 0 && !selectedEvent) {
      setSelectedEvent(schedules[0]);
    }
  }, [schedules]);

  // --- 공통 로직들 ---
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
    <div className="w-full min-h-screen p-4 flex justify-center items-start md:items-center overflow-x-hidden">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-[1400px] w-full">
        
        {/* ==========================================
            📱 MOBILE LAYOUT (Stack)
           ========================================== */}
        <div className="flex flex-col gap-4 md:hidden">
          {/* 1. 공통 달력 부품 */}
          <CalendarMain 
            currentDate={currentDate}
            previousMonth={previousMonth}
            nextMonth={nextMonth}
            getEventsForDate={getEventsForDate}
            getEventIcon={getEventIcon}
            getEventColor={getEventColor}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />

          {/* 2. 모바일용 상세 정보 (가로 카드형) */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-sm border border-white/60">
            {selectedEvent ? (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-purple-50">
                  {getEventIcon(selectedEvent.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-1">{selectedEvent.type}</div>
                  <h2 className="text-lg font-bold text-gray-800 truncate">{selectedEvent.title}</h2>
                  <p className="text-xs text-gray-500 line-clamp-1">{selectedEvent.description}</p>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">일정을 선택해주세요</p>
            )}
          </div>

          {/* 3. 모바일용 리스트 (세로 나열) */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-700 px-1 flex items-center gap-2">
              <Clock size={16} className="text-purple-500" /> Upcoming
            </h4>
            {schedules?.map((event) => (
              <button
                key={event.id}
                onClick={() => { setSelectedEvent(event); setCurrentDate(new Date(event.date)); }}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${selectedEvent?.id === event.id ? 'bg-purple-50 ring-1 ring-purple-100' : 'bg-white/50'}`}
              >
                <div className="text-center min-w-[40px] border-r pr-3 border-gray-100">
                  <div className="text-[9px] text-gray-400 font-bold uppercase">{monthNames[new Date(event.date).getMonth()].slice(0, 3)}</div>
                  <div className="text-sm font-bold text-gray-700">{new Date(event.date).getDate()}</div>
                </div>
                <div className="text-left truncate flex-1">
                  <div className="text-sm font-bold text-gray-700 truncate">{event.title}</div>
                </div>
                <div className="text-xs">{getEventIcon(event.type)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ==========================================
            💻 PC LAYOUT (3-Column Grid)
           ========================================== */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 h-[600px]">
          {/* 1. PC용 상세 정보 (좌측 패널) */}
          <div className="col-span-1 bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-white/60 flex flex-col items-center justify-center text-center">
            {selectedEvent ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center text-5xl mb-6 border border-purple-50 mx-auto">
                  {getEventIcon(selectedEvent.type)}
                </div>
                <div className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full mb-4 uppercase tracking-tighter">
                  {selectedEvent.type}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 break-keep">{selectedEvent.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-4">{selectedEvent.description}</p>
                <div className="mt-8 space-y-3 w-full">
                  <div className="flex items-center gap-3 p-3 bg-white/50 rounded-2xl border border-white/80">
                    <CalendarIcon size={16} className="text-purple-400" />
                    <span className="text-xs font-bold text-gray-600">{new Date(selectedEvent.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="opacity-20 flex flex-col items-center gap-4">
                <Info size={64} />
                <p className="font-bold">Select an event</p>
              </div>
            )}
          </div>

          {/* 2. 공통 달력 부품 (중앙) */}
          <div className="col-span-2">
            <CalendarMain 
              currentDate={currentDate}
              previousMonth={previousMonth}
              nextMonth={nextMonth}
              getEventsForDate={getEventsForDate}
              getEventIcon={getEventIcon}
              getEventColor={getEventColor}
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
          </div>

          {/* 3. PC용 리스트 (우측 패널) */}
          <div className="col-span-1 bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/60 flex flex-col overflow-hidden">
            <h4 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="text-purple-500" size={20} /> Upcoming
            </h4>
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
              {schedules?.map((event) => (
                <button
                  key={event.id}
                  onClick={() => { setSelectedEvent(event); setCurrentDate(new Date(event.date)); }}
                  className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all text-left ${selectedEvent?.id === event.id ? 'bg-purple-50 ring-1 ring-purple-100' : 'hover:bg-white/50'}`}
                >
                  <div className="text-center min-w-[40px] border-r pr-3 border-gray-200">
                    <div className="text-[10px] text-gray-400 font-bold uppercase">{monthNames[new Date(event.date).getMonth()].slice(0, 3)}</div>
                    <div className="text-lg font-bold text-gray-700 leading-none">{new Date(event.date).getDate()}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-700 truncate">{event.title}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-medium mt-0.5">{event.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 🧱 SHARED COMPONENT: CalendarMain
// ==========================================
function CalendarMain({ currentDate, previousMonth, nextMonth, getEventsForDate, getEventIcon, getEventColor, selectedEvent, setSelectedEvent }: any) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startingDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const calendarCells = [
    ...Array(startingDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ...Array(42 - (startingDayOfWeek + daysInMonth)).fill(null)
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-purple-50 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-gray-800 font-bold flex items-center gap-3 text-xl md:text-2xl">
          <CalendarIcon className="text-purple-500" />
          {monthNames[month]} <span className="text-purple-300 font-light">{year}</span>
        </h3>
        <div className="flex gap-1">
          <button onClick={previousMonth} className="p-2 hover:bg-purple-50 rounded-full transition-colors"><ChevronLeft size={20}/></button>
          <button onClick={nextMonth} className="p-2 hover:bg-purple-50 rounded-full transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-4">
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d} className="text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2 md:gap-3 flex-1">
        {calendarCells.map((day, i) => {
          const event = getEventsForDate(day);
          const isSelected = selectedEvent && day && new Date(selectedEvent.date).getDate() === day && new Date(selectedEvent.date).getMonth() === month;

          return (
            <button
              key={i}
              onClick={() => day && event && setSelectedEvent(event)}
              disabled={!day}
              className={`
                w-full aspect-square md:h-16 rounded-xl md:rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300
                ${day && event ? `${getEventColor(event.type)} hover:scale-105 shadow-sm` : 'hover:bg-gray-50 text-gray-400'}
                ${isSelected ? 'ring-2 ring-gray-400 ring-offset-2 z-10' : ''}
                ${!day ? 'invisible' : ''}
              `}
            >
              <span className={`text-xs md:text-base ${event ? 'font-bold' : ''}`}>{day}</span>
              {event && <span className="text-lg md:text-2xl mt-0.5">{getEventIcon(event.type)}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
