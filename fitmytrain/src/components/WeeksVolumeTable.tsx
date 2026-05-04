import React, { useState } from 'react';
import { useTrainingDays } from '@/hooks/useTrainingDays';
import { transformToLocalFormat } from '@/lib/dataTransformers';
import { 
  calculateWeeklyVolumeRecords, 
  getWeeksInMonth,
  getWeekStatusColor,
} from '@/lib/calculations';
import { 
  MUSCLE_GROUP_LABELS, 
  MuscleGroup,
  WeeklyVolumeRecord,
} from '@/types/training';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Filter, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WeeksVolumeTableProps {
  year: number;
  month: number;
  onMonthChange?: (year: number, month: number) => void;
}

export function WeeksVolumeTable({ year, month, onMonthChange }: WeeksVolumeTableProps) {
  const { useTrainingDaysForMonth } = useTrainingDays();
  const { data: cloudDays, isLoading } = useTrainingDaysForMonth(year, month);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  
  const trainingDays = cloudDays ? transformToLocalFormat(cloudDays) : [];
  const weeks = getWeeksInMonth(year, month);
  
  // Calculate volume for each week
  const weeklyData = weeks.map(week => ({
    ...week,
    records: calculateWeeklyVolumeRecords(trainingDays, week.start, week.end),
  }));

  const muscleGroups = Object.keys(MUSCLE_GROUP_LABELS) as MuscleGroup[];
  
  const filteredMuscles = selectedMuscle === 'all' 
    ? muscleGroups 
    : [selectedMuscle];

  const getStatusBadge = (status: WeeklyVolumeRecord['status']) => {
    // Use neutral colors - informative, not judgmental
    const styles = {
      under: 'bg-muted/50 text-muted-foreground',
      ok: 'bg-progress-good/20 text-progress-good',
      over: 'bg-muted/50 text-muted-foreground',
    };
    const labels = {
      under: 'Ниже рек.',
      ok: 'В пределах',
      over: 'Выше рек.',
    };
    return (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', styles[status])}>
        {labels[status]}
      </span>
    );
  };

  const handlePrevMonth = () => {
    const newMonth = month === 0 ? 11 : month - 1;
    const newYear = month === 0 ? year - 1 : year;
    onMonthChange?.(newYear, newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = month === 11 ? 0 : month + 1;
    const newYear = month === 11 ? year + 1 : year;
    onMonthChange?.(newYear, newMonth);
  };

  if (isLoading) {
    return (
      <div className="stat-card flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="stat-card">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-lg font-semibold">
              {format(new Date(year, month), 'LLLL yyyy', { locale: ru })}
            </h3>
            <span className="text-xs text-muted-foreground">Объём по неделям</span>
          </div>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* Filter */}
        <Select value={selectedMuscle} onValueChange={(v) => setSelectedMuscle(v as MuscleGroup | 'all')}>
          <SelectTrigger className="w-[140px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Фильтр" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все мышцы</SelectItem>
            {muscleGroups.map(mg => (
              <SelectItem key={mg} value={mg}>
                {MUSCLE_GROUP_LABELS[mg]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Weeks tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {weeklyData.map((week) => (
          <div
            key={week.weekNumber}
            className="flex-shrink-0 px-3 py-2 bg-secondary/50 rounded-lg text-center min-w-[100px]"
          >
            <div className="text-xs text-muted-foreground">Неделя {week.weekNumber}</div>
            <div className="text-xs text-muted-foreground/70">
              {format(week.start, 'd MMM', { locale: ru })} - {format(week.end, 'd MMM', { locale: ru })}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Мышца</th>
              {weeklyData.map((week) => (
                <th key={week.weekNumber} className="text-center py-3 px-2 font-medium text-muted-foreground">
                  Нед. {week.weekNumber}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMuscles.map(muscle => (
              <tr key={muscle} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="py-3 px-2 font-medium">
                  {MUSCLE_GROUP_LABELS[muscle]}
                </td>
                {weeklyData.map((week) => {
                  const record = week.records.find(r => r.muscleGroup === muscle);
                  if (!record) return <td key={week.weekNumber} className="text-center py-3 px-2">-</td>;
                  
                    return (
                      <td key={week.weekNumber} className="text-center py-3 px-2">
                        <div className="flex flex-col items-center gap-1">
                          <span className={cn('font-bold', getWeekStatusColor(record.status))}>
                            {record.actualSets}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            рек: {record.plannedSets}
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {record.deviation > 0 ? '+' : ''}{record.deviation}
                          </div>
                          {getStatusBadge(record.status)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">Подходы за неделю:</div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-progress-good" />
            <span className="text-muted-foreground">В пределах рекомендации</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <span className="text-muted-foreground">Ниже / выше рекомендации</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/70 mt-3 leading-relaxed">
          Отклонения от рекомендации — это нормально. Объём балансируется автоматически в течение месяца.
        </p>
      </div>
    </div>
  );
}
