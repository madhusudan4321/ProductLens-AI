import { Product, IProduct, generateSlug } from "../models/Product";
import { logger } from "../utils/logger";

// ─── Types ───────────────────────────────────────────────

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  manufacturer: string;
  modelNumber: string;
  category: string;
  description: string;
  aliases: string[];
  status: string;
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

// ─── Helpers ─────────────────────────────────────────────

function createOperationalError(message: string, statusCode: number): Error {
  const error = new Error(message) as Error & {
    statusCode: number;
    isOperational: boolean;
  };
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

function toProductResponse(product: IProduct): ProductResponse {
  const obj = product.toJSON();
  return {
    id: product._id.toString(),
    name: obj.name,
    slug: obj.slug,
    manufacturer: obj.manufacturer,
    modelNumber: obj.modelNumber,
    category: obj.category || "",
    description: obj.description || "",
    aliases: obj.aliases || [],
    status: obj.status,
    userId: obj.userId.toString(),
    researchJobId: obj.researchJobId,
    specifications: obj.specifications
      ? Object.fromEntries(obj.specifications)
      : {},
    sources: (obj.sources || []).map(
      (s: { url: string; domain: string; title: string; type: string; trustScore: number; accessedAt: Date }) => ({
        url: s.url,
        domain: s.domain,
        title: s.title,
        type: s.type,
        trustScore: s.trustScore,
        accessedAt: new Date(s.accessedAt).toISOString(),
      })
    ),
    confidenceScore: obj.confidenceScore || 0,
    tags: obj.tags || [],
    metadata: {
      researchDuration: obj.metadata?.researchDuration,
      sourcesSearched: obj.metadata?.sourcesSearched,
      specsExtracted: obj.metadata?.specsExtracted,
      lastResearchedAt: obj.metadata?.lastResearchedAt
        ? new Date(obj.metadata.lastResearchedAt).toISOString()
        : undefined,
    },
    createdAt: new Date(obj.createdAt).toISOString(),
    updatedAt: new Date(obj.updatedAt).toISOString(),
  };
}

/**
 * Parse a freeform query string into manufacturer + modelNumber.
 * Simple heuristic: first word = manufacturer, rest = model number.
 * e.g., "SKF 6205-2Z bearing" → { manufacturer: "SKF", modelNumber: "6205-2Z", name: "SKF 6205-2Z bearing" }
 */
function parseQuery(query: string): {
  manufacturer: string;
  modelNumber: string;
  name: string;
} {
  const trimmed = query.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length === 0) {
    throw createOperationalError("Search query cannot be empty", 400);
  }

  if (parts.length === 1) {
    // Single word — treat as model number with "Unknown" manufacturer
    return {
      manufacturer: "Unknown",
      modelNumber: parts[0],
      name: trimmed,
    };
  }

  // First word = manufacturer, remaining words = model number
  const manufacturer = parts[0];
  // Try to identify the model number (usually contains numbers/dashes)
  const modelParts = parts.slice(1);
  const modelNumber = modelParts[0]; // Primary model number is the second token

  return {
    manufacturer,
    modelNumber,
    name: trimmed,
  };
}

// ─── Product Operations ──────────────────────────────────

/**
 * Search products using MongoDB text search.
 */
export async function searchProducts(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<{ products: ProductResponse[]; pagination: PaginationInfo }> {
  const skip = (page - 1) * limit;

  const filter = query.trim()
    ? { $text: { $search: query.trim() } }
    : {};

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(query.trim() ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products: products.map((p) => toProductResponse(p as unknown as IProduct)),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Resolve a product: find existing by slug or create new one.
 * Returns the product and whether it was newly created.
 */
export async function resolveAndCreate(
  manufacturer: string,
  modelNumber: string,
  name: string,
  userId: string
): Promise<{ product: ProductResponse; isNew: boolean }> {
  const slug = generateSlug(manufacturer, modelNumber);

  // Check for existing product with this slug
  const existing = await Product.findOne({ slug });
  if (existing) {
    logger.info("Product resolved to existing", {
      slug,
      productId: existing._id,
    });
    return { product: toProductResponse(existing), isNew: false };
  }

  // Create new product in "pending" status
  const product = await Product.create({
    name,
    slug,
    manufacturer: manufacturer.trim(),
    modelNumber: modelNumber.trim(),
    userId,
    status: "pending",
    aliases: [modelNumber.trim()],
  });

  logger.info("New product created", {
    productId: product._id,
    slug,
    manufacturer,
    modelNumber,
  });

  return { product: toProductResponse(product), isNew: true };
}

/**
 * Resolve from a freeform query string.
 */
export async function resolveFromQuery(
  query: string,
  userId: string
): Promise<{ product: ProductResponse; isNew: boolean }> {
  const { manufacturer, modelNumber, name } = parseQuery(query);
  return resolveAndCreate(manufacturer, modelNumber, name, userId);
}

/**
 * Get a single product by ID.
 */
export async function getProductById(
  productId: string
): Promise<ProductResponse> {
  const product = await Product.findById(productId);
  if (!product) {
    throw createOperationalError("Product not found", 404);
  }
  return toProductResponse(product);
}

/**
 * Get a single product by slug.
 */
export async function getProductBySlug(
  slug: string
): Promise<ProductResponse> {
  const product = await Product.findOne({ slug });
  if (!product) {
    throw createOperationalError("Product not found", 404);
  }
  return toProductResponse(product);
}

/**
 * List products with pagination, optional status filter and sorting.
 */
export async function listProducts(
  page: number = 1,
  limit: number = 10,
  status?: string,
  sortBy: string = "-createdAt",
  userId?: string
): Promise<{ products: ProductResponse[]; pagination: PaginationInfo }> {
  const skip = (page - 1) * limit;

  // Build filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (status && ["pending", "researching", "complete", "failed"].includes(status)) {
    filter.status = status;
  }
  if (userId) {
    filter.userId = userId;
  }

  // Parse sort string (e.g., "-createdAt" → { createdAt: -1 })
  const sortDirection = sortBy.startsWith("-") ? -1 : 1;
  const sortField = sortBy.replace(/^-/, "");
  const allowedSortFields = ["createdAt", "updatedAt", "name", "manufacturer", "confidenceScore"];
  const finalSortField = allowedSortFields.includes(sortField) ? sortField : "createdAt";

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ [finalSortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products: products.map((p) => toProductResponse(p as unknown as IProduct)),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Delete a product. Only the owner or an admin can delete.
 */
export async function deleteProduct(
  productId: string,
  userId: string
): Promise<void> {
  const product = await Product.findById(productId);
  if (!product) {
    throw createOperationalError("Product not found", 404);
  }

  // Check ownership
  if (product.userId.toString() !== userId) {
    throw createOperationalError(
      "Not authorized to delete this product",
      403
    );
  }

  await Product.findByIdAndDelete(productId);

  logger.info("Product deleted", { productId, userId });
}
