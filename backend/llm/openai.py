import json

from openai import AsyncOpenAI

from backend.config import settings
from backend.llm.base import LLMProvider, LLMResponse


class OpenAIProvider(LLMProvider):
    def __init__(self, model: str | None = None, api_key: str | None = None):
        self.client = AsyncOpenAI(api_key=api_key or settings.openai_api_key)
        self.model = model or settings.default_openai_model

    async def complete(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> LLMResponse:
        resp = await self.client.chat.completions.create(
            model=self.model,
            max_tokens=max_tokens,
            temperature=temperature,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
        )
        return LLMResponse(
            content=resp.choices[0].message.content or "",
            model=self.model,
            usage={
                "input_tokens": resp.usage.prompt_tokens if resp.usage else 0,
                "output_tokens": resp.usage.completion_tokens if resp.usage else 0,
            },
        )

    async def complete_json(
        self,
        system_prompt: str,
        user_message: str,
        response_schema: dict | None = None,
        max_tokens: int = 4096,
    ) -> dict:
        resp = await self.client.chat.completions.create(
            model=self.model,
            max_tokens=max_tokens,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt + "\nRespond with valid JSON."},
                {"role": "user", "content": user_message},
            ],
        )
        return json.loads(resp.choices[0].message.content or "{}")
