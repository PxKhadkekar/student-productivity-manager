import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Spring Boot default port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const TaskService = {
  getAll: () => api.get('/tasks'),
  getById: (id: string) => api.get(`/tasks/${id}`),
  create: (task: any) => api.post('/tasks', task),
  update: (id: string, task: any) => api.put(`/tasks/${id}`, task),
  updateStatus: (id: string, status: string) => api.put(`/tasks/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  getStats: () => api.get('/tasks/stats'),
  getCalendarTasks: (start: string, end: string) => api.get(`/tasks/calendar?start=${start}&end=${end}`),
  logTime: (id: string, seconds: number) => api.post(`/tasks/${id}/log-time`, { seconds }),
};

export const AuthService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  signup: (user: any) => api.post('/auth/signup', user),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => api.post('/auth/reset-password', { token, newPassword }),
};

export default api;
