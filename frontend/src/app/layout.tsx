import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Productivity Manager",
  description: "A full-stack application to manage tasks and pomodoro timers.",
};

import AuthGuard from "@/components/auth/AuthGuard";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import BottomNav from "@/components/layout/BottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthGuard>
            <Navbar />
            <div className="flex flex-1 overflow-hidden relative">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20 pb-20 md:pb-6 relative w-full">
                {children}
              </main>
            </div>
            <BottomNav />
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
