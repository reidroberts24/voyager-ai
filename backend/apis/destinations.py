import httpx

from backend.models.destination import DestinationInfo


class DestinationAPI:
    """Fetches country/city info from the REST Countries API (no key needed)."""

    BASE_URL = "https://restcountries.com/v3.1"

    def get_country_info(self, country_name: str) -> dict | None:
        """Fetch country data by name. Returns raw dict or None."""
        try:
            resp = httpx.get(
                f"{self.BASE_URL}/name/{country_name}",
                params={"fullText": "false"},
                timeout=10,
            )
            if resp.status_code == 200:
                data = resp.json()
                return data[0] if data else None
        except Exception:
            pass
        return None

    def build_destination_info(self, city: str, country_name: str) -> DestinationInfo | None:
        """Build a DestinationInfo from REST Countries data."""
        data = self.get_country_info(country_name)
        if not data:
            return None

        # Extract currency
        currencies = data.get("currencies", {})
        currency_code = next(iter(currencies), "")
        currency_info = currencies.get(currency_code, {})

        # Extract language
        languages = data.get("languages", {})
        primary_language = next(iter(languages.values()), "Unknown")

        # Extract timezone
        timezones = data.get("timezones", [])
        timezone = timezones[0] if timezones else "Unknown"

        return DestinationInfo(
            country=data.get("name", {}).get("common", country_name),
            city=city,
            currency=f"{currency_info.get('name', currency_code)} ({currency_code})",
            currency_symbol=currency_info.get("symbol", ""),
            language=primary_language,
            timezone=timezone,
            visa_info="",  # Will be filled by the LLM in the agent
            useful_tips=[],  # Will be filled by the LLM in the agent
        )
