import asyncio
import json
from datetime import date, datetime
from typing import Any, Callable

from travel_agent.agents.activity_agent import ActivityAgent
from travel_agent.agents.destination_agent import DestinationAgent
from travel_agent.agents.flight_agent import FlightAgent
from travel_agent.agents.hotel_agent import HotelAgent
from travel_agent.agents.weather_agent import WeatherAgent
from travel_agent.llm.router import get_provider
from travel_agent.models.destination import DestinationInfo
from travel_agent.models.itinerary import DayPlan, Itinerary
from travel_agent.models.flights import FlightLeg, FlightOption
from travel_agent.models.hotels import CityHotels, HotelOption
from travel_agent.models.trip import CityStay, PreBookedFlight, PreBookedHotel, TripRequest

GATHER_SYSTEM_PROMPT = """\
You are a friendly, knowledgeable travel planning assistant having a natural conversation to learn about someone's trip.
You will receive the conversation so far between you and the user.

YOUR PERSONALITY:
- Be warm and genuinely enthusiastic about their trip — react to their destination, share brief relevant knowledge
- Vary your tone and phrasing every time — never repeat the same sentence structure twice in a conversation
- Weave questions naturally into your responses rather than presenting them as a checklist
- When the user shares something exciting, respond to it before moving to the next question
- Use varied transitions: sometimes ask directly, sometimes share a tip that leads into a question, sometimes offer options
- Mirror the user's communication style — if they're brief, be concise; if they're chatty, match that energy

INFORMATION YOU NEED (gather naturally, not as a rigid list):
Required — you must have ALL of these before setting ready to true:
  1. Specific destination CITY (not just a country)
  2. Origin city (where they're traveling from)
  3. Travel dates or timeframe
  4. Number of travelers
  5. Total budget
  6. Budget priorities (what categories matter most to them)

Also gather when it flows naturally:
  - Whether they've already booked flights or hotels (ask this once you know destination and dates)
    - If yes to flights: airline, airports, dates, time if known, price if known
    - If yes to hotels: hotel name, city, check-in/check-out, price if known
  - Round-trip or one-way
  - Airline preferences or frequent flyer programs
  - Lodging type (hotel, Airbnb, hostel, etc.)
  - Preferred hotel brands
  - For Europe/rail-friendly Asia: openness to train travel

MULTI-CITY: If they mention multiple cities, work out which are overnight vs day-trip destinations and approximate night splits.

HOW TO ASK QUESTIONS:
- Combine 1-2 questions max per message — never present a list of questions
- Infer what you can (e.g. "my wife and I" = 2 travelers, don't ask again)
- If they give a country, suggest specific cities and ask which appeal to them
- Adapt your question order based on what the user has already shared — don't follow a fixed sequence
- Sometimes lead with a relevant observation: "June is a great time for the Amalfi Coast — the weather's perfect and it's just before peak crowds. What's your budget looking like for the trip?"
- Sometimes bundle related topics: "Are you thinking round-trip, and have you already booked your flights or should I search for those too?"
- For budget: accept any form — specific caps, relative priorities, general philosophy, or "balance it evenly"

WHEN READY:
Set "ready" to true and give a brief, natural confirmation summarizing the trip plan. Vary the format — don't always use the same template. Examples:
- "Perfect — I've got everything I need! Let me search for the best options for your 5-day Rome trip..."
- "Sounds like an amazing trip! Two weeks across Italy for $5000, focusing on food and experiences. Let me put together some options..."
- "Love it — Amalfi Coast and Rome with your wife, June 21-July 5, keeping hotels moderate so you can splurge on dining. On it!"

Return a JSON object with this structure:
{
  "ready": false,
  "message": "Your conversational response",
  "collected": {
    "destination": "value or null",
    "origin": "value or null",
    "dates": "value or null",
    "travelers": "value or null",
    "budget": "value or null",
    "budget_priorities": "value or null",
    "interests": "value or null",
    "trip_type": "round_trip or one_way, default round_trip",
    "preferred_airlines": "value or null",
    "lodging_type": "value or null",
    "preferred_hotel_brands": "value or null",
    "transit_preferences": "value or null",
    "prebooked_flights": "value or null",
    "prebooked_hotels": "value or null"
  }
}"""

PARSE_SYSTEM_PROMPT = """\
You are a travel planning assistant. Extract structured trip details from the conversation.
Return a JSON object with these fields:
{
  "origin": "San Francisco",
  "origin_code": "SFO",
  "destination": "Tokyo",
  "destination_code": "NRT",
  "departure_date": "2026-03-15",
  "return_date": "2026-03-20",
  "travelers": 1,
  "budget_usd": 5000,
  "budget_allocation": {
    "total_usd": 5000,
    "flights_max_usd": 1200,
    "hotels_max_usd": 800,
    "activities_max_usd": 1500,
    "food_max_usd": 1000,
    "priority_notes": "Prioritize activities and food over hotels"
  },
  "interests": ["food", "temples"],
  "preferences": "",
  "preferred_airlines": ["United", "ANA"],
  "trip_type": "round_trip",
  "lodging_type": "hotel",
  "preferred_hotel_brands": ["Marriott"],
  "transit_preferences": "open to rail travel",
  "prebooked_flights": [
    {"airline": "United", "departure_airport": "SFO", "arrival_airport": "NRT", "departure_date": "2026-03-15", "departure_time": "11:30", "return_date": "2026-03-20", "return_departure_time": "14:00", "price_paid_usd": 900}
  ],
  "prebooked_hotels": [
    {"name": "Park Hyatt Tokyo", "city": "Tokyo", "check_in": "2026-03-15", "check_out": "2026-03-20", "total_price_usd": 1500}
  ],
  "city_stays": [
    {"city": "Rome", "city_code": "FCO", "check_in": "2026-03-15", "check_out": "2026-03-19", "nights": 4, "is_day_trip": false},
    {"city": "Florence", "city_code": "FLR", "check_in": "2026-03-19", "check_out": "2026-03-22", "nights": 3, "is_day_trip": false},
    {"city": "Pisa", "city_code": "PSA", "check_in": "2026-03-20", "check_out": "2026-03-20", "nights": 0, "is_day_trip": true}
  ]
}
Rules:
- Use the most common IATA airport code for each city.
- If multiple cities are mentioned as destinations, use the first/primary city for the airport code.
- If no return date is given, assume the trip length mentioned (e.g. "5 days") and calculate it.
- If no departure date is given, assume 1 month from today.
- If no number of travelers is given, assume 1.
- Extract interests from mentions of activities, cuisines, landmarks, etc.
- Put any other preferences in the "preferences" field.
- For budget_allocation: distribute the total budget across categories based on user preferences.
  - If the user gave specific caps (e.g. "no more than $1000 on hotels"), use those.
  - If the user gave relative priorities (e.g. "spend more on food"), allocate proportionally.
  - If the user said "balance evenly" or had no preference, split reasonably.
  - Set any field to null if the user didn't mention or imply a limit for that category.
  - Always include priority_notes summarizing the user's budget philosophy in their own words.
- budget_usd should match budget_allocation.total_usd.
- If no trip_type is mentioned, default to "round_trip".
- If user says "one-way" or "no return", set trip_type to "one_way" and return_date to null.
- If user mentions airline preferences or frequent flyer programs, list them in preferred_airlines.
- Extract lodging type preference (hotel, hostel, airbnb, vacation rental) into lodging_type. Default to "".
- Extract preferred hotel brands/chains into preferred_hotel_brands. Default to [].
- Extract transit/transportation preferences into transit_preferences (e.g. "open to rail travel"). Default to "".
- MULTI-CITY TRIPS: If the user mentions multiple cities where they will stay overnight, populate "city_stays":
  - One entry per city (both overnight stays and day-trip destinations).
  - For overnight stays: set is_day_trip to false, nights > 0, and check_in/check_out to the dates for that city.
  - For day trips (cities within ~1-2 hours of an overnight base): set is_day_trip to true, nights to 0, and check_in/check_out to the same date.
  - Determine day-trip vs overnight based on geographic proximity. Examples: Positano from Amalfi = day trip; Tivoli from Rome = day trip; Florence from Rome = separate overnight stay.
  - The sum of all overnight nights must equal the total trip nights (departure_date to return_date).
  - Distribute nights intelligently: major cities with more attractions get more nights.
  - check_out of one city should equal check_in of the next (sequential stays, no gaps).
  - Use the nearest IATA airport/station code for each city.
  - Keep "destination" and "destination_code" set to the primary/arrival city.
  - If only one city is mentioned, leave "city_stays" as an empty array [].
- PRE-BOOKED ITEMS:
  - If the user mentioned they already booked a flight, populate prebooked_flights with airline, airports, dates, time, and price if known.
  - If the user mentioned they already booked a hotel, populate prebooked_hotels with name, city, dates, and price if known.
  - If the user said "no" or didn't mention pre-bookings, leave as empty arrays []."""

ITINERARY_SYSTEM_PROMPT = """\
You are an expert travel planner creating a detailed day-by-day itinerary.
You will receive:
1. The trip request (destination, dates, budget with allocation preferences, interests)
2. Flight options
3. Hotel options
4. Suggested activities
5. Weather forecast
6. Destination info

Create a cohesive itinerary that:
- STRICTLY respects the user's total budget and category allocations
- If the user set a max for hotels/flights/activities/food, do NOT exceed those caps
- Honor the user's budget_allocation.priority_notes — if they said "splurge on food", plan premium dining; if they said "save on hotels", pick budget options
- Recommends the best flight and hotel with brief reasoning tied to budget priorities
- Plans each day with morning, afternoon, and evening activities
- Accounts for weather (indoor activities on rainy days)
- Distributes activities logically by location to minimize travel time
- Includes practical tips
- Calculate budget_breakdown using ACTUAL PRICES from the provided flight and hotel options:
  - Use the mid-range option (option 3 of 5) as the assumed selection for both flights and hotels
  - For multi-city hotels, sum the mid-range (3rd) option's total_price_usd from each city's hotel list
  - For flights, use the mid-range (3rd) option's total_price_usd
  - For activities, sum the estimated_cost_usd from all day plans
  - For food, estimate based on destination and number of days/travelers
  - Show realistic totals derived from the actual search results — never approximate when real prices are available

PRE-BOOKED ITEMS: If prebooked_flights or prebooked_hotels is true in the trip data, the flight/hotel
options provided are already confirmed bookings. Do NOT suggest alternatives for those — plan around them.
Deduct their cost from the budget and allocate the remaining budget to other categories.

WEATHER FORECAST CONFIDENCE: Weather entries include a "source" field.
- Entries with source "api" are real-time forecasts — plan confidently around them.
- If no weather forecast data is provided for a given day, assume pleasant/clear weather for the primary plan. Do NOT guess or estimate weather. Set the day's weather field to something like "Forecast unavailable — plan assumes clear weather".

WEATHER CONTINGENCY: For each day, provide a rain contingency plan:
- Always plan the primary activities assuming good/clear weather (outdoor activities are fine as the default)
- Always set alt_weather_note to "If it rains:" and provide indoor/covered alternatives in alt_morning, alt_afternoon, alt_evening
- The alternative should cover the same area/neighborhood when possible
- Do NOT use "If weather clears up:" or any other contingency variant — always assume clear weather as the baseline with rain as the only contingency

MULTI-CITY TRIPS: If hotels_by_city is provided (grouped by city), the trip spans multiple cities:
- Reference city-specific hotels when planning days in each city
- Plan inter-city travel days (check out of one hotel, travel to next city, check in)
- Mention which city's hotel the traveler is staying at for each day
- For day-trip destinations, plan a day trip from the overnight base city

RAIL TRAVEL: If the destination is in Europe or rail-friendly Asia (Japan, South Korea, Taiwan, China) and the user's transit_preferences suggest openness to rail:
- In practical_tips, suggest specific rail alternatives with routes, journey times, and estimated costs
- Mention relevant rail passes (Eurail, Japan Rail Pass, etc.) and whether they'd save money
- For multi-city trips, compare rail vs. flying for inter-city travel
- Even without explicit transit_preferences, add a practical tip about rail options if the destination is well-served by rail

Return a JSON object matching this structure:
{
  "title": "5 Days in Tokyo",
  "destination": "Tokyo",
  "date_range": "March 15-20, 2026",
  "destination_summary": "Markdown overview of the destination...",
  "days": [
    {
      "number": 1,
      "date": "2026-03-15",
      "title": "Arrival & First Impressions",
      "weather": "Sunny, 18°C",
      "morning": "Description of morning plans...",
      "afternoon": "Description of afternoon plans...",
      "evening": "Description of evening plans...",
      "estimated_cost_usd": 120,
      "alt_weather_note": "If it rains:",
      "alt_morning": "Alternative morning indoor activity...",
      "alt_afternoon": "Alternative afternoon indoor activity...",
      "alt_evening": "Alternative evening plan..."
    }
  ],
  "budget_breakdown": {
    "flights": 800,
    "hotels": 600,
    "activities": 400,
    "food": 500,
    "transportation": 200,
    "miscellaneous": 100
  },
  "practical_tips": ["Tip 1", "Tip 2"]
}"""

REFINE_SYSTEM_PROMPT = """\
You are an expert travel planner refining an existing itinerary based on user feedback.
You will receive the current itinerary as JSON and a user modification request.

Apply the requested changes while keeping everything else intact.

CAPABILITIES — handle these types of requests:
- Move activities: "Move the temple visit to Day 4 morning" → remove from current slot, place in target, shift displaced activities logically
- Swap activities: "Replace the museum with a cooking class" → substitute the activity, update cost
- Remove activities: "Drop the shopping trip on Day 3" → remove it and fill the gap with a suitable alternative that fits the day's theme/location
- Add activities: "Add a sushi-making class on Day 2" → find a slot, adjust schedule
- Tone adjustments: "Make Day 5 more relaxed" → reduce activity density, add free time, suggest casual options
- Budget changes: "I want cheaper restaurants" → adjust food choices across all days, update budget_breakdown
- Reorder days: "Swap Day 2 and Day 4" → exchange the full day plans, keeping dates correct
- Time slot changes: "I want mornings free for sleeping in" → shift morning activities to afternoon, plan light mornings

RULES:
- Return the FULL updated itinerary JSON in the same structure as the original.
- Only change what the user asked for — preserve all other details.
- When moving/removing activities, ensure no time slot is left empty. Fill gaps with contextually appropriate activities.
- When shifting activities between days, account for geographic proximity (don't plan activities far apart on the same day).
- Update estimated_cost_usd for any day whose activities changed.
- Update budget_breakdown if costs changed meaningfully.
- Preserve alt weather plans (alt_morning, alt_afternoon, alt_evening, alt_weather_note) unless the user specifically asks to change them.
- If you change a primary activity, update the corresponding alt field to remain a sensible alternative."""

SUGGEST_SYSTEM_PROMPT = """\
You are an expert travel planner. The user wants alternatives for part of their itinerary.
You will receive the current itinerary as JSON and the user's request.

Analyze what the user wants to change and suggest exactly 3 alternatives.

Return a JSON object:
{
  "target_description": "Brief description of what's being replaced (e.g., 'Day 3 afternoon: Tsukiji Market tour')",
  "day_number": 3,
  "time_slot": "afternoon",
  "suggestions": [
    {
      "id": 1,
      "name": "Short activity name",
      "description": "2-3 sentence description with why it's a good fit",
      "estimated_cost_usd": 50
    },
    {
      "id": 2,
      "name": "...",
      "description": "...",
      "estimated_cost_usd": 30
    },
    {
      "id": 3,
      "name": "...",
      "description": "...",
      "estimated_cost_usd": 45
    }
  ]
}

Make suggestions that:
- Fit the same time slot and location/neighborhood as the original activity
- Are diverse (different types of experiences — e.g. cultural, culinary, outdoor)
- Are NOT already mentioned anywhere else in the itinerary
- Respect the trip's overall budget and interests
- Account for weather conditions on that day
- Include realistic cost estimates"""

CLASSIFY_REFINEMENT_PROMPT = """\
Classify the user's itinerary modification request into one of two modes.

Return JSON: {"mode": "direct"} or {"mode": "suggest"}

"direct" — The user knows exactly what they want:
- "Move the temple visit to the morning"
- "Add a sushi dinner on Day 2"
- "Make Day 5 more relaxed"
- "Replace the museum with a cooking class"

"suggest" — The user wants to change something but needs suggestions/options:
- "I don't want to do X on Day 3"
- "What else could I do Day 2 afternoon?"
- "Suggest alternatives for the museum visit"
- "I'm not feeling the Day 4 plan, what are my options?"
- "Replace the hiking, not sure with what"
"""

# Keyword patterns that clearly indicate suggestion mode (skip LLM classification)
_SUGGEST_PATTERNS = [
    "what else", "alternatives", "options", "suggest", "not sure what",
    "don't want to do", "don't like", "not feeling", "what are my",
    "other ideas", "something else", "any other", "recommendations",
]

# Type for progress callbacks
ProgressCallback = Callable[[str, str], None]  # (agent_name, status)


class Orchestrator:
    def __init__(self, on_progress: ProgressCallback | None = None):
        self._on_progress = on_progress or (lambda *_: None)

    def _report(self, agent: str, status: str):
        self._on_progress(agent, status)

    async def gather_details(
        self, conversation: list[dict[str, str]]
    ) -> dict:
        """Analyze conversation and return either questions or readiness signal.

        Args:
            conversation: List of {"role": "user"/"assistant", "content": "..."} dicts.

        Returns:
            {"ready": bool, "message": str, "collected": dict}
        """
        planning_llm = get_provider("planning")
        today = date.today().isoformat()

        convo_text = f"Today's date: {today}\n\nConversation so far:\n"
        for msg in conversation:
            role = "User" if msg["role"] == "user" else "Assistant"
            convo_text += f"{role}: {msg['content']}\n"

        return await planning_llm.complete_json(GATHER_SYSTEM_PROMPT, convo_text)

    async def plan_trip(self, conversation: list[dict[str, str]]) -> Itinerary:
        """Full pipeline: parse conversation -> dispatch agents -> assemble itinerary."""
        # Step 1: Parse the full conversation into a structured request
        self._report("Planner", "Parsing your trip request...")
        planning_llm = get_provider("planning")
        trip_request = await self._parse_input(planning_llm, conversation)
        date_range = f"{trip_request.departure_date} to {trip_request.return_date}" if trip_request.return_date else f"{trip_request.departure_date} (one-way)"
        self._report("Planner", f"Got it — {trip_request.destination}, {date_range}")

        # Step 2: Dispatch agents in parallel with error isolation
        research_llm = get_provider("research")
        context = trip_request.to_context_dict()

        agent_tasks: dict[str, Any] = {}

        # Skip flight/hotel agents if user already booked them
        if not trip_request.prebooked_flights:
            agent_tasks["Flights"] = FlightAgent(research_llm).run(context)
        else:
            self._report("Flights", "Using your pre-booked flight")

        if not trip_request.prebooked_hotels:
            agent_tasks["Hotels"] = self._dispatch_hotels(research_llm, trip_request, context)
        else:
            self._report("Hotels", "Using your pre-booked hotel(s)")

        agent_tasks["Activities"] = ActivityAgent(research_llm).run(context)
        agent_tasks["Weather"] = WeatherAgent(research_llm).run(context)
        agent_tasks["Destination"] = DestinationAgent(research_llm).run(context)

        self._report("Agents", "Researching...")
        results = await self._run_agents(agent_tasks)

        # Use pre-booked items or agent results
        if trip_request.prebooked_flights:
            flights = self._prebooked_to_flight_options(trip_request)
        else:
            flights = results.get("Flights", [])

        if trip_request.prebooked_hotels:
            hotels = self._prebooked_to_hotel_options(trip_request)
        else:
            hotels = results.get("Hotels", [])
        activities = results.get("Activities", [])
        weather = results.get("Weather", [])
        dest_info = results.get("Destination")

        # Step 3: Assemble itinerary
        self._report("Writer", "Assembling your itinerary...")
        writing_llm = get_provider("writing")
        itinerary = await self._assemble_itinerary(
            writing_llm, trip_request, flights, hotels, activities, weather, dest_info
        )
        self._report("Writer", "Done!")
        return itinerary

    async def _run_agents(self, agent_tasks: dict[str, Any]) -> dict[str, Any]:
        """Run all agents in parallel, catching individual failures."""
        results = {}

        async def _safe_run(name: str, coro):
            try:
                result = await coro
                self._report(name, "Done")
                return name, result
            except Exception as e:
                self._report(name, f"Failed ({type(e).__name__}), skipping")
                return name, self._default_for(name)

        tasks = [_safe_run(name, coro) for name, coro in agent_tasks.items()]
        for name, result in await asyncio.gather(*tasks):
            results[name] = result

        return results

    @staticmethod
    def _default_for(agent_name: str):
        """Return a safe default when an agent fails."""
        if agent_name == "Destination":
            return None
        return []

    async def _dispatch_hotels(self, llm, trip_request: TripRequest, context: dict):
        """Dispatch hotel searches — one per overnight city, or single for simple trips."""
        if not trip_request.city_stays:
            return await HotelAgent(llm).run(context)

        overnight_stays = [cs for cs in trip_request.city_stays if not cs.is_day_trip]
        if not overnight_stays:
            return await HotelAgent(llm).run(context)

        async def _search_city(stay: CityStay):
            city_context = dict(context)
            city_context["destination"] = stay.city
            city_context["destination_code"] = stay.city_code
            city_context["departure_date"] = str(stay.check_in)
            city_context["return_date"] = str(stay.check_out)
            # Proportionally split hotel budget by nights
            alloc = city_context.get("budget_allocation")
            if alloc and isinstance(alloc, dict) and alloc.get("hotels_max_usd"):
                total_nights = sum(cs.nights for cs in overnight_stays)
                if total_nights > 0:
                    alloc = dict(alloc)
                    alloc["hotels_max_usd"] = round(
                        alloc["hotels_max_usd"] * stay.nights / total_nights, 2
                    )
                    city_context["budget_allocation"] = alloc

            self._report("Hotels", f"Searching {stay.city}...")
            results = await HotelAgent(llm).run(city_context)
            for h in results:
                h.city = stay.city
                h.check_in = str(stay.check_in)
                h.check_out = str(stay.check_out)
                h.nights = stay.nights
            return results

        all_results = await asyncio.gather(*[_search_city(s) for s in overnight_stays])
        return [hotel for city_results in all_results for hotel in city_results]

    @staticmethod
    def _prebooked_to_flight_options(trip_request: TripRequest) -> list[FlightOption]:
        """Convert pre-booked flights into FlightOption objects."""
        options = []
        for pb in trip_request.prebooked_flights:
            dep_time = pb.departure_time or "00:00"
            dep_dt = datetime.fromisoformat(f"{pb.departure_date}T{dep_time}:00")
            arr_dt = dep_dt  # Approximate — actual arrival unknown

            legs = [FlightLeg(
                departure_airport=pb.departure_airport,
                arrival_airport=pb.arrival_airport,
                departure_time=dep_dt,
                arrival_time=arr_dt,
                airline=pb.airline,
                flight_number="",
                duration_minutes=0,
            )]
            outbound_leg_count = 1
            total_duration = 0

            # Add return leg if round trip
            if pb.return_date:
                ret_time = pb.return_departure_time or "00:00"
                ret_dt = datetime.fromisoformat(f"{pb.return_date}T{ret_time}:00")
                legs.append(FlightLeg(
                    departure_airport=pb.arrival_airport,
                    arrival_airport=pb.departure_airport,
                    departure_time=ret_dt,
                    arrival_time=ret_dt,
                    airline=pb.airline,
                    flight_number="",
                    duration_minutes=0,
                ))

            options.append(FlightOption(
                legs=legs,
                total_price_usd=pb.price_paid_usd or 0,
                stops=0,
                total_duration_minutes=total_duration,
                outbound_duration_minutes=0,
                return_duration_minutes=0 if pb.return_date else None,
                outbound_stops=0,
                return_stops=0 if pb.return_date else None,
                outbound_leg_count=outbound_leg_count,
                travelers=trip_request.travelers,
            ))
        return options

    @staticmethod
    def _prebooked_to_hotel_options(trip_request: TripRequest) -> list[HotelOption]:
        """Convert pre-booked hotels into HotelOption objects."""
        options = []
        for pb in trip_request.prebooked_hotels:
            nights = (pb.check_out - pb.check_in).days
            total = pb.total_price_usd or (pb.price_per_night_usd or 0) * nights
            per_night = pb.price_per_night_usd or (total / nights if nights > 0 else 0)
            options.append(HotelOption(
                name=pb.name,
                address=pb.city,
                city=pb.city,
                check_in=str(pb.check_in),
                check_out=str(pb.check_out),
                nights=nights,
                price_per_night_usd=per_night,
                total_price_usd=total,
            ))
        return options

    async def _parse_input(self, llm, conversation: list[dict[str, str]]) -> TripRequest:
        today = date.today().isoformat()
        convo_text = f"Today's date: {today}\n\nConversation:\n"
        for msg in conversation:
            role = "User" if msg["role"] == "user" else "Assistant"
            convo_text += f"{role}: {msg['content']}\n"
        data = await llm.complete_json(PARSE_SYSTEM_PROMPT, convo_text)
        return TripRequest(**data)

    async def _assemble_itinerary(
        self, llm, request, flights, hotels, activities, weather, dest_info
    ) -> Itinerary:
        # Build hotels_by_city grouping for multi-city trips
        hotels_by_city: list[CityHotels] = []
        if request.city_stays:
            for stay in request.city_stays:
                if not stay.is_day_trip:
                    city_hotels = [h for h in hotels if h.city == stay.city]
                    hotels_by_city.append(CityHotels(
                        city=stay.city,
                        city_code=stay.city_code,
                        check_in=stay.check_in,
                        check_out=stay.check_out,
                        nights=stay.nights,
                        options=city_hotels,
                    ))

        gathered = {
            "trip_request": request.model_dump(mode="json"),
            "flight_options": [f.model_dump(mode="json") for f in flights],
            "hotel_options": [h.model_dump(mode="json") for h in hotels],
            "activities": [a.model_dump(mode="json") for a in activities],
            "weather_forecast": [w.model_dump(mode="json") for w in weather],
            "destination_info": dest_info.model_dump(mode="json") if dest_info else None,
        }
        if hotels_by_city:
            gathered["hotels_by_city"] = [ch.model_dump(mode="json") for ch in hotels_by_city]
        if request.prebooked_flights:
            gathered["prebooked_flights"] = True
        if request.prebooked_hotels:
            gathered["prebooked_hotels"] = True

        user_msg = (
            "Here is all the gathered travel data. "
            "Create a cohesive day-by-day itinerary.\n\n"
            f"{json.dumps(gathered, indent=2, default=str)}"
        )

        data = await llm.complete_json(ITINERARY_SYSTEM_PROMPT, user_msg, max_tokens=16384)

        return Itinerary(
            title=data.get("title", f"Trip to {request.destination}"),
            destination=request.destination,
            date_range=data.get("date_range", ""),
            destination_summary=data.get("destination_summary", ""),
            flights=flights,
            hotels=hotels,
            hotels_by_city=hotels_by_city,
            activities=activities,
            weather_forecast=weather,
            destination_info=dest_info,
            days=[DayPlan(**d) for d in data.get("days", [])],
            budget_breakdown=data.get("budget_breakdown", {}),
            practical_tips=data.get("practical_tips", []),
        )

    @staticmethod
    def _itinerary_to_refinement_dict(itinerary: Itinerary) -> dict:
        """Serialize itinerary to dict for refinement/suggestion prompts."""
        return {
            "title": itinerary.title,
            "destination": itinerary.destination,
            "date_range": itinerary.date_range,
            "destination_summary": itinerary.destination_summary,
            "flights": [f.model_dump(mode="json") for f in itinerary.flights],
            "hotels": [h.model_dump(mode="json") for h in itinerary.hotels],
            "hotels_by_city": [
                {"city": ch.city, "nights": ch.nights, "options": [h.model_dump(mode="json") for h in ch.options]}
                for ch in itinerary.hotels_by_city
            ],
            "days": [d.model_dump(mode="json") for d in itinerary.days],
            "budget_breakdown": itinerary.budget_breakdown,
            "practical_tips": itinerary.practical_tips,
        }

    async def refine_itinerary(
        self, current_itinerary: Itinerary, user_request: str
    ) -> Itinerary:
        """Modify an existing itinerary based on user feedback."""
        writing_llm = get_provider("writing")
        current_data = self._itinerary_to_refinement_dict(current_itinerary)

        user_msg = (
            f"Current itinerary:\n{json.dumps(current_data, indent=2, default=str)}\n\n"
            f"User request: {user_request}"
        )

        data = await writing_llm.complete_json(REFINE_SYSTEM_PROMPT, user_msg, max_tokens=16384)

        return Itinerary(
            title=data.get("title", current_itinerary.title),
            destination=data.get("destination", current_itinerary.destination),
            date_range=data.get("date_range", current_itinerary.date_range),
            destination_summary=data.get("destination_summary", current_itinerary.destination_summary),
            flights=current_itinerary.flights,
            hotels=current_itinerary.hotels,
            hotels_by_city=current_itinerary.hotels_by_city,
            activities=current_itinerary.activities,
            weather_forecast=current_itinerary.weather_forecast,
            destination_info=current_itinerary.destination_info,
            days=[DayPlan(**d) for d in data.get("days", current_itinerary.days)],
            budget_breakdown=data.get("budget_breakdown", current_itinerary.budget_breakdown),
            practical_tips=data.get("practical_tips", current_itinerary.practical_tips),
        )

    async def classify_refinement(self, user_request: str) -> str:
        """Return 'direct' or 'suggest' based on user intent."""
        # Fast keyword check first
        lower = user_request.lower()
        for pattern in _SUGGEST_PATTERNS:
            if pattern in lower:
                return "suggest"

        # Fall back to LLM classification for ambiguous cases
        try:
            llm = get_provider("planning")
            result = await llm.complete_json(
                CLASSIFY_REFINEMENT_PROMPT,
                f"User message: {user_request}",
            )
            return result.get("mode", "direct")
        except Exception:
            return "direct"

    async def suggest_alternatives(
        self, current_itinerary: Itinerary, user_request: str
    ) -> dict:
        """Return 3 alternative suggestions for part of the itinerary."""
        writing_llm = get_provider("writing")
        current_data = self._itinerary_to_refinement_dict(current_itinerary)

        user_msg = (
            f"Current itinerary:\n{json.dumps(current_data, indent=2, default=str)}\n\n"
            f"User request: {user_request}"
        )

        return await writing_llm.complete_json(SUGGEST_SYSTEM_PROMPT, user_msg)

    async def apply_suggestion(
        self, current_itinerary: Itinerary, suggestion: dict,
        day_number: int, time_slot: str,
    ) -> Itinerary:
        """Apply a chosen suggestion to the itinerary."""
        directive = (
            f"Replace the {time_slot} activity on Day {day_number} with: "
            f"{suggestion['name']} — {suggestion['description']}. "
            f"Estimated cost: ${suggestion.get('estimated_cost_usd', 0)}."
        )
        return await self.refine_itinerary(current_itinerary, directive)
