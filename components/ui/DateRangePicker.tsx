import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DateRange } from '../../types';

interface DateRangePickerProps {
  date: DateRange;
  setDate: (date: DateRange) => void;
  className?: string;
  id?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ date, setDate, className = '', id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper for formatting
  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Close popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id={id} className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center justify-start text-left font-normal
          px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-sm
          hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50
          ${!date ? 'text-zinc-500' : 'text-white'}
          w-[260px] sm:w-[300px]
        `}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
        {date?.from ? (
          date.to ? (
            <>
              {formatDate(date.from)} - {formatDate(date.to)}
            </>
          ) : (
            formatDate(date.from)
          )
        ) : (
          <span>Pick a date</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[300px] p-3 rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <Calendar date={date} setDate={setDate} />
        </div>
      )}
    </div>
  );
};

// Internal Calendar Component
const Calendar = ({ date, setDate }: { date: DateRange; setDate: (d: DateRange) => void }) => {
  // State for the currently displayed month in the calendar
  const [currentMonth, setCurrentMonth] = useState(new Date(date.from || new Date()));

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month); // 0 = Sunday

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1));

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    
    // Logic: 
    // 1. If both from and to are set, reset and start new range
    // 2. If only from is set, check if clicked is before or after
    if (date.from && date.to) {
      setDate({ from: clickedDate, to: clickedDate });
    } else if (date.from) {
      if (clickedDate < date.from) {
        setDate({ from: clickedDate, to: date.from });
      } else {
        setDate({ from: date.from, to: clickedDate });
      }
    } else {
      setDate({ from: clickedDate, to: clickedDate });
    }
  };

  // Generate grid
  const days = [];
  // Empty slots for days before start of month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
  }
  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const currentDayDate = new Date(year, month, d);
    
    // Styling Logic
    const isSelected = 
      (date.from && currentDayDate.getTime() === date.from.getTime()) || 
      (date.to && currentDayDate.getTime() === date.to.getTime());
    
    const isInRange = 
      date.from && date.to && 
      currentDayDate > date.from && currentDayDate < date.to;

    const isToday = new Date().toDateString() === currentDayDate.toDateString();

    days.push(
      <button
        key={d}
        onClick={() => handleDateClick(d)}
        className={`
          h-9 w-9 rounded-md text-sm flex items-center justify-center transition-all relative
          ${isSelected ? 'bg-orange-500 text-white font-medium z-10' : ''}
          ${isInRange ? 'bg-zinc-800 text-white rounded-none first:rounded-l-md last:rounded-r-md' : ''}
          ${!isSelected && !isInRange ? 'text-zinc-300 hover:bg-zinc-800' : ''}
          ${isToday && !isSelected ? 'text-orange-500 font-semibold ring-1 ring-orange-500/50' : ''}
        `}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-4 px-1">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-white">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <span key={day} className="text-[10px] uppercase text-zinc-500 font-medium h-9 flex items-center justify-center">
            {day}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-y-1">
        {days}
      </div>
    </div>
  );
};