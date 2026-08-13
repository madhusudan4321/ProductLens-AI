"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function ProfileContent() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-tight">
              🔍 ProductLens AI
            </h1>
          </Link>
          <p className="text-foreground/60">Your Profile</p>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-8 space-y-6">
          {/* Avatar placeholder */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-foreground/10 flex items-center justify-center text-2xl font-bold text-foreground/60">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* User info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-foreground/[0.03] px-4 py-3">
              <span className="text-sm text-foreground/50">Name</span>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-foreground/[0.03] px-4 py-3">
              <span className="text-sm text-foreground/50">Email</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-foreground/[0.03] px-4 py-3">
              <span className="text-sm text-foreground/50">Role</span>
              <span className="text-sm font-medium capitalize">
                {user.role}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-foreground/[0.03] px-4 py-3">
              <span className="text-sm text-foreground/50">Member since</span>
              <span className="text-sm font-medium">{memberSince}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              onClick={logout}
              className="w-full rounded-lg border border-red-500/30 text-red-500 py-2.5 text-sm font-medium transition-colors hover:bg-red-500/10"
            >
              Sign Out
            </button>
          </div>
        </div>

        <p className="text-center">
          <Link
            href="/"
            className="text-sm text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
