import json

import anthropic

from travel_agent.config import settings
from travel_agent.llm.base import LLMProvider, LLMResponse


class ClaudeProvider(LLMProvider):
    def __init__(self, model: str | None = None, api_key: str | None = None):
        self.client = anthropic.AsyncAnthropic(
            api_key=api_key or settings.anthropic_api_key
        )
        self.model = model or settings.default_claude_model

    async def complete(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> LLMResponse:
        resp = await self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
        )
        return LLMResponse(
            content=resp.content[0].text,
            model=self.model,
            usage={
                "input_tokens": resp.usage.input_tokens,
                "output_tokens": resp.usage.output_tokens,
            },
        )

    async def complete_json(
        self,
        system_prompt: str,
        user_message: str,
        response_schema: dict | None = None,
        max_tokens: int = 4096,
    ) -> dict:
        full_system = (
            system_prompt
            + "\n\nYou MUST respond with valid JSON only. No markdown, no explanation, just JSON."
        )
        resp = await self.complete(full_system, user_message, temperature=0.2, max_tokens=max_tokens)
        text = resp.content.strip()
        # Strip markdown code fences if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
            if text.endswith("```"):
                text = text[:-3].strip()
        return json.loads(text)
