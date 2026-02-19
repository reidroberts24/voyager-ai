# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (Python CLI)
```bash
pip install -e .                   # Install package in editable mode (run once)
python3 main.py                    # Interactive CLI — conversational trip planning
python3 main.py "trip description" # Start with an initial query
python3 main.py --no-interactive   # Skip refinement loop after itinerary is built
python3 main.py --no-export        # Don't save markdown/PDF output
voyager plan                       # Alias for python3 main.py (after pip install -e .)
```

Requires at least one LLM key in `.env` (`ANTHROPIC_API_KEY` or `OPENAI_API_KEY`). Travel API keys (Amadeus, TripAdvisor, OpenWeatherMap) are optional — each agent falls back to LLM-generated data when missing. See `.env.example` for all keys.

### Frontend (React)
```bash
cd frontend
pnpm install    # Install dependencies (uses pnpm — see pnpm.overrides in package.json)
pnpm dev        # Start Vite dev server
pnpm build      # Production build
```

The `@` alias resolves to `frontend/src/` (configured in `vite.config.ts`).

---

## Architecture

This is a full-stack AI travel planning app. The backend is a Python CLI; the frontend is a React SPA that mirrors the same user flow as a web interface. They currently operate independently — there is no API layer connecting them yet.

### Backend — `backend/` + `main.py`

**Agentic orchestration without frameworks** — plain `asyncio.gather` over 5 independent agents. No LangChain/CrewAI.

#### Planning flow
1. **Conversational planning** (`main.py` → `Orchestrator.gather_details`): Multi-turn loop collects trip details until the planning LLM sets `ready: true` in its JSON response.
2. **Parsing** (`Orchestrator._parse_input`): Full conversation parsed into a `TripRequest` Pydantic model.
3. **Agent dispatch** (`Orchestrator._run_agents`): 5 agents run concurrently via `asyncio.gather`, each wrapped in `_safe_run` for error isolation.
4. **Assembly** (`Orchestrator._assemble_itinerary`): A writing LLM synthesizes all agent results into a day-by-day `Itinerary`.
5. **Refinement** (`Orchestrator.refine_itinerary`): Interactive loop modifies the itinerary based on user feedback.

#### LLM routing — `backend/llm/router.py`
Task types map to preferred providers with automatic fallback:
- `planning` / `writing`: Claude preferred
- `research` (agents): OpenAI preferred

`FallbackProvider` wraps multiple providers and tries each in sequence. If only one API key is set, all tasks use that provider.

Model defaults are in `backend/config.py` (`default_claude_model`, `default_openai_model`) and can be overridden via `.env`.

#### Agent pattern — `backend/agents/`
Every agent extends `Agent(ABC)` from `backend/agents/base.py` and follows the same pattern:
1. Check if the relevant API key exists in `settings`
2. If yes, call the real API (always wrapped in `asyncio.to_thread` — all travel SDKs are synchronous)
3. If the API fails or key is missing, fall back to `self.llm.complete_json()` with a domain-specific prompt
4. Return typed Pydantic models from `backend/models/`

#### Key backend constraints
- **All new model fields must be optional with defaults** — maintains backward compatibility with existing LLM-generated JSON responses.
- **Budget flows through `TripRequest.to_context_dict()`** — agents extract their budget slice via helpers like `_get_flight_budget()`. Don't pass budget separately.
- **System prompts are module-level constants** in `backend/agents/orchestrator.py` (`GATHER_SYSTEM_PROMPT`, `PARSE_SYSTEM_PROMPT`, `ITINERARY_SYSTEM_PROMPT`, `REFINE_SYSTEM_PROMPT`). Edit these to change LLM behavior.
- **Amadeus sandbox returns sparse/odd data** — the hotel agent deliberately supplements real API results with LLM-generated options to guarantee a minimum result count.

---

### Frontend — `frontend/`

React 18 + React Router v7 + shadcn/ui + Tailwind CSS v4. Built with Vite.

#### App structure
- `frontend/src/main.tsx` → mounts `App.tsx` → `RouterProvider` → pages in `frontend/src/app/pages/`
- All routes are defined in `frontend/src/app/routes.ts`
- Pages: `/` (landing), `/plan` (chat), `/research` (agent status), `/itinerary`, `/trips`, `/explore`, `/signin`, `/signup`, `/profile`, `/export`

#### Component organization — `frontend/src/app/components/`
- `layout/` — shell components used across all pages: `AppLayout`, `NavigationBar`, `Footer`, `MobileBottomNav`
- `common/` — reusable, non-feature-specific: `LoadingSkeleton`, `OfflineIndicator`, `DestinationCard`, `ImageWithFallback`
- Feature folders (`planning/`, `itinerary/`, `research/`, `auth/`, `explore/`, `export/`, `sharing/`, `profile/`, `trips/`) — components scoped to one page/feature
- `ui/` — shadcn primitives (Radix UI wrappers). Do not edit these directly; re-run shadcn CLI to update.

#### Scaffolded empty directories (fill as the app grows)
- `frontend/src/hooks/` — custom React hooks
- `frontend/src/lib/` — API client, utilities, constants (currently holds `tokens.json`)
- `frontend/src/types/` — shared TypeScript interfaces
- `frontend/src/assets/` — static images, icons

---

### Design System

**`frontend/src/styles/theme.css` is the single source of truth** for all visual tokens. Do not hardcode colors, radii, or font values in components — use the token names.

#### Brand identity
The core brand is a **blue→purple gradient**: `from-brand-start to-brand-end` (`#2563EB` → `#9333EA`). It appears on every primary button, logo, avatar, card header, and chat bubble. Never introduce a new primary color.

#### Key tokens (usable as Tailwind utilities)
| Token | Tailwind class | Use |
|---|---|---|
| `--brand-start` | `from-brand-start` / `bg-brand-start` | Gradient start, links |
| `--brand-end` | `to-brand-end` | Gradient end |
| `--surface` | `bg-surface` | Section backgrounds, activity blocks |
| `--footer-bg` | `bg-footer-bg` | Dark footer |
| `--success` / `--error` | `text-success` / `text-error` | Budget, form states |

The `--primary` CSS variable is set to `#2563EB` (brand blue), so shadcn's default `Button` variant matches the brand without needing an explicit gradient override.

#### Figma ↔ code sync
`frontend/src/lib/tokens.json` contains all design tokens in Token Studio format. To sync Figma Variables: open the Token Studio plugin in Figma → Load → JSON → point at this file. **Never export TSX from Figma** — design new pages as Figma frames and implement them in code using the existing component library.

#### Typography
Inter (400/500/600) is loaded via Google Fonts in `frontend/index.html`. Tailwind's `font-sans` resolves to Inter via `--font-family-sans` in `theme.css`.
