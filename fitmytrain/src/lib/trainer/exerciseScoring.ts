import { EXERCISES, getExerciseById } from '@/data/exercises';
import { getExerciseMetadata, isExerciseSafeForUser } from '@/data/exerciseMetadata';
import { getExtendedCoreExerciseById, type MovementGroup } from '@/data/exercisesExtended';
import { getMuscleVolumeLimit } from './volumeBalancer';
import type { EquipmentType, FatigueLevel, InjuryArea } from '@/types/exercise-metadata';
import type { Exercise, ExperienceLevel, MuscleGroup, TrainingGoal } from '@/types/training';

const VOLUME_BIAS_SCORE_WEIGHT = 20;
const MAX_VOLUME_BIAS_IMPACT_PER_EXERCISE = 8;
const OVER_VOLUME_HARD_PENALTY = -80;
const RECOVERY_HARD_PENALTY = -65;

export interface ExerciseScoringContext {
  goal: TrainingGoal;
  experience: ExperienceLevel;
  priorityMuscles: MuscleGroup[];
  recentExerciseIds?: string[];
  fatigueLevel?: FatigueLevel;
  equipment?: EquipmentType[];
  injuries?: InjuryArea[];
  usedMovementGroups?: MovementGroup[];
  volumeBias?: Partial<Record<MuscleGroup, number>>;
  volumeByMuscle?: Partial<Record<MuscleGroup, number>>;
  weekIndex?: number;
}

function hasAvailableEquipment(exerciseId: string, equipment: EquipmentType[] = []): boolean {
  if (equipment.length === 0) return true;

  const metadata = getExerciseMetadata(exerciseId);
  if (!metadata) return true;

  return metadata.equipment.some(item => equipment.includes(item));
}

function getEquipmentScore(exerciseId: string, equipment: EquipmentType[] = []): number {
  if (equipment.length === 0) return 0;
  return hasAvailableEquipment(exerciseId, equipment) ? 8 : -45;
}

function stableHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getPriorityScore(exercise: Exercise, priorityMuscles: MuscleGroup[]): number {
  let score = 0;

  for (const load of exercise.muscleLoads) {
    if (!priorityMuscles.includes(load.muscleGroup)) continue;

    if (load.loadType === 'primary') score += 28;
    if (load.loadType === 'secondary') score += 14;
    if (load.loadType === 'tertiary') score += 6;
  }

  return score;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getVolumeBiasScore(exercise: Exercise, volumeBias: Partial<Record<MuscleGroup, number>> = {}): number {
  const rawScore = exercise.muscleLoads.reduce((score, load) => {
    const bias = volumeBias[load.muscleGroup] ?? 0;
    if (load.loadType === 'primary') return score + bias * VOLUME_BIAS_SCORE_WEIGHT;
    if (load.loadType === 'secondary') return score + bias * VOLUME_BIAS_SCORE_WEIGHT * 0.5;
    return score + bias * VOLUME_BIAS_SCORE_WEIGHT * 0.25;
  }, 0);

  return clamp(rawScore, -MAX_VOLUME_BIAS_IMPACT_PER_EXERCISE, MAX_VOLUME_BIAS_IMPACT_PER_EXERCISE);
}

function getVolumeConstraintScore(
  exercise: Exercise,
  volumeByMuscle: Partial<Record<MuscleGroup, number>> = {}
): number {
  let score = 0;

  for (const load of exercise.muscleLoads) {
    const limits = getMuscleVolumeLimit(load.muscleGroup);
    const currentVolume = volumeByMuscle[load.muscleGroup] ?? 0;
    if (currentVolume <= limits.max) continue;

    if (load.loadType === 'primary') score += OVER_VOLUME_HARD_PENALTY;
    if (load.loadType === 'secondary') score += Math.round(OVER_VOLUME_HARD_PENALTY * 0.55);
    if (load.loadType === 'tertiary') score += Math.round(OVER_VOLUME_HARD_PENALTY * 0.25);
  }

  return score;
}

function getRecentlyLoadedMuscles(recentExerciseIds: string[] = []): Set<MuscleGroup> {
  const muscles = new Set<MuscleGroup>();

  for (const exerciseId of recentExerciseIds.slice(-8)) {
    const extendedExercise = getExtendedCoreExerciseById(exerciseId);
    if (!extendedExercise) continue;
    extendedExercise.muscles.primary.forEach(muscle => muscles.add(muscle));
  }

  return muscles;
}

function getRecoveryConstraintScore(
  exercise: Exercise,
  recentExerciseIds: string[] = [],
  fatigueLevel?: FatigueLevel
): number {
  const extendedExercise = getExtendedCoreExerciseById(exercise.id);
  if (!extendedExercise) return 0;

  const recentlyLoadedMuscles = getRecentlyLoadedMuscles(recentExerciseIds);
  const repeatsPrimaryMuscle = extendedExercise.muscles.primary.some(muscle => recentlyLoadedMuscles.has(muscle));
  const highLoad = exercise.type === 'compound' || extendedExercise.difficulty >= 4;

  if (!repeatsPrimaryMuscle || !highLoad) return 0;
  return fatigueLevel === 'low' ? -35 : RECOVERY_HARD_PENALTY;
}

function getGoalScore(exercise: Exercise, goal: TrainingGoal): number {
  const metadata = getExerciseMetadata(exercise.id);
  const isCompound = exercise.type === 'compound';
  const isMachineOrCable = metadata?.equipment.some(item => item === 'machines' || item === 'cables') ?? false;

  if (goal === 'muscle_gain') {
    return isCompound ? 10 : 6;
  }

  if (goal === 'recomposition') {
    return isCompound ? 8 : 4;
  }

  if (goal === 'cutting') {
    return isMachineOrCable ? 10 : metadata?.riskLevel === 'high' ? -12 : 4;
  }

  return metadata?.riskLevel === 'high' ? -8 : 6;
}

function getExperienceScore(exercise: Exercise, experience: ExperienceLevel): number {
  const metadata = getExerciseMetadata(exercise.id);
  const extended = getExtendedCoreExerciseById(exercise.id);
  const highRisk = metadata?.riskLevel === 'high';
  const highDemand = metadata?.neurologicalDemand === 'high';
  const difficulty = extended?.difficulty ?? (highRisk ? 4 : 2);

  if (experience === 'beginner') {
    if (difficulty >= 5) return -35;
    if (difficulty >= 4 || highRisk || highDemand) return -28;
    if (difficulty === 3) return -10;
    return exercise.type === 'compound' ? 4 : 10;
  }

  if (experience === 'advanced') {
    return difficulty >= 4 ? 10 : exercise.type === 'compound' ? 8 : 2;
  }

  return difficulty >= 5 ? -8 : highRisk ? -4 : 5;
}

function getFatigueScore(exercise: Exercise, fatigueLevel?: FatigueLevel): number {
  if (!fatigueLevel || fatigueLevel === 'low') return 0;

  const metadata = getExerciseMetadata(exercise.id);
  const highRisk = metadata?.riskLevel === 'high';
  const highDemand = metadata?.neurologicalDemand === 'high';
  const machineOrCable = metadata?.equipment.some(item => item === 'machines' || item === 'cables') ?? false;

  if (fatigueLevel === 'high') {
    if (highRisk || highDemand) return -22;
    return machineOrCable ? 10 : -3;
  }

  return highRisk ? -8 : machineOrCable ? 4 : 0;
}

function getHistoryScore(exerciseId: string, recentExerciseIds: string[] = []): number {
  const lastIndex = recentExerciseIds.lastIndexOf(exerciseId);
  if (lastIndex === -1) return 12;

  const distanceFromEnd = recentExerciseIds.length - lastIndex;
  if (distanceFromEnd <= 2) return -45;
  if (distanceFromEnd <= 6) return -28;
  return -12;
}

function getMovementGroupScore(exerciseId: string, usedMovementGroups: MovementGroup[] = []): number {
  const movementGroup = getExtendedCoreExerciseById(exerciseId)?.movementGroup;
  if (!movementGroup) return 4;

  return usedMovementGroups.includes(movementGroup) ? -40 : 14;
}

export function scoreExercise(exercise: Exercise, context: ExerciseScoringContext): number {
  const safetyScore = isExerciseSafeForUser(exercise.id, context.injuries ?? []) ? 0 : -50;

  const movementGroupScore = getMovementGroupScore(exercise.id, context.usedMovementGroups);
  const weekIndex = context.weekIndex ?? 0;
  const rotationScore = stableHash(`${exercise.id}:${weekIndex}`) % 12;

  return 50
    + safetyScore
    + getEquipmentScore(exercise.id, context.equipment)
    + movementGroupScore
    + getVolumeConstraintScore(exercise, context.volumeByMuscle)
    + getRecoveryConstraintScore(exercise, context.recentExerciseIds, context.fatigueLevel)
    + getVolumeBiasScore(exercise, context.volumeBias)
    + getPriorityScore(exercise, context.priorityMuscles)
    + getGoalScore(exercise, context.goal)
    + getExperienceScore(exercise, context.experience)
    + getFatigueScore(exercise, context.fatigueLevel)
    + getHistoryScore(exercise.id, context.recentExerciseIds)
    + rotationScore;
}

export function getScoredExerciseCandidates(exerciseId: string): Exercise[] {
  const baseExercise = getExerciseById(exerciseId);
  if (!baseExercise) return [];

  const candidateIds = new Set<string>([
    exerciseId,
    ...(baseExercise.alternatives ?? []),
  ]);

  for (const exercise of EXERCISES) {
    if (exercise.muscleGroup !== baseExercise.muscleGroup) continue;
    if (exercise.type !== baseExercise.type) continue;
    candidateIds.add(exercise.id);
  }

  return [...candidateIds]
    .map(id => getExerciseById(id))
    .filter(Boolean) as Exercise[];
}
