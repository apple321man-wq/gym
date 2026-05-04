import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useTrainingDays, TrainingDayWithExercises } from '@/hooks/useTrainingDays';
import { transformToLocalFormat } from '@/lib/dataTransformers';
import { calculateVolumeWithCoefficients } from '@/lib/calculations';
import { MUSCLE_GROUP_LABELS, MuscleGroup, RECOMMENDED_VOLUME_WEEKLY } from '@/types/training';
import { getExerciseById } from '@/data/exercises';
import { cn } from '@/lib/utils';
import { format, startOfWeek, endOfWeek, eachWeekOfInterval, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TimePeriod = '3m' | '6m' | '1y';

interface WeeklyDataPoint {
  weekLabel: string;
  weekStart: Date;
  completed: number;
  planned: number;
}

export function VolumeTrendChart() {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('chest');
  const [period, setPeriod] = useState<TimePeriod>('3m');
  
  const { useAllTrainingDays } = useTrainingDays();
  const { data: cloudDays, isLoading } = useAllTrainingDays();
  
  const muscleGroups = Object.keys(MUSCLE_GROUP_LABELS) as MuscleGroup[];
  
  // Calculate weekly volume data for the selected muscle group
  const chartData = useMemo(() => {
    if (!cloudDays || cloudDays.length === 0) return [];
    
    const trainingDays = transformToLocalFormat(cloudDays);
    
    // Determine date range based on period
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case '3m': startDate = subMonths(now, 3); break;
      case '6m': startDate = subMonths(now, 6); break;
      case '1y': startDate = subMonths(now, 12); break;
    }
    
    // Get all weeks in the period
    const weeks = eachWeekOfInterval(
      { start: startDate, end: now },
      { weekStartsOn: 1 }
    );
    
    // Get recommended volume for planning reference
    const recommended = RECOMMENDED_VOLUME_WEEKLY[selectedMuscle];
    const plannedPerWeek = (recommended.min + recommended.max) / 2;
    
    // Calculate volume for each week
    const weeklyData: WeeklyDataPoint[] = weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      
      // Filter training days for this week
      const weekDays = trainingDays.filter(d => {
        const date = new Date(d.date);
        return date >= weekStart && date <= weekEnd && d.intensity !== 'rest';
      });
      
      // Calculate completed volume for selected muscle
      const allExercises = weekDays.flatMap(d => d.exercises);
      const volumeMap = calculateVolumeWithCoefficients(allExercises);
      const completedVolume = volumeMap.get(selectedMuscle) || 0;
      
      return {
        weekLabel: format(weekStart, 'd MMM', { locale: ru }),
        weekStart,
        completed: Math.round(completedVolume * 10) / 10,
        planned: plannedPerWeek,
      };
    });
    
    return weeklyData;
  }, [cloudDays, selectedMuscle, period]);
  
  // Calculate trend based on recent data
  const trend = useMemo(() => {
    if (chartData.length < 4) return 'insufficient';
    
    // Compare first half to second half average
    const midpoint = Math.floor(chartData.length / 2);
    const firstHalf = chartData.slice(0, midpoint);
    const secondHalf = chartData.slice(midpoint);
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.completed, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.completed, 0) / secondHalf.length;
    
    const change = secondAvg - firstAvg;
    const percentChange = firstAvg > 0 ? (change / firstAvg) * 100 : 0;
    
    if (Math.abs(percentChange) < 10) return 'stable';
    if (percentChange > 0) return 'increasing';
    return 'decreasing';
  }, [chartData]);
  
  // Get supportive message based on trend
  const getTrendMessage = () => {
    switch (trend) {
      case 'stable':
        return 'Объём остаётся стабильным — отличная последовательность тренировок.';
      case 'increasing':
        return 'Наблюдается постепенное увеличение нагрузки — организм адаптируется.';
      case 'decreasing':
        return 'Колебания объёма — это нормально, особенно при изменении режима или восстановлении.';
      default:
        return 'Продолжай тренировки, чтобы увидеть тренды объёма.';
    }
  };
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-primary" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Minus className="w-4 h-4 text-primary" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="stat-card flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  const hasData = chartData.some(d => d.completed > 0);
  
  return (
    <div className="stat-card">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h3 className="text-lg font-semibold">Тренд объёма</h3>
        
        <div className="flex gap-2">
          {/* Muscle group selector */}
          <Select value={selectedMuscle} onValueChange={(v) => setSelectedMuscle(v as MuscleGroup)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {muscleGroups.map(mg => (
                <SelectItem key={mg} value={mg}>
                  {MUSCLE_GROUP_LABELS[mg]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Period selector */}
          <Select value={period} onValueChange={(v) => setPeriod(v as TimePeriod)}>
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 мес</SelectItem>
              <SelectItem value="6m">6 мес</SelectItem>
              <SelectItem value="1y">1 год</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Chart */}
      {hasData ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.5}
              />
              <XAxis 
                dataKey="weekLabel" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', marginBottom: '4px' }}
                formatter={(value: number, name: string) => {
                  // Show simplified, non-numeric feedback
                  if (name === 'planned') return null; // Hide planned from tooltip
                  const label = value > 0 ? 'Были тренировки' : 'Нет данных';
                  return [label, ''];
                }}
                separator=""
              />
              
              {/* Planned volume line - subtle reference */}
              <Line
                type="monotone"
                dataKey="planned"
                stroke="hsl(var(--primary))"
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
                opacity={0.4}
              />
              
              {/* Completed volume line - primary */}
              <Line
                type="monotone"
                dataKey="completed"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="text-muted-foreground font-medium mb-1">
              Нет данных за выбранный период
            </div>
            <div className="text-sm text-muted-foreground/70">
              Начни тренировки, чтобы увидеть тренды
            </div>
          </div>
        </div>
      )}
      
      {/* Trend summary */}
      {hasData && (
        <div className="mt-6 bg-primary/5 rounded-lg px-4 py-3 border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getTrendIcon()}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getTrendMessage()}
            </p>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-primary rounded" />
            <span className="text-muted-foreground">Выполнено</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-primary/40 rounded" style={{ borderStyle: 'dashed' }} />
            <span className="text-muted-foreground">План (ориентир)</span>
          </div>
        </div>
      </div>
    </div>
  );
}