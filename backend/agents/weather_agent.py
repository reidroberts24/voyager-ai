import asyncio
from datetime import date, timedelta
from typing import Any

from backend.agents.base import Agent
from backend.config import settings
from backend.models.weather import DayWeather

FALLBACK_PROMPT = """\
You are a weather forecasting assistant. Given a destination and travel dates,
provide realistic weather forecasts based on historical climate data for that location and time of year.
Return a JSON array with one entry per day. Each entry has this structure:
{
  "date": "2026-03-15",
  "condition": "sunny",
  "temp_high_c": 18.0,
  "temp_low_c": 8.0,
  "humidity_pct": 45,
  "rain_probability_pct": 10,
  "summary": "Clear skies with mild temperatures, great for sightseeing"
}
Conditions: sunny, partly_cloudy, cloudy, rain, thunderstorm, snow, fog.
Base your forecast on typical weather patterns for the location and season."""


def _parse_date(val: Any) -> date | None:
    """Parse a date from a string or date object, returning None on failure."""
    if isinstance(val, date):
        return val
    if isinstance(val, str):
        try:
            return date.fromisoformat(val)
        except ValueError:
            return None
    return None


def _trip_dates(start: date, end: date | None) -> list[date]:
    """Return all dates from start to end inclusive."""
    if not end or end < start:
        return [start]
    return [start + timedelta(days=i) for i in range((end - start).days + 1)]


class WeatherAgent(Agent):
    async def run(self, context: dict[str, Any]) -> list[DayWeather]:
        departure = _parse_date(context.get("departure_date"))
        return_dt = _parse_date(context.get("return_date"))

        # Build list of (city, start_date, end_date) segments to fetch
        segments = self._build_segments(context, departure, return_dt)

        api_results: list[DayWeather] = []
        if settings.openweathermap_api_key:
            api_results = await self._fetch_all_api(segments)

        # Return only API-sourced results (no LLM historical estimates)
        api_results.sort(key=lambda d: (d.date, d.city or ""))
        return api_results

    def _build_segments(
        self,
        context: dict,
        departure: date | None,
        return_dt: date | None,
    ) -> list[tuple[str, date, date]]:
        """Build (city, start, end) segments from city_stays or fallback to single destination."""
        city_stays = context.get("city_stays", [])
        overnight_stays = [
            cs for cs in city_stays
            if not (cs.get("is_day_trip") if isinstance(cs, dict) else getattr(cs, "is_day_trip", False))
        ]

        if overnight_stays:
            segments = []
            for cs in overnight_stays:
                city = cs.get("city") if isinstance(cs, dict) else getattr(cs, "city", None)
                ci = _parse_date(cs.get("check_in") if isinstance(cs, dict) else getattr(cs, "check_in", None))
                co = _parse_date(cs.get("check_out") if isinstance(cs, dict) else getattr(cs, "check_out", None))
                if city and ci:
                    segments.append((city, ci, co or ci))
            if segments:
                return segments

        # Fallback: single destination
        dest = context.get("destination", "Unknown")
        start = departure or date.today()
        end = return_dt or start
        return [(dest, start, end)]

    async def _fetch_all_api(
        self, segments: list[tuple[str, date, date]]
    ) -> list[DayWeather]:
        """Fetch API forecasts for all city segments concurrently."""
        tasks = [self._fetch_api_segment(city, start, end) for city, start, end in segments]
        segment_results = await asyncio.gather(*tasks)
        combined = []
        for results in segment_results:
            combined.extend(results)
        return combined

    async def _fetch_api_segment(
        self, city: str, start: date, end: date
    ) -> list[DayWeather]:
        """Fetch API forecast for one city, filtered to date range, tagged with city and source."""
        from backend.apis.weather import WeatherAPI

        api = WeatherAPI()
        results = await asyncio.to_thread(
            api.get_forecast,
            city=city,
            start_date=start,
            end_date=end,
        )
        for r in results:
            r.city = city
            r.source = "api"
        return results

    def _find_missing_segments(
        self,
        segments: list[tuple[str, date, date]],
        covered: set[tuple[date, str | None]],
    ) -> list[tuple[str, date, date]]:
        """Find contiguous date ranges per city that lack API coverage."""
        missing_segments = []
        for city, seg_start, seg_end in segments:
            missing_dates = [
                d for d in _trip_dates(seg_start, seg_end)
                if (d, city) not in covered
            ]
            if not missing_dates:
                continue
            # Group contiguous missing dates into segments
            run_start = missing_dates[0]
            prev = missing_dates[0]
            for d in missing_dates[1:]:
                if (d - prev).days > 1:
                    missing_segments.append((city, run_start, prev))
                    run_start = d
                prev = d
            missing_segments.append((city, run_start, prev))
        return missing_segments

    async def _fetch_llm_for_segments(
        self,
        segments: list[tuple[str, date, date]],
        context: dict,
    ) -> list[DayWeather]:
        """Fetch LLM-based historical estimates for specific city/date segments."""
        tasks = [
            self._fetch_llm_segment(city, start, end)
            for city, start, end in segments
        ]
        segment_results = await asyncio.gather(*tasks)
        combined = []
        for results in segment_results:
            combined.extend(results)
        return combined

    async def _fetch_llm_segment(
        self, city: str, start: date, end: date
    ) -> list[DayWeather]:
        user_msg = f"Weather forecast for {city} from {start.isoformat()} to {end.isoformat()}."
        data = await self.llm.complete_json(FALLBACK_PROMPT, user_msg)
        items = data if isinstance(data, list) else data.get("forecast", [])
        results = []
        for w in items:
            day = DayWeather(**w)
            day.city = city
            day.source = "historical_estimate"
            results.append(day)
        return results

    async def _fetch_llm(self, context: dict) -> list[DayWeather]:
        user_msg = (
            f"Weather forecast for {context['destination']} "
            f"from {context['departure_date']}"
        )
        if context.get("return_date"):
            user_msg += f" to {context['return_date']}"
        user_msg += "."

        data = await self.llm.complete_json(FALLBACK_PROMPT, user_msg)
        items = data if isinstance(data, list) else data.get("forecast", [])
        results = []
        for w in items:
            day = DayWeather(**w)
            day.source = "historical_estimate"
            results.append(day)
        return results
