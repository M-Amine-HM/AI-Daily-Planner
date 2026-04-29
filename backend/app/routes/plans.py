from fastapi import APIRouter, HTTPException

from ..models import PlanCreate, PlanOut, PlansResponse
from ..services import plan_service

router = APIRouter(prefix="/api/plans", tags=["plans"])


@router.get("/{date}", response_model=PlansResponse)
def get_plans(date: str) -> PlansResponse:
    plans = plan_service.get_plans(date)
    return PlansResponse(date=date, plans=plans)


@router.post("/{date}", response_model=PlanOut)
def add_plan(date: str, payload: PlanCreate) -> PlanOut:
    if not date:
        raise HTTPException(status_code=400, detail="Date is required")
    return plan_service.add_plan(date, payload)
