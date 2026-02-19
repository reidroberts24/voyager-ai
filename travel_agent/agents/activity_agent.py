import asyncio
from datetime import date
from typing import Any

from travel_agent.agents.base import Agent
from travel_agent.config import settings
from travel_agent.models.activities import Activity

FALLBACK_PROMPT = """\
You are a travel activities expert. Given trip details and budget constraints, suggest activities and attractions.
Return a JSON array of 8-12 activities. Each activity has this structure:
{
  "name": "Activity Name",
  "category": "temple",
  "description": "Brief description of the activity",
  "rating": 4.7,
  "price_level": "$$",
  "duration_hours": 2.0,
  "address": "Address if known",
  "url": null
}
Categories include: temple, museum, restaurant, park, market, tour, nightlife, beach, etc.
Tailor suggestions to the traveler's interests and budget priorities.
If an activities budget is specified, suggest a mix that fits within that budget.
Include free/cheap options alongside paid ones. Price levels: "$" (under $20), "$$" ($20-50), "$$$" ($50-100), "$$$$" ($100+)."""


class ActivityAgent(Agent):
    async def run(self, context: dict[str, Any]) -> list[Activity]:
        if settings.tripadvisor_api_key:
            results = await self._search_api(context)
            if results:
                return results

        return await self._search_llm(context)

    async def _search_api(self, context: dict) -> list[Activity]:
        from travel_agent.apis.activities import ActivityAPI

        api = ActivityAPI()
        return await asyncio.to_thread(
            api.search,
            destination=context["destination"],
        )

    async def _search_llm(self, context: dict) -> list[Activity]:
        duration = self._trip_duration(context)
        budget = self._get_activity_budget(context)
        priority = self._get_priority_notes(context)

        user_msg = (
            f"Suggest activities in {context['destination']} "
            f"for a {duration}-day trip. "
        )
        if budget:
            user_msg += f"Activities budget: ${budget} total. "
        if priority:
            user_msg += f"Budget philosophy: {priority}. "
        if context.get("interests"):
            user_msg += f"Interests: {', '.join(context['interests'])}. "
        if context.get("preferences"):
            user_msg += f"Preferences: {context['preferences']}."

        data = await self.llm.complete_json(FALLBACK_PROMPT, user_msg)
        items = data if isinstance(data, list) else data.get("activities", [])
        return [Activity(**a) for a in items]

    @staticmethod
    def _trip_duration(context: dict) -> int:
        if context.get("return_date") and context.get("departure_date"):
            dep = date.fromisoformat(str(context["departure_date"]))
            ret = date.fromisoformat(str(context["return_date"]))
            return (ret - dep).days
        return 5

    @staticmethod
    def _get_activity_budget(context: dict) -> float | None:
        alloc = context.get("budget_allocation")
        if alloc and isinstance(alloc, dict):
            return alloc.get("activities_max_usd")
        return None

    @staticmethod
    def _get_priority_notes(context: dict) -> str:
        alloc = context.get("budget_allocation")
        if alloc and isinstance(alloc, dict):
            return alloc.get("priority_notes", "")
        return ""
