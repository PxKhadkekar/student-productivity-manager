"use client";

import { format, subDays } from 'date-fns';
import { Habit } from '@/store/useHabitStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HabitHeatmapProps {
  habit: Habit;
  onLog: (date: string, completed: boolean) => void;
}

export default function HabitHeatmap({ habit, onLog }: HabitHeatmapProps) {
  const today = new Date();
  const days = Array.from({ length: 30 }).map((_, i) => subDays(today, 29 - i));

  return (
    <div className="flex flex-wrap gap-1.5 mt-4 group">
      <TooltipProvider>
        {days.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCompleted = habit.logs.find(l => l.date === dateStr)?.completed || false;
          
          return (
            <Tooltip key={i}>
              <TooltipTrigger>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onLog(dateStr, !isCompleted)}
                  className={`w-5 h-5 rounded-[4px] transition-all border outline-none 
                    ${isCompleted 
                      ? 'bg-emerald-500 border-emerald-600 hover:bg-emerald-400 dark:bg-emerald-500/80 dark:border-emerald-600 dark:hover:bg-emerald-400' 
                      : 'bg-muted border-muted-foreground/10 hover:bg-muted-foreground/30 dark:bg-muted/50'
                    }`}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs font-semibold">{format(day, 'MMM d, yyyy')}</p>
                <p className="text-xs text-muted-foreground">{isCompleted ? 'Completed 🟢' : 'Missed ⚪'}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
