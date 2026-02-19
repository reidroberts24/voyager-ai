import asyncio
import logging
from pathlib import Path

import typer
from rich.console import Console

from backend.agents.orchestrator import Orchestrator
from backend.output.terminal import display_itinerary
from backend.output.markdown import export_markdown
from backend.output.pdf import export_pdf

# Suppress noisy "Event loop is closed" warnings from httpx/anyio on exit
logging.getLogger("asyncio").setLevel(logging.CRITICAL)

app = typer.Typer(help="Voyager AI - Plan trips with AI-powered research")
console = Console()


def _progress_callback(agent: str, status: str):
    """Print agent progress updates to the terminal."""
    console.print(f"  [dim][{agent}][/dim] {status}")


def _run_planning_conversation(orchestrator: Orchestrator, initial_input: str) -> list[dict[str, str]]:
    """Conversational loop to gather trip details before dispatching agents.

    Returns the full conversation history once the planner has enough info.
    """
    conversation: list[dict[str, str]] = []
    conversation.append({"role": "user", "content": initial_input})

    while True:
        # Ask the LLM to evaluate what we know
        with console.status("[bold green]Thinking...[/bold green]", spinner="dots"):
            result = asyncio.run(orchestrator.gather_details(conversation))

        message = result.get("message", "")
        ready = result.get("ready", False)

        if ready:
            # Planner has enough info — show confirmation and proceed
            console.print(f"\n[bold green]{message}[/bold green]")
            conversation.append({"role": "assistant", "content": message})
            return conversation

        # Show the planner's question(s)
        console.print(f"\n[bold cyan]{message}[/bold cyan]")
        conversation.append({"role": "assistant", "content": message})

        # Get user's response
        console.print()
        try:
            user_reply = console.input("[bold cyan]> [/bold cyan]").strip()
        except (KeyboardInterrupt, EOFError):
            console.print("\n[dim]Cancelled.[/dim]")
            raise typer.Exit(0)

        if not user_reply:
            continue

        if user_reply.lower() in ("quit", "exit", "q"):
            console.print("[dim]Cancelled.[/dim]")
            raise typer.Exit(0)

        conversation.append({"role": "user", "content": user_reply})


def _auto_save(itinerary, output_dir: Path):
    """Save itinerary to markdown and PDF."""
    md_path = export_markdown(itinerary, output_dir)
    pdf_path = export_pdf(itinerary, output_dir)
    console.print(f"[dim]Updated itinerary saved to: {md_path}[/dim]")
    console.print(f"[dim]PDF saved to: {pdf_path}[/dim]")


def _display_suggestions(suggestions: dict):
    """Show 3 alternative suggestions to the user."""
    target = suggestions.get("target_description", "the selected activity")
    console.print(f"\n[bold yellow]Alternatives for: {target}[/bold yellow]\n")
    for s in suggestions.get("suggestions", []):
        cost = f" (~${s['estimated_cost_usd']})" if s.get("estimated_cost_usd") else ""
        console.print(f"  [bold]{s['id']}.[/bold] [cyan]{s['name']}[/cyan]{cost}")
        console.print(f"     {s['description']}\n")
    console.print("[dim]Pick 1-3, 'more' for new suggestions, or 'skip' to cancel[/dim]")


def _run_refinement_loop(orchestrator: Orchestrator, itinerary, output_dir: Path):
    """Interactive refinement loop after initial itinerary is generated."""
    console.print()
    console.print(
        "[bold cyan]Want to modify the itinerary?[/bold cyan] "
        "Type your changes below, or ask for alternatives."
    )
    console.print(
        "[dim]Commands: 'done' to finish, 'save' to re-export, 'show' to redisplay[/dim]"
    )

    pending_suggestions = None  # Holds suggestions dict when in suggestion mode

    while True:
        console.print()
        try:
            user_input = console.input("[bold cyan]> [/bold cyan]").strip()
        except (KeyboardInterrupt, EOFError):
            console.print("\n[dim]Goodbye![/dim]")
            break

        if not user_input:
            continue

        command = user_input.lower()
        if command in ("done", "quit", "exit", "q"):
            console.print("[dim]Goodbye![/dim]")
            break

        if command == "save":
            md_path = export_markdown(itinerary, output_dir)
            pdf_path = export_pdf(itinerary, output_dir)
            console.print(f"[dim]Itinerary saved to: {md_path}[/dim]")
            console.print(f"[dim]PDF saved to: {pdf_path}[/dim]")
            continue

        if command == "show":
            display_itinerary(itinerary)
            continue

        # Handle pending suggestion selection
        if pending_suggestions:
            if command == "skip":
                pending_suggestions = None
                console.print("[dim]Skipped. What else would you like to change?[/dim]")
                continue

            if command == "more":
                original_request = pending_suggestions.get("_original_request", "")
                with console.status("[bold green]Finding more alternatives...[/bold green]", spinner="dots"):
                    try:
                        pending_suggestions = asyncio.run(
                            orchestrator.suggest_alternatives(itinerary, original_request)
                        )
                        pending_suggestions["_original_request"] = original_request
                    except Exception as e:
                        console.print(f"[red]Error: {e}[/red]")
                        continue
                _display_suggestions(pending_suggestions)
                continue

            if command in ("1", "2", "3"):
                idx = int(command) - 1
                suggestions_list = pending_suggestions.get("suggestions", [])
                if idx < len(suggestions_list):
                    chosen = suggestions_list[idx]
                    with console.status("[bold green]Applying your choice...[/bold green]", spinner="dots"):
                        try:
                            itinerary = asyncio.run(
                                orchestrator.apply_suggestion(
                                    itinerary,
                                    chosen,
                                    pending_suggestions.get("day_number", 1),
                                    pending_suggestions.get("time_slot", "afternoon"),
                                )
                            )
                        except Exception as e:
                            console.print(f"[red]Error: {e}[/red]")
                            pending_suggestions = None
                            continue
                    pending_suggestions = None
                    display_itinerary(itinerary)
                    _auto_save(itinerary, output_dir)
                    continue

            # Input doesn't match 1/2/3/more/skip — treat as new request
            pending_suggestions = None
            # Fall through to normal refinement below

        # Classify intent: direct modification or suggestion request
        with console.status("[bold green]Thinking...[/bold green]", spinner="dots"):
            try:
                mode = asyncio.run(orchestrator.classify_refinement(user_input))
            except Exception:
                mode = "direct"

        if mode == "suggest":
            with console.status("[bold green]Finding alternatives...[/bold green]", spinner="dots"):
                try:
                    pending_suggestions = asyncio.run(
                        orchestrator.suggest_alternatives(itinerary, user_input)
                    )
                    pending_suggestions["_original_request"] = user_input
                except Exception as e:
                    console.print(f"[red]Error: {e}[/red]")
                    continue
            _display_suggestions(pending_suggestions)
            continue

        # Direct refinement
        with console.status(
            "[bold green]Updating your itinerary...[/bold green]", spinner="dots"
        ):
            try:
                itinerary = asyncio.run(
                    orchestrator.refine_itinerary(itinerary, user_input)
                )
            except Exception as e:
                console.print(f"[red]Error updating itinerary: {e}[/red]")
                continue

        display_itinerary(itinerary)
        _auto_save(itinerary, output_dir)

    return itinerary


@app.command()
def plan(
    query: str = typer.Argument(
        None, help="Describe your trip (e.g. '5-day trip to Tokyo from SF, budget $3000')"
    ),
    export: bool = typer.Option(True, "--export/--no-export", help="Export itinerary to Markdown"),
    output_dir: Path = typer.Option(Path("output"), "--output-dir", "-o", help="Output directory"),
    interactive: bool = typer.Option(True, "--interactive/--no-interactive", "-i", help="Enter interactive refinement mode"),
):
    """Plan a trip based on your description."""
    if not query:
        query = console.input("[bold cyan]Where do you want to travel?[/bold cyan] ")

    if not query.strip():
        console.print("[red]Please provide a trip description.[/red]")
        raise typer.Exit(1)

    orchestrator = Orchestrator(on_progress=_progress_callback)

    # Phase 1: Conversational planning — gather details
    console.print()
    conversation = _run_planning_conversation(orchestrator, query)

    # Phase 2: Dispatch agents and build itinerary
    console.print()
    try:
        itinerary = asyncio.run(orchestrator.plan_trip(conversation))
    except Exception as e:
        console.print(f"\n[red]Failed to plan trip: {e}[/red]")
        raise typer.Exit(1)

    console.print()
    display_itinerary(itinerary)

    if export:
        md_path = export_markdown(itinerary, output_dir)
        pdf_path = export_pdf(itinerary, output_dir)
        console.print(f"[dim]Itinerary saved to: {md_path}[/dim]")
        console.print(f"[dim]PDF saved to: {pdf_path}[/dim]")

    # Phase 3: Refinement loop
    if interactive:
        _run_refinement_loop(orchestrator, itinerary, output_dir)


if __name__ == "__main__":
    app()
