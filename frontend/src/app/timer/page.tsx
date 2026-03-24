"use client";

import { useEffect, useState, useRef } from 'react';
import { useTimerStore } from '@/store/useTimerStore';
import { useTaskStore } from '@/store/useTaskStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TimerPage() {
  const { timeLeft, isRunning, mode, startTimer, stopTimer, resetTimer, tick, setMode } = useTimerStore();
  const { tasks, fetchTasks, logTime } = useTaskStore();
  const [mounted, setMounted] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('none');
  
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      if (!lastTickRef.current) {
        lastTickRef.current = Date.now();
      }

      interval = setInterval(() => {
        tick();
      }, 1000);
    } else {
      // Timer is paused or stopped, log elapsed time if we have a task selected
      if (lastTickRef.current && selectedTaskId !== 'none') {
        const elapsedSeconds = Math.floor((Date.now() - lastTickRef.current) / 1000);
        if (elapsedSeconds > 0) {
          logTime(selectedTaskId, elapsedSeconds).catch(console.error);
        }
      }
      lastTickRef.current = null;
    }

    // Capture unmounts or mode switches similarly
    return () => {
      clearInterval(interval);
      if (isRunning && lastTickRef.current && selectedTaskId !== 'none') {
        const elapsedSeconds = Math.floor((Date.now() - lastTickRef.current) / 1000);
        if (elapsedSeconds > 0) {
          logTime(selectedTaskId, elapsedSeconds).catch(console.error);
        }
        lastTickRef.current = Date.now(); // reset tick to current time for strict unmount captures
      }
    };
  }, [isRunning, tick, selectedTaskId, logTime]);

  if (!mounted) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // SVG parameters
  const size = 280;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
          <p className="text-muted-foreground">Stay focused, get things done.</p>
        </div>
        
        <div className="w-full bg-card border rounded-lg p-3 shadow-sm flex items-center justify-between gap-4">
          <span className="text-sm font-medium whitespace-nowrap text-muted-foreground">Working on:</span>
          <Select value={selectedTaskId} onValueChange={(val) => { if (val) setSelectedTaskId(val as string) }}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select a task to track..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No specific task (Unlogged)</SelectItem>
              {tasks.filter(t => !t.completed).map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-center gap-2">
              <Button 
                variant={mode === 'focus' ? 'default' : 'outline'} 
                onClick={() => setMode('focus')}
                className="w-24 font-medium"
              >
                Focus
              </Button>
              <Button 
                variant={mode === 'break' ? 'default' : 'outline'} 
                onClick={() => setMode('break')}
                className="w-24 font-medium"
              >
                Break
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-8 pb-8">
            <div className="relative flex items-center justify-center w-[280px] h-[280px]">
              {/* SVG Radial Progress */}
              <svg width={size} height={size} className="transform -rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-muted"
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000 ease-linear"
                />
              </svg>
              {/* Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-6xl font-black tracking-tighter tabular-nums">
                  {formattedTime}
                </span>
                <span className="text-muted-foreground font-medium mt-1 uppercase tracking-widest text-sm text-center">
                  {mode}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <Button size="icon" variant="outline" className="h-14 w-14 rounded-full" onClick={resetTimer}>
                <RotateCcw className="w-6 h-6" />
              </Button>
              <Button size="icon" className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90 shadow-xl" onClick={isRunning ? stopTimer : startTimer}>
                {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-1" />}
              </Button>
              <div className="h-14 w-14" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
