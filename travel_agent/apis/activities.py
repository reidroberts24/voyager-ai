import json

from tripadvisorapi.api import TripadvisorApi

from travel_agent.config import settings
from travel_agent.models.activities import Activity


class ActivityAPI:
    def __init__(self):
        self.api = TripadvisorApi(key=settings.tripadvisor_api_key)

    def search(
        self,
        destination: str,
        categories: list[str] | None = None,
        max_results: int = 10,
    ) -> list[Activity]:
        activities: list[Activity] = []

        # Search for attractions
        search_categories = categories or ["attractions", "restaurants"]
        for category in search_categories:
            try:
                response = self.api.location_search(
                    searchQuery=destination, category=category
                )
                data = response.json()
                locations = data.get("data", [])

                for loc in locations[:max_results]:
                    location_id = loc.get("location_id")
                    if not location_id:
                        continue

                    # Get details for each location
                    detail = self._get_details(location_id)
                    if detail:
                        activities.append(detail)

            except Exception:
                continue

        return activities[:max_results]

    def _get_details(self, location_id: str) -> Activity | None:
        try:
            response = self.api.location_details(location_id)
            data = response.json()

            return Activity(
                name=data.get("name", "Unknown"),
                category=self._map_category(data.get("category", {}).get("name", "")),
                description=data.get("description", data.get("name", "")),
                rating=self._safe_float(data.get("rating")),
                price_level=data.get("price_level", None),
                address=data.get("address_obj", {}).get("address_string"),
                url=data.get("web_url"),
            )
        except Exception:
            return None

    @staticmethod
    def _map_category(raw: str) -> str:
        raw_lower = raw.lower()
        mapping = {
            "restaurant": "restaurant",
            "hotel": "hotel",
            "attraction": "attraction",
            "geographic": "area",
        }
        for key, val in mapping.items():
            if key in raw_lower:
                return val
        return raw_lower or "other"

    @staticmethod
    def _safe_float(val) -> float | None:
        if val is None:
            return None
        try:
            return float(val)
        except (ValueError, TypeError):
            return None
