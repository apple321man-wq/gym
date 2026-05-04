import type { WeekDay } from '@/data/trainingPrograms';
import type { SmartTrainingProgram } from '@/lib/smartPlanGenerator';
import type { EquipmentType, FatigueLevel, InjuryArea } from '@/types/exercise-metadata';
import type { ExperienceLevel, Gender, MuscleGroup, PersonalMax, TrainingGoal, TrainingIntensity } from '@/types/training';

export interface TrainerUser {
  id?: string;
  gender: Gender;
  age?: number;
  weight?: number;
  experience: ExperienceLevel;
  weeklyTrainings?: number;
  weekIndex?: number;
}

export interface BuildWorkoutPlanInput {
  user: TrainerUser;
  goal: TrainingGoal;
  availableDays: WeekDay[];
  priorityMuscles: MuscleGroup[];
  injuries?: InjuryArea[];
  equipment?: EquipmentType[];
  fatigueLevel?: FatigueLevel;
  personalMaxes?: PersonalMax[];
  exerciseHistory?: string[];
  startDate?: Date;
  weeksAhead?: number;
  userState?: AdaptiveUserState;
}

export interface BulkTrainingSet {
  set_number: number;
  target_reps: number;
  target_weight: number | null;
  target_rest_seconds?: number;
}

export interface BulkTrainingExercise {
  exercise_id: string;
  exercise_name: string;
  order_index: number;
  sets: BulkTrainingSet[];
}

export interface BulkTrainingDay {
  date: string;
  name: string;
  intensity: Exclude<TrainingIntensity, 'rest'>;
  exercises: BulkTrainingExercise[];
}

export interface BuildWorkoutPlanResult {
  days: BulkTrainingDay[];
  program: SmartTrainingProgram;
  volumeDistribution: string;
  trace: {
    frequency: FrequencyPlan;
    split: SplitPlan;
    goal: GoalPlan;
    gender: GenderPlan;
    oneRM: OneRMPlan;
    rest: RestPlan;
    progression: ProgressionPlan;
    adaptive: AdaptivePlan;
    volumeBalance: VolumeBalancePlan;
  };
}

export interface FrequencyPlan {
  weeklyTrainings: number;
  selectedDays: WeekDay[];
}

export interface SplitPlan {
  splitType: SmartTrainingProgram['splitType'];
}

export interface GoalPlan {
  goal: TrainingGoal;
}

export interface GenderPlan {
  gender: Gender;
}

export interface OneRMPlan {
  personalMaxes: PersonalMax[];
}

export interface RestPlan {
  enabled: true;
}

export interface ProgressionPlan {
  enabled: true;
  cycleLength: 4;
  deloadWeek: 4;
  startWeekIndex: number;
}

export type AdaptiveDecisionType =
  | 'increase_load'
  | 'decrease_load'
  | 'adjust_rest'
  | 'adjust_frequency';

export interface AdaptiveUserState {
  avgRpe?: number;
  completedSets?: number;
  plannedSets?: number;
  missedWorkouts?: number;
  fatigue?: FatigueLevel;
  consistency?: number;
}

export interface AdaptiveDecision {
  type: AdaptiveDecisionType;
  multiplier?: number;
  reason: string;
}

export interface AdaptivePlan {
  enabled: boolean;
  decisions: AdaptiveDecision[];
}

export interface VolumeBalancePlan {
  volumeByMuscle: Partial<Record<MuscleGroup, number>>;
  bias: Partial<Record<MuscleGroup, number>>;
}
