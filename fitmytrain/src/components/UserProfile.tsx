import React from 'react';
import { useTrainingStore } from '@/store/trainingStore';
import { GOAL_LABELS, EXPERIENCE_LABELS } from '@/types/training';
import { Button } from '@/components/ui/button';
import { User, LogOut, RefreshCw } from 'lucide-react';

interface UserProfileProps {
  onLogout: () => void;
  onChangePlan: () => void;
}

export function UserProfile({ onLogout, onChangePlan }: UserProfileProps) {
  const { getCurrentUser, users, setCurrentUser } = useTrainingStore();
  const user = getCurrentUser();

  if (!user) return null;

  const switchUser = (userId: string) => {
    setCurrentUser(userId);
  };

  return (
    <div className="stat-card">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">
            {user.gender === 'male' ? 'Мужчина' : 'Женщина'}, {user.age} лет
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-xl bg-secondary">
          <div className="text-xl font-bold">{user.height}</div>
          <div className="text-xs text-muted-foreground">Рост (см)</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-secondary">
          <div className="text-xl font-bold">{user.weight}</div>
          <div className="text-xs text-muted-foreground">Вес (кг)</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-secondary">
          <div className="text-xl font-bold">{user.weeklyTrainings}</div>
          <div className="text-xs text-muted-foreground">Тр./нед.</div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Цель</span>
          <span>{GOAL_LABELS[user.goal]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Опыт</span>
          <span>{EXPERIENCE_LABELS[user.experience]}</span>
        </div>
      </div>

      {/* Change plan button */}
      <Button 
        variant="outline" 
        className="w-full mt-4" 
        onClick={onChangePlan}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Сменить план тренировок
      </Button>

      {/* Switch user */}
      {users.length > 1 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Сменить пользователя:</p>
          <div className="flex flex-wrap gap-2">
            {users.filter(u => u.id !== user.id).map(u => (
              <Button
                key={u.id}
                variant="outline"
                size="sm"
                onClick={() => switchUser(u.id)}
              >
                {u.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
