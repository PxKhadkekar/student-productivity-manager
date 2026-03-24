'use client';

import TaskCalendar from '@/components/calendar/TaskCalendar';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="p-8 h-full flex flex-col space-y-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Visualize your temporal workspace. Drag and drop events to quickly restructure deadlines.
          </p>
        </div>
      </div>
      <div className="flex-1 w-full relative">
         <TaskCalendar />
      </div>
    </div>
  );
}
