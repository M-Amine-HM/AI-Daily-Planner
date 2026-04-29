from fastapi import APIRouter, HTTPException

from ..models import WeatherData
from ..services import weather_service

router = APIRouter(prefix="/api/weather", tags=["weather"])


@router.get("", response_model=WeatherData)
def get_weather(city: str) -> WeatherData:
    try:
        return weather_service.get_weather(city)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail="Weather service failed") from exc
