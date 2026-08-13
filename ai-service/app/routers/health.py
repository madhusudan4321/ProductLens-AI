from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()


@router.get("/health")
async def health_check():
    """Health check endpoint for the AI service."""
    return {
        "success": True,
        "status": "healthy",
        "service": "productlens-ai-service",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
