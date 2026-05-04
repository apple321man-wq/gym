import { Exercise, MuscleGroup } from '@/types/training';
import { getNormalizedExerciseById } from '@/data/exercisesExtended';

export const EXERCISES: Exercise[] = [
  // Грудь
  {
    id: 'bench-press',
    name: 'Жим штанги лёжа',
    muscleGroup: 'chest',
    type: 'compound',
    alternatives: ['dumbbell-bench-press', 'incline-bench-press'],
    muscleLoads: [
      { muscleGroup: 'chest', loadType: 'primary' },
      { muscleGroup: 'triceps', loadType: 'secondary' },
      { muscleGroup: 'shoulders', loadType: 'tertiary' },
    ],
  },
  {
    id: 'dumbbell-bench-press',
    name: 'Жим гантелей лёжа',
    muscleGroup: 'chest',
    type: 'compound',
    alternatives: ['bench-press', 'incline-dumbbell-press'],
    muscleLoads: [
      { muscleGroup: 'chest', loadType: 'primary' },
      { muscleGroup: 'triceps', loadType: 'secondary' },
      { muscleGroup: 'shoulders', loadType: 'tertiary' },
    ],
  },
  {
    id: 'incline-bench-press',
    name: 'Жим штанги на наклонной',
    muscleGroup: 'chest',
    type: 'compound',
    alternatives: ['incline-dumbbell-press', 'bench-press'],
    muscleLoads: [
      { muscleGroup: 'chest', loadType: 'primary' },
      { muscleGroup: 'shoulders', loadType: 'secondary' },
      { muscleGroup: 'triceps', loadType: 'tertiary' },
    ],
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Жим гантелей на наклонной',
    muscleGroup: 'chest',
    type: 'compound',
    alternatives: ['incline-bench-press', 'dumbbell-bench-press'],
    muscleLoads: [
      { muscleGroup: 'chest', loadType: 'primary' },
      { muscleGroup: 'shoulders', loadType: 'secondary' },
      { muscleGroup: 'triceps', loadType: 'tertiary' },
    ],
  },
  {
    id: 'cable-crossover',
    name: 'Сведение в кроссовере',
    muscleGroup: 'chest',
    type: 'isolation',
    alternatives: ['dumbbell-fly'],
    muscleLoads: [
      { muscleGroup: 'chest', loadType: 'primary' },
    ],
  },
  {
    id: 'dumbbell-fly',
    name: 'Разведение гантелей',
    muscleGroup: 'chest',
    type: 'isolation',
    alternatives: ['cable-crossover'],
    muscleLoads: [
      { muscleGroup: 'chest', loadType: 'primary' },
    ],
  },

  // Спина
  {
    id: 'pull-ups',
    name: 'Подтягивания',
    muscleGroup: 'back',
    type: 'compound',
    alternatives: ['lat-pulldown', 'weighted-pull-ups'],
    muscleLoads: [
      { muscleGroup: 'back', loadType: 'primary' },
      { muscleGroup: 'biceps', loadType: 'secondary' },
      { muscleGroup: 'core', loadType: 'tertiary' },
    ],
  },
  {
    id: 'weighted-pull-ups',
    name: 'Подтягивания с весом',
    muscleGroup: 'back',
    type: 'compound',
    alternatives: ['pull-ups', 'lat-pulldown'],
    muscleLoads: [
      { muscleGroup: 'back', loadType: 'primary' },
      { muscleGroup: 'biceps', loadType: 'secondary' },
      { muscleGroup: 'core', loadType: 'tertiary' },
    ],
  },
  {
    id: 'assisted-pullup',
    name: 'Подтягивания в гравитроне',
    muscleGroup: 'back',
    type: 'compound',
    alternatives: ['lat-pulldown', 'pull-ups'],
    muscleLoads: [
      { muscleGroup: 'back', loadType: 'primary' },
      { muscleGroup: 'biceps', loadType: 'secondary' },
    ],
  },
  {
    id: 'lat-pulldown',
    name: 'Тяга верхнего блока',
    muscleGroup: 'back',
    type: 'compound',
    alternatives: ['pull-ups'],
    muscleLoads: [
      { muscleGroup: 'back', loadType: 'primary' },
      { muscleGroup: 'biceps', loadType: 'secondary' },
    ],
  },
  {
    id: 'barbell-row',
    name: 'Тяга штанги в наклоне',
    muscleGroup: 'back',
    type: 'compound',
    alternatives: ['dumbbell-row', 'cable-row'],
    muscleLoads: [
      { muscleGroup: 'back', loadType: 'primary' },
      { muscleGroup: 'biceps', loadType: 'secondary' },
      { muscleGroup: 'core', loadType: 'tertiary' },
    ],
  },
  {
    id: 'dumbbell-row',
    name: 'Тяга гантели в наклоне',
    muscleGroup: 'back',
    type: 'compound',
    alternatives: ['barbell-row', 'cable-row'],
    muscleLoads: [
      { muscleGroup: 'back', loadType: 'primary' },
      { muscleGroup: 'biceps', loadType: 'secondary' },
    ],
  },
  {
    id: 'cable-row',
    name: 'Тяга нижнего блока',
    muscleGroup: 'back',
    type: 'compound',
    alternatives: ['barbell-row', 'dumbbell-row'],
    muscleLoads: [
      { muscleGroup: 'back', loadType: 'primary' },
      { muscleGroup: 'biceps', loadType: 'secondary' },
    ],
  },
  {
    id: 'deadlift',
    name: 'Становая тяга',
    muscleGroup: 'back',
    type: 'compound',
    alternatives: ['barbell-row'],
    muscleLoads: [
      { muscleGroup: 'back', loadType: 'primary' },
      { muscleGroup: 'hamstrings', loadType: 'secondary' },
      { muscleGroup: 'glutes', loadType: 'secondary' },
      { muscleGroup: 'quadriceps', loadType: 'tertiary' },
      { muscleGroup: 'core', loadType: 'tertiary' },
    ],
  },

  // Квадрицепс
  {
    id: 'squat',
    name: 'Присед со штангой',
    muscleGroup: 'quadriceps',
    type: 'compound',
    alternatives: ['leg-press', 'front-squat'],
    muscleLoads: [
      { muscleGroup: 'quadriceps', loadType: 'primary' },
      { muscleGroup: 'glutes', loadType: 'secondary' },
      { muscleGroup: 'hamstrings', loadType: 'tertiary' },
      { muscleGroup: 'core', loadType: 'tertiary' },
    ],
  },
  {
    id: 'front-squat',
    name: 'Фронтальный присед',
    muscleGroup: 'quadriceps',
    type: 'compound',
    alternatives: ['squat', 'leg-press'],
    muscleLoads: [
      { muscleGroup: 'quadriceps', loadType: 'primary' },
      { muscleGroup: 'glutes', loadType: 'secondary' },
      { muscleGroup: 'core', loadType: 'secondary' },
    ],
  },
  {
    id: 'leg-press',
    name: 'Жим ногами',
    muscleGroup: 'quadriceps',
    type: 'compound',
    alternatives: ['squat', 'hack-squat'],
    muscleLoads: [
      { muscleGroup: 'quadriceps', loadType: 'primary' },
      { muscleGroup: 'glutes', loadType: 'secondary' },
      { muscleGroup: 'hamstrings', loadType: 'tertiary' },
    ],
  },
  {
    id: 'hack-squat',
    name: 'Гакк-присед',
    muscleGroup: 'quadriceps',
    type: 'compound',
    alternatives: ['squat', 'leg-press'],
    muscleLoads: [
      { muscleGroup: 'quadriceps', loadType: 'primary' },
      { muscleGroup: 'glutes', loadType: 'secondary' },
    ],
  },
  {
    id: 'leg-extension',
    name: 'Разгибание ног',
    muscleGroup: 'quadriceps',
    type: 'isolation',
    muscleLoads: [
      { muscleGroup: 'quadriceps', loadType: 'primary' },
    ],
  },
  {
    id: 'lunges',
    name: 'Выпады',
    muscleGroup: 'quadriceps',
    type: 'compound',
    alternatives: ['bulgarian-split-squat'],
    muscleLoads: [
      { muscleGroup: 'quadriceps', loadType: 'primary' },
      { muscleGroup: 'glutes', loadType: 'secondary' },
      { muscleGroup: 'hamstrings', loadType: 'tertiary' },
    ],
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Болгарские приседания',
    muscleGroup: 'quadriceps',
    type: 'compound',
    alternatives: ['lunges'],
    muscleLoads: [
      { muscleGroup: 'quadriceps', loadType: 'primary' },
      { muscleGroup: 'glutes', loadType: 'secondary' },
      { muscleGroup: 'hamstrings', loadType: 'tertiary' },
    ],
  },

  // Задняя поверхность бедра
  {
    id: 'romanian-deadlift',
    name: 'Румынская тяга',
    muscleGroup: 'hamstrings',
    type: 'compound',
    alternatives: ['stiff-leg-deadlift'],
    muscleLoads: [
      { muscleGroup: 'hamstrings', loadType: 'primary' },
      { muscleGroup: 'glutes', loadType: 'secondary' },
      { muscleGroup: 'back', loadType: 'tertiary' },
    ],
  },
  {
    id: 'stiff-leg-deadlift',
    name: 'Тяга на прямых ногах',
    muscleGroup: 'hamstrings',
    type: 'compound',
    alternatives: ['romanian-deadlift'],
    muscleLoads: [
      { muscleGroup: 'hamstrings', loadType: 'primary' },
      { muscleGroup: 'glutes', loadType: 'secondary' },
      { muscleGroup: 'back', loadType: 'tertiary' },
    ],
  },
  {
    id: 'leg-curl',
    name: 'Сгибание ног',
    muscleGroup: 'hamstrings',
    type: 'isolation',
    muscleLoads: [
      { muscleGroup: 'hamstrings', loadType: 'primary' },
    ],
  },
  {
    id: 'nordic-curl',
    name: 'Нордический сгиб',
    muscleGroup: 'hamstrings',
    type: 'isolation',
    muscleLoads: [
      { muscleGroup: 'hamstrings', loadType: 'primary' },
    ],
  },

  // Ягодицы
  {
    id: 'hip-thrust',
    name: 'Тяга бёдрами',
    muscleGroup: 'glutes',
    type: 'compound',
    alternatives: ['glute-bridge'],
    muscleLoads: [
      { muscleGroup: 'glutes', loadType: 'primary' },
      { muscleGroup: 'hamstrings', loadType: 'secondary' },
    ],
  },
  {
    id: 'glute-bridge',
    name: 'Ягодичный мост',
    muscleGroup: 'glutes',
    type: 'compound',
    alternatives: ['hip-thrust', 'glute-bridge-hold'],
    muscleLoads: [
      { muscleGroup: 'glutes', loadType: 'primary' },
      { muscleGroup: 'hamstrings', loadType: 'secondary' },
    ],
  },
  {
    id: 'glute-bridge-hold',
    name: 'Ягодичный мост (изометрия)',
    muscleGroup: 'glutes',
    type: 'isolation',
    isTimeBased: true,
    alternatives: ['glute-bridge'],
    muscleLoads: [
      { muscleGroup: 'glutes', loadType: 'primary' },
      { muscleGroup: 'hamstrings', loadType: 'secondary' },
    ],
  },
  {
    id: 'cable-kickback',
    name: 'Отведение ноги в кроссовере',
    muscleGroup: 'glutes',
    type: 'isolation',
    muscleLoads: [
      { muscleGroup: 'glutes', loadType: 'primary' },
    ],
  },
  {
    id: 'sumo-squat',
    name: 'Сумо-присед',
    muscleGroup: 'glutes',
    type: 'compound',
    alternatives: ['hip-thrust'],
    muscleLoads: [
      { muscleGroup: 'glutes', loadType: 'primary' },
      { muscleGroup: 'quadriceps', loadType: 'secondary' },
      { muscleGroup: 'hamstrings', loadType: 'tertiary' },
    ],
  },

  // Плечи
  {
    id: 'overhead-press',
    name: 'Жим штанги стоя',
    muscleGroup: 'shoulders',
    type: 'compound',
    alternatives: ['dumbbell-shoulder-press'],
    muscleLoads: [
      { muscleGroup: 'shoulders', loadType: 'primary' },
      { muscleGroup: 'triceps', loadType: 'secondary' },
      { muscleGroup: 'core', loadType: 'tertiary' },
    ],
  },
  {
    id: 'dumbbell-shoulder-press',
    name: 'Жим гантелей сидя',
    muscleGroup: 'shoulders',
    type: 'compound',
    alternatives: ['overhead-press'],
    muscleLoads: [
      { muscleGroup: 'shoulders', loadType: 'primary' },
      { muscleGroup: 'triceps', loadType: 'secondary' },
    ],
  },
  {
    id: 'lateral-raise',
    name: 'Разведение гантелей в стороны',
    muscleGroup: 'shoulders',
    type: 'isolation',
    alternatives: ['cable-lateral-raise'],
    muscleLoads: [
      { muscleGroup: 'shoulders', loadType: 'primary' },
    ],
  },
  {
    id: 'cable-lateral-raise',
    name: 'Отведение в кроссовере',
    muscleGroup: 'shoulders',
    type: 'isolation',
    alternatives: ['lateral-raise'],
    muscleLoads: [
      { muscleGroup: 'shoulders', loadType: 'primary' },
    ],
  },
  {
    id: 'rear-delt-fly',
    name: 'Разведение на заднюю дельту',
    muscleGroup: 'shoulders',
    type: 'isolation',
    muscleLoads: [
      { muscleGroup: 'shoulders', loadType: 'primary' },
    ],
  },
  {
    id: 'face-pull',
    name: 'Тяга к лицу',
    muscleGroup: 'shoulders',
    type: 'isolation',
    muscleLoads: [
      { muscleGroup: 'shoulders', loadType: 'primary' },
      { muscleGroup: 'back', loadType: 'tertiary' },
    ],
  },
  {
    id: 'upright-row',
    name: 'Тяга штанги к подбородку',
    muscleGroup: 'shoulders',
    type: 'compound',
    muscleLoads: [
      { muscleGroup: 'shoulders', loadType: 'primary' },
      { muscleGroup: 'biceps', loadType: 'tertiary' },
    ],
  },

  // Бицепс
  {
    id: 'barbell-curl',
    name: 'Сгибания со штангой',
    muscleGroup: 'biceps',
    type: 'isolation',
    alternatives: ['dumbbell-curl', 'hammer-curl'],
    muscleLoads: [
      { muscleGroup: 'biceps', loadType: 'primary' },
    ],
  },
  {
    id: 'dumbbell-curl',
    name: 'Сгибания с гантелями',
    muscleGroup: 'biceps',
    type: 'isolation',
    alternatives: ['barbell-curl', 'hammer-curl'],
    muscleLoads: [
      { muscleGroup: 'biceps', loadType: 'primary' },
    ],
  },
  {
    id: 'hammer-curl',
    name: 'Молотки',
    muscleGroup: 'biceps',
    type: 'isolation',
    alternatives: ['dumbbell-curl'],
    muscleLoads: [
      { muscleGroup: 'biceps', loadType: 'primary' },
    ],
  },
  {
    id: 'preacher-curl',
    name: 'Сгибания на скамье Скотта',
    muscleGroup: 'biceps',
    type: 'isolation',
    alternatives: ['barbell-curl'],
    muscleLoads: [
      { muscleGroup: 'biceps', loadType: 'primary' },
    ],
  },
  {
    id: 'cable-curl',
    name: 'Сгибания на блоке',
    muscleGroup: 'biceps',
    type: 'isolation',
    muscleLoads: [
      { muscleGroup: 'biceps', loadType: 'primary' },
    ],
  },

  // Трицепс
  {
    id: 'tricep-pushdown',
    name: 'Разгибания на блоке',
    muscleGroup: 'triceps',
    type: 'isolation',
    alternatives: ['overhead-tricep-extension'],
    muscleLoads: [
      { muscleGroup: 'triceps', loadType: 'primary' },
    ],
  },
  {
    id: 'overhead-tricep-extension',
    name: 'Французский жим',
    muscleGroup: 'triceps',
    type: 'isolation',
    alternatives: ['tricep-pushdown', 'skull-crusher'],
    muscleLoads: [
      { muscleGroup: 'triceps', loadType: 'primary' },
    ],
  },
  {
    id: 'skull-crusher',
    name: 'Разгибания лёжа',
    muscleGroup: 'triceps',
    type: 'isolation',
    alternatives: ['overhead-tricep-extension'],
    muscleLoads: [
      { muscleGroup: 'triceps', loadType: 'primary' },
    ],
  },
  {
    id: 'close-grip-bench',
    name: 'Жим узким хватом',
    muscleGroup: 'triceps',
    type: 'compound',
    muscleLoads: [
      { muscleGroup: 'triceps', loadType: 'primary' },
      { muscleGroup: 'chest', loadType: 'secondary' },
      { muscleGroup: 'shoulders', loadType: 'tertiary' },
    ],
  },
  {
    id: 'dips',
    name: 'Отжимания на брусьях',
    muscleGroup: 'triceps',
    type: 'compound',
    muscleLoads: [
      { muscleGroup: 'triceps', loadType: 'primary' },
      { muscleGroup: 'chest', loadType: 'secondary' },
      { muscleGroup: 'shoulders', loadType: 'tertiary' },
    ],
  },
  {
    id: 'assisted-dips',
    name: 'Отжимания на брусьях в гравитроне',
    muscleGroup: 'triceps',
    type: 'compound',
    muscleLoads: [
      { muscleGroup: 'triceps', loadType: 'primary' },
      { muscleGroup: 'chest', loadType: 'secondary' },
      { muscleGroup: 'shoulders', loadType: 'tertiary' },
    ],
  },
  {
    id: 'tricep-kickback',
    name: 'Отведение руки назад',
    muscleGroup: 'triceps',
    type: 'isolation',
    muscleLoads: [
      { muscleGroup: 'triceps', loadType: 'primary' },
    ],
  },

  // Кор
  {
    id: 'plank',
    name: 'Планка',
    muscleGroup: 'core',
    type: 'isolation',
    isTimeBased: true,
    muscleLoads: [
      { muscleGroup: 'core', loadType: 'primary' },
    ],
  },
  {
    id: 'plank-leg-lift',
    name: 'Планка с подъёмом ноги',
    muscleGroup: 'core',
    type: 'isolation',
    isTimeBased: true,
    muscleLoads: [
      { muscleGroup: 'core', loadType: 'primary' },
      { muscleGroup: 'glutes', loadType: 'tertiary' },
    ],
  },
  {
    id: 'hyperextension-hold',
    name: 'Гиперэкстензия (удержание)',
    muscleGroup: 'core',
    type: 'isolation',
    isTimeBased: true,
    muscleLoads: [
      { muscleGroup: 'core', loadType: 'primary' },
      { muscleGroup: 'back', loadType: 'secondary' },
    ],
  },
  {
    id: 'wall-sit',
    name: 'Стена (Wall Sit)',
    muscleGroup: 'quadriceps',
    type: 'isolation',
    isTimeBased: true,
    muscleLoads: [
      { muscleGroup: 'quadriceps', loadType: 'primary' },
      { muscleGroup: 'glutes', loadType: 'secondary' },
    ],
  },
  {
    id: 'v-sit-hold',
    name: 'V-сед (уголок)',
    muscleGroup: 'core',
    type: 'isolation',
    isTimeBased: true,
    muscleLoads: [
      { muscleGroup: 'core', loadType: 'primary' },
    ],
  },
  {
    id: 'fitball-hip-raise',
    name: 'Подъём таза на фитболе',
    muscleGroup: 'glutes',
    type: 'isolation',
    isTimeBased: true,
    muscleLoads: [
      { muscleGroup: 'glutes', loadType: 'primary' },
      { muscleGroup: 'hamstrings', loadType: 'secondary' },
      { muscleGroup: 'core', loadType: 'tertiary' },
    ],
  },
  {
    id: 'hanging-leg-raise',
    name: 'Подъём ног в висе',
    muscleGroup: 'core',
    type: 'isolation',
    allowsExternalWeight: true,
    alternatives: ['lying-leg-raise'],
    muscleLoads: [
      { muscleGroup: 'core', loadType: 'primary' },
    ],
  },
  {
    id: 'lying-leg-raise',
    name: 'Подъём ног лёжа',
    muscleGroup: 'core',
    type: 'isolation',
    allowsExternalWeight: true,
    alternatives: ['hanging-leg-raise'],
    muscleLoads: [
      { muscleGroup: 'core', loadType: 'primary' },
    ],
  },
  {
    id: 'cable-crunch',
    name: 'Скручивания на блоке',
    muscleGroup: 'core',
    type: 'isolation',
    muscleLoads: [
      { muscleGroup: 'core', loadType: 'primary' },
    ],
  },
  {
    id: 'russian-twist',
    name: 'Русские скручивания',
    muscleGroup: 'core',
    type: 'isolation',
    allowsExternalWeight: true,
    muscleLoads: [
      { muscleGroup: 'core', loadType: 'primary' },
    ],
  },
  {
    id: 'ab-wheel',
    name: 'Ролик для пресса',
    muscleGroup: 'core',
    type: 'isolation',
    allowsExternalWeight: true,
    muscleLoads: [
      { muscleGroup: 'core', loadType: 'primary' },
      { muscleGroup: 'shoulders', loadType: 'tertiary' },
    ],
  },
  {
    id: 'pallof-press',
    name: 'Жим Палофа',
    muscleGroup: 'core',
    type: 'isolation',
    allowsExternalWeight: true,
    muscleLoads: [
      { muscleGroup: 'core', loadType: 'primary' },
    ],
  },
];

export const getExercisesByMuscle = (muscleGroup: MuscleGroup): Exercise[] => {
  return EXERCISES.filter(e => e.muscleGroup === muscleGroup);
};

export const getExerciseById = (id: string): Exercise | undefined => {
  const base = EXERCISES.find(e => e.id === id);
  if (base) return base;

  const normalized = getNormalizedExerciseById(id);
  if (normalized) {
    const muscleLoads: Exercise['muscleLoads'] = [
      ...normalized.primaryMuscles.map(m => ({ muscleGroup: m, loadType: 'primary' as const })),
      ...normalized.secondaryMuscles.map(m => ({ muscleGroup: m, loadType: 'secondary' as const })),
    ];
    return {
      id: normalized.id,
      name: normalized.name,
      muscleGroup: normalized.primaryMuscles[0] || 'core',
      type: normalized.category === 'isolation' || normalized.category === 'activation' ? 'isolation' : 'compound',
      muscleLoads,
      isTimeBased: normalized.isTimeBased,
      isBodyweightOnly: normalized.isBodyweightOnly,
      allowsExternalWeight: normalized.allowsExternalWeight,
    };
  }

  return undefined;
};

export const BASE_EXERCISES_FOR_PM = [
  'bench-press',
  'squat',
  'romanian-deadlift',
  'weighted-pull-ups',
];
