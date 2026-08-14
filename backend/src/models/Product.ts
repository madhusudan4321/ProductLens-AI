import mongoose, { Schema, Document } from "mongoose";

// ─── Types ───────────────────────────────────────────────

export interface ISourceReference {
  url: string;
  domain: string;
  title: string;
  type: "manufacturer" | "distributor" | "database" | "datasheet" | "web";
  trustScore: number;
  accessedAt: Date;
  contentHash?: string;
}

export interface IProductMetadata {
  researchDuration?: number;
  sourcesSearched?: number;
  specsExtracted?: number;
  lastResearchedAt?: Date;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  manufacturer: string;
  modelNumber: string;
  category: string;
  description: string;
  aliases: string[];
  status: "pending" | "researching" | "complete" | "failed";
  userId: mongoose.Types.ObjectId;
  researchJobId?: string;
  specifications: Map<string, unknown>;
  sources: ISourceReference[];
  confidenceScore: number;
  tags: string[];
  metadata: IProductMetadata;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Helpers ─────────────────────────────────────────────

/**
 * Generate a URL-safe slug from manufacturer + model number.
 * e.g., ("SKF", "6205-2Z") → "skf-6205-2z"
 */
export function generateSlug(manufacturer: string, modelNumber: string): string {
  const raw = `${manufacturer} ${modelNumber}`;
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "");    // Trim leading/trailing hyphens
}

// ─── Schema ──────────────────────────────────────────────

const sourceReferenceSchema = new Schema<ISourceReference>(
  {
    url: { type: String, required: true },
    domain: { type: String, required: true },
    title: { type: String, default: "" },
    type: {
      type: String,
      enum: ["manufacturer", "distributor", "database", "datasheet", "web"],
      default: "web",
    },
    trustScore: { type: Number, min: 0, max: 1, default: 0.5 },
    accessedAt: { type: Date, default: Date.now },
    contentHash: { type: String },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [500, "Product name must be at most 500 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    manufacturer: {
      type: String,
      required: [true, "Manufacturer is required"],
      trim: true,
      maxlength: [200, "Manufacturer must be at most 200 characters"],
    },
    modelNumber: {
      type: String,
      required: [true, "Model number is required"],
      trim: true,
      maxlength: [200, "Model number must be at most 200 characters"],
    },
    category: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    aliases: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "researching", "complete", "failed"],
      default: "pending",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    researchJobId: {
      type: String,
    },
    specifications: {
      type: Map,
      of: Schema.Types.Mixed,
      default: new Map(),
    },
    sources: {
      type: [sourceReferenceSchema],
      default: [],
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    metadata: {
      researchDuration: { type: Number },
      sourcesSearched: { type: Number },
      specsExtracted: { type: Number },
      lastResearchedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ─────────────────────────────────────────────

// Unique slug for deduplication
productSchema.index({ slug: 1 }, { unique: true });

// Fast lookup by manufacturer + model
productSchema.index({ manufacturer: 1, modelNumber: 1 });

// User's products sorted by creation date
productSchema.index({ userId: 1, createdAt: -1 });

// Filter by status
productSchema.index({ status: 1 });

// Full-text search across key fields
productSchema.index(
  { name: "text", manufacturer: "text", modelNumber: "text" },
  { weights: { modelNumber: 10, manufacturer: 5, name: 3 }, name: "product_text_search" }
);

// ─── JSON Transform ──────────────────────────────────────

productSchema.set("toJSON", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(_doc: any, ret: any) {
    delete ret.__v;
    return ret;
  },
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
