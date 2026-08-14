"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiGetProduct, apiDeleteProduct, type Product } from "@/lib/products";

const STATUS_CONFIG = {
  pending: {
    label: "Pending Research",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    description: "This product is queued for AI research.",
  },
  researching: {
    label: "Researching",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse",
    description: "AI is currently researching this product across the web.",
  },
  complete: {
    label: "Complete",
    className: "bg-green-500/10 text-green-500 border-green-500/20",
    description: "Research complete. Specifications have been validated.",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
    description: "Research failed. You can try again later.",
  },
} as const;

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!productId) return;

    setIsLoading(true);
    apiGetProduct(productId)
      .then(setProduct)
      .catch((err) => setError((err as Error).message))
      .finally(() => setIsLoading(false));
  }, [productId]);

  const handleDelete = useCallback(async () => {
    if (!productId) return;
    setIsDeleting(true);
    try {
      await apiDeleteProduct(productId);
      router.push("/products");
    } catch (err) {
      setError((err as Error).message);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [productId, router]);

  const confidencePercent = product
    ? Math.round(product.confidenceScore * 100)
    : 0;
  const statusConfig = product ? STATUS_CONFIG[product.status] : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back link */}
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            ← Back to products
          </Link>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-6 animate-pulse">
              <div className="h-8 w-2/3 bg-foreground/10 rounded" />
              <div className="h-4 w-1/3 bg-foreground/[0.06] rounded" />
              <div className="h-48 bg-foreground/[0.04] rounded-xl border border-foreground/10" />
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="text-sm text-red-500 bg-red-500/10 rounded-lg p-4 text-center">
              {error}
            </div>
          )}

          {/* Product Detail */}
          {product && !isLoading && (
            <>
              {/* Hero Section */}
              <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-foreground/50">
                      <span className="font-medium text-foreground/70">
                        {product.manufacturer}
                      </span>
                      <span>·</span>
                      <span>{product.modelNumber}</span>
                      {product.category && (
                        <>
                          <span>·</span>
                          <span>{product.category}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {statusConfig && (
                    <span
                      className={`shrink-0 inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium uppercase tracking-wider ${statusConfig.className}`}
                    >
                      {statusConfig.label}
                    </span>
                  )}
                </div>

                {/* Status Description */}
                {statusConfig && (
                  <p className="text-sm text-foreground/40">
                    {statusConfig.description}
                  </p>
                )}

                {/* Confidence Score (if complete) */}
                {product.status === "complete" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/50">
                        Confidence Score
                      </span>
                      <span
                        className={`font-semibold ${
                          confidencePercent >= 70
                            ? "text-green-500"
                            : confidencePercent >= 40
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {confidencePercent}%
                      </span>
                    </div>
                    <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          confidencePercent >= 70
                            ? "bg-green-500"
                            : confidencePercent >= 40
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Product Description */}
                {product.description && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                      Description
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Aliases */}
                {product.aliases.length > 0 && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                      Also Known As
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {product.aliases.map((alias, i) => (
                        <span
                          key={i}
                          className="inline-block rounded-md bg-foreground/[0.06] px-2 py-0.5 text-xs text-foreground/60"
                        >
                          {alias}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata row */}
                <div className="flex flex-wrap gap-4 text-xs text-foreground/40 pt-2 border-t border-foreground/[0.06]">
                  <span>
                    Created{" "}
                    {new Date(product.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {product.metadata.lastResearchedAt && (
                    <span>
                      Last researched{" "}
                      {new Date(
                        product.metadata.lastResearchedAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {product.metadata.sourcesSearched != null && (
                    <span>
                      {product.metadata.sourcesSearched} sources searched
                    </span>
                  )}
                  {product.metadata.specsExtracted != null && (
                    <span>
                      {product.metadata.specsExtracted} specs extracted
                    </span>
                  )}
                </div>
              </div>

              {/* Specifications Section */}
              <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6 md:p-8 space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/40">
                  Specifications
                </h2>

                {Object.keys(product.specifications).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between rounded-lg bg-foreground/[0.03] px-4 py-2.5"
                        >
                          <span className="text-sm text-foreground/60">
                            {key}
                          </span>
                          <span className="text-sm font-medium">
                            {String(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-2">
                    <div className="text-2xl">📋</div>
                    <p className="text-sm text-foreground/40">
                      {product.status === "pending"
                        ? "Specifications will appear after AI research is complete."
                        : product.status === "researching"
                          ? "AI is currently extracting specifications…"
                          : "No specifications available."}
                    </p>
                  </div>
                )}
              </div>

              {/* Sources Section */}
              <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6 md:p-8 space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/40">
                  Sources
                </h2>

                {product.sources.length > 0 ? (
                  <div className="space-y-2">
                    {product.sources.map((source, i) => (
                      <a
                        key={i}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-lg bg-foreground/[0.03] px-4 py-2.5 hover:bg-foreground/[0.06] transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {source.title || source.domain}
                          </p>
                          <p className="text-xs text-foreground/40 truncate">
                            {source.domain}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-foreground/30 ml-3">
                          ↗
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-2">
                    <div className="text-2xl">🌐</div>
                    <p className="text-sm text-foreground/40">
                      {product.status === "pending"
                        ? "Sources will be listed after research is complete."
                        : product.status === "researching"
                          ? "AI is searching across the web…"
                          : "No sources found."}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-sm text-red-500/60 hover:text-red-500 transition-colors"
                  >
                    Delete product
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground/50">
                      Are you sure?
                    </span>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="rounded-lg border border-red-500/30 text-red-500 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting…" : "Yes, delete"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-sm text-foreground/40 hover:text-foreground/60 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default function ProductDetailPage() {
  return (
    <ProtectedRoute>
      <ProductDetailContent />
    </ProtectedRoute>
  );
}
