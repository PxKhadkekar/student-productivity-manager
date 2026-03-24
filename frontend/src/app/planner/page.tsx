"use client";

import { useEffect, useState } from 'react';
import { useTaskStore, Task } from '@/store/useTaskStore';
import TaskCard from '@/components/tasks/TaskCard';
import { CalendarDays, AlertCircle } from 'lucide-react';

export default function PlannerPage() {
  const { tasks, loading, fetchTasks, deleteTask, toggleTaskCompletion } = useTaskStore();
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const plannerTasks = tasks.filter(task => {
    if (task.completed) return false;
    if (!task.dueDate) return false;
    
    // Check if task is due today or overdue
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    return taskDate <= today;
  }).sort((a, b) => {
    // Sort high priority first, then by date
    const priorityWeight = { high: 0, medium: 1, low: 2 };
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b pb-6">
        <div className="bg-primary/20 p-3 rounded-full text-primary">
          <CalendarDays className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Planner</h1>
          <p className="text-muted-foreground">Focus mode: Your immediate priorities and overdue tasks.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading your schedule...</div>
      ) : plannerTasks.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-lg border border-dashed flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center dark:bg-blue-900/40">
            <span className="text-2xl">🎉</span>
          </div>
          <h2 className="text-xl font-semibold">Inbox Zero!</h2>
          <p className="text-muted-foreground max-w-sm">You have absolutely no tasks due today. Take a breather or get a head start on tomorrow!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-2 rounded-md border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-500">
            <AlertCircle className="w-4 h-4" />
            <span>You have {plannerTasks.length} action item{plannerTasks.length === 1 ? '' : 's'} requiring your immediate attention.</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {plannerTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={() => {}} // In a real app we might route to /tasks or open a modal
                onDelete={deleteTask}
                onToggleComplete={toggleTaskCompletion}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
