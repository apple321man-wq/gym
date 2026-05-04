/**
 * Система альтернатив упражнений с UX-метками и ограничениями
 */

import { ExperienceLevel, TrainingGoal, MuscleGroup } from './training';

// UX-метки для альтернатив
export type AlternativeTag = 'equal' | 'reduced_weight' | 'pump';

export const ALTERNATIVE_TAG_LABELS: Record<AlternativeTag, string> = {
  equal: '✔ Равноценная замена',
  reduced_weight: '⚠ Требует снижения веса',
  pump: '🔥 Больше пампа',
};

export const ALTERNATIVE_TAG_ICONS: Record<AlternativeTag, string> = {
  equal: '✔',
  reduced_weight: '⚠',
  pump: '🔥',
};

export const ALTERNATIVE_TAG_COLORS: Record<AlternativeTag, string> = {
  equal: 'text-green-500',
  reduced_weight: 'text-amber-500',
  pump: 'text-orange-500',
};

export const ALTERNATIVE_TAG_DESCRIPTIONS: Record<AlternativeTag, string> = {
  equal: 'Можно заменить без пересчёта нагрузки. Совпадает паттерн движения и рабочий вес.',
  reduced_weight: 'Рекомендуется снизить рабочий вес на 10–30%. Упражнение нагружает мышцу сильнее за счёт рычага, амплитуды или нестабильности.',
  pump: 'Лучше для пампа и рельефа, не для рекордов. 10–15 повторений, короткий отдых (30–60 сек), работа близко к отказу.',
};

// Интерфейс альтернативы упражнения с меткой
export interface ExerciseAlternative {
  exerciseId: string;
  tag: AlternativeTag;
  comment?: string;
}

// Описание техники выполнения упражнения
export interface ExerciseDescription {
  technique: string[];      // Пошаговая техника
  endPoint: string;         // Конечная точка
  focus: string[];          // На что обратить внимание (ошибки, контроль)
}

// Правила замены для каждого уровня опыта
export interface ReplacementRule {
  allowed: AlternativeTag[];       // Разрешённые метки
  blocked: AlternativeTag[];       // Заблокированные метки
  warningOnly?: boolean;           // Только предупреждение (не блокировка)
}

export const REPLACEMENT_RULES_BY_EXPERIENCE: Record<ExperienceLevel, ReplacementRule> = {
  beginner: {
    allowed: ['equal', 'pump'],
    blocked: ['reduced_weight'],
    warningOnly: false,
  },
  intermediate: {
    allowed: ['equal', 'reduced_weight', 'pump'],
    blocked: [],
    warningOnly: true, // Только предупреждение для ⚠
  },
  advanced: {
    allowed: ['equal', 'reduced_weight', 'pump'],
    blocked: [],
    warningOnly: false,
  },
};

// Лимиты замен по целям тренировки
export interface GoalReplacementLimit {
  pumpMaxPercent: number;  // Максимальный % замен на 🔥
  description: string;
}

export const GOAL_REPLACEMENT_LIMITS: Record<TrainingGoal, GoalReplacementLimit> = {
  muscle_gain: {
    pumpMaxPercent: 30,
    description: '🔥 упражнения не более 30% от общего количества',
  },
  recomposition: {
    pumpMaxPercent: 40,
    description: '✔ + ⚠ приоритет, 🔥 до 40%',
  },
  cutting: {
    pumpMaxPercent: 50,
    description: '🔥 упражнения до 50%',
  },
  maintenance: {
    pumpMaxPercent: 70,
    description: 'Свободный выбор, до 70% замен',
  },
};

// Функция проверки разрешена ли замена
export function isReplacementAllowed(
  tag: AlternativeTag,
  experience: ExperienceLevel,
  goal: TrainingGoal,
  currentPumpCount: number,
  totalExercises: number
): { allowed: boolean; warning?: string } {
  const rules = REPLACEMENT_RULES_BY_EXPERIENCE[experience];
  const limits = GOAL_REPLACEMENT_LIMITS[goal];
  
  // Проверка по уровню опыта
  if (rules.blocked.includes(tag)) {
    return {
      allowed: false,
      warning: `Упражнения с меткой ${ALTERNATIVE_TAG_ICONS[tag]} недоступны для вашего уровня опыта`,
    };
  }
  
  // Проверка лимита 🔥 по целям
  if (tag === 'pump') {
    const currentPumpPercent = totalExercises > 0 ? (currentPumpCount / totalExercises) * 100 : 0;
    if (currentPumpPercent >= limits.pumpMaxPercent) {
      return {
        allowed: false,
        warning: `Достигнут лимит 🔥 упражнений (${limits.pumpMaxPercent}%) для цели "${goal}"`,
      };
    }
  }
  
  // Предупреждение для среднего уровня при ⚠
  if (tag === 'reduced_weight' && rules.warningOnly) {
    return {
      allowed: true,
      warning: 'Рекомендуется снизить рабочий вес на 10–30%',
    };
  }
  
  return { allowed: true };
}

// Расчёт рекомендуемого снижения веса
export function getWeightAdjustment(tag: AlternativeTag, currentWeight: number): number {
  switch (tag) {
    case 'equal':
      return currentWeight; // Без изменений
    case 'reduced_weight':
      return Math.round(currentWeight * 0.8 / 2.5) * 2.5; // -20%, округление до 2.5кг
    case 'pump':
      return Math.round(currentWeight * 0.7 / 2.5) * 2.5; // -30%, округление до 2.5кг
    default:
      return currentWeight;
  }
}
