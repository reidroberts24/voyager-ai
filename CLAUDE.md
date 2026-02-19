# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

```bash
python3 main.py                    # Interactive CLI (conversational planning)
python3 main.py "trip description" # Start with initial query
python3 main.py --no-interactive   # Skip refinement loop after itinerary
python3 main.py --no-export        # Don't save markdown file
```

The app requires at least one LLM API key (`ANTHROPIC_API_KEY` or `OPENAI_API_KEY`) in `.env`. Travel API keys (Amadeus, TripAdvisor, OpenWeatherMap) are optional — agents fall back to LLM-generated data when keys are missing.

## Architecture

**Agentic orchestration without frameworks** — plain `asyncio.gather` over 5 independent agents. No LangChain/CrewAI.

### Flow

1. **Conversational planning** (`main.py` → `Orchestrator.gather_details`): Multi-turn conversation collects trip details until the planning LLM sets `ready: true`
2. **Parsing** (`Orchestrator._parse_input`): Full conversation parsed into a `TripRequest` Pydantic model
3. **Agent dispatch** (`Orchestrator._run_agents`): 5 agents run in parallel via `asyncio.gather`, each wrapped in `_safe_run` for error isolation
4. **Assembly** (`Orchestrator._assemble_itinerary`): Writing LLM synthesizes all agent results into a day-by-day `Itinerary`
5. **Refinement** (`Orchestrator.refine_itinerary`): Interactive loop modifies existing itinerary based on user feedback

### LLM Routing

`backend/llm/router.py` maps task types to preferred providers with automatic fallback:
- `planning` (input parsing): Claude preferred
- `research` (agents): OpenAI preferred
- `writing` (itinerary): Claude preferred

`FallbackProvider` wraps multiple providers and tries each in sequence. If only one API key is configured, all tasks use that provider.

### Agent Pattern

Each agent in `backend/agents/` extends `Agent(ABC)` and follows the same pattern:
1. Check if the relevant API key exists in `settings`
2. If yes, call the real API (wrapped in `asyncio.to_thread` since SDKs are sync)
3. If API fails or key is missing, fall back to `self.llm.complete_json()` with a domain-specific prompt
4. Return typed Pydantic models

### Key Design Decisions

- **Amadeus SDK is synchronous** — all calls wrapped in `asyncio.to_thread()` for concurrent execution
- **Budget allocation flows through context dict** — `TripRequest.to_context_dict()` serializes everything, agents extract their category budget via helper methods like `_get_flight_budget()`
- **System prompts are constants at module top** — `GATHER_SYSTEM_PROMPT`, `PARSE_SYSTEM_PROMPT`, `ITINERARY_SYSTEM_PROMPT`, `REFINE_SYSTEM_PROMPT` in `backend/agents/orchestrator.py` control all LLM behavior
- **Amadeus test sandbox returns limited/odd data** — hotel agent supplements sparse API results with LLM-generated options to guarantee minimum result count
- **Weather contingency** — each `DayPlan` has optional `alt_*` fields for alternative weather plans
- **All new model fields must be optional with defaults** to maintain backward compatibility with existing LLM-generated or serialized data
