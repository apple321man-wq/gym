import React from 'react';
import { WeekDay, WEEKDAY_LABELS, WEEKDAY_SHORT_LABELS, ALL_WEEKDAYS, getRecommendedFrequency } from '@/data/trainingPrograms';
import { TrainingGoal, ExperienceLevel, GOAL_LABELS, EXPERIENCE_LABELS } from '@/types/training';
import { Button } from '@/components/ui/button';
import { CalendarDays, Info, Check } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TrainingDaySelectionProps {
  selectedDays: WeekDay[];
  onSelectDays: (days: WeekDay[]) => void;
  weeklyTrainings: number;
  experience: ExperienceLevel;
  goal: TrainingGoal;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function TrainingDaySelection({
  selectedDays,
  onSelectDays,
  weeklyTrainings,
  experience,
  goal,
  onBack,
  onSubmit,
  isSubmitting = false,
}: TrainingDaySelectionProps) {
  const recommended = getRecommendedFrequency(experience, goal);

  const toggleDay = (day: WeekDay) => {
    if (selectedDays.includes(day)) {
      onSelectDays(selectedDays.filter(d => d !== day));
    } else if (selectedDays.length < weeklyTrainings) {
      onSelectDays([...selectedDays, day]);
    }
  };

  const isComplete = selectedDays.length === weeklyTrainings;

  return (
    <div className="stat-card space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Дни тренировок</h2>
      </div>

      {/* Рекомендации */}
      <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Для достижения цели "{GOAL_LABELS[goal]}" с вашим уровнем "{EXPERIENCE_LABELS[experience]}"
            </p>
            <p className="text-sm text-muted-foreground">
              Рекомендуется {recommended.min}–{recommended.max} тренировок в неделю. 
              Вы выбрали {weeklyTrainings}.
            </p>
          </div>
        </div>
      </div>

      {/* Выбор дней */}
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Выберите {weeklyTrainings} {weeklyTrainings === 1 ? 'день' : weeklyTrainings < 5 ? 'дня' : 'дней'} для тренировок:
        </p>
        
        <div className="grid grid-cols-7 gap-2">
          {ALL_WEEKDAYS.map(day => {
            const isSelected = selectedDays.includes(day);
            const isDisabled = !isSelected && selectedDays.length >= weeklyTrainings;

            return (
              <TooltipProvider key={day}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => toggleDay(day)}
                      disabled={isDisabled}
                      className={`
                        relative flex flex-col items-center justify-center p-3 rounded-xl 
                        transition-all min-h-[72px]
                        ${isSelected
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                          : isDisabled
                            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                            : 'bg-secondary hover:bg-secondary/80'
                        }
                      `}
                    >
                      <span className="text-xs font-medium">
                        {WEEKDAY_SHORT_LABELS[day]}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 mt-1" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{WEEKDAY_LABELS[day]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      {/* Выбранные дни */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Выбрано: {selectedDays.length} из {weeklyTrainings}
        </p>
        {isComplete && (
          <p className="text-sm text-primary mt-1 font-medium">
            ✓ Все дни выбраны
          </p>
        )}
      </div>

      {/* Информация о плане */}
      {isComplete && (
        <div className="p-4 bg-accent/50 rounded-xl">
          <p className="text-sm font-medium mb-2">
            После подтверждения:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• План тренировок будет добавлен в календарь</li>
            <li>• Каждый день будет содержать рекомендуемые упражнения</li>
            <li>• Вы сможете редактировать вес, подходы и упражнения</li>
            <li>• Только подтверждённые тренировки засчитываются в статистику</li>
          </ul>
        </div>
      )}

      {/* Кнопки */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1" size="lg">
          Назад
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit} 
          className="flex-1" 
          size="lg"
          disabled={!isComplete || isSubmitting}
        >
          {isSubmitting ? 'Создание...' : 'Начать'}
        </Button>
      </div>
    </div>
  );
}
