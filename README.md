<![CDATA[# ProductLens AI

<div align="center">

**AI-Powered Product Intelligence Platform**

*Research · Extract · Validate · Discover*

[![Node.js](https://img.shields.io/badge/Node.js-≥20-339933?logo=node.js&logoColor=white)](#prerequisites)
[![Python](https://img.shields.io/badge/Python-≥3.11-3776AB?logo=python&logoColor=white)](#prerequisites)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](#tech-stack)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](#tech-stack)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](#tech-stack)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)](#tech-stack)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](#tech-stack)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](#tech-stack)
[![License](https://img.shields.io/badge/License-UNLICENSED-red)](#license)

</div>

---

ProductLens AI is a self-growing product intelligence platform that researches industrial products across multiple reliable sources, extracts and validates specifications using AI, and presents verified product intelligence with source provenance and confidence scoring.

**Core Value Proposition:** Users search for a product → the platform autonomously researches it across the web → extracts structured specifications → validates data across sources → presents verified intelligence with confidence scores and source links.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Development Phases — Full Implementation Plan](#development-phases--full-implementation-plan)
  - [Phase 1 — Project Foundation](#phase-1--project-foundation-)
  - [Phase 2 — Authentication](#phase-2--authentication-)
  - [Phase 3 — Product Search + Resolution](#phase-3--product-search--resolution)
  - [Phase 4 — AI Research Pipeline](#phase-4--ai-research-pipeline)
  - [Phase 5 — Extraction + Validation + Provenance](#phase-5--extraction--validation--provenance)
  - [Phase 6 — Storage + Caching + Deduplication](#phase-6--storage--caching--deduplication)
  - [Phase 7 — Dashboard + Product UI](#phase-7--dashboard--product-ui)
  - [Phase 8 — Analytics + Product Discovery](#phase-8--analytics--product-discovery)
  - [Phase 9 — Docker + Render Deployment](#phase-9--docker--render-deployment)
  - [Phase 10 — Kubernetes + Azure](#phase-10--kubernetes--azure)
- [Data Models](#data-models)
- [Security](#security)
- [License](#license)

---

## Architecture

```
                              ┌──────────────────────────────────────────────┐
                              │              ProductLens AI                  │
                              └──────────────────────────────────────────────┘

 ┌─────────────────┐       ┌─────────────────┐       ┌──────────────────────┐
 │                 │       │                 │       │                      │
 │    Frontend     │──────▶│    Backend      │──────▶│    AI Service        │
 │    (Next.js)    │       │    (Express)    │       │    (FastAPI)         │
 │    Port: 3000   │       │    Port: 5000   │       │    Port: 8000        │
 │                 │       │                 │       │                      │
 │  • App Router   │       │  • REST API     │       │  • Web Research      │
 │  • Auth Context │       │  • JWT Auth     │       │  • Spec Extraction   │
 │  • shadcn/ui    │       │  • Mongoose     │       │  • Validation        │
 │  • Tailwind v4  │       │  • BullMQ       │       │  • Confidence Score  │
 │                 │       │                 │       │                      │
 └─────────────────┘       └───────┬─────────┘       └──────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────────┐
              │  MongoDB   │ │   Redis   │ │   Workers     │
              │  :27017    │ │   :6379   │ │   (BullMQ)    │
              │            │ │           │ │               │
              │ • Products │ │ • Cache   │ │ • Research    │
              │ • Users    │ │ • Queue   │ │ • Extraction  │
              │ • Research │ │ • Session │ │ • Validation  │
              └────────────┘ └───────────┘ └───────────────┘
```

### Data Flow

```
User searches "SKF 6205 bearing"
        │
        ▼
┌─ Frontend ────────────────────────────────────┐
│  1. User enters query                         │
│  2. Display loading / progress UI             │
└───────────────────────┬───────────────────────┘
                        │ POST /api/products/search
                        ▼
┌─ Backend ─────────────────────────────────────┐
│  3. Check cache (Redis) for existing results  │
│  4. If miss → Enqueue research job (BullMQ)   │
│  5. Return job ID / cached product            │
└───────────────────────┬───────────────────────┘
                        │ Job queued
                        ▼
┌─ Workers ─────────────────────────────────────┐
│  6. Pick up job from queue                    │
│  7. Call AI Service for research              │
│  8. Store results in MongoDB                  │
│  9. Update cache, mark job complete           │
└───────────────────────┬───────────────────────┘
                        │ HTTP call
                        ▼
┌─ AI Service ──────────────────────────────────┐
│  10. Web scraping / API calls for product     │
│  11. LLM-powered spec extraction              │
│  12. Cross-source validation                  │
│  13. Confidence scoring + provenance          │
│  14. Return structured ProductSpec            │
└───────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui | App Router, SSR, responsive UI |
| **Backend** | Node.js, Express 4, TypeScript, Mongoose | REST API, business logic, auth |
| **AI Service** | Python 3.12, FastAPI, Pydantic | Web research, LLM extraction, validation |
| **Database** | MongoDB 7 (Mongoose ODM) | Products, users, research results |
| **Cache / Queue** | Redis 7, BullMQ | Response caching, job queue |
| **Workers** | BullMQ workers (TypeScript) | Background research, extraction |
| **Auth** | JWT (access + refresh), bcryptjs, HTTP-only cookies | Stateless authentication |
| **Logging** | Winston (backend/workers) | Structured JSON / colorized dev logs |
| **Containerization** | Docker, Docker Compose | Local dev + production images |
| **Orchestration** | Kubernetes, Kustomize | Production deployment (Azure AKS) |
| **CI/CD** | GitHub Actions (planned) | Build, test, deploy |

---

## Prerequisites

| Requirement | Version | Notes |
|------------|---------|-------|
| **Node.js** | ≥ 20 | Backend, frontend, workers |
| **npm** | ≥ 10 | Comes with Node.js |
| **Python** | ≥ 3.11 | AI service |
| **Docker** | Latest | MongoDB + Redis (local dev) |
| **Docker Compose** | Latest | Multi-container orchestration |
| **Git** | Latest | Version control |

---

## Getting Started

### 1. Clone & Configure

```bash
git clone <repository-url>
cd "ProductLens AI"

# Copy environment template
cp .env.example .env

# Edit .env with your values
# At minimum, set a strong JWT_SECRET for production
```

### 2. Start Infrastructure (MongoDB + Redis)

```bash
docker-compose up -d mongodb redis

# Verify they're running
docker-compose ps
```

### 3. Start Backend

```bash
cd backend
npm install
npm run dev
```

The backend API will be available at `http://localhost:5000`.
Health check: `http://localhost:5000/api/health`

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### 5. Start AI Service

```bash
cd ai-service
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The AI service will be available at `http://localhost:8000`.
API docs: `http://localhost:8000/api/docs`

### 6. Start Workers

```bash
cd workers
npm install
npm run dev
```

### Verify All Services

```bash
# Backend health (includes MongoDB + Redis checks)
curl http://localhost:5000/api/health

# AI Service health
curl http://localhost:8000/api/health

# Expected backend response:
# {
#   "success": true,
#   "status": "healthy",
#   "service": "productlens-backend",
#   "timestamp": "2026-...",
#   "checks": { "mongodb": "connected", "redis": "connected" }
# }
```

---

## Project Structure

```
ProductLens AI/
├── frontend/                     # Next.js 16 frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── layout.tsx       # Root layout (AuthProvider wraps all pages)
│   │   │   ├── page.tsx         # Home — system status + auth-aware nav
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Registration page
│   │   │   └── profile/         # Protected profile page
│   │   ├── components/          # React components
│   │   │   ├── ProtectedRoute.tsx  # Auth guard → redirect to /login
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Auth state (user, login, logout, register)
│   │   └── lib/
│   │       ├── api.ts           # apiFetch wrapper (credentials: include)
│   │       ├── auth.ts          # Auth API functions (register, login, etc.)
│   │       └── utils.ts         # cn() utility
│   ├── components.json          # shadcn/ui configuration
│   └── Dockerfile
│
├── backend/                      # Express backend API
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts           # Typed env config (fail-fast on missing vars)
│   │   │   ├── db.ts            # MongoDB connection via Mongoose
│   │   │   ├── redis.ts         # Redis singleton (ioredis)
│   │   │   └── queue.ts         # BullMQ queue config + queue names
│   │   ├── middleware/
│   │   │   ├── auth.ts          # JWT authentication middleware
│   │   │   └── errorHandler.ts  # Centralized error handler
│   │   ├── models/
│   │   │   └── User.ts          # Mongoose User schema (bcrypt, comparePassword)
│   │   ├── routes/
│   │   │   ├── auth.ts          # /api/auth/* routes
│   │   │   └── health.ts        # /api/health route
│   │   ├── controllers/
│   │   │   └── authController.ts # Auth handlers (register, login, etc.)
│   │   ├── services/
│   │   │   └── authService.ts   # Auth business logic (tokens, users)
│   │   ├── utils/
│   │   │   └── logger.ts        # Winston logger
│   │   ├── app.ts               # Express app setup (middleware, routes)
│   │   └── server.ts            # Server bootstrap (DB, Redis, listen)
│   └── Dockerfile
│
├── ai-service/                   # Python FastAPI AI service
│   ├── app/
│   │   ├── main.py              # FastAPI app (CORS, lifespan, routers)
│   │   ├── config.py            # Pydantic Settings
│   │   ├── routers/
│   │   │   └── health.py        # Health check endpoint
│   │   ├── services/            # AI logic (research, extraction)
│   │   └── models/              # Pydantic schemas
│   ├── requirements.txt
│   └── Dockerfile
│
├── workers/                      # BullMQ background workers
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts           # Worker env config
│   │   │   ├── redis.ts         # Redis connection
│   │   │   └── queue.ts         # Queue definitions
│   │   ├── processors/
│   │   │   └── researchProcessor.ts  # Research job processor
│   │   ├── utils/
│   │   │   └── logger.ts        # Winston logger
│   │   └── index.ts             # Worker bootstrap + graceful shutdown
│   └── Dockerfile
│
├── kubernetes/                   # K8s manifests
│   ├── base/
│   │   ├── namespace.yaml
│   │   ├── frontend/deployment.yaml
│   │   ├── backend/deployment.yaml
│   │   ├── ai-service/deployment.yaml
│   │   └── workers/deployment.yaml
│   └── overlays/
│       └── production/kustomization.yaml
│
├── docker-compose.yml            # Local dev (MongoDB + Redis + app services)
├── .env.example                  # Environment variable template
├── .gitignore
└── README.md                     # ← You are here
```

---

## Environment Variables

Copy `.env.example` → `.env` at the project root.

| Variable | Service | Default | Description |
|----------|---------|---------|-------------|
| `NODE_ENV` | Backend, Workers | `development` | `development` or `production` |
| `BACKEND_PORT` | Backend | `5000` | Backend API port |
| `MONGODB_URI` | Backend | — | MongoDB connection string |
| `REDIS_URL` | Backend, Workers | — | Redis connection string |
| `JWT_SECRET` | Backend | — | JWT signing secret (**change in production**) |
| `JWT_EXPIRES_IN` | Backend | `15m` | Access token expiry duration |
| `JWT_REFRESH_EXPIRES_IN` | Backend | `7d` | Refresh token expiry duration |
| `AI_SERVICE_URL` | Backend | `http://localhost:8000` | AI service base URL |
| `FRONTEND_URL` | Backend | `http://localhost:3000` | Frontend URL (CORS origin) |
| `NEXT_PUBLIC_API_URL` | Frontend | `http://localhost:5000/api` | Backend API URL (client-side) |
| `AI_SERVICE_PORT` | AI Service | `8000` | AI service port |
| `WORKER_CONCURRENCY` | Workers | `2` | Max concurrent jobs per worker |

---

## API Reference

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/health` | Public | Backend health (MongoDB + Redis) |

### Authentication (Phase 2 ✅)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | Public | Create new user account |
| `POST` | `/api/auth/login` | Public | Login → set auth cookies |
| `POST` | `/api/auth/logout` | Public | Clear auth cookies |
| `GET` | `/api/auth/me` | Protected | Get current user profile |
| `POST` | `/api/auth/refresh` | Cookie* | Refresh access token |

> \* Uses the refresh token cookie (path-restricted to `/api/auth/refresh`).

### Products (Phase 3–6 — Planned)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/products/search` | Protected | Search/initiate product research |
| `GET` | `/api/products/:id` | Protected | Get product with specs |
| `GET` | `/api/products` | Protected | List user's researched products |
| `GET` | `/api/products/:id/sources` | Protected | Get source provenance |
| `GET` | `/api/products/:id/specs` | Protected | Get validated specifications |
| `DELETE` | `/api/products/:id` | Protected | Remove product from user's list |

### Research Jobs (Phase 4 — Planned)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/jobs/:id` | Protected | Get research job status |
| `GET` | `/api/jobs` | Protected | List user's active jobs |
| `POST` | `/api/jobs/:id/cancel` | Protected | Cancel a running job |

### Analytics (Phase 8 — Planned)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/analytics/trending` | Public | Trending products |
| `GET` | `/api/analytics/recent` | Public | Recently researched |
| `GET` | `/api/analytics/stats` | Protected | User research statistics |

### AI Service Endpoints

| Method | Path | Service | Description |
|--------|------|---------|-------------|
| `GET` | `/api/health` | AI Service | AI service health check |
| `POST` | `/api/research` | AI Service | Execute product research |
| `POST` | `/api/extract` | AI Service | Extract specs from content |
| `POST` | `/api/validate` | AI Service | Cross-validate specifications |

---

## Development Phases — Full Implementation Plan

### Progress Overview

| Phase | Name | Status | Key Deliverables |
|-------|------|--------|-----------------|
| 1 | Project Foundation | ✅ Complete | 4 services, Docker, health checks |
| 2 | Authentication | ✅ Complete | JWT auth, login/register/profile UI |
| 3 | Product Search + Resolution | 🔲 Planned | Product model, search API, resolution |
| 4 | AI Research Pipeline | 🔲 Planned | Web research, BullMQ jobs, AI service |
| 5 | Extraction + Validation + Provenance | 🔲 Planned | Spec extraction, cross-validation, scoring |
| 6 | Storage + Caching + Deduplication | 🔲 Planned | Redis cache, dedup, query optimization |
| 7 | Dashboard + Product UI | 🔲 Planned | Product pages, spec viewer, search UI |
| 8 | Analytics + Product Discovery | 🔲 Planned | Trending, recommendations, stats |
| 9 | Docker + Render Deployment | 🔲 Planned | Production Docker, Render.com deploy |
| 10 | Kubernetes + Azure | 🔲 Planned | AKS, Helm charts, CI/CD |

---

### Phase 1 — Project Foundation ✅

**Goal:** Establish the monorepo structure with four services, infrastructure, and connectivity.

**Delivered:**
- Express backend with health endpoint, Mongoose, ioredis, BullMQ queue config
- Next.js 16 frontend with shadcn/ui, Tailwind CSS v4, App Router, `apiFetch` wrapper
- FastAPI AI service with Pydantic settings, health endpoint, CORS
- BullMQ workers with research processor skeleton, graceful shutdown
- Docker Compose for MongoDB 7 + Redis 7
- Kubernetes placeholder manifests (Kustomize)
- Centralized error handling, Winston logging, typed env config

**Key Design Decisions:**
- `fail-fast` env config — missing required vars throw at startup, not at runtime
- Redis `maxRetriesPerRequest: null` — required for BullMQ compatibility
- `credentials: "include"` in frontend `apiFetch` — prepares for cookie-based auth
- Centralized `QUEUE_NAMES` — single source of truth for BullMQ queue names

---

### Phase 2 — Authentication ✅

**Goal:** Full user authentication — registration, login, logout, JWT session management, protected routes.

**Delivered:**

| Component | Details |
|-----------|---------|
| **User Model** | Mongoose schema: `name`, `email` (unique), `password` (bcrypt 12 rounds), `role` (user/admin) |
| **Auth Service** | `registerUser`, `loginUser`, `generateTokens`, `verifyAccessToken`, `verifyRefreshToken`, `refreshTokens` |
| **Auth Controller** | Thin handlers: register → 201, login → 200, logout → clear cookies, getMe → user, refresh → new tokens |
| **Auth Middleware** | Extracts access token from HTTP-only cookie, verifies JWT, attaches `req.user` |
| **Auth Routes** | 5 endpoints: register, login, logout, me (protected), refresh |
| **Frontend Auth** | `AuthContext` + `AuthProvider`, `ProtectedRoute` component, login/register/profile pages |

**JWT Strategy:**
- **Access token**: 15 min, HTTP-only cookie, `path: /`
- **Refresh token**: 7 days, HTTP-only cookie, `path: /api/auth/refresh` (restricted)
- Both use same `JWT_SECRET` but payload includes `type: "access" | "refresh"` to distinguish
- Cookies: `httpOnly: true`, `secure: true` (production), `sameSite: strict` (production) / `lax` (dev)

---

### Phase 3 — Product Search + Resolution

**Goal:** Enable users to search for products by name/model number and resolve them to canonical product entities.

**Scope:**

#### Backend — Product Model
```
Product {
  _id: ObjectId
  name: string                    // "SKF 6205-2Z Deep Groove Ball Bearing"
  slug: string                    // "skf-6205-2z" (URL-friendly, unique)
  manufacturer: string            // "SKF"
  modelNumber: string             // "6205-2Z"
  category: string                // "Ball Bearings"
  description: string             // AI-generated summary
  aliases: string[]               // ["6205-2Z", "6205-ZZ", "6205 2Z"]
  status: "pending" | "researching" | "complete" | "failed"
  researchJobId: ObjectId         // Reference to active research job
  userId: ObjectId                // User who initiated the search
  specifications: Map<string, SpecValue>  // Validated specs
  sources: SourceReference[]      // Where data came from
  confidenceScore: number         // 0–1 overall confidence
  tags: string[]
  createdAt, updatedAt: Date
}
```

#### Backend — Search + Resolution Service
- `searchProducts(query)` — Fuzzy search across name, manufacturer, modelNumber, aliases
- `resolveProduct(query)` — Determine if product already exists (dedup by model number + manufacturer)
- `createProduct(data)` — Create a new product entity in "pending" status
- `getProduct(id)` — Get product with populated sources and specs
- `listUserProducts(userId, pagination)` — User's product list with filtering/sorting

#### Backend — Routes
- `POST /api/products/search` — Search/initiate research (returns existing or creates new + queues job)
- `GET /api/products/:id` — Get product details
- `GET /api/products` — List products (paginated, filterable)
- `DELETE /api/products/:id` — Soft-delete from user's list

#### Frontend
- Search bar component with autocomplete/suggestions
- Product card component (name, manufacturer, status, confidence badge)
- Product list view (user's researched products)
- Loading states for product resolution

---

### Phase 4 — AI Research Pipeline

**Goal:** Build the core research pipeline — when a user searches for a product, the system autonomously researches it across multiple web sources.

**Scope:**

#### BullMQ Job Flow
```
User searches → Backend creates Product (status: pending)
    → Enqueues "product-research" job
        → Worker picks up job
            → Calls AI Service /api/research
                → AI researches product across sources
                → Returns raw research data
            → Worker stores results
            → Updates Product (status: complete)
```

#### AI Service — Research Module
```python
# app/services/researcher.py

class ProductResearcher:
    """Orchestrates multi-source product research."""

    async def research(self, query: str, manufacturer: str) -> ResearchResult:
        """
        1. Generate search queries (product name + manufacturer + "specifications")
        2. Search across configured sources:
           - Manufacturer websites (e.g., skf.com)
           - Technical distributors (McMaster-Carr, RS Components, DigiKey)
           - Industrial databases (thomasnet.com)
           - Product datasheets (PDF extraction)
        3. Fetch and parse page content
        4. Return raw content with source metadata
        """
```

#### AI Service — Research Sources
| Source Type | Examples | Data Quality |
|------------|---------|-------------|
| Manufacturer sites | skf.com, siemens.com | Highest — primary source |
| Technical distributors | McMaster-Carr, RS Components, DigiKey | High — verified specs |
| Industrial databases | ThomasNet, GlobalSpec | Medium — aggregated |
| Datasheets | PDF specifications | High — official docs |
| General web | Google search results | Variable — needs validation |

#### Workers — Research Processor
- Pick up `product-research` jobs from BullMQ queue
- Call AI Service with product query
- Handle retries with exponential backoff (3 attempts)
- Update product status: `pending` → `researching` → `complete` / `failed`
- Emit progress events for real-time frontend updates
- Store raw research results for later extraction

#### Backend — Job Tracking
- `GET /api/jobs/:id` — Check research job status + progress
- WebSocket or polling for real-time progress updates
- Job states: `waiting` → `active` → `completed` / `failed`

---

### Phase 5 — Extraction + Validation + Provenance

**Goal:** Extract structured specifications from raw research data, validate across sources, and track provenance.

**Scope:**

#### AI Service — Specification Extraction
```python
# app/services/extractor.py

class SpecExtractor:
    """LLM-powered specification extraction from raw content."""

    async def extract(self, raw_content: str, product_context: dict) -> list[ExtractedSpec]:
        """
        1. Chunk raw content for LLM processing
        2. Prompt LLM to extract key-value specifications:
           - Dimensions (bore diameter, outer diameter, width)
           - Materials (steel grade, coating)
           - Performance (load ratings, speed limits)
           - Operating conditions (temperature range, environment)
        3. Normalize units (mm, inches → mm)
        4. Return structured specs with source attribution
        """
```

#### Data Model — Specification Value
```
SpecValue {
  key: string              // "Bore Diameter"
  value: string            // "25"
  unit: string             // "mm"
  normalizedValue: number  // 25.0 (for comparison)
  normalizedUnit: string   // "mm"
  confidence: number       // 0–1
  sources: [{
    url: string            // Source URL
    domain: string         // "skf.com"
    extractedValue: string // Raw extracted value
    accessedAt: Date
  }]
  validationStatus: "unvalidated" | "validated" | "conflict"
}
```

#### AI Service — Cross-Source Validation
```python
# app/services/validator.py

class SpecValidator:
    """Cross-source validation and confidence scoring."""

    async def validate(self, specs: list[ExtractedSpec]) -> list[ValidatedSpec]:
        """
        1. Group extracted specs by key (e.g., all "Bore Diameter" values)
        2. Compare values across sources:
           - Exact match → high confidence
           - Close match (within tolerance) → medium confidence
           - Conflict → flag for review, keep all values
        3. Source weighting:
           - Manufacturer website: weight 1.0
           - Technical distributor: weight 0.8
           - General web: weight 0.5
        4. Calculate weighted confidence score
        5. Select "best" value based on source authority
        """
```

#### Confidence Scoring Formula
```
confidence = Σ(source_weight × match_score) / Σ(source_weight)

Where:
  source_weight = { manufacturer: 1.0, distributor: 0.8, database: 0.6, web: 0.5 }
  match_score   = { exact: 1.0, close: 0.7, conflict: 0.3 }
```

#### Provenance Tracking
- Every spec value links back to exact source(s)
- Source metadata: URL, domain, page title, access timestamp
- Audit trail: extraction → validation → final value
- User can click any spec value to see "Where did this come from?"

---

### Phase 6 — Storage + Caching + Deduplication

**Goal:** Optimize data storage, implement intelligent caching, and prevent duplicate research.

**Scope:**

#### Redis Caching Strategy
| Cache Key | TTL | Purpose |
|-----------|-----|---------|
| `product:{slug}` | 24h | Full product data |
| `search:{hash}` | 1h | Search result sets |
| `specs:{productId}` | 24h | Validated specifications |
| `research:{query}` | 6h | Raw research results |

#### Cache Invalidation
- On product update → invalidate `product:{slug}` + `specs:{productId}`
- On new research → invalidate `search:*` matching product
- TTL-based expiry for all keys
- Manual cache bust via admin endpoint

#### Product Deduplication
```
Dedup Strategy:
1. Normalize model number: "SKF 6205-2Z" → "skf6205-2z"
2. Check existing products by normalized model + manufacturer
3. If match found:
   a. Same user → return existing product
   b. Different user → clone reference (not re-research)
4. If no match → create new product + queue research
```

#### MongoDB Indexes
```javascript
// Performance indexes
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ manufacturer: 1, modelNumber: 1 });
productSchema.index({ userId: 1, createdAt: -1 });
productSchema.index({ status: 1 });
productSchema.index({ name: "text", manufacturer: "text", modelNumber: "text" });
// TTL index for incomplete products
productSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 3600, partialFilterExpression: { status: "failed" } });
```

#### Query Optimization
- Lean queries for list views (exclude heavy fields like raw research data)
- Projection: only return needed fields per endpoint
- Pagination: cursor-based for large result sets
- Aggregation pipelines for analytics queries

---

### Phase 7 — Dashboard + Product UI

**Goal:** Build the premium product intelligence UI — dashboard, product detail pages, specification viewer, and search experience.

**Scope:**

#### Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Overview: recent products, active jobs, quick search |
| `/search` | Search | Full search experience with autocomplete |
| `/products` | Product List | User's researched products (grid/list view) |
| `/products/[id]` | Product Detail | Full product page with specs, sources, confidence |
| `/products/[id]/specs` | Spec Deep-Dive | Detailed spec view with provenance |
| `/profile` | Profile | User settings and stats |
| `/login` | Login | Authentication |
| `/register` | Register | User registration |

#### Key UI Components

**Dashboard**
- Research activity feed (recent products)
- Active research jobs with progress indicators
- Quick search bar
- Stats cards (total products, avg confidence, sources used)

**Product Detail Page**
- Hero section: product name, manufacturer, status badge, confidence score gauge
- Specification table: key-value pairs with confidence indicators (green/yellow/red)
- Click any spec → expand to show all source values + provenance links
- Source list: all researched sources with trust badges
- Actions: re-research, export, share

**Specification Viewer**
- Sortable/filterable spec table
- Confidence heatmap (visual indicator per spec)
- Source comparison view (side-by-side from different sources)
- Conflict resolution UI (when sources disagree)
- Unit converter (mm ↔ inches, kg ↔ lbs)

**Search Experience**
- Instant search with debounced API calls
- Autocomplete suggestions from existing products
- "Research new product" CTA when no match found
- Search history (recent searches)

#### Design System
- **Dark mode** default, light mode toggle
- **shadcn/ui** for base components (Button, Card, Table, Badge, Dialog, etc.)
- **Micro-animations**: skeleton loaders, progress bars, confidence gauge animation
- **Responsive**: mobile-first, works on all screen sizes
- **Color palette**: confidence-based (green = high, amber = medium, red = low/conflict)

---

### Phase 8 — Analytics + Product Discovery

**Goal:** Add analytics, trending products, recommendations, and discovery features.

**Scope:**

#### Analytics Dashboard
- **User stats**: products researched, total specs validated, research hours saved
- **Platform stats**: total products, most researched categories, source reliability scores
- **Trending products**: most searched products in last 7/30 days
- **Research insights**: avg confidence by category, most reliable sources

#### Product Discovery
- **Trending**: products with most recent research activity
- **Recently added**: newest products on the platform
- **Category browsing**: products grouped by category (Bearings, Motors, Sensors, etc.)
- **Related products**: "Users who researched X also researched Y"

#### API Endpoints
```
GET /api/analytics/trending       → Top products by research count
GET /api/analytics/recent         → Most recently researched
GET /api/analytics/stats          → User-specific statistics
GET /api/analytics/categories     → Category breakdown
GET /api/analytics/sources        → Source reliability leaderboard
```

#### MongoDB Aggregation Pipelines
```javascript
// Trending products (last 7 days)
db.products.aggregate([
  { $match: { createdAt: { $gte: last7Days }, status: "complete" } },
  { $group: { _id: "$modelNumber", count: { $sum: 1 }, name: { $first: "$name" } } },
  { $sort: { count: -1 } },
  { $limit: 20 }
]);
```

---

### Phase 9 — Docker + Render Deployment

**Goal:** Production-ready Docker images and deploy to Render.com for cloud hosting.

**Scope:**

#### Docker Production Images
Each service gets a multi-stage optimized Dockerfile:

```dockerfile
# Example: backend/Dockerfile (multi-stage)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

#### Docker Compose (Full Stack)
```yaml
# Uncomment application services in docker-compose.yml:
# backend, frontend, ai-service, workers
# All connected to MongoDB + Redis
```

#### Render.com Deployment
| Service | Render Type | Instance | Notes |
|---------|------------|----------|-------|
| Frontend | Static Site | Free | Next.js static export |
| Backend | Web Service | Starter | Express API |
| AI Service | Web Service | Starter | FastAPI |
| Workers | Background Worker | Starter | BullMQ |
| MongoDB | External | MongoDB Atlas (Free M0) | Cloud DB |
| Redis | External | Render Redis | Managed cache |

#### Environment Setup
- `render.yaml` — Infrastructure-as-code for Render
- Environment groups for shared secrets
- Health check URLs configured per service
- Auto-deploy from `main` branch

#### Pre-Deployment Checklist
- [ ] All services build successfully (`npm run build`, `next build`)
- [ ] Environment variables configured in Render dashboard
- [ ] MongoDB Atlas cluster created and connection string set
- [ ] Redis instance provisioned
- [ ] CORS origins updated for production URLs
- [ ] `JWT_SECRET` set to a strong, unique value
- [ ] `NODE_ENV=production`
- [ ] Health checks passing on all services

---

### Phase 10 — Kubernetes + Azure

**Goal:** Production-grade Kubernetes deployment on Azure AKS with auto-scaling, monitoring, and CI/CD.

**Scope:**

#### Azure Resources
| Resource | Service | Purpose |
|----------|---------|---------|
| AKS Cluster | All | Container orchestration |
| Azure Container Registry | All | Docker image registry |
| Azure Cosmos DB (MongoDB API) | Backend | Managed database |
| Azure Cache for Redis | Backend, Workers | Managed cache/queue |
| Azure Key Vault | All | Secrets management |
| Azure Monitor | All | Logging and metrics |

#### Kubernetes Manifests (Kustomize)
```
kubernetes/
├── base/                          # Shared manifests
│   ├── namespace.yaml
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml              # Horizontal Pod Autoscaler
│   ├── backend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml
│   ├── ai-service/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml
│   ├── workers/
│   │   └── deployment.yaml
│   └── ingress.yaml              # NGINX Ingress
│
└── overlays/
    ├── staging/
    │   └── kustomization.yaml    # 1 replica, reduced resources
    └── production/
        └── kustomization.yaml    # 3 replicas, full resources
```

#### Scaling Strategy
| Service | Min Replicas | Max Replicas | Scale Metric |
|---------|-------------|-------------|-------------|
| Frontend | 2 | 10 | CPU 70% |
| Backend | 2 | 10 | CPU 70%, req/sec |
| AI Service | 1 | 5 | CPU 80% (GPU-heavy) |
| Workers | 1 | 5 | Queue depth |

#### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
# Trigger: push to main
#
# Jobs:
# 1. test     → Run tests for all services
# 2. build    → Build Docker images, push to ACR
# 3. deploy   → Apply Kustomize overlays to AKS
```

#### Monitoring & Observability
- **Metrics**: Prometheus + Grafana (CPU, memory, request latency, queue depth)
- **Logging**: Azure Monitor / ELK stack (structured JSON logs from Winston)
- **Alerting**: PagerDuty/Slack for critical failures
- **Tracing**: OpenTelemetry for cross-service request tracing

---

## Data Models

### User (Phase 2 ✅)

```typescript
{
  _id: ObjectId,
  name: string,           // 2–100 chars
  email: string,          // unique, lowercase
  password: string,       // bcrypt hash (12 rounds), excluded from queries
  role: "user" | "admin", // default: "user"
  createdAt: Date,
  updatedAt: Date
}
```

### Product (Phase 3 — Planned)

```typescript
{
  _id: ObjectId,
  name: string,                    // Display name
  slug: string,                    // URL-friendly, unique
  manufacturer: string,
  modelNumber: string,
  category: string,
  description: string,             // AI-generated summary
  aliases: string[],               // Alternative names/numbers
  status: "pending" | "researching" | "complete" | "failed",
  researchJobId: ObjectId,
  userId: ObjectId,
  specifications: Map<string, SpecValue>,
  sources: SourceReference[],
  confidenceScore: number,         // 0–1
  tags: string[],
  metadata: {
    researchDuration: number,      // milliseconds
    sourcesSearched: number,
    specsExtracted: number,
    lastResearchedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### SpecValue (Phase 5 — Planned)

```typescript
{
  key: string,
  value: string,
  unit: string,
  normalizedValue: number,
  normalizedUnit: string,
  confidence: number,              // 0–1
  sources: [{
    url: string,
    domain: string,
    extractedValue: string,
    accessedAt: Date
  }],
  validationStatus: "unvalidated" | "validated" | "conflict"
}
```

### SourceReference (Phase 5 — Planned)

```typescript
{
  url: string,
  domain: string,
  title: string,
  type: "manufacturer" | "distributor" | "database" | "datasheet" | "web",
  trustScore: number,              // 0–1 based on source type
  accessedAt: Date,
  contentHash: string              // For change detection
}
```

---

## Security

### Authentication
- **JWT access + refresh tokens** in HTTP-only cookies (not accessible to JavaScript)
- `secure: true` in production (HTTPS only)
- `sameSite: strict` in production (CSRF protection)
- Refresh token path-restricted to `/api/auth/refresh`
- bcrypt password hashing with 12 salt rounds

### API Security
- **Helmet.js** for HTTP security headers
- **CORS** restricted to `FRONTEND_URL` origin only
- **Rate limiting** (planned: Phase 9) — per-IP and per-user
- **Input validation** — Mongoose schema validation + controller-level checks
- **Error sanitization** — stack traces hidden in production

### Infrastructure
- **Secrets**: environment variables (never committed)
- **Docker**: non-root user, minimal base images (Alpine)
- **Kubernetes**: RBAC, network policies, secrets management via Key Vault

---

## Scripts Reference

### Backend

```bash
npm run dev        # Start with hot reload (tsx watch)
npm run build      # Compile TypeScript → dist/
npm start          # Run production build
npm run lint       # ESLint
```

### Frontend

```bash
npm run dev        # Next.js dev server (port 3000)
npm run build      # Production build
npm start          # Start production server
npm run lint       # ESLint
```

### AI Service

```bash
# Development
uvicorn app.main:app --reload --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Workers

```bash
npm run dev        # Start with hot reload (tsx watch)
npm run build      # Compile TypeScript → dist/
npm start          # Run production build
```

### Docker

```bash
# Infrastructure only
docker-compose up -d mongodb redis

# Full stack
docker-compose up -d

# View logs
docker-compose logs -f backend

# Tear down
docker-compose down -v
```

---

## Contributing

This is a private project. For internal contributors:

1. Create a feature branch from `main`
2. Follow the phase-based development approach
3. Ensure all TypeScript compiles cleanly (`npx tsc --noEmit`)
4. Ensure frontend builds (`npm run build`)
5. Test API changes with curl or Postman
6. Update this README when adding new endpoints or environment variables

---

## License

UNLICENSED — Private project.
]]>