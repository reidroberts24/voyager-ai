import asyncio
from typing import Any

from backend.agents.base import Agent
from backend.config import settings
from backend.models.flights import FlightOption

FALLBACK_PROMPT = """\
You are a flight search assistant. Given trip details and budget constraints, generate realistic flight options.
Return a JSON array of 5 flight options. Each option has this structure:
{
  "legs": [
    {
      "departure_airport": "SFO",
      "arrival_airport": "NRT",
      "departure_time": "2026-03-15T10:30:00",
      "arrival_time": "2026-03-16T14:30:00",
      "airline": "United Airlines",
      "flight_number": "UA837",
      "duration_minutes": 660
    }
  ],
  "total_price_usd": 1700.00,
  "currency": "USD",
  "stops": 0,
  "total_duration_minutes": 1320,
  "outbound_duration_minutes": 660,
  "return_duration_minutes": 660,
  "outbound_stops": 0,
  "return_stops": 0,
  "outbound_leg_count": 1,
  "booking_url": null
}
Include both outbound and return legs if a return date is provided (set outbound_leg_count to the number of outbound legs).
For one-way trips, omit return fields (return_duration_minutes, return_stops).
Use realistic airlines, prices, and flight times for the route.
If preferred airlines are specified, prioritize those carriers.
IMPORTANT: total_price_usd must be the TOTAL cost for ALL travelers (not per person). For example, if the fare is $850/person and there are 2 travelers, total_price_usd should be 1700.
Respect the flight budget constraint. All options should be at or under the max flight budget if one is specified."""


class FlightAgent(Agent):
    async def run(self, context: dict[str, Any]) -> list[FlightOption]:
        budget = self._get_flight_budget(context)

        # Try real API first
        if settings.amadeus_client_id and settings.amadeus_client_secret:
            results = await self._search_api(context)
            if results:
                # Filter by preferred airlines (soft — keep all if no matches)
                preferred = context.get("preferred_airlines", [])
                if preferred:
                    preferred_lower = [a.lower() for a in preferred]
                    filtered = [
                        f for f in results
                        if any(
                            leg.airline.lower() in preferred_lower
                            or any(p in leg.airline.lower() for p in preferred_lower)
                            for leg in f.legs
                        )
                    ]
                    if filtered:
                        results = filtered

                # Filter by budget if specified
                if budget:
                    under_budget = [f for f in results if f.total_price_usd <= budget]
                    if under_budget:
                        results = under_budget
                    else:
                        results.sort(key=lambda f: f.total_price_usd)
                        return results[:5]
                return results

        return await self._search_llm(context)

    async def _search_api(self, context: dict) -> list[FlightOption]:
        from backend.apis.flights import FlightAPI

        api = FlightAPI()

        # For one-way trips, don't pass return_date
        return_date = None
        if context.get("trip_type", "round_trip") == "round_trip" and context.get("return_date"):
            return_date = str(context["return_date"])

        return await asyncio.to_thread(
            api.search,
            origin=context["origin_code"],
            destination=context["destination_code"],
            departure_date=str(context["departure_date"]),
            return_date=return_date,
            adults=context.get("travelers", 1),
        )

    async def _search_llm(self, context: dict) -> list[FlightOption]:
        budget = self._get_flight_budget(context)

        user_msg = (
            f"Find flights from {context['origin']} ({context['origin_code']}) "
            f"to {context['destination']} ({context['destination_code']}). "
            f"Departure: {context['departure_date']}. "
        )
        if context.get("trip_type") == "one_way":
            user_msg += "One-way trip only (no return flight). "
        elif context.get("return_date"):
            user_msg += f"Return: {context['return_date']}. "
        user_msg += f"Travelers: {context.get('travelers', 1)}."
        if context.get("preferred_airlines"):
            user_msg += f" Preferred airlines: {', '.join(context['preferred_airlines'])}."
        if budget:
            user_msg += f" Flight budget: ${budget} max."
        elif context.get("budget_usd"):
            user_msg += f" Total trip budget: ${context['budget_usd']}."

        data = await self.llm.complete_json(FALLBACK_PROMPT, user_msg)
        options = data if isinstance(data, list) else data.get("flights", [])
        travelers = context.get("travelers", 1)
        return [FlightOption(**f, travelers=travelers) for f in options]

    @staticmethod
    def _get_flight_budget(context: dict) -> float | None:
        alloc = context.get("budget_allocation")
        if alloc and isinstance(alloc, dict):
            return alloc.get("flights_max_usd")
        return None
