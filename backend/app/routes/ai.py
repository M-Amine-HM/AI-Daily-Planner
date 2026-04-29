from fastapi import APIRouter, HTTPException

from ..models import AiRequest
from ..services import ai_service

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/recommendation")
def get_recommendation(payload: AiRequest) -> dict:
    try:
        recommendation = ai_service.get_recommendation(
            payload.date, payload.plans, payload.weather, payload.message
        )
        return {"recommendation": recommendation}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail="AI service failed") from exc
