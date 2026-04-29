from typing import List, Optional

from pydantic import BaseModel, Field


class PlanBase(BaseModel):
    title: str = Field(..., min_length=1)
    time: str = Field(..., min_length=1)
    color: str = Field(..., min_length=1)
    type: Optional[str] = None


class PlanCreate(PlanBase):
    pass


class PlanOut(PlanBase):
    id: int


class PlansResponse(BaseModel):
    date: str
    plans: List[PlanOut]


class WeatherData(BaseModel):
    city: str
    temperature_c: float
    description: str


class AiRequest(BaseModel):
    date: str
    plans: List[PlanOut]
    weather: WeatherData
    message: Optional[str] = None
