from pydantic import BaseModel


class Activity(BaseModel):
    name: str
    category: str  # "temple", "restaurant", "museum", etc.
    description: str
    rating: float | None = None
    price_level: str | None = None  # "$", "$$", "$$$"
    duration_hours: float | None = None
    address: str | None = None
    url: str | None = None
