import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { ProfileSetupForm } from '@/components/ProfileSetupForm';
import { ChangePlanForm } from '@/components/ChangePlanForm';
import { TrainingPreferencesForm } from '@/components/TrainingPreferencesForm';
import { Calendar } from '@/components/Calendar';
import { TrainingDayView } from '@/components/TrainingDayView';
import { VolumeAnalytics } from '@/components/VolumeAnalytics';
import { PersonalMaxTracker } from '@/components/PersonalMaxTracker';
import { ProgressTracker } from '@/components/ProgressTracker';
import { FatigueIndicator } from '@/components/FatigueIndicator';
import { OnboardingRIR } from '@/components/OnboardingRIR';
import { Dumbbell, BarChart3, CalendarDays, TrendingUp, Activity, LogOut, Loader2, RefreshCw, MoreVertical, Settings } from 'lucide-react';
import { GOAL_LABELS, EXPERIENCE_LABELS } from '@/types/training';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TrainingDayWithExercises } from '@/hooks/useTrainingDays';

type Tab = 'calendar' | 'volume' | 'pm' | 'progress' | 'settings';

const Index = () => {
  const { signOut } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [selectedDay, setSelectedDay] = useState<{ date: Date; day?: TrainingDayWithExercises } | null>(null);
  const [showChangePlan, setShowChangePlan] = useState(false);

  const getProgramLabel = () => {
    if (!profile) return '';
    const { experience, weekly_trainings } = profile;
    if (experience === 'beginner' || weekly_trainings <= 3) return 'Full Body';
    if (experience === 'intermediate' || weekly_trainings <= 4) return 'Upper / Lower';
    return 'Push / Pull / Legs';
  };

  const handleDaySelect = (date: Date, day?: TrainingDayWithExercises) => {
    setSelectedDay({ date, day });
  };

  const handleBackFromDay = () => {
    setSelectedDay(null);
  };

  const renderContent = () => {
    // If a day is selected, show TrainingDayView
    if (selectedDay && activeTab === 'calendar') {
      return (
        <TrainingDayView 
          date={selectedDay.date}
          existingDay={selectedDay.day}
          onClose={handleBackFromDay}
        />
      );
    }

    switch (activeTab) {
      case 'calendar':
        return <Calendar onDaySelect={handleDaySelect} />;
      case 'volume':
        return <VolumeAnalytics />;
      case 'pm':
        return <PersonalMaxTracker />;
      case 'progress':
        return <ProgressTracker />;
      case 'settings':
        return <TrainingPreferencesForm showTitle={true} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // No profile - show setup form
  if (!profile) {
    return <ProfileSetupForm onComplete={() => window.location.reload()} />;
  }

  // Onboarding not completed - show RIR explanation
  if (!profile.onboarding_completed) {
    return (
      <OnboardingRIR 
        onComplete={async () => {
          await updateProfile({ onboarding_completed: true } as any);
          window.location.reload();
        }} 
      />
    );
  }

  // Show change plan form
  if (showChangePlan) {
    return (
      <ChangePlanForm 
        onComplete={() => {
          setShowChangePlan(false);
          window.location.reload();
        }}
        onCancel={() => setShowChangePlan(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gradient">TrainLog</h1>
                  <FatigueIndicator size="sm" showLabel={false} />
                </div>
                <p className="text-xs text-muted-foreground">{profile.name} · {getProgramLabel()} · {EXPERIENCE_LABELS[profile.experience]} · {GOAL_LABELS[profile.goal]}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowChangePlan(true)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Сменить план
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-6">
        {renderContent()}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-40 safe-area-pb">
        <div className="max-w-2xl mx-auto px-2 sm:px-4">
          <div className="flex justify-between py-2 sm:py-3">
            {[
              { tab: 'calendar' as Tab, icon: CalendarDays, label: 'Календарь' },
              { tab: 'volume' as Tab, icon: BarChart3, label: 'Объём' },
              { tab: 'pm' as Tab, icon: TrendingUp, label: 'ПМ' },
              { tab: 'progress' as Tab, icon: Activity, label: 'Прогресс' },
              { tab: 'settings' as Tab, icon: Settings, label: 'Настр.' },
            ].map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all min-w-0 flex-1 ${
                  activeTab === tab 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-medium truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Index;
