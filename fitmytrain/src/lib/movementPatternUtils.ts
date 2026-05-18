/**
 * Утилиты для работы с паттернами движения
 * Используется для корректной замены упражнений
 */

import { MovementPattern } from '@/types/exercise-metadata';
import { ExerciseCategory } from '@/types/exercise-metadata';

// Расширенные паттерны движения для точной фильтрации замен
export type DetailedMovementPattern = 
  | 'vertical_press'   // Жим над головой (overhead press)
  | 'horizontal_push'  // Горизонтальный жим (bench press)
  | 'vertical_pull'    // Вертикальная тяга (pullup, lat pulldown)
  | 'horizontal_pull'  // Горизонтальная тяга (row)
  | 'squat'            // Приседания (knee-dominant)
  | 'hinge'            // Наклоны (hip-dominant)
  | 'lunge'            // Выпады
  | 'isolation_push'   // Изоляция жимовая (tricep extension)
  | 'isolation_pull'   // Изоляция тяговая (bicep curl)
  | 'isolation_lateral'// Изоляция латеральная (lateral raise)
  | 'isolation_rear'   // Изоляция задняя дельта (rear delt fly)
  | 'fly'              // Разводки (chest fly)
  | 'hip_extension'    // Разгибание бедра (glute bridge, hip thrust)
  | 'leg_curl'         // Сгибание ног
  | 'leg_extension'    // Разгибание ног
  | 'core_anti'        // Антидвижения кора (plank, pallof press)
  | 'core_flexion'     // Скручивания
  | 'calf'             // Икры
  | 'other';

// Маппинг упражнений на детализированные паттерны
const EXERCISE_PATTERN_MAP: Record<string, DetailedMovementPattern> = {
  // Vertical press
  'overhead-press': 'vertical_press',
  'dumbbell-overhead-press': 'vertical_press',
  'seated-dumbbell-press': 'vertical_press',
  'machine-shoulder-press': 'vertical_press',
  'push-press': 'vertical_press',
  'arnold-press': 'vertical_press',
  
  // Horizontal push
  'bench-press': 'horizontal_push',
  'chest-barbell-flat': 'horizontal_push',
  'dumbbell-press': 'horizontal_push',
  'dumbbell-bench-press': 'horizontal_push', // Legacy ID alias
  'chest-dumbbell-flat': 'horizontal_push',
  'incline-bench-press': 'horizontal_push',
  'incline-dumbbell-press': 'horizontal_push',
  'decline-bench-press': 'horizontal_push',
  'machine-chest-press': 'horizontal_push',
  'hammer-chest-press': 'horizontal_push',
  'smith-bench-press': 'horizontal_push',
  'dips': 'horizontal_push',
  'close-grip-bench': 'horizontal_push',
  
  // Fly patterns
  'cable-fly': 'fly',
  'dumbbell-fly': 'fly',
  'pec-deck': 'fly',
  'incline-dumbbell-fly': 'fly',
  
  // Vertical pull
  'pullup': 'vertical_pull',
  'pull-ups': 'vertical_pull',
  'lat-pulldown': 'vertical_pull',
  'assisted-pullup': 'vertical_pull',
  'assisted-dips': 'horizontal_push',
  'chin-up': 'vertical_pull',
  'chin-ups': 'vertical_pull',
  'weighted-pullup': 'vertical_pull',
  'weighted-pull-ups': 'vertical_pull',
  
  // Horizontal pull
  'barbell-row': 'horizontal_pull',
  'dumbbell-row': 'horizontal_pull',
  'cable-row': 'horizontal_pull',
  'cable-row-wide': 'horizontal_pull',
  't-bar-row': 'horizontal_pull',
  'chest-supported-row': 'horizontal_pull',
  'machine-row': 'horizontal_pull',
  'pendlay-row': 'horizontal_pull',
  
  // Squat
  'squat': 'squat',
  'barbell-squat': 'squat',
  'quads-barbell-squat': 'squat',
  'front-squat': 'squat',
  'hack-squat': 'squat',
  'leg-press': 'squat',
  'quads-leg-press': 'squat',
  'belt-squat': 'squat',
  'smith-squat': 'squat',
  'goblet-squat': 'squat',
  
  // Lunge
  'bulgarian-split-squat': 'lunge',
  'lunges': 'lunge',
  'walking-lunge': 'lunge',
  'smith-split-squat': 'lunge',
  'step-up': 'lunge',
  
  // Hinge
  'deadlift': 'hinge',
  'romanian-deadlift': 'hinge',
  'hamstrings-romanian-deadlift': 'hinge',
  'stiff-leg-deadlift': 'hinge',
  'good-morning': 'hinge',
  'sumo-deadlift': 'hinge',
  'trap-bar-deadlift': 'hinge',
  
  // Hip extension
  'glute-bridge': 'hip_extension',
  'hip-thrust': 'hip_extension',
  'glutes-barbell-hip-thrust': 'hip_extension',
  'cable-pull-through': 'hip_extension',
  'glute-kickback': 'hip_extension',
  'reverse-hyper': 'hip_extension',
  
  // Leg curl
  'leg-curl': 'leg_curl',
  'seated-leg-curl': 'leg_curl',
  'nordic-curl': 'leg_curl',
  
  // Leg extension
  'leg-extension': 'leg_extension',
  
  // Isolation lateral (side delts)
  'lateral-raise': 'isolation_lateral',
  'cable-lateral-raise': 'isolation_lateral',
  'cable-lateral-raise-behind': 'isolation_lateral',
  'machine-lateral-raise': 'isolation_lateral',
  'leaning-lateral-raise': 'isolation_lateral',
  
  // Isolation rear (rear delts)
  'face-pull': 'isolation_rear',
  'rear-delt-fly': 'isolation_rear',
  'reverse-pec-deck': 'isolation_rear',
  'band-pull-apart': 'isolation_rear',
  
  // Isolation push (triceps)
  'tricep-pushdown': 'isolation_push',
  'triceps-pushdown': 'isolation_push',
  'skull-crusher': 'isolation_push',
  'overhead-tricep-extension': 'isolation_push',
  'cable-overhead-extension': 'isolation_push',
  'dumbbell-tricep-extension': 'isolation_push',
  'tricep-kickback': 'isolation_push',
  
  // Isolation pull (biceps)
  'barbell-curl': 'isolation_pull',
  'dumbbell-curl': 'isolation_pull',
  'hammer-curl': 'isolation_pull',
  'preacher-curl': 'isolation_pull',
  'cable-curl': 'isolation_pull',
  'incline-curl': 'isolation_pull',
  'concentration-curl': 'isolation_pull',
  'ez-bar-curl': 'isolation_pull',
  
  // Core anti-movement
  'plank': 'core_anti',
  'abs-plank': 'core_anti',
  'side-plank': 'core_anti',
  'pallof-press': 'core_anti',
  'dead-bug': 'core_anti',
  'bird-dog': 'core_anti',
  'ab-wheel': 'core_anti',
  'abs-ab-wheel': 'core_anti',
  
  // Core flexion
  'cable-crunch': 'core_flexion',
  'crunch': 'core_flexion',
  'leg-raise': 'core_flexion',
  'hanging-leg-raise': 'core_flexion',
  'russian-twist': 'core_flexion',
  
  // Calf
  'calf-raise': 'calf',
  'seated-calf-raise': 'calf',
  'standing-calf-raise': 'calf',
};

/**
 * Получить детализированный паттерн движения для упражнения
 */
export function getDetailedMovementPattern(exerciseId: string): DetailedMovementPattern {
  return EXERCISE_PATTERN_MAP[exerciseId] ?? 'other';
}

/**
 * Группы совместимых паттернов — какие паттерны можно заменять друг на друга
 */
const COMPATIBLE_PATTERNS: Record<DetailedMovementPattern, DetailedMovementPattern[]> = {
  // Vertical press — только вертикальные жимы
  vertical_press: ['vertical_press'],
  
  // Horizontal push — только горизонтальные жимы
  horizontal_push: ['horizontal_push'],
  
  // Fly — разводки груди
  fly: ['fly'],
  
  // Vertical pull — вертикальные тяги
  vertical_pull: ['vertical_pull'],
  
  // Horizontal pull — горизонтальные тяги
  horizontal_pull: ['horizontal_pull'],
  
  // Squat — приседания
  squat: ['squat'],
  
  // Lunge — выпады
  lunge: ['lunge'],
  
  // Hinge — наклоны
  hinge: ['hinge'],
  
  // Hip extension — разгибание бедра
  hip_extension: ['hip_extension'],
  
  // Leg curl — сгибание ног
  leg_curl: ['leg_curl'],
  
  // Leg extension — разгибание ног  
  leg_extension: ['leg_extension'],
  
  // Isolation lateral — боковые дельты
  isolation_lateral: ['isolation_lateral'],
  
  // Isolation rear — задние дельты
  isolation_rear: ['isolation_rear'],
  
  // Isolation push — трицепс
  isolation_push: ['isolation_push'],
  
  // Isolation pull — бицепс
  isolation_pull: ['isolation_pull'],
  
  // Core anti — антидвижения
  core_anti: ['core_anti'],
  
  // Core flexion — скручивания
  core_flexion: ['core_flexion'],
  
  // Calf — икры
  calf: ['calf'],
  
  // Other — только если оба other
  other: ['other'],
};

/**
 * Проверить совместимость паттернов движения
 */
export function arePatternsCompatible(
  pattern1: DetailedMovementPattern, 
  pattern2: DetailedMovementPattern
): boolean {
  const compatibleWith = COMPATIBLE_PATTERNS[pattern1];
  return compatibleWith.includes(pattern2);
}

/**
 * Проверить можно ли заменить одно упражнение на другое по паттерну
 */
export function canReplaceByPattern(
  sourceExerciseId: string,
  targetExerciseId: string
): boolean {
  const sourcePattern = getDetailedMovementPattern(sourceExerciseId);
  const targetPattern = getDetailedMovementPattern(targetExerciseId);
  
  return arePatternsCompatible(sourcePattern, targetPattern);
}

/**
 * Фильтровать альтернативы по совместимости паттерна движения
 */
export function filterAlternativesByPattern(
  sourceExerciseId: string,
  alternativeIds: string[]
): string[] {
  const sourcePattern = getDetailedMovementPattern(sourceExerciseId);
  
  return alternativeIds.filter(altId => {
    const altPattern = getDetailedMovementPattern(altId);
    return arePatternsCompatible(sourcePattern, altPattern);
  });
}

/**
 * Получить русское название паттерна
 */
export const PATTERN_LABELS: Record<DetailedMovementPattern, string> = {
  vertical_press: 'Вертикальный жим',
  horizontal_push: 'Горизонтальный жим',
  vertical_pull: 'Вертикальная тяга',
  horizontal_pull: 'Горизонтальная тяга',
  squat: 'Присед',
  hinge: 'Наклон (hinge)',
  lunge: 'Выпады',
  fly: 'Разводки',
  hip_extension: 'Разгибание бедра',
  leg_curl: 'Сгибание ног',
  leg_extension: 'Разгибание ног',
  isolation_lateral: 'Изоляция (латеральная)',
  isolation_rear: 'Изоляция (задняя)',
  isolation_push: 'Изоляция (жим)',
  isolation_pull: 'Изоляция (тяга)',
  core_anti: 'Кор (стабилизация)',
  core_flexion: 'Кор (скручивания)',
  calf: 'Икры',
  other: 'Другое',
};
