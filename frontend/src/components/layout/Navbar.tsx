"use client";

import { BookOpen, LogOut, User, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50 w-full transition-colors duration-300">
      <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl hover:opacity-80 transition-opacity">
        <BookOpen className="w-6 h-6" />
        <span className="hidden sm:inline">Student Productivity Hub</span>
      </Link>
      
      <div className="flex items-center gap-4">
        {mounted && (
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full flex-shrink-0 transition-transform hover:scale-105 active:scale-95">
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0, scale: theme === 'dark' ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </motion.div>
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        {user ? (
          <>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-0 sm:mr-2">
              <User className="w-4 h-4" />
              <span className="max-w-[80px] sm:max-w-[200px] truncate">
                {user.name}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
