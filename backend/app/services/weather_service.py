import os
from typing import Any, Dict

import requests

from ..models import WeatherData

_BASE_URL = "https://api.weatherapi.com/v1/current.json"


def get_weather(city: str) -> WeatherData:
    api_key = os.getenv("WEATHERAPI_KEY")
    if not api_key:
        raise ValueError("WEATHERAPI_KEY is not set")

    params = {"key": api_key, "q": city, "aqi": "no"}
    response = requests.get(_BASE_URL, params=params, timeout=10)
    response.raise_for_status()
    payload: Dict[str, Any] = response.json()

    return WeatherData(
        city=payload["location"]["name"],
        temperature_c=float(payload["current"]["temp_c"]),
        description=str(payload["current"]["condition"]["text"]),
    )
