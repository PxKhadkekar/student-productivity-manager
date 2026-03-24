"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
    }
  }, [token, pathname, router]);

  if (!mounted) return null;

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (!token && !isAuthPage) {
    return null; // Prevents flashing of protected pages
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Exclude standard Navbar/Sidebar from auth pages if desired, but for now we render children */}
      {children}
    </div>
  );
}
