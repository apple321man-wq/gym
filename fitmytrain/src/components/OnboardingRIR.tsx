import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dumbbell, BarChart3, Zap } from 'lucide-react';

interface OnboardingRIRProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Dumbbell,
    title: 'Как приложение подбирает вес',
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>Мы рассчитываем ваш <span className="text-foreground font-semibold">ПМ</span> — это максимальный вес, который вы можете поднять один раз.</p>
        <p>На основе ПМ приложение автоматически:</p>
        <ul className="space-y-1.5 ml-1">
          <li className="flex items-center gap-2">✅ подбирает рабочие веса</li>
          <li className="flex items-center gap-2">✅ регулирует нагрузку</li>
          <li className="flex items-center gap-2">✅ отслеживает прогресс</li>
        </ul>
        <p className="text-primary font-medium">Вам не нужно запоминать веса — приложение делает это автоматически.</p>
      </div>
    ),
  },
  {
    icon: BarChart3,
    title: 'Как мы понимаем, насколько было тяжело',
    content: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>После каждого подхода вы оцениваете нагрузку:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[hsl(var(--intensity-easy))]/10">
            <span className="text-lg">😎</span>
            <span className="font-medium text-foreground">На изи</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[hsl(var(--intensity-medium))]/10">
            <span className="text-lg">💪</span>
            <span className="font-medium text-foreground">Можно было ещё пару</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[hsl(var(--intensity-hard))]/10">
            <span className="text-lg">😤</span>
            <span className="font-medium text-foreground">Максимум ещё один</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[hsl(var(--intensity-hard))]/20">
            <span className="text-lg">🔥</span>
            <span className="font-medium text-foreground">Из последних сил</span>
          </div>
        </div>
        <p>На основе этого приложение <span className="text-primary font-semibold">увеличивает</span>, <span className="text-[hsl(var(--intensity-hard))] font-semibold">уменьшает</span> или оставляет вес без изменений.</p>
      </div>
    ),
  },
  {
    icon: Zap,
    title: 'Как это работает',
    content: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">1</div>
            <span>Приложение назначает вес</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">2</div>
            <span>Вы делаете подход</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">3</div>
            <span>Выбираете нагрузку</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">4</div>
            <span>Приложение корректирует вес</span>
          </div>
        </div>
        <p className="text-primary font-semibold text-center text-base">И всё. 🎯</p>
      </div>
    ),
  },
];

export function OnboardingRIR({ onComplete }: OnboardingRIRProps) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? 'bg-primary w-6' : i < step ? 'bg-primary/50' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center">{current.title}</h2>

        {/* Content */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          {current.content}
        </div>

        {/* Button */}
        <Button
          onClick={() => isLast ? onComplete() : setStep(step + 1)}
          className="w-full"
          size="lg"
        >
          {isLast ? 'Начать тренировки' : 'Далее'}
        </Button>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Назад
          </button>
        )}
      </div>
    </div>
  );
}
