# Voyager AI — Architecture Diagrams

---

## 1. Agent Orchestration Flow

The full planning pipeline from first user message to exported itinerary.

```mermaid
flowchart TD
    U([User]) -->|"initial query"| G

    subgraph gather ["Phase 1 — Conversational Gathering (multi-turn)"]
        G["gather_details()\nGATHER_SYSTEM_PROMPT"] -->|"ready: false"| Q[Follow-up question]
        Q --> U
    end

    G -->|"ready: true"| P

    subgraph parse ["Phase 2 — Parse"]
        P["_parse_input()\nPARSE_SYSTEM_PROMPT\n→ TripRequest"]
    end

    P --> CTX["TripRequest.to_context_dict()"]

    CTX --> PBF{Pre-booked\nflights?}
    PBF -->|No| FA["FlightAgent"]
    PBF -->|Yes| FP["_prebooked_to_flight_options()"]

    CTX --> PBH{Pre-booked\nhotels?}
    PBH -->|No| MC{Multi-city\ntrip?}
    PBH -->|Yes| HP["_prebooked_to_hotel_options()"]
    MC -->|No| HA["HotelAgent (single)"]
    MC -->|Yes| HM["_dispatch_hotels()\nHotelAgent × city\nbudget split by nights"]

    CTX --> AA["ActivityAgent"]
    CTX --> WA["WeatherAgent"]
    CTX --> DA["DestinationAgent"]

    subgraph agents ["Phase 3 — asyncio.gather (parallel, each wrapped in _safe_run)"]
        FA
        HA
        HM
        AA
        WA
        DA
    end

    FA & FP & HA & HP & HM & AA & WA & DA --> ASM

    subgraph assemble ["Phase 4 — Assembly"]
        ASM["_assemble_itinerary()\nITINERARY_SYSTEM_PROMPT\nwriting LLM → Itinerary"]
    end

    ASM --> OUT["Display + Export\n(terminal / markdown / PDF)"]

    OUT -->|"direct change"| RF["refine_itinerary()\nREFINE_SYSTEM_PROMPT"]
    OUT -->|"wants options"| SG["suggest_alternatives()\nSUGGEST_SYSTEM_PROMPT"]
    SG -->|"user picks"| AP["apply_suggestion()"]
    RF & AP --> ASM
```

> **Error isolation:** every agent runs inside `_safe_run()`. A single agent failure returns its default (empty list or `None`) without cancelling the other agents or the assembly step.

---

## 2. LLM Routing & Fallback

How `get_provider(task_type)` selects and wraps providers at runtime.

```mermaid
flowchart LR
    GT["get_provider(task_type)"] --> TM

    subgraph TM ["TASK_MODEL_MAP preference order"]
        direction TB
        T1["planning  → [claude, openai]"]
        T2["research  → [openai, claude]"]
        T3["writing   → [claude, openai]"]
        T4["default   → [claude, openai]"]
    end

    TM --> BUILD["_build_provider()\ncheck .env keys"]

    BUILD -->|"0 keys set"| ERR["RuntimeError\nno API key configured"]
    BUILD -->|"1 key set"| DIRECT["Direct provider\n(no wrapper overhead)"]
    BUILD -->|"2 keys set"| FB["FallbackProvider\n(wraps both)"]

    FB -->|"call complete_json()"| P1["Primary provider"]
    P1 -->|"success"| RES["Return response"]
    P1 -->|"exception"| P2["Secondary provider"]
    P2 -->|"success"| RES
    P2 -->|"exception"| RERR["Re-raise last error"]
```

> **Providers:** `ClaudeProvider` wraps `anthropic` SDK (`claude-sonnet-4-20250514` default), `OpenAIProvider` wraps `openai` SDK (`gpt-4o` default). Both defaults are overridable via `.env`.

---

## 3. Frontend Page Flow

User journey through the React SPA (`frontend/src/app/routes.ts`).

```mermaid
flowchart TD
    LAND["/ — Landing\nHero, PopularDestinations,\nHowItWorks, YourTrips"]

    LAND -->|"Plan a Trip CTA"| PLAN
    LAND -->|"Sign In"| SI["/signin — Sign In"]
    LAND -->|"Sign Up"| SU["/signup — Sign Up"]
    SI & SU -->|"authenticated"| LAND

    PLAN["/plan — Trip Planning\nConversational chat\nTripSummaryPanel sidebar"]
    PLAN -->|"agents dispatched"| RES

    RES["/research — Agent Status\nAgentRow progress\nTravelFacts display"]
    RES -->|"itinerary ready"| ITIN

    ITIN["/itinerary — Itinerary View\nItineraryHero, DayCard×N\nBudgetSection, TipsSection\nRefinementChat"]
    ITIN -->|"export"| EXP
    ITIN -->|"refinement chat"| ITIN

    EXP["/export — Export Preview\nPreviewDocument\nExportControls PDF/MD/Print"]

    subgraph nav ["Global Navigation (NavigationBar + MobileBottomNav)"]
        TRIPS["/trips — My Trips\nTripCard list, EmptyState"]
        EXPL["/explore — Explore\nDestinationCard, FeaturedTripCard"]
        PROF["/profile — Profile\nAvatarUpload, InterestTagGrid"]
    end

    LAND & ITIN -.->|"nav links"| TRIPS & EXPL & PROF
    TRIPS -->|"open saved trip"| ITIN
```

> **No API layer yet.** The frontend is currently a standalone SPA — all data is mocked or passed via component props. Connecting it to the Python backend via a REST/WebSocket API is a future milestone.

---

## 4. Data Model Relationships

How data flows from a raw conversation through to a final `Itinerary`.

```mermaid
classDiagram
    direction TB

    class TripRequest {
        +str origin, origin_code
        +str destination, destination_code
        +date departure_date
        +date|None return_date
        +int travelers
        +float|None budget_usd
        +str trip_type
        +str lodging_type, transit_preferences
        +list~str~ interests, preferred_airlines
        +to_context_dict() dict
    }

    class BudgetAllocation {
        +float total_usd
        +float|None flights_max_usd
        +float|None hotels_max_usd
        +float|None activities_max_usd
        +float|None food_max_usd
        +str priority_notes
    }

    class CityStay {
        +str city, city_code
        +date check_in, check_out
        +int nights
        +bool is_day_trip
    }

    class PreBookedFlight {
        +str airline
        +str departure_airport, arrival_airport
        +date departure_date
        +date|None return_date
        +float|None price_paid_usd
    }

    class PreBookedHotel {
        +str name, city
        +date check_in, check_out
        +float|None total_price_usd
    }

    class Itinerary {
        +str title, destination, date_range
        +str destination_summary
        +dict budget_breakdown
        +list~str~ practical_tips
        +slug str
    }

    class DayPlan {
        +int number
        +date date
        +str title, weather
        +str morning, afternoon, evening
        +float|None estimated_cost_usd
        +str|None alt_morning, alt_afternoon, alt_evening
        +str|None alt_weather_note
    }

    class FlightOption {
        +list~FlightLeg~ legs
        +float total_price_usd
        +int stops, total_duration_minutes
        +int travelers
    }

    class HotelOption {
        +str name, city
        +date check_in, check_out
        +int nights
        +float price_per_night_usd
        +float total_price_usd
    }

    class CityHotels {
        +str city, city_code
        +date check_in, check_out
        +int nights
    }

    class Activity {
        +str name, description, category
        +float|None estimated_cost_usd
        +str|None duration, location
    }

    class DayWeather {
        +date date
        +str description
        +float temp_high_c, temp_low_c
        +str source
    }

    class DestinationInfo {
        +str destination
        +str overview
        +list~str~ best_areas, practical_tips
    }

    TripRequest "1" --> "0..1" BudgetAllocation : budget_allocation
    TripRequest "1" --> "*" CityStay : city_stays
    TripRequest "1" --> "*" PreBookedFlight : prebooked_flights
    TripRequest "1" --> "*" PreBookedHotel : prebooked_hotels

    Itinerary "1" --> "*" DayPlan : days
    Itinerary "1" --> "*" FlightOption : flights
    Itinerary "1" --> "*" HotelOption : hotels
    Itinerary "1" --> "*" CityHotels : hotels_by_city
    Itinerary "1" --> "*" Activity : activities
    Itinerary "1" --> "*" DayWeather : weather_forecast
    Itinerary "1" --> "0..1" DestinationInfo : destination_info

    CityHotels "1" --> "*" HotelOption : options

    TripRequest ..> Itinerary : "to_context_dict() →\nagents → assembly"
```
