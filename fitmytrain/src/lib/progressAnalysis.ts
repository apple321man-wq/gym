import { ProgressAnalysis, ProgressStatus, TrendDirection } from '@/types/training';

// Local interface for analysis input (supports both local and cloud data formats)
interface MeasurementInput {
  id: string;
  date: string;
  weight: number;
  waist: number;
  chest: number;
  hip: number;
}

const MIN_MEASUREMENTS_FOR_TREND = 3;
const WAIST_CM_PER_KG_FAT = 0.8; // примерный коэффициент
const MEASUREMENT_NOISE_THRESHOLD = 1; // см - порог погрешности

export function analyzeTrend(values: number[]): TrendDirection {
  if (values.length < MIN_MEASUREMENTS_FOR_TREND) {
    return 'insufficient';
  }

  // Сравниваем первые и последние значения
  const firstAvg = (values[0] + values[1]) / 2;
  const lastAvg = (values[values.length - 1] + values[values.length - 2]) / 2;
  const diff = lastAvg - firstAvg;

  if (Math.abs(diff) < MEASUREMENT_NOISE_THRESHOLD) {
    return 'stable';
  }

  return diff < 0 ? 'down' : 'up';
}

export function analyzeProgress(measurements: MeasurementInput[]): ProgressAnalysis {
  const warnings: string[] = [];

  // Проверка на достаточность данных
  if (measurements.length < MIN_MEASUREMENTS_FOR_TREND) {
    return {
      status: 'insufficient_data',
      fatTrend: 'insufficient',
      muscleTrend: 'insufficient',
      warnings: ['Нужно минимум 2–3 замера с одинаковыми условиями.'],
    };
  }

  // Сортируем по дате (от старых к новым)
  const sorted = [...measurements].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Извлекаем значения
  const waistValues = sorted.map(m => m.waist);
  const chestValues = sorted.map(m => m.chest);
  const hipValues = sorted.map(m => m.hip);
  const weightValues = sorted.map(m => m.weight);

  // Анализ трендов
  const waistTrend = analyzeTrend(waistValues);
  const chestTrend = analyzeTrend(chestValues);
  const hipTrend = analyzeTrend(hipValues);

  // Определяем тренд жировой массы (по талии)
  const fatTrend: TrendDirection = waistTrend;

  // Определяем тренд безжировой массы (по груди и бёдрам)
  let muscleTrend: TrendDirection = 'stable';
  if (chestTrend === 'up' || hipTrend === 'up') {
    muscleTrend = 'up';
  } else if (chestTrend === 'down' && hipTrend === 'down') {
    muscleTrend = 'down';
  } else if (chestTrend === 'insufficient' || hipTrend === 'insufficient') {
    muscleTrend = 'insufficient';
  }

  // Рассчитываем диапазон изменения жира
  let fatChangeRange: { min: number; max: number } | undefined;
  if (waistTrend !== 'insufficient' && waistTrend !== 'stable') {
    const waistDiff = waistValues[waistValues.length - 1] - waistValues[0];
    const estimatedFatChange = waistDiff / WAIST_CM_PER_KG_FAT;
    fatChangeRange = {
      min: Math.round((estimatedFatChange * 0.8) * 10) / 10,
      max: Math.round((estimatedFatChange * 1.2) * 10) / 10,
    };
  }

  // Рассчитываем диапазон изменения мышц (грубая оценка)
  let muscleChangeRange: { min: number; max: number } | undefined;
  if (muscleTrend !== 'insufficient' && muscleTrend !== 'stable') {
    const chestDiff = chestValues[chestValues.length - 1] - chestValues[0];
    const hipDiff = hipValues[hipValues.length - 1] - hipValues[0];
    const avgDiff = (chestDiff + hipDiff) / 2;
    muscleChangeRange = {
      min: Math.round((avgDiff * 0.1) * 10) / 10,
      max: Math.round((avgDiff * 0.3) * 10) / 10,
    };
  }

  // Проверка на резкие изменения
  const latestWaist = waistValues[waistValues.length - 1];
  const prevWaist = waistValues[waistValues.length - 2];
  if (Math.abs(latestWaist - prevWaist) > 3) {
    warnings.push('Резкое изменение показателей. Скорее всего, это колебания воды.');
  }

  // Проверка на противоречивые данные
  const latestWeight = weightValues[weightValues.length - 1];
  const prevWeight = weightValues[weightValues.length - 2];
  const weightDiff = latestWeight - prevWeight;
  const waistDiff = latestWaist - prevWaist;
  
  if ((weightDiff > 0 && waistDiff < -1) || (weightDiff < 0 && waistDiff > 1)) {
    warnings.push('Данные противоречат друг другу. Сделай ещё 1–2 замера.');
  }

  // Проверка на слишком частые замеры
  if (measurements.length >= 2) {
    const last = new Date(sorted[sorted.length - 1].date);
    const prev = new Date(sorted[sorted.length - 2].date);
    const daysDiff = (last.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff < 5) {
      warnings.push('Слишком частые замеры. Замеры чаще 1 раза в неделю увеличивают шум.');
    }
  }

  // Определяем статус
  let status: ProgressStatus;

  if (fatTrend === 'down' && (muscleTrend === 'up' || muscleTrend === 'stable')) {
    status = 'recomposition';
  } else if (fatTrend === 'down') {
    status = 'fat_loss';
  } else if (fatTrend === 'up' && (muscleTrend === 'up' || muscleTrend === 'stable')) {
    // Проверяем качество набора
    const waistGrowth = waistValues[waistValues.length - 1] - waistValues[0];
    const chestGrowth = chestValues[chestValues.length - 1] - chestValues[0];
    
    if (waistGrowth > chestGrowth * 1.5) {
      status = 'low_quality_gain';
    } else {
      status = 'mass_gain';
    }
  } else if (fatTrend === 'stable' && muscleTrend === 'stable') {
    status = 'mass_gain'; // поддержание
  } else {
    status = 'insufficient_data';
  }

  return {
    status,
    fatTrend,
    muscleTrend,
    fatChangeRange,
    muscleChangeRange,
    warnings,
  };
}

export const STATUS_LABELS: Record<ProgressStatus, { title: string; emoji: string; description: string }> = {
  fat_loss: {
    title: 'Снижение жировой массы',
    emoji: '🔥',
    description: 'Талия уменьшается на протяжении нескольких замеров. Это устойчивый сигнал снижения жира.',
  },
  recomposition: {
    title: 'Рекомпозиция',
    emoji: '⚖️',
    description: 'Талия уменьшается или стабильна, при этом объёмы груди и бедра растут. Это редкий, но хороший сценарий.',
  },
  mass_gain: {
    title: 'Набор массы',
    emoji: '📈',
    description: 'Объёмы растут. Талия стабильна — набор относительно чистый.',
  },
  low_quality_gain: {
    title: 'Некачественный набор',
    emoji: '❌',
    description: 'Талия увеличивается быстрее, чем объёмы груди и бедра. Вероятно, калорийный избыток слишком высокий.',
  },
  insufficient_data: {
    title: 'Недостаточно данных',
    emoji: '⚠️',
    description: 'Нужно минимум 2–3 замера с одинаковыми условиями.',
  },
};

export const TREND_LABELS: Record<TrendDirection, { label: string; icon: string }> = {
  up: { label: 'Растёт', icon: '⬆️' },
  down: { label: 'Снижается', icon: '⬇️' },
  stable: { label: 'Без изменений', icon: '➖' },
  insufficient: { label: 'Недостаточно данных', icon: '❓' },
};
