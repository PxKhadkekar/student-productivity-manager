import Link from 'next/link';
import { LayoutDashboard, CheckSquare, Timer, CalendarDays, Activity, KanbanSquare } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card h-[calc(100vh-4rem)] p-4 hidden md:block">
      <nav className="space-y-2">
        <Link href="/" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-all duration-200 hover:translate-x-1 active:scale-95">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link href="/tasks" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-all duration-200 hover:translate-x-1 active:scale-95">
          <CheckSquare className="w-5 h-5" />
          Tasks
        </Link>
        <Link href="/board" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
          <KanbanSquare className="w-5 h-5" />
          Kanban Board
        </Link>
        <Link href="/calendar" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
          <CalendarDays className="w-5 h-5" />
          Calendar
        </Link>
        <Link href="/habits" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
          <Activity className="w-5 h-5" />
          Habit Tracking
        </Link>
        <Link href="/planner" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
          <CalendarDays className="w-5 h-5" />
          Daily Planner
        </Link>
        <Link href="/timer" className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium">
          <Timer className="w-5 h-5" />
          Pomodoro Timer
        </Link>
      </nav>
    </aside>
  );
}
