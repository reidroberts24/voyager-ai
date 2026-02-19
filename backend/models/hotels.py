from datetime import date

from pydantic import BaseModel


class HotelOption(BaseModel):
    name: str
    address: str
    city: str = ""
    check_in: str = ""
    check_out: str = ""
    nights: int = 0
    rating: float | None = None
    price_per_night_usd: float
    total_price_usd: float
    amenities: list[str] = []
    booking_url: str | None = None
    distance_to_center_km: float | None = None


class CityHotels(BaseModel):
    """Hotel options for one city in a multi-city trip."""
    city: str
    city_code: str
    check_in: date
    check_out: date
    nights: int
    options: list[HotelOption] = []
