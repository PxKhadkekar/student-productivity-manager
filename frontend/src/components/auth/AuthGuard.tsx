"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];

  useEffect(() => {
    setMounted(true);
    if (!token && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/login');
    }
  }, [token, pathname, router]);

  if (!mounted) return null;

  const isAuthPage = PUBLIC_ROUTES.includes(pathname);

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
