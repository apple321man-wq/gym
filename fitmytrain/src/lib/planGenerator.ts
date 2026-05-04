import { 
  TrainingDay, 
  PlannedExercise, 
  PlannedSet, 
  PersonalMax,
  TrainingIntensity,
  INTENSITY_PERCENT
} from '@/types/training';
import { TrainingProgram, TrainingSession, WeekDay } from '@/data/trainingPrograms';
import { getExerciseById } from '@/data/exercises';

interface GeneratePlanOptions {
  userId: string;
  program: TrainingProgram;
  selectedDays: WeekDay[];
  startDate: Date;
  weeksAhead?: number;
  personalMaxes: PersonalMax[];
  getLastLoggedWeight: (exerciseId: string) => number | null;
}

// Вычисляем рабочий вес на основе ПМ и интенсивности
function calculateWorkingWeight(
  pm: number | null,
  percentOfPM: number | undefined,
  intensity: TrainingIntensity,
  lastLoggedWeight: number | null
): number {
  if (pm && percentOfPM) {
    return Math.round((pm * percentOfPM / 100) / 2.5) * 2.5;
  }
  
  if (pm) {
    // Используем интенсивность сессии
    const range = INTENSITY_PERCENT[intensity as keyof typeof INTENSITY_PERCENT];
    if (range) {
      const avgPercent = (range.min + range.max) / 2;
      return Math.round((pm * avgPercent / 100) / 2.5) * 2.5;
    }
  }

  // Если нет ПМ, используем последний залогированный вес или 0
  return lastLoggedWeight || 0;
}

// Генерация одного тренировочного дня
function generateTrainingDay(
  userId: string,
  date: Date,
  session: TrainingSession,
  personalMaxes: PersonalMax[],
  getLastLoggedWeight: (exerciseId: string) => number | null
): TrainingDay {
  const exercises: PlannedExercise[] = session.exercises.map(ex => {
    const exercise = getExerciseById(ex.exerciseId);
    const pm = personalMaxes.find(p => p.exerciseId === ex.exerciseId);
    const lastWeight = getLastLoggedWeight(ex.exerciseId);
    
    const targetWeight = calculateWorkingWeight(
      pm?.calculatedPM || null,
      ex.percentOfPM,
      session.intensity,
      lastWeight
    );

    const sets: PlannedSet[] = [];
    for (let i = 0; i < ex.sets; i++) {
      sets.push({
        id: crypto.randomUUID(),
        setNumber: i + 1,
        targetReps: ex.reps,
        targetWeight,
        completed: false,
      });
    }

    return {
      id: crypto.randomUUID(),
      exerciseId: ex.exerciseId,
      sets,
      completed: false,
    };
  });

  return {
    id: crypto.randomUUID(),
    userId,
    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    intensity: session.intensity,
    exercises,
    completed: false,
  };
}

// Генерация полного плана тренировок
export function generateTrainingPlan(options: GeneratePlanOptions): TrainingDay[] {
  const {
    userId,
    program,
    selectedDays,
    startDate,
    weeksAhead = 12,
    personalMaxes,
    getLastLoggedWeight,
  } = options;

  // Monday-based mapping: monday=0, tuesday=1, ..., sunday=6
  const dayToMondayBased: Record<WeekDay, number> = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6,
  };

  const result: TrainingDay[] = [];
  const sortedDays = [...selectedDays].sort((a, b) => dayToMondayBased[a] - dayToMondayBased[b]);
  
  // Нормализуем startDate к началу дня
  const normalizedStart = new Date(startDate);
  normalizedStart.setHours(0, 0, 0, 0);
  
  // Находим начало текущей недели (понедельник)
  // getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
  // Convert to Monday-based: Monday=0, ..., Sunday=6
  const startDayOfWeek = normalizedStart.getDay();
  const mondayBasedToday = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const weekStart = new Date(normalizedStart);
  weekStart.setDate(normalizedStart.getDate() - mondayBasedToday);
  
  // Сохраняем базовую дату понедельника для вычислений
  const weekStartDate = weekStart.getDate();
  const weekStartMonth = weekStart.getMonth();
  const weekStartYear = weekStart.getFullYear();

  for (let week = 0; week < weeksAhead; week++) {
    for (let dayIndex = 0; dayIndex < sortedDays.length; dayIndex++) {
      const weekDay = sortedDays[dayIndex];
      const mondayBasedTarget = dayToMondayBased[weekDay];
      
      // Вычисляем дату для этого дня недели от базового понедельника
      const currentDay = new Date(weekStartYear, weekStartMonth, weekStartDate + week * 7 + mondayBasedTarget);
      
      // Пропускаем дни раньше startDate
      if (currentDay < normalizedStart) {
        continue;
      }

      // Выбираем сессию циклически
      const sessionIndex = (week * sortedDays.length + dayIndex) % program.sessions.length;
      const session = program.sessions[sessionIndex];

      const trainingDay = generateTrainingDay(
        userId,
        currentDay,
        session,
        personalMaxes,
        getLastLoggedWeight
      );

      result.push(trainingDay);
    }
  }

  return result.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

// Регенерация одного дня с обновлёнными данными ПМ
export function regenerateTrainingDay(
  existingDay: TrainingDay,
  session: TrainingSession,
  personalMaxes: PersonalMax[],
  getLastLoggedWeight: (exerciseId: string) => number | null
): TrainingDay {
  // Если день уже завершён, не обновляем
  if (existingDay.completed) {
    return existingDay;
  }

  return generateTrainingDay(
    existingDay.userId,
    new Date(existingDay.date),
    session,
    personalMaxes,
    getLastLoggedWeight
  );
}
