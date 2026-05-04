import React, { useState } from 'react';
import { useWeightLogs } from '@/hooks/useWeightLogs';
import { getExerciseById } from '@/data/exercises';
import { WeightProgressPeriod, PERIOD_LABELS, ExerciseWeightProgress } from '@/types/training';
import { TrendingUp, TrendingDown, Minus, Dumbbell, Loader2 } from 'lucide-react';
import { subMonths, subYears } from 'date-fns';
import { formatWeight, isValidWeight } from '@/lib/weightFormat';

export function WeightProgressTracker() {
  const { getConfirmedLogsForExercise, getExercisesWithLogs, isLoading } = useWeightLogs();
  const [selectedPeriod, setSelectedPeriod] = useState<WeightProgressPeriod>('3m');

  const exerciseIds = getExercisesWithLogs();
  
  const getStartDate = (period: WeightProgressPeriod): Date => {
    const now = new Date();
    switch (period) {
      case '1m': return subMonths(now, 1);
      case '3m': return subMonths(now, 3);
      case '6m': return subMonths(now, 6);
      case '1y': return subYears(now, 1);
      case '3y': return subYears(now, 3);
    }
  };

  const calculateProgress = (): ExerciseWeightProgress[] => {
    const startDate = getStartDate(selectedPeriod);
    const results: ExerciseWeightProgress[] = [];

    for (const exerciseId of exerciseIds) {
      const logs = getConfirmedLogsForExercise(exerciseId);
      const exercise = getExerciseById(exerciseId);
      
      if (!exercise || logs.length === 0) continue;

      // Filter logs within the period AND with valid weights — never aggregate 0/null.
      const periodLogs = logs
        .filter(log => new Date(log.logged_at) >= startDate)
        .filter(log => isValidWeight(log.weight));
      
      if (periodLogs.length === 0) continue;

      // Get first and last entries
      const firstLog = periodLogs[0];
      const lastLog = periodLogs[periodLogs.length - 1];
      
      // Skip if same date
      if (firstLog.id === lastLog.id && periodLogs.length === 1) {
        // Show single entry with 0 change
        results.push({
          exerciseId,
          exerciseName: exercise.name,
          firstWeight: firstLog.weight,
          lastWeight: lastLog.weight,
          change: 0,
          percentChange: 0,
        });
        continue;
      }

      const change = lastLog.weight - firstLog.weight;
      const percentChange = firstLog.weight > 0 
        ? Math.round((change / firstLog.weight) * 100) 
        : 0;

      results.push({
        exerciseId,
        exerciseName: exercise.name,
        firstWeight: firstLog.weight,
        lastWeight: lastLog.weight,
        change,
        percentChange,
      });
    }

    // Sort by change amount (biggest gains first)
    return results.sort((a, b) => b.change - a.change);
  };

  const progressData = calculateProgress();

  if (isLoading) {
    return (
      <div className="stat-card flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (exerciseIds.length === 0) {
    return null; // Don't show if no weight logs
  }

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-primary" />
          Прогресс по весам
        </h4>
      </div>

      {/* Period selector */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {(Object.keys(PERIOD_LABELS) as WeightProgressPeriod[]).map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedPeriod === period
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80 text-muted-foreground'
            }`}
          >
            {PERIOD_LABELS[period]}
          </button>
        ))}
      </div>

      {/* Progress list */}
      {progressData.length > 0 ? (
        <div className="space-y-2">
          {progressData.map(item => (
            <div 
              key={item.exerciseId}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.exerciseName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatWeight(item.firstWeight)} → {formatWeight(item.lastWeight)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : item.change < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <Minus className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={`text-sm font-bold ${
                  item.change > 0 ? 'text-green-500' : 
                  item.change < 0 ? 'text-red-500' : 
                  'text-muted-foreground'
                }`}>
                  {item.change > 0 ? '+' : ''}{formatWeight(item.change)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          Нет данных за выбранный период
        </p>
      )}

      <p className="text-xs text-muted-foreground mt-3">
        Показаны только упражнения с ручным вводом веса
      </p>
    </div>
  );
}
