import os
from typing import List

import requests

from ..models import PlanOut, WeatherData

_PROMPT_TEMPLATE = """You are an intelligent daily planning assistant.

You are given:
1) A list of user plans with time and description
2) Weather conditions for the day

Your tasks:
- Check if plans are suitable based on weather
- Suggest improvements or replacements if needed
- Warn about uncomfortable or dangerous conditions
- Optimize the schedule if possible

Rules:
- Keep response short (5-8 lines)
- Be practical and actionable
- Avoid generic advice
- If everything is fine, clearly confirm it

Context:

Date: {date}

Plans:
{plans}

Weather:
{weather}

Conversation history:
{message}

Now provide your recommendation.
"""


def _format_plans(plans: List[PlanOut]) -> str:
    if not plans:
        return "- No plans"
    lines = []
    for plan in plans:
        plan_type = f" ({plan.type})" if plan.type else ""
        lines.append(f"- {plan.time} {plan.title}{plan_type}")
    return "\n".join(lines)


def _format_weather(weather: WeatherData) -> str:
    return (
        f"City: {weather.city}\n"
        f"Temperature: {weather.temperature_c:.1f} C\n"
        f"Description: {weather.description}"
    )


def get_recommendation(
    date: str,
    plans: List[PlanOut],
    weather: WeatherData,
    message: str | None,
) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set")

    user_note = message.strip() if message else "- None"

    prompt = _PROMPT_TEMPLATE.format(
        date=date,
        plans=_format_plans(plans),
        weather=_format_weather(weather),
        message=user_note,
    )

    url = (
        "https://generativelanguage.googleapis.com/v1beta/"
        "models/gemini-2.5-flash:generateContent"
    )
    response = requests.post(
        f"{url}?key={api_key}",
        json={
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.4, "maxOutputTokens": 256},
        },
        timeout=15,
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        try:
            error_payload = response.json()
            error_message = error_payload.get("error", {}).get("message")
        except (ValueError, TypeError):
            error_message = None
        raise ValueError(error_message or "Gemini request failed") from exc

    payload = response.json()

    try:
        return payload["candidates"][0]["content"]["parts"][0]["text"].strip()
    except (KeyError, IndexError, TypeError) as exc:
        raise ValueError("Unexpected Gemini response format") from exc
