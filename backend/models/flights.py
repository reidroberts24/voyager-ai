from datetime import datetime

from pydantic import BaseModel


class FlightLeg(BaseModel):
    departure_airport: str
    arrival_airport: str
    departure_time: datetime
    arrival_time: datetime
    airline: str
    flight_number: str
    duration_minutes: int


class FlightOption(BaseModel):
    legs: list[FlightLeg]
    total_price_usd: float
    currency: str = "USD"
    stops: int
    total_duration_minutes: int
    outbound_duration_minutes: int | None = None
    return_duration_minutes: int | None = None
    outbound_stops: int | None = None
    return_stops: int | None = None
    outbound_leg_count: int | None = None
    travelers: int = 1
    booking_url: str | None = None

    @property
    def price_per_person_usd(self) -> float:
        return self.total_price_usd / self.travelers if self.travelers > 0 else self.total_price_usd

    @property
    def price_display(self) -> str:
        return f"${self.total_price_usd:,.0f}"

    @property
    def price_per_person_display(self) -> str:
        return f"${self.price_per_person_usd:,.0f}/pp"

    @property
    def route(self) -> str:
        codes = [leg.departure_airport for leg in self.legs]
        codes.append(self.legs[-1].arrival_airport)
        return " -> ".join(codes)

    @property
    def outbound_route(self) -> str:
        if self.outbound_leg_count is None:
            return self.route
        out_legs = self.legs[:self.outbound_leg_count]
        if not out_legs:
            return self.route
        codes = [leg.departure_airport for leg in out_legs]
        codes.append(out_legs[-1].arrival_airport)
        return " -> ".join(codes)

    @property
    def return_route(self) -> str:
        if self.outbound_leg_count is None:
            return ""
        ret_legs = self.legs[self.outbound_leg_count:]
        if not ret_legs:
            return ""
        codes = [leg.departure_airport for leg in ret_legs]
        codes.append(ret_legs[-1].arrival_airport)
        return " -> ".join(codes)

    @property
    def duration_display(self) -> str:
        hours, mins = divmod(self.total_duration_minutes, 60)
        return f"{hours}h {mins}m"

    @property
    def outbound_duration_display(self) -> str:
        mins = self.outbound_duration_minutes or self.total_duration_minutes
        hours, m = divmod(mins, 60)
        return f"{hours}h {m}m"

    @property
    def return_duration_display(self) -> str:
        if self.return_duration_minutes is None:
            return ""
        hours, m = divmod(self.return_duration_minutes, 60)
        return f"{hours}h {m}m"

    @property
    def outbound_airlines(self) -> str:
        if self.outbound_leg_count is None:
            airlines = {leg.airline for leg in self.legs}
        else:
            airlines = {leg.airline for leg in self.legs[:self.outbound_leg_count]}
        return ", ".join(sorted(airlines))

    @property
    def return_airlines(self) -> str:
        if self.outbound_leg_count is None:
            return ""
        ret_legs = self.legs[self.outbound_leg_count:]
        if not ret_legs:
            return ""
        airlines = {leg.airline for leg in ret_legs}
        return ", ".join(sorted(airlines))
