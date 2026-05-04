import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Gender, TrainingGoal, ExperienceLevel, GOAL_LABELS, EXPERIENCE_LABELS, WeekDay } from '@/types/training';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTrainingStore } from '@/store/trainingStore';
import { TrainingDaySelection } from '@/components/TrainingDaySelection';
import { getRecommendedFrequency, TRAINING_RECOMMENDATIONS } from '@/data/trainingPrograms';
import { buildWorkoutPlan } from '@/lib/trainer/buildWorkoutPlan';
import { Dumbbell, User as UserIcon, Target, Clock, Info } from 'lucide-react';

// Regex for name: only Cyrillic and Latin letters, spaces allowed
const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;

const registrationSchema = z.object({
  name: z.string()
    .min(2, 'Минимум 2 символа')
    .max(25, 'Максимум 25 символов')
    .regex(nameRegex, 'Только буквы (кириллица или латиница)')
    .transform(val => val.trim()),
  gender: z.enum(['male', 'female']),
  age: z.number().min(14, 'Минимум 14 лет').max(999, 'Максимум 3 цифры'),
  height: z.number().min(100, 'Минимум 100 см').max(999, 'Максимум 3 цифры'),
  weight: z.number().min(30, 'Минимум 30 кг').max(999, 'Максимум 3 цифры'),
  goal: z.enum(['muscle_gain', 'recomposition', 'cutting', 'maintenance']),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  weeklyTrainings: z.number().min(2).max(6),
});

type RegistrationData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onComplete: () => void;
}

export function RegistrationForm({ onComplete }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const { addUser, setCurrentUser, users, addTrainingDay } = useTrainingStore();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      gender: 'male',
      goal: 'muscle_gain',
      experience: 'beginner',
      weeklyTrainings: 3,
    },
  });

  const watchedValues = watch();
  const recommended = getRecommendedFrequency(watchedValues.experience, watchedValues.goal);

  const onSubmit = () => {
    const data = watchedValues;
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name,
      gender: data.gender,
      age: data.age,
      height: data.height,
      weight: data.weight,
      goal: data.goal,
      experience: data.experience,
      weeklyTrainings: data.weeklyTrainings,
      trainingDays: selectedDays,
      planGenerated: true,
      createdAt: new Date().toISOString(),
    };
    
    const success = addUser(newUser);
    if (success) {
      setCurrentUser(newUser.id);
      
      const workoutPlan = buildWorkoutPlan({
        user: newUser,
        goal: data.goal,
        availableDays: selectedDays,
        priorityMuscles: [],
      });
      
      workoutPlan.days.forEach(day => {
        addTrainingDay({
          id: crypto.randomUUID(),
          userId: newUser.id,
          date: day.date,
          intensity: day.intensity,
          exercises: day.exercises.map(exercise => ({
            id: crypto.randomUUID(),
            exerciseId: exercise.exercise_id,
            sets: exercise.sets.map(set => ({
              id: crypto.randomUUID(),
              setNumber: set.set_number,
              targetReps: set.target_reps,
              targetWeight: set.target_weight ?? 0,
              completed: false,
            })),
            completed: false,
          })),
          completed: false,
        });
      });
      
      onComplete();
    }
  };

  const canAddUser = users.length < 5;

  if (!canAddUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="stat-card">
            <UserIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Лимит пользователей</h2>
            <p className="text-muted-foreground">
              Достигнут максимум в 5 пользователей. Удалите существующего пользователя для создания нового.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">TrainLog</h1>
          <p className="text-muted-foreground">Контроль нагрузки и прогресса</p>
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
                    onValueChange={(v) => setValue('gender', v as Gender)}
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
                onValueChange={(v) => setValue('goal', v as TrainingGoal)}
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
                    onClick={() => setValue('goal', value as TrainingGoal)}
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
                onValueChange={(v) => setValue('experience', v as ExperienceLevel)}
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
                    onClick={() => setValue('experience', value as ExperienceLevel)}
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
                        setValue('weeklyTrainings', num);
                        // Сбросить выбранные дни если изменилось количество
                        setSelectedDays([]);
                      }}
                      className={`relative h-16 rounded-xl text-2xl font-bold transition-all ${
                        watchedValues.weeklyTrainings === num
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                          : isRecommended
                            ? 'bg-primary/20 hover:bg-primary/30 ring-2 ring-primary/50'
                            : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {num}
                      {isRecommended && watchedValues.weeklyTrainings !== num && (
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
              weeklyTrainings={watchedValues.weeklyTrainings}
              experience={watchedValues.experience}
              goal={watchedValues.goal}
              onBack={() => setStep(4)}
              onSubmit={onSubmit}
            />
          )}
        </form>

        {/* Users count */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Пользователей: {users.length}/5
        </p>
      </div>
    </div>
  );
}
