"use client";

import { useEffect } from 'react';
import { useTaskStore, Task } from '@/store/useTaskStore';
import { Card } from '@/components/ui/card';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function DraggableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task }
  });
  
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="p-3 bg-card border rounded-md shadow-sm mb-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors relative z-10 touch-none">
      <p className="font-semibold text-sm leading-tight mb-2">{task.title}</p>
      <div className="flex justify-between items-center">
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
          task.priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
          task.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        }`}>{task.priority}</span>
        {task.category && task.category !== 'Uncategorized' && (
          <span className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{task.category}</span>
        )}
      </div>
    </div>
  );
}

function DroppableColumn({ id, title, tasks }: { id: string, title: string, tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Card 
      ref={setNodeRef} 
      className={`flex flex-col flex-1 min-w-[300px] h-[calc(100vh-12rem)] border bg-muted/20 p-4 transition-colors ${
        isOver ? 'bg-muted/50 border-primary/50 ring-2 ring-primary/20' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
        <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{title}</h2>
        <span className="bg-background text-xs px-2 py-1 rounded-full border">{tasks.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto pr-1">
        {tasks.map(task => <DraggableTask key={task.id} task={task} />)}
      </div>
    </Card>
  );
}

export default function KanbanBoard() {
  const { tasks, fetchTasks, updateTaskStatus, loading } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Fallback logic for tasks without a status yet
    const currentStatus = task.status || (task.completed ? "DONE" : "TODO");

    if (currentStatus !== newStatus) {
      // Optimistic update handled by store if desired, or we just await the API
      if (updateTaskStatus) {
        await updateTaskStatus(taskId, newStatus);
      }
    }
  };

  if (loading && tasks.length === 0) {
    return <div className="py-10 text-center animate-pulse">Loading workspace...</div>;
  }

  // Fallback map legacy tasks to standard columns
  const todoTasks = tasks.filter(t => (t.status === "TODO") || (!t.status && !t.completed));
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter(t => (t.status === "DONE") || (!t.status && t.completed));

  return (
    <div className="max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
        <p className="text-muted-foreground">Drag and drop your tasks across stages of completion.</p>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
          <DroppableColumn id="TODO" title="To Do" tasks={todoTasks} />
          <DroppableColumn id="IN_PROGRESS" title="In Progress" tasks={inProgressTasks} />
          <DroppableColumn id="DONE" title="Done" tasks={doneTasks} />
        </div>
      </DndContext>
    </div>
  );
}
