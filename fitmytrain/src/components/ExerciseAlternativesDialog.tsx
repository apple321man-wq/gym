import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  AlternativeTag,
  ALTERNATIVE_TAG_COLORS,
  ALTERNATIVE_TAG_DESCRIPTIONS,
  isReplacementAllowed
} from '@/types/alternatives';
import { ExperienceLevel, TrainingGoal, MUSCLE_GROUP_LABELS } from '@/types/training';
import { getExtendedExerciseById, getNormalizedExerciseById } from '@/data/exercisesExtended';
import { cn } from '@/lib/utils';
import { AlertTriangle, Lock, Info, ChevronDown, ChevronUp, Ban, Scale, Gauge } from 'lucide-react';
import { convertWeightBetweenExercises, getExerciseCoefficient } from '@/lib/weightConversion';
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

function getWeightConversionInfo(
  sourceExerciseId: string,
  targetExerciseId: string,
  currentWeight: number,
  adjustedWeight: number,
  tag: AlternativeTag
): { canConvert: boolean; text: string } {
  const sourceCoef = getExerciseCoefficient(sourceExerciseId);
  const targetCoef = getExerciseCoefficient(targetExerciseId);

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
    text: `Коэффициент ${(ratio * tagMultiplier).toFixed(2)}: ${formatWeight(currentWeight)} × ${pieces.join(' ')} = ${formatWeight(adjustedWeight)}`,
  };
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
  const currentNormalized = getNormalizedExerciseById(exerciseId);
  const currentPattern = getDetailedMovementPattern(exerciseId);

  const alternatives = useMemo(() => {
    if (!currentExercise?.alternativesWithTags) return [];

    // Фильтруем альтернативы по совместимости паттерна движения
    return currentExercise.alternativesWithTags
      .filter(alt => {
        // Проверяем совместимость паттерна движения
        if (!canReplaceByPattern(exerciseId, alt.exerciseId)) {
          return false;
        }

        // Проверяем что альтернатива существует
        const altExercise = getExtendedExerciseById(alt.exerciseId);
        if (!altExercise) return false;

        // Compound упражнения не заменяем на isolation (если исходное compound)
        const altNormalized = getNormalizedExerciseById(alt.exerciseId);
        if (currentNormalized?.category === 'compound' && altNormalized?.category === 'isolation') {
          return false;
        }

        return true;
      })
      .map(alt => {
        const altExercise = getExtendedExerciseById(alt.exerciseId);
        if (!altExercise) return null;

        const { allowed, warning } = isReplacementAllowed(
          alt.tag,
          experience,
          goal,
          currentPumpCount,
          totalExercises
        );

        // Use proper weight conversion based on exercise coefficients
        // This handles cases like barbell vs dumbbell properly
        const convertedWeight = convertWeightBetweenExercises(
          exerciseId,
          alt.exerciseId,
          currentWeight
        );

        // Apply additional tag-based adjustment if needed (pump = extra reduction)
        let adjustedWeight = convertedWeight;
        if (alt.tag === 'pump') {
          // Pump exercises get additional 15% reduction for higher reps
          adjustedWeight = Math.round(convertedWeight * 0.85 / 2.5) * 2.5;
        }

        // Check if this alternative has a different coefficient (for UI display)
        const hasCoefficient = getExerciseCoefficient(alt.exerciseId) !== null;
        const sourceCoef = getExerciseCoefficient(exerciseId);
        const targetCoef = getExerciseCoefficient(alt.exerciseId);
        const coefficientDiffers = hasCoefficient && sourceCoef && targetCoef
          && sourceCoef.coefficient !== targetCoef.coefficient;
        const altNormalized = getNormalizedExerciseById(alt.exerciseId);
        const sameMuscle = currentExercise.muscleGroup === altExercise.muscleGroup;
        const sameCategory = currentNormalized?.category === altNormalized?.category;
        const sameBase = Boolean(sourceCoef && targetCoef && sourceCoef.baseExercise === targetCoef.baseExercise);
        const similarityScore = Math.min(100, Math.round(
          getTagSimilarityScore(alt.tag)
          + (sameMuscle ? 24 : 10)
          + (sameCategory ? 16 : 6)
          + (sameBase ? 14 : 0)
          + (coefficientDiffers ? 2 : 6)
        ));
        const conversionInfo = getWeightConversionInfo(
          exerciseId,
          alt.exerciseId,
          currentWeight,
          adjustedWeight,
          alt.tag
        );
        const difficulty = altNormalized?.riskLevel === 'high'
          ? 'advanced'
          : altNormalized?.riskLevel === 'medium'
            ? 'intermediate'
            : 'beginner';

        return {
          ...alt,
          exercise: altExercise,
          allowed,
          warning,
          adjustedWeight,
          coefficientDiffers, // For UI indication
          similarityScore,
          conversionInfo,
          difficulty,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (!a || !b) return 0;
        if (a.allowed !== b.allowed) return a.allowed ? -1 : 1;
        return b.similarityScore - a.similarityScore;
      });
  }, [currentExercise, currentNormalized, exerciseId, experience, goal, currentPumpCount, totalExercises, currentWeight]);

  const handleSelect = (alt: NonNullable<typeof alternatives[number]>) => {
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

        {currentExercise && (
          <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Текущее упражнение:</p>
            <p className="font-semibold">{currentExercise.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {MUSCLE_GROUP_LABELS[currentExercise.muscleGroup]} • {formatWeight(Math.round(currentWeight * 2) / 2)}
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

        {/* Legend */}
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

        {/* Alternatives list */}
        <div className="space-y-2">
          {alternatives.length === 0 && (
            <div className="text-center py-6">
              <Ban className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Нет совместимых альтернатив
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Для паттерна «{PATTERN_LABELS[currentPattern]}» не найдено подходящих замен.
                <br />
                Замена должна соответствовать тому же типу движения.
              </p>
            </div>
          )}

          {alternatives.map((alt) => {
            if (!alt) return null;

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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-lg', ALTERNATIVE_TAG_COLORS[alt.tag])}>
                        {getTagIcon(alt.tag)}
                      </span>
                      <span className="font-medium">{alt.exercise.name}</span>
                      {isBlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs text-muted-foreground">
                        {MUSCLE_GROUP_LABELS[alt.exercise.muscleGroup]}
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
                          {alt.conversionInfo.canConvert ? formatWeight(alt.adjustedWeight) : 'нет расчета'}
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

                {/* Warning/Block message */}
                {(isBlocked || hasWarning) && (
                  <div className={cn(
                    'flex items-start gap-2 mt-2 p-2 rounded-lg text-xs',
                    isBlocked ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-700'
                  )}>
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{alt.warning}</span>
                  </div>
                )}

                {/* Expanded technique info */}
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
                      <p className="font-semibold text-primary">Конечная точка:</p>
                      <p className="text-muted-foreground">{alt.exercise.description.endPoint}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-primary mb-1">Внимание:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                        {alt.exercise.description.focus.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Experience/Goal info */}
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
              🔥 упражнений: <span className="font-medium text-foreground">{currentPumpCount}/{totalExercises}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
