"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { checkHealth, type HealthResponse } from "@/lib/api";
import { apiListProducts, apiSearchProduct, type Product } from "@/lib/products";

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    checkHealth()
      .then(setHealth)
      .catch((err) => setHealthError(err.message));
  }, []);

  // Fetch recent products if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      apiListProducts({ limit: 6, sort: "-createdAt" })
        .then((res) => setRecentProducts(res.products))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleSearch = useCallback(
    async (query: string) => {
      setIsSearching(true);
      setSearchError("");
      try {
        const { product } = await apiSearchProduct(query);
        router.push(`/products/${product.id}`);
      } catch (err) {
        setSearchError((err as Error).message);
      } finally {
        setIsSearching(false);
      }
    },
    [router]
  );

  return (
    <>
      <Navbar />

      <main className="flex-1 flex flex-col items-center p-8">
        <div className="max-w-3xl w-full space-y-10">
          {/* Hero */}
          <div className="text-center space-y-3 pt-8">
            <h1 className="text-4xl font-bold tracking-tight">
              🔍 ProductLens AI
            </h1>
            <p className="text-lg text-foreground/60 max-w-xl mx-auto">
              Research industrial products with AI. Get verified specifications,
              source provenance, and confidence scoring.
            </p>
          </div>

          {/* Welcome + Search */}
          {!authLoading && isAuthenticated && user && (
            <div className="space-y-4">
              <p className="text-sm text-foreground/50 text-center">
                Welcome back,{" "}
                <span className="font-medium text-foreground/70">
                  {user.name}
                </span>
              </p>
              <div className="max-w-2xl mx-auto">
                <SearchBar onSearch={handleSearch} isLoading={isSearching} />
              </div>
              {searchError && (
                <p className="text-sm text-red-500 text-center">
                  {searchError}
                </p>
              )}
            </div>
          )}

          {/* CTA for non-authenticated users */}
          {!authLoading && !isAuthenticated && (
            <div className="text-center space-y-4">
              <p className="text-sm text-foreground/50">
                Sign in to start researching products
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="rounded-lg border border-foreground/15 px-5 py-2 text-sm font-medium transition-colors hover:bg-foreground/[0.05]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-foreground text-background px-5 py-2 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          )}

          {/* Recent Products */}
          {isAuthenticated && recentProducts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/40">
                  Recent Products
                </h2>
                <Link
                  href="/products"
                  className="text-sm text-foreground/40 hover:text-foreground/60 transition-colors"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* System Status */}
          <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/40">
              System Status
            </h2>

            {healthError && (
              <div className="text-sm text-red-500 bg-red-500/10 rounded-lg p-3">
                Backend unavailable: {healthError}
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

            {!health && !healthError && (
              <p className="text-sm text-foreground/40">
                Checking services...
              </p>
            )}
          </div>

          {/* Phase indicator */}
          <p className="text-xs text-foreground/30 text-center">
            Phase 3 — Product Search + Resolution
          </p>
        </div>
      </main>
    </>
  );
}
