import React from 'react';
import { useTrainingDays } from '@/hooks/useTrainingDays';
import { transformToLocalFormat } from '@/lib/dataTransformers';
import { 
  calculateMonthlyVolumeRecords,
  getMonthStatusColor,
  getMonthStatusLabel,
} from '@/lib/calculations';
import { 
  MUSCLE_GROUP_LABELS, 
  MonthlyVolumeRecord,
} from '@/types/training';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';

interface MonthVolumeTableProps {
  year: number;
  month: number;
  onMonthChange?: (year: number, month: number) => void;
}

export function MonthVolumeTable({ year, month, onMonthChange }: MonthVolumeTableProps) {
  const { useTrainingDaysForMonth } = useTrainingDays();
  const { data: cloudDays, isLoading } = useTrainingDaysForMonth(year, month);
  
  const trainingDays = cloudDays ? transformToLocalFormat(cloudDays) : [];
  const records = calculateMonthlyVolumeRecords(trainingDays, year, month);

  // Check if there's any completed training data
  const totalActualSets = records.reduce((sum, r) => sum + r.actualSets, 0);
  const hasNoData = totalActualSets === 0;

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

  const getStatusBadge = (status: MonthlyVolumeRecord['status'], muscleHasNoData: boolean) => {
    if (muscleHasNoData) {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground">
          Нет данных
        </span>
      );
    }
    // Use neutral colors for all statuses - informative, not judgmental
    const styles = {
      under: 'bg-muted/50 text-muted-foreground',
      low: 'bg-muted/50 text-muted-foreground',
      optimal: 'bg-progress-good/20 text-progress-good',
      over: 'bg-muted/50 text-muted-foreground',
      risk: 'bg-muted/50 text-muted-foreground',
    };
    return (
      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', styles[status])}>
        {getMonthStatusLabel(status)}
      </span>
    );
  };

  const getTrendIcon = (record: MonthlyVolumeRecord) => {
    if (record.actualSets === 0) {
      return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
    // Use neutral colors for trend icons
    if (record.percentOfPlan > 105) {
      return <TrendingUp className="w-4 h-4 text-muted-foreground" />;
    } else if (record.percentOfPlan < 85) {
      return <TrendingDown className="w-4 h-4 text-muted-foreground" />;
    }
    return <Minus className="w-4 h-4 text-progress-good" />;
  };

  const getProgressColor = (status: MonthlyVolumeRecord['status'], muscleHasNoData: boolean): string => {
    if (muscleHasNoData) return 'bg-muted';
    // Use primary color for optimal, neutral for others
    switch (status) {
      case 'optimal': return 'bg-progress-good';
      case 'low':
      case 'over': return 'bg-primary/60';
      case 'under':
      case 'risk': return 'bg-primary/40';
    }
  };

  // Summary stats
  const optimalCount = hasNoData ? 0 : records.filter(r => r.status === 'optimal').length;
  const underCount = hasNoData ? 0 : records.filter(r => r.status === 'under' || r.status === 'low').length;
  const overCount = hasNoData ? 0 : records.filter(r => r.status === 'over' || r.status === 'risk').length;
  const avgPercent = records.length > 0 && !hasNoData
    ? Math.round(records.reduce((sum, r) => sum + r.percentOfPlan, 0) / records.length)
    : 0;

  if (isLoading) {
    return (
      <div className="stat-card flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="stat-card">
      {/* Header */}
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
            <span className="text-xs text-muted-foreground">Объём за месяц</span>
          </div>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className={cn(
          "rounded-lg p-3 text-center",
          hasNoData ? "bg-muted/30" : "bg-secondary/50"
        )}>
          <div className={cn(
            "text-2xl font-bold",
            hasNoData ? "text-muted-foreground" : "text-primary"
          )}>
            {hasNoData ? "—" : `${avgPercent}%`}
          </div>
          <div className="text-xs text-muted-foreground">Средний %</div>
        </div>
        <div className={cn(
          "rounded-lg p-3 text-center",
          hasNoData ? "bg-muted/30" : "bg-progress-good/10"
        )}>
          <div className={cn(
            "text-2xl font-bold",
            hasNoData ? "text-muted-foreground" : "text-progress-good"
          )}>
            {hasNoData ? "—" : optimalCount}
          </div>
          <div className="text-xs text-muted-foreground">В пределах</div>
        </div>
        <div className={cn(
          "rounded-lg p-3 text-center",
          hasNoData ? "bg-muted/30" : "bg-muted/50"
        )}>
          <div className={cn(
            "text-2xl font-bold",
            hasNoData ? "text-muted-foreground" : "text-foreground/70"
          )}>
            {hasNoData ? "—" : underCount}
          </div>
          <div className="text-xs text-muted-foreground">Ниже</div>
        </div>
        <div className={cn(
          "rounded-lg p-3 text-center",
          hasNoData ? "bg-muted/30" : "bg-muted/50"
        )}>
          <div className={cn(
            "text-2xl font-bold",
            hasNoData ? "text-muted-foreground" : "text-foreground/70"
          )}>
            {hasNoData ? "—" : overCount}
          </div>
          <div className="text-xs text-muted-foreground">Выше</div>
        </div>
      </div>

      {/* Supportive helper text */}
      <div className="bg-primary/5 rounded-lg px-4 py-3 mb-6 border border-primary/10">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {hasNoData ? (
            "Объём распределяется автоматически по тренировкам. Просто следуй плану."
          ) : avgPercent >= 85 && avgPercent <= 105 ? (
            "Отлично! Твой объём в рекомендуемых пределах. Продолжай в том же духе."
          ) : avgPercent < 85 ? (
            "Объём чуть ниже рекомендации — это нормально, если были пропуски или восстановление."
          ) : (
            "Объём выше рекомендации — убедись, что успеваешь восстанавливаться между тренировками."
          )}
        </p>
      </div>

      {/* No data message */}
      {hasNoData && (
        <div className="bg-muted/20 rounded-lg p-6 mb-6 text-center">
          <div className="text-muted-foreground font-medium mb-1">
            Нет данных за период
          </div>
          <div className="text-sm text-muted-foreground/70">
            Начни тренировки, и мы покажем объём
          </div>
        </div>
      )}

      {/* Table */}
      <div className="space-y-3">
        {records.map(record => {
          const muscleHasNoData = record.actualSets === 0;
          // plannedMid is the target the program aims for (middle of recommendation range)
          const planTarget = record.plannedMid;
          // Scale positions relative to plannedMax (which is 100% of the bar)
          const actualPosition = Math.min(record.actualSets / record.plannedMax * 100, 100);
          const planPosition = (planTarget / record.plannedMax) * 100;
          const recMinPos = (record.plannedMin / record.plannedMax) * 100;
          const recMaxPos = 100;
          
          return (
            <div 
              key={record.muscleGroup}
              className={cn(
                "rounded-lg p-4 transition-colors",
                muscleHasNoData 
                  ? "bg-muted/20 hover:bg-muted/30" 
                  : "bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium",
                    muscleHasNoData && "text-muted-foreground"
                  )}>
                    {MUSCLE_GROUP_LABELS[record.muscleGroup]}
                  </span>
                  {getTrendIcon(record)}
                </div>
                <div className="flex items-center gap-2">
                  {!muscleHasNoData && (
                    <span className={cn('text-lg font-bold', getMonthStatusColor(record.status))}>
                      {record.percentOfPlan}%
                    </span>
                  )}
                  {getStatusBadge(record.status, muscleHasNoData)}
                </div>
              </div>
              
              {/* Visual bar with recommendation zone, plan marker, and actual bar */}
              <div className="relative h-5 bg-secondary/50 rounded-full overflow-visible mb-4">
                {/* Recommendation zone - neutral background band */}
                <div 
                  className="absolute top-0 bottom-0 bg-primary/10 rounded-full border border-primary/15"
                  style={{ 
                    left: `${recMinPos}%`, 
                    width: `${recMaxPos - recMinPos}%` 
                  }}
                />
                
                {/* Plan target marker - diamond shape in the middle of recommendation */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                  style={{ left: `${planPosition}%` }}
                >
                  <div className="w-3 h-3 bg-primary/40 border-2 border-primary/60 rotate-45 rounded-sm" />
                </div>
                
                {/* Actual volume bar */}
                {!muscleHasNoData && (
                  <div 
                    className={cn(
                      'absolute top-1 bottom-1 left-0 rounded-full transition-all duration-500',
                      getProgressColor(record.status, muscleHasNoData)
                    )}
                    style={{ width: `${actualPosition}%` }}
                  />
                )}
                
                {/* Scale labels below the bar */}
                <div 
                  className="absolute -bottom-4 text-[10px] text-muted-foreground/50 transform -translate-x-1/2"
                  style={{ left: `${recMinPos}%` }}
                >
                  {record.plannedMin}
                </div>
                <div 
                  className="absolute -bottom-4 text-[10px] text-primary/70 font-medium transform -translate-x-1/2"
                  style={{ left: `${planPosition}%` }}
                >
                  ◆ {planTarget}
                </div>
                <div 
                  className="absolute -bottom-4 text-[10px] text-muted-foreground/50 transform -translate-x-1/2"
                  style={{ left: `${recMaxPos}%` }}
                >
                  {record.plannedMax}
                </div>
              </div>
              
              {/* Labels - three distinct values */}
              <div className="grid grid-cols-3 gap-2 mt-6 text-xs">
                <div className="text-center">
                  <div className="text-muted-foreground mb-0.5">Выполнено</div>
                  <div className={cn(
                    "font-semibold",
                    muscleHasNoData ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {record.actualSets}
                  </div>
                </div>
                <div className="text-center border-x border-border/50">
                  <div className="text-muted-foreground mb-0.5">План</div>
                  <div className="font-semibold text-primary">
                    {planTarget}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground mb-0.5">Рекомендация</div>
                  <div className="font-medium text-muted-foreground">
                    {record.plannedMin}–{record.plannedMax}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">Как читать:</div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2 rounded bg-primary/10 border border-primary/15" />
            <span className="text-muted-foreground">Рекомендуемый диапазон</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-primary/40 border border-primary/60 rotate-45 rounded-sm" />
            <span className="text-muted-foreground">Цель плана</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2 rounded bg-progress-good" />
            <span className="text-muted-foreground">Ваш объём</span>
          </div>
        </div>
      </div>
    </div>
  );
}
