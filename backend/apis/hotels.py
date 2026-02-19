from amadeus import Client, ResponseError

from backend.config import settings
from backend.models.hotels import HotelOption


class HotelAPI:
    def __init__(self):
        self.client = Client(
            client_id=settings.amadeus_client_id,
            client_secret=settings.amadeus_client_secret,
        )

    def search(
        self,
        city_code: str,
        check_in: str,
        check_out: str,
        adults: int = 1,
        max_results: int = 5,
    ) -> list[HotelOption]:
        try:
            # Step 1: Find hotel IDs in the city
            hotels_response = self.client.reference_data.locations.hotels.by_city.get(
                cityCode=city_code
            )
            # Request more IDs than we need — many won't have offers
            hotel_ids = [
                h.get("hotelId") for h in (hotels_response.data or [])[:20]
            ]
            if not hotel_ids:
                return []

            # Step 2: Get offers for those hotels
            offers_response = self.client.shopping.hotel_offers_search.get(
                hotelIds=",".join(hotel_ids),
                adults=adults,
                checkInDate=check_in,
                checkOutDate=check_out,
            )

            nights = self._calc_nights(check_in, check_out)
            results = []
            for offer in offers_response.data or []:
                if not offer.get("offers"):
                    continue
                parsed = self._parse_offer(offer, check_in, check_out)
                # Filter out absurd prices (Amadeus test sandbox can return weird data)
                if parsed.price_per_night_usd > 5000 or parsed.price_per_night_usd < 1:
                    continue
                results.append(parsed)

            # Sort by price and return top results
            results.sort(key=lambda h: h.total_price_usd)
            return results[:max_results]
        except ResponseError:
            return []

    def _parse_offer(self, hotel_data: dict, check_in: str, check_out: str) -> HotelOption:
        hotel_info = hotel_data.get("hotel", {})
        offer = hotel_data.get("offers", [{}])[0]
        price_info = offer.get("price", {})

        total = float(price_info.get("total", 0))
        currency = price_info.get("currency", "USD")

        # Amadeus test sandbox sometimes returns prices in local currency
        # Convert common currencies to approximate USD
        if currency != "USD":
            total = self._approximate_usd(total, currency)

        nights = self._calc_nights(check_in, check_out)
        per_night = total / nights if nights > 0 else total

        return HotelOption(
            name=hotel_info.get("name", "Unknown Hotel"),
            address=self._format_address(hotel_info),
            rating=self._safe_float(hotel_info.get("rating")),
            price_per_night_usd=round(per_night, 2),
            total_price_usd=round(total, 2),
            amenities=hotel_info.get("amenities", [])[:6],
            distance_to_center_km=self._safe_float(
                hotel_info.get("hotelDistance", {}).get("distance")
            ),
        )

    @staticmethod
    def _approximate_usd(amount: float, currency: str) -> float:
        """Rough currency conversion for display purposes."""
        rates = {
            "EUR": 1.08, "GBP": 1.27, "JPY": 0.0067, "CHF": 1.13,
            "CAD": 0.74, "AUD": 0.65, "KRW": 0.00075, "CNY": 0.14,
            "THB": 0.028, "MXN": 0.058, "INR": 0.012,
        }
        rate = rates.get(currency, 1.0)
        return amount * rate

    @staticmethod
    def _format_address(hotel_info: dict) -> str:
        addr = hotel_info.get("address", {})
        parts = [
            addr.get("lines", [""])[0] if addr.get("lines") else "",
            addr.get("cityName", ""),
            addr.get("countryCode", ""),
        ]
        return ", ".join(p for p in parts if p)

    @staticmethod
    def _calc_nights(check_in: str, check_out: str) -> int:
        from datetime import date
        try:
            d1 = date.fromisoformat(check_in)
            d2 = date.fromisoformat(check_out)
            return max(1, (d2 - d1).days)
        except (ValueError, TypeError):
            return 1

    @staticmethod
    def _safe_float(val) -> float | None:
        if val is None:
            return None
        try:
            return float(val)
        except (ValueError, TypeError):
            return None
