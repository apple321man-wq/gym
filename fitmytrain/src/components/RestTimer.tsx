import React, { useState, useEffect, useRef, useCallback } from 'react';
import { formatRestTime } from '@/lib/restTimerEngine';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatWeight, isValidWeight } from '@/lib/weightFormat';

interface RestTimerProps {
  totalSeconds: number;
  nextWeight: number | null;
  exerciseName: string;
  nextSetNumber: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimer({ totalSeconds, nextWeight, exerciseName, nextSetNumber, onComplete, onSkip }: RestTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const endTimeRef = useRef(Date.now() + totalSeconds * 1000);
  const rafRef = useRef<number | null>(null);
  const readyPlayedRef = useRef(false);
  const donePlayedRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const notificationPermissionRef = useRef(false);

  // Request notification permission on mount for mobile audio
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(perm => {
        notificationPermissionRef.current = perm === 'granted';
      });
    } else if ('Notification' in window) {
      notificationPermissionRef.current = Notification.permission === 'granted';
    }
  }, []);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume if suspended (needed after screen lock)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playBeep = useCallback((frequency: number, duration: number) => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // audio not available
    }
  }, [getAudioCtx]);

  const sendNotification = useCallback((title: string, body: string) => {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, tag: 'rest-timer' } as NotificationOptions);
      }
    } catch {
      // notifications not available
    }
  }, []);

  const speakText = useCallback((text: string) => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.volume = 0.8;
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // speech not available
    }
  }, []);

  // Use absolute time-based countdown with requestAnimationFrame + setInterval fallback
  useEffect(() => {
    const updateRemaining = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
      setRemaining(diff);
      return diff;
    };

    // Use setInterval as primary (works in background better than rAF)
    const interval = setInterval(() => {
      updateRemaining();
    }, 250); // Check 4x/sec for accuracy

    // Also use rAF for smooth UI when tab is active
    const tick = () => {
      updateRemaining();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearInterval(interval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Audio alerts
  useEffect(() => {
    if (remaining === 10 && !readyPlayedRef.current) {
      readyPlayedRef.current = true;
      playBeep(880, 0.15);
      setTimeout(() => speakText('Ready'), 200);
      sendNotification('⏱ Приготовься', '10 секунд до следующего подхода');
    }
    if (remaining === 0 && !donePlayedRef.current) {
      donePlayedRef.current = true;
      playBeep(1046, 0.2);
      setTimeout(() => playBeep(1318, 0.2), 250);
      setTimeout(() => speakText("Let's play"), 500);
      sendNotification('💪 Время!', `${exerciseName} — подход ${nextSetNumber}`);
      setTimeout(onComplete, 2000);
    }
  }, [remaining, playBeep, speakText, sendNotification, onComplete, exerciseName, nextSetNumber]);

  // Cleanup audio context
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const progress = ((totalSeconds - remaining) / totalSeconds) * 100;
  const isWarning = remaining <= 10 && remaining > 0;

  return (
    <div className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-md flex flex-col items-center justify-center p-6">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={onSkip}
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Title */}
      <p className="text-sm text-muted-foreground mb-2">Отдых</p>

      {/* Circular timer */}
      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={isWarning ? 'hsl(var(--intensity-hard))' : 'hsl(var(--primary))'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-300 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            'text-5xl font-bold tabular-nums transition-colors',
            isWarning && 'text-[hsl(var(--intensity-hard))] animate-pulse'
          )}>
            {formatRestTime(remaining)}
          </span>
        </div>
      </div>

      {/* Next set info */}
      <div className="text-center space-y-1 mb-8">
        <p className="text-sm text-muted-foreground">Следующий подход</p>
        <p className="font-semibold">{exerciseName}</p>
        <p className="text-lg">
          Подход {nextSetNumber}
          {isValidWeight(nextWeight) && <> • <span className="font-bold">{formatWeight(nextWeight)}</span></>}
        </p>
      </div>

      {/* Skip button */}
      <Button
        variant="outline"
        size="lg"
        className="w-full max-w-xs"
        onClick={onSkip}
      >
        Готов раньше
      </Button>
    </div>
  );
}
