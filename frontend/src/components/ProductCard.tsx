"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  researching: {
    label: "Researching",
    className:
      "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse",
  },
  complete: {
    label: "Complete",
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
} as const;

/**
 * Compact product card for list/grid display.
 */
export function ProductCard({ product }: ProductCardProps) {
  const statusConfig = STATUS_CONFIG[product.status];
  const confidencePercent = Math.round(product.confidenceScore * 100);

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5 space-y-3 transition-colors hover:border-foreground/20 hover:bg-foreground/[0.04]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate group-hover:text-foreground transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-foreground/50 mt-0.5">
              {product.manufacturer} · {product.modelNumber}
            </p>
          </div>

          {/* Status badge */}
          <span
            className={`shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusConfig.className}`}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-foreground/40">
          <span>
            {product.category || "Uncategorized"}
          </span>

          {product.status === "complete" && (
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-12 bg-foreground/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    confidencePercent >= 70
                      ? "bg-green-500"
                      : confidencePercent >= 40
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
              <span>{confidencePercent}%</span>
            </div>
          )}

          {product.status === "pending" && (
            <span className="text-amber-500/70">Ready to research</span>
          )}
        </div>
      </div>
    </Link>
  );
}
