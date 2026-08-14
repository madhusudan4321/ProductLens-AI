import { apiFetch } from "./api";

// ─── Types ───────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  manufacturer: string;
  modelNumber: string;
  category: string;
  description: string;
  aliases: string[];
  status: "pending" | "researching" | "complete" | "failed";
  userId: string;
  researchJobId?: string;
  specifications: Record<string, unknown>;
  sources: Array<{
    url: string;
    domain: string;
    title: string;
    type: string;
    trustScore: number;
    accessedAt: string;
  }>;
  confidenceScore: number;
  tags: string[];
  metadata: {
    researchDuration?: number;
    sourcesSearched?: number;
    specsExtracted?: number;
    lastResearchedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface SearchResponse {
  success: boolean;
  data: {
    product: Product;
    isNew: boolean;
  };
}

interface ProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: PaginationInfo;
  };
}

// ─── API Functions ───────────────────────────────────────

/**
 * Search/create a product by freeform query.
 */
export async function apiSearchProduct(
  query: string
): Promise<{ product: Product; isNew: boolean }> {
  const res = await apiFetch<SearchResponse>("/products/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
  return res.data;
}

/**
 * Search/create a product by structured fields.
 */
export async function apiSearchProductStructured(
  manufacturer: string,
  modelNumber: string,
  name?: string
): Promise<{ product: Product; isNew: boolean }> {
  const res = await apiFetch<SearchResponse>("/products/search", {
    method: "POST",
    body: JSON.stringify({ manufacturer, modelNumber, name }),
  });
  return res.data;
}

/**
 * Get a single product by ID.
 */
export async function apiGetProduct(id: string): Promise<Product> {
  const res = await apiFetch<ProductResponse>(`/products/${id}`);
  return res.data.product;
}

/**
 * List products with optional filters.
 */
export async function apiListProducts(params?: {
  page?: number;
  limit?: number;
  status?: string;
  sort?: string;
  mine?: boolean;
}): Promise<{ products: Product[]; pagination: PaginationInfo }> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.status) searchParams.set("status", params.status);
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.mine) searchParams.set("mine", "true");

  const qs = searchParams.toString();
  const res = await apiFetch<ProductListResponse>(
    `/products${qs ? `?${qs}` : ""}`
  );
  return res.data;
}

/**
 * Delete a product by ID.
 */
export async function apiDeleteProduct(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/products/${id}`, {
    method: "DELETE",
  });
}
