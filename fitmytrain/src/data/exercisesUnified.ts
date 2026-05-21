import type { MuscleGroup } from '@/types/training';

export interface UnifiedExercise {
  id: string;
  name: {
    ru: string;
    en: string;
  };
  sourceFile: string;
  sourceMuscle: MuscleGroup;
  highLevelGroup: string;
  muscleGroups: MuscleGroup[];
  priorityMuscles: MuscleGroup[];
  appMuscleGroups: MuscleGroup[];
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipmentRaw: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  difficultyScore: number;
  description: string;
  instructions: {
    keyPoints: string[];
    commonMistakes: string[];
  };
  alternatives: Array<{
    id: string;
    priority: number;
  }>;
}

export const UNIFIED_EXERCISES: UnifiedExercise[] = [
  {
    "id": "biceps-barbell-curl",
    "name": {
      "ru": "Подъем штанги на бицепс стоя",
      "en": "Barbell Curl"
    },
    "sourceFile": "Бицепс.json",
    "sourceMuscle": "biceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "biceps",
      "brachialis",
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "forearms",
      "brachialis"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Стоя ровно, ноги на ширине плеч. Возьмитесь за штангу хватом снизу на ширине плеч. Локти прижаты к корпусу и неподвижны на протяжении всего движения. На выдохе согните руки, поднимая штангу к плечам, полностью сокращая бицепс в верхней точке. На вдохе медленно опустите штангу, полностью выпрямляя руки. Не раскачивайте корпусом.",
    "instructions": {
      "keyPoints": [
        "Локти строго прижаты к корпусу и неподвижны",
        "Опускание медленнее подъема",
        "Кисти не сгибаются внутрь"
      ],
      "commonMistakes": [
        "Раскачивание спиной (читинг)",
        "Сгибание кистей внутрь",
        "Неполное выпрямление рук внизу"
      ]
    },
    "alternatives": [
      {
        "id": "biceps-dumbbell-curl",
        "priority": 1
      },
      {
        "id": "biceps-ez-bar-curl",
        "priority": 2
      },
      {
        "id": "biceps-cable-curl",
        "priority": 3
      },
      {
        "id": "biceps-preacher-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "brachialis",
      "forearms"
    ]
  },
  {
    "id": "biceps-ez-bar-curl",
    "name": {
      "ru": "Подъем EZ-штанги на бицепс",
      "en": "EZ Bar Curl"
    },
    "sourceFile": "Бицепс.json",
    "sourceMuscle": "biceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "biceps",
      "brachialis",
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "forearms",
      "brachialis"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Стоя ровно, возьмитесь за EZ-гриф хватом снизу на изгибах. Локти прижаты к корпусу. На выдохе согните руки, поднимая гриф к плечам. В верхней точке пиковое сокращение бицепса. Медленно опустите. Изогнутая форма грифа снижает нагрузку на запястья по сравнению с прямым грифом.",
    "instructions": {
      "keyPoints": [
        "Локти неподвижны и прижаты",
        "Гриф поднимается за счет бицепсов, а не плеч",
        "Опускание под контролем"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Сгибание кистей",
        "Неполная амплитуда",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "biceps-barbell-curl",
        "priority": 1
      },
      {
        "id": "biceps-dumbbell-curl",
        "priority": 2
      },
      {
        "id": "biceps-cable-curl",
        "priority": 3
      },
      {
        "id": "biceps-preacher-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "brachialis",
      "forearms"
    ]
  },
  {
    "id": "biceps-dumbbell-curl",
    "name": {
      "ru": "Подъем гантелей на бицепс стоя",
      "en": "Dumbbell Curl"
    },
    "sourceFile": "Бицепс.json",
    "sourceMuscle": "biceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "biceps",
      "brachialis",
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "forearms",
      "brachialis"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Стоя ровно, гантели в руках хватом снизу. Локти прижаты к корпусу. На выдохе согните обе руки одновременно, поднимая гантели к плечам. В верхней точке разверните мизинцы чуть наружу для дополнительного сокращения. Медленно опустите, полностью выпрямляя руки.",
    "instructions": {
      "keyPoints": [
        "Локти неподвижны и прижаты",
        "Движение только в локтевых суставах",
        "Опускание медленнее подъема"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Сгибание кистей внутрь",
        "Неполное выпрямление рук"
      ]
    },
    "alternatives": [
      {
        "id": "biceps-barbell-curl",
        "priority": 1
      },
      {
        "id": "biceps-ez-bar-curl",
        "priority": 2
      },
      {
        "id": "biceps-cable-curl",
        "priority": 3
      },
      {
        "id": "biceps-hammer-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "brachialis",
      "forearms"
    ]
  },
  {
    "id": "biceps-hammer-curl",
    "name": {
      "ru": "Молотковые сгибания с гантелями",
      "en": "Hammer Curl"
    },
    "sourceFile": "Бицепс.json",
    "sourceMuscle": "biceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "biceps",
      "brachialis",
      "brachioradialis",
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "brachialis",
      "brachioradialis",
      "forearms"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Стоя ровно, гантели в руках нейтральным хватом (ладони смотрят друг на друга). Локти прижаты к корпусу. На выдохе согните руки, поднимая гантели к плечам, сохраняя нейтральный хват на протяжении всего движения. Медленно опустите. Упражнение развивает плечевую мышцу (брахиалис) и предплечья.",
    "instructions": {
      "keyPoints": [
        "Локти неподвижны",
        "Гантели движутся по вертикали, не разворачиваются",
        "Полная амплитуда"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Разворот гантелей (переход в обычный подъем)",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "biceps-dumbbell-curl",
        "priority": 1
      },
      {
        "id": "biceps-cable-hammer-curl",
        "priority": 2
      },
      {
        "id": "biceps-rope-hammer-curl",
        "priority": 3
      },
      {
        "id": "biceps-barbell-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "brachialis",
      "brachioradialis",
      "forearms"
    ]
  },
  {
    "id": "biceps-preacher-curl",
    "name": {
      "ru": "Сгибания рук на скамье Скотта (с EZ-грифом)",
      "en": "Preacher Curl"
    },
    "sourceFile": "Бицепс.json",
    "sourceMuscle": "biceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "biceps",
      "brachialis",
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "brachialis",
      "forearms"
    ],
    "equipmentRaw": [
      "free_weights",
      "machine"
    ],
    "equipment": [
      "barbell",
      "dumbbell",
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Сядьте на скамью Скотта, грудью упритесь в подушку, подмышки на верхнем краю. Возьмитесь за EZ-гриф хватом снизу. Руки полностью выпрямлены. На выдохе согните руки, поднимая гриф к плечам, не отрывая локти от подушки. В верхней точке пиковое сокращение. Медленно опустите до полного выпрямления.",
    "instructions": {
      "keyPoints": [
        "Локти плотно прижаты к подушке и неподвижны",
        "Движение только в локтевых суставах",
        "Не разгибайте руки до конца (сохраняйте напряжение)"
      ],
      "commonMistakes": [
        "Отрыв локтей от подушки",
        "Рывковое движение",
        "Разгибание запястий",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "biceps-barbell-curl",
        "priority": 1
      },
      {
        "id": "biceps-dumbbell-curl",
        "priority": 2
      },
      {
        "id": "biceps-cable-curl",
        "priority": 3
      },
      {
        "id": "biceps-machine-preacher-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "brachialis",
      "forearms"
    ]
  },
  {
    "id": "biceps-concentration-curl",
    "name": {
      "ru": "Концентрированный подъем гантели",
      "en": "Concentration Curl"
    },
    "sourceFile": "Бицепс.json",
    "sourceMuscle": "biceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "biceps",
      "brachialis",
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "brachialis",
      "forearms"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Сядьте на скамью, широко расставив ноги. Наклонитесь, упритесь локтем рабочей руки в бедро изнутри. Вторая рука на колене. Гантель в опущенной руке. На выдохе согните руку, поднимая гантель к плечу, полностью сокращая бицепс. Медленно опустите. Максимальная изоляция бицепса.",
    "instructions": {
      "keyPoints": [
        "Локоть упирается в бедро и неподвижен",
        "Движение только в локтевом суставе",
        "В верхней точке пауза",
        "Опускание медленное"
      ],
      "commonMistakes": [
        "Рывковое движение",
        "Помощь плечом",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "biceps-dumbbell-curl",
        "priority": 1
      },
      {
        "id": "biceps-cable-concentration-curl",
        "priority": 2
      },
      {
        "id": "biceps-preacher-curl",
        "priority": 3
      },
      {
        "id": "biceps-machine-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "brachialis",
      "forearms"
    ]
  },
  {
    "id": "biceps-cable-curl",
    "name": {
      "ru": "Сгибания рук на нижнем блоке",
      "en": "Cable Curl"
    },
    "sourceFile": "Бицепс.json",
    "sourceMuscle": "biceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "biceps",
      "brachialis",
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "brachialis",
      "forearms"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Установите трос на нижний блок, прикрепите прямую или EZ-рукоять. Встаньте лицом к блоку, возьмитесь за рукоять хватом снизу. Сделайте шаг назад, локти прижаты к корпусу. На выдохе согните руки, поднимая рукоять к плечам, локти неподвижны. Медленно вернитесь. Трос создает постоянное напряжение на протяжении всего движения.",
    "instructions": {
      "keyPoints": [
        "Локти прижаты к корпусу и неподвижны",
        "Плечи расслаблены",
        "Опускание под контролем"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Сгибание запястий",
        "Использование плеч"
      ]
    },
    "alternatives": [
      {
        "id": "biceps-barbell-curl",
        "priority": 1
      },
      {
        "id": "biceps-dumbbell-curl",
        "priority": 2
      },
      {
        "id": "biceps-ez-bar-curl",
        "priority": 3
      },
      {
        "id": "biceps-preacher-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "brachialis",
      "forearms"
    ]
  },
  {
    "id": "biceps-cable-hammer-curl",
    "name": {
      "ru": "Молотковые сгибания на блоке",
      "en": "Cable Hammer Curl"
    },
    "sourceFile": "Бицепс.json",
    "sourceMuscle": "biceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "biceps",
      "brachialis",
      "brachioradialis",
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "brachialis",
      "brachioradialis",
      "forearms"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Установите трос на нижний блок, прикрепите канатную рукоять или D-рукояти. Встаньте лицом к блоку, возьмитесь за рукояти нейтральным хватом (ладони смотрят друг на друга). Локти прижаты к корпусу. На выдохе согните руки, поднимая рукояти к плечам, сохраняя нейтральный хват. Медленно опустите.",
    "instructions": {
      "keyPoints": [
        "Локти неподвижны и прижаты",
        "Ладони смотрят друг на друга на протяжении всего движения",
        "Опускание медленнее подъема"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Разворот кистей (переход в обычный подъем)",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "biceps-hammer-curl",
        "priority": 1
      },
      {
        "id": "biceps-dumbbell-curl",
        "priority": 2
      },
      {
        "id": "biceps-cable-curl",
        "priority": 3
      },
      {
        "id": "biceps-barbell-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "brachialis",
      "brachioradialis",
      "forearms"
    ]
  },
  {
    "id": "biceps-machine-curl",
    "name": {
      "ru": "Сгибания рук в тренажере (сидя)",
      "en": "Machine Curl"
    },
    "sourceFile": "Бицепс.json",
    "sourceMuscle": "biceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "biceps",
      "brachialis",
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "brachialis",
      "forearms"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер для сгибания рук, отрегулируйте высоту сиденья так, чтобы локти упирались в подушку. Возьмитесь за рукоятки. Прижмите локти к подушке. На выдохе согните руки, поднимая рукоятки к плечам. В верхней точке пиковое сокращение. Медленно вернитесь до полного выпрямления, но не расслабляйте мышцы.",
    "instructions": {
      "keyPoints": [
        "Локти плотно прижаты к подушке",
        "Спина прижата к спинке",
        "Движение плавное без рывков"
      ],
      "commonMistakes": [
        "Отрыв локтей от подушки",
        "Рывковое движение",
        "Неполная амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "biceps-preacher-curl",
        "priority": 1
      },
      {
        "id": "biceps-barbell-curl",
        "priority": 2
      },
      {
        "id": "biceps-cable-curl",
        "priority": 3
      },
      {
        "id": "biceps-dumbbell-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "brachialis",
      "forearms"
    ]
  },
  {
    "id": "biceps-incline-dumbbell-curl",
    "name": {
      "ru": "Подъем гантелей на бицепс на наклонной скамье",
      "en": "Incline Dumbbell Curl"
    },
    "sourceFile": "Бицепс.json",
    "sourceMuscle": "biceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "biceps",
      "brachialis",
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "biceps"
    ],
    "secondaryMuscles": [
      "brachialis",
      "forearms"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите скамью с наклоном 45-60°. Лягте на спину, руки с гантелями вниз, локти не упираются ни во что. На выдохе согните руки, поднимая гантели к плечам, сохраняя локти неподвижными. Медленно опустите до полного выпрямления. Наклон увеличивает растяжение бицепса в нижней точке.",
    "instructions": {
      "keyPoints": [
        "Локти неподвижны, не движутся вперед",
        "Полная амплитуда: внизу руки выпрямлены",
        "Не используйте инерцию"
      ],
      "commonMistakes": [
        "Движение локтями вперед",
        "Рывковое движение",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "biceps-dumbbell-curl",
        "priority": 1
      },
      {
        "id": "biceps-hammer-curl",
        "priority": 2
      },
      {
        "id": "biceps-cable-curl",
        "priority": 3
      },
      {
        "id": "biceps-preacher-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "brachialis",
      "forearms"
    ]
  },
  {
    "id": "frontdelt-military-press",
    "name": {
      "ru": "Жим штанги стоя (армейский жим)",
      "en": "Military Press"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "core",
      "front_delt",
      "side_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "core",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt",
      "triceps",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте прямо, штанга на плечах хватом чуть шире плеч. Напрягите пресс и ягодицы для стабилизации. На выдохе выжмите штангу строго вверх, голову уберите назад, чтобы гриф прошел мимо лица. В верхней точке локти полностью выпрямлены, гриф над головой. На вдохе медленно опустите штангу под контролем.",
    "instructions": {
      "keyPoints": [
        "Корпус жесткий, без прогиба в пояснице",
        "Гриф движется по вертикальной траектории",
        "Локти не разлетаются в стороны"
      ],
      "commonMistakes": [
        "Прогиб в пояснице (используйте пояс)",
        "Заваливание грифа вперед",
        "Неполное выпрямление рук"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-seated-barbell-press",
        "priority": 1
      },
      {
        "id": "frontdelt-standing-dumbbell-press",
        "priority": 2
      },
      {
        "id": "frontdelt-smith-press",
        "priority": 3
      },
      {
        "id": "frontdelt-arnold-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "front_delt",
      "side_delt",
      "triceps"
    ]
  },
  {
    "id": "frontdelt-seated-barbell-press",
    "name": {
      "ru": "Жим штанги сидя",
      "en": "Seated Barbell Press"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "front_delt",
      "side_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt",
      "triceps"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Сядьте на скамью с вертикальной спинкой. Возьмитесь за штангу чуть шире плеч. Снимите штангу со стоек. На выдохе выжмите штангу вверх над головой, не отрывая спину от спинки. В верхней точке локти выпрямлены. Медленно опустите до уровня подбородка или чуть ниже. Сидячее положение снижает нагрузку на поясницу.",
    "instructions": {
      "keyPoints": [
        "Спина прижата к спинке, поясница не прогибается",
        "Гриф движется строго вверх",
        "Локти слегка согнуты в верхней точке"
      ],
      "commonMistakes": [
        "Отрыв спины от спинки",
        "Заваливание грифа вперед",
        "Слишком глубокое опускание"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-military-press",
        "priority": 1
      },
      {
        "id": "frontdelt-seated-dumbbell-press",
        "priority": 2
      },
      {
        "id": "frontdelt-smith-seated-press",
        "priority": 3
      },
      {
        "id": "frontdelt-machine-shoulder-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "front_delt",
      "side_delt",
      "triceps"
    ]
  },
  {
    "id": "frontdelt-standing-dumbbell-press",
    "name": {
      "ru": "Жим гантелей стоя",
      "en": "Standing Dumbbell Press"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "core",
      "front_delt",
      "side_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "core",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt",
      "triceps",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте прямо, гантели на уровне плеч ладонями вперед. Напрягите пресс. На выдохе выжмите гантели вверх над головой, слегка сводя их в верхней точке, но не ударяя. Медленно опустите под контролем до уровня плеч. Каждая рука работает независимо, что требует больше стабилизации.",
    "instructions": {
      "keyPoints": [
        "Корпус неподвижен, без прогиба",
        "Гантели движутся вертикально",
        "Локти не блокируются жестко вверху"
      ],
      "commonMistakes": [
        "Прогиб в пояснице",
        "Асинхронное движение рук",
        "Использование ног для толчка"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-military-press",
        "priority": 1
      },
      {
        "id": "frontdelt-seated-dumbbell-press",
        "priority": 2
      },
      {
        "id": "frontdelt-arnold-press",
        "priority": 3
      },
      {
        "id": "frontdelt-cable-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "front_delt",
      "side_delt",
      "triceps"
    ]
  },
  {
    "id": "frontdelt-seated-dumbbell-press",
    "name": {
      "ru": "Жим гантелей сидя",
      "en": "Seated Dumbbell Press"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "front_delt",
      "side_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt",
      "triceps"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Сядьте на скамью с вертикальной спинкой. Возьмите гантели, поднимите их на уровень плеч ладонями вперед. Прижмите спину к спинке. На выдохе выжмите гантели вверх над головой, слегка сводя их в верхней точке. На вдохе медленно опустите до уровня плеч. Сидячее положение изолирует передние дельты.",
    "instructions": {
      "keyPoints": [
        "Спина прижата к спинке",
        "Гантели движутся строго вверх",
        "Локти не разлетаются в стороны"
      ],
      "commonMistakes": [
        "Отрыв спины от спинки",
        "Слишком глубокое опускание гантелей",
        "Асинхронное движение"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-seated-barbell-press",
        "priority": 1
      },
      {
        "id": "frontdelt-standing-dumbbell-press",
        "priority": 2
      },
      {
        "id": "frontdelt-machine-shoulder-press",
        "priority": 3
      },
      {
        "id": "frontdelt-smith-seated-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "front_delt",
      "side_delt",
      "triceps"
    ]
  },
  {
    "id": "frontdelt-arnold-press",
    "name": {
      "ru": "Жим Арнольда",
      "en": "Arnold Press"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "front_delt",
      "side_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt",
      "triceps"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Сядьте на скамью или встаньте, гантели на уровне плеч ладонями к себе (как в конце сгибания бицепса). На выдохе начинайте подъем, разворачивая кисти наружу так, чтобы в верхней точке ладони смотрели вперед, а гантели оказались над головой. Медленно опустите, выполняя движение в обратном порядке. Комбинирует жим и ротацию.",
    "instructions": {
      "keyPoints": [
        "Вращение кистей происходит одновременно с подъемом",
        "Движение плавное, без рывков",
        "Локти не блокируются вверху"
      ],
      "commonMistakes": [
        "Резкое вращение",
        "Слишком большой вес (ломается техника)",
        "Неполная ротация кистей"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-seated-dumbbell-press",
        "priority": 1
      },
      {
        "id": "frontdelt-military-press",
        "priority": 2
      },
      {
        "id": "frontdelt-cable-press",
        "priority": 3
      },
      {
        "id": "frontdelt-machine-shoulder-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "front_delt",
      "side_delt",
      "triceps"
    ]
  },
  {
    "id": "frontdelt-front-raises",
    "name": {
      "ru": "Подъем гантелей перед собой",
      "en": "Front Raises"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "front_delt",
      "side_delt"
    ],
    "appMuscleGroups": [
      "shoulders"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте прямо, гантели внизу, ладони к себе или нейтрально. Сохраняя локти слегка согнутыми, поднимите одну гантель вперед до уровня плеч или чуть выше. В верхней точке пауза 1 секунда. Медленно опустите и повторите другой рукой. Изолированное упражнение на переднюю дельту.",
    "instructions": {
      "keyPoints": [
        "Локти слегка согнуты на протяжении всего движения",
        "Не используйте инерцию корпуса",
        "Подъем только за счет дельты"
      ],
      "commonMistakes": [
        "Рывковое движение",
        "Раскачивание корпусом",
        "Слишком большой вес",
        "Сгибание-разгибание локтей"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-cable-front-raise",
        "priority": 1
      },
      {
        "id": "frontdelt-plate-front-raise",
        "priority": 2
      },
      {
        "id": "frontdelt-barbell-front-raise",
        "priority": 3
      },
      {
        "id": "frontdelt-machine-front-raise",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "front_delt",
      "side_delt"
    ]
  },
  {
    "id": "frontdelt-cable-front-raise",
    "name": {
      "ru": "Подъем руки перед собой на блоке",
      "en": "Cable Front Raise"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "front_delt"
    ],
    "appMuscleGroups": [
      "shoulders"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Установите трос на нижний блок, прикрепите D-рукоять. Встаньте спиной к блоку, возьмитесь за рукоять. Сделайте шаг вперед, корпус слегка наклонен. Сохраняя руку прямой или слегка согнутой, поднимите ее вперед до уровня плеч. Медленно опустите. Блок создает постоянное напряжение на протяжении всего движения.",
    "instructions": {
      "keyPoints": [
        "Локоть слегка согнут, не меняет угол",
        "Корпус неподвижен",
        "Подъем только передней дельтой"
      ],
      "commonMistakes": [
        "Использование корпуса для рывка",
        "Слишком большой вес",
        "Сгибание локтя во время подъема"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-front-raises",
        "priority": 1
      },
      {
        "id": "frontdelt-plate-front-raise",
        "priority": 2
      },
      {
        "id": "frontdelt-barbell-front-raise",
        "priority": 3
      },
      {
        "id": "frontdelt-machine-front-raise",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "front_delt"
    ]
  },
  {
    "id": "frontdelt-machine-shoulder-press",
    "name": {
      "ru": "Жим в тренажере для плеч (сидя со стеком)",
      "en": "Seated Shoulder Press Machine"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "front_delt",
      "side_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt",
      "triceps"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер, отрегулируйте высоту сиденья так, чтобы рукоятки были на уровне плеч. Прижмите спину к спинке. На выдохе выжмите рукоятки вверх до полного выпрямления рук. На вдохе медленно верните в исходное. Тренажер задает фиксированную траекторию, что безопасно для новичков. Нагрузка от встроенного стека блинов.",
    "instructions": {
      "keyPoints": [
        "Спина прижата к спинке, без отрыва",
        "Не блокируйте локти жестко вверху",
        "Движение плавное"
      ],
      "commonMistakes": [
        "Отрыв спины от спинки",
        "Рывковое движение",
        "Неполная амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-seated-barbell-press",
        "priority": 1
      },
      {
        "id": "frontdelt-seated-dumbbell-press",
        "priority": 2
      },
      {
        "id": "frontdelt-smith-seated-press",
        "priority": 3
      },
      {
        "id": "frontdelt-cable-seated-shoulder-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "front_delt",
      "side_delt",
      "triceps"
    ]
  },
  {
    "id": "frontdelt-plate-front-raise",
    "name": {
      "ru": "Подъем блина перед собой",
      "en": "Plate Front Raise"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "forearms",
      "front_delt",
      "side_delt"
    ],
    "appMuscleGroups": [
      "biceps",
      "shoulders"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt",
      "forearms"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте прямо, возьмите блин от штанги двумя руками за края. Руки внизу, блин на уровне бедер. Сохраняя локти слегка согнутыми, поднимите блин вперед до уровня плеч. В верхней точке пауза 1 секунда. Медленно опустите под контролем. Блин создает равномерное распределение нагрузки на обе передние дельты.",
    "instructions": {
      "keyPoints": [
        "Локти сохраняют легкий сгиб",
        "Не раскачивайте корпус",
        "Подъем только за счет дельт, без инерции"
      ],
      "commonMistakes": [
        "Рывковое движение",
        "Сгибание рук в локтях во время подъема",
        "Слишком большой вес блина"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-front-raises",
        "priority": 1
      },
      {
        "id": "frontdelt-cable-front-raise",
        "priority": 2
      },
      {
        "id": "frontdelt-barbell-front-raise",
        "priority": 3
      },
      {
        "id": "frontdelt-machine-front-raise",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "forearms",
      "front_delt",
      "side_delt"
    ]
  },
  {
    "id": "frontdelt-plate-overhead-press",
    "name": {
      "ru": "Жим блина над головой стоя",
      "en": "Plate Overhead Press"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "core",
      "front_delt",
      "side_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "core",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt",
      "triceps",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Возьмите блин от штанги двумя руками за края на уровне груди. Руки согнуты, локти смотрят вперед. Встаньте прямо, ноги на ширине плеч. На выдохе выжмите блин строго вверх над головой, полностью выпрямляя руки. В верхней точке блин над макушкой. На вдохе медленно опустите до уровня груди.",
    "instructions": {
      "keyPoints": [
        "Корпус неподвижен, без прогиба",
        "Блин движется строго вертикально",
        "Локти полностью выпрямлены в верхней точке"
      ],
      "commonMistakes": [
        "Прогиб в пояснице",
        "Слишком тяжелый блин (ломается техника)",
        "Неполное выпрямление рук"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-military-press",
        "priority": 1
      },
      {
        "id": "frontdelt-cable-shoulder-press",
        "priority": 2
      },
      {
        "id": "frontdelt-seated-dumbbell-press",
        "priority": 3
      },
      {
        "id": "frontdelt-machine-shoulder-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "front_delt",
      "side_delt",
      "triceps"
    ]
  },
  {
    "id": "frontdelt-cable-shoulder-press",
    "name": {
      "ru": "Жим плечами на нижнем блоке (стоя)",
      "en": "Standing Cable Shoulder Press"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "front_delt",
      "side_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt",
      "triceps"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите тросы на нижние блоки кроссовера или используйте один нижний блок с двумя рукоятями. Встаньте лицом к блоку, возьмитесь за рукояти на уровне плеч ладонями вперед. Сделайте шаг назад, чтобы создать натяжение. На выдохе выжмите рукояти вверх над головой, полностью выпрямляя руки. На вдохе медленно вернитесь до уровня плеч.",
    "instructions": {
      "keyPoints": [
        "Корпус стабилен, без прогиба в пояснице",
        "Рукояти проходят мимо ушей",
        "Локти не блокируются жестко в верхней точке"
      ],
      "commonMistakes": [
        "Использование ног для толчка",
        "Прогиб в пояснице",
        "Неполная амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-military-press",
        "priority": 1
      },
      {
        "id": "frontdelt-seated-dumbbell-press",
        "priority": 2
      },
      {
        "id": "frontdelt-cable-seated-shoulder-press",
        "priority": 3
      },
      {
        "id": "frontdelt-plate-overhead-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "front_delt",
      "side_delt",
      "triceps"
    ]
  },
  {
    "id": "frontdelt-leverage-shoulder-press",
    "name": {
      "ru": "Жим в рычажном тренажере для плеч (с весом от блинов)",
      "en": "Leverage Shoulder Press Machine"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "front_delt",
      "side_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt",
      "triceps"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер с рычажной системой, где нагрузка создается навешиванием блинов на стойки. Отрегулируйте высоту сиденья так, чтобы рукоятки были на уровне плеч. Прижмите спину к спинке. На выдохе выжмите рукоятки вверх по фиксированной траектории до полного выпрямления рук. На вдохе медленно верните в исходное.",
    "instructions": {
      "keyPoints": [
        "Спина плотно прижата к спинке",
        "Движение плавное, без рывков",
        "Локти не выпрямляются до щелчка"
      ],
      "commonMistakes": [
        "Отрыв спины от спинки",
        "Рывковое движение",
        "Слишком большой вес (ломается техника)"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-machine-shoulder-press",
        "priority": 1
      },
      {
        "id": "frontdelt-seated-barbell-press",
        "priority": 2
      },
      {
        "id": "frontdelt-cable-seated-shoulder-press",
        "priority": 3
      },
      {
        "id": "frontdelt-military-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "front_delt",
      "side_delt",
      "triceps"
    ]
  },
  {
    "id": "frontdelt-cable-seated-shoulder-press",
    "name": {
      "ru": "Жим плечами на нижнем блоке (сидя)",
      "en": "Seated Cable Shoulder Press"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "front_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "front_delt",
      "side_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "front_delt"
    ],
    "secondaryMuscles": [
      "side_delt",
      "triceps"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите скамью со спинкой перед нижним блоком. Прикрепите две рукояти к тросу через сплиттер или используйте два нижних блока кроссовера. Сядьте на скамью с вертикальной спинкой, возьмитесь за рукояти на уровне плеч ладонями вперед. Спина прижата к спинке. На выдохе выжмите рукояти вверх над головой, полностью выпрямляя руки. На вдохе медленно вернитесь до уровня плеч.",
    "instructions": {
      "keyPoints": [
        "Спина плотно прижата к спинке",
        "Рукояти движутся строго вверх",
        "Локти не блокируются жестко в верхней точке"
      ],
      "commonMistakes": [
        "Отрыв спины от спинки",
        "Прогиб в пояснице",
        "Неполная амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "frontdelt-cable-shoulder-press",
        "priority": 1
      },
      {
        "id": "frontdelt-seated-dumbbell-press",
        "priority": 2
      },
      {
        "id": "frontdelt-machine-shoulder-press",
        "priority": 3
      },
      {
        "id": "frontdelt-leverage-shoulder-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "front_delt",
      "side_delt",
      "triceps"
    ]
  },
  {
    "id": "sidedelt-lateral-raises",
    "name": {
      "ru": "Махи гантелями в стороны",
      "en": "Lateral Raises"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "side_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "side_delt",
      "traps"
    ],
    "appMuscleGroups": [
      "shoulders"
    ],
    "primaryMuscles": [
      "side_delt"
    ],
    "secondaryMuscles": [
      "traps"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Стоя, легкие гантели в руках. Корпус слегка наклонен вперед, локти чуть согнуты. На выдохе поднимите руки в стороны до уровня плеч или чуть ниже. В верхней точке мизинцы выше больших пальцев. Контролируемо опустите. Изолированное упражнение на среднюю дельту.",
    "instructions": {
      "keyPoints": [
        "Нет инерции, только изолированное движение",
        "Локти не выше кистей",
        "Не поднимайте плечи к ушам"
      ],
      "commonMistakes": [
        "Рывковое движение",
        "Подъем корпуса",
        "Полностью прямые руки"
      ]
    },
    "alternatives": [
      {
        "id": "sidedelt-cable-lateral-raise",
        "priority": 1
      },
      {
        "id": "sidedelt-machine-lateral-raise",
        "priority": 2
      },
      {
        "id": "sidedelt-upright-row",
        "priority": 3
      },
      {
        "id": "sidedelt-dumbbell-lean-away-raise",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "side_delt",
      "traps"
    ]
  },
  {
    "id": "sidedelt-cable-lateral-raise",
    "name": {
      "ru": "Махи в сторону на блоке",
      "en": "Cable Lateral Raise"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "side_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "side_delt",
      "traps"
    ],
    "appMuscleGroups": [
      "shoulders"
    ],
    "primaryMuscles": [
      "side_delt"
    ],
    "secondaryMuscles": [
      "traps"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на нижний блок, прикрепите D-рукоять. Встаньте боком к блоку, дальняя рука держит рукоять. Свободная рука на поясе. Слегка наклоните корпус в сторону блока. Сохраняя локоть слегка согнутым, поднимите руку в сторону до уровня плеч. Медленно опустите. Трос создает постоянное напряжение.",
    "instructions": {
      "keyPoints": [
        "Локоть слегка согнут, фиксирован",
        "Корпус почти неподвижен",
        "Подъем только за счет средней дельты"
      ],
      "commonMistakes": [
        "Использование корпуса для рывка",
        "Слишком большой вес",
        "Сгибание локтя во время подъема"
      ]
    },
    "alternatives": [
      {
        "id": "sidedelt-lateral-raises",
        "priority": 1
      },
      {
        "id": "sidedelt-machine-lateral-raise",
        "priority": 2
      },
      {
        "id": "sidedelt-dumbbell-lean-away-raise",
        "priority": 3
      },
      {
        "id": "sidedelt-upright-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "side_delt",
      "traps"
    ]
  },
  {
    "id": "sidedelt-machine-lateral-raise",
    "name": {
      "ru": "Махи в тренажере (сидя)",
      "en": "Machine Lateral Raise"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "side_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "side_delt"
    ],
    "appMuscleGroups": [
      "shoulders"
    ],
    "primaryMuscles": [
      "side_delt"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер для махов в стороны, отрегулируйте высоту сиденья так, чтобы подушки упирались в предплечья. Прижмите спину к спинке. На выдохе поднимите локти в стороны до уровня плеч, сохраняя руки согнутыми. Медленно опустите под контролем. Тренажер задает правильную траекторию и изолирует среднюю дельту.",
    "instructions": {
      "keyPoints": [
        "Спина прижата к спинке",
        "Локти движутся строго в стороны",
        "Без рывков"
      ],
      "commonMistakes": [
        "Отрыв спины от спинки",
        "Рывковое движение",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "sidedelt-lateral-raises",
        "priority": 1
      },
      {
        "id": "sidedelt-cable-lateral-raise",
        "priority": 2
      },
      {
        "id": "sidedelt-dumbbell-lean-away-raise",
        "priority": 3
      },
      {
        "id": "sidedelt-upright-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "side_delt"
    ]
  },
  {
    "id": "sidedelt-upright-row",
    "name": {
      "ru": "Тяга штанги к подбородку",
      "en": "Upright Row"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "side_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "front_delt",
      "side_delt",
      "traps"
    ],
    "appMuscleGroups": [
      "shoulders"
    ],
    "primaryMuscles": [
      "side_delt"
    ],
    "secondaryMuscles": [
      "traps",
      "front_delt"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Стоя, возьмитесь за штангу хватом сверху на ширине плеч. Штанга внизу на вытянутых руках. На выдохе тяните штангу вверх вдоль корпуса до уровня подбородка или чуть ниже, локти уходят в стороны и вверх. В верхней точке локти выше кистей. Медленно опустите.",
    "instructions": {
      "keyPoints": [
        "Локти ведут движение, а не кисти",
        "Гриф близко к корпусу",
        "Не поднимайте выше подбородка (травма плеча)"
      ],
      "commonMistakes": [
        "Слишком узкий хват (нагрузка на запястья)",
        "Подъем штанги выше подбородка",
        "Рывковое движение"
      ]
    },
    "alternatives": [
      {
        "id": "sidedelt-lateral-raises",
        "priority": 1
      },
      {
        "id": "sidedelt-cable-lateral-raise",
        "priority": 2
      },
      {
        "id": "sidedelt-machine-lateral-raise",
        "priority": 3
      },
      {
        "id": "sidedelt-dumbbell-lean-away-raise",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "front_delt",
      "side_delt",
      "traps"
    ]
  },
  {
    "id": "sidedelt-dumbbell-lean-away-raise",
    "name": {
      "ru": "Махи гантелью в наклоне с опорой",
      "en": "Leaning Away Lateral Raise"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "side_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "side_delt"
    ],
    "appMuscleGroups": [
      "shoulders"
    ],
    "primaryMuscles": [
      "side_delt"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте боком к вертикальной стойке или шведской стенке, возьмитесь за нее свободной рукой. Ноги вместе, корпус наклонен в сторону стойки. Вторая рука с гантелью внизу. На выдохе поднимите гантель в сторону до уровня плеч, локти чуть согнуты. Медленно опустите. Наклон увеличивает амплитуду и изолирует среднюю дельту.",
    "instructions": {
      "keyPoints": [
        "Корпус фиксирован, наклон сохраняется",
        "Локоть слегка согнут",
        "Подъем без инерции"
      ],
      "commonMistakes": [
        "Использование корпуса для рывка",
        "Слишком большой вес",
        "Сгибание локтя во время подъема"
      ]
    },
    "alternatives": [
      {
        "id": "sidedelt-lateral-raises",
        "priority": 1
      },
      {
        "id": "sidedelt-cable-lateral-raise",
        "priority": 2
      },
      {
        "id": "sidedelt-machine-lateral-raise",
        "priority": 3
      },
      {
        "id": "sidedelt-upright-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "side_delt"
    ]
  },
  {
    "id": "sidedelt-cable-lean-away-raise",
    "name": {
      "ru": "Махи в сторону на блоке с наклоном",
      "en": "Cable Lean Away Lateral Raise"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "side_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "side_delt"
    ],
    "appMuscleGroups": [
      "shoulders"
    ],
    "primaryMuscles": [
      "side_delt"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на нижний блок. Встаньте боком к блоку, ближней рукой возьмитесь за стойку для опоры. Дальней рукой возьмитесь за рукоять. Наклоните корпус в сторону блока. На выдохе поднимите руку в сторону до уровня плеч, сохраняя локоть слегка согнутым. Медленно опустите. Постоянное напряжение от троса + увеличенная амплитуда.",
    "instructions": {
      "keyPoints": [
        "Корпус фиксирован, наклон сохраняется",
        "Локоть слегка согнут",
        "Подъем только средней дельтой"
      ],
      "commonMistakes": [
        "Рывковое движение",
        "Слишком большой вес",
        "Сгибание локтя во время подъема"
      ]
    },
    "alternatives": [
      {
        "id": "sidedelt-lateral-raises",
        "priority": 1
      },
      {
        "id": "sidedelt-cable-lateral-raise",
        "priority": 2
      },
      {
        "id": "sidedelt-machine-lateral-raise",
        "priority": 3
      },
      {
        "id": "sidedelt-upright-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "side_delt"
    ]
  },
  {
    "id": "reardelt-rear-fly-dumbbell",
    "name": {
      "ru": "Разводка гантелей в наклоне на заднюю дельту",
      "en": "Bent Over Rear Delt Fly"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "rear_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "rear_delt",
      "traps",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "shoulders"
    ],
    "primaryMuscles": [
      "rear_delt"
    ],
    "secondaryMuscles": [
      "upper_back",
      "traps"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Возьмите легкие гантели. Наклонитесь с прямой спиной до параллели с полом, колени слегка согнуты. Руки внизу, ладони смотрят друг на друга. На выдохе поднимите руки в стороны, сводя лопатки, локти чуть согнуты. В верхней точке руки на уровне плеч или чуть выше. Медленно опустите.",
    "instructions": {
      "keyPoints": [
        "Спина прямая на протяжении всего движения",
        "Локти сохраняют легкий сгиб",
        "Движение начинается с лопаток"
      ],
      "commonMistakes": [
        "Округление спины",
        "Сгибание-разгибание локтей",
        "Рывковое движение"
      ]
    },
    "alternatives": [
      {
        "id": "reardelt-rear-fly-machine",
        "priority": 1
      },
      {
        "id": "reardelt-cable-rear-fly",
        "priority": 2
      },
      {
        "id": "reardelt-face-pull",
        "priority": 3
      },
      {
        "id": "reardelt-reverse-pec-deck",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "rear_delt",
      "traps",
      "upper_back"
    ]
  },
  {
    "id": "reardelt-rear-fly-machine",
    "name": {
      "ru": "Разводка рук в тренажере (обратная бабочка)",
      "en": "Reverse Pec Deck Fly"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "rear_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "rear_delt",
      "traps",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "shoulders"
    ],
    "primaryMuscles": [
      "rear_delt"
    ],
    "secondaryMuscles": [
      "upper_back",
      "traps"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер лицом к спинке, грудью упритесь в подушку. Возьмитесь за рукоятки хватом сверху. Локти на уровне плеч. На выдохе разведите руки в стороны, сводя лопатки. В конечной точке руки почти на одной линии с плечами. Медленно вернитесь.",
    "instructions": {
      "keyPoints": [
        "Грудь прижата к подушке",
        "Локти не поднимаются выше плеч",
        "Движение за счет задних дельт"
      ],
      "commonMistakes": [
        "Отрыв груди от подушки",
        "Рывковое движение",
        "Использование бицепсов"
      ]
    },
    "alternatives": [
      {
        "id": "reardelt-rear-fly-dumbbell",
        "priority": 1
      },
      {
        "id": "reardelt-cable-rear-fly",
        "priority": 2
      },
      {
        "id": "reardelt-face-pull",
        "priority": 3
      },
      {
        "id": "reardelt-seated-cable-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "rear_delt",
      "traps",
      "upper_back"
    ]
  },
  {
    "id": "reardelt-cable-rear-fly",
    "name": {
      "ru": "Разводка рук на блоке (задняя дельта)",
      "en": "Cable Rear Delt Fly"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "rear_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "rear_delt",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "shoulders"
    ],
    "primaryMuscles": [
      "rear_delt"
    ],
    "secondaryMuscles": [
      "upper_back"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите тросы на верхние блоки кроссовера. Встаньте лицом к блоку, возьмитесь за противоположные рукояти (правая рука за левый трос и наоборот). Сделайте шаг назад, слегка наклонитесь. Локти чуть согнуты. На выдохе разведите руки в стороны, сводя лопатки, руки на уровне плеч. Медленно вернитесь.",
    "instructions": {
      "keyPoints": [
        "Спина прямая, корпус почти неподвижен",
        "Локти сохраняют легкий сгиб",
        "Движение начинается с лопаток"
      ],
      "commonMistakes": [
        "Рывковое движение",
        "Слишком большой вес",
        "Сгибание локтей во время движения"
      ]
    },
    "alternatives": [
      {
        "id": "reardelt-rear-fly-dumbbell",
        "priority": 1
      },
      {
        "id": "reardelt-rear-fly-machine",
        "priority": 2
      },
      {
        "id": "reardelt-face-pull",
        "priority": 3
      },
      {
        "id": "reardelt-reverse-pec-deck",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "rear_delt",
      "upper_back"
    ]
  },
  {
    "id": "reardelt-face-pull",
    "name": {
      "ru": "Тяга к лицу",
      "en": "Face Pull"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "rear_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "rear_delt",
      "rotator_cuff",
      "traps",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "shoulders"
    ],
    "primaryMuscles": [
      "rear_delt"
    ],
    "secondaryMuscles": [
      "upper_back",
      "traps",
      "rotator_cuff"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на верхний блок, прикрепите канатную рукоять. Встаньте лицом к блоку, сделайте шаг назад. Возьмитесь за канат хватом ладонями вниз. Тяните рукоять к лицу, разводя кисти в стороны и ротируя плечи наружу. Локти выше уровня плеч. В конце лопатки максимально сведены.",
    "instructions": {
      "keyPoints": [
        "Локти идут в стороны и назад",
        "Движение начинается с лопаток",
        "Кисти в конце над ушами"
      ],
      "commonMistakes": [
        "Тяга только руками",
        "Наклон корпуса вперед",
        "Слишком большой вес",
        "Локти опущены вниз"
      ]
    },
    "alternatives": [
      {
        "id": "reardelt-rear-fly-dumbbell",
        "priority": 1
      },
      {
        "id": "reardelt-rear-fly-machine",
        "priority": 2
      },
      {
        "id": "reardelt-cable-rear-fly",
        "priority": 3
      },
      {
        "id": "reardelt-reverse-pec-deck",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "rear_delt",
      "rotator_cuff",
      "traps",
      "upper_back"
    ]
  },
  {
    "id": "sidedelt-smith-upright-row",
    "name": {
      "ru": "Тяга штанги к подбородку в тренажере Смита",
      "en": "Smith Machine Upright Row"
    },
    "sourceFile": "Дельты.json",
    "sourceMuscle": "side_delt",
    "highLevelGroup": "плечи",
    "priorityMuscles": [
      "front_delt",
      "side_delt",
      "traps"
    ],
    "appMuscleGroups": [
      "shoulders"
    ],
    "primaryMuscles": [
      "side_delt"
    ],
    "secondaryMuscles": [
      "traps",
      "front_delt"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Установите гриф тренажера Смита на уровне бедер. Встаньте лицом к грифу, возьмитесь за него хватом сверху на ширине плеч. Ноги на ширине плеч, спина прямая. На выдохе тяните гриф вверх вдоль корпуса до уровня подбородка или чуть ниже, локти уходят в стороны и вверх. В верхней точке локти выше кистей. На вдохе медленно опустите гриф под контролем. Тренажер Смита фиксирует траекторию, что упрощает технику и снижает нагрузку на поясницу.",
    "instructions": {
      "keyPoints": [
        "Локти ведут движение в стороны и вверх",
        "Гриф скользит близко к корпусу",
        "Не поднимайте выше подбородка (травма плеча)",
        "Спина прямая, корпус неподвижен"
      ],
      "commonMistakes": [
        "Слишком узкий хват (нагрузка на запястья)",
        "Подъем грифа выше подбородка",
        "Рывковое движение",
        "Использование ног для толчка"
      ]
    },
    "alternatives": [
      {
        "id": "sidedelt-upright-row",
        "priority": 1
      },
      {
        "id": "sidedelt-lateral-raises",
        "priority": 2
      },
      {
        "id": "sidedelt-cable-lateral-raise",
        "priority": 3
      },
      {
        "id": "sidedelt-machine-lateral-raise",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "front_delt",
      "side_delt",
      "traps"
    ]
  },
  {
    "id": "calves-standing-raise",
    "name": {
      "ru": "Подъем на носки стоя в тренажере",
      "en": "Standing Calf Raise"
    },
    "sourceFile": "Икры.json",
    "sourceMuscle": "calves",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "calves"
    ],
    "appMuscleGroups": [
      "quadriceps"
    ],
    "primaryMuscles": [
      "calves"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте в тренажер для подъема на носки стоя, плечи под подушками. Стопы на платформе на ширине плеч, пятки свисают. На выдохе мощно поднимитесь на носки, максимально сокращая икры. Задержитесь на секунду в верхней точке. Медленно опуститесь ниже уровня платформы, чувствуя растяжение икр. Упражнение развивает икроножные мышцы.",
    "instructions": {
      "keyPoints": [
        "Полная амплитуда: глубокое растяжение внизу и максимальное сокращение вверху",
        "Движение плавное, без рывков",
        "Колени прямые на протяжении всего движения"
      ],
      "commonMistakes": [
        "Пружинистые движения",
        "Слишком короткая амплитуда",
        "Сгибание коленей"
      ]
    },
    "alternatives": [
      {
        "id": "calves-smith-raise",
        "priority": 1
      },
      {
        "id": "calves-dumbbell-raise",
        "priority": 2
      },
      {
        "id": "calves-leg-press-raise",
        "priority": 3
      },
      {
        "id": "calves-single-leg-raise",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "calves"
    ]
  },
  {
    "id": "calves-seated-raise",
    "name": {
      "ru": "Подъем на носки сидя в тренажере",
      "en": "Seated Calf Raise"
    },
    "sourceFile": "Икры.json",
    "sourceMuscle": "calves",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "calves"
    ],
    "appMuscleGroups": [
      "quadriceps"
    ],
    "primaryMuscles": [
      "calves"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер для подъема на носки сидя, отрегулируйте подушку над коленями. Стопы на подставке, пятки свисают. На выдохе поднимитесь на носки, сокращая икры. Задержитесь на секунду в верхней точке. Медленно опуститесь ниже уровня подставки, чувствуя растяжение. Сидячее положение акцентирует нагрузку на камбаловидную мышцу (глубокий слой икр).",
    "instructions": {
      "keyPoints": [
        "Полная амплитуда",
        "Движение только в голеностопе",
        "Колени зафиксированы подушкой"
      ],
      "commonMistakes": [
        "Пружинистые движения",
        "Отрыв пяток от подставки недостаточный",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "calves-standing-raise",
        "priority": 1
      },
      {
        "id": "calves-leg-press-raise",
        "priority": 2
      },
      {
        "id": "calves-donkey-raise",
        "priority": 3
      },
      {
        "id": "calves-seated-dumbbell",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "calves"
    ]
  },
  {
    "id": "calves-leg-press-raise",
    "name": {
      "ru": "Подъем на носки в тренажере для жима ногами",
      "en": "Leg Press Calf Raise"
    },
    "sourceFile": "Икры.json",
    "sourceMuscle": "calves",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "calves"
    ],
    "appMuscleGroups": [
      "quadriceps"
    ],
    "primaryMuscles": [
      "calves"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер для жима ногами. Поставьте стопы на нижний край платформы на ширине плеч, пятки свисают. Снимите вес, выпрямив ноги, но не блокируя колени. На выдохе поднимитесь на носки, максимально сокращая икры. Задержитесь на секунду. Медленно опуститесь, чувствуя растяжение. Позволяет использовать большие веса.",
    "instructions": {
      "keyPoints": [
        "Колени чуть согнуты, не блокируются",
        "Полная амплитуда",
        "Движение только в голеностопе"
      ],
      "commonMistakes": [
        "Блокировка коленей",
        "Пружинистые движения",
        "Слишком короткая амплитуда",
        "Отрыв стоп от платформы"
      ]
    },
    "alternatives": [
      {
        "id": "calves-standing-raise",
        "priority": 1
      },
      {
        "id": "calves-seated-raise",
        "priority": 2
      },
      {
        "id": "calves-smith-raise",
        "priority": 3
      },
      {
        "id": "calves-dumbbell-raise",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "calves"
    ]
  },
  {
    "id": "calves-smith-raise",
    "name": {
      "ru": "Подъем на носки в тренажере Смита",
      "en": "Smith Machine Calf Raise"
    },
    "sourceFile": "Икры.json",
    "sourceMuscle": "calves",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "calves"
    ],
    "appMuscleGroups": [
      "quadriceps"
    ],
    "primaryMuscles": [
      "calves"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Установите гриф Смита на уровне плеч. Встаньте под гриф, положите его на плечи (как для приседаний). Под пятки подложите блин высотой 5-10 см. Ноги на ширине плеч. Снимите гриф. На выдохе поднимитесь на носки, максимально сокращая икры. Задержитесь на секунду. Медленно опуститесь ниже уровня блина, чувствуя растяжение.",
    "instructions": {
      "keyPoints": [
        "Подставка под пятками обеспечивает глубокое растяжение",
        "Колени прямые",
        "Движение плавное, полная амплитуда"
      ],
      "commonMistakes": [
        "Сгибание коленей",
        "Пружинистые движения",
        "Слишком короткая амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "calves-standing-raise",
        "priority": 1
      },
      {
        "id": "calves-leg-press-raise",
        "priority": 2
      },
      {
        "id": "calves-dumbbell-raise",
        "priority": 3
      },
      {
        "id": "calves-barbell-raise",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "calves"
    ]
  },
  {
    "id": "calves-dumbbell-raise",
    "name": {
      "ru": "Подъем на носки с гантелями (стоя)",
      "en": "Dumbbell Calf Raise"
    },
    "sourceFile": "Икры.json",
    "sourceMuscle": "calves",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "calves"
    ],
    "appMuscleGroups": [
      "quadriceps"
    ],
    "primaryMuscles": [
      "calves"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте прямо, возьмите гантель в одну руку (или по гантели в каждую), вторая рука на поясе или на опоре. Встаньте на возвышение (блин или степ-платформу) пятками вниз. На выдохе поднимитесь на носок, максимально сокращая икру. Задержитесь на секунду. Медленно опуститесь, чувствуя растяжение. Повторите на другую ногу.",
    "instructions": {
      "keyPoints": [
        "Полная амплитуда",
        "Колено прямой",
        "Движение плавное, без рывков"
      ],
      "commonMistakes": [
        "Сгибание колена",
        "Пружинистые движения",
        "Слишком короткая амплитуда",
        "Использование инерции"
      ]
    },
    "alternatives": [
      {
        "id": "calves-standing-raise",
        "priority": 1
      },
      {
        "id": "calves-smith-raise",
        "priority": 2
      },
      {
        "id": "calves-leg-press-raise",
        "priority": 3
      },
      {
        "id": "calves-single-leg-raise",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "calves"
    ]
  },
  {
    "id": "calves-single-leg-raise",
    "name": {
      "ru": "Подъем на носок одной ногой",
      "en": "Single Leg Calf Raise"
    },
    "sourceFile": "Икры.json",
    "sourceMuscle": "calves",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "calves"
    ],
    "appMuscleGroups": [
      "quadriceps"
    ],
    "primaryMuscles": [
      "calves"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "bodyweight",
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "bodyweight",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте на возвышение (блин или степ-платформу) одной ногой, пятка свисает. Вторая нога поднята или упирается в опорную ногу. Для равновесия держитесь за стену. На выдохе поднимитесь на носок, максимально сокращая икру. Задержитесь на секунду. Медленно опуститесь, чувствуя растяжение. Выполните все повторения на одну ногу, затем на другую.",
    "instructions": {
      "keyPoints": [
        "Полная амплитуда",
        "Колено прямой",
        "Движение только в голеностопе"
      ],
      "commonMistakes": [
        "Сгибание колена",
        "Пружинистые движения",
        "Потеря равновесия",
        "Слишком короткая амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "calves-standing-raise",
        "priority": 1
      },
      {
        "id": "calves-dumbbell-raise",
        "priority": 2
      },
      {
        "id": "calves-smith-raise",
        "priority": 3
      },
      {
        "id": "calves-leg-press-raise",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "calves"
    ]
  },
  {
    "id": "quads-barbell-squat",
    "name": {
      "ru": "Приседания со штангой на плечах",
      "en": "Barbell Back Squat"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "core",
      "glutes",
      "hamstrings",
      "quads"
    ],
    "appMuscleGroups": [
      "core",
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes",
      "hamstrings",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Расположите штангу на трапециях, чуть ниже седьмого шейного позвонка. Сделайте шаг назад из стойки. Ноги на ширине плеч, носки чуть развернуты. На вдохе отводите таз назад и сгибайте колени, опускаясь до параллели бедра с полом или ниже. Спина прямая, грудная клетка раскрыта. На выдохе мощно вытолкните таз вверх и вернитесь в исходное положение.",
    "instructions": {
      "keyPoints": [
        "Спина прямая на протяжении всего движения",
        "Колени не выходят за носки и не сводятся внутрь",
        "Взгляд вперед или чуть вверх"
      ],
      "commonMistakes": [
        "Округление спины",
        "Сведение коленей внутрь",
        "Отрыв пяток от пола"
      ]
    },
    "alternatives": [
      {
        "id": "quads-hack-squat",
        "priority": 1
      },
      {
        "id": "quads-leg-press",
        "priority": 2
      },
      {
        "id": "quads-goblet-squat",
        "priority": 3
      },
      {
        "id": "quads-smith-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "hamstrings",
      "quads"
    ]
  },
  {
    "id": "quads-front-squat",
    "name": {
      "ru": "Приседания со штангой на груди (фронтальные)",
      "en": "Front Squat"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "core",
      "glutes",
      "quads"
    ],
    "appMuscleGroups": [
      "core",
      "glutes",
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Расположите штангу на передней части плеч, скрестив руки или держа гриф хватом сверху. Локти высоко, параллельно полу. Снимите штангу. Приседайте, отводя таз назад, сохраняя спину прямой. Опускайтесь до параллели или ниже. Фронтальное положение штанги смещает нагрузку на квадрицепсы и требует меньше наклона корпуса.",
    "instructions": {
      "keyPoints": [
        "Локти высоко на протяжении всего движения",
        "Спина прямая, почти вертикальная",
        "Грудная клетка раскрыта"
      ],
      "commonMistakes": [
        "Опускание локтей вниз",
        "Наклон корпуса вперед",
        "Округление спины"
      ]
    },
    "alternatives": [
      {
        "id": "quads-goblet-squat",
        "priority": 1
      },
      {
        "id": "quads-barbell-squat",
        "priority": 2
      },
      {
        "id": "quads-leg-press",
        "priority": 3
      },
      {
        "id": "quads-smith-front-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "quads"
    ]
  },
  {
    "id": "quads-goblet-squat",
    "name": {
      "ru": "Приседания с гантелью (или гирей) перед собой",
      "en": "Goblet Squat"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "core",
      "glutes",
      "quads"
    ],
    "appMuscleGroups": [
      "core",
      "glutes",
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Возьмите одну гантель или гирю за диск, держите вертикально у груди. Ноги чуть шире плеч, носки развернуты. На вдохе приседайте, отводя таз назад, колени разводите в стороны. Опускайтесь до параллели или ниже. На выдохе мощно выпрямитесь. Упражнение безопасно для новичков и учит правильной технике приседа.",
    "instructions": {
      "keyPoints": [
        "Колени разведены в стороны",
        "Спина прямая",
        "Грудная клетка раскрыта",
        "Пятки прижаты к полу",
        "Вес на пятках"
      ],
      "commonMistakes": [
        "Сведение коленей внутрь",
        "Округление спины",
        "Отрыв пяток"
      ]
    },
    "alternatives": [
      {
        "id": "quads-front-squat",
        "priority": 1
      },
      {
        "id": "quads-barbell-squat",
        "priority": 2
      },
      {
        "id": "quads-leg-press",
        "priority": 3
      },
      {
        "id": "quads-hack-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "quads"
    ]
  },
  {
    "id": "quads-leg-press",
    "name": {
      "ru": "Жим ногами в тренажере",
      "en": "Leg Press"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "quads"
    ],
    "appMuscleGroups": [
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер для жима ногами, ноги на платформе на ширине плеч, носки чуть наружу. Снимите вес. На вдохе опускайте платформу до угла 90° в коленях, спина и таз плотно прижаты к сиденью. На выдохе выжмите платформу вверх, не блокируя колени. Изолирует квадрицепсы при низкой нагрузке на спину.",
    "instructions": {
      "keyPoints": [
        "Поясница прижата к сиденью, не отрывается",
        "Колени не выпрямляются до конца",
        "Пятки не отрываются от платформы"
      ],
      "commonMistakes": [
        "Округление поясницы",
        "Слишком низкое опускание",
        "Сведение коленей внутрь"
      ]
    },
    "alternatives": [
      {
        "id": "quads-barbell-squat",
        "priority": 1
      },
      {
        "id": "quads-hack-squat",
        "priority": 2
      },
      {
        "id": "quads-goblet-squat",
        "priority": 3
      },
      {
        "id": "quads-smith-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "quads"
    ]
  },
  {
    "id": "quads-hack-squat",
    "name": {
      "ru": "Хакк-приседания",
      "en": "Hack Squat"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "quads"
    ],
    "appMuscleGroups": [
      "glutes",
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте в тренажер, плечи под подушки, ноги на платформе на ширине плеч. Снимите вес фиксаторами. На вдохе опускайтесь, сгибая колени, до угла 90° или глубже, спина прижата к спинке. На выдохе мощно выжмите платформу вверх. Тренажер снимает нагрузку с поясницы и изолирует квадрицепсы.",
    "instructions": {
      "keyPoints": [
        "Спина плотно прижата к спинке",
        "Колени не выходят за носки",
        "Пятки не отрываются"
      ],
      "commonMistakes": [
        "Отрыв спины от спинки",
        "Сведение коленей внутрь",
        "Слишком глубокое опускание",
        "Неполное выпрямление"
      ]
    },
    "alternatives": [
      {
        "id": "quads-leg-press",
        "priority": 1
      },
      {
        "id": "quads-barbell-squat",
        "priority": 2
      },
      {
        "id": "quads-smith-squat",
        "priority": 3
      },
      {
        "id": "quads-goblet-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "quads"
    ]
  },
  {
    "id": "quads-smith-squat",
    "name": {
      "ru": "Приседания в тренажере Смита",
      "en": "Smith Machine Squat"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "quads"
    ],
    "appMuscleGroups": [
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Установите гриф на уровне плеч. Встаньте под гриф, расположите его на трапециях. Ноги чуть впереди корпуса для устойчивости. Снимите гриф поворотом. На вдохе приседайте до параллели или ниже, спина прямая. На выдохе выжмите штангу вверх. Фиксированная траектория упрощает технику.",
    "instructions": {
      "keyPoints": [
        "Ноги поставлены чуть впереди корпуса",
        "Спина прямая",
        "Колени не выходят за носки"
      ],
      "commonMistakes": [
        "Ноги под грифом (неустойчиво)",
        "Округление спины",
        "Сведение коленей"
      ]
    },
    "alternatives": [
      {
        "id": "quads-barbell-squat",
        "priority": 1
      },
      {
        "id": "quads-leg-press",
        "priority": 2
      },
      {
        "id": "quads-hack-squat",
        "priority": 3
      },
      {
        "id": "quads-goblet-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "quads"
    ]
  },
  {
    "id": "quads-bulgarian-split-squat",
    "name": {
      "ru": "Болгарские выпады (задняя нога на скамье)",
      "en": "Bulgarian Split Squat"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "core",
      "glutes",
      "hamstrings",
      "quads"
    ],
    "appMuscleGroups": [
      "core",
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes",
      "hamstrings",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте спиной к скамье, носок одной ноги на скамье. Передняя нога на полу. Возьмите гантели в руки. На вдохе опускайтесь, сгибая переднее колено, пока оно не согнется до 90°, заднее колено почти касается пола. На выдохе выпрямитесь. Отличная изоляция квадрицепсов передней ноги.",
    "instructions": {
      "keyPoints": [
        "Спина прямая, корпус вертикален",
        "Колено передней ноги не выходит за носок",
        "Вес на пятке передней ноги"
      ],
      "commonMistakes": [
        "Наклон корпуса вперед",
        "Колено передней ноги заходит за носок",
        "Неустойчивое положение"
      ]
    },
    "alternatives": [
      {
        "id": "quads-lunges",
        "priority": 1
      },
      {
        "id": "quads-goblet-squat",
        "priority": 2
      },
      {
        "id": "quads-leg-press",
        "priority": 3
      },
      {
        "id": "quads-hack-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "hamstrings",
      "quads"
    ]
  },
  {
    "id": "quads-lunges",
    "name": {
      "ru": "Выпады с гантелями (шагающие)",
      "en": "Walking Lunges"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "core",
      "glutes",
      "hamstrings",
      "quads"
    ],
    "appMuscleGroups": [
      "core",
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes",
      "hamstrings",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Возьмите гантели в руки. Сделайте широкий шаг вперед, опуская таз, пока оба колена не согнутся под 90°. Переднее колено над щиколоткой, заднее почти касается пола. Оттолкнитесь передней ногой и сделайте следующий шаг другой ногой. Продолжайте движение по залу. Развивает квадрицепсы и координацию.",
    "instructions": {
      "keyPoints": [
        "Колено передней ноги не выходит за носок",
        "Корпус вертикален",
        "Шаг широкий, устойчивый"
      ],
      "commonMistakes": [
        "Падение корпуса вперед",
        "Короткий шаг (нагрузка на колено)",
        "Сведение коленей внутрь"
      ]
    },
    "alternatives": [
      {
        "id": "quads-bulgarian-split-squat",
        "priority": 1
      },
      {
        "id": "quads-reverse-lunges",
        "priority": 2
      },
      {
        "id": "quads-goblet-squat",
        "priority": 3
      },
      {
        "id": "quads-leg-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "hamstrings",
      "quads"
    ]
  },
  {
    "id": "quads-reverse-lunges",
    "name": {
      "ru": "Обратные выпады с гантелями",
      "en": "Reverse Lunges"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "quads"
    ],
    "appMuscleGroups": [
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Стоя с гантелями, сделайте шаг назад одной ногой, опуская таз, пока переднее колено не согнется до 90°. Заднее колено почти касается пола. Оттолкнитесь задней ногой и вернитесь в исходное. Повторите на другую ногу. Обратные выпады меньше нагружают колени, чем шагающие.",
    "instructions": {
      "keyPoints": [
        "Спина прямая",
        "Колено передней ноги не выходит за носок",
        "Вес на пятке передней ноги"
      ],
      "commonMistakes": [
        "Наклон корпуса вперед",
        "Короткий шаг назад",
        "Сведение коленей"
      ]
    },
    "alternatives": [
      {
        "id": "quads-lunges",
        "priority": 1
      },
      {
        "id": "quads-bulgarian-split-squat",
        "priority": 2
      },
      {
        "id": "quads-goblet-squat",
        "priority": 3
      },
      {
        "id": "quads-leg-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "quads"
    ]
  },
  {
    "id": "quads-leg-extension",
    "name": {
      "ru": "Разгибание ног в тренажере (сидя)",
      "en": "Leg Extension"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "quads"
    ],
    "appMuscleGroups": [
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер для разгибания ног, установите валик над щиколотками. Спина прижата к спинке. На выдохе разогните ноги, поднимая валик вверх, до полного выпрямления коленей. В верхней точке пауза 1-2 секунды, максимально сокращая квадрицепсы. Медленно опустите. Изолированное упражнение на квадрицепсы.",
    "instructions": {
      "keyPoints": [
        "Спина прижата к спинке",
        "Движение только в коленях, без рывков",
        "В верхней точке пауза"
      ],
      "commonMistakes": [
        "Отрыв таза от сиденья",
        "Рывковое движение",
        "Использование корпуса для инерции"
      ]
    },
    "alternatives": [
      {
        "id": "quads-barbell-squat",
        "priority": 1
      },
      {
        "id": "quads-hack-squat",
        "priority": 2
      },
      {
        "id": "quads-leg-press",
        "priority": 3
      },
      {
        "id": "quads-sissy-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "quads"
    ]
  },
  {
    "id": "quads-sissy-squat",
    "name": {
      "ru": "Сисси-приседания (с опорой)",
      "en": "Sissy Squat"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "core",
      "quads"
    ],
    "appMuscleGroups": [
      "core",
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "core"
    ],
    "equipmentRaw": [
      "bodyweight",
      "machine"
    ],
    "equipment": [
      "bodyweight",
      "machine"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Встаньте в тренажер для сисси-приседаний, зафиксировав голени. Или используйте опору. Отклонитесь назад, сохраняя спину прямой, и сгибайте колени, опускаясь как можно ниже, пока квадрицепсы не растянутся максимально. Вернитесь в исходное. Упражнение с очень высокой нагрузкой на квадрицепсы.",
    "instructions": {
      "keyPoints": [
        "Спина прямая, корпус отклонен назад",
        "Движение плавное, без рывков",
        "Колени не выходят за носки"
      ],
      "commonMistakes": [
        "Округление спины",
        "Рывковое движение",
        "Слишком быстрое опускание"
      ]
    },
    "alternatives": [
      {
        "id": "quads-leg-extension",
        "priority": 1
      },
      {
        "id": "quads-hack-squat",
        "priority": 2
      },
      {
        "id": "quads-barbell-squat",
        "priority": 3
      },
      {
        "id": "quads-goblet-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "quads"
    ]
  },
  {
    "id": "quads-box-squat",
    "name": {
      "ru": "Приседания на ящик (со штангой)",
      "en": "Box Squat"
    },
    "sourceFile": "Квадрицепс.json",
    "sourceMuscle": "quads",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "quads"
    ],
    "appMuscleGroups": [
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "quads"
    ],
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите ящик или скамью позади себя на высоту, чуть ниже параллели бедра. Встаньте со штангой на плечах. Приседайте до легкого касания ящика без «плюхания», сохраняя спину прямой. Сделайте паузу и мощно выпрямитесь. Приседания на ящик учат правильной глубине и взрывной силе.",
    "instructions": {
      "keyPoints": [
        "Касание ящика легкое, без расслабления",
        "Спина прямая",
        "Колени не выходят за носки"
      ],
      "commonMistakes": [
        "Плюхание на ящик (расслабление спины)",
        "Округление спины",
        "Слишком низкий ящик"
      ]
    },
    "alternatives": [
      {
        "id": "quads-barbell-squat",
        "priority": 1
      },
      {
        "id": "quads-smith-squat",
        "priority": 2
      },
      {
        "id": "quads-front-squat",
        "priority": 3
      },
      {
        "id": "quads-leg-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "quads"
    ]
  },
  {
    "id": "lowerback-hyperextension",
    "name": {
      "ru": "Гиперэкстензия",
      "en": "Hyperextension"
    },
    "sourceFile": "Поясница.json",
    "sourceMuscle": "lower_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "lower_back"
    ],
    "appMuscleGroups": [
      "back",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "lower_back"
    ],
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Лягте животом на тренажер для гиперэкстензии, пятки зафиксируйте под валиками, бедра на подушке. Скрестите руки на груди или за головой. На выдохе поднимите корпус до прямой линии с ногами, не перегибаясь в пояснице. Задержитесь на секунду, затем медленно опуститесь вниз, чувствуя растяжение поясницы.",
    "instructions": {
      "keyPoints": [
        "Подъем за счет мышц спины и ягодиц, а не рывка",
        "Не переразгибайтесь в пояснице вверх",
        "Шея нейтрально, взгляд в пол"
      ],
      "commonMistakes": [
        "Резкое движение вверх",
        "Прогиб в пояснице в верхней точке",
        "Сгибание шеи назад"
      ]
    },
    "alternatives": [
      {
        "id": "lowerback-reverse-hyperextension",
        "priority": 1
      },
      {
        "id": "lowerback-good-morning",
        "priority": 2
      },
      {
        "id": "lowerback-deadlift",
        "priority": 3
      },
      {
        "id": "lowerback-bird-dog",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "lower_back"
    ]
  },
  {
    "id": "lowerback-reverse-hyperextension",
    "name": {
      "ru": "Обратная гиперэкстензия",
      "en": "Reverse Hyperextension"
    },
    "sourceFile": "Поясница.json",
    "sourceMuscle": "lower_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "lower_back"
    ],
    "appMuscleGroups": [
      "back",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "lower_back"
    ],
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте животом на скамью тренажера для обратной гиперэкстензии, верхняя часть тела прижата, ноги свисают. Зафиксируйте стопы или оставьте их свободными. На выдохе поднимите ноги вверх за счет поясницы и ягодиц, сохраняя их прямыми. В верхней точке корпус и ноги образуют прямую линию. Медленно опустите ноги вниз.",
    "instructions": {
      "keyPoints": [
        "Подъем ног за счет поясницы, а не сгибания в тазу",
        "Ноги прямые или слегка согнуты",
        "Не используйте инерцию"
      ],
      "commonMistakes": [
        "Сгибание ног в коленях",
        "Рывковое движение",
        "Подъем слишком высоко (перегрузка поясницы)"
      ]
    },
    "alternatives": [
      {
        "id": "lowerback-hyperextension",
        "priority": 1
      },
      {
        "id": "lowerback-good-morning",
        "priority": 2
      },
      {
        "id": "lowerback-deadlift",
        "priority": 3
      },
      {
        "id": "lowerback-bird-dog",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "lower_back"
    ]
  },
  {
    "id": "lowerback-good-morning",
    "name": {
      "ru": "Наклоны со штангой (гуд монинг)",
      "en": "Good Morning"
    },
    "sourceFile": "Поясница.json",
    "sourceMuscle": "lower_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "lower_back"
    ],
    "appMuscleGroups": [
      "back",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "lower_back"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "glutes"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Встаньте прямо, штанга на плечах (как для приседаний), ноги на ширине плеч. Колени слегка согнуты. На вдохе наклонитесь вперед, отводя таз назад, сохраняя спину прямой. Наклоняйтесь до параллели с полом или чуть ниже. На выдохе вернитесь в исходное за счет поясницы и ягодиц. Движение напоминает утреннее потягивание.",
    "instructions": {
      "keyPoints": [
        "Спина абсолютно прямая на протяжении всего движения",
        "Наклон происходит в тазобедренном суставе, а не в пояснице",
        "Штанга надежно зафиксирована"
      ],
      "commonMistakes": [
        "Округление спины (очень травмоопасно)",
        "Слишком глубокий наклон",
        "Сгибание коленей слишком сильно"
      ]
    },
    "alternatives": [
      {
        "id": "lowerback-romanian-deadlift",
        "priority": 1
      },
      {
        "id": "lowerback-hyperextension",
        "priority": 2
      },
      {
        "id": "lowerback-deadlift",
        "priority": 3
      },
      {
        "id": "lowerback-reverse-hyperextension",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "lower_back"
    ]
  },
  {
    "id": "lowerback-romanian-deadlift",
    "name": {
      "ru": "Румынская тяга (акцент на поясницу)",
      "en": "Romanian Deadlift"
    },
    "sourceFile": "Поясница.json",
    "sourceMuscle": "lower_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "lower_back"
    ],
    "appMuscleGroups": [
      "back",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "lower_back"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "glutes"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Стоя, штанга перед бедрами. Слегка согните колени. Сохраняя прямую спину, отводите таз назад и опускайте штангу по ногам до середины голени. Поясница работает стабилизатором, но также получает нагрузку. Чувствуйте растяжение задней поверхности бедра и напряжение в пояснице. Вернитесь, выпрямив таз.",
    "instructions": {
      "keyPoints": [
        "Спина прямая на протяжении всего движения",
        "Колени почти не сгибаются",
        "Гриф скользит по ногам"
      ],
      "commonMistakes": [
        "Округление спины",
        "Слишком глубокий наклон с округлением",
        "Сгибание коленей слишком сильно"
      ]
    },
    "alternatives": [
      {
        "id": "lowerback-good-morning",
        "priority": 1
      },
      {
        "id": "lowerback-deadlift",
        "priority": 2
      },
      {
        "id": "lowerback-hyperextension",
        "priority": 3
      },
      {
        "id": "lowerback-reverse-hyperextension",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "lower_back"
    ]
  },
  {
    "id": "lowerback-deadlift",
    "name": {
      "ru": "Становая тяга (классическая)",
      "en": "Conventional Deadlift"
    },
    "sourceFile": "Поясница.json",
    "sourceMuscle": "lower_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "forearms",
      "glutes",
      "hamstrings",
      "lower_back",
      "traps"
    ],
    "appMuscleGroups": [
      "back",
      "biceps",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "lower_back"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "glutes",
      "traps",
      "forearms"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Встаньте носками под грифом, голени почти касаются грифа. Наклонитесь, сохраняя прямую спину, возьмитесь за штангу разнохватом или хватом сверху. Напрягите широчайшие. На выдохе отрывайте штангу от пола, одновременно выпрямляя колени и таз. В верхней точке полностью выпрямитесь, затем опустите штангу под контролем. Поясница работает экстензором.",
    "instructions": {
      "keyPoints": [
        "Спина абсолютно прямая на протяжении всего движения",
        "Гриф скользит по голеням и бедрам",
        "Пресс напряжен для стабилизации"
      ],
      "commonMistakes": [
        "Круглая спина (основная причина травм)",
        "Рывковое движение",
        "Сгибание рук в локтях"
      ]
    },
    "alternatives": [
      {
        "id": "lowerback-romanian-deadlift",
        "priority": 1
      },
      {
        "id": "lowerback-good-morning",
        "priority": 2
      },
      {
        "id": "lowerback-hyperextension",
        "priority": 3
      },
      {
        "id": "lowerback-trap-bar-deadlift",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "forearms",
      "glutes",
      "hamstrings",
      "lower_back",
      "traps"
    ]
  },
  {
    "id": "lowerback-trap-bar-deadlift",
    "name": {
      "ru": "Становая тяга в трап-грифе",
      "en": "Trap Bar Deadlift"
    },
    "sourceFile": "Поясница.json",
    "sourceMuscle": "lower_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "lower_back",
      "quads",
      "traps"
    ],
    "appMuscleGroups": [
      "back",
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "lower_back"
    ],
    "secondaryMuscles": [
      "quads",
      "glutes",
      "hamstrings",
      "traps"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте внутрь трап-грифа, ноги на ширине плеч. Возьмитесь за рукоятки по бокам. Присядьте, сохраняя спину прямой. На выдохе мощно выпрямитесь, поднимая гриф. В верхней точке полное выпрямление. Опустите под контролем. Трап-гриф создает более нейтральное положение для поясницы по сравнению с классической тягой.",
    "instructions": {
      "keyPoints": [
        "Спина прямая, не округляйте",
        "Гриф движется вертикально",
        "Пресс напряжен"
      ],
      "commonMistakes": [
        "Округление спины",
        "Рывковое движение",
        "Сгибание рук в локтях"
      ]
    },
    "alternatives": [
      {
        "id": "lowerback-deadlift",
        "priority": 1
      },
      {
        "id": "lowerback-romanian-deadlift",
        "priority": 2
      },
      {
        "id": "lowerback-good-morning",
        "priority": 3
      },
      {
        "id": "lowerback-hyperextension",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "lower_back",
      "quads",
      "traps"
    ]
  },
  {
    "id": "lowerback-bird-dog",
    "name": {
      "ru": "Птица-собака (берд-дог)",
      "en": "Bird Dog"
    },
    "sourceFile": "Поясница.json",
    "sourceMuscle": "lower_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "core",
      "glutes",
      "lower_back"
    ],
    "appMuscleGroups": [
      "back",
      "core",
      "glutes"
    ],
    "primaryMuscles": [
      "lower_back"
    ],
    "secondaryMuscles": [
      "core",
      "glutes"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте на четвереньки, руки под плечами, колени под тазом, спина нейтральна. На выдохе одновременно вытяните правую руку вперед и левую ногу назад, сохраняя спину прямой и таз неподвижным. Задержитесь на 2-3 секунды. Медленно вернитесь. Повторите на другую сторону. Упражнение на стабилизацию поясницы.",
    "instructions": {
      "keyPoints": [
        "Спина прямая, не прогибайтесь и не округляйте",
        "Таз неподвижен, не поворачивается",
        "Движение медленное и контролируемое",
        "Пресс напряжен"
      ],
      "commonMistakes": [
        "Прогиб в пояснице",
        "Поворот таза",
        "Слишком быстрое движение"
      ]
    },
    "alternatives": [
      {
        "id": "lowerback-hyperextension",
        "priority": 1
      },
      {
        "id": "core-dead-bug",
        "priority": 2
      },
      {
        "id": "lowerback-reverse-hyperextension",
        "priority": 3
      },
      {
        "id": "lowerback-plank",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "lower_back"
    ]
  },
  {
    "id": "lowerback-superman",
    "name": {
      "ru": "Супермен",
      "en": "Superman"
    },
    "sourceFile": "Поясница.json",
    "sourceMuscle": "lower_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "lower_back"
    ],
    "appMuscleGroups": [
      "back",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "lower_back"
    ],
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Лягте на пол животом, руки вытянуты вперед, ноги прямые. На выдохе одновременно поднимите руки, грудь и ноги от пола, напрягая поясницу и ягодицы. Задержитесь в верхней точке на 1-2 секунды, чувствуя сокращение мышц спины. Медленно опуститесь в исходное положение. Упражнение безопасно для новичков.",
    "instructions": {
      "keyPoints": [
        "Подъем за счет поясницы, а не рывка",
        "Шея нейтральна, взгляд в пол",
        "Движение плавное, без инерции"
      ],
      "commonMistakes": [
        "Рывковое движение",
        "Запрокидывание головы назад",
        "Сгибание ног в коленях"
      ]
    },
    "alternatives": [
      {
        "id": "lowerback-hyperextension",
        "priority": 1
      },
      {
        "id": "lowerback-bird-dog",
        "priority": 2
      },
      {
        "id": "lowerback-reverse-hyperextension",
        "priority": 3
      },
      {
        "id": "lowerback-good-morning",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "lower_back"
    ]
  },
  {
    "id": "abs-crunches",
    "name": {
      "ru": "Скручивания лежа на спине",
      "en": "Crunches"
    },
    "sourceFile": "Прямые пресса.json",
    "sourceMuscle": "abs_rectus",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_rectus"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_rectus"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Лягте на спину, ноги согнуты, стопы на полу. Руки за головой или скрещены на груди. На выдохе поднимите лопатки от пола, скручивая верхнюю часть корпуса к тазу. Поясница остается прижатой к полу. В верхней точке задержитесь на секунду, максимально сокращая прямую мышцу живота. Медленно опуститесь, но не расслабляйте мышцы полностью. Классическое базовое упражнение на пресс.",
    "instructions": {
      "keyPoints": [
        "Нижняя часть спины прижата к полу",
        "Не тяните голову руками",
        "Выдох на усилии"
      ],
      "commonMistakes": [
        "Рывки шеей",
        "Отрыв поясницы от пола",
        "Задержка дыхания",
        "Слишком быстрый темп"
      ]
    },
    "alternatives": [
      {
        "id": "abs-cable-crunch",
        "priority": 1
      },
      {
        "id": "abs-reverse-crunch",
        "priority": 2
      },
      {
        "id": "abs-leg-raises",
        "priority": 3
      },
      {
        "id": "abs-ab-wheel",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_rectus"
    ]
  },
  {
    "id": "abs-reverse-crunch",
    "name": {
      "ru": "Обратные скручивания",
      "en": "Reverse Crunch"
    },
    "sourceFile": "Прямые пресса.json",
    "sourceMuscle": "abs_rectus",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_rectus",
      "hip_flexors"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_rectus"
    ],
    "secondaryMuscles": [
      "hip_flexors"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте на спину, ноги согнуты в коленях под 90°, бедра перпендикулярны полу. Руки вдоль тела ладонями вниз. На выдохе подтяните колени к груди, отрывая таз от пола, скручивая нижнюю часть пресса. В верхней точке задержитесь на секунду. Медленно опустите ноги, не касаясь пятками пола. Упражнение акцентирует нижнюю часть прямой мышцы живота.",
    "instructions": {
      "keyPoints": [
        "Движение начинается с таза, а не с ног",
        "Поясница прижата к полу в исходном положении",
        "Медленное опускание"
      ],
      "commonMistakes": [
        "Использование ног для инерции",
        "Отрыв поясницы слишком высоко",
        "Слишком быстрое движение"
      ]
    },
    "alternatives": [
      {
        "id": "abs-leg-raises",
        "priority": 1
      },
      {
        "id": "abs-hanging-leg-raises",
        "priority": 2
      },
      {
        "id": "abs-crunches",
        "priority": 3
      },
      {
        "id": "abs-cable-crunch",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_rectus",
      "hip_flexors"
    ]
  },
  {
    "id": "abs-leg-raises",
    "name": {
      "ru": "Подъем ног лежа на спине",
      "en": "Leg Raises"
    },
    "sourceFile": "Прямые пресса.json",
    "sourceMuscle": "abs_rectus",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_rectus",
      "hip_flexors"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_rectus"
    ],
    "secondaryMuscles": [
      "hip_flexors"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте на спину, руки вдоль тела или под ягодицами (для уменьшения нагрузки на поясницу). Ноги прямые. На выдохе поднимите прямые ноги вверх до угла 45-90°, отрывая таз от пола. Медленно опустите ноги, не касаясь пятками пола. Держите поясницу прижатой к полу. Упражнение на нижнюю часть пресса.",
    "instructions": {
      "keyPoints": [
        "Поясница прижата к полу",
        "Ноги прямые, носки на себя",
        "Опускание медленное, под контролем"
      ],
      "commonMistakes": [
        "Прогиб в пояснице",
        "Сгибание ног в коленях",
        "Использование рук для рывка",
        "Слишком быстрое опускание"
      ]
    },
    "alternatives": [
      {
        "id": "abs-hanging-leg-raises",
        "priority": 1
      },
      {
        "id": "abs-reverse-crunch",
        "priority": 2
      },
      {
        "id": "abs-scissors",
        "priority": 3
      },
      {
        "id": "abs-v-ups",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_rectus",
      "hip_flexors"
    ]
  },
  {
    "id": "abs-hanging-leg-raises",
    "name": {
      "ru": "Подъем ног в висе на перекладине",
      "en": "Hanging Leg Raises"
    },
    "sourceFile": "Прямые пресса.json",
    "sourceMuscle": "abs_rectus",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_rectus",
      "grip",
      "hip_flexors"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_rectus"
    ],
    "secondaryMuscles": [
      "hip_flexors",
      "grip"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Повисните на перекладине хватом сверху на ширине плеч. Тело прямое, ноги вместе. На выдохе поднимите прямые ноги вверх до параллели с полом или выше (до угла 90°). В верхней точке задержитесь на секунду, максимально сокращая пресс. Медленно опустите ноги в исходное положение, не раскачиваясь. Для усложнения — подъем ног до перекладины (угол 180°).",
    "instructions": {
      "keyPoints": [
        "Не раскачивайтесь, корпус прямой",
        "Подъем за счет пресса, а не ног",
        "Опускание медленное, под контролем"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Сгибание ног в коленях",
        "Использование инерции",
        "Неполная амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "abs-leg-raises",
        "priority": 1
      },
      {
        "id": "abs-hanging-knee-raises",
        "priority": 2
      },
      {
        "id": "abs-toes-to-bar",
        "priority": 3
      },
      {
        "id": "abs-reverse-crunch",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_rectus",
      "grip",
      "hip_flexors"
    ]
  },
  {
    "id": "abs-hanging-knee-raises",
    "name": {
      "ru": "Подъем коленей в висе",
      "en": "Hanging Knee Raises"
    },
    "sourceFile": "Прямые пресса.json",
    "sourceMuscle": "abs_rectus",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_rectus",
      "hip_flexors"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_rectus"
    ],
    "secondaryMuscles": [
      "hip_flexors"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Повисните на перекладине. На выдохе подтяните согнутые колени к груди, скручивая таз вверх. В верхней точке задержитесь на секунду. Медленно опустите ноги. Облегченная версия подъема прямых ног, подходит для начинающих в висах. Постепенно переходите к прямым ногам.",
    "instructions": {
      "keyPoints": [
        "Не раскачивайтесь",
        "Подъем за счет пресса, а не ног",
        "Колени поднимаются выше уровня таза"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Использование ног для инерции",
        "Неполная амплитуда",
        "Слишком быстрое движение"
      ]
    },
    "alternatives": [
      {
        "id": "abs-hanging-leg-raises",
        "priority": 1
      },
      {
        "id": "abs-leg-raises",
        "priority": 2
      },
      {
        "id": "abs-captains-chair",
        "priority": 3
      },
      {
        "id": "abs-reverse-crunch",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_rectus",
      "hip_flexors"
    ]
  },
  {
    "id": "abs-cable-crunch",
    "name": {
      "ru": "Скручивания на верхнем блоке",
      "en": "Cable Crunch"
    },
    "sourceFile": "Прямые пресса.json",
    "sourceMuscle": "abs_rectus",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_rectus"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_rectus"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на верхний блок, прикрепите канатную рукоять. Встаньте на колени лицом к блоку, возьмитесь за канат у головы. Сделайте наклон вперед, чтобы создать натяжение. На выдохе скручивайтесь вниз, приближая локти к бедрам, и максимально сокращайте пресс. Медленно вернитесь в исходное, чувствуя растяжение. Позволяет прогрессивно увеличивать вес.",
    "instructions": {
      "keyPoints": [
        "Скручивание только за счет пресса, без движения тазом",
        "Движение плавное, без рывков",
        "Полная амплитуда",
        "Выдох на усилии"
      ],
      "commonMistakes": [
        "Использование спины и плеч",
        "Слишком большой вес (ломается техника)",
        "Рывковое движение"
      ]
    },
    "alternatives": [
      {
        "id": "abs-crunches",
        "priority": 1
      },
      {
        "id": "abs-reverse-crunch",
        "priority": 2
      },
      {
        "id": "abs-ab-wheel",
        "priority": 3
      },
      {
        "id": "abs-plank",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_rectus"
    ]
  },
  {
    "id": "abs-ab-wheel",
    "name": {
      "ru": "Перекаты на колесе для пресса",
      "en": "Ab Wheel Rollout"
    },
    "sourceFile": "Прямые пресса.json",
    "sourceMuscle": "abs_rectus",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_rectus",
      "core",
      "shoulders"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_rectus"
    ],
    "secondaryMuscles": [
      "core",
      "shoulders"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Встаньте на колени, возьмитесь за рукоятки колеса. На выдохе медленно выкатывайте колесо вперед, выпрямляя руки, сохраняя спину прямой и пресс напряженным. Опускайтесь, пока корпус почти не коснется пола. Медленно вернитесь в исходное, сокращая пресс. Очень эффективное упражнение для всей брюшной стенки.",
    "instructions": {
      "keyPoints": [
        "Спина прямая, не прогибайтесь в пояснице",
        "Движение плавное, без рывков",
        "Начинайте с небольшой амплитуды"
      ],
      "commonMistakes": [
        "Прогиб в пояснице",
        "Округление спины",
        "Слишком быстрое движение",
        "Разгибание локтей не полностью"
      ]
    },
    "alternatives": [
      {
        "id": "abs-cable-rollout",
        "priority": 1
      },
      {
        "id": "abs-plank",
        "priority": 2
      },
      {
        "id": "abs-crunches",
        "priority": 3
      },
      {
        "id": "abs-push-up-plank",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_rectus",
      "core",
      "shoulders"
    ]
  },
  {
    "id": "abs-plank",
    "name": {
      "ru": "Планка на прямых руках и на локтях",
      "en": "Plank"
    },
    "sourceFile": "Прямые пресса.json",
    "sourceMuscle": "abs_rectus",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_rectus",
      "core",
      "glutes",
      "shoulders"
    ],
    "appMuscleGroups": [
      "core",
      "glutes"
    ],
    "primaryMuscles": [
      "abs_rectus"
    ],
    "secondaryMuscles": [
      "core",
      "shoulders",
      "glutes"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Примите упор лежа на предплечьях (локти под плечами) или на прямых руках. Тело образует прямую линию от пяток до макушки. Напрягите пресс, ягодицы и бедра. Удерживайте положение максимальное время, сохраняя стабильность. Не прогибайтесь в пояснице и не поднимайте таз вверх. Базовое статическое упражнение на силу кора.",
    "instructions": {
      "keyPoints": [
        "Тело прямая линия, без прогибов",
        "Пресс и ягодицы напряжены постоянно",
        "Дыхание ровное"
      ],
      "commonMistakes": [
        "Прогиб в пояснице",
        "Подъем таза вверх",
        "Опускание головы вниз",
        "Задержка дыхания"
      ]
    },
    "alternatives": [
      {
        "id": "abs-side-plank",
        "priority": 1
      },
      {
        "id": "abs-ab-wheel",
        "priority": 2
      },
      {
        "id": "abs-cable-crunch",
        "priority": 3
      },
      {
        "id": "abs-crunches",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_rectus",
      "core",
      "glutes",
      "shoulders"
    ]
  },
  {
    "id": "abs-v-ups",
    "name": {
      "ru": "Подъем корпуса и ног одновременно (V-складка)",
      "en": "V-Ups"
    },
    "sourceFile": "Прямые пресса.json",
    "sourceMuscle": "abs_rectus",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_rectus",
      "hip_flexors"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_rectus"
    ],
    "secondaryMuscles": [
      "hip_flexors"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Лягте на спину, руки за головой, ноги прямые. На выдохе одновременно поднимите корпус и прямые ноги, стараясь коснуться руками стоп. В верхней точке тело образует букву V. Задержитесь на секунду, максимально сокращая пресс. Медленно опуститесь в исходное положение. Комплексное упражнение на всю прямую мышцу живота.",
    "instructions": {
      "keyPoints": [
        "Движение синхронное корпуса и ног",
        "Спина прямая в верхней точке",
        "Опускание медленное"
      ],
      "commonMistakes": [
        "Сгибание ног в коленях",
        "Рывковое движение",
        "Неполная амплитуда",
        "Удар пятками об пол"
      ]
    },
    "alternatives": [
      {
        "id": "abs-leg-raises",
        "priority": 1
      },
      {
        "id": "abs-hanging-leg-raises",
        "priority": 2
      },
      {
        "id": "abs-crunches",
        "priority": 3
      },
      {
        "id": "abs-toes-to-bar",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_rectus",
      "hip_flexors"
    ]
  },
  {
    "id": "abs-captains-chair",
    "name": {
      "ru": "Подъем ног в тренажере Captain‘s Chair",
      "en": "Captain‘s Chair Leg Raise"
    },
    "sourceFile": "Прямые пресса.json",
    "sourceMuscle": "abs_rectus",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_rectus",
      "hip_flexors"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_rectus"
    ],
    "secondaryMuscles": [
      "hip_flexors"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте в тренажер, предплечья на подушках, спина прижата к спинке. Повисните, выпрямив ноги. На выдохе поднимите прямые ноги вверх до параллели с полом или выше, удерживая корпус неподвижным. В верхней точке задержитесь на секунду. Медленно опустите ноги. Тренажер снимает нагрузку с поясницы и изолирует пресс.",
    "instructions": {
      "keyPoints": [
        "Спина прижата к спинке, не отрывается",
        "Движение только ногами, корпус неподвижен",
        "Опускание медленное"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Сгибание ног в коленях",
        "Слишком быстрое движение",
        "Неполная амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "abs-hanging-leg-raises",
        "priority": 1
      },
      {
        "id": "abs-leg-raises",
        "priority": 2
      },
      {
        "id": "abs-hanging-knee-raises",
        "priority": 3
      },
      {
        "id": "abs-reverse-crunch",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_rectus",
      "hip_flexors"
    ]
  },
  {
    "id": "triceps-close-grip-bench-press",
    "name": {
      "ru": "Жим штанги узким хватом",
      "en": "Close Grip Bench Press"
    },
    "sourceFile": "Трицепс.json",
    "sourceMuscle": "triceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [
      "chest",
      "front_delt"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте на горизонтальную скамью. Возьмитесь за штангу хватом уже плеч (расстояние между ладонями около 15-25 см). Сведите лопатки. На вдохе опустите штангу к нижней части груди, локти прижаты к корпусу. На выдохе выжмите штангу вверх, полностью выпрямляя руки. Узкий хват акцентирует нагрузку на трицепс.",
    "instructions": {
      "keyPoints": [
        "Локти прижаты к корпусу, не разведены в стороны",
        "Опускание контролируемое",
        "В верхней точке блокируйте локти"
      ],
      "commonMistakes": [
        "Слишком широкий хват (включается грудь)",
        "Отведение локтей в стороны",
        "Опускание к шее"
      ]
    },
    "alternatives": [
      {
        "id": "triceps-dips",
        "priority": 1
      },
      {
        "id": "triceps-pushdown",
        "priority": 2
      },
      {
        "id": "triceps-french-press",
        "priority": 3
      },
      {
        "id": "triceps-smith-close-grip",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "triceps-dips",
    "name": {
      "ru": "Отжимания на брусьях (акцент на трицепс)",
      "en": "Triceps Dips"
    },
    "sourceFile": "Трицепс.json",
    "sourceMuscle": "triceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [
      "chest",
      "front_delt"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Встаньте на брусья на прямых руках. Корпус держите вертикально, ноги скрещены. Медленно опускайтесь, сгибая локти назад, а не в стороны. Опуститесь до угла 90° в локтях. На выдохе мощно выжмите себя вверх, полностью выпрямляя руки. Для утяжеления используйте пояс с блином.",
    "instructions": {
      "keyPoints": [
        "Корпус вертикальный, без наклона вперед",
        "Локти прижаты к корпусу, не разведены",
        "Не опускайтесь слишком глубоко (травма плеча)"
      ],
      "commonMistakes": [
        "Наклон корпуса вперед (акцент на грудь)",
        "Разведение локтей в стороны",
        "Неполное выпрямление рук"
      ]
    },
    "alternatives": [
      {
        "id": "triceps-close-grip-bench-press",
        "priority": 1
      },
      {
        "id": "triceps-pushdown",
        "priority": 2
      },
      {
        "id": "triceps-bench-dips",
        "priority": 3
      },
      {
        "id": "triceps-machine-dips",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "triceps-pushdown",
    "name": {
      "ru": "Разгибание рук на верхнем блоке (трицепс)",
      "en": "Triceps Pushdown"
    },
    "sourceFile": "Трицепс.json",
    "sourceMuscle": "triceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "triceps"
    ],
    "appMuscleGroups": [
      "triceps"
    ],
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Установите трос на верхний блок, прикрепите прямую рукоять. Встаньте лицом к блоку, корпус слегка наклонен вперед. Локти прижаты к корпусу, предплечья параллельны полу. На выдохе разогните руки вниз, полностью выпрямляя локти, кисти чуть разворачиваются наружу в нижней точке. Медленно вернитесь в исходное.",
    "instructions": {
      "keyPoints": [
        "Локти прижаты к корпусу и неподвижны",
        "Движение только в локтевых суставах",
        "В нижней точке пауза и дополнительное сокращение"
      ],
      "commonMistakes": [
        "Движение плечами",
        "Раскачивание корпусом",
        "Сгибание запястий"
      ]
    },
    "alternatives": [
      {
        "id": "triceps-rope-pushdown",
        "priority": 1
      },
      {
        "id": "triceps-reverse-pushdown",
        "priority": 2
      },
      {
        "id": "triceps-overhead-extension",
        "priority": 3
      },
      {
        "id": "triceps-close-grip-bench-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "triceps"
    ]
  },
  {
    "id": "triceps-rope-pushdown",
    "name": {
      "ru": "Разгибание рук на блоке с канатом",
      "en": "Rope Pushdown"
    },
    "sourceFile": "Трицепс.json",
    "sourceMuscle": "triceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "triceps"
    ],
    "appMuscleGroups": [
      "triceps"
    ],
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Установите трос на верхний блок, прикрепите канатную рукоять. Встаньте лицом к блоку. Возьмитесь за канат нейтральным хватом. На выдохе разогните руки вниз, в конце движения разводя канат в стороны для дополнительного сокращения трицепса. Медленно вернитесь. Канат позволяет больше ротации и лучше прорабатывает латеральную головку.",
    "instructions": {
      "keyPoints": [
        "Локти прижаты к корпусу",
        "В нижней точке разводите канат в стороны",
        "Опускание медленное, подъем быстрее"
      ],
      "commonMistakes": [
        "Движение плечами",
        "Слишком большой вес (ломается техника)",
        "Разведение каната слишком рано"
      ]
    },
    "alternatives": [
      {
        "id": "triceps-pushdown",
        "priority": 1
      },
      {
        "id": "triceps-overhead-extension",
        "priority": 2
      },
      {
        "id": "triceps-close-grip-bench-press",
        "priority": 3
      },
      {
        "id": "triceps-french-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "triceps"
    ]
  },
  {
    "id": "triceps-overhead-extension",
    "name": {
      "ru": "Французский жим сидя с гантелью (за голову)",
      "en": "Overhead Triceps Extension"
    },
    "sourceFile": "Трицепс.json",
    "sourceMuscle": "triceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "brachialis",
      "triceps"
    ],
    "appMuscleGroups": [
      "triceps"
    ],
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [
      "brachialis"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Сядьте на скамью с вертикальной спинкой. Возьмите одну гантель за диск обеими руками, поднимите над головой, локти согнуты. Гантель за головой. На выдохе разогните руки вверх, выпрямляя их над головой, полностью сокращая трицепс. На вдохе медленно верните гантель за голову. Акцент на длинную головку трицепса.",
    "instructions": {
      "keyPoints": [
        "Локти прижаты к ушам, не расходятся в стороны",
        "Движение только в локтевых суставах",
        "Опускание под контролем"
      ],
      "commonMistakes": [
        "Разведение локтей в стороны",
        "Использование спины для рывка",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "triceps-cable-overhead",
        "priority": 1
      },
      {
        "id": "triceps-french-press",
        "priority": 2
      },
      {
        "id": "triceps-pushdown",
        "priority": 3
      },
      {
        "id": "triceps-skullcrusher",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "brachialis",
      "triceps"
    ]
  },
  {
    "id": "triceps-french-press",
    "name": {
      "ru": "Французский жим лежа",
      "en": "Lying Triceps Extension (French Press)"
    },
    "sourceFile": "Трицепс.json",
    "sourceMuscle": "triceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "triceps"
    ],
    "appMuscleGroups": [
      "triceps"
    ],
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте на горизонтальную скамью, возьмите EZ-гриф прямым хватом на ширине плеч. Выпрямите руки над грудью. На вдохе сгибая локти, опустите гриф ко лбу, удерживая плечи неподвижно и перпендикулярно полу. На выдохе разогните руки обратно до полного выпрямления. Не разводите локти.",
    "instructions": {
      "keyPoints": [
        "Плечи перпендикулярны полу и неподвижны",
        "Локти смотрят вверх и не расходятся",
        "Опускайте медленно, поднимайте мощно"
      ],
      "commonMistakes": [
        "Разведение локтей в стороны",
        "Движение плечами",
        "Слишком большой вес (удар по голове)"
      ]
    },
    "alternatives": [
      {
        "id": "triceps-skullcrusher",
        "priority": 1
      },
      {
        "id": "triceps-overhead-extension",
        "priority": 2
      },
      {
        "id": "triceps-pushdown",
        "priority": 3
      },
      {
        "id": "triceps-close-grip-bench-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "triceps"
    ]
  },
  {
    "id": "triceps-skullcrusher",
    "name": {
      "ru": "Разгибание рук с гантелью лежа (кроссбрейкер)",
      "en": "Skullcrusher"
    },
    "sourceFile": "Трицепс.json",
    "sourceMuscle": "triceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "triceps"
    ],
    "appMuscleGroups": [
      "triceps"
    ],
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте на горизонтальную скамью, гантели в руках над грудью ладонями друг к другу. На вдохе согните локти, опуская гантели к ушам или к голове (отсюда название «кроссбрейкер»). Плечи неподвижны, перпендикулярны полу. На выдохе разогните руки вверх, полностью выпрямляя локти. Гантели работают независимо.",
    "instructions": {
      "keyPoints": [
        "Плечи неподвижны и перпендикулярны полу",
        "Локти смотрят в потолок, не расходятся",
        "Опускайте до уровня ушей, не касайтесь головы"
      ],
      "commonMistakes": [
        "Разведение локтей в стороны",
        "Движение плечами",
        "Слишком большой вес (риск удара по лицу)"
      ]
    },
    "alternatives": [
      {
        "id": "triceps-french-press",
        "priority": 1
      },
      {
        "id": "triceps-overhead-extension",
        "priority": 2
      },
      {
        "id": "triceps-pushdown",
        "priority": 3
      },
      {
        "id": "triceps-close-grip-bench-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "triceps"
    ]
  },
  {
    "id": "triceps-cable-overhead",
    "name": {
      "ru": "Разгибание рук на блоке из-за головы",
      "en": "Cable Overhead Triceps Extension"
    },
    "sourceFile": "Трицепс.json",
    "sourceMuscle": "triceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "triceps"
    ],
    "appMuscleGroups": [
      "triceps"
    ],
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на нижний блок, прикрепите канатную рукоять. Встаньте спиной к блоку, наклонитесь вперед, возьмитесь за канат. Поднимите локти вверх, согнув руки, канат за головой. На выдохе разогните руки вверх, полностью выпрямляя локти. На вдохе медленно верните за голову. Трос создает постоянное напряжение.",
    "instructions": {
      "keyPoints": [
        "Локти прижаты к голове и неподвижны",
        "Движение только в локтевых суставах",
        "В нижней точке пауза"
      ],
      "commonMistakes": [
        "Разведение локтей в стороны",
        "Использование спины",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "triceps-overhead-extension",
        "priority": 1
      },
      {
        "id": "triceps-french-press",
        "priority": 2
      },
      {
        "id": "triceps-pushdown",
        "priority": 3
      },
      {
        "id": "triceps-rope-pushdown",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "triceps"
    ]
  },
  {
    "id": "triceps-bench-dips",
    "name": {
      "ru": "Отжимания от скамьи (трицепс)",
      "en": "Bench Dips"
    },
    "sourceFile": "Трицепс.json",
    "sourceMuscle": "triceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [
      "chest",
      "front_delt"
    ],
    "equipmentRaw": [
      "bodyweight",
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "bodyweight",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте на край скамьи, руки рядом с бедрами. Выпрямите ноги или слегка согните. Сойдите со скамьи, перенеся вес на руки. На вдохе медленно опуститесь, сгибая локти до угла 90°, спина близко к скамье. На выдохе выжмите себя вверх, полностью выпрямляя руки. Для утяжеления положите блин на бедра.",
    "instructions": {
      "keyPoints": [
        "Локти прижаты к корпусу, смотрят назад",
        "Плечи опущены, не поднимаются к ушам",
        "Не опускайтесь слишком глубоко"
      ],
      "commonMistakes": [
        "Разведение локтей в стороны",
        "Опускание ниже 90° (травма плеча)",
        "Рывковое движение",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "triceps-dips",
        "priority": 1
      },
      {
        "id": "triceps-pushdown",
        "priority": 2
      },
      {
        "id": "triceps-machine-dips",
        "priority": 3
      },
      {
        "id": "triceps-close-grip-bench-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "triceps-reverse-pushdown",
    "name": {
      "ru": "Обратные разгибания на блоке",
      "en": "Reverse Grip Pushdown"
    },
    "sourceFile": "Трицепс.json",
    "sourceMuscle": "triceps",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "triceps"
    ],
    "appMuscleGroups": [
      "triceps"
    ],
    "primaryMuscles": [
      "triceps"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на верхний блок, прикрепите прямую рукоять. Встаньте лицом к блоку, возьмитесь за рукоять обратным хватом (ладони вверх). Локти прижаты к корпусу. На выдохе разогните руки вниз, полностью выпрямляя локти. Медленно вернитесь. Обратный хват акцентирует медиальную головку трицепса.",
    "instructions": {
      "keyPoints": [
        "Локти прижаты к корпусу",
        "Кисти в конце движения чуть разворачиваются",
        "Движение только в локтях"
      ],
      "commonMistakes": [
        "Движение плечами",
        "Раскачивание корпусом",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "triceps-pushdown",
        "priority": 1
      },
      {
        "id": "triceps-rope-pushdown",
        "priority": 2
      },
      {
        "id": "triceps-close-grip-bench-press",
        "priority": 3
      },
      {
        "id": "triceps-overhead-extension",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "triceps"
    ]
  },
  {
    "id": "lats-pull-ups-medium",
    "name": {
      "ru": "Подтягивания средним хватом",
      "en": "Medium Grip Pull-ups"
    },
    "sourceFile": "Широчайшие.json",
    "sourceMuscle": "lats",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps",
      "shoulders"
    ],
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "upper_back",
      "rear_delt"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Повисните на перекладине хватом сверху на ширине плеч. На выдохе подтянитесь, сводя лопатки и думая о том, чтобы привести локти к тазу. Грудь тянется к перекладине. В верхней точке подбородок выше грифа. Медленно опуститесь, полностью выпрямляя руки. Средний хват равномерно развивает широчайшие.",
    "instructions": {
      "keyPoints": [
        "Локти идут вниз и назад, а не в стороны",
        "Подтягивайтесь за счет спины, а не бицепсов",
        "В нижней точке полностью выпрямляйте руки"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Неполная амплитуда",
        "Рывки ногами",
        "Округление плеч вперед"
      ]
    },
    "alternatives": [
      {
        "id": "lat-pulldown-medium",
        "priority": 1
      },
      {
        "id": "lats-pull-ups-weighted",
        "priority": 2
      },
      {
        "id": "lats-pull-ups-assisted",
        "priority": 3
      },
      {
        "id": "lats-straight-arm-pulldown",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ]
  },
  {
    "id": "lats-pull-ups-weighted",
    "name": {
      "ru": "Подтягивания с весом (акцент на широчайшие)",
      "en": "Weighted Pull-ups"
    },
    "sourceFile": "Широчайшие.json",
    "sourceMuscle": "lats",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "forearms",
      "lats",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps"
    ],
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "upper_back",
      "forearms"
    ],
    "equipmentRaw": [
      "free_weights",
      "bodyweight"
    ],
    "equipment": [
      "barbell",
      "bodyweight",
      "dumbbell"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Закрепите блин или гантель на поясе с помощью цепи или наденьте утяжелительный жилет. Повисните на перекладине хватом сверху на ширине плеч. На выдохе подтянитесь, максимально сокращая широчайшие в верхней точке. Локти приводятся к тазу. Медленно опуститесь под контролем. Дополнительный вес увеличивает гипертрофию.",
    "instructions": {
      "keyPoints": [
        "Вес надежно закреплен, не раскачивается",
        "Контролируйте опускание (2-3 секунды)",
        "Не используйте инерцию ног"
      ],
      "commonMistakes": [
        "Слишком большой вес (ломается техника)",
        "Рывковое движение",
        "Неполное выпрямление рук внизу"
      ]
    },
    "alternatives": [
      {
        "id": "lat-pulldown-weighted",
        "priority": 1
      },
      {
        "id": "lats-pull-ups-medium",
        "priority": 2
      },
      {
        "id": "lats-pull-ups-assisted",
        "priority": 3
      },
      {
        "id": "lats-t-bar-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "forearms",
      "lats",
      "upper_back"
    ]
  },
  {
    "id": "lats-pull-ups-assisted",
    "name": {
      "ru": "Подтягивания в гравитроне (широчайшие)",
      "en": "Assisted Pull-ups"
    },
    "sourceFile": "Широчайшие.json",
    "sourceMuscle": "lats",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps"
    ],
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "upper_back"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте коленями на платформу гравитрона. Возьмитесь за перекладину хватом сверху на ширине плеч. Настройте противовес. На выдохе подтянитесь, сводя лопатки и приводя локти к тазу. Медленно опуститесь. Противовес помогает освоить правильную технику и постепенно перейти к обычным подтягиваниям.",
    "instructions": {
      "keyPoints": [
        "Противовес минимальный, при котором вы сохраняете технику",
        "Корпус прямой, без раскачивания",
        "Полная амплитуда: руки полностью выпрямлены внизу"
      ],
      "commonMistakes": [
        "Слишком большой противовес",
        "Рывковое движение",
        "Неполная амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "lats-pull-ups-medium",
        "priority": 1
      },
      {
        "id": "lat-pulldown",
        "priority": 2
      },
      {
        "id": "lats-negative-pull-ups",
        "priority": 3
      },
      {
        "id": "lats-straight-arm-pulldown",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "upper_back"
    ]
  },
  {
    "id": "lat-pulldown-medium",
    "name": {
      "ru": "Тяга верхнего блока средним хватом",
      "en": "Lat Pulldown Medium Grip"
    },
    "sourceFile": "Широчайшие.json",
    "sourceMuscle": "lats",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps"
    ],
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "biceps",
      "upper_back"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер для тяги верхнего блока, зафиксируйте колени. Возьмитесь за рукоять хватом сверху на ширине плеч. На выдохе тяните рукоять к верхней части груди, отклоняя корпус назад на 10-15°. Локти идут вниз и назад. Медленно верните в исходное, чувствуя растяжение широчайших.",
    "instructions": {
      "keyPoints": [
        "Тяните локтями, а не руками",
        "Грудная клетка раскрыта, лопатки сведены",
        "В нижней точке пауза 1 секунда"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Рывковое движение",
        "Использование инерции ног"
      ]
    },
    "alternatives": [
      {
        "id": "lats-pull-ups-medium",
        "priority": 1
      },
      {
        "id": "lats-pull-ups-assisted",
        "priority": 2
      },
      {
        "id": "lats-straight-arm-pulldown",
        "priority": 3
      },
      {
        "id": "lats-cable-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "upper_back"
    ]
  },
  {
    "id": "lats-straight-arm-pulldown",
    "name": {
      "ru": "Тяга прямых рук на блоке",
      "en": "Straight Arm Pulldown"
    },
    "sourceFile": "Широчайшие.json",
    "sourceMuscle": "lats",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "lats",
      "rear_delt",
      "triceps_long"
    ],
    "appMuscleGroups": [
      "back",
      "shoulders"
    ],
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "triceps_long",
      "rear_delt"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на верхний блок, прикрепите прямую или канатную рукоять. Встаньте лицом к блоку, ноги на ширине плеч, слегка согните колени. Наклоните корпус вперед. Руки прямые. На выдохе тяните рукоять вниз к бедрам, сохраняя руки прямыми. В конце амплитуды максимально сократите широчайшие. Медленно вернитесь.",
    "instructions": {
      "keyPoints": [
        "Руки остаются прямыми на протяжении всего движения",
        "Движение начинается с лопаток, а не с рук",
        "Корпус почти неподвижен"
      ],
      "commonMistakes": [
        "Сгибание рук в локтях",
        "Рывковое движение",
        "Использование корпуса для инерции"
      ]
    },
    "alternatives": [
      {
        "id": "lats-pullovers",
        "priority": 1
      },
      {
        "id": "lats-pull-ups-medium",
        "priority": 2
      },
      {
        "id": "lat-pulldown-medium",
        "priority": 3
      },
      {
        "id": "lats-cable-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "lats",
      "rear_delt",
      "triceps_long"
    ]
  },
  {
    "id": "lats-pullovers",
    "name": {
      "ru": "Пуловер с гантелью (акцент на широчайшие)",
      "en": "Dumbbell Pullover"
    },
    "sourceFile": "Широчайшие.json",
    "sourceMuscle": "lats",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "chest",
      "lats",
      "triceps_long"
    ],
    "appMuscleGroups": [
      "back",
      "chest"
    ],
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "chest",
      "triceps_long"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте поперек горизонтальной скамьи, только лопатки на скамье, голова свешена. Возьмите одну гантель за диск обеими руками, держите над грудью, локти чуть согнуты. На вдохе опустите гантель за голову по дуге до уровня головы или чуть ниже, чувствуя растяжение широчайших. На выдохе верните в исходное, сокращая широчайшие.",
    "instructions": {
      "keyPoints": [
        "Таз опущен, пресс напряжен",
        "Локти сохраняют легкий сгиб",
        "Движение в плечевых суставах, а не в локтях"
      ],
      "commonMistakes": [
        "Слишком тяжелая гантель",
        "Разгибание локтей",
        "Прогиб в пояснице"
      ]
    },
    "alternatives": [
      {
        "id": "lats-straight-arm-pulldown",
        "priority": 1
      },
      {
        "id": "lats-cable-pullover",
        "priority": 2
      },
      {
        "id": "machine-pullover",
        "priority": 3
      },
      {
        "id": "lats-pull-ups-medium",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "lats",
      "triceps_long"
    ]
  },
  {
    "id": "lats-cable-pullover",
    "name": {
      "ru": "Пуловер на блоке",
      "en": "Cable Pullover"
    },
    "sourceFile": "Широчайшие.json",
    "sourceMuscle": "lats",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "chest",
      "lats",
      "triceps_long"
    ],
    "appMuscleGroups": [
      "back",
      "chest"
    ],
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "triceps_long",
      "chest"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на верхний блок, прикрепите прямую рукоять или канат. Встаньте спиной к блоку, наклонитесь вперед, ноги на ширине плеч. Возьмитесь за рукоять над головой. На выдохе тяните рукоять вниз к бедрам по дуге, сохраняя локти слегка согнутыми. В нижней точке сократите широчайшие. Медленно вернитесь.",
    "instructions": {
      "keyPoints": [
        "Локти фиксированы, не сгибаются и не разгибаются",
        "Движение начинается с лопаток",
        "Корпус почти неподвижен"
      ],
      "commonMistakes": [
        "Сгибание рук в локтях",
        "Рывковое движение",
        "Использование спины и ног для инерции"
      ]
    },
    "alternatives": [
      {
        "id": "lats-pullovers",
        "priority": 1
      },
      {
        "id": "lats-straight-arm-pulldown",
        "priority": 2
      },
      {
        "id": "machine-pullover",
        "priority": 3
      },
      {
        "id": "lats-pull-ups-medium",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "lats",
      "triceps_long"
    ]
  },
  {
    "id": "lats-cable-row",
    "name": {
      "ru": "Тяга блока к животу (акцент на широчайшие)",
      "en": "Seated Cable Row"
    },
    "sourceFile": "Широчайшие.json",
    "sourceMuscle": "lats",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps"
    ],
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "upper_back",
      "biceps"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте на скамью, упритесь ногами в платформу. Возьмитесь за V-образную рукоять. Спина прямая. На выдохе тяните рукоять к низу живота, локти вдоль корпуса. В конце амплитуды дополнительно сводите лопатки и сокращайте широчайшие. Медленно вернитесь.",
    "instructions": {
      "keyPoints": [
        "Локти прижаты к корпусу на протяжении всего движения",
        "Тяните за счет спины, а не бицепсов",
        "В нижней точке пауза"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Круглая спина",
        "Тяга за счет бицепсов"
      ]
    },
    "alternatives": [
      {
        "id": "lats-t-bar-row",
        "priority": 1
      },
      {
        "id": "lats-dumbbell-row",
        "priority": 2
      },
      {
        "id": "lats-pull-ups-medium",
        "priority": 3
      },
      {
        "id": "lats-machine-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "upper_back"
    ]
  },
  {
    "id": "lats-t-bar-row",
    "name": {
      "ru": "Тяга Т-грифа (акцент на широчайшие)",
      "en": "T-Bar Row"
    },
    "sourceFile": "Широчайшие.json",
    "sourceMuscle": "lats",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps"
    ],
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "upper_back",
      "biceps"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте над Т-грифом, ноги на ширине плеч. Наклонитесь с прямой спиной под 45°, возьмитесь за рукояти. Локти прижаты к корпусу. На выдохе тяните гриф к груди или поясу, максимально сокращая широчайшие. Медленно опустите. Узкий хват акцентирует широчайшие.",
    "instructions": {
      "keyPoints": [
        "Локти идут вдоль корпуса, не разводятся",
        "Спина прямая",
        "Тяните локтями, а не бицепсами"
      ],
      "commonMistakes": [
        "Округление спины",
        "Рывковое движение",
        "Отрыв корпуса при тяге"
      ]
    },
    "alternatives": [
      {
        "id": "lats-cable-row",
        "priority": 1
      },
      {
        "id": "lats-dumbbell-row",
        "priority": 2
      },
      {
        "id": "lats-pull-ups-medium",
        "priority": 3
      },
      {
        "id": "lats-machine-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "upper_back"
    ]
  },
  {
    "id": "lats-dumbbell-row",
    "name": {
      "ru": "Тяга гантели одной рукой (акцент на широчайшие)",
      "en": "Single Arm Dumbbell Row"
    },
    "sourceFile": "Широчайшие.json",
    "sourceMuscle": "lats",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps"
    ],
    "primaryMuscles": [
      "lats"
    ],
    "secondaryMuscles": [
      "upper_back",
      "biceps"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Упритесь одной рукой и коленом в скамью. Спина прямая. Возьмите гантель нейтральным хватом. На выдохе тяните гантель к поясу, локоть вдоль корпуса. В верхней точке дополнительно сокращайте широчайшую, сводя лопатку. Медленно опустите, чувствуя растяжение.",
    "instructions": {
      "keyPoints": [
        "Локоть проходит вдоль корпуса, не отводится в сторону",
        "Спина прямая, таз не поворачивается",
        "Полная амплитуда"
      ],
      "commonMistakes": [
        "Округление спины",
        "Вращение корпусом",
        "Тяга за счет бицепса"
      ]
    },
    "alternatives": [
      {
        "id": "lats-cable-row",
        "priority": 1
      },
      {
        "id": "lats-t-bar-row",
        "priority": 2
      },
      {
        "id": "lats-pull-ups-medium",
        "priority": 3
      },
      {
        "id": "lats-machine-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "upper_back"
    ]
  },
  {
    "id": "hamstrings-romanian-deadlift",
    "name": {
      "ru": "Румынская тяга со штангой",
      "en": "Romanian Deadlift"
    },
    "sourceFile": "бицепс бедра.json",
    "sourceMuscle": "hamstrings",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "lower_back"
    ],
    "appMuscleGroups": [
      "back",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [
      "glutes",
      "lower_back"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Стоя, штанга перед бедрами хватом сверху на ширине плеч. Ноги на ширине таза, колени слегка согнуты. Сохраняя спину абсолютно прямой, отводите таз назад и опускайте штангу по ногам до середины голени, чувствуя растяжение бицепса бедра. На выдохе мощно вернитесь в исходное, выпрямляя таз. Поясница не округляется на протяжении всего движения.",
    "instructions": {
      "keyPoints": [
        "Спина прямая на протяжении всего движения",
        "Колени почти не сгибаются (легкий сгиб сохраняется)",
        "Гриф скользит по голеням и бедрам"
      ],
      "commonMistakes": [
        "Округление спины (травмоопасно)",
        "Слишком глубокое опускание с округлением",
        "Сгибание коленей слишком сильно"
      ]
    },
    "alternatives": [
      {
        "id": "hamstrings-sldl",
        "priority": 1
      },
      {
        "id": "hamstrings-good-morning",
        "priority": 2
      },
      {
        "id": "hamstrings-leg-curl",
        "priority": 3
      },
      {
        "id": "hamstrings-cable-pull-through",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "lower_back"
    ]
  },
  {
    "id": "hamstrings-sldl",
    "name": {
      "ru": "Становая тяга на прямых ногах",
      "en": "Straight Leg Deadlift"
    },
    "sourceFile": "бицепс бедра.json",
    "sourceMuscle": "hamstrings",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "lower_back"
    ],
    "appMuscleGroups": [
      "back",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [
      "glutes",
      "lower_back"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Стоя, штанга или гантели в опущенных руках. Ноги на ширине таза, колени почти прямые (допускается легкий сгиб, чтобы не перегружать суставы). Сохраняя спину прямой, наклонитесь вперед, отводя таз назад, опуская вес вдоль ног до уровня середины голени или ниже. Чувствуйте интенсивное растяжение бицепса бедра. Вернитесь, напрягая ягодицы и заднюю поверхность бедра.",
    "instructions": {
      "keyPoints": [
        "Ноги почти прямые на протяжении всего движения",
        "Спина абсолютно прямая, не округляйте",
        "Движение только в тазобедренном суставе"
      ],
      "commonMistakes": [
        "Округление спины",
        "Сгибание коленей",
        "Использование поясницы для подъема"
      ]
    },
    "alternatives": [
      {
        "id": "hamstrings-romanian-deadlift",
        "priority": 1
      },
      {
        "id": "hamstrings-good-morning",
        "priority": 2
      },
      {
        "id": "hamstrings-leg-curl",
        "priority": 3
      },
      {
        "id": "hamstrings-nordic-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "lower_back"
    ]
  },
  {
    "id": "hamstrings-good-morning",
    "name": {
      "ru": "Наклоны со штангой на плечах (гуд монинг)",
      "en": "Good Morning"
    },
    "sourceFile": "бицепс бедра.json",
    "sourceMuscle": "hamstrings",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "lower_back"
    ],
    "appMuscleGroups": [
      "back",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [
      "glutes",
      "lower_back"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Встаньте прямо, штанга на плечах (как для приседаний), ноги на ширине плеч, колени слегка согнуты. На вдохе наклонитесь вперед, отводя таз назад, сохраняя спину прямой. Наклоняйтесь до параллели с полом или чуть ниже, чувствуя растяжение бицепса бедра. На выдохе вернитесь в исходное за счет ягодиц и задней поверхности бедра, а не поясницы.",
    "instructions": {
      "keyPoints": [
        "Спина абсолютно прямая, не округляйте",
        "Наклон в тазобедренном суставе",
        "Колени сохраняют легкий сгиб"
      ],
      "commonMistakes": [
        "Округление спины (очень травмоопасно)",
        "Слишком глубокий наклон с потерей прямой спины",
        "Сгибание коленей слишком сильно"
      ]
    },
    "alternatives": [
      {
        "id": "hamstrings-romanian-deadlift",
        "priority": 1
      },
      {
        "id": "hamstrings-sldl",
        "priority": 2
      },
      {
        "id": "hamstrings-hyperextension",
        "priority": 3
      },
      {
        "id": "hamstrings-cable-pull-through",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "lower_back"
    ]
  },
  {
    "id": "hamstrings-leg-curl-lying",
    "name": {
      "ru": "Сгибание ног лежа в тренажере",
      "en": "Lying Leg Curl"
    },
    "sourceFile": "бицепс бедра.json",
    "sourceMuscle": "hamstrings",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings"
    ],
    "appMuscleGroups": [
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [
      "glutes"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Лягте на тренажер лицом вниз, валик под пятками (чуть выше ахилла). Зафиксируйте корпус, таз прижат к скамье. На выдохе сгибайте ноги, подтягивая валик к ягодицам, полностью сокращая бицепс бедра. В верхней точке пауза 1-2 секунды. На вдохе медленно вернитесь в исходное, контролируя движение. Не отрывайте бедра от скамьи.",
    "instructions": {
      "keyPoints": [
        "Таз плотно прижат к скамье, не отрывается",
        "Движение плавное, без рывков",
        "В верхней точке пиковое сокращение"
      ],
      "commonMistakes": [
        "Подъем таза от скамьи",
        "Рывковое движение",
        "Слишком большой вес (теряется контроль)"
      ]
    },
    "alternatives": [
      {
        "id": "hamstrings-leg-curl-seated",
        "priority": 1
      },
      {
        "id": "hamstrings-leg-curl-standing",
        "priority": 2
      },
      {
        "id": "hamstrings-romanian-deadlift",
        "priority": 3
      },
      {
        "id": "hamstrings-cable-leg-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings"
    ]
  },
  {
    "id": "hamstrings-leg-curl-seated",
    "name": {
      "ru": "Сгибание ног сидя в тренажере",
      "en": "Seated Leg Curl"
    },
    "sourceFile": "бицепс бедра.json",
    "sourceMuscle": "hamstrings",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "hamstrings"
    ],
    "appMuscleGroups": [
      "hamstrings"
    ],
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер для сгибания ног, отрегулируйте валик над щиколотками, колени на краю сиденья. Спина прижата к спинке. На выдохе согните ноги, подтягивая валик под себя, полностью сокращая бицепс бедра. В верхней точке пауза. Медленно вернитесь в исходное. Сидячее положение изолирует бицепс бедра за счет фиксации таза.",
    "instructions": {
      "keyPoints": [
        "Спина прижата к спинке",
        "Движение только в коленях",
        "Не используйте корпус для рывка"
      ],
      "commonMistakes": [
        "Отрыв спины от спинки",
        "Рывковое движение",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "hamstrings-leg-curl-lying",
        "priority": 1
      },
      {
        "id": "hamstrings-leg-curl-standing",
        "priority": 2
      },
      {
        "id": "hamstrings-cable-leg-curl",
        "priority": 3
      },
      {
        "id": "hamstrings-nordic-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "hamstrings"
    ]
  },
  {
    "id": "hamstrings-leg-curl-standing",
    "name": {
      "ru": "Сгибание ног стоя в тренажере",
      "en": "Standing Leg Curl"
    },
    "sourceFile": "бицепс бедра.json",
    "sourceMuscle": "hamstrings",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings"
    ],
    "appMuscleGroups": [
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [
      "glutes"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте в тренажер для сгибания ног стоя, зафиксировав рабочую ногу под валиком. Руками упритесь в опору. На выдохе согните ногу, подтягивая валик к ягодице, полностью сокращая бицепс бедра. В верхней точке пауза. Медленно вернитесь. Позволяет работать с каждой ногой отдельно и исправлять дисбаланс.",
    "instructions": {
      "keyPoints": [
        "Корпус прямой, спина не округляется",
        "Движение только в колене",
        "Бедро неподвижно на протяжении движения"
      ],
      "commonMistakes": [
        "Наклон корпуса вперед",
        "Рывковое движение",
        "Использование спины для инерции"
      ]
    },
    "alternatives": [
      {
        "id": "hamstrings-leg-curl-lying",
        "priority": 1
      },
      {
        "id": "hamstrings-leg-curl-seated",
        "priority": 2
      },
      {
        "id": "hamstrings-cable-leg-curl",
        "priority": 3
      },
      {
        "id": "hamstrings-romanian-deadlift",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings"
    ]
  },
  {
    "id": "hamstrings-cable-leg-curl",
    "name": {
      "ru": "Сгибание ног на блоке (стоя)",
      "en": "Cable Leg Curl"
    },
    "sourceFile": "бицепс бедра.json",
    "sourceMuscle": "hamstrings",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "hamstrings"
    ],
    "appMuscleGroups": [
      "hamstrings"
    ],
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на нижний блок, прикрепите манжету для лодыжки. Встаньте лицом к блоку, закрепите манжету на лодыжке. Упритесь руками в стойку. На выдохе согните ногу, подтягивая трос к ягодице, полностью сокращая бицепс бедра. В верхней точке пауза. Медленно вернитесь. Трос создает постоянное напряжение на протяжении всего движения.",
    "instructions": {
      "keyPoints": [
        "Корпус прямой, спина не округляется",
        "Движение только в колене",
        "Бедро неподвижно"
      ],
      "commonMistakes": [
        "Наклон корпуса вперед",
        "Рывковое движение",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "hamstrings-leg-curl-lying",
        "priority": 1
      },
      {
        "id": "hamstrings-leg-curl-standing",
        "priority": 2
      },
      {
        "id": "hamstrings-romanian-deadlift",
        "priority": 3
      },
      {
        "id": "hamstrings-cable-pull-through",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "hamstrings"
    ]
  },
  {
    "id": "hamstrings-hyperextension",
    "name": {
      "ru": "Гиперэкстензия (акцент на бицепс бедра)",
      "en": "Hyperextension for Hamstrings"
    },
    "sourceFile": "бицепс бедра.json",
    "sourceMuscle": "hamstrings",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "lower_back"
    ],
    "appMuscleGroups": [
      "back",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [
      "glutes",
      "lower_back"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Лягте на тренажер для гиперэкстензии, пятки под валиками. Скрестите руки на груди. На выдохе поднимите корпус до прямой линии с ногами, не перегибаясь в пояснице. Для акцента на бицепс бедра округлите спину в верхней точке (скругление, а не прогиб). Медленно опуститесь. Упражнение можно выполнять с округленной спиной для смещения нагрузки на заднюю поверхность бедра.",
    "instructions": {
      "keyPoints": [
        "Для акцента на бицепс бедра — скругление спины",
        "Подъем за счет ягодиц и задней поверхности",
        "Медленное опускание"
      ],
      "commonMistakes": [
        "Резкое движение",
        "Прогиб в пояснице (акцент на поясницу)",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "hamstrings-romanian-deadlift",
        "priority": 1
      },
      {
        "id": "hamstrings-good-morning",
        "priority": 2
      },
      {
        "id": "hamstrings-leg-curl-lying",
        "priority": 3
      },
      {
        "id": "hamstrings-nordic-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "lower_back"
    ]
  },
  {
    "id": "hamstrings-cable-pull-through",
    "name": {
      "ru": "Тяга между ног на блоке",
      "en": "Cable Pull Through"
    },
    "sourceFile": "бицепс бедра.json",
    "sourceMuscle": "hamstrings",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "lower_back"
    ],
    "appMuscleGroups": [
      "back",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [
      "glutes",
      "lower_back"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на нижний блок, прикрепите канатную рукоять. Встаньте спиной к блоку, пропустив канат между ног. Наклонитесь вперед, сохраняя спину прямой, хват на канате между ног. На выдохе выпрямитесь, выталкивая таз вперед и напрягая ягодицы и бицепс бедра. Медленно вернитесь в наклон. Упражнение имитирует румынскую тягу, но с постоянным напряжением от троса.",
    "instructions": {
      "keyPoints": [
        "Спина прямая на протяжении всего движения",
        "Движение начинается с отведения таза назад",
        "В конце мощное сокращение ягодиц"
      ],
      "commonMistakes": [
        "Округление спины",
        "Использование поясницы для подъема",
        "Рывковое движение"
      ]
    },
    "alternatives": [
      {
        "id": "hamstrings-romanian-deadlift",
        "priority": 1
      },
      {
        "id": "hamstrings-good-morning",
        "priority": 2
      },
      {
        "id": "hamstrings-sldl",
        "priority": 3
      },
      {
        "id": "hamstrings-hyperextension",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "lower_back"
    ]
  },
  {
    "id": "hamstrings-nordic-curl",
    "name": {
      "ru": "Нордические сгибания (скандинавские)",
      "en": "Nordic Curl"
    },
    "sourceFile": "бицепс бедра.json",
    "sourceMuscle": "hamstrings",
    "highLevelGroup": "ноги",
    "priorityMuscles": [
      "glutes",
      "hamstrings"
    ],
    "appMuscleGroups": [
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "hamstrings"
    ],
    "secondaryMuscles": [
      "glutes"
    ],
    "equipmentRaw": [
      "bodyweight",
      "machine"
    ],
    "equipment": [
      "bodyweight",
      "machine"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Встаньте на колени, зафиксируйте пятки под валик тренажера или попросите напарника придержать их. Руки скрещены на груди или вдоль тела. Сохраняя спину прямой, медленно наклоняйтесь вперед, контролируя опускание за счет бицепса бедра. Опуститесь максимально низко, затем мощным усилием бицепса бедра вернитесь в вертикальное положение. Очень эффективное упражнение для силы и гипертрофии задней поверхности.",
    "instructions": {
      "keyPoints": [
        "Опускание медленное, подъем мощный",
        "Спина прямая, движение только в коленях",
        "Если сложно — используйте резину для облегчения или делайте неполную амплитуду"
      ],
      "commonMistakes": [
        "Сгибание в пояснице",
        "Падение без контроля",
        "Слишком быстрое опускание"
      ]
    },
    "alternatives": [
      {
        "id": "hamstrings-leg-curl-lying",
        "priority": 1
      },
      {
        "id": "hamstrings-romanian-deadlift",
        "priority": 2
      },
      {
        "id": "hamstrings-cable-leg-curl",
        "priority": 3
      },
      {
        "id": "hamstrings-sliding-leg-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings"
    ]
  },
  {
    "id": "upperback-seated-cable-row",
    "name": {
      "ru": "Тяга верхнего блока к груди",
      "en": "Seated Cable Row"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps",
      "shoulders"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "lats",
      "biceps",
      "rear_delt"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте на скамью тренажера, упритесь ногами в платформу. Возьмитесь за V-образную рукоять или прямую рукоять хватом сверху. Спина прямая, грудь колесом. На выдохе тяните рукоять к низу живота, сводя лопатки. Локти идут вдоль корпуса назад. В пике пауза 1 секунда, затем медленно вернитесь, чувствуя растяжение.",
    "instructions": {
      "keyPoints": [
        "Лопатки сведены вместе в конце движения",
        "Корпус почти неподвижен, работает только спина",
        "Плечи опущены, не поднимайте их к ушам"
      ],
      "commonMistakes": [
        "Раскачивание корпусом",
        "Круглая спина",
        "Тяга за счет бицепсов, а не спины"
      ]
    },
    "alternatives": [
      {
        "id": "upperback-t-bar-row",
        "priority": 1
      },
      {
        "id": "upperback-dumbbell-row",
        "priority": 2
      },
      {
        "id": "upperback-machine-row",
        "priority": 3
      },
      {
        "id": "upperback-bent-over-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ]
  },
  {
    "id": "upperback-t-bar-row",
    "name": {
      "ru": "Тяга Т-грифа",
      "en": "T-Bar Row"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps",
      "shoulders"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "lats",
      "biceps",
      "rear_delt"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте над Т-грифом, ноги на ширине плеч. Наклонитесь с прямой спиной под 45°, возьмитесь за рукояти. Грудью упритесь в подушку (если есть). На выдохе тяните гриф к груди, сводя лопатки. Локти идут вдоль корпуса. В верхней точке пиковое сокращение. Медленно опустите.",
    "instructions": {
      "keyPoints": [
        "Спина прямая на протяжении всего движения",
        "Тяните локтями, а не бицепсами",
        "Корпус почти неподвижен"
      ],
      "commonMistakes": [
        "Округление спины",
        "Рывковое движение",
        "Подъем корпуса при тяге"
      ]
    },
    "alternatives": [
      {
        "id": "upperback-seated-cable-row",
        "priority": 1
      },
      {
        "id": "upperback-bent-over-row",
        "priority": 2
      },
      {
        "id": "upperback-dumbbell-row",
        "priority": 3
      },
      {
        "id": "upperback-machine-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ]
  },
  {
    "id": "upperback-bent-over-row",
    "name": {
      "ru": "Тяга штанги в наклоне",
      "en": "Bent Over Barbell Row"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "lower_back",
      "rear_delt",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps",
      "shoulders"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "lats",
      "biceps",
      "rear_delt",
      "lower_back"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Стоя, возьмитесь за штангу хватом сверху чуть шире плеч. Наклонитесь с прямой спиной до параллели с полом или чуть выше, колени слегка согнуты. На выдохе тяните штангу к нижней части груди, сводя лопатки. Локти идут вверх и назад. Опустите под контролем.",
    "instructions": {
      "keyPoints": [
        "Спина прямая — ключевой момент! Не округляйте",
        "Гриф движется по дуге к поясу/груди",
        "Колени слегка согнуты, чтобы снять нагрузку с поясницы"
      ],
      "commonMistakes": [
        "Круглая спина (травмоопасно)",
        "Рывковое движение",
        "Тяга за счет ног и спины одновременно",
        "Неполная амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "upperback-t-bar-row",
        "priority": 1
      },
      {
        "id": "upperback-seated-cable-row",
        "priority": 2
      },
      {
        "id": "upperback-dumbbell-row",
        "priority": 3
      },
      {
        "id": "upperback-machine-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "lower_back",
      "rear_delt",
      "upper_back"
    ]
  },
  {
    "id": "upperback-dumbbell-row",
    "name": {
      "ru": "Тяга гантели одной рукой в наклоне",
      "en": "Single Arm Dumbbell Row"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps",
      "shoulders"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "lats",
      "biceps",
      "rear_delt"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Упритесь одной рукой и коленом в горизонтальную скамью. Вторая нога на полу. Спина прямая, корпус почти параллелен полу. Возьмите гантель нейтральным хватом. На выдохе тяните гантель к поясу, сводя лопатку. Локоть идет вдоль корпуса. Медленно опустите, чувствуя растяжение.",
    "instructions": {
      "keyPoints": [
        "Спина прямая, таз не скручивает",
        "Локоть проходит вдоль корпуса, не отводится в сторону",
        "Полная амплитуда: внизу рука выпрямлена"
      ],
      "commonMistakes": [
        "Округление спины",
        "Вращение корпусом",
        "Тяга за счет бицепса, а не спины"
      ]
    },
    "alternatives": [
      {
        "id": "upperback-seated-cable-row",
        "priority": 1
      },
      {
        "id": "upperback-t-bar-row",
        "priority": 2
      },
      {
        "id": "upperback-bent-over-row",
        "priority": 3
      },
      {
        "id": "upperback-cable-single-arm",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ]
  },
  {
    "id": "upperback-machine-row",
    "name": {
      "ru": "Тяга в рычажном тренажере",
      "en": "Machine Row"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "lats",
      "biceps"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер, грудью упритесь в подушку (если есть). Возьмитесь за рукоятки. На выдохе тяните рукоятки к себе, сводя лопатки. Локти идут назад и вниз. В пике пауза. Медленно вернитесь в исходное положение, не расслабляя мышцы спины.",
    "instructions": {
      "keyPoints": [
        "Грудная клетка прижата к подушке",
        "Лопатки сведены вместе в конце",
        "Движение плавное, без рывков"
      ],
      "commonMistakes": [
        "Отрыв груди от подушки",
        "Использование инерции",
        "Слишком короткая амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "upperback-seated-cable-row",
        "priority": 1
      },
      {
        "id": "upperback-t-bar-row",
        "priority": 2
      },
      {
        "id": "upperback-dumbbell-row",
        "priority": 3
      },
      {
        "id": "upperback-cable-single-arm",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "upper_back"
    ]
  },
  {
    "id": "upperback-cable-single-arm",
    "name": {
      "ru": "Тяга блока одной рукой стоя",
      "en": "Single Arm Cable Row"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps",
      "shoulders"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "lats",
      "biceps",
      "rear_delt"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите блок в нижнее положение, прикрепите D-рукоять. Встаньте боком к блоку, ноги на ширине плеч. Возьмитесь за рукоять. Сделайте шаг назад, наклоните корпус немного вперед. На выдохе тяните рукоять к поясу, сводя лопатку и поворачивая корпус в конце. Медленно вернитесь.",
    "instructions": {
      "keyPoints": [
        "Спина прямая",
        "Локоть идет вдоль корпуса",
        "В конце амплитуды дополнительная ротация для сокращения"
      ],
      "commonMistakes": [
        "Округление спины",
        "Рывковое движение",
        "Тяга за счет плеча, а не спины",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "upperback-dumbbell-row",
        "priority": 1
      },
      {
        "id": "upperback-seated-cable-row",
        "priority": 2
      },
      {
        "id": "upperback-machine-row",
        "priority": 3
      },
      {
        "id": "upperback-t-bar-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ]
  },
  {
    "id": "upperback-reverse-grip-row",
    "name": {
      "ru": "Тяга штанги обратным хватом в наклоне",
      "en": "Reverse Grip Bent Over Row"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "lower_back",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "lats",
      "biceps",
      "lower_back"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Аналогично тяге штанги в наклоне, но хват снизу (ладонями к себе). Локти прижаты к корпусу сильнее. Тяните штангу к нижней части груди или к поясу. Обратный хват сильнее включает бицепс и нижнюю часть широчайших.",
    "instructions": {
      "keyPoints": [
        "Спина прямая, наклон 45-90°",
        "Локти строго вдоль корпуса",
        "Гриф тянется к поясу, а не к груди"
      ],
      "commonMistakes": [
        "Округление спины",
        "Разведение локтей в стороны",
        "Тяга только бицепсами, без сведения лопаток"
      ]
    },
    "alternatives": [
      {
        "id": "upperback-bent-over-row",
        "priority": 1
      },
      {
        "id": "upperback-seated-cable-row",
        "priority": 2
      },
      {
        "id": "upperback-t-bar-row",
        "priority": 3
      },
      {
        "id": "upperback-dumbbell-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "lower_back",
      "upper_back"
    ]
  },
  {
    "id": "upperback-chest-supported-row",
    "name": {
      "ru": "Тяга в тренажере с упором грудью",
      "en": "Chest Supported Row"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "lats",
      "biceps"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер, грудью упритесь в подушку. Ноги на платформе. Возьмитесь за рукоятки. На выдохе тяните рукоятки к себе, максимально сводя лопатки. Локти идут назад. В пике пауза 1-2 секунды. Медленно вернитесь, контролируя движение. Упор снимает нагрузку с поясницы.",
    "instructions": {
      "keyPoints": [
        "Грудь плотно прижата к подушке",
        "Сведение лопаток — главное движение",
        "Локти не поднимаются выше плеч"
      ],
      "commonMistakes": [
        "Отрыв груди от подушки",
        "Рывковое движение",
        "Слишком короткая амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "upperback-machine-row",
        "priority": 1
      },
      {
        "id": "upperback-seated-cable-row",
        "priority": 2
      },
      {
        "id": "upperback-t-bar-row",
        "priority": 3
      },
      {
        "id": "upperback-dumbbell-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "upper_back"
    ]
  },
  {
    "id": "upperback-face-pull",
    "name": {
      "ru": "Тяга к лицу (акцент на верх спины)",
      "en": "Face Pull"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "rear_delt",
      "rotator_cuff",
      "traps",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "shoulders"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "rear_delt",
      "traps",
      "rotator_cuff"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на верхний блок, прикрепите канатную рукоять. Встаньте лицом к блоку, сделайте шаг назад. Возьмитесь за канат хватом ладонями вниз. Тяните рукоять к лицу, разводя кисти в стороны и ротируя плечи наружу. Локти выше уровня плеч. В конце лопатки максимально сведены.",
    "instructions": {
      "keyPoints": [
        "Локти идут в стороны и назад",
        "Движение начинается с лопаток",
        "Кисти в конце над ушами"
      ],
      "commonMistakes": [
        "Тяга только руками",
        "Наклон корпуса вперед",
        "Слишком большой вес",
        "Локти опущены вниз"
      ]
    },
    "alternatives": [
      {
        "id": "upperback-rear-delt-fly",
        "priority": 1
      },
      {
        "id": "upperback-dumbbell-rear-fly",
        "priority": 2
      },
      {
        "id": "upperback-machine-rear-fly",
        "priority": 3
      },
      {
        "id": "upperback-cable-crossover-high",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "rear_delt",
      "rotator_cuff",
      "traps",
      "upper_back"
    ]
  },
  {
    "id": "upperback-pull-ups-wide",
    "name": {
      "ru": "Подтягивания широким хватом",
      "en": "Wide Grip Pull-ups"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps",
      "shoulders"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "lats",
      "biceps",
      "rear_delt"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Повисните на перекладине хватом сверху значительно шире плеч. На выдохе подтянитесь, сводя лопатки и стараясь коснуться перекладины верхней частью груди. Локти смотрят в стороны. В верхней точке подбородок выше грифа. Медленно опуститесь, полностью выпрямляя руки.",
    "instructions": {
      "keyPoints": [
        "Широкий хват (на 20-30 см шире плеч)",
        "Подтягивайтесь за счет спины, а не бицепсов",
        "Не раскачивайтесь, корпус прямой"
      ],
      "commonMistakes": [
        "Неполная амплитуда",
        "Рывки ногами",
        "Округление плеч вперед"
      ]
    },
    "alternatives": [
      {
        "id": "lat-pulldown-wide",
        "priority": 1
      },
      {
        "id": "upperback-pull-ups-assisted",
        "priority": 2
      },
      {
        "id": "upperback-negative-pull-ups",
        "priority": 3
      },
      {
        "id": "upperback-seated-cable-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ]
  },
  {
    "id": "upperback-pull-ups-weighted",
    "name": {
      "ru": "Подтягивания с дополнительным весом",
      "en": "Weighted Pull-ups"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "forearms",
      "lats",
      "rear_delt",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps",
      "shoulders"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "lats",
      "biceps",
      "rear_delt",
      "forearms"
    ],
    "equipmentRaw": [
      "free_weights",
      "bodyweight"
    ],
    "equipment": [
      "barbell",
      "bodyweight",
      "dumbbell"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Закрепите дополнительный вес на поясе с помощью цепи или наденьте утяжелительный жилет. Повисните на перекладине хватом сверху на ширине плеч или чуть шире. На выдохе подтянитесь, сводя лопатки и поднимая грудь к перекладине. В верхней точке подбородок выше грифа. Медленно опуститесь под контролем, полностью выпрямляя руки. Вес увеличивает нагрузку на спину и бицепсы, требует хорошей базовой подготовки.",
    "instructions": {
      "keyPoints": [
        "Вес закреплен надежно, не раскачивается",
        "Подтягивайтесь без рывков и раскачиваний",
        "Опускание медленнее подъема"
      ],
      "commonMistakes": [
        "Слишком большой вес (ломается техника)",
        "Рывковое движение ногами",
        "Неполная амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "upperback-pull-ups-wide",
        "priority": 1
      },
      {
        "id": "lat-pulldown-weighted",
        "priority": 2
      },
      {
        "id": "upperback-pull-ups-assisted",
        "priority": 3
      },
      {
        "id": "upperback-seated-cable-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "forearms",
      "lats",
      "rear_delt",
      "upper_back"
    ]
  },
  {
    "id": "upperback-pull-ups-assisted",
    "name": {
      "ru": "Подтягивания в гравитроне (с противовесом)",
      "en": "Assisted Pull-ups on Graviton"
    },
    "sourceFile": "вверх спины.json",
    "sourceMuscle": "upper_back",
    "highLevelGroup": "спина",
    "priorityMuscles": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ],
    "appMuscleGroups": [
      "back",
      "biceps",
      "shoulders"
    ],
    "primaryMuscles": [
      "upper_back"
    ],
    "secondaryMuscles": [
      "lats",
      "biceps",
      "rear_delt"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте коленями или стопами на платформу гравитрона. Возьмитесь за перекладину хватом сверху на ширине плеч. Настройте противовес так, чтобы он облегчал подъём. На выдохе подтянитесь, сводя лопатки, до положения, когда подбородок выше перекладины. Медленно опуститесь. Противовес позволяет постепенно уменьшать помощь и переходить к обычным подтягиваниям.",
    "instructions": {
      "keyPoints": [
        "Противовес подобран так, чтобы вы могли сделать 8-12 повторений",
        "Корпус прямой, без раскачивания",
        "Постепенно уменьшайте вес противовеса"
      ],
      "commonMistakes": [
        "Слишком большой противовес (нет нагрузки)",
        "Рывковое движение",
        "Неполная амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "upperback-pull-ups-wide",
        "priority": 1
      },
      {
        "id": "lat-pulldown",
        "priority": 2
      },
      {
        "id": "upperback-negative-pull-ups",
        "priority": 3
      },
      {
        "id": "upperback-seated-cable-row",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "biceps",
      "lats",
      "rear_delt",
      "upper_back"
    ]
  },
  {
    "id": "chest-barbell-flat",
    "name": {
      "ru": "Жим штанги лежа на горизонтальной скамье",
      "en": "Flat Barbell Bench Press"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "front_delt"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте на горизонтальную скамью, глаза под грифом. Сведите лопатки и прижмите их к скамье, ноги плотно на полу. Возьмитесь за гриф хватом чуть шире плеч. Снимите штангу, на вдохе опустите к нижней части груди, локти под углом 45° к корпусу. На выдохе мощно выжмите штангу вверх, полностью выпрямляя руки.",
    "instructions": {
      "keyPoints": [
        "Лопатки сведены и не отрываются",
        "Поясница сохраняет естественный прогиб",
        "Гриф движется по дуге к подбородку"
      ],
      "commonMistakes": [
        "Отрыв таза от скамьи",
        "Разведение локтей в стороны (90°)",
        "Хлопок локтями по корпусу внизу"
      ]
    },
    "alternatives": [
      {
        "id": "chest-dumbbell-flat",
        "priority": 1
      },
      {
        "id": "chest-hammer-flat",
        "priority": 2
      },
      {
        "id": "chest-smith-flat",
        "priority": 3
      },
      {
        "id": "push-ups-weighted",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "chest-dumbbell-flat",
    "name": {
      "ru": "Жим гантелей лежа на горизонтальной скамье",
      "en": "Flat Dumbbell Bench Press"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "front_delt"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Сядьте на край горизонтальной скамьи с гантелями на коленях, затем откиньтесь на спину. Поднимите гантели на уровень груди. Разверните кисти так, чтобы гантели были параллельны. На выдохе выжмите гантели вверх, сводя их в верхней точке, но не ударяя. На вдохе медленно опустите до растяжения груди.",
    "instructions": {
      "keyPoints": [
        "Локти под 45° к корпусу",
        "В нижней точке гантели чуть шире груди",
        "Контролируйте каждую руку отдельно"
      ],
      "commonMistakes": [
        "Асинхронное движение рук",
        "Слишком широкие локти",
        "Неполная амплитуда"
      ]
    },
    "alternatives": [
      {
        "id": "chest-barbell-flat",
        "priority": 1
      },
      {
        "id": "chest-cable-flat",
        "priority": 2
      },
      {
        "id": "chest-machine-seated-press",
        "priority": 3
      },
      {
        "id": "push-ups",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "chest-incline-barbell",
    "name": {
      "ru": "Жим штанги на наклонной скамье (30-45°)",
      "en": "Incline Barbell Bench Press"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "front_delt",
      "triceps"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите скамью с наклоном 30-45°. Лягте, лопатки сведены, ноги на полу. Возьмитесь за гриф чуть шире плеч. Опустите штангу к верхней части груди (ключицам). На выдохе выжмите вверх. Угол наклона смещает нагрузку на верх груди.",
    "instructions": {
      "keyPoints": [
        "Наклон не более 45°, иначе включаются дельты",
        "Гриф опускается строго к ключицам",
        "Локти уже, чем в горизонтальном жиме"
      ],
      "commonMistakes": [
        "Слишком большой наклон скамьи",
        "Опускание к соскам",
        "Мостик в пояснице"
      ]
    },
    "alternatives": [
      {
        "id": "chest-incline-dumbbell",
        "priority": 1
      },
      {
        "id": "chest-smith-incline",
        "priority": 2
      },
      {
        "id": "chest-hammer-incline",
        "priority": 3
      },
      {
        "id": "low-cable-crossover",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "chest-incline-dumbbell",
    "name": {
      "ru": "Жим гантелей на наклонной скамье",
      "en": "Incline Dumbbell Bench Press"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "front_delt",
      "triceps"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Аналогично жиму гантелей на горизонтальной скамье, но скамья установлена под 30-45°. Опускайте гантели к верхней части груди, сохраняя локти под 45°. Жим вверх с легким сведением гантелей. Большая амплитуда и растяжение верхнего отдела груди.",
    "instructions": {
      "keyPoints": [
        "Не опускайте гантели слишком низко (травма плеча)",
        "Движение контролируемое",
        "Кисти нейтральны или чуть развернуты"
      ],
      "commonMistakes": [
        "Биение гантелей друг о друга",
        "Рывковый жим",
        "Наклон скамьи 60° (работают дельты)"
      ]
    },
    "alternatives": [
      {
        "id": "chest-incline-barbell",
        "priority": 1
      },
      {
        "id": "chest-cable-incline",
        "priority": 2
      },
      {
        "id": "chest-machine-incline",
        "priority": 3
      },
      {
        "id": "push-ups-feet-elevated",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "chest-dips",
    "name": {
      "ru": "Отжимания на брусьях (с наклоном на грудь)",
      "en": "Chest Dips"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "front_delt"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Встаньте на брусья на прямых руках. Наклоните корпус вперед на 20-30°, локти разведите в стороны. Медленно опускайтесь, пока плечи не окажутся чуть ниже локтей. На выдохе мощно выжмите себя вверх. Для утяжеления используйте пояс с блином.",
    "instructions": {
      "keyPoints": [
        "Корпус наклонен вперед, ноги скрещены сзади",
        "Локти в стороны, а не вдоль корпуса",
        "Не опускайтесь слишком глубоко (боль в плечах)"
      ],
      "commonMistakes": [
        "Вертикальное положение тела (работает трицепс)",
        "Раскачивание",
        "Неполное выпрямление рук"
      ]
    },
    "alternatives": [
      {
        "id": "chest-barbell-flat",
        "priority": 1
      },
      {
        "id": "chest-dumbbell-flat",
        "priority": 2
      },
      {
        "id": "chest-dips-assisted",
        "priority": 3
      },
      {
        "id": "push-ups-weighted",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "push-ups",
    "name": {
      "ru": "Отжимания от пола",
      "en": "Push-ups"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "core",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "core",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "front_delt",
      "core"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Примите упор лежа, руки на ширине плеч или чуть шире, тело прямой линией от пяток до макушки. На вдохе согните локти, опуская грудь к полу, локти под 45°. На выдохе выжмите себя вверх. Для облегчения — с колен. Для усложнения — с утяжелением или ногами на возвышении.",
    "instructions": {
      "keyPoints": [
        "Корпус напряжен как струна, таз не провисает",
        "Локти не расходятся в стороны",
        "Полная амплитуда (грудь почти касается пола)"
      ],
      "commonMistakes": [
        "Провисший или поднятый таз",
        "Неполное опускание",
        "Голова опущена вниз"
      ]
    },
    "alternatives": [
      {
        "id": "chest-barbell-flat",
        "priority": 1
      },
      {
        "id": "chest-dumbbell-flat",
        "priority": 2
      },
      {
        "id": "chest-cable-flat",
        "priority": 3
      },
      {
        "id": "chest-machine-seated-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "core",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "push-ups-weighted",
    "name": {
      "ru": "Отжимания с весом (блин на спине)",
      "en": "Weighted Push-ups"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "core",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "core",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "front_delt",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Примите упор лежа как в обычных отжиманиях. Попросите напарника положить блин или рюкзак с весом на верхнюю часть спины (между лопаток). Выполняйте отжимания с полной амплитудой, сохраняя напряжение корпуса.",
    "instructions": {
      "keyPoints": [
        "Блин фиксирован и не смещается",
        "Спина остается прямой",
        "Опускайтесь медленно"
      ],
      "commonMistakes": [
        "Слишком большой вес (ломается техника)",
        "Провисание в пояснице",
        "Смещение блина на шею"
      ]
    },
    "alternatives": [
      {
        "id": "chest-dips-weighted",
        "priority": 1
      },
      {
        "id": "chest-barbell-flat",
        "priority": 2
      },
      {
        "id": "chest-hammer-flat",
        "priority": 3
      },
      {
        "id": "chest-smith-flat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "core",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "chest-cable-crossover",
    "name": {
      "ru": "Сведение рук в кроссовере (верхние блоки)",
      "en": "Cable Crossover"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "front_delt"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте между двумя верхними блоками, возьмитесь за D-рукояти. Сделайте шаг вперед, корпус слегка наклонен. Слегка согните локти. На выдохе сведите руки перед собой на уровне груди, сокращая грудь. Медленно вернитесь в исходное, чувствуя растяжение.",
    "instructions": {
      "keyPoints": [
        "Локти чуть согнуты на протяжении всего движения",
        "Сведение осуществляется за счет груди, а не плеч",
        "В конце амплитуды пауза 1 секунда"
      ],
      "commonMistakes": [
        "Полное выпрямление рук",
        "Рывковое движение",
        "Слишком большой вес (корпус уходит назад)"
      ]
    },
    "alternatives": [
      {
        "id": "chest-dumbbell-fly",
        "priority": 1
      },
      {
        "id": "chest-pec-deck",
        "priority": 2
      },
      {
        "id": "chest-cable-low-crossover",
        "priority": 3
      },
      {
        "id": "chest-cable-single-arm",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt"
    ]
  },
  {
    "id": "chest-cable-low-crossover",
    "name": {
      "ru": "Сведение рук в кроссовере (нижние блоки)",
      "en": "Low Cable Crossover"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "front_delt"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите блоки в нижнее положение. Возьмитесь за рукояти, встаньте между ними, сделайте шаг назад. Корпус наклонен вперед. Слегка согните локти и сведите руки перед собой вверх, как бы обнимая дерево. Акцент на нижнюю и среднюю часть груди.",
    "instructions": {
      "keyPoints": [
        "Движение снизу вверх по дуге",
        "Локти фиксированы",
        "Сокращение в верхней точке"
      ],
      "commonMistakes": [
        "Использование плеч",
        "Резкое движение",
        "Слишком широкий хват"
      ]
    },
    "alternatives": [
      {
        "id": "chest-dumbbell-fly",
        "priority": 1
      },
      {
        "id": "chest-cable-crossover",
        "priority": 2
      },
      {
        "id": "chest-pec-deck",
        "priority": 3
      },
      {
        "id": "chest-decline-barbell",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt"
    ]
  },
  {
    "id": "chest-dumbbell-fly",
    "name": {
      "ru": "Разводка гантелей лежа",
      "en": "Dumbbell Flyes"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "front_delt"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте на горизонтальную скамью, гантели над грудью, локти слегка согнуты. На вдохе разведите руки в стороны по дуге, опуская гантели до уровня груди (или чуть ниже), чувствуя растяжение. На выдохе сведите гантели обратно по той же дуге, как будто обнимаете бочку.",
    "instructions": {
      "keyPoints": [
        "Локти сохраняют легкий сгиб на протяжении всего движения",
        "Не разводите слишком широко (травма плеча)",
        "Движение только в плечевых суставах"
      ],
      "commonMistakes": [
        "Сгибание-разгибание локтей",
        "Слишком большой вес (переход в жим)",
        "Удар гантелей друг о друга"
      ]
    },
    "alternatives": [
      {
        "id": "chest-cable-crossover",
        "priority": 1
      },
      {
        "id": "chest-pec-deck",
        "priority": 2
      },
      {
        "id": "chest-cable-fly",
        "priority": 3
      },
      {
        "id": "chest-pullover",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt"
    ]
  },
  {
    "id": "chest-pec-deck",
    "name": {
      "ru": "Сведение рук в тренажере (бабочка)",
      "en": "Pec Deck Fly"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest"
    ],
    "appMuscleGroups": [
      "chest"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер, прижав спину к спинке. Предплечья уприте в подушки, локти на уровне плеч. На выдохе сведите подушки перед собой, сводя руки. В пике сократите грудь на 1-2 секунды. На вдохе медленно вернитесь в исходное, контролируя движение.",
    "instructions": {
      "keyPoints": [
        "Спина прижата, не отрывайтесь",
        "Движение плавное, без инерции",
        "В начальной точке чувствуйте растяжение груди"
      ],
      "commonMistakes": [
        "Рывковое сведение",
        "Отрыв спины от спинки",
        "Использование плеч для толчка"
      ]
    },
    "alternatives": [
      {
        "id": "chest-dumbbell-fly",
        "priority": 1
      },
      {
        "id": "chest-cable-crossover",
        "priority": 2
      },
      {
        "id": "chest-cable-low-crossover",
        "priority": 3
      },
      {
        "id": "chest-machine-converging",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest"
    ]
  },
  {
    "id": "chest-hammer-flat",
    "name": {
      "ru": "Жим в тренажере Хаммер (горизонтальный)",
      "en": "Hammer Strength Flat Press"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер, отрегулируйте сиденье так, чтобы рукоятки были на уровне середины груди. Прижмите спину. На выдохе выжмите рычаги вперед, сводя их в конце. На вдохе контролируемо верните, чувствуя растяжение. Рычажный механизм дает естественную траекторию.",
    "instructions": {
      "keyPoints": [
        "Лопатки прижаты к спинке",
        "Не блокируйте локти в конце",
        "Движение без рывков"
      ],
      "commonMistakes": [
        "Отрыв плеч от спинки",
        "Слишком быстрый возврат",
        "Неполное сведение рук"
      ]
    },
    "alternatives": [
      {
        "id": "chest-barbell-flat",
        "priority": 1
      },
      {
        "id": "chest-dumbbell-flat",
        "priority": 2
      },
      {
        "id": "chest-smith-flat",
        "priority": 3
      },
      {
        "id": "push-ups",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "triceps"
    ]
  },
  {
    "id": "chest-smith-flat",
    "name": {
      "ru": "Жим штанги лежа в тренажере Смита",
      "en": "Smith Machine Flat Press"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "front_delt"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Установите горизонтальную скамью в тренажере Смита. Лягте так, чтобы гриф опускался к нижней части груди. Снимите гриф поворотом запястий. Опускайте подконтрольно, выжимайте вертикально вверх. Траектория строго вертикальна, что упрощает технику.",
    "instructions": {
      "keyPoints": [
        "Не отрывайте таз, лопатки сведены",
        "Гриф движется по прямой линии",
        "Ноги устойчиво на полу"
      ],
      "commonMistakes": [
        "Опускание грифа к шее",
        "Выключение грудных мышц из-за вертикальной траектории",
        "Запрокидывание головы"
      ]
    },
    "alternatives": [
      {
        "id": "chest-barbell-flat",
        "priority": 1
      },
      {
        "id": "chest-hammer-flat",
        "priority": 2
      },
      {
        "id": "chest-dumbbell-flat",
        "priority": 3
      },
      {
        "id": "chest-machine-seated-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "chest-decline-barbell",
    "name": {
      "ru": "Жим штанги лежа на скамье с отрицательным наклоном",
      "en": "Decline Barbell Bench Press"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "front_delt"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Закрепите ноги на скамье с отрицательным наклоном (голова ниже ног). Лягте, снимите штангу. Опускайте гриф к нижней части груди. Угол смещает нагрузку на нижнюю часть груди и позволяет работать с большим весом из-за стабильности.",
    "instructions": {
      "keyPoints": [
        "Гриф опускается строго к мечевидному отростку",
        "Локти чуть уже, чем в горизонтальном жиме",
        "Ноги надежно зафиксированы"
      ],
      "commonMistakes": [
        "Опускание к шее",
        "Подъем таза",
        "Отсутствие контроля в нижней точке"
      ]
    },
    "alternatives": [
      {
        "id": "chest-dumbbell-decline",
        "priority": 1
      },
      {
        "id": "chest-dips",
        "priority": 2
      },
      {
        "id": "chest-cable-low-crossover",
        "priority": 3
      },
      {
        "id": "chest-machine-decline-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "chest-pullover",
    "name": {
      "ru": "Пуловер с гантелью (на грудь)",
      "en": "Dumbbell Pullover"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "lats",
      "triceps_long"
    ],
    "appMuscleGroups": [
      "back",
      "chest"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "lats",
      "triceps_long"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте поперек горизонтальной скамьи, только лопатки на скамье, голова свешена. Возьмите одну гантель за диск обеими руками, держите над грудью с согнутыми локтями. На вдохе опустите гантель за голову по дуге, растягивая грудные и широчайшие. На выдохе верните в исходное.",
    "instructions": {
      "keyPoints": [
        "Таз опущен, пресс напряжен",
        "Локти чуть согнуты, не разгибайте",
        "Амплитуда до ощущения легкого растяжения"
      ],
      "commonMistakes": [
        "Слишком тяжелая гантель (травма плеча)",
        "Разгибание локтей",
        "Прогиб в пояснице"
      ]
    },
    "alternatives": [
      {
        "id": "chest-cable-pullover",
        "priority": 1
      },
      {
        "id": "chest-dumbbell-fly",
        "priority": 2
      },
      {
        "id": "lat-pulldown-straight-arm",
        "priority": 3
      },
      {
        "id": "machine-pullover",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "lats",
      "triceps_long"
    ]
  },
  {
    "id": "chest-dips-assisted",
    "name": {
      "ru": "Отжимания на брусьях в гравитроне (с противовесом)",
      "en": "Assisted Dips on Graviton"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "front_delt"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте коленями или стопами на платформу гравитрона, возьмитесь за поручни. Настройте противовес. Наклоните корпус вперёд для акцента на грудь. Медленно опускайтесь, сгибая локти в стороны, до комфортной глубины. Мощно выжмите себя вверх.",
    "instructions": {
      "keyPoints": [
        "Корпус наклонён вперёд (20-30°)",
        "Локти разведены в стороны",
        "Постепенно уменьшайте противовес"
      ],
      "commonMistakes": [
        "Вертикальное положение тела",
        "Слишком большой противовес",
        "Раскачивание"
      ]
    },
    "alternatives": [
      {
        "id": "chest-dips",
        "priority": 1
      },
      {
        "id": "chest-dips-negative",
        "priority": 2
      },
      {
        "id": "push-ups",
        "priority": 3
      },
      {
        "id": "chest-machine-dips",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "chest-push-ups-knee",
    "name": {
      "ru": "Отжимания от пола с колен",
      "en": "Knee Push-ups"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "core",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "core",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "front_delt",
      "core"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте на колени, примите упор: руки на ширине плеч, тело от колен до головы образует прямую линию. Опускайте грудь к полу на вдохе, сгибая локти под 45°. На выдохе выжмите себя вверх.",
    "instructions": {
      "keyPoints": [
        "Таз не провисает и не поднимается",
        "Локти вдоль корпуса или чуть шире",
        "Полная амплитуда"
      ],
      "commonMistakes": [
        "Сгибание в пояснице",
        "Подъём таза вверх",
        "Отсутствие напряжения пресса"
      ]
    },
    "alternatives": [
      {
        "id": "push-ups",
        "priority": 1
      },
      {
        "id": "chest-dips-assisted",
        "priority": 2
      },
      {
        "id": "chest-smith-flat",
        "priority": 3
      },
      {
        "id": "chest-cable-flat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "core",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "chest-machine-seated-press",
    "name": {
      "ru": "Жим в рычажном тренажере (сидя)",
      "en": "Seated Chest Press Machine"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "front_delt"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер, отрегулируйте высоту сиденья так, чтобы рукоятки были на уровне середины груди. Прижмите спину и голову к спинке. Ноги плотно на полу. На выдохе выжмите рукоятки вперед, не блокируя локти в конце. На вдохе медленно вернитесь.",
    "instructions": {
      "keyPoints": [
        "Спина и затылок прижаты к спинке",
        "Локти не выпрямляются до конца",
        "Движение плавное"
      ],
      "commonMistakes": [
        "Отрыв плеч от спинки",
        "Использование инерции",
        "Слишком быстрый возврат"
      ]
    },
    "alternatives": [
      {
        "id": "chest-hammer-flat",
        "priority": 1
      },
      {
        "id": "chest-smith-flat",
        "priority": 2
      },
      {
        "id": "chest-barbell-flat",
        "priority": 3
      },
      {
        "id": "chest-dumbbell-flat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "chest-machine-decline-press",
    "name": {
      "ru": "Жим в тренажере с отрицательным наклоном",
      "en": "Decline Chest Press Machine"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "front_delt",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "shoulders",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps",
      "front_delt"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер с наклоном (голова ниже уровня груди). Ноги зафиксированы валиками. Возьмитесь за рукоятки. На выдохе выжмите вперед и немного вниз, акцентируя нагрузку на нижнюю часть груди. На вдохе верните.",
    "instructions": {
      "keyPoints": [
        "Таз прижат к сиденью",
        "Локти движутся по естественной дуге",
        "Полное сокращение в конечной точке"
      ],
      "commonMistakes": [
        "Отрыв корпуса от спинки",
        "Слишком широкий хват",
        "Рывковое движение"
      ]
    },
    "alternatives": [
      {
        "id": "chest-decline-barbell",
        "priority": 1
      },
      {
        "id": "chest-dips",
        "priority": 2
      },
      {
        "id": "chest-cable-low-crossover",
        "priority": 3
      },
      {
        "id": "chest-hammer-flat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "front_delt",
      "triceps"
    ]
  },
  {
    "id": "chest-machine-converging",
    "name": {
      "ru": "Жим в тренажере со сведением (конвергирующий)",
      "en": "Converging Chest Press Machine"
    },
    "sourceFile": "грудь.json",
    "sourceMuscle": "chest",
    "highLevelGroup": "грудь",
    "priorityMuscles": [
      "chest",
      "triceps"
    ],
    "appMuscleGroups": [
      "chest",
      "triceps"
    ],
    "primaryMuscles": [
      "chest"
    ],
    "secondaryMuscles": [
      "triceps"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте в тренажер с раздельными рычагами. В исходном положении рукоятки широко. На выдохе выжмите, сводя их перед собой — траектория такова, что в конце руки сходятся вместе. На вдохе вернитесь.",
    "instructions": {
      "keyPoints": [
        "Сведение рукояток в конце движения",
        "Лопатки прижаты к спинке",
        "Локти сохраняют легкий сгиб"
      ],
      "commonMistakes": [
        "Неполное сведение",
        "Рывковое движение",
        "Отрыв спины от спинки"
      ]
    },
    "alternatives": [
      {
        "id": "chest-dumbbell-flat",
        "priority": 1
      },
      {
        "id": "chest-pec-deck",
        "priority": 2
      },
      {
        "id": "chest-cable-crossover",
        "priority": 3
      },
      {
        "id": "chest-hammer-flat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "chest",
      "triceps"
    ]
  },
  {
    "id": "core-dead-bug",
    "name": {
      "ru": "Мертвый жук (кинетический контроль кора)",
      "en": "Dead Bug (Core Kinetic Control)"
    },
    "sourceFile": "кор.json",
    "sourceMuscle": "core",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "core",
      "hip_flexors",
      "lumbar",
      "rectus_abdominis"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "core"
    ],
    "secondaryMuscles": [
      "rectus_abdominis",
      "hip_flexors",
      "lumbar"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Исходное положение лежа на спине. Ноги согнуты под 90 градусов, голени параллельны полу. Руки вытянуты вертикально вверх. На выдохе одновременно опустите правую руку и левую ногу до касания пола, сохраняя поясницу прижатой. Вернитесь в центр. Повторите на другую сторону. Базовое упражнение для обучения межмышечной координации и стабилизации позвоночника.",
    "instructions": {
      "keyPoints": [
        "Поясница плотно прижата к полу",
        "Пресс статически напряжен",
        "Движение выполняется только за счет конечностей"
      ],
      "commonMistakes": [
        "Отрыв поясницы от пола",
        "Слишком высокая скорость",
        "Задержка дыхания на усилии"
      ]
    },
    "alternatives": [
      {
        "id": "core-plank-basic",
        "priority": 1
      },
      {
        "id": "core-bird-dog",
        "priority": 2
      },
      {
        "id": "core-pallof-press",
        "priority": 3
      },
      {
        "id": "core-hollow-hold",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "hip_flexors",
      "lumbar",
      "rectus_abdominis"
    ]
  },
  {
    "id": "core-hollow-hold",
    "name": {
      "ru": "Холлоу-холд (положение гимнастической «лодочки»)",
      "en": "Hollow Hold (Gymnastic Body Position)"
    },
    "sourceFile": "кор.json",
    "sourceMuscle": "core",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "core",
      "hip_flexors",
      "lumbar_stabilizers"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "core"
    ],
    "secondaryMuscles": [
      "hip_flexors",
      "lumbar_stabilizers"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте на спину, руки вытянуты за голову, ноги прямые. Активируйте кор, одновременно отрывая лопатки и ноги от пола. Тело принимает дугообразную форму, напоминающую полумесяц. Только зона поясницы сохраняет контакт с опорой. Статическое удержание является основой гимнастической подготовки и развивает жесткость передней цепи.",
    "instructions": {
      "keyPoints": [
        "Поясница прижата к полу",
        "Лопатки и пятки оторваны",
        "Корпус образует единую дугу"
      ],
      "commonMistakes": [
        "Прогиб в пояснице",
        "Чрезмерный подъем ног",
        "Сгибание коленей",
        "Опускание головы на грудь"
      ]
    },
    "alternatives": [
      {
        "id": "core-dead-bug",
        "priority": 1
      },
      {
        "id": "core-leg-lowers",
        "priority": 2
      },
      {
        "id": "core-plank-basic",
        "priority": 3
      },
      {
        "id": "core-hollow-rock",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "hip_flexors",
      "lumbar_stabilizers"
    ]
  },
  {
    "id": "core-leg-lowers",
    "name": {
      "ru": "Контролируемая эксцентрика ног (лежа)",
      "en": "Controlled Leg Lowers"
    },
    "sourceFile": "кор.json",
    "sourceMuscle": "core",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "core",
      "hip_flexors",
      "lower_rectus_abdominis"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "core"
    ],
    "secondaryMuscles": [
      "lower_rectus_abdominis",
      "hip_flexors"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Лягте на спину, поднимите прямые ноги перпендикулярно полу. Пресс напряжен. На выдохе начинайте максимально медленно опускать ноги к полу, сохраняя поясницу прижатой. Как только возникает отрыв поясницы или дискомфорт — зафиксируйте положение и верните ноги вверх. Упражнение развивает эксцентрическую силу глубоких слоев кора.",
    "instructions": {
      "keyPoints": [
        "Поясница прижата к полу без отрыва",
        "Ноги прямые, носки на себя",
        "Эксцентрическая фаза длится минимум 3-4 секунды"
      ],
      "commonMistakes": [
        "Отрыв поясницы от пола",
        "Сгибание коленей",
        "Слишком быстрое опускание ног",
        "Задержка дыхания"
      ]
    },
    "alternatives": [
      {
        "id": "core-dead-bug",
        "priority": 1
      },
      {
        "id": "core-hollow-hold",
        "priority": 2
      },
      {
        "id": "core-dragon-flag-negative",
        "priority": 3
      },
      {
        "id": "core-reverse-crunch",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "hip_flexors",
      "lower_rectus_abdominis"
    ]
  },
  {
    "id": "core-pallof-press",
    "name": {
      "ru": "Пресс Паллофа (анти-ротационный жим)",
      "en": "Pallof Press (Anti-Rotation Press)"
    },
    "sourceFile": "кор.json",
    "sourceMuscle": "core",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "core",
      "obliques",
      "shoulder_stabilizers"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "core"
    ],
    "secondaryMuscles": [
      "obliques",
      "shoulder_stabilizers"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Закрепите трос или резину на уровне груди. Встаньте боком к якорю, корпус прямо. Возьмитесь за рукоять двумя руками у груди. На выдохе выжмите рукоять перед собой, полностью выпрямляя руки. Зафиксируйте положение на 2-3 секунды, активно сопротивляясь вращению корпуса. Затем верните руки к груди. Ключевое анти-ротационное упражнение для функциональной стабильности.",
    "instructions": {
      "keyPoints": [
        "Корпус неподвижен — работает как монолит",
        "Ротация исключена, движение только в плечах",
        "Пресс напряжен на протяжении всего подхода"
      ],
      "commonMistakes": [
        "Поворот туловища вслед за рукоятью",
        "Слишком большой вес",
        "Сгибание коленей для компенсации",
        "Задержка дыхания"
      ]
    },
    "alternatives": [
      {
        "id": "core-landmine-anti-rotation",
        "priority": 1
      },
      {
        "id": "core-suitcase-carry",
        "priority": 2
      },
      {
        "id": "core-bird-dog",
        "priority": 3
      },
      {
        "id": "core-dead-bug",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "obliques",
      "shoulder_stabilizers"
    ]
  },
  {
    "id": "core-bird-dog",
    "name": {
      "ru": "Птица-собака (динамическая стабилизация позвоночника)",
      "en": "Bird Dog (Dynamic Spine Stabilization)"
    },
    "sourceFile": "кор.json",
    "sourceMuscle": "core",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "core",
      "glutes",
      "lumbar_multifidus",
      "shoulders"
    ],
    "appMuscleGroups": [
      "core",
      "glutes"
    ],
    "primaryMuscles": [
      "core"
    ],
    "secondaryMuscles": [
      "lumbar_multifidus",
      "glutes",
      "shoulders"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Примите положение четверенек: колени под тазобедренными суставами, кисти под плечами. На выдохе одновременно вытяните правую руку вперед и левую ногу назад до горизонтальной линии с корпусом. Задержитесь на 2-3 секунды в крайней точке, сохраняя нейтральное положение позвоночника. Медленно вернитесь. Чередуйте стороны. Базовое реабилитационное упражнение для глубоких мышц спины.",
    "instructions": {
      "keyPoints": [
        "Спина нейтральна — без прогиба и округления",
        "Таз неподвижен, не наклоняется",
        "Движение медленное, исключительно за счет конечностей"
      ],
      "commonMistakes": [
        "Чрезмерный прогиб в пояснице",
        "Поворот таза в сторону рабочей ноги",
        "Высокий темп выполнения",
        "Опущенная голова"
      ]
    },
    "alternatives": [
      {
        "id": "core-dead-bug",
        "priority": 1
      },
      {
        "id": "core-pallof-press",
        "priority": 2
      },
      {
        "id": "core-plank-basic",
        "priority": 3
      },
      {
        "id": "core-hollow-hold",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "lumbar_multifidus",
      "shoulders"
    ]
  },
  {
    "id": "core-dragon-flag",
    "name": {
      "ru": "Драконий флаг (продвинутый кор-контроль)",
      "en": "Dragon Flag (Advanced Core Control)"
    },
    "sourceFile": "кор.json",
    "sourceMuscle": "core",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "core",
      "glutes",
      "lumbar",
      "rectus_abdominis"
    ],
    "appMuscleGroups": [
      "core",
      "glutes"
    ],
    "primaryMuscles": [
      "core"
    ],
    "secondaryMuscles": [
      "rectus_abdominis",
      "glutes",
      "lumbar"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Лягте на скамью или мат, зафиксировав руки над головой за устойчивой опорой. На выдохе поднимите прямые ноги и таз вверх, отрывая позвоночник от опоры последовательно: сначала лопатки, затем средний отдел спины. Тело должно оказаться в вертикальной прямой линии. На вдохе контролируемо опуститесь в исходное положение. Упражнение высшего уровня сложности для продвинутых атлетов.",
    "instructions": {
      "keyPoints": [
        "Тело движется как единая прямая линия",
        "Подъем за счет кора, а не инерции",
        "Опускание в 2-3 раза медленнее подъема"
      ],
      "commonMistakes": [
        "Сгибание коленей",
        "Чрезмерный прогиб в пояснице",
        "Рывковое движение ногами",
        "Слишком быстрая отрицательная фаза"
      ]
    },
    "alternatives": [
      {
        "id": "core-leg-lowers",
        "priority": 1
      },
      {
        "id": "core-hollow-hold",
        "priority": 2
      },
      {
        "id": "core-reverse-crunch",
        "priority": 3
      },
      {
        "id": "core-dragon-flag-negative",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "lumbar",
      "rectus_abdominis"
    ]
  },
  {
    "id": "core-landmine-anti-rotation",
    "name": {
      "ru": "Анти-ротация в тренажере «земляная мина»",
      "en": "Landmine Anti-Rotation"
    },
    "sourceFile": "кор.json",
    "sourceMuscle": "core",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "core",
      "glutes",
      "obliques",
      "shoulders"
    ],
    "appMuscleGroups": [
      "core",
      "glutes"
    ],
    "primaryMuscles": [
      "core"
    ],
    "secondaryMuscles": [
      "obliques",
      "shoulders",
      "glutes"
    ],
    "equipmentRaw": [
      "machine"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Зафиксируйте один конец грифа в тренажере земляная мина или в углу стены. Встаньте боком к мине, удерживая свободный конец штанги двумя руками у груди. На выдохе выжмите штангу перед собой в полный вытяг рук, фиксируя корпус от вращения. Статически удерживайте положение 2-3 секунды. Медленно верните гриф к груди. Рычажная нагрузка создает мощный анти-ротационный стимул.",
    "instructions": {
      "keyPoints": [
        "Корпус как монолит — никакого вращения таза и плеч",
        "Рабочий угол: штанга параллельна полу в конце выпрямления",
        "Пресс напряжен постоянно"
      ],
      "commonMistakes": [
        "Поворот корпуса вслед за штангой",
        "Слишком большой вес",
        "Сгибание ног для компенсации",
        "Задержка дыхания"
      ]
    },
    "alternatives": [
      {
        "id": "core-pallof-press",
        "priority": 1
      },
      {
        "id": "core-suitcase-carry",
        "priority": 2
      },
      {
        "id": "core-bird-dog",
        "priority": 3
      },
      {
        "id": "core-farmer-walk",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "obliques",
      "shoulders"
    ]
  },
  {
    "id": "core-suitcase-carry",
    "name": {
      "ru": "Прогулка с асимметричным отягощением («чемоданчик»)",
      "en": "Suitcase Carry (Asymmetric Load Walk)"
    },
    "sourceFile": "кор.json",
    "sourceMuscle": "core",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "core",
      "forearms",
      "glutes",
      "obliques",
      "traps"
    ],
    "appMuscleGroups": [
      "biceps",
      "core",
      "glutes"
    ],
    "primaryMuscles": [
      "core"
    ],
    "secondaryMuscles": [
      "obliques",
      "forearms",
      "traps",
      "glutes"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Возьмите гантель или гирю в одну руку. Встаньте прямо, плечи на одном уровне — наклон корпуса в сторону веса исключен. Активируйте кор и ягодицы. Начинайте движение вперед медленными контролируемыми шагами. Боковые мышцы кора работают изометрически, противостоя наклону туловища в сторону груза. Проходите 20-40 метров на одну руку. Функциональное упражнение для анти-латеральной стабильности.",
    "instructions": {
      "keyPoints": [
        "Плечи строго на одном уровне, без асимметрии",
        "Взгляд прямо, голова нейтрально",
        "Шаг короткий и устойчивый, без спешки"
      ],
      "commonMistakes": [
        "Наклон корпуса в сторону веса",
        "Асимметрия плеч",
        "Слишком большой вес",
        "Быстрая ходьба с потерей контроля"
      ]
    },
    "alternatives": [
      {
        "id": "core-pallof-press",
        "priority": 1
      },
      {
        "id": "core-farmer-walk",
        "priority": 2
      },
      {
        "id": "core-landmine-anti-rotation",
        "priority": 3
      },
      {
        "id": "core-bird-dog",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "forearms",
      "glutes",
      "obliques",
      "traps"
    ]
  },
  {
    "id": "obliques-russian-twist",
    "name": {
      "ru": "Русский твист с весом",
      "en": "Russian Twist"
    },
    "sourceFile": "косые мышцы живота.json",
    "sourceMuscle": "abs_obliques",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_obliques",
      "abs_rectus",
      "hip_flexors"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_obliques"
    ],
    "secondaryMuscles": [
      "abs_rectus",
      "hip_flexors"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Сядьте на пол, ноги согнуты, пятки на полу (или поднимите для усложнения). Отклоните корпус назад под 45°, спина прямая. Возьмите гантель, диск или медицинбол двумя руками. На выдохе поворачивайте корпус вправо, не скручивая таз. Вернитесь в центр, затем влево. Движение происходит в грудном отделе позвоночника. Отлично прорабатывает косые мышцы живота.",
    "instructions": {
      "keyPoints": [
        "Корпус стабилен, работает только торс",
        "Ноги неподвижны, пятки прижаты к полу",
        "Скручивание в грудном отделе, а не пояснице"
      ],
      "commonMistakes": [
        "Круглая спина",
        "Вращение тазом",
        "Слишком большой вес (ломается техника)"
      ]
    },
    "alternatives": [
      {
        "id": "obliques-cable-woodchopper",
        "priority": 1
      },
      {
        "id": "obliques-side-bends",
        "priority": 2
      },
      {
        "id": "obliques-hanging-windshield-wipers",
        "priority": 3
      },
      {
        "id": "obliques-medicine-ball-twist",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_obliques",
      "abs_rectus",
      "hip_flexors"
    ]
  },
  {
    "id": "obliques-cable-woodchopper",
    "name": {
      "ru": "Дровосек на блоке (верхний блок)",
      "en": "Cable Woodchopper"
    },
    "sourceFile": "косые мышцы живота.json",
    "sourceMuscle": "abs_obliques",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_obliques",
      "abs_rectus",
      "shoulders"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_obliques"
    ],
    "secondaryMuscles": [
      "abs_rectus",
      "shoulders"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на верхний блок, прикрепите рукоять. Встаньте левым боком к блоку, ноги на ширине плеч. Возьмитесь за рукоять двумя руками. На выдохе тяните рукоять по диагонали вниз к правому бедру, скручивая корпус. В конце амплитуды максимально сократите косые мышцы. Медленно вернитесь. Повторите на другую сторону. Движение напоминает рубку дров.",
    "instructions": {
      "keyPoints": [
        "Движение за счет скручивания корпуса, а не рук",
        "Ноги устойчивы, таз неподвижен",
        "Контролируйте возврат"
      ],
      "commonMistakes": [
        "Использование только рук",
        "Поворот таза",
        "Слишком большой вес",
        "Рывковое движение"
      ]
    },
    "alternatives": [
      {
        "id": "obliques-russian-twist",
        "priority": 1
      },
      {
        "id": "obliques-cable-low-woodchopper",
        "priority": 2
      },
      {
        "id": "obliques-medicine-ball-woodchopper",
        "priority": 3
      },
      {
        "id": "obliques-side-bends",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_obliques",
      "abs_rectus",
      "shoulders"
    ]
  },
  {
    "id": "obliques-cable-low-woodchopper",
    "name": {
      "ru": "Дровосек на блоке (нижний блок)",
      "en": "Low Cable Woodchopper"
    },
    "sourceFile": "косые мышцы живота.json",
    "sourceMuscle": "abs_obliques",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_obliques",
      "abs_rectus",
      "shoulders"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_obliques"
    ],
    "secondaryMuscles": [
      "abs_rectus",
      "shoulders"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на нижний блок. Встаньте левым боком к блоку, ноги на ширине плеч. Возьмитесь за рукоять двумя руками. На выдохе тяните рукоять по диагонали вверх к правому плечу, скручивая корпус. В верхней точке максимально сократите косые мышцы. Медленно вернитесь. Повторите на другую сторону. Вариация дровосека, акцентирующая верхнюю часть косых мышц.",
    "instructions": {
      "keyPoints": [
        "Движение по диагонали снизу вверх",
        "Корпус скручивается, таз неподвижен",
        "Контролируемое движение"
      ],
      "commonMistakes": [
        "Использование рук",
        "Поворот таза",
        "Рывковое движение",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "obliques-cable-woodchopper",
        "priority": 1
      },
      {
        "id": "obliques-russian-twist",
        "priority": 2
      },
      {
        "id": "obliques-side-bends",
        "priority": 3
      },
      {
        "id": "obliques-medicine-ball-twist",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_obliques",
      "abs_rectus",
      "shoulders"
    ]
  },
  {
    "id": "obliques-side-bends",
    "name": {
      "ru": "Наклоны в стороны с гантелью",
      "en": "Side Bends"
    },
    "sourceFile": "косые мышцы живота.json",
    "sourceMuscle": "abs_obliques",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_obliques"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_obliques"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте прямо, ноги на ширине плеч. Возьмите гантель в одну руку, вторую руку на поясе или за головой. На выдохе наклонитесь в сторону с гантелью, не сгибая спину и не поворачивая корпус. Наклоняйтесь до ощущения растяжения. Вернитесь в исходное, сокращая косую мышцу. Выполните все повторения, затем поменяйте руку. Изолированное упражнение на косые мышцы.",
    "instructions": {
      "keyPoints": [
        "Наклон строго в сторону, без поворота и наклона вперед",
        "Спина прямая",
        "Движение плавное"
      ],
      "commonMistakes": [
        "Наклон вперед",
        "Использование бедер для рывка",
        "Слишком большой вес",
        "Быстрое движение"
      ]
    },
    "alternatives": [
      {
        "id": "obliques-dumbbell-side-bend",
        "priority": 1
      },
      {
        "id": "obliques-cable-side-bend",
        "priority": 2
      },
      {
        "id": "obliques-hanging-windshield-wipers",
        "priority": 3
      },
      {
        "id": "obliques-russian-twist",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_obliques"
    ]
  },
  {
    "id": "obliques-cable-side-bend",
    "name": {
      "ru": "Наклоны в стороны на блоке",
      "en": "Cable Side Bend"
    },
    "sourceFile": "косые мышцы живота.json",
    "sourceMuscle": "abs_obliques",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_obliques"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_obliques"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Установите трос на верхний или нижний блок, прикрепите D-рукоять. Встаньте боком к блоку, ноги на ширине плеч. Возьмитесь за рукоять двумя руками или одной. На выдохе наклонитесь в сторону блока, сгибаясь в пояснице, сохраняя спину прямой. Вернитесь в исходное, сокращая косую мышцу. Повторите на другую сторону. Трос создает постоянное напряжение.",
    "instructions": {
      "keyPoints": [
        "Наклон строго в сторону",
        "Спина прямая, таз неподвижен",
        "Движение плавное, без рывков"
      ],
      "commonMistakes": [
        "Наклон вперед или назад",
        "Использование бедер",
        "Слишком большой вес",
        "Быстрое движение"
      ]
    },
    "alternatives": [
      {
        "id": "obliques-side-bends",
        "priority": 1
      },
      {
        "id": "obliques-cable-woodchopper",
        "priority": 2
      },
      {
        "id": "obliques-russian-twist",
        "priority": 3
      },
      {
        "id": "obliques-hanging-windshield-wipers",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_obliques"
    ]
  },
  {
    "id": "obliques-hanging-windshield-wipers",
    "name": {
      "ru": "Дворники в висе (повороты ног)",
      "en": "Hanging Windshield Wipers"
    },
    "sourceFile": "косые мышцы живота.json",
    "sourceMuscle": "abs_obliques",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_obliques",
      "abs_rectus",
      "grip",
      "hip_flexors"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_obliques"
    ],
    "secondaryMuscles": [
      "abs_rectus",
      "hip_flexors",
      "grip"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Повисните на перекладине хватом сверху. Поднимите прямые ноги вверх до угла 90° (или выше). На выдохе поверните ноги вправо, как дворники, сохраняя угол в ногах. Вернитесь в центр, затем поверните влево. Движение происходит в пояснице и тазобедренном суставе. Очень сложное упражнение для косых мышц и кора. Начинайте с согнутых коленей.",
    "instructions": {
      "keyPoints": [
        "Корпус стабилен, не раскачивается",
        "Ноги держите вместе, угол фиксирован",
        "Повороты плавные, без рывков"
      ],
      "commonMistakes": [
        "Раскачивание корпуса",
        "Сгибание рук",
        "Слишком быстрые повороты",
        "Потеря контроля"
      ]
    },
    "alternatives": [
      {
        "id": "obliques-russian-twist",
        "priority": 1
      },
      {
        "id": "obliques-cable-woodchopper",
        "priority": 2
      },
      {
        "id": "obliques-side-plank",
        "priority": 3
      },
      {
        "id": "obliques-dead-bug",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_obliques",
      "abs_rectus",
      "grip",
      "hip_flexors"
    ]
  },
  {
    "id": "obliques-side-plank",
    "name": {
      "ru": "Боковая планка",
      "en": "Side Plank"
    },
    "sourceFile": "косые мышцы живота.json",
    "sourceMuscle": "abs_obliques",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_obliques",
      "abs_rectus",
      "glutes",
      "shoulders"
    ],
    "appMuscleGroups": [
      "core",
      "glutes"
    ],
    "primaryMuscles": [
      "abs_obliques"
    ],
    "secondaryMuscles": [
      "abs_rectus",
      "shoulders",
      "glutes"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Лягте на бок, упритесь на предплечье (локоть под плечом). Ноги прямые, стопы вместе или одна за другой. Поднимите таз вверх, чтобы тело образовало прямую линию от щиколоток до плеч. Напрягите косые мышцы и удерживайте положение максимальное время. Для утяжеления возьмите блин в свободную руку. Повторите на другой бок. Статическое упражнение для косых мышц и стабильности кора.",
    "instructions": {
      "keyPoints": [
        "Тело прямая линия",
        "Локоть под плечом",
        "Шея нейтральна, взгляд вперед"
      ],
      "commonMistakes": [
        "Прогиб или провисание таза",
        "Голова опущена или поднята",
        "Сгибание коленей",
        "Потеря равновесия"
      ]
    },
    "alternatives": [
      {
        "id": "obliques-side-plank-dips",
        "priority": 1
      },
      {
        "id": "obliques-russian-twist",
        "priority": 2
      },
      {
        "id": "obliques-cable-woodchopper",
        "priority": 3
      },
      {
        "id": "obliques-plank",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_obliques",
      "abs_rectus",
      "glutes",
      "shoulders"
    ]
  },
  {
    "id": "obliques-side-plank-dips",
    "name": {
      "ru": "Боковая планка с опусканием таза",
      "en": "Side Plank Dips"
    },
    "sourceFile": "косые мышцы живота.json",
    "sourceMuscle": "abs_obliques",
    "highLevelGroup": "пресс/кор",
    "priorityMuscles": [
      "abs_obliques",
      "shoulders"
    ],
    "appMuscleGroups": [
      "core"
    ],
    "primaryMuscles": [
      "abs_obliques"
    ],
    "secondaryMuscles": [
      "shoulders"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Примите положение боковой планки на предплечье или прямой руке. Медленно опустите таз вниз к полу, затем поднимите обратно в планку. Движение повторяется без касания тазом пола. Динамический вариант боковой планки, добавляющий нагрузку на косые мышцы. Для утяжеления используйте блин на тазу.",
    "instructions": {
      "keyPoints": [
        "Опускание и подъем только за счет косых мышц",
        "Корпус остается в одной плоскости",
        "Движение плавное"
      ],
      "commonMistakes": [
        "Поворот корпуса",
        "Слишком быстрое движение",
        "Потеря равновесия",
        "Сгибание коленей"
      ]
    },
    "alternatives": [
      {
        "id": "obliques-side-plank",
        "priority": 1
      },
      {
        "id": "obliques-russian-twist",
        "priority": 2
      },
      {
        "id": "obliques-cable-woodchopper",
        "priority": 3
      },
      {
        "id": "obliques-hanging-windshield-wipers",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "abs_obliques",
      "shoulders"
    ]
  },
  {
    "id": "forearms-wrist-curl-barbell",
    "name": {
      "ru": "Сгибание запястий со штангой (сидя)",
      "en": "Barbell Wrist Curl"
    },
    "sourceFile": "предплечья.json",
    "sourceMuscle": "forearms",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "forearms"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте на скамью, предплечья уприте в бедра, кисти свисают за колени, ладони вверх. Возьмите штангу хватом снизу. На выдохе согните запястья вверх, максимально сокращая сгибатели предплечий. Задержитесь на секунду. Медленно опустите вес вниз, чувствуя растяжение. Движение только в лучезапястных суставах.",
    "instructions": {
      "keyPoints": [
        "Предплечья плотно лежат на бедрах на протяжении всего движения",
        "Амплитуда полная: от растяжения до максимального сокращения",
        "Не помогайте плечами"
      ],
      "commonMistakes": [
        "Отрыв предплечий от бедер",
        "Использование плеч для рывка",
        "Слишком большой вес (короткая амплитуда)"
      ]
    },
    "alternatives": [
      {
        "id": "forearms-reverse-wrist-curl",
        "priority": 1
      },
      {
        "id": "forearms-wrist-curl-dumbbell",
        "priority": 2
      },
      {
        "id": "forearms-cable-wrist-curl",
        "priority": 3
      },
      {
        "id": "forearms-gripper",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "forearms"
    ]
  },
  {
    "id": "forearms-reverse-wrist-curl",
    "name": {
      "ru": "Обратное сгибание запястий со штангой",
      "en": "Reverse Barbell Wrist Curl"
    },
    "sourceFile": "предплечья.json",
    "sourceMuscle": "forearms",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "forearms"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте на скамью, предплечья уприте в бедра, кисти свисают, ладони вниз. Возьмите штангу хватом сверху. На выдохе разогните запястья вверх, поднимая штангу, максимально сокращая разгибатели предплечий. Задержитесь на секунду. Медленно опустите. Упражнение развивает разгибатели запястья и укрепляет хват.",
    "instructions": {
      "keyPoints": [
        "Предплечья плотно лежат на бедрах",
        "Движение только в запястьях",
        "Опускание медленное, под контролем"
      ],
      "commonMistakes": [
        "Отрыв предплечий от бедер",
        "Рывковое движение",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "forearms-wrist-curl-barbell",
        "priority": 1
      },
      {
        "id": "forearms-reverse-wrist-curl-dumbbell",
        "priority": 2
      },
      {
        "id": "forearms-wrist-roller",
        "priority": 3
      },
      {
        "id": "forearms-cable-reverse-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "forearms"
    ]
  },
  {
    "id": "forearms-wrist-curl-dumbbell",
    "name": {
      "ru": "Сгибание запястий с гантелью (сидя)",
      "en": "Dumbbell Wrist Curl"
    },
    "sourceFile": "предплечья.json",
    "sourceMuscle": "forearms",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "forearms"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте на скамью, возьмите гантель в одну руку. Предплечье уприте в бедро ладонью вверх, кисть свисает. На выдохе согните запястье вверх, сокращая сгибатели. Медленно опустите. Повторите на другую руку. Гантель позволяет работать каждой рукой отдельно и исправлять дизбаланс.",
    "instructions": {
      "keyPoints": [
        "Предплечье плотно лежит на бедре",
        "Полная амплитуда",
        "Движение только в запястье"
      ],
      "commonMistakes": [
        "Отрыв предплечья от бедра",
        "Использование плеча",
        "Слишком большой вес",
        "Рывковое движение"
      ]
    },
    "alternatives": [
      {
        "id": "forearms-wrist-curl-barbell",
        "priority": 1
      },
      {
        "id": "forearms-reverse-wrist-curl",
        "priority": 2
      },
      {
        "id": "forearms-cable-wrist-curl",
        "priority": 3
      },
      {
        "id": "forearms-gripper",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "forearms"
    ]
  },
  {
    "id": "forearms-reverse-wrist-curl-dumbbell",
    "name": {
      "ru": "Обратное сгибание запястий с гантелью",
      "en": "Reverse Dumbbell Wrist Curl"
    },
    "sourceFile": "предплечья.json",
    "sourceMuscle": "forearms",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "forearms"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "forearms"
    ],
    "secondaryMuscles": [],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Сядьте на скамью, возьмите гантель в одну руку. Предплечье уприте в бедро ладонью вниз, кисть свисает. На выдохе разогните запястье вверх, поднимая гантель. Медленно опустите. Повторите на другую руку. Развивает разгибатели запястья, важно для хвата и стабильности.",
    "instructions": {
      "keyPoints": [
        "Предплечье плотно лежит на бедре",
        "Движение только в запястье",
        "Контроль на всем протяжении"
      ],
      "commonMistakes": [
        "Отрыв предплечья от бедра",
        "Рывковое движение",
        "Слишком большой вес"
      ]
    },
    "alternatives": [
      {
        "id": "forearms-reverse-wrist-curl",
        "priority": 1
      },
      {
        "id": "forearms-wrist-curl-dumbbell",
        "priority": 2
      },
      {
        "id": "forearms-wrist-roller",
        "priority": 3
      },
      {
        "id": "forearms-cable-reverse-curl",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "forearms"
    ]
  },
  {
    "id": "forearms-wrist-roller",
    "name": {
      "ru": "Вращение кистей с роликом (вист-роллер)",
      "en": "Wrist Roller"
    },
    "sourceFile": "предплечья.json",
    "sourceMuscle": "forearms",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "forearms",
      "grip"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "forearms"
    ],
    "secondaryMuscles": [
      "grip"
    ],
    "equipmentRaw": [
      "machine",
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell",
      "machine"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Возьмите вист-роллер — палку с веревкой, на конце которой подвешен груз. Вытяните руки перед собой на ширине плеч. Вращательными движениями кистей наматывайте веревку на палку, поднимая груз вверх. Затем плавно разматывайте, опуская груз вниз. Упражнение комплексно развивает сгибатели и разгибатели запястий.",
    "instructions": {
      "keyPoints": [
        "Руки вытянуты вперед, не сгибайте локти",
        "Вращение только кистями, не плечами",
        "Движение плавное, без рывков"
      ],
      "commonMistakes": [
        "Сгибание рук в локтях",
        "Использование плеч для вращения",
        "Слишком большой вес",
        "Быстрое движение"
      ]
    },
    "alternatives": [
      {
        "id": "forearms-gripper",
        "priority": 1
      },
      {
        "id": "forearms-wrist-curl-barbell",
        "priority": 2
      },
      {
        "id": "forearms-reverse-wrist-curl",
        "priority": 3
      },
      {
        "id": "forearms-farmer-walk",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "forearms",
      "grip"
    ]
  },
  {
    "id": "forearms-farmer-walk",
    "name": {
      "ru": "Фермерская прогулка (удержание веса)",
      "en": "Farmer‘s Walk"
    },
    "sourceFile": "предплечья.json",
    "sourceMuscle": "forearms",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "core",
      "forearms",
      "grip",
      "traps"
    ],
    "appMuscleGroups": [
      "biceps",
      "core"
    ],
    "primaryMuscles": [
      "forearms"
    ],
    "secondaryMuscles": [
      "grip",
      "traps",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Возьмите в каждую руку тяжелую гантель или гирю. Встаньте прямо, плечи отведите назад, пресс напряжен. Медленно идите вперед, сохраняя корпус прямым и неподвижным. Пройдите заданное расстояние (обычно 20-40 метров) или время. Упражнение развивает хват, укрепляет кисти и предплечья.",
    "instructions": {
      "keyPoints": [
        "Плечи отведены назад, лопатки сведены",
        "Корпус прямой, не наклоняйтесь",
        "Дыхание ровное, не задерживайте"
      ],
      "commonMistakes": [
        "Наклон корпуса вперед",
        "Слишком большой вес (разрушается техника)",
        "Раскачивание корпуса",
        "Сгибание рук в локтях"
      ]
    },
    "alternatives": [
      {
        "id": "forearms-gripper",
        "priority": 1
      },
      {
        "id": "forearms-wrist-roller",
        "priority": 2
      },
      {
        "id": "forearms-dead-hang",
        "priority": 3
      },
      {
        "id": "forearms-wrist-curl-barbell",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "forearms",
      "grip",
      "traps"
    ]
  },
  {
    "id": "forearms-dead-hang",
    "name": {
      "ru": "Вис на перекладине на время",
      "en": "Dead Hang"
    },
    "sourceFile": "предплечья.json",
    "sourceMuscle": "forearms",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "forearms",
      "grip",
      "lats",
      "shoulders"
    ],
    "appMuscleGroups": [
      "back",
      "biceps"
    ],
    "primaryMuscles": [
      "forearms"
    ],
    "secondaryMuscles": [
      "grip",
      "lats",
      "shoulders"
    ],
    "equipmentRaw": [
      "bodyweight"
    ],
    "equipment": [
      "bodyweight"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Повисните на перекладине хватом сверху на ширине плеч. Руки полностью выпрямлены, ноги не касаются пола. Расслабьте плечи, корпус прямой. Висите максимальное время, удерживая вес тела. Укрепляет хват, выносливость предплечий и пальцев. По мере прогресса увеличивайте время виса.",
    "instructions": {
      "keyPoints": [
        "Руки полностью выпрямлены",
        "Плечи расслаблены, не поднимайте их к ушам",
        "Дышите ровно"
      ],
      "commonMistakes": [
        "Сгибание рук в локтях",
        "Раскачивание корпуса",
        "Задержка дыхания",
        "Слишком широкий хват"
      ]
    },
    "alternatives": [
      {
        "id": "forearms-gripper",
        "priority": 1
      },
      {
        "id": "forearms-farmer-walk",
        "priority": 2
      },
      {
        "id": "forearms-wrist-roller",
        "priority": 3
      },
      {
        "id": "forearms-towel-hang",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "forearms",
      "grip",
      "lats",
      "shoulders"
    ]
  },
  {
    "id": "forearms-gripper",
    "name": {
      "ru": "Сжатие кистевого эспандера",
      "en": "Gripper"
    },
    "sourceFile": "предплечья.json",
    "sourceMuscle": "forearms",
    "highLevelGroup": "руки",
    "priorityMuscles": [
      "forearms",
      "grip"
    ],
    "appMuscleGroups": [
      "biceps"
    ],
    "primaryMuscles": [
      "forearms"
    ],
    "secondaryMuscles": [
      "grip"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Возьмите кистевой эспандер (резиновое кольцо, пружинный тренажер или неопреновый мяч). С силой сожмите его в ладони, полностью сокращая сгибатели пальцев и предплечий. Удерживайте сжатие 1-2 секунды, затем медленно разожмите. Повторяйте до усталости. Удобно для тренировки в любое время, укрепляет хват.",
    "instructions": {
      "keyPoints": [
        "Сжатие максимальное, с усилием",
        "Удерживайте сокращение",
        "Медленное разжимание"
      ],
      "commonMistakes": [
        "Неполное сжатие",
        "Слишком быстрое движение",
        "Слабый эспандер (нет прогресса)"
      ]
    },
    "alternatives": [
      {
        "id": "forearms-dead-hang",
        "priority": 1
      },
      {
        "id": "forearms-farmer-walk",
        "priority": 2
      },
      {
        "id": "forearms-wrist-roller",
        "priority": 3
      },
      {
        "id": "forearms-wrist-curl-barbell",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "forearms",
      "grip"
    ]
  },
  {
    "id": "glutes-barbell-hip-thrust",
    "name": {
      "ru": "Ягодичный мост со штангой (хип-траст)",
      "en": "Barbell Hip Thrust"
    },
    "sourceFile": "ягодицы.json",
    "sourceMuscle": "glutes",
    "highLevelGroup": "ягодицы",
    "priorityMuscles": [
      "core",
      "glutes",
      "hamstrings"
    ],
    "appMuscleGroups": [
      "core",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Сядьте на пол, спиной упритесь в скамью. Штангу положите на тазовые кости (через мягкий валик или коврик). Согните ноги, стопы плотно на полу. На выдохе мощно вытолкните таз вверх, поднимая штангу, сокращая ягодицы в верхней точке. Корпус и бедра образуют прямую линию. Медленно опуститесь, не касаясь ягодицами пола. Лучшее упражнение для ягодиц.",
    "instructions": {
      "keyPoints": [
        "В верхней точке корпус параллелен полу",
        "Подбородок прижат к груди, взгляд вперед",
        "Ноги на ширине таза, стопы чуть развернуты"
      ],
      "commonMistakes": [
        "Прогиб в пояснице в верхней точке (переразгибание)",
        "Отрыв лопаток от скамьи",
        "Движение за счет ног, а не ягодиц"
      ]
    },
    "alternatives": [
      {
        "id": "glutes-bridge",
        "priority": 1
      },
      {
        "id": "glutes-cable-hip-thrust",
        "priority": 2
      },
      {
        "id": "glutes-dumbbell-hip-thrust",
        "priority": 3
      },
      {
        "id": "glutes-single-leg-hip-thrust",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "hamstrings"
    ]
  },
  {
    "id": "glutes-bridge",
    "name": {
      "ru": "Ягодичный мостик (с весом или без)",
      "en": "Glute Bridge"
    },
    "sourceFile": "ягодицы.json",
    "sourceMuscle": "glutes",
    "highLevelGroup": "ягодицы",
    "priorityMuscles": [
      "core",
      "glutes",
      "hamstrings"
    ],
    "appMuscleGroups": [
      "core",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "core"
    ],
    "equipmentRaw": [
      "bodyweight",
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "bodyweight",
      "dumbbell"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Лягте на спину, ноги согнуты, стопы на полу на ширине плеч. Руки вдоль тела. На выдохе мощно вытолкните таз вверх, сокращая ягодицы. В верхней точке тело образует прямую линию от плеч до колен. Задержитесь на секунду, затем медленно опуститесь. Для утяжеления положите блин на таз. Упражнение для новичков и для добивки после хип-трастов.",
    "instructions": {
      "keyPoints": [
        "Движение только таза, поясница не прогибается",
        "Стопы плотно прижаты к полу",
        "Сокращайте ягодицы в верхней точке"
      ],
      "commonMistakes": [
        "Прогиб в пояснице",
        "Отрыв стоп от пола",
        "Использование ног вместо ягодиц"
      ]
    },
    "alternatives": [
      {
        "id": "glutes-barbell-hip-thrust",
        "priority": 1
      },
      {
        "id": "glutes-single-leg-bridge",
        "priority": 2
      },
      {
        "id": "glutes-cable-hip-thrust",
        "priority": 3
      },
      {
        "id": "glutes-dumbbell-hip-thrust",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "hamstrings"
    ]
  },
  {
    "id": "glutes-single-leg-hip-thrust",
    "name": {
      "ru": "Ягодичный мост на одной ноге",
      "en": "Single Leg Hip Thrust"
    },
    "sourceFile": "ягодицы.json",
    "sourceMuscle": "glutes",
    "highLevelGroup": "ягодицы",
    "priorityMuscles": [
      "core",
      "glutes",
      "hamstrings"
    ],
    "appMuscleGroups": [
      "core",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "core"
    ],
    "equipmentRaw": [
      "bodyweight",
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "bodyweight",
      "dumbbell"
    ],
    "difficulty": "advanced",
    "difficultyScore": 4,
    "description": "Исходное положение как в ягодичном мостике, но одна нога выпрямлена или поднята. Выполняйте подъем таза только одной ногой. Вторая нога может быть на весу или согнута в колене. Упражнение устраняет дисбаланс и увеличивает нагрузку на ягодицу рабочей ноги. Для утяжеления используйте блин или гантель на тазу.",
    "instructions": {
      "keyPoints": [
        "Таз не перекашивается в стороны",
        "Рабочая стопа плотно прижата к полу",
        "Движение медленное, контролируемое"
      ],
      "commonMistakes": [
        "Поворот таза в сторону опорной ноги",
        "Потеря равновесия",
        "Неполное выпрямление таза"
      ]
    },
    "alternatives": [
      {
        "id": "glutes-barbell-hip-thrust",
        "priority": 1
      },
      {
        "id": "glutes-bridge",
        "priority": 2
      },
      {
        "id": "glutes-cable-hip-thrust",
        "priority": 3
      },
      {
        "id": "glutes-dumbbell-hip-thrust",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "hamstrings"
    ]
  },
  {
    "id": "glutes-bulgarian-split-squat",
    "name": {
      "ru": "Болгарские выпады (акцент на ягодицы)",
      "en": "Bulgarian Split Squat"
    },
    "sourceFile": "ягодицы.json",
    "sourceMuscle": "glutes",
    "highLevelGroup": "ягодицы",
    "priorityMuscles": [
      "core",
      "glutes",
      "hamstrings",
      "quads"
    ],
    "appMuscleGroups": [
      "core",
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "quads",
      "hamstrings",
      "core"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте спиной к скамье, носок одной ноги на скамье. Передняя нога на полу. Возьмите гантели в руки. На вдохе опускайтесь, сгибая переднее колено, пока оно не согнется до 90°, заднее колено почти касается пола. Корпус слегка наклонен вперед для акцента на ягодицы. На выдохе выпрямитесь, сокращая ягодицу передней ноги.",
    "instructions": {
      "keyPoints": [
        "Широкий шаг для акцента на ягодицы",
        "Колено передней ноги не выходит за носок",
        "Вес на пятке передней ноги"
      ],
      "commonMistakes": [
        "Короткий шаг (акцент на квадрицепсы)",
        "Наклон корпуса слишком сильный",
        "Колено уходит за носок"
      ]
    },
    "alternatives": [
      {
        "id": "glutes-lunges",
        "priority": 1
      },
      {
        "id": "glutes-step-ups",
        "priority": 2
      },
      {
        "id": "glutes-barbell-squat",
        "priority": 3
      },
      {
        "id": "glutes-hack-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "hamstrings",
      "quads"
    ]
  },
  {
    "id": "glutes-step-ups",
    "name": {
      "ru": "Зашагивания на платформу",
      "en": "Step Ups"
    },
    "sourceFile": "ягодицы.json",
    "sourceMuscle": "glutes",
    "highLevelGroup": "ягодицы",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "quads"
    ],
    "appMuscleGroups": [
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "quads",
      "hamstrings"
    ],
    "equipmentRaw": [
      "free_weights",
      "bodyweight"
    ],
    "equipment": [
      "barbell",
      "bodyweight",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Встаньте перед платформой или скамьей высотой 30-50 см. Возьмите гантели или гири. Поставьте одну ногу на платформу, полностью на стопу. На выдохе выпрямите ногу, поднимаясь на платформу, без отталкивания второй ногой. В верхней точке полностью выпрямитесь и сократите ягодицу. Медленно опуститесь. Затем повторите с другой ноги.",
    "instructions": {
      "keyPoints": [
        "Вес на пятке рабочей ноги",
        "Корпус слегка наклонен вперед для акцента на ягодицы",
        "Не отталкивайтесь второй ногой"
      ],
      "commonMistakes": [
        "Отталкивание задней ногой",
        "Пятка рабочей ноги отрывается от платформы",
        "Слишком высокая платформа",
        "Колено уходит за носок"
      ]
    },
    "alternatives": [
      {
        "id": "glutes-bulgarian-split-squat",
        "priority": 1
      },
      {
        "id": "glutes-lunges",
        "priority": 2
      },
      {
        "id": "glutes-barbell-squat",
        "priority": 3
      },
      {
        "id": "glutes-leg-press",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "quads"
    ]
  },
  {
    "id": "glutes-lunges",
    "name": {
      "ru": "Выпады (акцент на ягодицы)",
      "en": "Lunges"
    },
    "sourceFile": "ягодицы.json",
    "sourceMuscle": "glutes",
    "highLevelGroup": "ягодицы",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "quads"
    ],
    "appMuscleGroups": [
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "quads",
      "hamstrings"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Стоя с гантелями, сделайте широкий шаг вперед. Опустите таз, пока оба колена не согнутся под 90°. Переднее колено над щиколоткой, заднее почти касается пола. Корпус слегка наклонен вперед для акцента на ягодицы. Оттолкнитесь передней пяткой и вернитесь в исходное. Для шагающих выпадов продолжайте движение по залу.",
    "instructions": {
      "keyPoints": [
        "Широкий шаг для акцента на ягодицы",
        "Колено передней ноги не выходит за носок",
        "Вес на пятке передней ноги"
      ],
      "commonMistakes": [
        "Короткий шаг (акцент на квадрицепсы)",
        "Падение корпуса вперед",
        "Сведение коленей внутрь"
      ]
    },
    "alternatives": [
      {
        "id": "glutes-bulgarian-split-squat",
        "priority": 1
      },
      {
        "id": "glutes-step-ups",
        "priority": 2
      },
      {
        "id": "glutes-reverse-lunges",
        "priority": 3
      },
      {
        "id": "glutes-barbell-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "quads"
    ]
  },
  {
    "id": "glutes-reverse-lunges",
    "name": {
      "ru": "Обратные выпады (акцент на ягодицы)",
      "en": "Reverse Lunges"
    },
    "sourceFile": "ягодицы.json",
    "sourceMuscle": "glutes",
    "highLevelGroup": "ягодицы",
    "priorityMuscles": [
      "glutes",
      "hamstrings",
      "quads"
    ],
    "appMuscleGroups": [
      "glutes",
      "hamstrings",
      "quadriceps"
    ],
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "quads",
      "hamstrings"
    ],
    "equipmentRaw": [
      "free_weights"
    ],
    "equipment": [
      "barbell",
      "dumbbell"
    ],
    "difficulty": "intermediate",
    "difficultyScore": 3,
    "description": "Стоя с гантелями, сделайте широкий шаг назад одной ногой. Опустите таз, пока переднее колено не согнется до 90°, заднее почти касается пола. Корпус слегка наклонен вперед. Оттолкнитесь передней ногой и вернитесь в исходное. Обратные выпады меньше нагружают колени и лучше изолируют ягодицы передней ноги.",
    "instructions": {
      "keyPoints": [
        "Широкий шаг назад",
        "Вес на пятке передней ноги",
        "Колено передней ноги не выходит за носок"
      ],
      "commonMistakes": [
        "Короткий шаг назад",
        "Наклон корпуса вперед слишком сильный",
        "Сведение коленей внутрь",
        "Потеря равновесия"
      ]
    },
    "alternatives": [
      {
        "id": "glutes-lunges",
        "priority": 1
      },
      {
        "id": "glutes-bulgarian-split-squat",
        "priority": 2
      },
      {
        "id": "glutes-step-ups",
        "priority": 3
      },
      {
        "id": "glutes-barbell-squat",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings",
      "quads"
    ]
  },
  {
    "id": "glutes-cable-kickback",
    "name": {
      "ru": "Махи ногой назад на блоке",
      "en": "Cable Glute Kickback"
    },
    "sourceFile": "ягодицы.json",
    "sourceMuscle": "glutes",
    "highLevelGroup": "ягодицы",
    "priorityMuscles": [
      "glutes",
      "hamstrings"
    ],
    "appMuscleGroups": [
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings"
    ],
    "equipmentRaw": [
      "cable"
    ],
    "equipment": [
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Установите трос на нижний блок, прикрепите манжету для лодыжки. Встаньте лицом к блоку, упритесь руками в стойку. Зафиксируйте манжету на лодыжке. На выдохе отведите ногу назад, полностью выпрямляя ее, и сократите ягодицу в верхней точке. Корпус неподвижен. Медленно верните ногу вперед, не касаясь пола. Идеальное изолирующее упражнение для ягодиц.",
    "instructions": {
      "keyPoints": [
        "Корпус неподвижен, спина прямая",
        "Движение строго назад, без поворота таза",
        "В верхней точке максимальное сокращение ягодицы"
      ],
      "commonMistakes": [
        "Использование спины для рывка",
        "Поворот таза в сторону",
        "Слишком большой вес",
        "Сгибание ноги в колене"
      ]
    },
    "alternatives": [
      {
        "id": "glutes-donkey-kick",
        "priority": 1
      },
      {
        "id": "glutes-band-kickback",
        "priority": 2
      },
      {
        "id": "glutes-barbell-hip-thrust",
        "priority": 3
      },
      {
        "id": "glutes-bridge",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "glutes",
      "hamstrings"
    ]
  },
  {
    "id": "glutes-donkey-kick",
    "name": {
      "ru": "Махи ногой назад стоя на четвереньках",
      "en": "Donkey Kick"
    },
    "sourceFile": "ягодицы.json",
    "sourceMuscle": "glutes",
    "highLevelGroup": "ягодицы",
    "priorityMuscles": [
      "core",
      "glutes",
      "hamstrings"
    ],
    "appMuscleGroups": [
      "core",
      "glutes",
      "hamstrings"
    ],
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "hamstrings",
      "core"
    ],
    "equipmentRaw": [
      "bodyweight",
      "cable"
    ],
    "equipment": [
      "bodyweight",
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте на четвереньки, руки под плечами, колени под тазом. Спина прямая. На выдохе поднимите одну ногу, согнутую в колене, вверх, пока бедро не станет параллельно полу или выше. Пятка смотрит в потолок. В верхней точке максимально сократите ягодицу. Медленно опустите, не касаясь коленом пола. Можно выполнять с манжетой на блоке для утяжеления.",
    "instructions": {
      "keyPoints": [
        "Спина прямая, не прогибайтесь в пояснице",
        "Движение только ногой, корпус неподвижен",
        "В верхней точке пауза 1-2 секунды"
      ],
      "commonMistakes": [
        "Прогиб в пояснице",
        "Поворот таза",
        "Слишком быстрое движение",
        "Сгибание спины"
      ]
    },
    "alternatives": [
      {
        "id": "glutes-cable-kickback",
        "priority": 1
      },
      {
        "id": "glutes-fire-hydrant",
        "priority": 2
      },
      {
        "id": "glutes-band-kickback",
        "priority": 3
      },
      {
        "id": "glutes-barbell-hip-thrust",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "hamstrings"
    ]
  },
  {
    "id": "glutes-fire-hydrant",
    "name": {
      "ru": "Отведение ноги в сторону стоя на четвереньках",
      "en": "Fire Hydrant"
    },
    "sourceFile": "ягодицы.json",
    "sourceMuscle": "glutes",
    "highLevelGroup": "ягодицы",
    "priorityMuscles": [
      "core",
      "glutes",
      "hip_abductors"
    ],
    "appMuscleGroups": [
      "core",
      "glutes"
    ],
    "primaryMuscles": [
      "glutes"
    ],
    "secondaryMuscles": [
      "core",
      "hip_abductors"
    ],
    "equipmentRaw": [
      "bodyweight",
      "cable"
    ],
    "equipment": [
      "bodyweight",
      "machine"
    ],
    "difficulty": "beginner",
    "difficultyScore": 2,
    "description": "Встаньте на четвереньки, руки под плечами, колени под тазом. На выдохе поднимите согнутую ногу в сторону до уровня бедра, сохраняя колено согнутым под 90°. В верхней точке сократите ягодицу. Медленно опустите. Упражнение развивает среднюю и малую ягодичные мышцы, улучшает стабильность таза. Можно выполнять с манжетой на блоке для утяжеления.",
    "instructions": {
      "keyPoints": [
        "Спина прямая, таз неподвижен",
        "Колено сохраняет угол 90° на протяжении движения",
        "Движение только в тазобедренном суставе"
      ],
      "commonMistakes": [
        "Наклон корпуса в сторону",
        "Поворот таза",
        "Слишком быстрое движение",
        "Сгибание спины"
      ]
    },
    "alternatives": [
      {
        "id": "glutes-cable-abduction",
        "priority": 1
      },
      {
        "id": "glutes-donkey-kick",
        "priority": 2
      },
      {
        "id": "glutes-band-abduction",
        "priority": 3
      },
      {
        "id": "glutes-clamshell",
        "priority": 4
      }
    ],
    "muscleGroups": [
      "core",
      "glutes",
      "hip_abductors"
    ]
  }
];


const UNIFIED_EXERCISE_ALIASES: Record<string, string> = {
  'barbell-squat': 'quads-barbell-squat',
  squat: 'quads-barbell-squat',
  'front-squat': 'quads-front-squat',
  'goblet-squat': 'quads-goblet-squat',
  'leg-press': 'quads-leg-press',
  'hack-squat': 'quads-hack-squat',
  'smith-squat': 'quads-smith-squat',
  'bulgarian-split-squat': 'quads-bulgarian-split-squat',
  lunges: 'quads-lunges',
  'walking-lunge': 'quads-lunges',
  'dumbbell-lunge': 'quads-lunges',
  'reverse-lunges': 'quads-reverse-lunges',
  'leg-extension': 'quads-leg-extension',

  'romanian-deadlift': 'hamstrings-romanian-deadlift',
  deadlift: 'hamstrings-romanian-deadlift',
  'stiff-leg-deadlift': 'hamstrings-sldl',
  'good-morning': 'hamstrings-good-morning',
  'leg-curl': 'hamstrings-leg-curl-lying',
  'lying-leg-curl': 'hamstrings-leg-curl-lying',
  'seated-leg-curl': 'hamstrings-leg-curl-seated',

  'hip-thrust': 'glutes-barbell-hip-thrust',
  'glute-bridge': 'glutes-bridge',
  'cable-kickback': 'glutes-cable-kickback',

  'bench-press': 'chest-barbell-flat',
  'dumbbell-bench-press': 'chest-dumbbell-flat',
  'dumbbell-press': 'chest-dumbbell-flat',
  'incline-bench-press': 'chest-incline-barbell',
  'incline-dumbbell-press': 'chest-incline-dumbbell',
  dips: 'chest-dips',
  'assisted-dips': 'chest-dips-assisted',
  'cable-crossover': 'chest-cable-crossover',
  'cable-fly': 'chest-cable-crossover',
  'dumbbell-fly': 'chest-dumbbell-fly',
  'machine-chest-press': 'chest-machine-seated-press',
  'chest-press-machine': 'chest-machine-seated-press',

  'pull-up': 'lats-pull-ups-medium',
  'pull-ups': 'lats-pull-ups-medium',
  'weighted-pull-ups': 'lats-pull-ups-weighted',
  'assisted-pullup': 'lats-pull-ups-assisted',
  'chin-ups': 'lats-pull-ups-medium',
  'lat-pulldown': 'lat-pulldown-medium',
  'barbell-row': 'upperback-bent-over-row',
  'dumbbell-row': 'upperback-dumbbell-row',
  'cable-row': 'upperback-seated-cable-row',
  'seated-cable-row': 'upperback-seated-cable-row',
  't-bar-row': 'upperback-t-bar-row',
  'face-pull': 'upperback-face-pull',

  'overhead-press': 'frontdelt-military-press',
  'military-press': 'frontdelt-military-press',
  'dumbbell-shoulder-press': 'frontdelt-seated-dumbbell-press',
  'arnold-press': 'frontdelt-arnold-press',
  'lateral-raise': 'sidedelt-lateral-raises',
  'cable-lateral': 'sidedelt-cable-lateral-raise',
  'cable-lateral-raise': 'sidedelt-cable-lateral-raise',
  'rear-delt-fly': 'reardelt-rear-fly-dumbbell',
  'reverse-pec-deck': 'reardelt-reverse-pec-deck',

  'biceps-curl': 'biceps-dumbbell-curl',
  'dumbbell-curl': 'biceps-dumbbell-curl',
  'barbell-curl': 'biceps-barbell-curl',
  'hammer-curl': 'biceps-hammer-curl',
  'preacher-curl': 'biceps-preacher-curl',
  'cable-curl': 'biceps-cable-curl',

  'triceps-pushdown': 'triceps-pushdown',
  'tricep-pushdown': 'triceps-pushdown',
  'skull-crusher': 'triceps-skullcrusher',
  'overhead-tricep-extension': 'triceps-overhead-extension',
  'close-grip-bench': 'triceps-close-grip-bench-press',

  plank: 'abs-plank',
  'ab-wheel': 'abs-ab-wheel',
  'hanging-leg-raise': 'abs-hanging-leg-raises',
  'lying-leg-raise': 'abs-leg-raises',
  'cable-crunch': 'abs-cable-crunch',
  'pallof-press': 'core-pallof-press',

  'standing-calf-raise': 'calves-standing-raise',
  'seated-calf-raise': 'calves-seated-raise',
};

export function getUnifiedExerciseCanonicalId(id: string): string {
  return UNIFIED_EXERCISE_ALIASES[id] ?? id;
}

export function getUnifiedExerciseForId(id: string): UnifiedExercise | undefined {
  return getUnifiedExerciseById(id) ?? getUnifiedExerciseById(getUnifiedExerciseCanonicalId(id));
}

export function getUnifiedExerciseAliases(): Record<string, string> {
  return UNIFIED_EXERCISE_ALIASES;
}

export function getUnifiedExerciseById(id: string): UnifiedExercise | undefined {
  return UNIFIED_EXERCISES.find(exercise => exercise.id === id);
}

export function getUnifiedExercisesByMuscle(muscleGroup: MuscleGroup): UnifiedExercise[] {
  return UNIFIED_EXERCISES.filter(exercise =>
    exercise.muscleGroups.includes(muscleGroup)
    || exercise.primaryMuscles.includes(muscleGroup)
    || exercise.secondaryMuscles.includes(muscleGroup)
  );
}
