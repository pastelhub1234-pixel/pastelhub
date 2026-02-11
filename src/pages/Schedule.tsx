import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Info } from 'lucide-react';
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
      case 'birthday': return 'bg-pink-100 text-pink-600 ring-pink-200';
      case 'album': return 'bg-purple-100 text-purple-600 ring-purple-200';
      case 'concert': return 'bg-blue-100 text-blue-600 ring-blue-200';
      case 'broadcast': return 'bg-yellow-100 text-yellow-700 ring-yellow-200';
      default: return 'bg-green-100 text-green-600 ring-green-200';
    }
  };

  return (
    <div className="w-full min-h-screen p-4 flex justify-center items-start">

      <div
        className="
          max-w-[1400px]
          w-full
          grid
          grid-cols-1
          md:grid-cols-4
          gap-6
        "
      >

        {/* =======================
            1. Calendar (모바일 맨 위)
        ======================= */}
        <div className="order-1 md:order-2 col-span-1 md:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-purple-50 flex flex-col">

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-bold flex items-center gap-3 text-xl md:text-2xl">
              <CalendarIcon className="w-6 h-6 text-purple-500" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>

            <div className="flex gap-2">
              <button onClick={previousMonth}><ChevronLeft /></button>
              <button onClick={nextMonth}><ChevronRight /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2 text-sm text-center font-bold text-gray-400">
            {['일','월','화','수','목','금','토'].map((d) => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((day, i) => {
              const event = getEventsForDate(day);
              return (
                <button
                  key={i}
                  onClick={() => day && event && setSelectedEvent(event)}
                  className="h-14 rounded-xl flex flex-col items-center justify-center text-sm"
                >
                  {day}
                  {event && <span>{getEventIcon(event.type)}</span>}
                </button>
              );
            })}
          </div>

        </div>

        {/* =======================
            2. Details (모바일 가로형)
        ======================= */}
        <div className="order-2 md:order-1 col-span-1 bg-white/70 backdrop-blur-xl rounded-xl p-4 md:p-6 shadow-sm border border-white/60">

          {selectedEvent ? (
            <div className="flex flex-row md:flex-col items-center md:items-center gap-4">

              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl shadow-sm flex items-center justify-center text-4xl md:text-5xl border border-purple-50">
                {getEventIcon(selectedEvent.type)}
              </div>

              <div className="flex-1 text-left md:text-center">
                <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                  {selectedEvent.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 md:line-clamp-4">
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

        {/* =======================
            3. Upcoming (PC 전용)
        ======================= */}
        <div className="hidden md:flex col-span-1 bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-white/60 flex-col">

          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-500" />
            <h4 className="font-bold text-lg">Upcoming</h4>
          </div>

          <div className="space-y-2 overflow-y-auto">
            {schedules?.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setCurrentDate(new Date(event.date));
                }}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-purple-50"
              >
                {event.title}
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
