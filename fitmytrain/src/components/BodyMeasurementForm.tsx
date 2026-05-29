import React, { useState } from 'react';
import { useBodyMeasurements } from '@/hooks/useBodyMeasurements';
import { useProfile } from '@/hooks/useProfile';
import { usePersonalMaxes } from '@/hooks/usePersonalMaxes';
import { useTrainingDays } from '@/hooks/useTrainingDays';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BodyMeasurementFormProps {
  onComplete?: () => void;
}

export function BodyMeasurementForm({ onComplete }: BodyMeasurementFormProps) {
  const { addMeasurement, isAdding } = useBodyMeasurements();
  const { profile, updateProfile, isUpdating } = useProfile();
  const { personalMaxes } = usePersonalMaxes();
  const { recalculateFutureBodyweightLoads, isRecalculatingBodyweightLoads } = useTrainingDays();
  
  const [date, setDate] = useState<Date>(new Date());
  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [hips, setHips] = useState('');
  const [thighLeft, setThighLeft] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const w = parseFloat(weight);
    const wa = parseFloat(waist);
    const ch = parseFloat(chest);
    const hi = parseFloat(hips);
    const th = parseFloat(thighLeft);

    // Validate: weight, waist, chest, hips are required
    if (isNaN(w) || isNaN(wa) || isNaN(ch) || isNaN(hi)) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    if (w > 999 || wa > 999 || ch > 999 || hi > 999) {
      toast.error('Значения не могут превышать 999');
      return;
    }

    try {
      await addMeasurement({
        measured_at: format(date, 'yyyy-MM-dd'),
        weight: w,
        waist: wa,
        chest: ch,
        hips: hi,
        thigh_left: isNaN(th) ? null : th,
        thigh_right: null,
        biceps_left: null,
        biceps_right: null,
        body_fat: null,
        notes: null,
      });

      const previousWeight = profile?.weight;
      if (previousWeight !== w) {
        await updateProfile({ weight: w });
        const updatedSets = await recalculateFutureBodyweightLoads({
          bodyweight: w,
          personalMaxes,
        });

        if (updatedSets > 0) {
          toast.success(`Замеры сохранены. Нагрузка с собственным весом пересчитана: ${updatedSets} подходов`);
        } else {
          toast.success('Замеры сохранены. Вес профиля обновлён');
        }
      } else {
        toast.success('Замеры сохранены');
      }
      
      // Reset form
      setWaist('');
      setChest('');
      setHips('');
      setThighLeft('');
      onComplete?.();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error saving measurement:', error);
      }
      toast.error('Ошибка при сохранении замеров');
    }
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Замеры тела</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 rounded-full hover:bg-secondary">
              <Info className="w-4 h-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">
              Разовые замеры ничего не значат. Приложение анализирует тренд минимум за 2–4 недели.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Мы отслеживаем изменения со временем, а не разовые цифры.
      </p>

      <div className="p-3 rounded-lg bg-secondary/50 mb-4">
        <p className="text-xs text-muted-foreground">
          📌 Делай замеры 1 раз в неделю<br />
          📌 Утром, натощак<br />
          📌 В одинаковых условиях
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date picker */}
        <div>
          <Label>Дата замера</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1.5",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'd MMMM yyyy', { locale: ru }) : 'Выберите дату'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                disabled={(d) => d > new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="weight">Вес (кг) *</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              value={weight}
              onChange={e => {
                const val = e.target.value.slice(0, 5);
                if (!val.startsWith('-')) setWeight(val);
              }}
              placeholder="75.5"
              className="mt-1.5"
              maxLength={5}
            />
          </div>
          <div>
            <Label htmlFor="waist">Талия (см) *</Label>
            <Input
              id="waist"
              type="number"
              step="0.5"
              min="0"
              value={waist}
              onChange={e => {
                const val = e.target.value.slice(0, 5);
                if (!val.startsWith('-')) setWaist(val);
              }}
              placeholder="80"
              className="mt-1.5"
              maxLength={5}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="chest">Грудь (см) *</Label>
            <Input
              id="chest"
              type="number"
              step="0.5"
              min="0"
              value={chest}
              onChange={e => {
                const val = e.target.value.slice(0, 5);
                if (!val.startsWith('-')) setChest(val);
              }}
              placeholder="100"
              className="mt-1.5"
              maxLength={5}
            />
          </div>
          <div>
            <Label htmlFor="hips">Ягодицы (см) *</Label>
            <Input
              id="hips"
              type="number"
              step="0.5"
              min="0"
              value={hips}
              onChange={e => {
                const val = e.target.value.slice(0, 5);
                if (!val.startsWith('-')) setHips(val);
              }}
              placeholder="95"
              className="mt-1.5"
              maxLength={5}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="thighLeft">Бедро (см)</Label>
            <Input
              id="thighLeft"
              type="number"
              step="0.5"
              min="0"
              value={thighLeft}
              onChange={e => {
                const val = e.target.value.slice(0, 5);
                if (!val.startsWith('-')) setThighLeft(val);
              }}
              placeholder="55"
              className="mt-1.5"
              maxLength={5}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isAdding || isUpdating || isRecalculatingBodyweightLoads}>
          {isAdding || isUpdating || isRecalculatingBodyweightLoads ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Сохранить замеры
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
