import { generateSmartPlan } from '@/lib/smartPlanGenerator';
import { getExtendedCoreExerciseById, type MovementGroup } from '@/data/exercisesExtended';
import type { EquipmentType, FatigueLevel, InjuryArea } from '@/types/exercise-metadata';
import type { MuscleGroup, TrainingGoal } from '@/types/training';
import type { FrequencyPlan, TrainerUser } from './types';
import { getScoredExerciseCandidates, scoreExercise } from './exerciseScoring';

const DEFAULT_EQUIPMENT: EquipmentType[] = ['barbell', 'dumbbells', 'machines', 'cables', 'bodyweight'];
const SCORING_CYCLE_WEEKS = 4;

interface ExerciseGeneratorInput {
  user: TrainerUser;
  goal: TrainingGoal;
  frequency: FrequencyPlan;
  injuries?: InjuryArea[];
  equipment?: EquipmentType[];
  priorityMuscles: MuscleGroup[];
  fatigueLevel?: FatigueLevel;
  exerciseHistory?: string[];
  volumeBias?: Partial<Record<MuscleGroup, number>>;
}

export function exerciseGenerator(input: ExerciseGeneratorInput) {
  const equipment = input.equipment ?? DEFAULT_EQUIPMENT;
  const smartPlan = generateSmartPlan({
    goal: input.goal,
    experience: input.user.experience,
    weeklyTrainings: input.frequency.weeklyTrainings,
    injuries: input.injuries ?? [],
    equipment,
    priorityMuscles: input.priorityMuscles,
    fatigueLevel: input.fatigueLevel ?? 'low',
  });

  const recentExerciseIds = [...(input.exerciseHistory ?? [])];

  return {
    ...smartPlan,
    sessions: Array.from({ length: SCORING_CYCLE_WEEKS }).flatMap((_, cycleWeekIndex) =>
      smartPlan.sessions.map(session => {
        const usedInSession = new Set<string>();
        const usedMovementGroups = new Set<MovementGroup>();

        return {
          ...session,
          name: `${session.name} · W${cycleWeekIndex + 1}`,
          exercises: session.exercises.map(exercise => {
            const buildCandidates = (excludeMovementGroupDuplicates: boolean) => getScoredExerciseCandidates(exercise.exerciseId)
              .filter(candidate => !usedInSession.has(candidate.id))
              .map(candidate => ({
                exercise: candidate,
                score: scoreExercise(candidate, {
                  goal: input.goal,
                  experience: input.user.experience,
                  priorityMuscles: input.priorityMuscles,
                  recentExerciseIds,
                  fatigueLevel: input.fatigueLevel ?? 'low',
                  equipment,
                  injuries: input.injuries ?? [],
                  usedMovementGroups: excludeMovementGroupDuplicates ? [...usedMovementGroups] : [],
                  volumeBias: input.volumeBias,
                  weekIndex: (input.user.weekIndex ?? 0) + cycleWeekIndex,
                }),
              }))
              .sort((a, b) => b.score - a.score);

            const candidates = buildCandidates(true);
            const fallbackCandidates = candidates.length > 0 ? candidates : buildCandidates(false);
            const selected = fallbackCandidates[0]?.exercise;
            if (!selected) return exercise;

            usedInSession.add(selected.id);
            const movementGroup = getExtendedCoreExerciseById(selected.id)?.movementGroup;
            if (movementGroup) {
              usedMovementGroups.add(movementGroup);
            }
            recentExerciseIds.push(selected.id);

            const isPriorityExercise = selected.muscleLoads.some(load =>
              load.loadType === 'primary' && input.priorityMuscles.includes(load.muscleGroup)
            );

            return {
              ...exercise,
              exerciseId: selected.id,
              exerciseName: selected.name,
              sets: isPriorityExercise ? Math.min(exercise.sets + 1, 5) : exercise.sets,
              isModified: exercise.isModified || selected.id !== exercise.exerciseId,
              originalExerciseId: selected.id !== exercise.exerciseId
                ? exercise.originalExerciseId ?? exercise.exerciseId
                : exercise.originalExerciseId,
              notes: selected.id !== exercise.exerciseId
                ? [exercise.notes, 'Подобрано scoring engine'].filter(Boolean).join(' · ')
                : exercise.notes,
            };
          }),
        };
      })
    ),
  };
}
