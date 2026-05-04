import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrainingDays, TrainingDayWithExercises } from '@/hooks/useTrainingDays';
import { cn } from '@/lib/utils';

interface CalendarProps {
  onDaySelect: (date: Date, day?: TrainingDayWithExercises) => void;
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

type TrainingIntensity = 'easy' | 'medium' | 'hard';

export function Calendar({ onDaySelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { useTrainingDaysForMonth } = useTrainingDays();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const { data: trainingDays = [], isLoading } = useTrainingDaysForMonth(year, month);
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Adjust for Monday start (0 = Mon, 6 = Sun)
  let startingDay = firstDay.getDay() - 1;
  if (startingDay < 0) startingDay = 6;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getTrainingDay = (day: number): TrainingDayWithExercises | undefined => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return trainingDays.find(td => td.date === dateStr);
  };

  const getIntensityClass = (intensity: TrainingIntensity): string => {
    switch (intensity) {
      case 'easy':
        return 'bg-intensity-easy/20 text-intensity-easy border-intensity-easy/40';
      case 'medium':
        return 'bg-intensity-medium/20 text-intensity-medium border-intensity-medium/40';
      case 'hard':
        return 'bg-intensity-hard/20 text-intensity-hard border-intensity-hard/40';
      default:
        return '';
    }
  };

  const today = new Date();
  const isToday = (day: number) => 
    today.getFullYear() === year && 
    today.getMonth() === month && 
    today.getDate() === day;

  const days: (number | null)[] = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Stats for the month
  const stats = {
    easy: trainingDays.filter(d => d.intensity === 'easy').length,
    medium: trainingDays.filter(d => d.intensity === 'medium').length,
    hard: trainingDays.filter(d => d.intensity === 'hard').length,
    completed: trainingDays.filter(d => d.is_completed).length,
  };

  return (
    <div className="stat-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-bold">
          {MONTHS[month]} {year}
        </h2>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const trainingDay = getTrainingDay(day);
            const hasTraining = !!trainingDay;
            
            return (
              <button
                key={day}
                onClick={() => {
                  const date = new Date(year, month, day);
                  onDaySelect(date, trainingDay);
                }}
                className={cn(
                  'day-cell border',
                  hasTraining 
                    ? getIntensityClass(trainingDay.intensity)
                    : 'border-transparent hover:bg-secondary',
                  isToday(day) && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
                  trainingDay?.is_completed && 'opacity-60'
                )}
              >
                <span className="relative">
                  {day}
                  {trainingDay?.is_completed && (
                    <span className="absolute -top-1 -right-2 text-[10px]">✓</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-intensity-easy" />
            <span className="text-muted-foreground">Лёгкая</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-intensity-medium" />
            <span className="text-muted-foreground">Средняя</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-intensity-hard" />
            <span className="text-muted-foreground">Сложная</span>
          </div>
        </div>

        {/* Monthly stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="text-center p-2 rounded-lg bg-secondary">
            <div className="text-lg font-bold text-intensity-easy">{stats.easy}</div>
            <div className="text-xs text-muted-foreground">Лёгких</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary">
            <div className="text-lg font-bold text-intensity-medium">{stats.medium}</div>
            <div className="text-xs text-muted-foreground">Средних</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary">
            <div className="text-lg font-bold text-intensity-hard">{stats.hard}</div>
            <div className="text-xs text-muted-foreground">Сложных</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-secondary">
            <div className="text-lg font-bold text-primary">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">Выполнено</div>
          </div>
        </div>
      </div>
    </div>
  );
}
