"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      setError((err as Error).message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-tight">
              🔍 ProductLens AI
            </h1>
          </Link>
          <p className="text-foreground/60">Create your account</p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="register-name"
                className="block text-sm font-medium text-foreground/70"
              >
                Name
              </label>
              <input
                id="register-name"
                type="text"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-foreground/15 bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-foreground/30"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-email"
                className="block text-sm font-medium text-foreground/70"
              >
                Email
              </label>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-foreground/15 bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-foreground/30"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-foreground/70"
              >
                Password
              </label>
              <input
                id="register-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-foreground/15 bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-foreground/30"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-confirm"
                className="block text-sm font-medium text-foreground/70"
              >
                Confirm Password
              </label>
              <input
                id="register-confirm"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-foreground/15 bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-foreground/30"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-foreground text-background py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/50">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
