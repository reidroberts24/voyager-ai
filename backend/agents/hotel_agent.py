import asyncio
from datetime import date
from typing import Any

from backend.agents.base import Agent
from backend.config import settings
from backend.models.hotels import HotelOption

FALLBACK_PROMPT = """\
You are a lodging search assistant. Given trip details and budget constraints, generate realistic lodging options.
Return a JSON array of 5 options. Each option has this structure:
{
  "name": "Hotel/Hostel/Property Name",
  "address": "123 Main St, City",
  "rating": 4.5,
  "price_per_night_usd": 150.00,
  "total_price_usd": 750.00,
  "amenities": ["wifi", "pool", "breakfast"],
  "booking_url": null,
  "distance_to_center_km": 1.2
}
IMPORTANT: Respect the hotel budget constraint strictly. Total cost MUST be within budget.
Provide a range of options within the budget — from the cheapest viable option to the best value at the budget cap.
Use realistic names, prices, and amenities for the destination.
If a lodging type is specified (hotel, hostel, Airbnb/vacation rental, etc.), tailor all suggestions to that type.
If preferred brands are specified (e.g., Marriott, Hilton), prioritize those brands."""


class HotelAgent(Agent):
    async def run(self, context: dict[str, Any]) -> list[HotelOption]:
        budget = self._get_hotel_budget(context)
        min_results = 5

        api_results: list[HotelOption] = []
        if settings.amadeus_client_id and settings.amadeus_client_secret:
            api_results = await self._search_api(context)
            if budget and api_results:
                under_budget = [h for h in api_results if h.total_price_usd <= budget]
                if under_budget:
                    api_results = under_budget
                else:
                    api_results.sort(key=lambda h: h.total_price_usd)
                    api_results = api_results[:min_results]

        # If API returned enough results, use them
        if len(api_results) >= min_results:
            return api_results

        # Otherwise, supplement with LLM-generated options
        llm_results = await self._search_llm(context)

        # Merge: API results first, then fill with LLM results (avoid name dupes)
        combined = list(api_results)
        api_names = {h.name.lower() for h in api_results}
        for h in llm_results:
            if h.name.lower() not in api_names:
                combined.append(h)
            if len(combined) >= max(min_results, len(api_results)):
                break

        return combined or llm_results

    async def _search_api(self, context: dict) -> list[HotelOption]:
        from backend.apis.hotels import HotelAPI

        api = HotelAPI()
        city_code = context["destination_code"][:3]
        check_in = str(context["departure_date"])
        check_out = str(context.get("return_date") or context["departure_date"])

        return await asyncio.to_thread(
            api.search,
            city_code=city_code,
            check_in=check_in,
            check_out=check_out,
            adults=context.get("travelers", 1),
        )

    async def _search_llm(self, context: dict) -> list[HotelOption]:
        nights = self._calc_nights(context)
        budget = self._get_hotel_budget(context)
        priority = self._get_priority_notes(context)

        user_msg = (
            f"Find lodging in {context['destination']} "
            f"for {nights or 'several'} nights. "
            f"Travelers: {context.get('travelers', 1)}."
        )
        if context.get("lodging_type"):
            user_msg += f" Lodging type: {context['lodging_type']}."
        if context.get("preferred_hotel_brands"):
            user_msg += f" Preferred brands: {', '.join(context['preferred_hotel_brands'])}."
        if budget:
            per_night = budget / nights if nights else budget
            user_msg += (
                f" Lodging budget: ${budget} total (${per_night:.0f}/night max)."
            )
        if priority:
            user_msg += f" Budget philosophy: {priority}"
        if context.get("interests"):
            user_msg += f" Interests: {', '.join(context['interests'])}."

        data = await self.llm.complete_json(FALLBACK_PROMPT, user_msg)
        options = data if isinstance(data, list) else data.get("hotels", [])
        return [HotelOption(**h) for h in options]

    @staticmethod
    def _calc_nights(context: dict) -> int:
        if context.get("return_date") and context.get("departure_date"):
            dep = date.fromisoformat(str(context["departure_date"]))
            ret = date.fromisoformat(str(context["return_date"]))
            return (ret - dep).days
        return 0

    @staticmethod
    def _get_hotel_budget(context: dict) -> float | None:
        alloc = context.get("budget_allocation")
        if alloc and isinstance(alloc, dict):
            return alloc.get("hotels_max_usd")
        return None

    @staticmethod
    def _get_priority_notes(context: dict) -> str:
        alloc = context.get("budget_allocation")
        if alloc and isinstance(alloc, dict):
            return alloc.get("priority_notes", "")
        return ""
