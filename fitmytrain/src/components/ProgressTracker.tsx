import React, { useState } from 'react';
import { useBodyMeasurements } from '@/hooks/useBodyMeasurements';
import { BodyMeasurementForm } from './BodyMeasurementForm';
import { WeightProgressTracker } from './WeightProgressTracker';
import { analyzeProgress, STATUS_LABELS, TREND_LABELS } from '@/lib/progressAnalysis';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  Trash2, 
  AlertTriangle,
  HelpCircle,
  Activity,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ProgressTracker() {
  const { measurements, isLoading, deleteMeasurement } = useBodyMeasurements();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Transform measurements for analysis (cloud format → analysis format)
  const measurementsForAnalysis = measurements.map(m => ({
    id: m.id,
    date: m.measured_at,
    weight: m.weight ?? 0,
    waist: m.waist ?? 0,
    chest: m.chest ?? 0,
    hip: m.thigh_left ?? m.hips ?? 0, // Use thigh_left or fallback to hips
  }));

  const analysis = analyzeProgress(measurementsForAnalysis);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMeasurement(id);
      toast.success('Замер удалён');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error deleting measurement:', error);
      }
      toast.error('Ошибка при удалении');
    } finally {
      setDeletingId(null);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-blue-500" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const statusInfo = STATUS_LABELS[analysis.status];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <WeightProgressTracker />
        <div className="stat-card flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Weight Progress Section */}
      <WeightProgressTracker />
      
      {/* Body Measurements Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Замеры тела
        </h3>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Как приложение оценивает изменения тела</DialogTitle>
                <DialogDescription>
                  Понимание методологии анализа
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p>
                  Мы используем окружности тела как индикаторы, а не как медицинские измерения.
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>Талия</strong> — основной индикатор изменения жировой массы</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>Грудь и бедро</strong> — индикаторы изменений безжировой массы (мышцы + вода)</span>
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  Приложение не пытается угадать точный процент жира. Оно показывает направление и устойчивость изменений.
                </p>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            size="sm" 
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Замер
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <BodyMeasurementForm onComplete={() => setShowForm(false)} />
      )}

      {/* Analysis results */}
      {measurements.length > 0 && (
        <>
          {/* Status card */}
          <div className="stat-card">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">{statusInfo.emoji}</span>
              <div>
                <h4 className="font-semibold text-lg">{statusInfo.title}</h4>
                <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
              </div>
            </div>

            {/* Warnings */}
            {analysis.warnings.length > 0 && (
              <div className="space-y-2 mb-4">
                {analysis.warnings.map((warning, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-2 p-2 rounded-lg bg-intensity-medium/10 border border-intensity-medium/30"
                  >
                    <AlertTriangle className="w-4 h-4 text-intensity-medium shrink-0 mt-0.5" />
                    <span className="text-sm">{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trends */}
            <div className="grid grid-cols-2 gap-3">
              {/* Fat trend */}
              <div className="p-3 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2 mb-1">
                  {getTrendIcon(analysis.fatTrend)}
                  <span className="text-sm font-medium">Жировая масса</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {TREND_LABELS[analysis.fatTrend].icon} {TREND_LABELS[analysis.fatTrend].label}
                </p>
                {analysis.fatChangeRange && (
                  <p className="text-xs text-primary mt-1">
                    {analysis.fatChangeRange.min > 0 ? '+' : ''}{analysis.fatChangeRange.min} … {analysis.fatChangeRange.max > 0 ? '+' : ''}{analysis.fatChangeRange.max} кг
                  </p>
                )}
              </div>

              {/* Muscle trend */}
              <div className="p-3 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2 mb-1">
                  {getTrendIcon(analysis.muscleTrend)}
                  <span className="text-sm font-medium">Безжировая масса</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {TREND_LABELS[analysis.muscleTrend].icon} {TREND_LABELS[analysis.muscleTrend].label}
                </p>
                {analysis.muscleChangeRange && (
                  <p className="text-xs text-primary mt-1">
                    {analysis.muscleChangeRange.min > 0 ? '+' : ''}{analysis.muscleChangeRange.min} … {analysis.muscleChangeRange.max > 0 ? '+' : ''}{analysis.muscleChangeRange.max} кг
                  </p>
                )}
              </div>
            </div>

            {/* Ranges disclaimer */}
            {(analysis.fatChangeRange || analysis.muscleChangeRange) && (
              <p className="text-xs text-muted-foreground mt-3">
                Точные значения невозможно определить по замерам. Мы показываем вероятный диапазон.
              </p>
            )}
          </div>

          {/* Measurements history */}
          <div className="stat-card">
            <h4 className="font-medium mb-3">История замеров</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {measurements.map((m) => (
                <div 
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {format(new Date(m.measured_at), 'd MMM yyyy', { locale: ru })}
                    </p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>{m.weight ?? '—'} кг</span>
                      <span>Т: {m.waist ?? '—'}</span>
                      <span>Г: {m.chest ?? '—'}</span>
                      <span>Я: {m.hips ?? '—'}</span>
                      {m.thigh_left && <span>Б: {m.thigh_left}</span>}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="shrink-0"
                        disabled={deletingId === m.id}
                      >
                        {deletingId === m.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-destructive" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить замер?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(m.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Empty state for measurements */}
      {measurements.length === 0 && !showForm && (
        <div className="stat-card text-center py-8">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h4 className="font-medium mb-1">Нет замеров тела</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Добавьте первый замер, чтобы начать отслеживать изменения тела
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить замер
          </Button>
        </div>
      )}
    </div>
  );
}
