from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # LLM keys
    anthropic_api_key: str = ""
    openai_api_key: str = ""

    # Travel API keys
    amadeus_client_id: str = ""
    amadeus_client_secret: str = ""
    tripadvisor_api_key: str = ""
    openweathermap_api_key: str = ""

    # Model preferences
    default_claude_model: str = "claude-sonnet-4-20250514"
    default_openai_model: str = "gpt-4o"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
