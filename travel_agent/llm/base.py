from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any


@dataclass
class LLMResponse:
    content: str
    model: str
    usage: dict[str, int] = field(default_factory=dict)


class LLMProvider(ABC):
    """Abstract base for all LLM providers."""

    @abstractmethod
    async def complete(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> LLMResponse: ...

    @abstractmethod
    async def complete_json(
        self,
        system_prompt: str,
        user_message: str,
        response_schema: dict[str, Any] | None = None,
        max_tokens: int = 4096,
    ) -> dict:
        """Return parsed JSON from the LLM response."""
        ...
