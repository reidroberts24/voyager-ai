from datetime import date

from pydantic import BaseModel

from travel_agent.models.activities import Activity
from travel_agent.models.destination import DestinationInfo
from travel_agent.models.flights import FlightOption
from travel_agent.models.hotels import CityHotels, HotelOption
from travel_agent.models.weather import DayWeather


class DayPlan(BaseModel):
    number: int
    date: date
    title: str  # "Temples and Traditional Tokyo"
    weather: str  # Short weather note
    morning: str  # Activity description
    afternoon: str
    evening: str
    estimated_cost_usd: float | None = None
    alt_weather_note: str | None = None
    alt_morning: str | None = None
    alt_afternoon: str | None = None
    alt_evening: str | None = None


class Itinerary(BaseModel):
    title: str  # "5 Days in Tokyo"
    destination: str
    date_range: str  # "March 15-20, 2026"
    destination_summary: str  # Markdown prose
    flights: list[FlightOption] = []
    hotels: list[HotelOption] = []
    hotels_by_city: list[CityHotels] = []
    activities: list[Activity] = []
    weather_forecast: list[DayWeather] = []
    destination_info: DestinationInfo | None = None
    days: list[DayPlan] = []
    budget_breakdown: dict[str, float] = {}
    practical_tips: list[str] = []

    @property
    def slug(self) -> str:
        d = self.days[0].date if self.days else "unknown"
        return f"trip_{self.destination.lower().replace(' ', '_')}_{d}"
