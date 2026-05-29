import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTrainingDays, TrainingDayWithExercises, ExerciseSet } from '@/hooks/useTrainingDays';
import { usePersonalMaxes } from '@/hooks/usePersonalMaxes';
import { useWeightLogs } from '@/hooks/useWeightLogs';
import { useProfile } from '@/hooks/useProfile';
import { useTrainingModifications } from '@/hooks/useTrainingModifications';
import { INTENSITY_LABELS, MUSCLE_GROUP_LABELS } from '@/types/training';
import { getExerciseById, getExercisesByMuscle } from '@/data/exercises';
import { getExtendedExerciseById, getNormalizedExerciseById } from '@/data/exercisesExtended';
import { getUnifiedExerciseForId } from '@/data/exercisesUnified';
import { calculateWorkingWeight, generateFeedback, calculatePM } from '@/lib/calculations';
import { calculateWeightFromPM, getExerciseCoefficient, calculateBodyweightReps, isAssistedExercise, calculateEffectiveWeight, calculateAssistanceFromEffective, getExerciseWeightUnitLabel, getExerciseWeightUnitSuffix } from '@/lib/weightConversion';
import { calculateAdjustedWeight, type RIRLevel, type TrainingType } from '@/lib/rirWeightAdjustment';
import { checkPMUpdate, getPMUpdateMessage } from '@/lib/pmAutoUpdate';
import { formatWeight, isValidWeight } from '@/lib/weightFormat';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ExerciseAlternativesDialog } from '@/components/ExerciseAlternativesDialog';
import { RIRSelector } from '@/components/RIRSelector';
import { ExerciseSummary } from '@/components/ExerciseSummary';
import { RestTimer } from '@/components/RestTimer';
import { calculateRestTime } from '@/lib/restTimerEngine';
import { Check, Minus, Plus, RefreshCw, Trash2, X, Loader2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type TrainingIntensity = 'easy' | 'medium' | 'hard' | 'rest';

const CATEGORY_SORT_PRIORITY: Record<string, number> = {
  compound: 1,
  semi_compound: 2,
  secondary: 3,
  isolation: 4,
  activation: 5,
};

function getExerciseCategory(exerciseId: string): string {
  const norm = getNormalizedExerciseById(exerciseId);
  return norm?.category ?? 'isolation';
}

interface LocalExercise {
  id: string;
  plannedExerciseId?: string; // DB planned_exercises.id, undefined for new
  slotIndex: number; // Stable position index for modification matching
  exerciseId: string;
  exerciseName: string;
  completed: boolean;
  sets: LocalSet[];
}

interface LocalSet {
  id: string;
  dbId?: string; // ID from database if exists
  setNumber: number;
  targetReps: number;
  /** Working weight in kg. `null` means "no weight" — for bodyweight-only or unset optional weight. */
  targetWeight: number | null;
  actualReps?: number;
  actualWeight?: number;
  completed: boolean;
  rir?: RIRLevel;
}

interface RIRPrompt {
  exerciseLocalId: string;
  setId: string;
  exerciseName: string;
  setNumber: number;
  weight: number | null;
  reps: number;
}

interface TrainingDayViewProps {
  date: Date;
  existingDay?: TrainingDayWithExercises;
  onClose: () => void;
}

export function TrainingDayView({ date, existingDay, onClose }: TrainingDayViewProps) {
  const { createTrainingDay, updateTrainingDay, updatePlannedExercise, updateExerciseSet, isCreating } = useTrainingDays();
  const { getPersonalMax, personalMaxes, upsertPersonalMax } = usePersonalMaxes();
  const { logWeight, getLastLoggedWeight, confirmLogsByDate } = useWeightLogs();
  const { profile } = useProfile();
  const { 
    useModificationsForDay,
    allModifications,
    createModification,
  } = useTrainingModifications();
  
  const [intensity, setIntensity] = useState<TrainingIntensity>(existingDay?.intensity || 'medium');
  const [exercises, setExercises] = useState<LocalExercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [alternativesDialogExercise, setAlternativesDialogExercise] = useState<{id: string; exerciseId: string; weight: number} | null>(null);
  const [expandedTechnique, setExpandedTechnique] = useState<string | null>(null);
  const [rirPrompt, setRirPrompt] = useState<RIRPrompt | null>(null);
  const [exerciseSummaries, setExerciseSummaries] = useState<Record<string, { lastRIR: RIRLevel; nextWeight: number; currentWeight: number }>>({});
  const [restTimer, setRestTimer] = useState<{
    totalSeconds: number;
    nextWeight: number | null;
    exerciseName: string;
    nextSetNumber: number;
  } | null>(null);

  /**
   * Per-set string buffer for the weight input.
   * Why a string + a buffer instead of `value={number ?? ''}`:
   *  - lets the user type intermediate states like "1.", "0.", "," without React
   *    re-rendering a normalized number that would jump the caret;
   *  - the canonical numeric value still lives in `set.targetWeight` (number | null)
   *    and is committed on blur after normalization (rounded to 0.5, min 0.5).
   */
  const [weightInputBuffer, setWeightInputBuffer] = useState<Record<string, string>>({});
  /** Allowed in-progress input: empty, digits, optional single dot/comma + digits. */
  const WEIGHT_INPUT_REGEX = /^\d{0,4}([.,]\d{0,2})?$/;

  const moveCaretToInputEnd = (input: HTMLInputElement) => {
    const end = input.value.length;
    requestAnimationFrame(() => {
      input.setSelectionRange(end, end);
    });
  };

  const personalMaxesSignature = useMemo(() => (
    personalMaxes
      .map(pm => `${pm.exercise_id}:${pm.estimated_1rm ?? pm.weight}:${pm.reps}:${pm.updated_at}`)
      .sort()
      .join('|')
  ), [personalMaxes]);

  const exercisePickerGroups = useMemo(() => (
    Object.entries(MUSCLE_GROUP_LABELS)
      .map(([muscleGroup, label]) => ({
        muscleGroup,
        label,
        exercises: getExercisesByMuscle(muscleGroup as keyof typeof MUSCLE_GROUP_LABELS)
          .slice()
          .sort((a, b) => {
            if (a.type !== b.type) return a.type === 'compound' ? -1 : 1;
            return a.name.localeCompare(b.name, 'ru');
          }),
      }))
      .filter(group => group.exercises.length > 0)
  ), []);
  
  // Track the latest loaded data snapshot to prevent recalculation loops.
  const loadedDataKeyRef = useRef<string | null>(null);
  
  // Track pending modifications to save on "Save" button
  // Now keyed by slot_index for stable identification
  const pendingModificationsRef = useRef<Array<{
    modification_type: 'replace_exercise' | 'add_exercise' | 'delete_exercise' | 'change_weight' | 'change_sets';
    original_exercise_id?: string;
    new_exercise_id?: string;
    new_exercise_name?: string;
    new_weight?: number;
    new_sets_count?: number;
    order_index?: number; // Used as slot_index for replace/delete/change operations
    target_reps?: number;
  }>>([]);
  
  // Get day name for modifications
  const dayName = existingDay?.name || `Тренировка ${date.toISOString().split('T')[0]}`;
  
  // Fetch modifications for this day type
  const { data: modifications = [] } = useModificationsForDay(dayName);

  // Count pump exercises for limit tracking
  const pumpCount = useMemo(() => {
    return exercises.filter(e => {
      const ext = getExtendedExerciseById(e.exerciseId);
      // Check if this exercise was chosen as a pump alternative
      return ext?.alternativesWithTags?.some(alt => alt.tag === 'pump' && alt.exerciseId === e.exerciseId);
    }).length;
  }, [exercises]);
  const [isSaving, setIsSaving] = useState(false);

  const dateStr = date.toISOString().split('T')[0];
  const isRest = intensity === 'rest';

  // Initialize exercises from existing day and apply modifications
  useEffect(() => {
    if (!existingDay?.planned_exercises) return;

    const loadKey = [
      existingDay.id,
      existingDay.is_completed ? 'completed' : 'open',
      intensity,
      profile?.weight ?? 'no-bodyweight',
      personalMaxesSignature,
      modifications.map(mod => `${mod.id}:${mod.created_at}`).join('|'),
    ].join('::');

    if (loadedDataKeyRef.current === loadKey) return;
    loadedDataKeyRef.current = loadKey;
    
    let mapped: LocalExercise[] = existingDay.planned_exercises.map((pe, index) => {
      // Resolve exercise flags: bodyweight-only (no input) / optional external weight (no autofill)
      const exInfo = getExerciseById(pe.exercise_id);
      const isBodyweightOnly = exInfo?.isBodyweightOnly ?? false;
      const allowsExternalWeight = exInfo?.allowsExternalWeight === true;
      const shouldAutofillWeight = !isBodyweightOnly && !allowsExternalWeight;

      // Recalculate weight based on current PM, intensity, AND exercise coefficient
      const pm = getPersonalMax(pe.exercise_id);
      let calculatedWeight: number | null = null;
      let calculatedReps: number | null = null;
      
      if (shouldAutofillWeight && pm && intensity !== 'rest') {
        // Get intensity multiplier range
        const intensityRanges = { easy: 0.675, medium: 0.75, hard: 0.825 };
        const multiplier = intensityRanges[intensity];
        
        // Use coefficient-aware calculation with raw PM values for correct Epley
        calculatedWeight = calculateWeightFromPM(pe.exercise_id, pm.estimated_1rm ?? calculatePM(pm.weight, pm.reps), multiplier, profile?.weight, pm.weight, pm.reps);
        
        // For bodyweight exercises (pull-ups, chin-ups): recalculate reps based on capacity
        // Pass raw weight & reps (not estimated_1rm) for correct Epley on total load
        if (profile?.weight) {
          calculatedReps = calculateBodyweightReps(pe.exercise_id, pm.weight, pm.reps, profile.weight, intensity);
        }
      }
      
      return {
        id: pe.id,
        plannedExerciseId: pe.id, // Track DB id for sync
        slotIndex: pe.order_index ?? index, // Use order_index as stable slot identifier
        exerciseId: pe.exercise_id,
        exerciseName: pe.exercise_name,
        completed: pe.exercise_sets.every(s => s.is_completed),
        sets: pe.exercise_sets
          .sort((a, b) => a.set_number - b.set_number)
          .map(s => {
            // For completed sets, keep actual values
            // For uncompleted sets, use recalculated weight/reps if PM exists
            const shouldRecalculate = !s.is_completed && calculatedWeight !== null;
            // For bodyweight exercises with no added weight, always prefer calculatedReps
            const isBodyweightNoWeight = shouldRecalculate && calculatedWeight === 0;
            const shouldRecalcReps = !s.is_completed && (calculatedReps !== null || isBodyweightNoWeight);

            // Sanitize weight: bw-only/optional must never carry an autofilled or 0 artifact
            const sanitizedWeight = (isBodyweightOnly || allowsExternalWeight)
              ? (isValidWeight(s.target_weight) ? s.target_weight : null)
              : (shouldRecalculate ? calculatedWeight : (s.target_weight ?? null));

            return {
              id: crypto.randomUUID(),
              dbId: s.id,
              setNumber: s.set_number,
              targetReps: shouldRecalcReps ? calculatedReps : s.target_reps,
              targetWeight: sanitizedWeight,
              actualReps: s.actual_reps || undefined,
              actualWeight: s.actual_weight || undefined,
              completed: s.is_completed,
            };
          }),
      };
    });
    
    // Apply saved modifications to exercises (only for uncompleted days)
    // Now matching by order_index (slot) instead of exerciseId for stability
    if (!existingDay.is_completed && modifications.length > 0) {
      for (const mod of modifications) {
        switch (mod.modification_type) {
          case 'replace_exercise':
            // Match by order_index (slot) if available, fallback to exerciseId for legacy
            if (mod.new_exercise_id && mod.new_exercise_name) {
              mapped = mapped.map(e => {
                const matchesBySlot = mod.order_index !== null && e.slotIndex === mod.order_index;
                const matchesByExercise = mod.original_exercise_id && e.exerciseId === mod.original_exercise_id;
                
                if (!matchesBySlot && !matchesByExercise) return e;
                
                const newWeight = mod.new_weight ?? e.sets[0]?.targetWeight ?? null;
                return {
                  ...e,
                  exerciseId: mod.new_exercise_id!,
                  exerciseName: mod.new_exercise_name!,
                  sets: e.sets.map(s => ({ ...s, targetWeight: newWeight })),
                };
              });
            }
            break;
            
          case 'delete_exercise':
            // Match by order_index or exerciseId
            if (mod.order_index !== null || mod.original_exercise_id) {
              mapped = mapped.filter(e => {
                const matchesBySlot = mod.order_index !== null && e.slotIndex === mod.order_index;
                const matchesByExercise = mod.original_exercise_id && e.exerciseId === mod.original_exercise_id;
                return !matchesBySlot && !matchesByExercise;
              });
            }
            break;
            
          case 'add_exercise':
            if (mod.new_exercise_id && mod.new_exercise_name) {
              const alreadyExists = mapped.some(e => e.exerciseId === mod.new_exercise_id);
              if (!alreadyExists) {
                const setsCount = mod.new_sets_count || 3;
                const targetReps = mod.target_reps || 10;
                const targetWeight: number | null = mod.new_weight ?? null;
                const newSlotIndex = mod.order_index ?? mapped.length;

                mapped.push({
                  id: crypto.randomUUID(),
                  slotIndex: newSlotIndex,
                  exerciseId: mod.new_exercise_id,
                  exerciseName: mod.new_exercise_name,
                  completed: false,
                  sets: Array.from({ length: setsCount }, (_, i) => ({
                    id: crypto.randomUUID(),
                    setNumber: i + 1,
                    targetReps,
                    targetWeight,
                    completed: false,
                  })),
                });
              }
            }
            break;
            
          case 'change_weight':
            if (mod.new_weight !== null) {
              mapped = mapped.map(e => {
                const matchesBySlot = mod.order_index !== null && e.slotIndex === mod.order_index;
                const matchesByExercise = mod.original_exercise_id && e.exerciseId === mod.original_exercise_id;
                
                if (!matchesBySlot && !matchesByExercise) return e;

                // Skip weight modification for bodyweight-only or optional-weight exercises
                const exInfo = getExerciseById(e.exerciseId);
                if (exInfo?.isBodyweightOnly || exInfo?.allowsExternalWeight === true) {
                  return e;
                }

                // For isolation exercises (no PM coefficient), scale by intensity
                const coef = getExerciseCoefficient(e.exerciseId);
                let adjustedWeight = mod.new_weight!;
                if (!coef && intensity !== 'rest') {
                  const isolationIntensityMultipliers: Record<string, number> = {
                    easy: 0.85,
                    medium: 1.0,
                    hard: 1.15,
                  };
                  const multiplier = isolationIntensityMultipliers[intensity] || 1.0;
                  adjustedWeight = Math.round((mod.new_weight! * multiplier) / 2.5) * 2.5;
                }
                
                return {
                  ...e,
                  sets: e.sets.map(s => ({ ...s, targetWeight: adjustedWeight })),
                };
              });
            }
            break;
            
          case 'change_sets':
            if (mod.new_sets_count !== null) {
              mapped = mapped.map(e => {
                const matchesBySlot = mod.order_index !== null && e.slotIndex === mod.order_index;
                const matchesByExercise = mod.original_exercise_id && e.exerciseId === mod.original_exercise_id;
                
                if (!matchesBySlot && !matchesByExercise) return e;
                const currentSetsCount = e.sets.length;
                const targetSetsCount = mod.new_sets_count!;
                
                if (targetSetsCount > currentSetsCount) {
                  // Add sets
                  const lastSet = e.sets[e.sets.length - 1];
                  const newSets = Array.from({ length: targetSetsCount - currentSetsCount }, (_, i) => ({
                    id: crypto.randomUUID(),
                    setNumber: currentSetsCount + i + 1,
                    targetReps: lastSet?.targetReps || 10,
                    targetWeight: lastSet?.targetWeight ?? null,
                    completed: false,
                  }));
                  return { ...e, sets: [...e.sets, ...newSets] };
                } else if (targetSetsCount < currentSetsCount) {
                  // Remove sets from the end
                  return { ...e, sets: e.sets.slice(0, targetSetsCount) };
                }
                return e;
              });
            }
            break;
        }
      }
    }
    
    setExercises(mapped);
  }, [existingDay, modifications, intensity, profile?.weight, personalMaxesSignature]);

  const handleAddExercise = (exerciseId: string) => {
    const exercise = getExerciseById(exerciseId);
    if (!exercise) return;

    const isBodyweightOnly = exercise.isBodyweightOnly ?? false;
    const allowsExternalWeight = exercise.allowsExternalWeight === true;
    const shouldAutofillWeight = !isBodyweightOnly && !allowsExternalWeight;

    let workingWeight: number | null = null;

    if (shouldAutofillWeight) {
      const pm = getPersonalMax(exerciseId);
      if (pm && intensity !== 'rest') {
        // Get intensity multiplier range
        const intensityRanges = { easy: 0.675, medium: 0.75, hard: 0.825 };
        const multiplier = intensityRanges[intensity];

        // Use coefficient-aware calculation with raw PM values for correct Epley
        const calc = calculateWeightFromPM(exerciseId, pm.estimated_1rm ?? calculatePM(pm.weight, pm.reps), multiplier, profile?.weight, pm.weight, pm.reps);
        workingWeight = isValidWeight(calc) ? calc : null;
      } else {
        const lastLogged = getLastLoggedWeight(exerciseId);
        workingWeight = isValidWeight(lastLogged) ? lastLogged : null;
      }
    }

    const newSlotIndex = exercises.length; // New exercise gets next slot index
    const newExercise: LocalExercise = {
      id: crypto.randomUUID(),
      slotIndex: newSlotIndex,
      exerciseId,
      exerciseName: exercise.name,
      completed: false,
      sets: [
        { id: crypto.randomUUID(), setNumber: 1, targetReps: 10, targetWeight: workingWeight, completed: false },
        { id: crypto.randomUUID(), setNumber: 2, targetReps: 10, targetWeight: workingWeight, completed: false },
        { id: crypto.randomUUID(), setNumber: 3, targetReps: 10, targetWeight: workingWeight, completed: false },
      ],
    };

    const allExercises = [...exercises, newExercise].map((ex, idx) => ({
      ...ex,
      _originalIndex: idx
    })) as (LocalExercise & { _originalIndex: number })[];

    const sorted = [...allExercises].sort((a, b) => {
      const catA = getExerciseCategory(a.exerciseId);
      const catB = getExerciseCategory(b.exerciseId);
      const priorityDiff =
        (CATEGORY_SORT_PRIORITY[catA] ?? 99) -
        (CATEGORY_SORT_PRIORITY[catB] ?? 99);
      if (priorityDiff !== 0) return priorityDiff;
      return a._originalIndex - b._originalIndex;
    });

    const withUpdatedSlots = sorted.map(({ _originalIndex, ...ex }, idx) => ({
      ...ex,
      slotIndex: idx,
    }));
    setExercises(withUpdatedSlots);
    setShowExercisePicker(false);

    const newExerciseIndex = withUpdatedSlots.findIndex(e => e.id === newExercise.id);

    // Queue modification for saving later (use slotIndex for stable identification)
    if (existingDay) {
      pendingModificationsRef.current.push({
        modification_type: 'add_exercise',
        new_exercise_id: exerciseId,
        new_exercise_name: exercise.name,
        order_index: newExerciseIndex,
        new_weight: workingWeight ?? undefined,
        target_reps: 10,
        new_sets_count: 3,
      });
    }
  };

  const handleRemoveExercise = (exerciseLocalId: string) => {
    const exerciseToRemove = exercises.find(e => e.id === exerciseLocalId);
    setExercises(exercises.filter(e => e.id !== exerciseLocalId));
    
    // Queue modification for saving later (use slotIndex for stable identification)
    if (existingDay && exerciseToRemove) {
      pendingModificationsRef.current.push({
        modification_type: 'delete_exercise',
        original_exercise_id: exerciseToRemove.exerciseId,
        order_index: exerciseToRemove.slotIndex, // Include slot for stable matching
      });
      toast.success(`Упражнение "${exerciseToRemove.exerciseName}" будет удалено после сохранения`);
    }
  };

  const handleToggleSet = async (exerciseLocalId: string, setId: string) => {
    const pe = exercises.find(e => e.id === exerciseLocalId);
    if (!pe) return;
    
    const set = pe.sets.find(s => s.id === setId);
    if (!set) return;
    
    const isCompleting = !set.completed;
    
    if (isCompleting) {
      // Show RIR selector instead of immediately completing
      setRirPrompt({
        exerciseLocalId,
        setId,
        exerciseName: pe.exerciseName,
        setNumber: set.setNumber,
        weight: set.targetWeight,
        reps: set.targetReps,
      });
    } else {
      // Uncompleting - just toggle back
      setExercises(exercises.map(e => {
        if (e.id !== exerciseLocalId) return e;
        const updatedSets = e.sets.map(s => 
          s.id === setId ? { ...s, completed: false, rir: undefined, actualReps: undefined, actualWeight: undefined } : s
        );
        return { ...e, sets: updatedSets, completed: false };
      }));
    }
  };

  const handleRIRSelected = async (rir: RIRLevel) => {
    if (!rirPrompt) return;
    const { exerciseLocalId, setId } = rirPrompt;

    const pe = exercises.find(e => e.id === exerciseLocalId);
    if (!pe) { setRirPrompt(null); return; }

    const set = pe.sets.find(s => s.id === setId);
    if (!set) { setRirPrompt(null); return; }

    // Calculate adjusted weight for next set (only when current weight is valid)
    const trainingType = intensity as string;
    const isAdjustable = isValidWeight(set.targetWeight) &&
      (trainingType === 'easy' || trainingType === 'medium' || trainingType === 'hard');
    const adjustedWeight: number | null = isAdjustable
      ? calculateAdjustedWeight(set.targetWeight as number, rir, trainingType as TrainingType)
      : set.targetWeight;

    // Update local state: complete set with RIR + adjust next uncompleted set weight
    setExercises(prev => prev.map(e => {
      if (e.id !== exerciseLocalId) return e;

      let foundCompleted = false;
      let nextSetAdjusted = false;
      const updatedSets = e.sets.map(s => {
        if (s.id === setId) {
          foundCompleted = true;
          return { ...s, completed: true, rir, actualReps: s.targetReps, actualWeight: s.targetWeight ?? undefined };
        }
        // Adjust next uncompleted set's weight
        if (foundCompleted && !nextSetAdjusted && !s.completed) {
          nextSetAdjusted = true;
          return { ...s, targetWeight: adjustedWeight };
        }
        return s;
      });

      const allCompleted = updatedSets.every(s => s.completed);

      // If all sets completed, store summary
      if (allCompleted && isValidWeight(set.targetWeight) && isValidWeight(adjustedWeight)) {
        setExerciseSummaries(prev => ({
          ...prev,
          [e.id]: { lastRIR: rir, nextWeight: adjustedWeight, currentWeight: set.targetWeight as number },
        }));
      }

      return { ...e, sets: updatedSets, completed: allCompleted };
    }));

    // Show adjusted weight toast if different
    if (
      isValidWeight(adjustedWeight) &&
      isValidWeight(set.targetWeight) &&
      adjustedWeight !== set.targetWeight
    ) {
      const diff = adjustedWeight - (set.targetWeight as number);
      toast.info(`Следующий подход: ${adjustedWeight} кг (${diff > 0 ? '+' : ''}${diff} кг)`);
    }

    // Save to DB
    if (set.dbId) {
      try {
        await updateExerciseSet({
          id: set.dbId,
          is_completed: true,
          actual_reps: set.targetReps,
          actual_weight: set.targetWeight,
          rir: rir,
        } as any);

        // Skip weight log for bodyweight-only exercises;
        // for other exercises, log only when weight is a real positive number.
        const exerciseInfo = getExerciseById(pe.exerciseId);
        const isBodyweightOnly = exerciseInfo?.isBodyweightOnly ?? false;

        if (!isBodyweightOnly && isValidWeight(set.targetWeight)) {
          // For assisted exercises, log effective weight (bodyweight - assistance)
          const isAssisted = isAssistedExercise(pe.exerciseId);
          const loggedWeight = isAssisted && profile?.weight
            ? calculateEffectiveWeight(set.targetWeight as number, profile.weight)
            : (set.targetWeight as number);

          await logWeight({
            exercise_id: pe.exerciseId,
            weight: loggedWeight,
            reps: set.targetReps,
            logged_at: dateStr,
            is_confirmed: false,
            rir,
          });
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to update set:', error);
        }
      }
    }
    
    setRirPrompt(null);

    // Launch rest timer if there are remaining sets in this or next exercise
    const updatedExercises = exercises.map(e => {
      if (e.id !== exerciseLocalId) return e;
      return { ...e, sets: e.sets.map(s => s.id === setId ? { ...s, completed: true } : s) };
    });
    
    // Find next uncompleted set: prioritise current exercise, then fall back to queue order
    const currentEx = updatedExercises.find(e => e.id === exerciseLocalId);
    let nextSetInfo: { exerciseName: string; setNumber: number; weight: number | null } | null = null;

    // 1. Check current exercise first (user is actively doing it)
    if (currentEx) {
      const nextSet = currentEx.sets.find(s => !s.completed);
      if (nextSet) {
        nextSetInfo = { exerciseName: currentEx.exerciseName, setNumber: nextSet.setNumber, weight: nextSet.targetWeight };
      }
    }

    // 2. If current exercise is fully done, find next uncompleted exercise in order
    if (!nextSetInfo) {
      for (const ex of updatedExercises) {
        if (ex.id === exerciseLocalId) continue;
        const nextSet = ex.sets.find(s => !s.completed);
        if (nextSet) {
          nextSetInfo = { exerciseName: ex.exerciseName, setNumber: nextSet.setNumber, weight: nextSet.targetWeight };
          break;
        }
      }
    }

    if (nextSetInfo) {
      // Determine exercise category for rest calculation
      const normEx = getNormalizedExerciseById(pe.exerciseId);
      const legacyEx = getExerciseById(pe.exerciseId);
      const exCategory = normEx?.category ?? (legacyEx?.type === 'compound' ? 'compound' : 'isolation');
      const exMuscle = normEx?.primaryMuscles?.[0] ?? legacyEx?.muscleGroup ?? 'chest';

      const restSeconds = calculateRestTime({
        exerciseCategory: exCategory as any,
        trainingType: (intensity === 'rest' ? 'medium' : intensity) as TrainingType,
        rir,
        experience: profile?.experience ?? 'intermediate',
        muscleGroup: exMuscle as any,
      });

      setRestTimer({
        totalSeconds: restSeconds,
        nextWeight: nextSetInfo.weight,
        exerciseName: nextSetInfo.exerciseName,
        nextSetNumber: nextSetInfo.setNumber,
      });
    }
  };

  const handleAddSet = (exerciseLocalId: string) => {
    const exercise = exercises.find(e => e.id === exerciseLocalId);
    if (!exercise) return;
    
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: LocalSet = {
      id: crypto.randomUUID(),
      setNumber: exercise.sets.length + 1,
      targetReps: lastSet?.targetReps || 10,
      targetWeight: lastSet?.targetWeight ?? null,
      completed: false,
    };
    
    const newSetsCount = exercise.sets.length + 1;
    
    setExercises(exercises.map(e => {
      if (e.id !== exerciseLocalId) return e;
      return { ...e, sets: [...e.sets, newSet] };
    }));
    
    // Queue modification for saving later (use slotIndex for stable identification)
    if (existingDay) {
      pendingModificationsRef.current.push({
        modification_type: 'change_sets',
        original_exercise_id: exercise.exerciseId,
        order_index: exercise.slotIndex,
        new_sets_count: newSetsCount,
      });
    }
  };

  const handleRemoveSet = (exerciseLocalId: string, setId: string) => {
    const exercise = exercises.find(e => e.id === exerciseLocalId);
    if (!exercise || exercise.sets.length <= 1) return;
    
    const updatedSets = exercise.sets
      .filter(s => s.id !== setId)
      .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
    
    const newSetsCount = updatedSets.length;
    
    setExercises(exercises.map(e => {
      if (e.id !== exerciseLocalId) return e;
      return { 
        ...e, 
        sets: updatedSets,
        completed: updatedSets.length > 0 && updatedSets.every(s => s.completed),
      };
    }));
    
    // Queue modification for saving later (use slotIndex for stable identification)
    if (existingDay) {
      pendingModificationsRef.current.push({
        modification_type: 'change_sets',
        original_exercise_id: exercise.exerciseId,
        order_index: exercise.slotIndex,
        new_sets_count: newSetsCount,
      });
    }
  };

  const handleChangeReps = (exerciseLocalId: string, setId: string, delta: number) => {
    setExercises(exercises.map(e => {
      if (e.id !== exerciseLocalId) return e;
      
      return {
        ...e,
        sets: e.sets.map(s => {
          if (s.id !== setId) return s;
          const newReps = Math.max(1, Math.min(50, s.targetReps + delta));
          return { ...s, targetReps: newReps };
        }),
      };
    }));
  };

  const handleChangeWeight = (exerciseLocalId: string, setId: string, delta: number) => {
    setExercises(exercises.map(e => {
      if (e.id !== exerciseLocalId) return e;

      return {
        ...e,
        sets: e.sets.map(s => {
          if (s.id !== setId) return s;
          const base = s.targetWeight ?? 0;
          const newWeight = Math.max(0, base + delta);
          return { ...s, targetWeight: newWeight > 0 ? newWeight : null };
        }),
      };
    }));
  };

  // Track weight changes for debounced queueing
  const weightChangeTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  /**
   * Set the working weight for a single set.
   * `weight === null` clears the field (used by the "0 / empty / invalid" path).
   */
  const handleSetWeight = (exerciseLocalId: string, setId: string, weight: number | null) => {
    const limitedWeight: number | null = weight == null ? null : Math.min(999, Math.max(0, weight));
    // Treat 0 as "no weight" — store as null, never as 0.
    const finalWeight: number | null = limitedWeight != null && limitedWeight > 0 ? limitedWeight : null;
    const exercise = exercises.find(e => e.id === exerciseLocalId);

    setExercises(exercises.map(e => {
      if (e.id !== exerciseLocalId) return e;

      return {
        ...e,
        sets: e.sets.map(s => {
          if (s.id !== setId) return s;
          return { ...s, targetWeight: finalWeight };
        }),
      };
    }));
    
    // Debounced queueing of weight change (wait 500ms after last change)
    // Now uses slotIndex for stable identification across exercise replacements
    if (existingDay && exercise) {
      const key = `${exercise.slotIndex}-weight`;
      if (weightChangeTimeoutRef.current[key]) {
        clearTimeout(weightChangeTimeoutRef.current[key]);
      }
      weightChangeTimeoutRef.current[key] = setTimeout(() => {
        // Remove any previous weight change for this slot
        pendingModificationsRef.current = pendingModificationsRef.current.filter(
          m => !(m.modification_type === 'change_weight' && m.order_index === exercise.slotIndex)
        );

        // If weight was cleared, queue a null change so it persists.
        if (finalWeight == null) {
          pendingModificationsRef.current.push({
            modification_type: 'change_weight',
            original_exercise_id: exercise.exerciseId,
            order_index: exercise.slotIndex,
            new_weight: undefined,
          });
          return;
        }

        // For isolation exercises (no PM coefficient), normalize weight to "medium" base
        const coef = getExerciseCoefficient(exercise.exerciseId);
        let normalizedWeight = finalWeight;
        if (!coef && intensity !== 'rest') {
          const isolationIntensityMultipliers: Record<string, number> = {
            easy: 0.85,
            medium: 1.0,
            hard: 1.15,
          };
          const currentMultiplier = isolationIntensityMultipliers[intensity] || 1.0;
          // Normalize to medium base: if user sets 12.5kg on easy (0.85x), base = 12.5 / 0.85 ≈ 14.7 → round to 15
          normalizedWeight = Math.round((finalWeight / currentMultiplier) / 2.5) * 2.5;
        }
        // Add new weight change with slotIndex (stored as medium-base weight)
        pendingModificationsRef.current.push({
          modification_type: 'change_weight',
          original_exercise_id: exercise.exerciseId,
          order_index: exercise.slotIndex,
          new_weight: normalizedWeight,
        });
      }, 500);
    }
  };

  const handleReplaceExercise = async (oldExerciseLocalId: string, newExerciseId: string, adjustedWeight?: number) => {
    const newExtendedExercise = getExtendedExerciseById(newExerciseId);
    const newUnifiedExercise = getUnifiedExerciseForId(newExerciseId);
    const newExerciseName = newExtendedExercise?.name ?? newUnifiedExercise?.name.ru;

    if (!newExerciseName) {
      toast.error('Упражнение не найдено в базе');
      return;
    }
    
    const oldExercise = exercises.find(e => e.id === oldExerciseLocalId);
    if (!oldExercise) return;
    
    // Update local state immediately for responsiveness
    setExercises(prev => prev.map(e => {
      if (e.id !== oldExerciseLocalId) return e;
      // If weight was adjusted, update all sets
      const updatedSets = adjustedWeight !== undefined 
        ? e.sets.map(s => ({ ...s, targetWeight: adjustedWeight }))
        : e.sets;
      return { ...e, exerciseId: newExerciseId, exerciseName: newExerciseName, sets: updatedSets };
    }));
    setAlternativesDialogExercise(null);
    
    // If this is an existing day with DB record, update in database
    if (existingDay && oldExercise.id) {
      try {
        await updatePlannedExercise({
          id: oldExercise.id,
          exercise_id: newExerciseId,
          exercise_name: newExerciseName,
        });
        
        // Update weights in exercise_sets if adjusted
        if (adjustedWeight !== undefined) {
          for (const set of oldExercise.sets) {
            if (set.dbId) {
              await updateExerciseSet({
                id: set.dbId,
                target_weight: adjustedWeight,
              });
            }
          }
        }
        
        // Queue modification for saving later (use slotIndex for stable identification)
        pendingModificationsRef.current.push({
          modification_type: 'replace_exercise',
          original_exercise_id: oldExercise.exerciseId,
          new_exercise_id: newExerciseId,
          new_exercise_name: newExerciseName,
          new_weight: adjustedWeight,
          order_index: oldExercise.slotIndex, // Use slot index for stable matching
        });
        
        toast.success(`Упражнение заменено на ${newExerciseName}`);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to update exercise in DB:', error);
        }
        toast.error('Не удалось сохранить замену');
      }
    }
  };

  const handleSave = async () => {
    if (!profile || isRest) {
      onClose();
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (existingDay) {
        // Update existing day — always mark as completed
        await updateTrainingDay({
          id: existingDay.id,
          intensity: intensity as 'easy' | 'medium' | 'hard',
          notes: existingDay.notes,
          is_completed: true,
          completed_at: new Date().toISOString(),
        });
        
        // Confirm all weight logs for this date
        await confirmLogsByDate(dateStr);
        
        // Save all pending modifications to database
        if (pendingModificationsRef.current.length > 0) {
          for (const mod of pendingModificationsRef.current) {
            await createModification({
              training_day_name: dayName,
              ...mod,
            });
          }
          pendingModificationsRef.current = [];
        }

        // === Exercise sync: insert new, delete removed, reorder ===
        const trainingDayId = existingDay?.id;
        if (trainingDayId) {
          const existingPlanned = existingDay?.planned_exercises ?? [];
          const exercisesWithIndex = exercises.map((ex, idx) => ({ ex, globalIndex: idx }));
          const newEntries = exercisesWithIndex.filter(({ ex }) => !ex.plannedExerciseId);

          const currentPlannedIds = exercises
            .filter(e => e.plannedExerciseId)
            .map(e => e.plannedExerciseId!);
          const removedIds = existingPlanned
            .map(pe => pe.id)
            .filter(id => !currentPlannedIds.includes(id));

          const reorderNeeded = exercises.some((ex, idx) =>
            ex.plannedExerciseId &&
            existingPlanned.find(pe => pe.id === ex.plannedExerciseId)?.order_index !== idx
          );

          if (newEntries.length > 0 || removedIds.length > 0 || reorderNeeded) {
            // Block 1: Insert new exercises (sequential for safe mapping)
            try {
              for (const { ex, globalIndex } of newEntries) {
                const { data: pe } = await supabase
                  .from('planned_exercises')
                  .insert({
                    training_day_id: trainingDayId,
                    exercise_id: ex.exerciseId,
                    exercise_name: ex.exerciseName,
                    order_index: globalIndex,
                  })
                  .select()
                  .single();

                if (pe) {
                  ex.plannedExerciseId = pe.id;
                  if (ex.sets.length > 0) {
                    await supabase.from('exercise_sets').insert(
                      ex.sets.map(s => ({
                        planned_exercise_id: pe.id,
                        set_number: s.setNumber,
                        target_reps: s.targetReps,
                        target_weight: isValidWeight(s.targetWeight) ? s.targetWeight : null,
                        actual_reps: s.actualReps || null,
                        actual_weight: isValidWeight(s.actualWeight) ? s.actualWeight : null,
                        is_completed: s.completed,
                      }))
                    );
                  }
                }
              }
            } catch (error) {
              console.error('Failed to insert new exercises:', error);
            }

            // Block 2: Delete removed exercises
            try {
              if (removedIds.length > 0) {
                await supabase.from('exercise_sets').delete()
                  .in('planned_exercise_id', removedIds);
                await supabase.from('planned_exercises').delete()
                  .in('id', removedIds);
              }
            } catch (error) {
              console.error('Failed to delete removed exercises:', error);
            }

            // Block 3: Reorder existing exercises
            try {
              if (reorderNeeded) {
                await Promise.all(
                  exercises
                    .filter(e => e.plannedExerciseId)
                    .map((ex, index) =>
                      supabase.from('planned_exercises')
                        .update({ order_index: index })
                        .eq('id', ex.plannedExerciseId!)
                    )
                );
              }
            } catch (error) {
              console.error('Failed to reorder exercises:', error);
            }
          }
        }

        // Auto-update PM based on RIR data — skip for bodyweight-only exercises
        for (const ex of exercises) {
          const exInfo = getExerciseById(ex.exerciseId);
          if (exInfo?.isBodyweightOnly) continue;

          const pm = getPersonalMax(ex.exerciseId);
          if (!pm) continue;

          const completedSets = ex.sets.filter(s => s.completed && s.rir !== undefined);
          if (completedSets.length === 0) continue;

          const lastSet = completedSets[completedSets.length - 1];
          if (!isValidWeight(lastSet.actualWeight) || lastSet.rir === undefined) continue;

          // For assisted exercises, use effective weight for PM calculation
          const isAssisted = isAssistedExercise(ex.exerciseId);
          const pmWeight = isAssisted && profile?.weight
            ? calculateEffectiveWeight(lastSet.actualWeight as number, profile.weight)
            : (lastSet.actualWeight as number);
          
          const result = checkPMUpdate({
            current1RM: pm.estimated_1rm || pm.weight,
            weight: pmWeight,
            reps: lastSet.actualReps || lastSet.targetReps,
            rir: lastSet.rir,
            consecutiveHardSessions: lastSet.rir === 0 ? 2 : 0, // simplified: just check current
            consecutiveGoodSessions: lastSet.rir >= 2 ? 2 : 0,
          });
          
          if (result.shouldUpdate) {
            try {
              await upsertPersonalMax({
                exercise_id: ex.exerciseId,
                weight: result.new1RM,
                reps: 1,
              });
              // Log PM change to history
              await (supabase as any).from('pm_update_log').insert({
                user_id: profile.user_id,
                exercise_id: ex.exerciseId,
                old_1rm: result.old1RM,
                new_1rm: result.new1RM,
                reason: result.reason,
              });
              const name = ex.exerciseName;
              toast.success(getPMUpdateMessage(name, result));
            } catch (e) {
              // silently fail PM update
            }
          }
        }
        
        toast.success('Тренировка сохранена');
      } else {
        // Create new training day
        await createTrainingDay({
          date: dateStr,
          name: `Тренировка ${dateStr}`,
          intensity: intensity as 'easy' | 'medium' | 'hard',
          exercises: exercises.map((e, idx) => ({
            exercise_id: e.exerciseId,
            exercise_name: e.exerciseName,
            order_index: idx,
            sets: e.sets.map(s => ({
              set_number: s.setNumber,
              target_reps: s.targetReps,
              target_weight: isValidWeight(s.targetWeight) ? s.targetWeight : null,
            })),
          })),
        });
      }
      onClose();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to save training day:', error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // handleCompleteDay removed — handleSave now always completes the day

  const formatDate = (d: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return d.toLocaleDateString('ru-RU', options);
  };

  const isLoading = isSaving || isCreating;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen p-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold capitalize">{formatDate(date)}</h2>
            {!existingDay && (
              <p className="text-muted-foreground text-sm">Планирование тренировки</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Intensity selector */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">Тип нагрузки</p>
          <div className="grid grid-cols-4 gap-2">
            {(['easy', 'medium', 'hard', 'rest'] as TrainingIntensity[]).map(int => (
              <button
                key={int}
                onClick={() => setIntensity(int)}
                className={cn(
                  'py-3 px-4 rounded-xl text-sm font-semibold transition-all',
                  intensity === int 
                    ? int === 'easy' ? 'bg-intensity-easy text-primary-foreground shadow-lg'
                    : int === 'medium' ? 'bg-intensity-medium text-primary-foreground shadow-lg'
                    : int === 'hard' ? 'bg-intensity-hard text-white shadow-lg'
                    : 'bg-intensity-rest text-foreground border-2 border-muted-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                )}
              >
                {INTENSITY_LABELS[int]}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises */}
        {!isRest && (
          <>
            <div className="space-y-4 mb-6">
              {exercises.map(pe => {
                // Use normalized database as primary source, fallback to extended/legacy for compatibility
                const normExercise = getNormalizedExerciseById(pe.exerciseId);
                const extExercise = getExtendedExerciseById(pe.exerciseId);
                const unifiedExercise = getUnifiedExerciseForId(pe.exerciseId);
                const legacyExercise = getExerciseById(pe.exerciseId);
                
                // Get display data from normalized DB, fallback to extended/legacy or stored name
                const exerciseName = unifiedExercise?.name.ru ?? normExercise?.name ?? extExercise?.name ?? legacyExercise?.name ?? pe.exerciseName;
                const muscleGroup = unifiedExercise?.primaryMuscles?.[0] ?? normExercise?.primaryMuscles?.[0] ?? extExercise?.muscleGroup ?? legacyExercise?.muscleGroup;
                const category = normExercise?.category ?? (legacyExercise?.type === 'compound' ? 'compound' : 'isolation');
                const isTimeBased = normExercise?.isTimeBased ?? extExercise?.isTimeBased ?? false;
                const isCompound = category === 'compound' || category === 'semi_compound';
                const isBodyweightOnly = legacyExercise?.isBodyweightOnly ?? normExercise?.isBodyweightOnly ?? false;
                const allowsExternalWeight = (legacyExercise?.allowsExternalWeight ?? normExercise?.allowsExternalWeight) === true;
                const isWeightEditable = !isBodyweightOnly;
                const isOptionalWeight = allowsExternalWeight;

                // Skip if we can't find any info about the exercise
                if (!exerciseName || !muscleGroup) return null;

                const exerciseDescription = unifiedExercise ? {
                  technique: unifiedExercise.instructions.keyPoints.length > 0
                    ? unifiedExercise.instructions.keyPoints
                    : [unifiedExercise.description],
                  endPoint: unifiedExercise.description,
                  focus: unifiedExercise.instructions.commonMistakes,
                } : extExercise?.description ?? null;
                const hasDescription = Boolean(exerciseDescription);
                const isExpanded = expandedTechnique === pe.id;
                const weightUnitLabel = getExerciseWeightUnitLabel(pe.exerciseId);
                const showPerLimbHint = isWeightEditable && !isTimeBased && weightUnitLabel.startsWith('на одну');
                const showBodyweightLoad = !isWeightEditable && !isTimeBased && Boolean(profile?.weight);

                return (
                  <div key={pe.id} className="exercise-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{exerciseName}</span>
                          {pe.completed && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                              Выполнено
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {MUSCLE_GROUP_LABELS[muscleGroup]} • {isCompound ? 'База' : 'Изоляция'}
                          </span>
                          {showPerLimbHint && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Вес: {weightUnitLabel}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {(() => {
                          const hasAlternatives = Boolean((extExercise?.alternativesWithTags && extExercise.alternativesWithTags.length > 0) || (unifiedExercise?.alternatives && unifiedExercise.alternatives.length > 0));
                          if (!hasAlternatives) return null;
                          
                          const validWeights = pe.sets.map(s => s.targetWeight).filter(isValidWeight);
                          const avgWeight: number | null = isBodyweightOnly || validWeights.length === 0
                            ? null
                            : Math.round(validWeights.reduce((sum, w) => sum + w, 0) / validWeights.length / 0.5) * 0.5;
                          
                          return (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setAlternativesDialogExercise({
                                id: pe.id,
                                exerciseId: pe.exerciseId,
                                weight: avgWeight ?? 0
                              })}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          );
                        })()}
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveExercise(pe.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Exercise Description */}
                    {hasDescription && exerciseDescription && (
                      <div className="mb-3 overflow-hidden rounded-lg border border-border/70 bg-secondary/35">
                        <button
                          type="button"
                          onClick={() => setExpandedTechnique(isExpanded ? null : pe.id)}
                          className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-secondary/60"
                          aria-expanded={isExpanded}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <Info className="h-4 w-4 shrink-0 text-primary" />
                            <span className="truncate text-sm font-medium">Описание и техника</span>
                          </span>
                          {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                        </button>
                        <div className={cn(
                          'grid transition-all duration-300 ease-in-out',
                          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        )}>
                          <div className="min-h-0 overflow-hidden">
                            <div className="space-y-3 border-t border-border/60 px-3 py-3 text-sm">
                              <div>
                                <p className="mb-1 font-semibold text-primary">Техника выполнения</p>
                                <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
                                  {exerciseDescription.technique.map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                              <div>
                                <p className="font-semibold text-primary">Описание</p>
                                <p className="text-muted-foreground">{exerciseDescription.endPoint}</p>
                              </div>
                              {exerciseDescription.focus.length > 0 && (
                                <div>
                                  <p className="mb-1 font-semibold text-primary">Частые ошибки</p>
                                  <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                                    {exerciseDescription.focus.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sets */}
                    <div className="space-y-2">
                      {pe.sets.map(set => (
                        <div
                          key={set.id}
                          className={cn(
                            'flex flex-wrap items-center gap-2 p-2 sm:p-3 rounded-lg transition-all',
                            set.completed 
                              ? 'bg-primary/10 border border-primary/30' 
                              : 'bg-secondary/50'
                          )}
                        >
                          {/* Toggle completion */}
                          <button
                            onClick={() => handleToggleSet(pe.id, set.id)}
                            className="flex items-center gap-2 shrink-0"
                          >
                            <div className={cn(
                              'w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all',
                              set.completed 
                                ? 'border-primary bg-primary' 
                                : 'border-muted-foreground'
                            )}>
                              {set.completed && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />}
                            </div>
                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Подход {set.setNumber}</span>
                          </button>
                          
                          {/* Weight & Reps controls - compact inline */}
                          <div className="flex items-center gap-1 flex-1 min-w-0 justify-end flex-wrap">
                            {isWeightEditable && (
                              <>
                                {/* Assisted exercise: show effective weight */}
                                {isAssistedExercise(pe.exerciseId) && profile?.weight && isValidWeight(set.targetWeight) && (
                                  <span className="text-xs text-primary font-medium whitespace-nowrap mr-1">
                                    ≈{calculateEffectiveWeight(set.targetWeight, profile.weight)} кг
                                  </span>
                                )}
                                {/* Weight controls — manual numeric entry, no native stepper */}
                                <Input
                                  type="text"
                                  inputMode="decimal"
                                  autoComplete="off"
                                  value={weightInputBuffer[set.id] ?? (set.targetWeight ?? '').toString()}
                                  placeholder={isOptionalWeight ? '—' : '0.5'}
                                  onChange={(e) => {
                                    const raw = e.target.value;
                                    // Reject any character outside the allowed pattern
                                    // (digits + optional single dot/comma + up to 2 decimals).
                                    if (raw !== '' && !WEIGHT_INPUT_REGEX.test(raw)) return;
                                    // Always update the visible buffer so the caret stays put.
                                    setWeightInputBuffer((prev) => ({ ...prev, [set.id]: raw }));
                                    // Mirror to canonical state only when we have a finished number.
                                    if (raw === '' || raw === '.' || raw === ',') {
                                      handleSetWeight(pe.id, set.id, null);
                                      return;
                                    }
                                    const num = parseFloat(raw.replace(',', '.'));
                                    if (Number.isNaN(num)) return;
                                    handleSetWeight(pe.id, set.id, num);
                                  }}
                                  onBlur={(e) => {
                                    const raw = e.target.value.replace(',', '.');
                                    const num = parseFloat(raw);
                                    if (raw === '' || Number.isNaN(num) || num < 0.5) {
                                      handleSetWeight(pe.id, set.id, null);
                                      setWeightInputBuffer((prev) => {
                                        const next = { ...prev };
                                        delete next[set.id];
                                        return next;
                                      });
                                      return;
                                    }
                                    // Snap to 0.5 step on commit (HTML step= is unreliable for type=text).
                                    const rounded = Math.round(num * 2) / 2;
                                    handleSetWeight(pe.id, set.id, rounded);
                                    setWeightInputBuffer((prev) => {
                                      const next = { ...prev };
                                      delete next[set.id];
                                      return next;
                                    });
                                  }}
                                  onFocus={(e) => moveCaretToInputEnd(e.currentTarget)}
                                  className={cn(
                                    'w-12 sm:w-14 h-6 sm:h-7 text-center text-xs sm:text-sm font-semibold p-0.5 sm:p-1',
                                    isOptionalWeight && 'border-dashed'
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveCaretToInputEnd(e.currentTarget);
                                  }}
                                />


                                <span className="text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
                                  {isTimeBased ? 'сек' : isAssistedExercise(pe.exerciseId) ? 'помощь' : `кг${getExerciseWeightUnitSuffix(pe.exerciseId)}`}
                                  {isOptionalWeight && <span className="ml-1 opacity-70">(опц.)</span>}
                                </span>

                                <span className="text-muted-foreground text-xs">×</span>
                              </>
                            )}
                            {showBodyweightLoad && (
                              <>
                                <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground whitespace-nowrap">
                                  Вес тела: {formatWeight(profile.weight)}
                                </span>
                                <span className="text-muted-foreground text-xs">×</span>
                              </>
                            )}
                            {/* Reps controls */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 sm:h-7 sm:w-7 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChangeReps(pe.id, set.id, -1);
                              }}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-semibold w-5 sm:w-6 text-center text-xs sm:text-sm">{set.targetReps}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 sm:h-7 sm:w-7 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChangeReps(pe.id, set.id, 1);
                              }}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            
                            {/* Delete set */}
                            {pe.sets.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 sm:h-7 sm:w-7 text-destructive hover:text-destructive shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveSet(pe.id, set.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-muted-foreground"
                        onClick={() => handleAddSet(pe.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить подход
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add exercise button */}
            <Dialog open={showExercisePicker} onOpenChange={setShowExercisePicker}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mb-6" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Добавить упражнение
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto" aria-describedby="exercise-picker-desc">
                <DialogHeader>
                  <DialogTitle>Выберите упражнение</DialogTitle>
                  <DialogDescription id="exercise-picker-desc">
                    Выберите упражнение из списка ниже
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {exercisePickerGroups.map(group => (
                    <div key={group.muscleGroup}>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                        {group.label}
                      </h4>
                      <div className="space-y-1">
                        {group.exercises.map(ex => (
                          <button
                            key={ex.id}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary text-sm flex justify-between items-center"
                            onClick={() => handleAddExercise(ex.id)}
                          >
                            <span>{ex.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {ex.type === 'compound' ? 'База' : 'Изоляция'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Exercise Summaries (for completed exercises) */}
        {Object.keys(exerciseSummaries).length > 0 && (
          <div className="space-y-2 mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Итоги упражнений</h3>
            {exercises.filter(e => exerciseSummaries[e.id]).map(e => {
              const summary = exerciseSummaries[e.id];
              return (
                <ExerciseSummary
                  key={e.id}
                  exerciseName={e.exerciseName}
                  lastRIR={summary.lastRIR}
                  trainingType={(intensity === 'rest' ? 'medium' : intensity) as TrainingType}
                  currentWeight={summary.currentWeight}
                  nextWeight={summary.nextWeight}
                />
              );
            })}
          </div>
        )}

        {/* Feedback (if day is completed) */}
        {existingDay?.is_completed && (
          <div className="stat-card mb-6 border-primary/30">
            <h3 className="font-semibold mb-2">✓ Тренировка завершена</h3>
            <p className="text-sm text-muted-foreground">
              Выполнено {existingDay.planned_exercises?.reduce((sum, pe) => 
                sum + pe.exercise_sets.filter(s => s.is_completed).length, 0
              ) || 0} подходов
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" size="lg" disabled={isLoading}>
            Отмена
          </Button>
          
          <Button onClick={handleSave} className="flex-1" size="lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {existingDay ? 'Сохранить' : 'Создать'}
          </Button>
        </div>
      </div>

      {/* RIR Selector Drawer */}
      {rirPrompt && (
        <RIRSelector
          open={!!rirPrompt}
          onSelect={handleRIRSelected}
          onClose={() => setRirPrompt(null)}
          exerciseName={rirPrompt.exerciseName}
          setNumber={rirPrompt.setNumber}
          weight={rirPrompt.weight}
          reps={rirPrompt.reps}
        />
      )}

      {/* Rest Timer */}
      {restTimer && (
        <RestTimer
          totalSeconds={restTimer.totalSeconds}
          nextWeight={restTimer.nextWeight}
          exerciseName={restTimer.exerciseName}
          nextSetNumber={restTimer.nextSetNumber}
          onComplete={() => setRestTimer(null)}
          onSkip={() => setRestTimer(null)}
        />
      )}

      {/* Alternatives Dialog */}
      {alternativesDialogExercise && profile && (
        <ExerciseAlternativesDialog
          open={!!alternativesDialogExercise}
          onOpenChange={(open) => !open && setAlternativesDialogExercise(null)}
          exerciseId={alternativesDialogExercise.exerciseId}
          currentWeight={alternativesDialogExercise.weight}
          experience={profile.experience}
          goal={profile.goal}
          currentPumpCount={pumpCount}
          totalExercises={exercises.length}
          intensity={intensity as 'easy' | 'medium' | 'hard'}
          replacementHistory={allModifications}
          onReplace={(newId, weight) => handleReplaceExercise(alternativesDialogExercise.id, newId, weight)}
        />
      )}
    </div>
  );
}
