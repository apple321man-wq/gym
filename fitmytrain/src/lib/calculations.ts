import { 
  TrainingIntensity, 
  INTENSITY_PERCENT, 
  WeeklyVolume, 
  MuscleGroup, 
  RECOMMENDED_VOLUME_WEEKLY,
  RECOMMENDED_VOLUME_MONTHLY,
  PlannedExercise,
  TrainingDay,
  WeeklyVolumeRecord,
  MonthlyVolumeRecord,
  WeekStatus,
  MonthStatus,
  LOAD_COEFFICIENTS,
} from '@/types/training';
import { getExerciseById } from '@/data/exercises';
import { startOfWeek, endOfWeek, getWeek, getYear, startOfMonth, endOfMonth, eachWeekOfInterval } from 'date-fns';

// Формула Epley для расчёта ПМ
export function calculatePM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

// Расчёт рабочего веса от ПМ по интенсивности
export function calculateWorkingWeight(pm: number, intensity: Exclude<TrainingIntensity, 'rest'>): number {
  const range = INTENSITY_PERCENT[intensity];
  const percentage = (range.min + range.max) / 2 / 100;
  return Math.round(pm * percentage / 2.5) * 2.5; // Округление до 2.5 кг
}

// Расчёт диапазона весов
export function calculateWeightRange(pm: number, intensity: Exclude<TrainingIntensity, 'rest'>): { min: number; max: number } {
  const range = INTENSITY_PERCENT[intensity];
  return {
    min: Math.round(pm * range.min / 100 / 2.5) * 2.5,
    max: Math.round(pm * range.max / 100 / 2.5) * 2.5,
  };
}

// Calculate volume with load coefficients
export function calculateVolumeWithCoefficients(exercises: PlannedExercise[]): Map<MuscleGroup, number> {
  const volumeMap = new Map<MuscleGroup, number>();
  
  // Initialize all muscle groups
  const allMuscles: MuscleGroup[] = ['chest', 'back', 'quadriceps', 'hamstrings', 'glutes', 'shoulders', 'biceps', 'triceps', 'core'];
  allMuscles.forEach(mg => volumeMap.set(mg, 0));

  exercises.forEach(pe => {
    const exercise = getExerciseById(pe.exerciseId);
    if (!exercise) return;

    const completedSets = pe.sets.filter(s => s.completed).length;
    if (completedSets === 0) return;

    // Apply load coefficients for each muscle involved
    exercise.muscleLoads.forEach(load => {
      const coefficient = LOAD_COEFFICIENTS[load.loadType];
      const currentVolume = volumeMap.get(load.muscleGroup) || 0;
      volumeMap.set(load.muscleGroup, currentVolume + (completedSets * coefficient));
    });
  });

  return volumeMap;
}

// Calculate weekly volume records for a specific week
export function calculateWeeklyVolumeRecords(
  trainingDays: TrainingDay[],
  weekStart: Date,
  weekEnd: Date
): WeeklyVolumeRecord[] {
  // Filter training days for this week
  const weekDays = trainingDays.filter(d => {
    const date = new Date(d.date);
    return date >= weekStart && date <= weekEnd && d.intensity !== 'rest';
  });

  // Aggregate all exercises from the week
  const allExercises = weekDays.flatMap(d => d.exercises);
  const volumeMap = calculateVolumeWithCoefficients(allExercises);

  const results: WeeklyVolumeRecord[] = [];
  
  Object.entries(RECOMMENDED_VOLUME_WEEKLY).forEach(([muscle, recommended]) => {
    const muscleGroup = muscle as MuscleGroup;
    const actualSets = volumeMap.get(muscleGroup) || 0;
    const plannedSets = (recommended.min + recommended.max) / 2;
    const deviation = actualSets - plannedSets;
    
    // Status logic: <70% = under, 70-110% = ok, >110% = over
    const percentage = plannedSets > 0 ? (actualSets / plannedSets) * 100 : 0;
    let status: WeekStatus;
    if (percentage < 70) status = 'under';
    else if (percentage <= 110) status = 'ok';
    else status = 'over';

    results.push({
      muscleGroup,
      plannedSets: Math.round(plannedSets * 10) / 10,
      actualSets: Math.round(actualSets * 10) / 10,
      deviation: Math.round(deviation * 10) / 10,
      status,
    });
  });

  return results;
}

// Get week number within a month (1-5)
export function getWeekOfMonth(date: Date): number {
  const firstDay = startOfMonth(date);
  const firstWeekStart = startOfWeek(firstDay, { weekStartsOn: 1 });
  const currentWeekStart = startOfWeek(date, { weekStartsOn: 1 });
  
  const diffTime = currentWeekStart.getTime() - firstWeekStart.getTime();
  const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
  
  return diffWeeks + 1;
}

// Get all weeks in a month with their date ranges
export function getWeeksInMonth(year: number, month: number): { weekNumber: number; start: Date; end: Date }[] {
  const monthStart = new Date(year, month, 1);
  const monthEnd = endOfMonth(monthStart);
  
  const weeks = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 }
  );

  return weeks.map((weekStart, index) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    // Clamp to month boundaries
    const clampedStart = weekStart < monthStart ? monthStart : weekStart;
    const clampedEnd = weekEnd > monthEnd ? monthEnd : weekEnd;
    
    return {
      weekNumber: index + 1,
      start: clampedStart,
      end: clampedEnd,
    };
  });
}

// Calculate monthly volume summary
export function calculateMonthlyVolumeRecords(
  trainingDays: TrainingDay[],
  year: number,
  month: number
): MonthlyVolumeRecord[] {
  const weeks = getWeeksInMonth(year, month);
  
  // Calculate volume for each week and aggregate
  const totalVolumeMap = new Map<MuscleGroup, number>();
  const allMuscles: MuscleGroup[] = ['chest', 'back', 'quadriceps', 'hamstrings', 'glutes', 'shoulders', 'biceps', 'triceps', 'core'];
  allMuscles.forEach(mg => totalVolumeMap.set(mg, 0));

  weeks.forEach(week => {
    const weekRecords = calculateWeeklyVolumeRecords(trainingDays, week.start, week.end);
    weekRecords.forEach(record => {
      const current = totalVolumeMap.get(record.muscleGroup) || 0;
      totalVolumeMap.set(record.muscleGroup, current + record.actualSets);
    });
  });

  const results: MonthlyVolumeRecord[] = [];
  
  Object.entries(RECOMMENDED_VOLUME_MONTHLY).forEach(([muscle, recommended]) => {
    const muscleGroup = muscle as MuscleGroup;
    const actualSets = totalVolumeMap.get(muscleGroup) || 0;
    const plannedMid = (recommended.min + recommended.max) / 2;
    const percentOfPlan = plannedMid > 0 ? (actualSets / plannedMid) * 100 : 0;
    
    // Status: <70% = under, 70-84% = low, 85-105% = optimal, 106-120% = over, >120% = risk
    let status: MonthStatus;
    if (percentOfPlan < 70) status = 'under';
    else if (percentOfPlan < 85) status = 'low';
    else if (percentOfPlan <= 105) status = 'optimal';
    else if (percentOfPlan <= 120) status = 'over';
    else status = 'risk';

    results.push({
      muscleGroup,
      plannedMin: recommended.min,
      plannedMax: recommended.max,
      plannedMid: Math.round(plannedMid * 10) / 10,
      actualSets: Math.round(actualSets * 10) / 10,
      percentOfPlan: Math.round(percentOfPlan),
      status,
    });
  });

  return results;
}

// Расчёт недельного объёма по мышечным группам (backward compatibility)
export function calculateWeeklyVolume(exercises: PlannedExercise[]): WeeklyVolume[] {
  const volumeMap = calculateVolumeWithCoefficients(exercises);
  const repsMap = new Map<MuscleGroup, number>();

  exercises.forEach(pe => {
    const exercise = getExerciseById(pe.exerciseId);
    if (!exercise) return;

    const completedSets = pe.sets.filter(s => s.completed);
    const totalReps = completedSets.reduce((sum, s) => sum + (s.actualReps || s.targetReps), 0);
    
    exercise.muscleLoads.forEach(load => {
      if (load.loadType === 'primary') {
        const current = repsMap.get(load.muscleGroup) || 0;
        repsMap.set(load.muscleGroup, current + totalReps);
      }
    });
  });

  const result: WeeklyVolume[] = [];
  
  Object.keys(RECOMMENDED_VOLUME_WEEKLY).forEach(mg => {
    const muscleGroup = mg as MuscleGroup;
    const sets = volumeMap.get(muscleGroup) || 0;
    const reps = repsMap.get(muscleGroup) || 0;
    const recommended = RECOMMENDED_VOLUME_WEEKLY[muscleGroup];
    const midpoint = (recommended.min + recommended.max) / 2;
    const percentage = Math.round((sets / midpoint) * 100);

    result.push({
      muscleGroup,
      sets: Math.round(sets * 10) / 10,
      reps,
      recommended,
      percentage,
    });
  });

  return result;
}

// Получение цветового статуса для процента выполнения
export function getVolumeStatus(percentage: number): 'good' | 'warning' | 'critical' {
  if (percentage >= 85 && percentage <= 115) return 'good';
  if (percentage >= 70 && percentage <= 130) return 'warning';
  return 'critical';
}

// Get status color for week status
export function getWeekStatusColor(status: WeekStatus): string {
  switch (status) {
    case 'ok': return 'text-progress-good';
    case 'under': return 'text-progress-warning';
    case 'over': return 'text-progress-critical';
  }
}

// Get status color for month status  
export function getMonthStatusColor(status: MonthStatus): string {
  switch (status) {
    case 'optimal': return 'text-progress-good';
    case 'low': 
    case 'over': return 'text-progress-warning';
    case 'under':
    case 'risk': return 'text-progress-critical';
  }
}

// Get status label for month (supportive tone)
export function getMonthStatusLabel(status: MonthStatus): string {
  switch (status) {
    case 'under': return 'Ниже рекомендации';
    case 'low': return 'Чуть ниже';
    case 'optimal': return 'В пределах';
    case 'over': return 'Чуть выше';
    case 'risk': return 'Выше рекомендации';
  }
}

// Генерация фидбэка после тренировки
export function generateFeedback(
  isMale: boolean,
  volumeCompletion: number,
  daysCompletion: number,
  completedSets: number,
  targetSets: number
): { praise: string; analysis: string } {
  const setCompletion = Math.round((completedSets / targetSets) * 100);
  
  // Похвала
  let praise: string;
  if (setCompletion >= 90) {
    praise = isMale 
      ? 'Отличная работа. Объём выдержан, силовая нагрузка на уровне.'
      : 'Отличная работа. Объём выдержан, силовая нагрузка на уровне.';
  } else if (setCompletion >= 70) {
    praise = isMale
      ? 'Хорошая тренировка. Основная программа выполнена.'
      : 'Хорошая тренировка. Основная программа выполнена.';
  } else {
    praise = isMale
      ? 'Тренировка засчитана. Но есть над чем поработать.'
      : 'Тренировка засчитана. Но есть над чем поработать.';
  }

  // Анализ
  const analysisPoints: string[] = [];
  
  if (setCompletion >= 90) {
    analysisPoints.push('✓ Все подходы выполнены');
  } else {
    analysisPoints.push(`✗ Выполнено ${setCompletion}% подходов`);
  }

  if (volumeCompletion >= 85 && volumeCompletion <= 115) {
    analysisPoints.push('✓ Недельный объём в норме');
  } else if (volumeCompletion < 85) {
    analysisPoints.push(`✗ Недобор объёма: ${volumeCompletion}%`);
  } else {
    analysisPoints.push(`! Перебор объёма: ${volumeCompletion}%`);
  }

  return {
    praise,
    analysis: analysisPoints.join('\n'),
  };
}

// Расчёт дней до обновления ПМ
export function getDaysUntilPMUpdate(lastUpdate: Date, weeks: number = 7): number {
  const targetDate = new Date(lastUpdate);
  targetDate.setDate(targetDate.getDate() + weeks * 7);
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
