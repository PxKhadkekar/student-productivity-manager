"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, CalendarDays, Timer } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Planner', href: '/planner', icon: CalendarDays },
    { name: 'Timer', href: '/timer', icon: Timer },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-background/90 backdrop-blur-lg border-t z-50 transition-colors duration-300 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              </div>
              <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
