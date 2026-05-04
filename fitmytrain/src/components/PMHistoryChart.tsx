import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { usePMHistory, type PMUpdateLog } from '@/hooks/usePMHistory';
import { getExerciseById, BASE_EXERCISES_FOR_PM } from '@/data/exercises';
import { usePersonalMaxes } from '@/hooks/usePersonalMaxes';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { History, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatWeight } from '@/lib/weightFormat';

export function PMHistoryChart() {
  const { history, isLoading } = usePMHistory();
  const { personalMaxes } = usePersonalMaxes();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  if (isLoading || history.length === 0) {
    return (
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">История изменений ПМ</h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-6">
          {isLoading ? 'Загрузка...' : 'История изменений появится после автоматического обновления ПМ через систему RIR.'}
        </p>
      </div>
    );
  }

  // Group by exercise
  const exerciseIds = [...new Set(history.map(h => h.exercise_id))];

  const buildChartData = (exerciseId: string) => {
    const logs = history.filter(h => h.exercise_id === exerciseId);
    if (logs.length === 0) return [];

    // Start with the first old_1rm value
    const points = [
      { date: logs[0].created_at, value: logs[0].old_1rm, label: 'Начальный' },
    ];

    logs.forEach(log => {
      points.push({
        date: log.created_at,
        value: log.new_1rm,
        label: log.reason === 'increase' ? '+' : log.reason === 'decrease' ? '−' : '',
      });
    });

    return points.map(p => ({
      ...p,
      dateFormatted: format(new Date(p.date), 'd MMM', { locale: ru }),
    }));
  };

  const getExerciseSummary = (exerciseId: string) => {
    const logs = history.filter(h => h.exercise_id === exerciseId);
    if (logs.length === 0) return null;
    const first = logs[0].old_1rm;
    const last = logs[logs.length - 1].new_1rm;
    if (first == null || last == null || !Number.isFinite(first) || !Number.isFinite(last)) {
      return null;
    }
    const diff = last - first;
    const pct = first > 0 ? ((diff / first) * 100).toFixed(1) : '0.0';
    return { first, last, diff, pct, count: logs.length };
  };

  return (
    <div className="stat-card">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">История изменений ПМ</h3>
      </div>

      <div className="space-y-3">
        {exerciseIds.map(exId => {
          const exercise = getExerciseById(exId);
          const name = exercise?.name || exId;
          const summary = getExerciseSummary(exId);
          const isOpen = selectedExercise === exId;
          const chartData = isOpen ? buildChartData(exId) : [];

          return (
            <div key={exId} className="rounded-xl bg-secondary/50 border border-border/50 overflow-hidden">
              <button
                onClick={() => setSelectedExercise(isOpen ? null : exId)}
                className="w-full flex items-center justify-between p-3 hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{name}</span>
                  {summary && (
                    <span className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      summary.diff > 0
                        ? 'bg-[hsl(var(--progress-good))]/10 text-[hsl(var(--progress-good))]'
                        : summary.diff < 0
                        ? 'bg-[hsl(var(--progress-critical))]/10 text-[hsl(var(--progress-critical))]'
                        : 'bg-secondary text-muted-foreground'
                    )}>
                      {summary.diff > 0 ? '+' : ''}{formatWeight(summary.diff)} ({summary.pct}%)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {summary && (
                    <span className="text-xs text-muted-foreground">{summary.count} изм.</span>
                  )}
                  {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              {isOpen && chartData.length > 1 && (
                <div className="px-3 pb-3 space-y-3">
                  {/* Chart */}
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <XAxis
                          dataKey="dateFormatted"
                          tick={{ fontSize: 11, fill: 'hsl(215, 15%, 55%)' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={['dataMin - 5', 'dataMax + 5']}
                          tick={{ fontSize: 11, fill: 'hsl(215, 15%, 55%)' }}
                          axisLine={false}
                          tickLine={false}
                          width={40}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(220, 18%, 12%)',
                            border: '1px solid hsl(220, 15%, 20%)',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                          }}
                          formatter={(value: number) => [`${value} кг`, 'ПМ']}
                          labelFormatter={(label) => label}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(142, 70%, 50%)"
                          strokeWidth={2}
                          dot={{ r: 4, fill: 'hsl(142, 70%, 50%)', stroke: 'hsl(220, 18%, 12%)', strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Log table */}
                  <div className="space-y-1">
                    {history
                      .filter(h => h.exercise_id === exId)
                      .slice()
                      .reverse()
                      .map(log => (
                        <div key={log.id} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg bg-background/50">
                          <span className="text-muted-foreground">
                            {format(new Date(log.created_at), 'd MMM yyyy', { locale: ru })}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{log.old_1rm} кг</span>
                            <span className="text-muted-foreground">→</span>
                            <span className={cn(
                              'font-semibold',
                              log.reason === 'increase' ? 'text-[hsl(var(--progress-good))]' : 'text-[hsl(var(--progress-critical))]'
                            )}>
                              {log.new_1rm} кг
                            </span>
                            {log.reason === 'increase' ? (
                              <TrendingUp className="w-3 h-3 text-[hsl(var(--progress-good))]" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-[hsl(var(--progress-critical))]" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
