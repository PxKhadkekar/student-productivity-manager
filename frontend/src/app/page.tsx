"use client";

import { useEffect } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { useInsightStore } from '@/store/useInsightStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, ListTodo, Lightbulb, TrendingUp, CalendarDays, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, Variants } from 'framer-motion';

const PRIORITY_COLORS = ['#f43f5e', '#f59e0b', '#10b981']; // Vivid Rose, Amber, Emerald

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const { stats, fetchStats, loading: statsLoading } = useTaskStore();
  const { insights, fetchInsights, loading: insightsLoading } = useInsightStore();

  useEffect(() => {
    fetchStats();
    fetchInsights();
  }, [fetchStats, fetchInsights]);

  if (statsLoading || insightsLoading || !stats) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Skeleton className="h-[380px] rounded-2xl" />
          <Skeleton className="h-[380px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const { totalTasks, completedTasks, upcomingTasksByDay, tasksByPriority } = stats;
  const pendingTasks = totalTasks - completedTasks;
  const highPriority = tasksByPriority.find(p => p.priority === "High")?.count || 0;
  
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const formatTime = (seconds: number) => {
    if (!seconds || seconds === 0) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-8 max-w-7xl mx-auto p-4 md:p-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Analytics</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Check out your productivity metrics.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <Card className="hover:shadow-md transition-all duration-300 rounded-2xl border-muted bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><ListTodo className="h-4 w-4 text-slate-500" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{totalTasks}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="hover:shadow-md transition-all duration-300 rounded-2xl border-muted bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg"><CheckCircle2 className="h-4 w-4 text-green-500" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{completedTasks}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="hover:shadow-md transition-all duration-300 rounded-2xl border-muted bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg"><Circle className="h-4 w-4 text-blue-500" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{pendingTasks}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="hover:shadow-md transition-all duration-300 rounded-2xl border-muted bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg"><Clock className="h-4 w-4 text-red-500" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{highPriority}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <motion.div variants={item} className="h-full">
        <Card className="col-span-1 shadow-sm rounded-2xl hover:shadow-md transition-shadow duration-300 h-full">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Tasks Timeline</CardTitle>
            <CardDescription>Number of pending tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={upcomingTasksByDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid hsl(var(--border))', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))'
                  }} 
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div variants={item} className="h-full">
        <Card className="col-span-1 shadow-sm rounded-2xl hover:shadow-md transition-shadow duration-300 h-full">
          <CardHeader>
            <CardTitle className="text-lg">Pending Priorities</CardTitle>
            <CardDescription>Distribution of your active tasks</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full flex items-center justify-center">
            {pendingTasks === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 mb-2 text-green-500 opacity-50" />
                No pending tasks!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tasksByPriority}
                    dataKey="count"
                    nameKey="priority"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                  >
                    {tasksByPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid hsl(var(--border))', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))'
                    }} 
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {insights && (
        <motion.div variants={item} className="mt-12 space-y-6 pt-8 border-t border-muted">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">AI Productivity Insights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-primary/5 border-primary/20 rounded-2xl hover:-translate-y-1 transition-transform">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{insights.completionRate}%</div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5 border-primary/20 rounded-2xl hover:-translate-y-1 transition-transform">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  Avg Time / Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatTime(insights.avgTimeSpent)}</div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20 rounded-2xl hover:-translate-y-1 transition-transform">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  Best Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{insights.mostProductiveDay}</div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20 rounded-2xl hover:-translate-y-1 transition-transform">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  Delayed Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{insights.delayedPriority}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {insights.recommendations.map((rec, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 animate-pulse" />
                <p className="text-sm font-medium leading-relaxed">{rec}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}
