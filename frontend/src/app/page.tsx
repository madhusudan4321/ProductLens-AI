"use client";

import { useEffect, useState } from "react";
import { checkHealth, type HealthResponse } from "@/lib/api";

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkHealth()
      .then(setHealth)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo / Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            🔍 ProductLens AI
          </h1>
          <p className="text-lg text-foreground/60">
            AI-Powered Product Intelligence Platform
          </p>
        </div>

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
          Phase 1 — Project Foundation
        </p>
      </div>
    </main>
  );
}
