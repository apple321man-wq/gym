import { useFatigueLevel } from '@/hooks/useExtendedProfile';
import { FATIGUE_LABELS, FatigueLevel } from '@/types/exercise-metadata';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Battery, BatteryLow, BatteryMedium } from 'lucide-react';

const FATIGUE_ICONS: Record<FatigueLevel, React.ReactNode> = {
  low: <Battery className="h-4 w-4" />,
  medium: <BatteryMedium className="h-4 w-4" />,
  high: <BatteryLow className="h-4 w-4" />,
};

const FATIGUE_COLORS: Record<FatigueLevel, string> = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};

const FATIGUE_DESCRIPTIONS: Record<FatigueLevel, string> = {
  low: 'Отличная форма! Можно тренироваться на полную мощность.',
  medium: 'Умеренная усталость. Следи за самочувствием.',
  high: 'Высокая усталость. Рекомендуется снизить интенсивность или отдохнуть.',
};

interface FatigueIndicatorProps {
  size?: 'sm' | 'default';
  showLabel?: boolean;
}

export function FatigueIndicator({ size = 'default', showLabel = true }: FatigueIndicatorProps) {
  const { data: fatigueLevel, isLoading } = useFatigueLevel();

  if (isLoading || !fatigueLevel) {
    return null;
  }

  const content = (
    <Badge 
      variant="outline" 
      className={`${FATIGUE_COLORS[fatigueLevel]} ${size === 'sm' ? 'text-xs px-2 py-0.5' : ''}`}
    >
      {FATIGUE_ICONS[fatigueLevel]}
      {showLabel && <span className="ml-1">{FATIGUE_LABELS[fatigueLevel]}</span>}
    </Badge>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="font-medium">{FATIGUE_LABELS[fatigueLevel]}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {FATIGUE_DESCRIPTIONS[fatigueLevel]}
          </p>
          <p className="text-xs text-muted-foreground mt-2 opacity-70">
            Рассчитано автоматически на основе твоих тренировок
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
