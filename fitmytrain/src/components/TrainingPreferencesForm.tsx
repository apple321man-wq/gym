import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useExtendedProfile } from '@/hooks/useExtendedProfile';
import { 
  EquipmentType, 
  InjuryArea, 
  EQUIPMENT_LABELS, 
  INJURY_LABELS 
} from '@/types/exercise-metadata';
import { MuscleGroup, MUSCLE_GROUP_LABELS, PRIORITY_MUSCLE_GROUPS } from '@/types/training';
import { AlertTriangle, Dumbbell, Target, Loader2, BookOpen, Zap, BarChart3, ChevronDown } from 'lucide-react';

const ALL_EQUIPMENT: EquipmentType[] = ['barbell', 'dumbbells', 'machines', 'cables', 'bodyweight', 'kettlebell', 'bands'];
const ALL_INJURIES: InjuryArea[] = ['knee', 'shoulder', 'lower_back', 'elbow', 'wrist', 'hip', 'ankle', 'neck'];
const ALL_MUSCLES: MuscleGroup[] = PRIORITY_MUSCLE_GROUPS;

interface TrainingPreferencesFormProps {
  onComplete?: () => void;
  showTitle?: boolean;
}

export function TrainingPreferencesForm({ onComplete, showTitle = true }: TrainingPreferencesFormProps) {
  const { extendedProfile, isLoading, updateExtendedProfile, isUpdating } = useExtendedProfile();

  const [equipment, setEquipment] = useState<EquipmentType[]>(
    extendedProfile?.equipment || ['barbell', 'dumbbells', 'machines', 'cables', 'bodyweight']
  );
  const [injuries, setInjuries] = useState<InjuryArea[]>(extendedProfile?.injuries || []);
  const [priorityMuscles, setPriorityMuscles] = useState<MuscleGroup[]>(extendedProfile?.priorityMuscles || []);

  // Update local state when profile loads
  useState(() => {
    if (extendedProfile) {
      setEquipment(extendedProfile.equipment);
      setInjuries(extendedProfile.injuries);
      setPriorityMuscles(extendedProfile.priorityMuscles);
    }
  });

  const toggleEquipment = (item: EquipmentType) => {
    setEquipment(prev => 
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  };

  const toggleInjury = (item: InjuryArea) => {
    setInjuries(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  };

  const togglePriorityMuscle = (item: MuscleGroup) => {
    if (priorityMuscles.includes(item)) {
      setPriorityMuscles(prev => prev.filter(e => e !== item));
    } else if (priorityMuscles.length < 2) {
      setPriorityMuscles(prev => [...prev, item]);
    }
  };

  const handleSave = async () => {
    await updateExtendedProfile({
      equipment,
      injuries,
      priorityMuscles,
    });
    onComplete?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold">Настройки тренировок</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Настрой параметры для персонализации плана
          </p>
        </div>
      )}

      {/* Equipment - temporarily hidden from UI */}
      {false && (
        <Card>
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              Доступное оборудование
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Выбери снаряды, которые есть в твоём зале
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {ALL_EQUIPMENT.map((item) => (
                <Label
                  key={item}
                  className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={equipment.includes(item)}
                    onCheckedChange={() => toggleEquipment(item)}
                    className="h-4 w-4 flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm leading-tight">{EQUIPMENT_LABELS[item]}</span>
                </Label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


      {/* Priority Muscles */}
      <Card>
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            Приоритетные мышцы
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Выбери до 2 групп мышц для акцентированной проработки
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {ALL_MUSCLES.map((item) => {
              const isSelected = priorityMuscles.includes(item);
              const isDisabled = !isSelected && priorityMuscles.length >= 2;
              
              return (
                <Badge
                  key={item}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all text-xs sm:text-sm px-2 py-1 ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  } ${isSelected ? 'ring-2 ring-primary/30' : ''}`}
                  onClick={() => !isDisabled && togglePriorityMuscle(item)}
                >
                  {MUSCLE_GROUP_LABELS[item]}
                </Badge>
              );
            })}
          </div>
          {priorityMuscles.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Выбрано: {priorityMuscles.map(m => MUSCLE_GROUP_LABELS[m]).join(', ')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Save button */}
      <Button 
        onClick={handleSave} 
        className="w-full" 
        size="lg"
        disabled={isUpdating || equipment.length === 0}
      >
        {isUpdating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Сохранение...
          </>
        ) : (
          'Сохранить настройки'
        )}
      </Button>

      {/* Collapsible info section */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 hover:bg-secondary/50 transition-colors group">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Информация</span>
              <span className="text-xs text-muted-foreground">— как работает адаптивная система</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3 animate-in slide-in-from-top-2 duration-200">
          {/* PM */}
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/50 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">Персональный максимум (ПМ)</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ПМ — это максимальный вес, который вы можете поднять <span className="text-foreground font-medium">один раз</span>. 
              Приложение использует его, чтобы автоматически подбирать рабочие веса для каждого упражнения. 
              Вам не нужно запоминать или считать — система делает это за вас.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ПМ обновляется автоматически: если вы стабильно справляетесь с весом — он растёт, 
              если слишком тяжело — корректируется вниз. Вы также можете обновить его вручную во вкладке <span className="text-primary font-medium">ПМ</span>.
            </p>
          </div>

          {/* RIR */}
          <div className="p-3 rounded-xl bg-secondary/50 border border-border/50 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">Обратная связь (RIR)</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              После каждого подхода приложение спрашивает: <span className="text-foreground font-medium">«Как прошло?»</span>. 
              Ваша задача — <span className="text-primary font-medium">честно прислушаться к своему телу</span> и выбрать один из вариантов:
            </p>
            <div className="space-y-1.5 pl-1">
              <div className="flex items-center gap-2 text-xs">
                <span>😎</span>
                <span className="text-foreground font-medium">На изи</span>
                <span className="text-muted-foreground">— мог ещё много повторов</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>💪</span>
                <span className="text-foreground font-medium">Можно было ещё пару</span>
                <span className="text-muted-foreground">— запас 2–3 повтора</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>😤</span>
                <span className="text-foreground font-medium">Максимум ещё один</span>
                <span className="text-muted-foreground">— почти предел</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>🔥</span>
                <span className="text-foreground font-medium">Из последних сил</span>
                <span className="text-muted-foreground">— до отказа</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              На основе этой оценки приложение корректирует вес для следующего подхода и следующей тренировки. 
              Чем точнее вы оцениваете — тем лучше система подстраивается под вас.
            </p>
          </div>

          {/* Main rule */}
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
            <h4 className="font-semibold text-sm text-primary">🎯 Главное правило</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Прислушивайтесь к своему телу.</span> Не пытайтесь казаться сильнее — 
              честная оценка нагрузки позволяет системе работать точнее. 
              Если подход был тяжёлым — так и скажите. Если легко — тоже. 
              Приложение адаптируется: увеличит вес когда вы готовы и снизит когда нужен отдых.
            </p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-primary/10">
              <div className="flex gap-1 text-xs text-muted-foreground">
                <span className="text-primary">①</span> Делаете подход →
                <span className="text-primary">②</span> Оцениваете →
                <span className="text-primary">③</span> Система корректирует →
                <span className="text-primary">④</span> Вы прогрессируете
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

    </div>
  );
}
