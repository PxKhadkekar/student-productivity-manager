import { create } from 'zustand';
import api from '@/lib/api';

export interface InsightData {
  completionRate: number;
  avgTimeSpent: number;
  mostProductiveDay: string;
  delayedPriority: string;
  recommendations: string[];
}

interface InsightStore {
  insights: InsightData | null;
  loading: boolean;
  error: string | null;
  fetchInsights: () => Promise<void>;
}

export const useInsightStore = create<InsightStore>((set) => ({
  insights: null,
  loading: false,
  error: null,
  fetchInsights: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/analytics/insights');
      set({ insights: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch insights', loading: false });
    }
  },
}));
