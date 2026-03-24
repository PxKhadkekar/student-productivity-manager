import { create } from 'zustand';
import api from '@/lib/api';

export interface HabitLog {
  date: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
  logs: HabitLog[];
}

interface HabitStore {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  fetchHabits: () => Promise<void>;
  createHabit: (name: string) => Promise<void>;
  logHabit: (id: string, date: string, completed: boolean) => Promise<void>;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  loading: false,
  error: null,
  fetchHabits: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/habits');
      set({ habits: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch habits', loading: false });
    }
  },
  createHabit: async (name: string) => {
    try {
      await api.post('/habits', { name });
      get().fetchHabits();
    } catch (error: any) {
      console.error('Failed to create habit', error);
    }
  },
  logHabit: async (id: string, date: string, completed: boolean) => {
    try {
      await api.post(`/habits/${id}/log`, { date, completed });
      get().fetchHabits();
    } catch (error: any) {
      console.error('Failed to log habit', error);
    }
  }
}));
