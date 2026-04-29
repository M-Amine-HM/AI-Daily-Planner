# Weather Planner

Single-page app that combines a daily planner, weather lookup, and AI recommendations.

## Stack

- Backend: FastAPI
- Frontend: React + Vite
- Storage: in-memory (Python dictionary)

## Requirements

- Python 3.10+ (backend)
- Node.js 18+ (frontend)
- API keys for WeatherAPI and Gemini

## Setup

### 1) Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```
WEATHERAPI_KEY=your_weatherapi_key
GEMINI_API_KEY=your_gemini_key
```

Run the API:

```bash
uvicorn app.main:app --reload
```

The API runs on `http://localhost:8000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI runs on `http://localhost:5173`.

If your backend runs on a different host/port, set:

```
VITE_API_BASE=http://localhost:8000
```

## Features

- Calendar view with plan markers
- Plan modal to add/view daily plans
- Weather widget (city lookup)
- AI assistant that analyzes plans + weather

## API Overview

- `GET /api/plans/{date}`: get plans for a date
- `POST /api/plans/{date}`: add a plan
- `GET /api/weather?city=CityName`: fetch weather
- `POST /api/ai/recommendation`: get AI recommendation

## Notes

- Data is stored in memory only and resets on server restart.
- Do not commit your real `.env` file to git.
