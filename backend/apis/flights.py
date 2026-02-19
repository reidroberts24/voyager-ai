from amadeus import Client, ResponseError

from backend.config import settings
from backend.models.flights import FlightLeg, FlightOption


class FlightAPI:
    def __init__(self):
        self.client = Client(
            client_id=settings.amadeus_client_id,
            client_secret=settings.amadeus_client_secret,
        )

    def search(
        self,
        origin: str,
        destination: str,
        departure_date: str,
        return_date: str | None = None,
        adults: int = 1,
        max_results: int = 5,
    ) -> list[FlightOption]:
        try:
            params = {
                "originLocationCode": origin,
                "destinationLocationCode": destination,
                "departureDate": departure_date,
                "adults": adults,
                "max": max_results,
            }
            if return_date:
                params["returnDate"] = return_date

            response = self.client.shopping.flight_offers_search.get(**params)
            return [self._parse_offer(offer, adults) for offer in response.data]
        except ResponseError:
            return []

    def _parse_offer(self, offer: dict, travelers: int = 1) -> FlightOption:
        legs = []
        itineraries = offer.get("itineraries", [])
        outbound_leg_count = 0

        for idx, itinerary in enumerate(itineraries):
            for segment in itinerary.get("segments", []):
                dep = segment.get("departure", {})
                arr = segment.get("arrival", {})
                legs.append(
                    FlightLeg(
                        departure_airport=dep.get("iataCode", ""),
                        arrival_airport=arr.get("iataCode", ""),
                        departure_time=dep.get("at", ""),
                        arrival_time=arr.get("at", ""),
                        airline=segment.get("carrierCode", ""),
                        flight_number=f"{segment.get('carrierCode', '')}{segment.get('number', '')}",
                        duration_minutes=self._parse_duration(
                            segment.get("duration", "PT0H0M")
                        ),
                    )
                )
            if idx == 0:
                outbound_leg_count = len(legs)

        price_info = offer.get("price", {})
        total_price = float(price_info.get("grandTotal", price_info.get("total", 0)))

        # Per-itinerary durations and stops
        outbound_duration = None
        return_duration = None
        outbound_stops = None
        return_stops = None

        if len(itineraries) >= 1:
            outbound_duration = self._parse_duration(itineraries[0].get("duration", "PT0H0M"))
            outbound_stops = max(0, len(itineraries[0].get("segments", [])) - 1)

        if len(itineraries) >= 2:
            return_duration = self._parse_duration(itineraries[1].get("duration", "PT0H0M"))
            return_stops = max(0, len(itineraries[1].get("segments", [])) - 1)

        # Total stops and duration
        total_segments = sum(len(it.get("segments", [])) for it in itineraries)
        stops = max(0, total_segments - len(itineraries))
        total_duration = sum(
            self._parse_duration(it.get("duration", "PT0H0M"))
            for it in itineraries
        )

        return FlightOption(
            legs=legs,
            total_price_usd=total_price,
            currency=price_info.get("currency", "USD"),
            stops=stops,
            total_duration_minutes=total_duration,
            outbound_duration_minutes=outbound_duration,
            return_duration_minutes=return_duration,
            outbound_stops=outbound_stops,
            return_stops=return_stops,
            outbound_leg_count=outbound_leg_count,
            travelers=travelers,
        )

    @staticmethod
    def _parse_duration(iso_duration: str) -> int:
        """Parse ISO 8601 duration like 'PT11H30M' into minutes."""
        minutes = 0
        iso_duration = iso_duration.replace("PT", "")
        if "H" in iso_duration:
            parts = iso_duration.split("H")
            minutes += int(parts[0]) * 60
            iso_duration = parts[1]
        if "M" in iso_duration:
            minutes += int(iso_duration.replace("M", "") or 0)
        return minutes
