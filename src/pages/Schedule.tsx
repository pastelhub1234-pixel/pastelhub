import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SCHEDULES } from '../constants';
import { ScheduleEvent } from '../types';

const TYPE_CONFIG = {
  comeback: { color: 'text-purple-600', bg: 'bg-purple-100', label: '컴백' },
  concert: { color: 'text-blue-600', bg: 'bg-blue-100', label: '공연' },
  birthday: { color: 'text-pink-600', bg: 'bg-pink-100', label: '생일' },
  event: { color: 'text-orange-600', bg: 'bg-orange-100', label: '이벤트' },
  anniversary: { color: 'text-indigo-600', bg: 'bg-indigo-100', label: '기념일' },
};

function getDaysUntil(dateString: string): number {
  const today = new Date('2026-02-03');
  const eventDate = new Date(dateString);
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // February 2026
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  // 달력 관련 함수
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // 해당 날짜에 일정이 있는지 확인
  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return SCHEDULES.filter(event => event.date === dateStr);
  };

  // 시간순 정렬된 일정
  const sortedSchedules = [...SCHEDULES].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">일정</h1>
        <p className="text-slate-600">다가오는 이벤트를 확인하세요</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 달력 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          {/* 달력 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="size-5 text-slate-600" />
            </button>
            <h2 className="text-xl font-bold text-slate-800">
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="size-5 text-slate-600" />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div key={day} className={`text-center text-sm font-bold ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-600'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const events = getEventsForDate(day);
              const hasEvents = events.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => hasEvents && setSelectedEvent(events[0])}
                  className={`aspect-square rounded-lg text-sm font-medium transition-all relative
                    ${hasEvents 
                      ? 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 hover:shadow-lg hover:scale-105 cursor-pointer' 
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {day}
                  {hasEvents && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                      {events.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-purple-500" />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 시간순 일정 리스트 */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {sortedSchedules.map((event) => {
            const config = TYPE_CONFIG[event.type];
            const daysUntil = getDaysUntil(event.date);
            const isPast = daysUntil < 0;
            const isToday = daysUntil === 0;

            return (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="w-full text-left bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${config.color} ${config.bg}`}>
                        {config.label}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold
                        ${isPast ? 'bg-gray-100 text-gray-500' : 
                          isToday ? 'bg-red-500 text-white animate-pulse' : 
                          'bg-purple-500 text-white'}`}>
                        {isPast ? '종료' : isToday ? 'D-DAY' : `D-${daysUntil}`}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">{event.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="size-4" />
                        {formatDate(event.date)}
                      </span>
                      {event.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="size-4" />
                          {event.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 상세 모달 */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${TYPE_CONFIG[selectedEvent.type].color} ${TYPE_CONFIG[selectedEvent.type].bg}`}>
                  {TYPE_CONFIG[selectedEvent.type].label}
                </span>
                <span className="px-3 py-1 rounded-lg text-sm font-bold bg-purple-500 text-white">
                  {getDaysUntil(selectedEvent.date) < 0 ? '종료' : 
                   getDaysUntil(selectedEvent.date) === 0 ? 'D-DAY' : 
                   `D-${getDaysUntil(selectedEvent.date)}`}
                </span>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="size-5 text-slate-600" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{selectedEvent.title}</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-slate-700">
                <CalendarIcon className="size-5 text-purple-500" />
                <span>{formatDate(selectedEvent.date)}</span>
              </div>
              {selectedEvent.time && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="size-5 text-purple-500" />
                  <span>{selectedEvent.time}</span>
                </div>
              )}
            </div>
            
            {selectedEvent.description && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                <p className="text-slate-700">{selectedEvent.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
