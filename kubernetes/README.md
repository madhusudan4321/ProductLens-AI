# Kubernetes — ProductLens AI

## Current Status
**Phase 1** — Placeholder structure only. Not intended for deployment yet.

## Strategy
1. Develop and test locally using Docker Compose
2. Deploy to Render for initial production
3. Migrate to AKS (Azure Kubernetes Service) for horizontal scaling

## Structure
```
kubernetes/
├── base/           # Base Kubernetes manifests
│   ├── namespace.yaml
│   ├── frontend/
│   ├── backend/
│   ├── ai-service/
│   └── workers/
└── overlays/
    └── production/ # Production-specific overrides (Kustomize)
```

## When to Deploy
Kubernetes deployment will be implemented in **Phase 10** after:
- All application features are complete
- Docker images are production-ready
- Initial Render deployment is tested and optimized
