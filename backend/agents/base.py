from abc import ABC, abstractmethod
from typing import Any

from backend.llm.base import LLMProvider


class Agent(ABC):
    """Base class for all specialist agents."""

    def __init__(self, llm: LLMProvider):
        self.llm = llm

    @abstractmethod
    async def run(self, context: dict[str, Any]) -> Any:
        """Execute the agent's task given trip context.

        Returns domain-specific results (e.g. list[FlightOption]).
        """
        ...
