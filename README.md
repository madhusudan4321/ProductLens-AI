# ProductLens AI

**AI-Powered Product Intelligence Platform**

ProductLens AI is a self-growing product intelligence platform that researches industrial products across multiple reliable sources, extracts and validates specifications, and presents verified product intelligence with source provenance and confidence scoring.

---

## Architecture

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│   Frontend   │───▶│   Backend    │───▶│  AI Service   │
│  (Next.js)   │    │  (Express)   │    │  (FastAPI)    │
│  Port: 3000  │    │  Port: 5000  │    │  Port: 8000   │
└─────────────┘    └──────┬───────┘    └──────────────┘
                          │
                   ┌──────┴───────┐
                   │              │
              ┌────▼────┐   ┌────▼────┐
              │ MongoDB  │   │  Redis   │
              │ :27017   │   │  :6379   │
              └──────────┘   └────┬────┘
                                  │
                           ┌──────▼───────┐
                           │   Workers     │
                           │  (BullMQ)     │
                           └──────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | Node.js, Express, TypeScript |
| AI Service | Python, FastAPI |
| Database | MongoDB (Mongoose) |
| Cache/Queue | Redis, BullMQ |
| Workers | BullMQ workers (TypeScript) |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes (future) |

## Prerequisites

- **Node.js** ≥ 20
- **Python** ≥ 3.11
- **Docker & Docker Compose** (for MongoDB + Redis)
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone & Configure

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values (MongoDB URI, Redis URL, etc.)
```

### 2. Start Infrastructure (MongoDB + Redis)

```bash
docker-compose up -d mongodb redis
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
```

## Project Structure

```
ProductLens AI/
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities & API client
│   ├── components.json    # shadcn/ui config
│   └── Dockerfile
│
├── backend/                # Express backend API
│   ├── src/
│   │   ├── config/        # DB, Redis, Queue, Env config
│   │   ├── middleware/    # Error handling, etc.
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Thin controllers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Mongoose models
│   │   └── utils/         # Logger, helpers
│   └── Dockerfile
│
├── ai-service/             # Python FastAPI AI service
│   ├── app/
│   │   ├── routers/       # API endpoints
│   │   ├── services/      # AI logic
│   │   └── models/        # Pydantic schemas
│   └── Dockerfile
│
├── workers/                # BullMQ background workers
│   ├── src/
│   │   ├── config/        # Redis, Queue config
│   │   ├── processors/   # Job processors
│   │   └── utils/         # Logger
│   └── Dockerfile
│
├── kubernetes/             # K8s manifests (placeholder)
│   ├── base/
│   └── overlays/
│
├── docker-compose.yml      # Local dev infrastructure
├── .env.example            # Environment template
├── .gitignore
└── README.md
```

## Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `NODE_ENV` | Backend, Workers | `development` or `production` |
| `BACKEND_PORT` | Backend | API port (default: 5000) |
| `MONGODB_URI` | Backend | MongoDB connection string |
| `REDIS_URL` | Backend, Workers | Redis connection string |
| `JWT_SECRET` | Backend | JWT signing secret |
| `AI_SERVICE_URL` | Backend | AI service URL |
| `FRONTEND_URL` | Backend | Frontend URL (CORS) |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API URL |
| `AI_SERVICE_PORT` | AI Service | AI service port (default: 8000) |
| `WORKER_CONCURRENCY` | Workers | Concurrent jobs per worker |

## Development Phases

- [x] **Phase 1** — Project Foundation
- [ ] Phase 2 — Authentication
- [ ] Phase 3 — Product Search + Resolution
- [ ] Phase 4 — AI Research Pipeline
- [ ] Phase 5 — Extraction + Validation + Provenance
- [ ] Phase 6 — Storage + Caching + Deduplication
- [ ] Phase 7 — Dashboard + Product UI
- [ ] Phase 8 — Analytics + Product Discovery
- [ ] Phase 9 — Docker + Render Deployment
- [ ] Phase 10 — Kubernetes + Azure

## License

UNLICENSED — Private project.