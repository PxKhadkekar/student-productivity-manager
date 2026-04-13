"use client";

import { useState, Suspense } from "react";
import { AuthService } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing recovery token.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await AuthService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      setError(err.response?.data || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token && !success) {
    return (
      <Card className="rounded-2xl shadow-sm border-muted text-center pt-6">
        <CardContent>
          <div className="text-destructive font-bold mb-2">Missing Token</div>
          <Button variant="outline" onClick={(e) => { e.preventDefault(); router.push('/forgot-password'); }}>Request New Link</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!success ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <Card className="rounded-2xl shadow-sm border-muted">
            <CardHeader>
              <CardTitle className="text-2xl">Create New Password</CardTitle>
              <CardDescription>
                Your new password must be securely configured to finalize the reset.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-sm text-destructive font-medium bg-destructive/10 p-2 rounded">{error}</div>}
                
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Secure Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="rounded-2xl shadow-sm border-muted text-center pt-6">
            <CardContent className="space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <KeyRound className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold">Password Reset!</h2>
              <p className="text-sm text-muted-foreground pb-2">
                Your account is secure. Redirecting to login...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
