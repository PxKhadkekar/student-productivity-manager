"use client";

import { useState } from "react";
import { AuthService } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, MailCheck, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await AuthService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4 bg-muted/30">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm"
          >
            <Card className="rounded-2xl shadow-sm border-muted">
              <CardHeader>
                <CardTitle className="text-2xl">Reset Password</CardTitle>
                <CardDescription>
                  Enter your email address to receive a secure recovery link.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="text-sm text-destructive font-medium">{error}</div>}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
                  </Button>
                  <div className="flex justify-center pt-2">
                    <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Back to Login
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm"
          >
            <Card className="rounded-2xl shadow-sm border-muted text-center pt-6">
              <CardContent className="space-y-4 flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                  <MailCheck className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold">Check your inbox</h2>
                <p className="text-sm text-muted-foreground pb-4">
                  We've sent a password recovery link to <strong>{email}</strong>. 
                  (Since we are in Dev Mode, please check your Java terminal to click the mock link!)
                </p>
                <Button variant="outline" className="w-full" onClick={(e) => { e.preventDefault(); window.location.href = '/login'; }}>
                  Return to Login
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
