import React, { useState } from 'react';
import { usePersonalMaxes } from '@/hooks/usePersonalMaxes';
import { PMHistoryChart } from '@/components/PMHistoryChart';
import { useProfile } from '@/hooks/useProfile';
import { calculatePM, getDaysUntilPMUpdate } from '@/lib/calculations';
import { calculateBodyweightReps } from '@/lib/weightConversion';
import { getExerciseById, BASE_EXERCISES_FOR_PM } from '@/data/exercises';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, TrendingUp, Loader2, Info } from 'lucide-react';
import { formatWeight } from '@/lib/weightFormat';

// Validation constants
const MAX_WEIGHT = 999;
const MAX_REPS = 99;
const MIN_WEIGHT = 0;
const MIN_REPS = 1;

// Exercises that use bodyweight logic
const BODYWEIGHT_PM_EXERCISES = ['weighted-pull-ups'];

function isBodyweightExercise(exerciseId: string): boolean {
  return BODYWEIGHT_PM_EXERCISES.includes(exerciseId);
}

export function PersonalMaxTracker() {
  const { personalMaxes, isLoading, upsertPersonalMax, isUpserting } = usePersonalMaxes();
  const { profile } = useProfile();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const userBodyweight = profile?.weight || 0;

  const getLastUpdateDate = (): Date | null => {
    if (personalMaxes.length === 0) return null;
    const dates = personalMaxes.map(pm => new Date(pm.updated_at));
    return new Date(Math.max(...dates.map(d => d.getTime())));
  };

  const pmLastUpdated = getLastUpdateDate();
  const daysUntilUpdate = pmLastUpdated 
    ? getDaysUntilPMUpdate(pmLastUpdated)
    : 0;

  const handleWeightChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts[0].length > 3) return;
    if (parts.length > 1 && parts[1].length > 1) return;
    setWeight(sanitized.slice(0, 5));
  };

  const handleRepsChange = (value: string) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    setReps(sanitized.slice(0, 2));
  };

  const handleSave = async (exerciseId: string) => {
    const exercise = getExerciseById(exerciseId);
    if (!exercise) return;

    const w = parseFloat(weight);
    const r = parseInt(reps);
    
    if (isNaN(w) || isNaN(r)) return;
    if (w < MIN_WEIGHT || w > MAX_WEIGHT) return;
    if (r < MIN_REPS || r > MAX_REPS) return;

    try {
      await upsertPersonalMax({
        exercise_id: exerciseId,
        weight: w,
        reps: r,
      });

      setEditingId(null);
      setWeight('');
      setReps('');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to save PM:', error);
      }
    }
  };

  /** Calculate total 1RM for bodyweight exercises (correct Epley on full load) */
  const getTotalCapacity = (pm: { weight: number; reps: number }): number => {
    const totalWeight = userBodyweight + pm.weight;
    if (pm.reps === 1) return totalWeight;
    return totalWeight * (1 + pm.reps / 30);
  };

  /** Get estimated max bodyweight reps using correct total 1RM */
  const getEstimatedMaxReps = (pm: { weight: number; reps: number }): number | null => {
    if (!userBodyweight || userBodyweight <= 0) return null;
    const total1RM = getTotalCapacity(pm);
    if (total1RM <= userBodyweight) return null;
    const maxReps = Math.floor(30 * (total1RM / userBodyweight - 1));
    return maxReps > 0 ? Math.min(maxReps, 30) : null;
  };

  const showUpdateReminder = daysUntilUpdate === 0;

  if (isLoading) {
    return (
      <div className="stat-card">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Персональные максимумы
        </h3>
        
        {pmLastUpdated && (
          <div className={`text-sm px-3 py-1 rounded-full ${
            showUpdateReminder 
              ? 'bg-intensity-medium/20 text-intensity-medium' 
              : 'bg-secondary text-muted-foreground'
          }`}>
            {showUpdateReminder 
              ? 'Пора обновить ПМ!' 
              : `${daysUntilUpdate} дн. до обновления`
            }
          </div>
        )}
      </div>

      {showUpdateReminder && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-intensity-medium/10 border border-intensity-medium/30 mb-4">
          <AlertCircle className="w-5 h-5 text-intensity-medium shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm">
              Прошло 6–8 недель с последнего обновления ПМ. Рекомендуем пересчитать веса.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {BASE_EXERCISES_FOR_PM.map(exerciseId => {
          const exercise = getExerciseById(exerciseId);
          const pm = personalMaxes.find(p => p.exercise_id === exerciseId);
          const isEditing = editingId === exerciseId;
          const isBW = isBodyweightExercise(exerciseId);

          if (!exercise) return null;

          return (
            <div 
              key={exerciseId}
              className="p-3 rounded-xl bg-secondary/50 border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{exercise.name}</span>
                {pm && !isEditing && (
                  <div className="text-right">
                    {isBW && userBodyweight > 0 ? (
                      <span className="text-xl font-bold text-primary">
                        {formatWeight(getTotalCapacity(pm))}
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-primary">
                        {formatWeight(pm.estimated_1rm ?? calculatePM(pm.weight, pm.reps))}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  {isBW && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                      <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Укажите <span className="text-foreground font-medium">добавочный вес</span> (на поясе/жилете). 
                        Ваш вес тела ({userBodyweight} кг) учтётся автоматически.
                        {!userBodyweight && (
                          <span className="text-destructive"> Заполните вес в профиле для корректного расчёта.</span>
                        )}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        {isBW ? 'Добавочный вес (кг)' : 'Вес (кг)'}
                      </Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={weight}
                        onChange={e => handleWeightChange(e.target.value)}
                        placeholder={isBW ? '20' : '95'}
                        className="mt-1"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Повторения</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={reps}
                        onChange={e => handleRepsChange(e.target.value)}
                        placeholder="8"
                        className="mt-1"
                        maxLength={2}
                      />
                    </div>
                  </div>
                  
                  {weight && reps && (
                    <div className="space-y-1">
                      {isBW && userBodyweight > 0 ? (
                        <>
                          <p className="text-sm text-muted-foreground">
                            Общая мощность (1RM): <span className="text-primary font-bold">
                              {(() => {
                                const w = parseFloat(weight);
                                const r = parseInt(reps);
                                if (!Number.isFinite(w) || !Number.isFinite(r) || r < 1) return '—';
                                const total1RM = (userBodyweight + w) * (r === 1 ? 1 : (1 + r / 30));
                                return formatWeight(total1RM);
                              })()}
                            </span>
                          </p>
                          {(() => {
                            const w = parseFloat(weight) || 0;
                            const r = parseInt(reps) || 1;
                            const total1RM = (userBodyweight + w) * (r === 1 ? 1 : (1 + r / 30));
                            const maxReps = Math.min(30, Math.floor(30 * (total1RM / userBodyweight - 1)));
                            return maxReps > 0 ? (
                              <p className="text-sm text-muted-foreground">
                                ≈ макс. подтягиваний (без веса): <span className="text-primary font-bold">
                                  {maxReps} раз
                                </span>
                              </p>
                            ) : null;
                          })()}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Расчётный ПМ: <span className="text-primary font-bold">
                            {calculatePM(parseFloat(weight) || 0, parseInt(reps) || 1)} кг
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleSave(exerciseId)}
                      className="flex-1"
                      disabled={isUpserting}
                    >
                      {isUpserting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Сохранить'
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setWeight('');
                        setReps('');
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  {pm ? (
                    <div className="space-y-0.5">
                      <span className="text-sm text-muted-foreground block">
                        {isBW 
                          ? `+${pm.weight} кг × ${pm.reps} повт.`
                          : `${pm.weight} кг × ${pm.reps} повторений`
                        }
                      </span>
                      {isBW && userBodyweight > 0 && (() => {
                        const maxReps = getEstimatedMaxReps(pm);
                        const mediumReps = maxReps ? calculateBodyweightReps(exerciseId, pm.weight, pm.reps, userBodyweight, 'medium') : null;
                        return maxReps ? (
                          <span className="text-xs text-muted-foreground block">
                            Макс. без веса: ~{maxReps} повт. • Рабочие: ~{mediumReps} повт.
                          </span>
                        ) : null;
                      })()}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Не задан</span>
                  )}
                  <Button 
                    size="xs" 
                    variant="outline"
                    onClick={() => {
                      setEditingId(exerciseId);
                      if (pm) {
                        setWeight(pm.weight.toString());
                        setReps(pm.reps.toString());
                      }
                    }}
                  >
                    {pm ? 'Изменить' : 'Добавить'}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PM History */}
      <PMHistoryChart />
    </div>
  );
}
