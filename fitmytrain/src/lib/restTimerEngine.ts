// Rest Timer Engine — calculates optimal rest time between sets
// Based on: exercise type, training intensity, RIR feedback, experience level, muscle group

import type { RIRLevel, TrainingType } from '@/lib/rirWeightAdjustment';
import type { ExperienceLevel, MuscleGroup } from '@/types/training';

export interface RestTimeParams {
  exerciseCategory: 'compound' | 'semi_compound' | 'isolation' | 'activation';
  trainingType: TrainingType;
  rir: RIRLevel;
  experience: ExperienceLevel;
  muscleGroup: MuscleGroup;
}

// Base rest times in seconds: [exercise category][training type]
const BASE_REST_SECONDS: Record<string, Record<TrainingType, number>> = {
  compound: {
    hard: 180,    // 3 min
    medium: 150,  // 2.5 min
    easy: 120,    // 2 min
  },
  semi_compound: {
    hard: 150,
    medium: 120,
    easy: 90,
  },
  isolation: {
    hard: 120,    // 2 min
    medium: 90,   // 1.5 min
    easy: 60,     // 1 min
  },
  activation: {
    hard: 60,
    medium: 45,
    easy: 30,
  },
};

// RIR-based multiplier
const RIR_MULTIPLIER: Record<RIRLevel, number> = {
  4: 0.80,  // Easy — less rest needed
  2: 1.00,  // Normal — base rest
  1: 1.20,  // Hard — more rest
  0: 1.40,  // To failure — much more rest
};

// Experience level multiplier
const EXPERIENCE_MULTIPLIER: Record<ExperienceLevel, number> = {
  beginner: 0.85,     // Faster recovery, lighter weights
  intermediate: 1.00, // Standard
  advanced: 1.15,     // Heavier loads, needs more rest
};

// Large muscle groups get extra rest
const LARGE_MUSCLE_GROUPS: MuscleGroup[] = ['quadriceps', 'hamstrings', 'glutes', 'back', 'chest'];
const SMALL_MUSCLE_GROUPS: MuscleGroup[] = ['biceps', 'triceps'];

function getMuscleGroupMultiplier(muscleGroup: MuscleGroup): number {
  if (LARGE_MUSCLE_GROUPS.includes(muscleGroup)) return 1.15;
  if (SMALL_MUSCLE_GROUPS.includes(muscleGroup)) return 0.90;
  return 1.0; // shoulders, core
}

/**
 * Calculate rest time in seconds
 */
export function calculateRestTime(params: RestTimeParams): number {
  const { exerciseCategory, trainingType, rir, experience, muscleGroup } = params;

  const categoryKey = exerciseCategory === 'semi_compound' ? 'semi_compound' : exerciseCategory;
  const base = BASE_REST_SECONDS[categoryKey]?.[trainingType] ?? BASE_REST_SECONDS.isolation[trainingType];

  const restSeconds = base
    * RIR_MULTIPLIER[rir]
    * EXPERIENCE_MULTIPLIER[experience]
    * getMuscleGroupMultiplier(muscleGroup);

  // Round to nearest 5 seconds, min 20s, max 300s
  return Math.min(300, Math.max(20, Math.round(restSeconds / 5) * 5));
}

/**
 * Format seconds to mm:ss
 */
export function formatRestTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
