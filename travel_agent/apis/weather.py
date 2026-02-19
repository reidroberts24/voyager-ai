from datetime import date

from pyowm import OWM

from travel_agent.config import settings
from travel_agent.models.weather import DayWeather


class WeatherAPI:
    def __init__(self):
        self.owm = OWM(settings.openweathermap_api_key)
        self.mgr = self.owm.weather_manager()

    def get_forecast(
        self,
        city: str,
        country_code: str = "",
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> list[DayWeather]:
        """Get a 5-day forecast for a city, optionally filtered to a date range.

        PyOWM's free tier provides 5-day/3-hour forecasts. We aggregate
        these into daily summaries and filter to the requested trip dates.
        """
        try:
            location = f"{city},{country_code}" if country_code else city
            forecast = self.mgr.forecast_at_place(location, "3h")
            results = self._aggregate_daily(forecast)
            if start_date or end_date:
                results = [
                    day for day in results
                    if (start_date is None or day.date >= start_date)
                    and (end_date is None or day.date <= end_date)
                ]
            return results
        except Exception:
            return []

    def _aggregate_daily(self, forecast) -> list[DayWeather]:
        """Aggregate 3-hour forecasts into daily summaries."""
        from collections import defaultdict
        from datetime import datetime

        daily: dict[str, list] = defaultdict(list)
        for weather in forecast.forecast:
            dt = datetime.utcfromtimestamp(weather.reference_time())
            date_str = dt.strftime("%Y-%m-%d")
            daily[date_str].append(weather)

        results = []
        for date_str in sorted(daily.keys()):
            weathers = daily[date_str]
            temps = []
            humidities = []
            rain_probs = []
            conditions = []

            for w in weathers:
                temp = w.temperature("celsius")
                temps.append((temp.get("temp_min", 0), temp.get("temp_max", 0)))
                humidities.append(w.humidity)
                rain_probs.append(w.rain.get("3h", 0) if w.rain else 0)
                conditions.append(w.status.lower())

            temp_low = min(t[0] for t in temps)
            temp_high = max(t[1] for t in temps)
            avg_humidity = sum(humidities) // len(humidities)

            # Most common condition
            condition = max(set(conditions), key=conditions.count)
            has_rain = any(r > 0 for r in rain_probs)
            rain_pct = int((sum(1 for r in rain_probs if r > 0) / len(rain_probs)) * 100)

            condition_map = {
                "clear": "sunny",
                "clouds": "cloudy",
                "rain": "rain",
                "drizzle": "rain",
                "thunderstorm": "thunderstorm",
                "snow": "snow",
                "mist": "fog",
                "fog": "fog",
                "haze": "fog",
            }
            mapped = condition_map.get(condition, condition)

            summary = self._make_summary(mapped, temp_high, rain_pct)

            results.append(
                DayWeather(
                    date=date_str,
                    condition=mapped,
                    temp_high_c=round(temp_high, 1),
                    temp_low_c=round(temp_low, 1),
                    humidity_pct=avg_humidity,
                    rain_probability_pct=rain_pct,
                    summary=summary,
                )
            )
        return results

    @staticmethod
    def _make_summary(condition: str, temp_high: float, rain_pct: int) -> str:
        temp_desc = "cold" if temp_high < 10 else "cool" if temp_high < 20 else "warm" if temp_high < 30 else "hot"
        if condition == "rain" or rain_pct > 50:
            return f"Rainy and {temp_desc} — bring an umbrella, consider indoor activities"
        elif condition == "sunny":
            return f"Clear and {temp_desc} — great day for outdoor sightseeing"
        elif condition == "cloudy":
            return f"Overcast and {temp_desc} — comfortable for walking around"
        elif condition == "snow":
            return f"Snowy and cold — dress warmly, enjoy winter scenery"
        else:
            return f"{condition.title()} and {temp_desc}"
