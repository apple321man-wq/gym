import React from 'react';
import { WeeklyVolume, MUSCLE_GROUP_LABELS, MuscleGroup } from '@/types/training';
import { getVolumeStatus } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface VolumeChartProps {
  volumes: WeeklyVolume[];
}

const MUSCLE_COLORS: Partial<Record<MuscleGroup, string>> = {
  chest: 'bg-muscle-chest',
  back: 'bg-muscle-back',
  quadriceps: 'bg-muscle-legs',
  hamstrings: 'bg-muscle-legs/70',
  glutes: 'bg-muscle-legs/50',
  shoulders: 'bg-muscle-shoulders',
  biceps: 'bg-muscle-arms',
  triceps: 'bg-muscle-arms/70',
  core: 'bg-muscle-core',
};

export function VolumeChart({ volumes }: VolumeChartProps) {
  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold mb-4">Объём по мышечным группам</h3>
      
      <div className="space-y-4">
        {volumes.map(volume => {
          const status = getVolumeStatus(volume.percentage);
          const barWidth = Math.min(volume.percentage, 150);
          
          return (
            <div key={volume.muscleGroup}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium">
                  {MUSCLE_GROUP_LABELS[volume.muscleGroup]}
                </span>
                <span className={cn(
                  'text-sm font-bold',
                  status === 'good' && 'text-progress-good',
                  status === 'warning' && 'text-progress-warning',
                  status === 'critical' && 'text-progress-critical'
                )}>
                  {volume.percentage}%
                </span>
              </div>
              
              <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                {/* Recommended range indicator */}
                <div 
                  className="absolute h-full bg-primary/20 rounded-full"
                  style={{ 
                    left: '0%',
                    width: '100%',
                  }}
                />
                
                {/* Actual progress */}
                <div 
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    MUSCLE_COLORS[volume.muscleGroup] ?? 'bg-primary'
                  )}
                  style={{ width: `${barWidth}%` }}
                />
                
                {/* Optimal range markers */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-primary/50"
                  style={{ left: '85%' }}
                />
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-primary/50"
                  style={{ left: '100%' }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{volume.sets} подходов</span>
                <span>Рек: {volume.recommended.min}–{volume.recommended.max}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-progress-good" />
          <span className="text-muted-foreground">Норма (85–115%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-progress-warning" />
          <span className="text-muted-foreground">Отклонение</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-progress-critical" />
          <span className="text-muted-foreground">Критично</span>
        </div>
      </div>
    </div>
  );
}
