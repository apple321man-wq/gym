import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  AlternativeTag,
  ALTERNATIVE_TAG_COLORS,
  ALTERNATIVE_TAG_DESCRIPTIONS,
  isReplacementAllowed
} from '@/types/alternatives';
import { ExperienceLevel, TrainingGoal, MuscleGroup, MUSCLE_GROUP_LABELS } from '@/types/training';
import { getExtendedExerciseById, getNormalizedExerciseById } from '@/data/exercisesExtended';
import { UNIFIED_EXERCISES, getUnifiedExerciseForId, type UnifiedExercise } from '@/data/exercisesUnified';
import { cn } from '@/lib/utils';
import { AlertTriangle, Lock, Info, ChevronDown, ChevronUp, Ban, Scale, Gauge } from 'lucide-react';
import { convertWeightBetweenExercises, getExerciseCoefficient, getExerciseWeightUnitLabel, getExerciseWeightUnitSuffix } from '@/lib/weightConversion';
import { formatWeight } from '@/lib/weightFormat';
import {
  getDetailedMovementPattern,
  canReplaceByPattern,
  PATTERN_LABELS
} from '@/lib/movementPatternUtils';

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Новичок',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
};

const UNIFIED_WEIGHT_ID_ALIASES: Record<string, string> = {
  'quads-barbell-squat': 'barbell-squat',
  'quads-front-squat': 'front-squat',
  'quads-goblet-squat': 'goblet-squat',
  'quads-leg-press': 'leg-press',
  'quads-hack-squat': 'hack-squat',
  'quads-smith-squat': 'smith-squat',
  'quads-bulgarian-split-squat': 'bulgarian-split-squat',
  'hamstrings-romanian-deadlift': 'romanian-deadlift',
  'hamstrings-sldl': 'stiff-leg-deadlift',
  'hamstrings-good-morning': 'good-morning',
  'glutes-barbell-hip-thrust': 'hip-thrust',
  'chest-barbell-flat': 'bench-press',
  'chest-dumbbell-flat': 'dumbbell-bench-press',
  'chest-incline-barbell': 'incline-bench-press',
  'chest-incline-dumbbell': 'incline-dumbbell-press',
  'chest-dips': 'dips',
  'chest-cable-crossover': 'cable-crossover',
  'chest-machine-seated-press': 'machine-chest-press',
  'lats-pull-ups-medium': 'pull-ups',
  'lats-pull-ups-weighted': 'weighted-pull-ups',
  'upperback-bent-over-row': 'barbell-row',
  'upperback-dumbbell-row': 'dumbbell-row',
  'upperback-seated-cable-row': 'cable-row',
  'upperback-t-bar-row': 't-bar-row',
  'frontdelt-military-press': 'overhead-press',
  'frontdelt-seated-dumbbell-press': 'dumbbell-shoulder-press',
  'sidedelt-lateral-raises': 'lateral-raise',
  'sidedelt-cable-lateral-raise': 'cable-lateral-raise',
  'biceps-dumbbell-curl': 'dumbbell-curl',
  'biceps-barbell-curl': 'barbell-curl',
  'biceps-hammer-curl': 'hammer-curl',
  'biceps-preacher-curl': 'preacher-curl',
  'biceps-cable-curl': 'cable-curl',
  'triceps-pushdown': 'triceps-pushdown',
  'triceps-skullcrusher': 'skull-crusher',
  'triceps-overhead-extension': 'overhead-tricep-extension',
  'triceps-close-grip-bench-press': 'close-grip-bench',
  'abs-plank': 'plank',
  'abs-ab-wheel': 'ab-wheel',
  'abs-hanging-leg-raises': 'hanging-leg-raise',
  'abs-leg-raises': 'lying-leg-raise',
  'abs-cable-crunch': 'cable-crunch',
  'core-pallof-press': 'pallof-press',
  'calves-standing-raise': 'standing-calf-raise',
  'calves-seated-raise': 'seated-calf-raise',
};

type DisplayDescription = {
  technique: string[];
  endPoint: string;
  focus: string[];
};

type DisplayExercise = {
  name: string;
  muscleGroup: MuscleGroup;
  description?: DisplayDescription;
};

type AlternativeOption = {
  exerciseId: string;
  tag: AlternativeTag;
  comment?: string;
  exercise: DisplayExercise;
  allowed: boolean;
  warning?: string;
  adjustedWeight: number;
  coefficientDiffers: boolean;
  similarityScore: number;
  conversionInfo: { canConvert: boolean; text: string };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

function getWeightId(exerciseId: string): string {
  return UNIFIED_WEIGHT_ID_ALIASES[exerciseId] ?? exerciseId;
}

function getTagSimilarityScore(tag: AlternativeTag): number {
  if (tag === 'equal') return 40;
  if (tag === 'reduced_weight') return 24;
  return 12;
}

function getSimilarityLabel(score: number): string {
  if (score >= 85) return 'Очень близко';
  if (score >= 70) return 'Похоже';
  if (score >= 55) return 'Условная замена';
  return 'Другая нагрузка';
}

function getMuscleLabel(muscle: MuscleGroup): string {
  return MUSCLE_GROUP_LABELS[muscle] ?? muscle;
}

function toUnifiedDescription(exercise: UnifiedExercise): DisplayDescription {
  return {
    technique: exercise.instructions.keyPoints.length > 0
      ? exercise.instructions.keyPoints
      : [exercise.description],
    endPoint: exercise.description,
    focus: exercise.instructions.commonMistakes,
  };
}

function toUnifiedDisplayExercise(exercise: UnifiedExercise): DisplayExercise {
  return {
    name: exercise.name.ru,
    muscleGroup: exercise.primaryMuscles[0] ?? exercise.sourceMuscle,
    description: toUnifiedDescription(exercise),
  };
}

function toExtendedDisplayExercise(exercise: NonNullable<ReturnType<typeof getExtendedExerciseById>>): DisplayExercise {
  return {
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    description: exercise.description,
  };
}

function getWeightConversionInfo(
  sourceExerciseId: string,
  targetExerciseId: string,
  currentWeight: number,
  adjustedWeight: number,
  tag: AlternativeTag
): { canConvert: boolean; text: string } {
  const sourceWeightId = getWeightId(sourceExerciseId);
  const targetWeightId = getWeightId(targetExerciseId);
  const sourceCoef = getExerciseCoefficient(sourceWeightId);
  const targetCoef = getExerciseCoefficient(targetWeightId);
  const sourceUnitLabel = getExerciseWeightUnitLabel(sourceExerciseId);
  const targetUnitLabel = getExerciseWeightUnitLabel(targetExerciseId);

  if (!currentWeight || currentWeight <= 0) {
    return {
      canConvert: false,
      text: 'Нет исходного рабочего веса для пересчета',
    };
  }

  if (!sourceCoef || !targetCoef || sourceCoef.baseExercise !== targetCoef.baseExercise) {
    return {
      canConvert: false,
      text: 'Нет коэффициента для надежного пересчета, оставлен текущий вес',
    };
  }

  const ratio = sourceCoef.coefficient === 0 ? 1 : targetCoef.coefficient / sourceCoef.coefficient;
  const tagMultiplier = tag === 'pump' ? 0.85 : 1;
  const pieces = [`${targetCoef.coefficient.toFixed(2)} / ${sourceCoef.coefficient.toFixed(2)}`];
  if (tagMultiplier !== 1) pieces.push('× 0.85');

  return {
    canConvert: true,
    text: `Коэффициент ${(ratio * tagMultiplier).toFixed(2)}: ${formatWeight(currentWeight)} (${sourceUnitLabel}) × ${pieces.join(' ')} = ${formatWeight(adjustedWeight)} (${targetUnitLabel})`,
  };
}

function getOverlapScore(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const aSet = new Set(a);
  const matches = b.filter(item => aSet.has(item)).length;
  return matches / Math.max(a.length, b.length);
}

function getUnifiedSimilarityScore(current: UnifiedExercise, candidate: UnifiedExercise): number {
  const primaryOverlap = getOverlapScore(current.primaryMuscles, candidate.primaryMuscles);
  const allMuscleOverlap = getOverlapScore(current.muscleGroups, candidate.muscleGroups);
  const sameSource = current.sourceMuscle === candidate.sourceMuscle;
  const sameHighLevel = current.highLevelGroup === candidate.highLevelGroup;
  const sameEquipment = current.equipment.some(eq => candidate.equipment.includes(eq));
  const difficultyGap = Math.abs(current.difficultyScore - candidate.difficultyScore);
  const explicitAlternative = current.alternatives.some(alt => alt.id === candidate.id)
    || candidate.alternatives.some(alt => alt.id === current.id);

  return Math.max(0, Math.min(100, Math.round(
    (explicitAlternative ? 24 : 0)
    + primaryOverlap * 34
    + allMuscleOverlap * 22
    + (sameSource ? 10 : 0)
    + (sameHighLevel ? 6 : 0)
    + (sameEquipment ? 4 : 0)
    - difficultyGap * 3
  )));
}

function getUnifiedTag(score: number): AlternativeTag {
  if (score >= 82) return 'equal';
  if (score >= 58) return 'reduced_weight';
  return 'pump';
}

interface ExerciseAlternativesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseId: string;
  currentWeight: number;
  experience: ExperienceLevel;
  goal: TrainingGoal;
  currentPumpCount: number;
  totalExercises: number;
  intensity?: 'easy' | 'medium' | 'hard';
  onReplace: (newExerciseId: string, adjustedWeight: number) => void;
}

export function ExerciseAlternativesDialog({
  open,
  onOpenChange,
  exerciseId,
  currentWeight,
  experience,
  goal,
  currentPumpCount,
  totalExercises,
  onReplace,
}: ExerciseAlternativesDialogProps) {
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);

  const currentExercise = getExtendedExerciseById(exerciseId);
  const currentUnified = getUnifiedExerciseForId(exerciseId);
  const currentNormalized = getNormalizedExerciseById(exerciseId);
  const currentPattern = getDetailedMovementPattern(exerciseId);
  const currentDisplayExercise: DisplayExercise | undefined = currentExercise
    ? toExtendedDisplayExercise(currentExercise)
    : currentUnified
      ? toUnifiedDisplayExercise(currentUnified)
      : undefined;

  const alternatives = useMemo<AlternativeOption[]>(() => {
    const options = new Map<string, AlternativeOption>();
    const sourceWeightId = getWeightId(exerciseId);

    const addOption = (
      candidateId: string,
      tag: AlternativeTag,
      exercise: DisplayExercise,
      difficulty: 'beginner' | 'intermediate' | 'advanced',
      similarityScore: number,
      comment?: string
    ) => {
      if (candidateId === exerciseId) return;

      const { allowed, warning } = isReplacementAllowed(
        tag,
        experience,
        goal,
        currentPumpCount,
        totalExercises
      );

      const targetWeightId = getWeightId(candidateId);
      let adjustedWeight = convertWeightBetweenExercises(sourceWeightId, targetWeightId, currentWeight);
      if (tag === 'pump') {
        adjustedWeight = Math.round(adjustedWeight * 0.85 / 2.5) * 2.5;
      }

      const sourceCoef = getExerciseCoefficient(sourceWeightId);
      const targetCoef = getExerciseCoefficient(targetWeightId);
      const coefficientDiffers = Boolean(sourceCoef && targetCoef && sourceCoef.coefficient !== targetCoef.coefficient);
      const conversionInfo = getWeightConversionInfo(exerciseId, candidateId, currentWeight, adjustedWeight, tag);
      const existing = options.get(candidateId);

      const option: AlternativeOption = {
        exerciseId: candidateId,
        tag,
        comment,
        exercise,
        allowed,
        warning,
        adjustedWeight,
        coefficientDiffers,
        similarityScore,
        conversionInfo,
        difficulty,
      };

      if (!existing || option.similarityScore > existing.similarityScore) {
        options.set(candidateId, option);
      }
    };

    currentExercise?.alternativesWithTags?.forEach(alt => {
      if (!canReplaceByPattern(exerciseId, alt.exerciseId)) return;

      const altExercise = getExtendedExerciseById(alt.exerciseId);
      if (!altExercise) return;

      const altNormalized = getNormalizedExerciseById(alt.exerciseId);
      if (currentNormalized?.category === 'compound' && altNormalized?.category === 'isolation') return;

      const sourceCoef = getExerciseCoefficient(sourceWeightId);
      const targetCoef = getExerciseCoefficient(getWeightId(alt.exerciseId));
      const sameMuscle = currentExercise.muscleGroup === altExercise.muscleGroup;
      const sameCategory = currentNormalized?.category === altNormalized?.category;
      const sameBase = Boolean(sourceCoef && targetCoef && sourceCoef.baseExercise === targetCoef.baseExercise);
      const difficulty = altNormalized?.riskLevel === 'high'
        ? 'advanced'
        : altNormalized?.riskLevel === 'medium'
          ? 'intermediate'
          : 'beginner';
      const score = Math.min(100, Math.round(
        getTagSimilarityScore(alt.tag)
        + (sameMuscle ? 24 : 10)
        + (sameCategory ? 16 : 6)
        + (sameBase ? 14 : 0)
        + (sourceCoef && targetCoef && sourceCoef.coefficient !== targetCoef.coefficient ? 2 : 6)
      ));

      addOption(alt.exerciseId, alt.tag, toExtendedDisplayExercise(altExercise), difficulty, score, alt.comment);
    });

    if (currentUnified) {
      UNIFIED_EXERCISES.forEach(candidate => {
        if (candidate.id === currentUnified.id) return;

        const explicitAlternative = currentUnified.alternatives.some(alt => alt.id === candidate.id)
          || candidate.alternatives.some(alt => alt.id === currentUnified.id);
        const relatedMuscle = candidate.muscleGroups.some(muscle => currentUnified.muscleGroups.includes(muscle))
          || candidate.sourceMuscle === currentUnified.sourceMuscle
          || candidate.highLevelGroup === currentUnified.highLevelGroup;
        if (!explicitAlternative && !relatedMuscle) return;

        const score = getUnifiedSimilarityScore(currentUnified, candidate);
        if (score < 42 && !explicitAlternative) return;

        const tag = getUnifiedTag(score);
        addOption(
          candidate.id,
          tag,
          toUnifiedDisplayExercise(candidate),
          candidate.difficulty,
          score,
          candidate.equipment.length > 0 ? `Оборудование: ${candidate.equipment.join(', ')}` : undefined
        );
      });
    }

    return Array.from(options.values()).sort((a, b) => {
      if (a.allowed !== b.allowed) return a.allowed ? -1 : 1;
      return b.similarityScore - a.similarityScore;
    });
  }, [currentExercise, currentUnified, currentNormalized, exerciseId, experience, goal, currentPumpCount, totalExercises, currentWeight]);

  const handleSelect = (alt: AlternativeOption) => {
    if (!alt.allowed) return;
    onReplace(alt.exerciseId, alt.adjustedWeight);
    onOpenChange(false);
  };

  const getTagIcon = (tag: AlternativeTag) => {
    switch (tag) {
      case 'equal': return '✔';
      case 'reduced_weight': return '⚠';
      case 'pump': return '🔥';
    }
  };

  const getTagBgColor = (tag: AlternativeTag) => {
    switch (tag) {
      case 'equal': return 'bg-green-500/10 border-green-500/30';
      case 'reduced_weight': return 'bg-amber-500/10 border-amber-500/30';
      case 'pump': return 'bg-orange-500/10 border-orange-500/30';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Заменить упражнение</DialogTitle>
          <DialogDescription className="sr-only">
            Выберите альтернативное упражнение для замены
          </DialogDescription>
        </DialogHeader>

        {currentDisplayExercise && (
          <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Текущее упражнение:</p>
            <p className="font-semibold">{currentDisplayExercise.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {getMuscleLabel(currentDisplayExercise.muscleGroup)} • {currentWeight > 0 ? formatWeight(Math.round(currentWeight * 2) / 2) : 'вес не задан'}
              </span>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {PATTERN_LABELS[currentPattern]}
              </span>
            </div>
          </div>
        )}

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-muted-foreground">Исходный вес</p>
            <p className="text-lg font-semibold">{currentWeight > 0 ? formatWeight(Math.round(currentWeight * 2) / 2) : 'нет данных'}</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            <p className="text-muted-foreground">Сортировка</p>
            <p className="text-sm font-medium">По схожести</p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-muted/30 rounded-lg space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Обозначения:</p>
          {(['equal', 'reduced_weight', 'pump'] as AlternativeTag[]).map(tag => (
            <div key={tag} className="flex items-start gap-2 text-xs">
              <span className={cn('shrink-0', ALTERNATIVE_TAG_COLORS[tag])}>
                {getTagIcon(tag)}
              </span>
              <span className="text-muted-foreground">{ALTERNATIVE_TAG_DESCRIPTIONS[tag]}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {alternatives.length === 0 && (
            <div className="text-center py-6">
              <Ban className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Нет совместимых альтернатив
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Для этого упражнения не найдено подходящих замен в базе.
              </p>
            </div>
          )}

          {alternatives.map((alt) => {
            const isBlocked = !alt.allowed;
            const hasWarning = alt.allowed && alt.warning;

            return (
              <div
                key={alt.exerciseId}
                className={cn(
                  'border rounded-xl p-3 transition-all',
                  getTagBgColor(alt.tag),
                  isBlocked
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-md'
                )}
                onClick={() => !isBlocked && handleSelect(alt)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-lg', ALTERNATIVE_TAG_COLORS[alt.tag])}>
                        {getTagIcon(alt.tag)}
                      </span>
                      <span className="font-medium">{alt.exercise.name}</span>
                      {isBlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs text-muted-foreground">
                        {getMuscleLabel(alt.exercise.muscleGroup)}
                      </span>
                      <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs text-muted-foreground">
                        {DIFFICULTY_LABELS[alt.difficulty]}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {getSimilarityLabel(alt.similarityScore)} · {alt.similarityScore}%
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-background/60 p-2">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Scale className="h-3.5 w-3.5" />
                          Было
                        </div>
                        <p className="mt-1 font-semibold">{currentWeight > 0 ? formatWeight(currentWeight) : 'нет веса'}</p>
                      </div>
                      <div className="rounded-lg bg-background/60 p-2">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Gauge className="h-3.5 w-3.5" />
                          Цель
                        </div>
                        <p className={cn(
                          'mt-1 font-semibold',
                          alt.conversionInfo.canConvert ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                          {alt.conversionInfo.canConvert ? `${formatWeight(alt.adjustedWeight)}${getExerciseWeightUnitSuffix(alt.exerciseId)}` : 'нет расчета'}
                        </p>
                      </div>
                    </div>

                    <p className={cn(
                      'mt-2 text-xs',
                      alt.conversionInfo.canConvert ? 'text-muted-foreground' : 'text-amber-700'
                    )}>
                      {alt.conversionInfo.text}
                    </p>

                    {alt.comment && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        {alt.comment}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedInfo(expandedInfo === alt.exerciseId ? null : alt.exerciseId);
                    }}
                  >
                    {expandedInfo === alt.exerciseId ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {(isBlocked || hasWarning) && (
                  <div className={cn(
                    'flex items-start gap-2 mt-2 p-2 rounded-lg text-xs',
                    isBlocked ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-700'
                  )}>
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{alt.warning}</span>
                  </div>
                )}

                {expandedInfo === alt.exerciseId && alt.exercise.description && (
                  <div className="mt-3 p-3 bg-background/50 rounded-lg text-xs space-y-2">
                    <div>
                      <p className="font-semibold text-primary mb-1">Техника:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                        {alt.exercise.description.technique.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Описание:</p>
                      <p className="text-muted-foreground">{alt.exercise.description.endPoint}</p>
                    </div>
                    {alt.exercise.description.focus.length > 0 && (
                      <div>
                        <p className="font-semibold text-primary mb-1">Внимание:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {alt.exercise.description.focus.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg flex items-start gap-2 text-xs">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
          <div className="text-muted-foreground">
            <p>
              Уровень: <span className="font-medium text-foreground">
                {experience === 'beginner' ? 'Новичок' : experience === 'intermediate' ? 'Средний' : 'Продвинутый'}
              </span>
            </p>
            <p>
              Цель: <span className="font-medium text-foreground">
                {goal === 'muscle_gain' ? 'Набор массы' : goal === 'cutting' ? 'Сушка' : goal === 'recomposition' ? 'Рекомпозиция' : 'Поддержание'}
              </span>
            </p>
            <p>
              База замен: <span className="font-medium text-foreground">{alternatives.length} вариантов</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
