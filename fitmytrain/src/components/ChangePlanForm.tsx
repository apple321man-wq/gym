import React, { useState } from 'react';
import { useProfile, ProfileUpdate } from '@/hooks/useProfile';
import { useTrainingDays } from '@/hooks/useTrainingDays';
import { useExtendedProfile } from '@/hooks/useExtendedProfile';
import { useAuth } from '@/hooks/useAuth';
import { TrainingGoal, ExperienceLevel, GOAL_LABELS, EXPERIENCE_LABELS, MuscleGroup } from '@/types/training';
import { InjuryArea, EquipmentType } from '@/types/exercise-metadata';
import { WeekDay } from '@/data/trainingPrograms';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TrainingDaySelection } from '@/components/TrainingDaySelection';
import { getRecommendedFrequency, TRAINING_RECOMMENDATIONS } from '@/data/trainingPrograms';
import { buildWorkoutPlan } from '@/lib/trainer/buildWorkoutPlan';
import { Target, Clock, Dumbbell, Info, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChangePlanFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function ChangePlanForm({ onComplete, onCancel }: ChangePlanFormProps) {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { bulkCreateTrainingDays, deleteFutureTrainingDays } = useTrainingDays();
  const { extendedProfile } = useExtendedProfile();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<TrainingGoal>(profile?.goal || 'muscle_gain');
  const [experience, setExperience] = useState<ExperienceLevel>(profile?.experience || 'beginner');
  const [weeklyTrainings, setWeeklyTrainings] = useState(profile?.weekly_trainings || 3);
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recommended = getRecommendedFrequency(experience, goal);

  if (!profile || !user) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Delete only future uncompleted training days (preserves completed history)
      await deleteFutureTrainingDays();
      
      // Update profile
      const profileUpdates: ProfileUpdate = {
        goal,
        experience,
        weekly_trainings: weeklyTrainings,
        selected_days: selectedDays.map(d => {
          const dayMap: Record<WeekDay, number> = {
            monday: 0, tuesday: 1, wednesday: 2, thursday: 3,
            friday: 4, saturday: 5, sunday: 6
          };
          return dayMap[d];
        }),
      };
      await updateProfile(profileUpdates);

      const workoutPlan = buildWorkoutPlan({
        user: {
          id: user.id,
          gender: profile.gender,
          age: profile.age,
          weight: profile.weight,
          experience,
          weeklyTrainings,
        },
        goal,
        availableDays: selectedDays,
        priorityMuscles: (extendedProfile?.priorityMuscles || []) as MuscleGroup[],
        injuries: (extendedProfile?.injuries || []) as InjuryArea[],
        equipment: (extendedProfile?.equipment || ['barbell', 'dumbbells', 'machines', 'cables', 'bodyweight']) as EquipmentType[],
        fatigueLevel: 'low',
      });

      await bulkCreateTrainingDays(workoutPlan.days);
      
      toast({
        title: 'План обновлён',
        description: workoutPlan.volumeDistribution,
      });
      
      onComplete();
    } catch (error) {
      console.error('Failed to change plan:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сменить план тренировок.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Смена плана</h1>
          <p className="text-muted-foreground">Настройте новый план тренировок</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Goal */}
        {step === 1 && (
          <div className="stat-card space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Цель тренировок</h2>
            </div>

            <RadioGroup
              value={goal}
              onValueChange={(v) => setGoal(v as TrainingGoal)}
              className="space-y-3"
            >
              {Object.entries(GOAL_LABELS).map(([value, label]) => (
                <div
                  key={value}
                  className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    goal === value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setGoal(value as TrainingGoal)}
                >
                  <RadioGroupItem value={value} id={`goal-${value}`} />
                  <Label htmlFor={`goal-${value}`} className="cursor-pointer flex-1">{label}</Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Отмена
              </Button>
              <Button type="button" onClick={() => setStep(2)} className="flex-1" size="lg">
                Далее
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Experience */}
        {step === 2 && (
          <div className="stat-card space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Опыт тренировок</h2>
            </div>

            <RadioGroup
              value={experience}
              onValueChange={(v) => setExperience(v as ExperienceLevel)}
              className="space-y-3"
            >
              {Object.entries(EXPERIENCE_LABELS).map(([value, label]) => (
                <div
                  key={value}
                  className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    experience === value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setExperience(value as ExperienceLevel)}
                >
                  <RadioGroupItem value={value} id={`exp-${value}`} />
                  <Label htmlFor={`exp-${value}`} className="cursor-pointer flex-1">{label}</Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1" size="lg">
                Назад
              </Button>
              <Button type="button" onClick={() => setStep(3)} className="flex-1" size="lg">
                Далее
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Weekly Trainings */}
        {step === 3 && (
          <div className="stat-card space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Dumbbell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Тренировок в неделю</h2>
            </div>

            {/* Рекомендация */}
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Рекомендация</p>
                  <p className="text-sm text-muted-foreground">
                    {TRAINING_RECOMMENDATIONS[experience][goal]}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    Рекомендуется: {recommended.min}–{recommended.max} тренировок
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[2, 3, 4, 5, 6].map(num => {
                const isRecommended = num >= recommended.min && num <= recommended.max;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setWeeklyTrainings(num);
                      setSelectedDays([]);
                    }}
                    className={`relative h-16 rounded-xl text-2xl font-bold transition-all ${
                      weeklyTrainings === num
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : isRecommended
                          ? 'bg-primary/20 hover:bg-primary/30 ring-2 ring-primary/50'
                          : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {num}
                    {isRecommended && weeklyTrainings !== num && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1" size="lg">
                Назад
              </Button>
              <Button type="button" onClick={() => setStep(4)} className="flex-1" size="lg">
                Далее
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Day Selection */}
        {step === 4 && (
          <TrainingDaySelection
            selectedDays={selectedDays}
            onSelectDays={setSelectedDays}
            weeklyTrainings={weeklyTrainings}
            experience={experience}
            goal={goal}
            onBack={() => setStep(3)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
