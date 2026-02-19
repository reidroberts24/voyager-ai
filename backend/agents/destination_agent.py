import asyncio
from typing import Any

from backend.agents.base import Agent
from backend.models.destination import DestinationInfo

ENRICH_PROMPT = """\
You are a travel destination expert. Given partial destination info and a traveler's origin,
fill in the missing fields. Return a JSON object with this structure:
{
  "country": "Japan",
  "city": "Tokyo",
  "currency": "Japanese Yen (JPY)",
  "currency_symbol": "¥",
  "language": "Japanese",
  "timezone": "JST (UTC+9)",
  "visa_info": "US citizens can enter Japan visa-free for up to 90 days for tourism.",
  "useful_tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"],
  "emergency_number": "110 (police), 119 (fire/ambulance)"
}
Provide 4-6 useful tips covering etiquette, transportation, money, and safety.
Visa info should be specific to the traveler's origin country."""

FULL_PROMPT = """\
You are a travel destination expert. Given a destination and traveler's origin,
provide comprehensive practical destination information.
Return a JSON object with this structure:
{
  "country": "Japan",
  "city": "Tokyo",
  "currency": "Japanese Yen (JPY)",
  "currency_symbol": "¥",
  "language": "Japanese",
  "timezone": "JST (UTC+9)",
  "visa_info": "US citizens can enter Japan visa-free for up to 90 days for tourism.",
  "useful_tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"],
  "emergency_number": "110 (police), 119 (fire/ambulance)"
}
Provide 4-6 useful tips covering etiquette, transportation, money, and safety.
Visa info should be specific to the traveler's origin country."""


class DestinationAgent(Agent):
    async def run(self, context: dict[str, Any]) -> DestinationInfo:
        # Always try REST Countries first (free, no key needed)
        base_info = await self._fetch_api(context)

        if base_info:
            # Enrich with LLM (add visa info, tips, etc.)
            return await self._enrich_with_llm(base_info, context)

        # Full LLM fallback
        return await self._fetch_llm(context)

    async def _fetch_api(self, context: dict) -> DestinationInfo | None:
        from backend.apis.destinations import DestinationAPI

        api = DestinationAPI()
        # Try to extract country from destination (e.g. "Tokyo" -> "Japan")
        # We'll let the LLM help us with this in the enrichment step
        # For now, try the destination name directly
        return await asyncio.to_thread(
            api.build_destination_info,
            city=context["destination"],
            country_name=context["destination"],
        )

    async def _enrich_with_llm(
        self, base_info: DestinationInfo, context: dict
    ) -> DestinationInfo:
        user_msg = (
            f"Destination: {context['destination']}. "
            f"Traveler coming from: {context['origin']}. "
            f"Existing info: country={base_info.country}, "
            f"currency={base_info.currency}, language={base_info.language}, "
            f"timezone={base_info.timezone}. "
            f"Please provide visa_info, useful_tips, and emergency_number. "
            f"Keep the existing fields but fix them if they seem wrong."
        )

        data = await self.llm.complete_json(ENRICH_PROMPT, user_msg)
        return DestinationInfo(**data)

    async def _fetch_llm(self, context: dict) -> DestinationInfo:
        user_msg = (
            f"Destination info for {context['destination']}. "
            f"Traveler is coming from {context['origin']}."
        )
        data = await self.llm.complete_json(FULL_PROMPT, user_msg)
        return DestinationInfo(**data)
