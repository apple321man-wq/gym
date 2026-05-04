import React from 'react';
import { RIR_OPTIONS, type RIRLevel } from '@/lib/rirWeightAdjustment';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { formatWeight, isValidWeight } from '@/lib/weightFormat';

interface RIRSelectorProps {
  open: boolean;
  onSelect: (rir: RIRLevel) => void;
  onClose: () => void;
  exerciseName: string;
  setNumber: number;
  weight: number | null;
  reps: number;
}

export function RIRSelector({ open, onSelect, onClose, exerciseName, setNumber, weight, reps }: RIRSelectorProps) {
  const rirColors: Record<RIRLevel, string> = {
    4: 'bg-[hsl(var(--intensity-easy))] text-[hsl(var(--primary-foreground))]',
    2: 'bg-[hsl(var(--intensity-medium))] text-[hsl(var(--primary-foreground))]',
    1: 'bg-[hsl(var(--intensity-hard))]/80 text-white',
    0: 'bg-[hsl(var(--intensity-hard))] text-white',
  };

  const weightLabel = isValidWeight(weight) ? `${formatWeight(weight)} × ` : '';

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent>
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-center">Как прошло?</DrawerTitle>
          <DrawerDescription className="text-center">
            {exerciseName} • Подход {setNumber} • {weightLabel}{reps}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-2">
          {RIR_OPTIONS.map((option) => (
            <button
              key={option.rir}
              onClick={() => onSelect(option.rir)}
              className={cn(
                'w-full flex items-center gap-3 p-4 rounded-xl transition-all active:scale-[0.98]',
                rirColors[option.rir]
              )}
            >
              <span className="text-2xl">{option.emoji}</span>
              <div className="text-left">
                <div className="font-semibold">{option.label}</div>
                <div className="text-xs opacity-80">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
