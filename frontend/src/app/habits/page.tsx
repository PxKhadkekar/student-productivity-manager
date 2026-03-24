"use client";

import { useEffect, useState } from 'react';
import { useHabitStore } from '@/store/useHabitStore';
import HabitHeatmap from '@/components/habits/HabitHeatmap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Flame, Medal, Target } from 'lucide-react';

export default function HabitsPage() {
  const { habits, fetchHabits, createHabit, logHabit, loading } = useHabitStore();
  const [newHabitName, setNewHabitName] = useState('');

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      await createHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Habit Tracking</h1>
        <p className="text-muted-foreground">Build consistency and monitor your daily streaks.</p>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <Input 
          placeholder="I want to start..." 
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          className="max-w-md bg-background"
        />
        <Button type="submit" disabled={!newHabitName.trim()}>
          Add Habit
        </Button>
      </form>

      {loading && habits.length === 0 ? (
        <div className="text-center py-10 animate-pulse">Loading amazing habits...</div>
      ) : habits.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-lg border border-dashed">
          <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Habits Yet!</h2>
          <p className="text-muted-foreground">Form a new habit above to start tracking your streak.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit) => (
            <Card key={habit.id} className="shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">{habit.name}</CardTitle>
                <CardDescription>Click squares to log daily completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 my-4 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-100 p-2 rounded-full dark:bg-orange-900/30">
                      <Flame className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current Streak</p>
                      <p className="font-bold">{habit.currentStreak} Days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-100 p-2 rounded-full dark:bg-indigo-900/30">
                      <Medal className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Longest Streak</p>
                      <p className="font-bold">{habit.longestStreak} Days</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium mb-2">Last 30 Days</h4>
                <HabitHeatmap habit={habit} onLog={(date, completed) => logHabit(habit.id, date, completed)} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
