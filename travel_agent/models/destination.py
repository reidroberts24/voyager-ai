from pydantic import BaseModel


class DestinationInfo(BaseModel):
    country: str
    city: str
    currency: str
    currency_symbol: str
    language: str
    timezone: str
    visa_info: str
    useful_tips: list[str] = []
    emergency_number: str | None = None
