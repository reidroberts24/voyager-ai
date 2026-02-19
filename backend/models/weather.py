from datetime import date

from pydantic import BaseModel


class DayWeather(BaseModel):
    date: date
    condition: str  # "sunny", "rain", "cloudy", etc.
    temp_high_c: float
    temp_low_c: float
    humidity_pct: int
    rain_probability_pct: int | None = None
    summary: str  # "Warm and sunny, perfect for outdoor activities"
    city: str | None = None
    source: str | None = None  # "api" or "historical_estimate"
