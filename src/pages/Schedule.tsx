import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Info } from 'lucide-react';
import { useJsonData } from '../hooks/useJsonData';
import { ScheduleItem } from '../types';

const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default function Schedule() {
  const { data: schedules } = useJsonData<ScheduleItem[]>('schedules');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedEvent, setSelectedEvent] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    if (schedules && schedules.length > 0 && !selectedEvent) {
      setSelectedEvent(schedules[0]);
    }
  }, [schedules]);

  // --- 공통 핸들러 ---
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
      default: return '🎉';
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 flex justify-center items-start overflow-x-hidden">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-full max-w-[1400px]">
        
        {/* ==========================================
            📱 MOBILE LAYOUT (768px 미만에서 표시)
           ========================================== */}
        <div className="flex flex-col gap-6 md:hidden">
          {/* 공통 달력 부품 */}
          <CalendarMain 
            currentDate={currentDate} 
            previousMonth={previousMonth} 
            nextMonth={nextMonth}
            getEventsForDate={getEventsForDate}
            getEventIcon={getEventIcon}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />

          {/* 모바일용 상세 정보 (선택 시 하단에 작게 표시) */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-sm border border-purple-50">
            {selectedEvent ? (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm border border-purple-50 flex-shrink-0">
                  {getEventIcon(selectedEvent.type)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-800 truncate">{selectedEvent.title}</h2>
                  <p className="text-xs text-gray-500 line-clamp-1">{selectedEvent.description}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-2 text-sm italic">일정을 선택해 주세요</div>
            )}
          </div>
        </div>

        {/* ==========================================
            💻 PC LAYOUT (768px 이상에서 표시)
           ========================================== */}
        <div className="hidden md:grid md:grid-cols-4 gap-6" style={{ height: '600px' }}>
          
          {/* [좌측] 상세 정보 패널 */}
          <div className="col-span-1 bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-white/60 flex flex-col justify-center text-center">
            {selectedEvent ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-sm flex items-center justify-center text-5xl mb-6 border border-purple-50">
                  {getEventIcon(selectedEvent.type)}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 break-keep">{selectedEvent.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-8 line-clamp-4">{selectedEvent.description}</p>
                <div className="space-y-3">
                   <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-white/80 text-left">
                     <CalendarIcon size={16} className="text-purple-500" />
                     <span className="text-xs font-bold text-gray-700">{new Date(selectedEvent.date).toLocaleDateString()}</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="opacity-20 flex flex-col items-center gap-4">
                <Info size={48} />
                <p className="font-medium">일정을 선택해 주세요</p>
              </div>
            )}
          </div>

          {/* [중앙] 공통 달력 부품 */}
          <div className="col-span-2">
            <CalendarMain 
              currentDate={currentDate} 
              previousMonth={previousMonth} 
              nextMonth={nextMonth}
              getEventsForDate={getEventsForDate}
              getEventIcon={getEventIcon}
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
          </div>

          {/* [우측] 리스트 패널 */}
          <div className="col-span-1 bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-white/60 flex flex-col overflow-hidden">
            <h4 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="text-purple-500" size={18} /> Upcoming
            </h4>
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
              {schedules?.map((event) => (
                <button
                  key={event.id}
                  onClick={() => { setSelectedEvent(event); setCurrentDate(new Date(event.date)); }}
                  className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all text-left ${selectedEvent?.id === event.id ? 'bg-purple-50 ring-1 ring-purple-100' : 'hover:bg-white/50'}`}
                >
                  <div className="min-w-[40px] text-center border-r pr-3 border-gray-200">
                    <div className="text-[10px] text-gray-400 font-bold uppercase">{monthNames[new Date(event.date).getMonth()].slice(0,3)}</div>
                    <div className="text-lg font-bold text-gray-700 leading-none">{new Date(event.date).getDate()}</div>
                  </div>
                  <p className="text-sm font-bold text-gray-700 truncate flex-1">{event.title}</p>
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
function CalendarMain({ currentDate, previousMonth, nextMonth, getEventsForDate, getEventIcon, selectedEvent, setSelectedEvent }: any) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const startingDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const calendarCells = [
    ...Array(startingDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ...Array(42 - (startingDayOfWeek + daysInMonth)).fill(null)
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-purple-50 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-gray-800 font-bold flex items-center gap-3 text-2xl">
          <CalendarIcon className="text-purple-500" />
          {monthNames[month]} <span className="text-purple-300 font-light">{year}</span>
        </h3>
        <div className="flex gap-1">
          <button onClick={previousMonth} className="p-2 hover:bg-purple-50 rounded-full transition-colors"><ChevronLeft size={20}/></button>
          <button onClick={nextMonth} className="p-2 hover:bg-purple-50 rounded-full transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-4">
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 flex-1">
        {calendarCells.map((day, i) => {
          const event = getEventsForDate(day);
          const isSelected = selectedEvent && day && 
                             new Date(selectedEvent.date).getDate() === day && 
                             new Date(selectedEvent.date).getMonth() === month;

          return (
            <button
              key={i}
              onClick={() => day && event && setSelectedEvent(event)}
              disabled={!day}
              className={`
                w-full aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-300
                ${day && event ? `bg-purple-100 text-purple-600 hover:scale-105 shadow-sm` : 'hover:bg-gray-50/50 text-gray-400'}
                ${isSelected ? 'ring-2 ring-gray-400 ring-offset-2 z-10' : ''}
                ${!day ? 'invisible' : ''}
              `}
            >
              <span className={`text-sm ${event ? 'font-bold' : ''}`}>{day}</span>
              {event && <span className="text-xl mt-0.5">{getEventIcon(event.type)}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
