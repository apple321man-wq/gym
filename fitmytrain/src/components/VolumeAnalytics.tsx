import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeeksVolumeTable } from './WeeksVolumeTable';
import { MonthVolumeTable } from './MonthVolumeTable';
import { VolumeTrendChart } from './VolumeTrendChart';
import { BarChart3, Table, TrendingUp, Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type VolumeTab = 'trend' | 'weeks' | 'month';

export function VolumeAnalytics() {
  const [activeTab, setActiveTab] = useState<VolumeTab>('month');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  // Get period label based on active tab
  const getPeriodLabel = () => {
    switch (activeTab) {
      case 'month': return 'за месяц';
      case 'weeks': return 'по неделям';
      case 'trend': return 'тренды';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with period indicator and info tooltip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            Объём тренировок
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {getPeriodLabel()}
            </span>
          </h2>
          
          {/* Info tooltip */}
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="p-1 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Как рассчитывается объём"
              >
                <Info className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 p-4" 
              side="bottom" 
              align="start"
            >
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Как рассчитывается объём?</h4>
                <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    <span className="text-foreground font-medium">Автоматически.</span>{' '}
                    Мы считаем количество рабочих подходов по каждой мышечной группе на основе твоих тренировок.
                  </p>
                  <p>
                    <span className="text-foreground font-medium">Персонально.</span>{' '}
                    Рекомендации учитывают твою цель, уровень подготовки и частоту тренировок.
                  </p>
                  <p>
                    <span className="text-foreground font-medium">Безопасно.</span>{' '}
                    Показанный диапазон — это эффективная и безопасная нагрузка для роста и восстановления.
                  </p>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground/70">
                    Тебе не нужно вручную подгонять объём — просто следуй плану тренировок.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as VolumeTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="month" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Месяц</span>
          </TabsTrigger>
          <TabsTrigger value="weeks" className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            <span className="hidden sm:inline">Недели</span>
          </TabsTrigger>
          <TabsTrigger value="trend" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Тренд</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="mt-4">
          <MonthVolumeTable 
            year={currentYear} 
            month={currentMonth}
            onMonthChange={handleMonthChange}
          />
        </TabsContent>

        <TabsContent value="weeks" className="mt-4">
          <WeeksVolumeTable 
            year={currentYear} 
            month={currentMonth}
            onMonthChange={handleMonthChange}
          />
        </TabsContent>

        <TabsContent value="trend" className="mt-4">
          <VolumeTrendChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
