"use client";

import { useEffect, useState } from 'react';
import { useTaskStore, Task } from '@/store/useTaskStore';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Search, CheckSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';

export default function TasksPage() {
  const { tasks, loading, fetchTasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const CATEGORIES = ['All', 'Work', 'Personal', 'Study', 'Health', 'Uncategorized'];

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateNew = () => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await addTask({ ...data, completed: false });
    }
    setIsDialogOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const taskCat = task.category || 'Uncategorized';
    const matchesCategory = selectedCategory === 'All' || taskCat === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your daily tasks and priorities efficiently.</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-9 bg-background border-muted-foreground/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : filteredTasks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="flex flex-col items-center justify-center py-24 px-4 bg-card/40 backdrop-blur-sm rounded-2xl border border-dashed border-muted shadow-sm"
        >
          <div className="bg-primary/10 p-5 rounded-full mb-4">
            <CheckSquare className="w-10 h-10 text-primary opacity-80" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No tasks found!</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-8">You've cleared all your tasks or none match your criteria. Enjoy the peace or create a new one.</p>
          <Button onClick={handleCreateNew} variant="outline" className="gap-2 shadow-sm rounded-xl">
            <PlusCircle className="w-4 h-4" />
            Create Your First Task
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleEdit}
              onDelete={deleteTask}
              onToggleComplete={toggleTaskCompletion}
            />
          ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
          </DialogHeader>
          <TaskForm 
            initialData={editingTask} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
