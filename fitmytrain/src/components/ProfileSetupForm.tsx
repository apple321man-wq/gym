import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProfile } from '@/hooks/useProfile';
import { useTrainingDays } from '@/hooks/useTrainingDays';
import { useExtendedProfile } from '@/hooks/useExtendedProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TrainingDaySelection } from '@/components/TrainingDaySelection';
import { getRecommendedFrequency, TRAINING_RECOMMENDATIONS, WeekDay } from '@/data/trainingPrograms';
import { buildWorkoutPlan } from '@/lib/trainer/buildWorkoutPlan';
import { GOAL_LABELS, EXPERIENCE_LABELS } from '@/types/training';
import { Dumbbell, User as UserIcon, Target, Clock, Info, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Regex for name: only Cyrillic and Latin letters, spaces allowed
const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;

const profileSchema = z.object({
  name: z.string()
    .min(2, 'Минимум 2 символа')
    .max(25, 'Максимум 25 символов')
    .regex(nameRegex, 'Только буквы (кириллица или латиница)')
    .transform(val => val.trim()),
  gender: z.enum(['male', 'female']),
  age: z.number().min(14, 'Минимум 14 лет').max(100, 'Максимум 100 лет'),
  height: z.number().min(100, 'Минимум 100 см').max(250, 'Максимум 250 см'),
  weight: z.number().min(30, 'Минимум 30 кг').max(300, 'Максимум 300 кг'),
  goal: z.enum(['muscle_gain', 'recomposition', 'cutting', 'maintenance']),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  weekly_trainings: z.number().min(2).max(6),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileSetupFormProps {
  onComplete: () => void;
}

export function ProfileSetupForm({ onComplete }: ProfileSetupFormProps) {
  const [step, setStep] = useState(1);
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProfile } = useProfile();
  const { bulkCreateTrainingDays } = useTrainingDays();
  const { toast } = useToast();

  const { register, setValue, watch, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      gender: 'male',
      goal: 'muscle_gain',
      experience: 'beginner',
      weekly_trainings: 3,
    },
  });

  const watchedValues = watch();
  const recommended = getRecommendedFrequency(watchedValues.experience, watchedValues.goal);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Create profile - convert WeekDay to day index
      const dayToIndex: Record<WeekDay, number> = {
        monday: 0, tuesday: 1, wednesday: 2, thursday: 3,
        friday: 4, saturday: 5, sunday: 6,
      };
      
      await createProfile({
        name: watchedValues.name,
        gender: watchedValues.gender,
        age: watchedValues.age,
        height: watchedValues.height,
        weight: watchedValues.weight,
        goal: watchedValues.goal,
        experience: watchedValues.experience,
        weekly_trainings: watchedValues.weekly_trainings,
        selected_days: selectedDays.map(d => dayToIndex[d]),
      });

      const workoutPlan = buildWorkoutPlan({
        user: {
          gender: watchedValues.gender,
          age: watchedValues.age,
          weight: watchedValues.weight,
          experience: watchedValues.experience,
          weeklyTrainings: watchedValues.weekly_trainings,
        },
        goal: watchedValues.goal,
        priorityMuscles: [],
        availableDays: selectedDays,
      });

      await bulkCreateTrainingDays(workoutPlan.days);

      toast({
        title: 'Профиль создан!',
        description: 'План тренировок на 12 недель сгенерирован',
      });

      onComplete();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Profile setup error:', error);
      }
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось создать профиль',
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
          <h1 className="text-3xl font-bold text-gradient mb-2">TrainLog</h1>
          <p className="text-muted-foreground">Настройка профиля</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(s => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="stat-card space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <UserIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Основные данные</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Введите имя"
                    className="mt-1.5"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label>Пол</Label>
                  <RadioGroup
                    value={watchedValues.gender}
                    onValueChange={(v) => setValue('gender', v as 'male' | 'female')}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">Мужской</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">Женский</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="age">Возраст</Label>
                    <Input
                      id="age"
                      type="number"
                      {...register('age', { valueAsNumber: true })}
                      placeholder="25"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Рост (см)</Label>
                    <Input
                      id="height"
                      type="number"
                      {...register('height', { valueAsNumber: true })}
                      placeholder="175"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Вес (кг)</Label>
                    <Input
                      id="weight"
                      type="number"
                      {...register('weight', { valueAsNumber: true })}
                      placeholder="75"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>

              <Button type="button" onClick={() => setStep(2)} className="w-full" size="lg">
                Далее
              </Button>
            </div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <div className="stat-card space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Цель тренировок</h2>
              </div>

              <RadioGroup
                value={watchedValues.goal}
                onValueChange={(v) => setValue('goal', v as ProfileFormData['goal'])}
                className="space-y-3"
              >
                {Object.entries(GOAL_LABELS).map(([value, label]) => (
                  <div
                    key={value}
                    className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      watchedValues.goal === value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setValue('goal', value as ProfileFormData['goal'])}
                  >
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value} className="cursor-pointer flex-1">{label}</Label>
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

          {/* Step 3: Experience */}
          {step === 3 && (
            <div className="stat-card space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Опыт тренировок</h2>
              </div>

              <RadioGroup
                value={watchedValues.experience}
                onValueChange={(v) => setValue('experience', v as ProfileFormData['experience'])}
                className="space-y-3"
              >
                {Object.entries(EXPERIENCE_LABELS).map(([value, label]) => (
                  <div
                    key={value}
                    className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      watchedValues.experience === value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setValue('experience', value as ProfileFormData['experience'])}
                  >
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value} className="cursor-pointer flex-1">{label}</Label>
                  </div>
                ))}
              </RadioGroup>

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

          {/* Step 4: Weekly Trainings */}
          {step === 4 && (
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
                      {TRAINING_RECOMMENDATIONS[watchedValues.experience][watchedValues.goal]}
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
                        setValue('weekly_trainings', num);
                        setSelectedDays([]);
                      }}
                      className={`relative h-16 rounded-xl text-2xl font-bold transition-all ${
                        watchedValues.weekly_trainings === num
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                          : isRecommended
                            ? 'bg-primary/20 hover:bg-primary/30 ring-2 ring-primary/50'
                            : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {num}
                      {isRecommended && watchedValues.weekly_trainings !== num && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1" size="lg">
                  Назад
                </Button>
                <Button type="button" onClick={() => setStep(5)} className="flex-1" size="lg">
                  Далее
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Day Selection */}
          {step === 5 && (
            <TrainingDaySelection
              selectedDays={selectedDays}
              onSelectDays={setSelectedDays}
              weeklyTrainings={watchedValues.weekly_trainings}
              experience={watchedValues.experience}
              goal={watchedValues.goal}
              onBack={() => setStep(4)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </form>
      </div>
    </div>
  );
}
