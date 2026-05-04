import { TrainingGoal, ExperienceLevel, TrainingIntensity } from '@/types/training';

export type SplitType = 'full_body' | 'upper_lower' | 'ppl';
export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const WEEKDAY_LABELS: Record<WeekDay, string> = {
  monday: 'Понедельник',
  tuesday: 'Вторник',
  wednesday: 'Среда',
  thursday: 'Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье',
};

export const WEEKDAY_SHORT_LABELS: Record<WeekDay, string> = {
  monday: 'Пн',
  tuesday: 'Вт',
  wednesday: 'Ср',
  thursday: 'Чт',
  friday: 'Пт',
  saturday: 'Сб',
  sunday: 'Вс',
};

export const ALL_WEEKDAYS: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export interface ProgramExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  percentOfPM?: number; // If PM exists, use percentage; otherwise manual weight
}

export interface TrainingSession {
  name: string;
  intensity: TrainingIntensity;
  exercises: ProgramExercise[];
}

export interface TrainingProgram {
  goal: TrainingGoal;
  experience: ExperienceLevel;
  weeklyTrainings: number;
  splitType: SplitType;
  sessions: TrainingSession[];
  recommendation: string;
}

// Рекомендации по количеству тренировок
export const TRAINING_RECOMMENDATIONS: Record<ExperienceLevel, Record<TrainingGoal, string>> = {
  beginner: {
    muscle_gain: 'Новичкам рекомендуется 2-3 тренировки в неделю (Full Body). Это оптимальный баланс между нагрузкой и восстановлением.',
    recomposition: 'Для рекомпозиции новичку достаточно 2-3 тренировки в неделю с акцентом на базовые упражнения.',
    cutting: 'При сушке начинающим рекомендуется 2-3 силовые тренировки + кардио для сохранения мышц.',
    maintenance: 'Для поддержания формы новичкам достаточно 2-3 тренировки в неделю.',
  },
  intermediate: {
    muscle_gain: 'Опытным атлетам рекомендуется 4-5 тренировок в неделю (верх/низ или PPL сплит).',
    recomposition: 'Для рекомпозиции среднего уровня оптимально 3-4 силовые + 2-3 кардио в неделю.',
    cutting: 'При сушке рекомендуется 4-5 силовых + интенсивное кардио 3-4 раза в неделю.',
    maintenance: 'Для поддержания формы достаточно 3-4 тренировки в неделю.',
  },
  advanced: {
    muscle_gain: 'Продвинутым спортсменам подходят 5-6 тренировок в неделю (PPL×2).',
    recomposition: 'Для рекомпозиции продвинутого уровня оптимально 4-5 силовых + волновая периодизация.',
    cutting: 'При сушке продвинутым рекомендуется 5-6 силовых (PPL×2) + HIIT.',
    maintenance: 'Для поддержания формы достаточно 4-5 тренировок в неделю.',
  },
};

// Full Body программы — ротация акцентов (Ноги / Спина / Грудь)
// 1 тяжёлое базовое + 1–2 средних + 2 лёгких = 10–12 подходов, 40–55 минут
const FULL_BODY_SESSIONS: TrainingSession[] = [
  {
    name: 'Full Body Ноги (Тяжёлый)',
    intensity: 'hard',
    exercises: [
      { exerciseId: 'squat', sets: 3, reps: 5, percentOfPM: 80 },
      { exerciseId: 'bench-press', sets: 3, reps: 7, percentOfPM: 75 },
      { exerciseId: 'cable-row', sets: 2, reps: 9, percentOfPM: 70 },
      { exerciseId: 'lateral-raise', sets: 2, reps: 13 },
      { exerciseId: 'dumbbell-curl', sets: 2, reps: 11 },
    ],
  },
  {
    name: 'Full Body Спина (Средний)',
    intensity: 'medium',
    exercises: [
      { exerciseId: 'deadlift', sets: 3, reps: 4, percentOfPM: 80 },
      { exerciseId: 'pull-ups', sets: 3, reps: 7, percentOfPM: 75 },
      { exerciseId: 'dumbbell-bench-press', sets: 2, reps: 9, percentOfPM: 70 },
      { exerciseId: 'leg-press', sets: 2, reps: 11, percentOfPM: 65 },
      { exerciseId: 'tricep-pushdown', sets: 2, reps: 11 },
    ],
  },
  {
    name: 'Full Body Грудь (Средний)',
    intensity: 'medium',
    exercises: [
      { exerciseId: 'bench-press', sets: 3, reps: 5, percentOfPM: 80 },
      { exerciseId: 'bulgarian-split-squat', sets: 2, reps: 9, percentOfPM: 70 },
      { exerciseId: 'cable-row', sets: 2, reps: 9, percentOfPM: 70 },
      { exerciseId: 'lateral-raise', sets: 2, reps: 13 },
      { exerciseId: 'hammer-curl', sets: 2, reps: 11 },
    ],
  },
];

// Upper/Lower программы (для среднего уровня 4 раза в неделю)
const UPPER_LOWER_SESSIONS: TrainingSession[] = [
  {
    name: 'Верх (Тяжёлый)',
    intensity: 'hard',
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 5, percentOfPM: 80 },
      { exerciseId: 'dumbbell-shoulder-press', sets: 3, reps: 6, percentOfPM: 75 },
      { exerciseId: 'barbell-row', sets: 4, reps: 6, percentOfPM: 75 },
      { exerciseId: 'pull-ups', sets: 4, reps: 6 },
      { exerciseId: 'tricep-pushdown', sets: 3, reps: 8 },
      { exerciseId: 'barbell-curl', sets: 3, reps: 8 },
    ],
  },
  {
    name: 'Низ (Средний)',
    intensity: 'medium',
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 6, percentOfPM: 75 },
      { exerciseId: 'romanian-deadlift', sets: 3, reps: 6, percentOfPM: 70 },
      { exerciseId: 'lunges', sets: 3, reps: 8 },
      { exerciseId: 'leg-curl', sets: 3, reps: 10 },
      { exerciseId: 'leg-extension', sets: 3, reps: 10 },
    ],
  },
  {
    name: 'Верх (Средний)',
    intensity: 'medium',
    exercises: [
      { exerciseId: 'close-grip-bench', sets: 3, reps: 8 },
      { exerciseId: 'overhead-press', sets: 3, reps: 8 },
      { exerciseId: 'dumbbell-row', sets: 3, reps: 10 },
      { exerciseId: 'dips', sets: 3, reps: 8 },
      { exerciseId: 'dumbbell-curl', sets: 3, reps: 10 },
      { exerciseId: 'lateral-raise', sets: 2, reps: 12 },
    ],
  },
  {
    name: 'Низ (Тяжёлый)',
    intensity: 'hard',
    exercises: [
      { exerciseId: 'deadlift', sets: 4, reps: 5, percentOfPM: 80 },
      { exerciseId: 'front-squat', sets: 3, reps: 5, percentOfPM: 80 },
      { exerciseId: 'leg-extension', sets: 3, reps: 8 },
      { exerciseId: 'stiff-leg-deadlift', sets: 3, reps: 8 },
      { exerciseId: 'plank', sets: 3, reps: 12 },
    ],
  },
];

// PPL программы (для продвинутых 5-6 раз в неделю)
const PPL_SESSIONS: TrainingSession[] = [
  {
    name: 'Push (Тяжёлый)',
    intensity: 'hard',
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 5, percentOfPM: 85 },
      { exerciseId: 'dumbbell-shoulder-press', sets: 3, reps: 6, percentOfPM: 80 },
      { exerciseId: 'close-grip-bench', sets: 3, reps: 8 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 10 },
      { exerciseId: 'overhead-tricep-extension', sets: 3, reps: 8 },
    ],
  },
  {
    name: 'Pull (Средний)',
    intensity: 'medium',
    exercises: [
      { exerciseId: 'barbell-row', sets: 4, reps: 6, percentOfPM: 80 },
      { exerciseId: 'weighted-pull-ups', sets: 3, reps: 6 },
      { exerciseId: 'cable-row', sets: 3, reps: 8 },
      { exerciseId: 'barbell-curl', sets: 3, reps: 8 },
      { exerciseId: 'face-pull', sets: 3, reps: 12 },
    ],
  },
  {
    name: 'Legs (Средний)',
    intensity: 'medium',
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 6, percentOfPM: 80 },
      { exerciseId: 'stiff-leg-deadlift', sets: 3, reps: 6, percentOfPM: 75 },
      { exerciseId: 'lunges', sets: 3, reps: 8 },
      { exerciseId: 'leg-extension', sets: 3, reps: 10 },
      { exerciseId: 'leg-curl', sets: 3, reps: 10 },
    ],
  },
  {
    name: 'Push (Средний)',
    intensity: 'medium',
    exercises: [
      { exerciseId: 'incline-bench-press', sets: 3, reps: 8 },
      { exerciseId: 'overhead-press', sets: 3, reps: 8 },
      { exerciseId: 'dumbbell-bench-press', sets: 3, reps: 10 },
      { exerciseId: 'cable-crossover', sets: 3, reps: 12 },
      { exerciseId: 'tricep-pushdown', sets: 3, reps: 10 },
    ],
  },
  {
    name: 'Pull (Тяжёлый)',
    intensity: 'hard',
    exercises: [
      { exerciseId: 'deadlift', sets: 4, reps: 5, percentOfPM: 85 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 6 },
      { exerciseId: 'dumbbell-row', sets: 3, reps: 6 },
      { exerciseId: 'hammer-curl', sets: 3, reps: 8 },
      { exerciseId: 'face-pull', sets: 3, reps: 12 },
    ],
  },
  {
    name: 'Legs (Лёгкий)',
    intensity: 'easy',
    exercises: [
      { exerciseId: 'sumo-squat', sets: 3, reps: 12 },
      { exerciseId: 'leg-extension', sets: 3, reps: 12 },
      { exerciseId: 'leg-curl', sets: 3, reps: 12 },
      { exerciseId: 'glute-bridge', sets: 3, reps: 15 },
      { exerciseId: 'plank', sets: 3, reps: 15 },
    ],
  },
];

// Получение программы по параметрам пользователя
export function getTrainingProgram(
  goal: TrainingGoal,
  experience: ExperienceLevel,
  weeklyTrainings: number
): TrainingProgram {
  let splitType: SplitType;
  let sessions: TrainingSession[];

  // Определяем сплит на основе опыта и количества тренировок
  if (experience === 'beginner' || weeklyTrainings <= 3) {
    splitType = 'full_body';
    sessions = FULL_BODY_SESSIONS.slice(0, weeklyTrainings);
  } else if (experience === 'intermediate' || weeklyTrainings <= 4) {
    splitType = 'upper_lower';
    sessions = UPPER_LOWER_SESSIONS.slice(0, weeklyTrainings);
  } else {
    splitType = 'ppl';
    sessions = PPL_SESSIONS.slice(0, weeklyTrainings);
  }

  // Модификации в зависимости от цели
  if (goal === 'cutting') {
    // Больше повторений, меньше вес для сушки
    sessions = sessions.map(session => ({
      ...session,
      exercises: session.exercises.map(ex => ({
        ...ex,
        reps: Math.min(ex.reps + 2, 15),
        percentOfPM: ex.percentOfPM ? ex.percentOfPM - 5 : undefined,
      })),
    }));
  } else if (goal === 'maintenance') {
    // Умеренная нагрузка для поддержания
    sessions = sessions.map(session => ({
      ...session,
      intensity: 'medium' as TrainingIntensity,
      exercises: session.exercises.map(ex => ({
        ...ex,
        percentOfPM: ex.percentOfPM ? Math.min(ex.percentOfPM, 75) : undefined,
      })),
    }));
  }

  return {
    goal,
    experience,
    weeklyTrainings,
    splitType,
    sessions,
    recommendation: TRAINING_RECOMMENDATIONS[experience][goal],
  };
}

// Генерация тренировочных дней на основе выбранных дней недели
export function generateScheduledDays(
  program: TrainingProgram,
  selectedDays: WeekDay[],
  startDate: Date,
  weeksAhead: number = 12 // 3 месяца
): { date: Date; session: TrainingSession }[] {
  const result: { date: Date; session: TrainingSession }[] = [];
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

  // Сортируем выбранные дни по номеру дня недели (понедельник = 0)
  const sortedDays = [...selectedDays].sort((a, b) => dayToMondayBased[a] - dayToMondayBased[b]);

  // Находим понедельник текущей недели
  // getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
  // Convert to Monday-based: Monday=0, ..., Sunday=6
  const startDayOfWeek = startDate.getDay();
  const mondayBasedToday = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() - mondayBasedToday);
  
  // Сохраняем базовую дату понедельника для вычислений
  const weekStartDate = weekStart.getDate();
  const weekStartMonth = weekStart.getMonth();
  const weekStartYear = weekStart.getFullYear();

  // Генерируем расписание на указанный период
  for (let week = 0; week < weeksAhead; week++) {
    for (let dayIndex = 0; dayIndex < sortedDays.length; dayIndex++) {
      const weekDay = sortedDays[dayIndex];
      const mondayBasedTarget = dayToMondayBased[weekDay];
      
      // Вычисляем дату для этого дня недели от базового понедельника
      const date = new Date(weekStartYear, weekStartMonth, weekStartDate + week * 7 + mondayBasedTarget);
      
      // Пропускаем даты, которые раньше startDate
      if (date < startDate) {
        continue;
      }

      // Выбираем сессию циклически
      const sessionIndex = (week * sortedDays.length + dayIndex) % program.sessions.length;
      const session = program.sessions[sessionIndex];

      result.push({ date, session });
    }
  }

  return result.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Рекомендуемое количество тренировок
export function getRecommendedFrequency(experience: ExperienceLevel, goal: TrainingGoal): { min: number; max: number } {
  if (experience === 'beginner') {
    return { min: 2, max: 3 };
  } else if (experience === 'intermediate') {
    if (goal === 'maintenance') return { min: 3, max: 4 };
    return { min: 4, max: 5 };
  } else {
    if (goal === 'maintenance') return { min: 4, max: 5 };
    return { min: 5, max: 6 };
  }
}
