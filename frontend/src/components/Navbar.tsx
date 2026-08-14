"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

/**
 * Shared navigation bar — auth-aware with links to Products.
 */
export function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <nav className="border-b border-foreground/10 px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          🔍 ProductLens AI
        </Link>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <span className="text-sm text-foreground/30">...</span>
          ) : isAuthenticated && user ? (
            <>
              <Link
                href="/products"
                className="text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                Products
              </Link>
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
  );
}
