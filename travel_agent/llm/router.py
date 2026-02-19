from travel_agent.config import settings
from travel_agent.llm.base import LLMProvider, LLMResponse
from travel_agent.llm.anthropic import ClaudeProvider
from travel_agent.llm.openai import OpenAIProvider

# Maps task types to preferred LLM providers (in priority order)
TASK_MODEL_MAP: dict[str, list[str]] = {
    "planning": ["claude", "openai"],
    "research": ["openai", "claude"],
    "writing": ["claude", "openai"],
    "default": ["claude", "openai"],
}


class FallbackProvider(LLMProvider):
    """Tries the primary provider, falls back to secondary on failure."""

    def __init__(self, providers: list[LLMProvider]):
        self.providers = providers

    async def complete(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> LLMResponse:
        last_err = None
        for provider in self.providers:
            try:
                return await provider.complete(
                    system_prompt, user_message, temperature, max_tokens
                )
            except Exception as e:
                last_err = e
                continue
        raise last_err or RuntimeError("All LLM providers failed")

    async def complete_json(
        self,
        system_prompt: str,
        user_message: str,
        response_schema: dict | None = None,
        max_tokens: int = 4096,
    ) -> dict:
        last_err = None
        for provider in self.providers:
            try:
                return await provider.complete_json(
                    system_prompt, user_message, response_schema, max_tokens=max_tokens
                )
            except Exception as e:
                last_err = e
                continue
        raise last_err or RuntimeError("All LLM providers failed")


def _build_provider(name: str) -> LLMProvider | None:
    if name == "claude" and settings.anthropic_api_key:
        return ClaudeProvider()
    if name == "openai" and settings.openai_api_key:
        return OpenAIProvider()
    return None


def get_provider(task_type: str = "default") -> LLMProvider:
    """Get an LLM provider with automatic fallback for a given task type."""
    preferences = TASK_MODEL_MAP.get(task_type, TASK_MODEL_MAP["default"])

    providers = []
    for name in preferences:
        p = _build_provider(name)
        if p:
            providers.append(p)

    if not providers:
        raise RuntimeError(
            "No LLM API key configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env"
        )

    # If only one provider available, return it directly (no wrapper overhead)
    if len(providers) == 1:
        return providers[0]

    return FallbackProvider(providers)
