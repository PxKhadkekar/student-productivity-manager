import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerState {
  timeLeft: number; // in seconds
  isRunning: boolean;
  mode: 'focus' | 'break';
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setMode: (mode: 'focus' | 'break') => void;
}

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      timeLeft: FOCUS_TIME,
      isRunning: false,
      mode: 'focus',
      startTimer: () => set({ isRunning: true }),
      stopTimer: () => set({ isRunning: false }),
      resetTimer: () => {
        const { mode } = get();
        set({
          timeLeft: mode === 'focus' ? FOCUS_TIME : BREAK_TIME,
          isRunning: false,
        });
      },
      tick: () => {
        const { timeLeft, isRunning, mode } = get();
        if (isRunning && timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else if (isRunning && timeLeft === 0) {
          const nextMode = mode === 'focus' ? 'break' : 'focus';
          set({
            mode: nextMode,
            timeLeft: nextMode === 'focus' ? FOCUS_TIME : BREAK_TIME,
            isRunning: false,
          });
        }
      },
      setMode: (mode) => {
        set({
          mode,
          timeLeft: mode === 'focus' ? FOCUS_TIME : BREAK_TIME,
          isRunning: false,
        });
      },
    }),
    {
      name: 'pomodoro-storage',
    }
  )
);
