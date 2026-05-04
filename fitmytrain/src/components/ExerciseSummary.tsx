import React from 'react';
import { getLoadAssessment, getNextSessionRecommendation, type RIRLevel, type TrainingType } from '@/lib/rirWeightAdjustment';
import { cn } from '@/lib/utils';

interface ExerciseSummaryProps {
  exerciseName: string;
  lastRIR: RIRLevel;
  trainingType: TrainingType;
  currentWeight: number;
  nextWeight: number;
}

export function ExerciseSummary({ exerciseName, lastRIR, trainingType, currentWeight, nextWeight }: ExerciseSummaryProps) {
  const assessment = getLoadAssessment(lastRIR, trainingType);
  const recommendation = getNextSessionRecommendation(currentWeight, nextWeight);

  const colorClasses = {
    good: 'text-[hsl(var(--progress-good))] bg-[hsl(var(--progress-good))]/10 border-[hsl(var(--progress-good))]/30',
    warning: 'text-[hsl(var(--progress-warning))] bg-[hsl(var(--progress-warning))]/10 border-[hsl(var(--progress-warning))]/30',
    critical: 'text-[hsl(var(--progress-critical))] bg-[hsl(var(--progress-critical))]/10 border-[hsl(var(--progress-critical))]/30',
  };

  return (
    <div className={cn('rounded-xl border p-3 space-y-1', colorClasses[assessment.color])}>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">{exerciseName}</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-current/10">
          {assessment.label}
        </span>
      </div>
      <div className="text-xs opacity-80">
        Следующая тренировка: <span className="font-semibold">{recommendation}</span>
      </div>
    </div>
  );
}
