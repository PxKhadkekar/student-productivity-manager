import { create } from 'zustand';
import { TaskService } from '@/lib/api';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  timeSpent: number;
  category?: string;
  tags?: string[];
  status?: string;
  startDate?: string;
  allDay?: boolean;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  upcomingTasksByDay: { date: string; count: number }[];
  tasksByPriority: { priority: string; count: number }[];
}

interface TaskState {
  tasks: Task[];
  calendarTasks: Task[];
  stats: TaskStats | null;
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchCalendarTasks: (start: string, end: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string, completed: boolean) => Promise<void>;
  updateTaskStatus: (id: string, status: string) => Promise<void>;
  logTime: (id: string, seconds: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  calendarTasks: [],
  stats: null,
  loading: false,
  error: null,
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { data } = await TaskService.getAll();
      set({ tasks: data, loading: false, error: null });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  fetchCalendarTasks: async (start, end) => {
    set({ loading: true });
    try {
      const { data } = await TaskService.getCalendarTasks(start, end);
      set({ calendarTasks: data, loading: false, error: null });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  fetchStats: async () => {
    set({ loading: true });
    try {
      const { data } = await TaskService.getStats();
      set({ stats: data, loading: false, error: null });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  addTask: async (task) => {
    try {
      const { data } = await TaskService.create(task);
      set((state) => ({ tasks: [...state.tasks, data] }));
      get().fetchStats(); // refresh stats
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  updateTask: async (id, taskDetails) => {
    try {
      const currentTask = get().tasks.find((t) => t.id === id);
      if (!currentTask) return;
      
      const payload = { ...currentTask, ...taskDetails };
      const { data } = await TaskService.update(id, payload);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? data : t)),
      }));
      get().fetchStats(); // refresh stats
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  deleteTask: async (id) => {
    try {
      await TaskService.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
      get().fetchStats(); // refresh stats
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  toggleTaskCompletion: async (id, completed) => {
    await get().updateTask(id, { completed });
  },
  logTime: async (id, seconds) => {
    try {
      const { data } = await TaskService.logTime(id, seconds);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? data : t)),
      }));
      get().fetchStats();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
  updateTaskStatus: async (id, status) => {
    try {
      const { data } = await TaskService.updateStatus(id, status);
      set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? data : t)) }));
      get().fetchStats();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
