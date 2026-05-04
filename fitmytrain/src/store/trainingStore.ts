import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, TrainingDay, PersonalMax, BodyMeasurement, WeightLogEntry, INTENSITY_PERCENT } from '@/types/training';
import { BASE_EXERCISES_FOR_PM, getExerciseById } from '@/data/exercises';

// Маппинг базовых упражнений с ПМ на связанные упражнения
const PM_EXERCISE_MAPPING: Record<string, string[]> = {
  'bench-press': ['bench-press', 'incline-bench-press', 'dumbbell-bench-press', 'incline-dumbbell-press', 'close-grip-bench'],
  'squat': ['squat', 'front-squat', 'hack-squat', 'leg-press'],
  'romanian-deadlift': ['romanian-deadlift', 'stiff-leg-deadlift', 'deadlift'],
  'weighted-pull-ups': ['weighted-pull-ups', 'pull-ups', 'lat-pulldown', 'barbell-row'],
};

// Найти базовое упражнение для данного упражнения
function findBaseExerciseForPM(exerciseId: string): string | null {
  for (const [baseEx, relatedExs] of Object.entries(PM_EXERCISE_MAPPING)) {
    if (relatedExs.includes(exerciseId)) {
      return baseEx;
    }
  }
  return null;
}

// Вычислить рабочий вес на основе ПМ и интенсивности
function calculateWorkingWeightFromPM(pm: number, intensity: 'easy' | 'medium' | 'hard'): number {
  const range = INTENSITY_PERCENT[intensity];
  const avgPercent = (range.min + range.max) / 2;
  return Math.round((pm * avgPercent / 100) / 2.5) * 2.5;
}

interface UserPMData {
  pmLastUpdated: string | null;
}

interface TrainingState {
  users: User[];
  currentUserId: string | null;
  trainingDays: TrainingDay[];
  personalMaxes: PersonalMax[];
  userPMData: Record<string, UserPMData>;
  bodyMeasurements: BodyMeasurement[];
  weightLogs: WeightLogEntry[];

  // User actions
  addUser: (user: User) => boolean;
  setCurrentUser: (userId: string) => void;
  getCurrentUser: () => User | null;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  deleteAllUsers: () => void;
  
  // Plan change actions
  clearCurrentUserPlan: () => void;

  // Training day actions
  addTrainingDay: (day: TrainingDay) => void;
  updateTrainingDay: (dayId: string, updates: Partial<TrainingDay>) => void;
  getTrainingDaysForMonth: (year: number, month: number) => TrainingDay[];

  // Personal max actions
  updatePersonalMax: (pm: Omit<PersonalMax, 'userId'>) => void;
  getPersonalMax: (exerciseId: string) => PersonalMax | null;
  getCurrentUserPersonalMaxes: () => PersonalMax[];
  getPMLastUpdated: () => string | null;
  resetPMTimer: () => void;

  // Body measurements actions
  addBodyMeasurement: (measurement: Omit<BodyMeasurement, 'id' | 'userId' | 'createdAt'>) => void;
  getBodyMeasurements: () => BodyMeasurement[];
  deleteBodyMeasurement: (id: string) => void;

  // Weight log actions
  logWeight: (exerciseId: string, weight: number, reps: number, date: string) => void;
  getWeightLogs: (exerciseId?: string) => WeightLogEntry[];
  getExercisesWithLogs: () => string[];
  getLastLoggedWeight: (exerciseId: string) => number | null;
}

const MAX_USERS = 5;

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,
      trainingDays: [],
      personalMaxes: [],
      userPMData: {},
      bodyMeasurements: [],
      weightLogs: [],

      addUser: (user) => {
        const { users } = get();
        if (users.length >= MAX_USERS) {
          return false;
        }
        set({ users: [...users, user] });
        return true;
      },

      setCurrentUser: (userId) => {
        set({ currentUserId: userId });
      },

      getCurrentUser: () => {
        const { users, currentUserId } = get();
        return users.find(u => u.id === currentUserId) || null;
      },

      updateUser: (userId, updates) => {
        set(state => ({
          users: state.users.map(u => 
            u.id === userId ? { ...u, ...updates } : u
          ),
        }));
      },

      deleteUser: (userId) => {
        set(state => ({
          users: state.users.filter(u => u.id !== userId),
          currentUserId: state.currentUserId === userId ? null : state.currentUserId,
          personalMaxes: state.personalMaxes.filter(pm => pm.userId !== userId),
          bodyMeasurements: state.bodyMeasurements.filter(bm => bm.userId !== userId),
          weightLogs: state.weightLogs.filter(wl => wl.userId !== userId),
          trainingDays: state.trainingDays.filter(td => td.userId !== userId),
        }));
      },

      deleteAllUsers: () => {
        set({
          users: [],
          currentUserId: null,
          trainingDays: [],
          personalMaxes: [],
          userPMData: {},
          bodyMeasurements: [],
          weightLogs: [],
        });
      },

      clearCurrentUserPlan: () => {
        const { currentUserId } = get();
        if (!currentUserId) return;
        set(state => ({
          trainingDays: state.trainingDays.filter(td => td.userId !== currentUserId),
        }));
      },

      addTrainingDay: (day) => {
        set(state => ({
          trainingDays: [...state.trainingDays, day],
        }));
      },

      updateTrainingDay: (dayId, updates) => {
        set(state => ({
          trainingDays: state.trainingDays.map(d =>
            d.id === dayId ? { ...d, ...updates } : d
          ),
        }));
      },

      getTrainingDaysForMonth: (year, month) => {
        const { trainingDays } = get();
        return trainingDays.filter(d => {
          const date = new Date(d.date);
          return date.getFullYear() === year && date.getMonth() === month;
        });
      },

      updatePersonalMax: (pm) => {
        const { currentUserId, personalMaxes, userPMData, trainingDays } = get();
        if (!currentUserId) return;

        const pmWithUser: PersonalMax = {
          ...pm,
          userId: currentUserId,
        };

        const existing = personalMaxes.findIndex(
          p => p.exerciseId === pm.exerciseId && p.userId === currentUserId
        );

        const updatedPMData = {
          ...userPMData,
          [currentUserId]: { pmLastUpdated: new Date().toISOString() }
        };

        // Получить список связанных упражнений для обновления
        const relatedExercises = PM_EXERCISE_MAPPING[pm.exerciseId] || [pm.exerciseId];
        
        // Обновить веса в незавершённых тренировках
        const today = new Date().toISOString().split('T')[0];
        const updatedTrainingDays = trainingDays.map(day => {
          // Не обновляем завершённые тренировки и прошедшие дни
          if (day.completed || day.date < today) {
            return day;
          }

          const intensity = day.intensity;
          if (intensity === 'rest') {
            return day;
          }

          const updatedExercises = day.exercises.map(exercise => {
            // Проверяем, относится ли упражнение к группе базовых ПМ
            if (!relatedExercises.includes(exercise.exerciseId)) {
              return exercise;
            }

            // Вычисляем новый рабочий вес
            const newWeight = calculateWorkingWeightFromPM(pm.calculatedPM, intensity);

            // Обновляем веса только в незавершённых подходах
            const updatedSets = exercise.sets.map(set => {
              if (set.completed) {
                return set;
              }
              return { ...set, targetWeight: newWeight };
            });

            return { ...exercise, sets: updatedSets };
          });

          return { ...day, exercises: updatedExercises };
        });

        if (existing >= 0) {
          const updated = [...personalMaxes];
          updated[existing] = pmWithUser;
          set({ 
            personalMaxes: updated, 
            userPMData: updatedPMData,
            trainingDays: updatedTrainingDays,
          });
        } else {
          set({ 
            personalMaxes: [...personalMaxes, pmWithUser],
            userPMData: updatedPMData,
            trainingDays: updatedTrainingDays,
          });
        }
      },

      getPersonalMax: (exerciseId) => {
        const { personalMaxes, currentUserId } = get();
        if (!currentUserId) return null;
        return personalMaxes.find(
          p => p.exerciseId === exerciseId && p.userId === currentUserId
        ) || null;
      },

      getCurrentUserPersonalMaxes: () => {
        const { personalMaxes, currentUserId } = get();
        if (!currentUserId) return [];
        return personalMaxes.filter(p => p.userId === currentUserId);
      },

      getPMLastUpdated: () => {
        const { userPMData, currentUserId } = get();
        if (!currentUserId) return null;
        return userPMData[currentUserId]?.pmLastUpdated || null;
      },

      resetPMTimer: () => {
        const { currentUserId, userPMData } = get();
        if (!currentUserId) return;
        set({
          userPMData: {
            ...userPMData,
            [currentUserId]: { pmLastUpdated: new Date().toISOString() }
          }
        });
      },

      // Body measurements
      addBodyMeasurement: (measurement) => {
        const { currentUserId, bodyMeasurements } = get();
        if (!currentUserId) return;

        const newMeasurement: BodyMeasurement = {
          id: crypto.randomUUID(),
          userId: currentUserId,
          ...measurement,
          createdAt: new Date().toISOString(),
        };

        set({ bodyMeasurements: [...bodyMeasurements, newMeasurement] });
      },

      getBodyMeasurements: () => {
        const { bodyMeasurements, currentUserId } = get();
        if (!currentUserId) return [];
        return bodyMeasurements
          .filter(bm => bm.userId === currentUserId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      deleteBodyMeasurement: (id) => {
        const { currentUserId, bodyMeasurements } = get();
        if (!currentUserId) return;
        set({
          bodyMeasurements: bodyMeasurements.filter(
            bm => !(bm.id === id && bm.userId === currentUserId)
          )
        });
      },

      // Weight logs
      logWeight: (exerciseId, weight, reps, date) => {
        const { currentUserId, weightLogs } = get();
        if (!currentUserId) return;

        const newLog: WeightLogEntry = {
          id: crypto.randomUUID(),
          userId: currentUserId,
          exerciseId,
          weight,
          reps,
          date,
          createdAt: new Date().toISOString(),
        };

        set({ weightLogs: [...weightLogs, newLog] });
      },

      getWeightLogs: (exerciseId) => {
        const { weightLogs, currentUserId } = get();
        if (!currentUserId) return [];
        
        let logs = weightLogs.filter(wl => wl.userId === currentUserId);
        if (exerciseId) {
          logs = logs.filter(wl => wl.exerciseId === exerciseId);
        }
        
        return logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },

      getExercisesWithLogs: () => {
        const { weightLogs, currentUserId } = get();
        if (!currentUserId) return [];
        
        const userLogs = weightLogs.filter(wl => wl.userId === currentUserId);
        const exerciseIds = [...new Set(userLogs.map(wl => wl.exerciseId))];
        return exerciseIds;
      },

      getLastLoggedWeight: (exerciseId: string) => {
        const { weightLogs, currentUserId } = get();
        if (!currentUserId) return null;
        
        const logs = weightLogs
          .filter(wl => wl.userId === currentUserId && wl.exerciseId === exerciseId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return logs.length > 0 ? logs[0].weight : null;
      },
    }),
    {
      name: 'training-storage',
    }
  )
);
