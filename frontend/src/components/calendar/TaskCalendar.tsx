'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useTaskStore, Task } from '@/store/useTaskStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import TaskForm from '@/components/tasks/TaskForm';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

interface TaskEvent extends Event {
  resource?: Task;
}

export default function TaskCalendar() {
  const { calendarTasks, fetchCalendarTasks, updateTask, addTask } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  
  // Capturing the temporal view span for optimization
  const [currentRange, setCurrentRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0),
  });

  useEffect(() => {
    const startStr = currentRange.start.toISOString().split('T')[0];
    const endStr = currentRange.end.toISOString().split('T')[0];
    fetchCalendarTasks(startStr, endStr);
  }, [currentRange, fetchCalendarTasks]);

  const onRangeChange = (range: Date[] | { start: Date; end: Date } | null) => {
    if (!range) return;
    if (Array.isArray(range)) {
      if (range.length > 0) {
        setCurrentRange({ start: range[0], end: range[range.length - 1] });
      }
    } else {
      setCurrentRange(range);
    }
  };

  const events: TaskEvent[] = useMemo(() => {
    return calendarTasks.map((task) => ({
      title: task.title,
      start: task.startDate ? new Date(task.startDate) : new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: task.allDay || false,
      resource: task,
    }));
  }, [calendarTasks]);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: TaskEvent) => {
    if (event.resource) {
      setSelectedTask(event.resource);
      setSelectedSlot(null);
      setIsModalOpen(true);
    }
  };

  const onEventDrop = async (data: any) => {
    const { event, start, end } = data;
    const task = event.resource as Task;
    if (!task) return;

    try {
      await updateTask(task.id, {
        startDate: format(new Date(start), 'yyyy-MM-dd'),
        dueDate: format(new Date(end), 'yyyy-MM-dd'),
      });
      // Re-fetch calendar tasks dynamically
      const startStr = currentRange.start.toISOString().split('T')[0];
      const endStr = currentRange.end.toISOString().split('T')[0];
      fetchCalendarTasks(startStr, endStr);
    } catch (e) {
      console.error('Failed to shift event across time limits', e);
    }
  };

  const eventStyleGetter = (event: TaskEvent) => {
    const task = event.resource;
    let backgroundColor = '#3174ad';
    
    if (task) {
      if (task.completed) {
        backgroundColor = '#525252'; // Neutral Gray for completed
      } else if (task.priority === 'high') {
        backgroundColor = '#ef4444'; // Red
      } else if (task.priority === 'medium') {
        backgroundColor = '#eab308'; // Yellow
      } else if (task.priority === 'low') {
        backgroundColor = '#22c55e'; // Green
      }
    }

    const isOverdue = task && !task.completed && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

    return {
      style: {
        backgroundColor,
        border: isOverdue ? '2px solid #dc2626' : '1px solid rgba(0,0,0,0.1)',
        color: 'white',
        borderRadius: '6px', // Shadcn-feeling curvature
        opacity: 0.9,
      },
    };
  };

  const onSubmitForm = async (data: any) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, data);
    } else {
      await addTask(data);
    }
    setIsModalOpen(false);
    
    const startStr = currentRange.start.toISOString().split('T')[0];
    const endStr = currentRange.end.toISOString().split('T')[0];
    fetchCalendarTasks(startStr, endStr);
  };

  return (
    <div className="h-full w-full bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col">
      <div className="flex-grow min-h-[600px] text-foreground">
        <style dangerouslySetInnerHTML={{__html: `
          .rbc-month-view, .rbc-time-view, .rbc-agenda-view, .rbc-header { background: hsl(var(--card)); border-color: hsl(var(--border)) !important; }
          .rbc-off-range-bg { background: hsl(var(--muted)); }
          .rbc-today { background: hsl(var(--accent)); color: hsl(var(--accent-foreground)); font-weight: bold; }
          .rbc-header { padding: 8px; font-weight: 600; color: hsl(var(--foreground)); border-bottom: 1px solid hsl(var(--border)); }
          .rbc-date-cell { padding: 4px; color: hsl(var(--foreground)); }
          .rbc-event { border-radius: 4px; padding: 3px 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
          .rbc-day-bg + .rbc-day-bg { border-left: 1px solid hsl(var(--border)) !important; }
          .rbc-month-row + .rbc-month-row { border-top: 1px solid hsl(var(--border)) !important; }
          .rbc-month-view { border: 1px solid hsl(var(--border)) !important; }
          .rbc-time-content { border-top: 1px solid hsl(var(--border)) !important; border-left: 1px solid hsl(var(--border)) !important; }
          .rbc-timeslot-group { border-bottom: 1px solid hsl(var(--border)) !important; }
          .rbc-day-slot .rbc-time-slot { border-top: 1px solid hsl(var(--border)); }
        `}} />
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor={(event: TaskEvent) => event.start as Date}
          endAccessor={(event: TaskEvent) => event.end as Date}
          style={{ height: '75vh', width: '100%' }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={onEventDrop}
          eventPropGetter={eventStyleGetter}
          onRangeChange={onRangeChange}
          views={['month', 'week', 'day']}
          defaultView="month"
          popup
        />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-border bg-card">
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'Edit Task Schedule' : 'Schedule New Task'}</DialogTitle>
            <DialogDescription>
              {selectedTask ? 'Modify the temporal bounds or properties of this task.' : 'Add a new mapped block directly to the timeline.'}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            initialData={selectedTask || {
              title: '',
              description: '',
              priority: 'medium',
              dueDate: selectedSlot ? selectedSlot.start.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              startDate: selectedSlot ? selectedSlot.start.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              allDay: true,
            } as any}
            onSubmit={onSubmitForm}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
