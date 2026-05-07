import type { WeekDay } from '@/data/trainingPrograms';
import type { GeneratedSession } from '@/lib/smartPlanGenerator';
import type { BuildWorkoutPlanInput, BuildWorkoutPlanResult, BulkTrainingDay } from './types';
import { buildAdaptiveWorkout } from './adaptiveEngine';
import { exerciseGenerator } from './exerciseGenerator';
import { frequencyEngine, DAY_ORDER } from './frequencyEngine';
import { genderAdapter } from './genderAdapter';
import { goalAdapter } from './goalAdapter';
import { getTargetWeightFromOneRM, oneRMAdapter } from './oneRMAdapter';
import { applyProgression, progressionEngine } from './progressionEngine';
import { applyRestPlan, restEngine } from './restEngine';
import { splitEngine } from './splitEngine';
import { volumeAdjuster } from './volumeAdjuster';
import { volumeBalancer } from './volumeBalancer';
import type { OneRMPlan } from './types';

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getWeekStart(date: Date): Date {
  const dayOfWeek = date.getDay();
  const mondayBasedToday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - mondayBasedToday);
  return weekStart;
}

function normalizeStartDate(startDate?: Date): Date {
  const normalized = startDate ? new Date(startDate) : new Date();
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function buildDayFromSession(date: Date, session: GeneratedSession, oneRM: OneRMPlan): BulkTrainingDay {
  return {
    date: formatDate(date),
    name: session.name,
    intensity: session.intensity === 'rest' ? 'easy' : session.intensity,
    exercises: session.exercises.map((exercise, exerciseIndex) => {
      const targetWeight = getTargetWeightFromOneRM(oneRM, exercise.exerciseId, exercise.percentPM);

      return {
        exercise_id: exercise.exerciseId,
        exercise_name: exercise.exerciseName,
        order_index: exerciseIndex,
        sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
          set_number: setIndex + 1,
          target_reps: exercise.reps,
          target_weight: targetWeight,
        })),
      };
    }),
  };
}

function buildCalendarDays(
  sessions: GeneratedSession[],
  selectedDays: WeekDay[],
  startDate: Date,
  weeksAhead: number,
  oneRM: OneRMPlan
): BulkTrainingDay[] {
  const weekStart = getWeekStart(startDate);
  const weekStartDate = weekStart.getDate();
  const weekStartMonth = weekStart.getMonth();
  const weekStartYear = weekStart.getFullYear();

  const days: BulkTrainingDay[] = [];
  let sessionIndex = 0;

  for (let week = 0; week < weeksAhead; week++) {
    for (const targetDay of selectedDays) {
      const mondayBasedTarget = DAY_ORDER[targetDay];
      const currentDate = new Date(weekStartYear, weekStartMonth, weekStartDate + week * 7 + mondayBasedTarget);

      if (currentDate < startDate) continue;

      const session = sessions[sessionIndex % sessions.length];
      sessionIndex++;
      days.push(buildDayFromSession(currentDate, session, oneRM));
    }
  }

  return days;
}

export function buildWorkoutPlan(input: BuildWorkoutPlanInput): BuildWorkoutPlanResult {
  const frequency = frequencyEngine(input.user, input.availableDays);
  const split = splitEngine(input.user, frequency.weeklyTrainings);
  const goal = goalAdapter(input.goal);
  const gender = genderAdapter(input.user);
  const oneRM = oneRMAdapter(input.personalMaxes);

  const generatorInput = {
    user: input.user,
    goal: goal.goal,
    frequency,
    injuries: input.injuries,
    equipment: input.equipment,
    priorityMuscles: input.priorityMuscles,
    fatigueLevel: input.fatigueLevel,
    exerciseHistory: input.exerciseHistory,
  };

  const generatedProgram = exerciseGenerator(generatorInput);
  const initialVolumeBalance = volumeBalancer(generatedProgram, {
    recentExerciseIds: input.exerciseHistory,
  });
  const balancedGeneratedProgram = exerciseGenerator({
    ...generatorInput,
    volumeBias: initialVolumeBalance.bias,
    volumeByMuscle: initialVolumeBalance.volumeByMuscle,
    maxChangesPerDay: 2,
  });

  const program = volumeAdjuster(balancedGeneratedProgram);
  const volumeBalance = volumeBalancer(program, {
    recentExerciseIds: input.exerciseHistory,
  });
  const startDate = normalizeStartDate(input.startDate);
  const baseDays = buildCalendarDays(
    program.sessions,
    frequency.selectedDays,
    startDate,
    input.weeksAhead ?? 12,
    oneRM
  );
  const progression = progressionEngine(input.user.weekIndex ?? 0);
  const progressedDays = applyProgression(baseDays, {
    goal: goal.goal,
    startWeekIndex: progression.startWeekIndex,
  });
  const rest = restEngine();
  const restedDays = applyRestPlan(progressedDays, goal.goal);
  const { plan: adaptiveDays, adaptive } = buildAdaptiveWorkout(restedDays, input.userState);

  return {
    days: adaptiveDays,
    program,
    volumeDistribution: program.volumeDistribution,
    trace: {
      frequency,
      split,
      goal,
      gender,
      oneRM,
      rest,
      progression,
      adaptive,
      volumeBalance,
    },
  };
}
