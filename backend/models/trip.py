from datetime import date

from pydantic import BaseModel


class CityStay(BaseModel):
    """One leg of a multi-city trip."""
    city: str               # "Rome"
    city_code: str           # IATA code "FCO"
    check_in: date
    check_out: date
    nights: int              # 0 for day trips
    is_day_trip: bool = False


class PreBookedFlight(BaseModel):
    """Flight the user has already booked."""
    airline: str
    departure_airport: str
    arrival_airport: str
    departure_date: date
    departure_time: str = ""       # "14:30" or empty
    return_date: date | None = None
    return_departure_time: str = ""
    price_paid_usd: float | None = None
    notes: str = ""


class PreBookedHotel(BaseModel):
    """Hotel the user has already booked."""
    name: str
    city: str = ""
    check_in: date
    check_out: date
    price_per_night_usd: float | None = None
    total_price_usd: float | None = None
    notes: str = ""


class BudgetAllocation(BaseModel):
    """User's budget preferences for how to distribute spending."""
    total_usd: float
    flights_max_usd: float | None = None
    hotels_max_usd: float | None = None
    activities_max_usd: float | None = None
    food_max_usd: float | None = None
    priority_notes: str = ""  # e.g. "splurge on food, save on hotels"


class TripRequest(BaseModel):
    origin: str
    origin_code: str  # IATA code
    destination: str
    destination_code: str  # IATA code
    departure_date: date
    return_date: date | None = None
    travelers: int = 1
    budget_usd: float | None = None
    budget_allocation: BudgetAllocation | None = None
    interests: list[str] = []
    preferences: str = ""
    preferred_airlines: list[str] = []
    trip_type: str = "round_trip"
    lodging_type: str = ""
    preferred_hotel_brands: list[str] = []
    transit_preferences: str = ""
    city_stays: list[CityStay] = []
    prebooked_flights: list[PreBookedFlight] = []
    prebooked_hotels: list[PreBookedHotel] = []

    def to_context_dict(self) -> dict:
        return self.model_dump(mode="json")
