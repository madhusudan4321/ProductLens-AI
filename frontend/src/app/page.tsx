"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { checkHealth, type HealthResponse } from "@/lib/api";

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkHealth()
      .then(setHealth)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      {/* Navigation */}
      <nav className="border-b border-foreground/10 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">
            🔍 ProductLens AI
          </Link>

          <div className="flex items-center gap-4">
            {authLoading ? (
              <span className="text-sm text-foreground/30">...</span>
            ) : isAuthenticated && user ? (
              <>
                <Link
                  href="/profile"
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-foreground text-background px-4 py-1.5 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Hero */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              🔍 ProductLens AI
            </h1>
            <p className="text-lg text-foreground/60">
              AI-Powered Product Intelligence Platform
            </p>
          </div>

          {/* Welcome message */}
          {isAuthenticated && user && (
            <div className="text-sm text-foreground/50">
              Welcome back, <span className="font-medium text-foreground/70">{user.name}</span>
            </div>
          )}

          {/* Status Card */}
          <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/40">
              System Status
            </h2>

            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 rounded-lg p-3">
                Backend unavailable: {error}
              </div>
            )}

            {health && (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      health.status === "healthy"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-sm font-medium capitalize">
                    {health.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(health.checks).map(([service, status]) => (
                    <div
                      key={service}
                      className="flex items-center justify-between rounded-lg bg-foreground/[0.03] px-4 py-2"
                    >
                      <span className="text-foreground/60 capitalize">
                        {service}
                      </span>
                      <span
                        className={
                          status === "connected"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!health && !error && (
              <p className="text-sm text-foreground/40">
                Checking services...
              </p>
            )}
          </div>

          {/* Phase indicator */}
          <p className="text-xs text-foreground/30">
            Phase 2 — Authentication
          </p>
        </div>
      </main>
    </>
  );
}
