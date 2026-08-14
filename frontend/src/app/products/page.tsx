"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  apiListProducts,
  apiSearchProduct,
  type Product,
  type PaginationInfo,
} from "@/lib/products";

function ProductsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMine, setShowMine] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await apiListProducts({
        page: currentPage,
        limit: 12,
        status: statusFilter || undefined,
        mine: showMine || undefined,
        sort: "-createdAt",
      });
      setProducts(result.products);
      setPagination(result.pagination);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, showMine]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback(
    async (query: string) => {
      setIsSearching(true);
      setError("");
      try {
        const { product } = await apiSearchProduct(query);
        // Navigate to the product detail page
        router.push(`/products/${product.id}`);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsSearching(false);
      }
    },
    [router]
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Products</h1>
              <p className="text-sm text-foreground/50 mt-0.5">
                {user?.name ? `${user.name}'s` : "Your"} product research
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              {["", "pending", "researching", "complete", "failed"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-foreground text-background"
                        : "bg-foreground/[0.06] text-foreground/60 hover:bg-foreground/[0.1]"
                    }`}
                  >
                    {status === "" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>

            <div className="ml-auto">
              <button
                onClick={() => {
                  setShowMine(!showMine);
                  setCurrentPage(1);
                }}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  showMine
                    ? "bg-foreground text-background"
                    : "bg-foreground/[0.06] text-foreground/60 hover:bg-foreground/[0.1]"
                }`}
              >
                My Products
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5 space-y-3 animate-pulse"
                >
                  <div className="h-4 w-3/4 bg-foreground/10 rounded" />
                  <div className="h-3 w-1/2 bg-foreground/[0.06] rounded" />
                  <div className="h-3 w-1/3 bg-foreground/[0.06] rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && products.length === 0 && !error && (
            <div className="text-center py-16 space-y-3">
              <div className="text-4xl">📦</div>
              <h3 className="text-lg font-medium text-foreground/70">
                No products yet
              </h3>
              <p className="text-sm text-foreground/40 max-w-md mx-auto">
                Search for an industrial product above to start researching.
                Try something like &quot;SKF 6205-2Z&quot; or &quot;Siemens 1LA7&quot;.
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="rounded-lg border border-foreground/15 px-3 py-1.5 text-sm text-foreground/60 transition-colors hover:bg-foreground/[0.05] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="text-sm text-foreground/40 px-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(pagination.totalPages, p + 1)
                  )
                }
                disabled={!pagination.hasNext}
                className="rounded-lg border border-foreground/15 px-3 py-1.5 text-sm text-foreground/60 transition-colors hover:bg-foreground/[0.05] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsContent />
    </ProtectedRoute>
  );
}
