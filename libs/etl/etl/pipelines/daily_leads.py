"""
Extract and display all PostHog actions for companies that registered their SIRET yesterday.

Usage:
    python -m etl.pipelines.daily_leads
    python -m etl.pipelines.daily_leads --date 2024-03-25
"""
import json
import sys
from datetime import datetime, timedelta
from etl.extract.posthog_extractor import PosthogExtractor
from etl.transform.dto.posthog import PosthogDTO


MEANINGFUL_EVENTS = {
    "$pageview",
    "detail_page_view",
    "external_link_clicked_v2",
    "register_siret_modal",
    "register_siret_tracks",
    "send_program_form",
    "send_project_form",
    "send_program_form_catalog",
    "send_project_form_catalog",
    "send_customProject_form",
}

EVENT_LABELS = {
    "$pageview": "Page visitée",
    "detail_page_view": "Détail consulté",
    "external_link_clicked_v2": "Lien externe cliqué",
    "register_siret_modal": "SIRET saisi (modal)",
    "register_siret_tracks": "SIRET saisi (questionnaire)",
    "send_program_form": "Formulaire envoyé (programme)",
    "send_project_form": "Formulaire envoyé (projet)",
    "send_program_form_catalog": "Formulaire envoyé (catalogue programme)",
    "send_project_form_catalog": "Formulaire envoyé (catalogue projet)",
    "send_customProject_form": "Formulaire envoyé (projet personnalisé)",
}


def _parse_action_label(event: dict) -> str:
    name = event["event_name"]
    label = EVENT_LABELS.get(name, name)

    if name == "$pageview":
        # $current_url is stored directly in properties for pageviews
        raw_props = event.get("_raw_properties", {})
        current_url = raw_props.get("$current_url") or event.get("url", "")
        if current_url:
            label += f" → {current_url}"
    elif name == "external_link_clicked_v2":
        link = event.get("link", "")
        title = event.get("title", "")
        if title:
            label += f" → {title}"
        if link:
            label += f" ({link})"
    elif event.get("title"):
        label += f" → {event['title']}"
    elif event.get("url"):
        label += f" → {event['url']}"

    return label


def _enrich_with_raw_properties(dto_events: list, raw_results: list) -> list:
    """Attach raw properties dict to each DTO event so we can access $current_url etc."""
    for dto_event, raw in zip(dto_events, raw_results):
        try:
            dto_event["_raw_properties"] = json.loads(raw[2]) if raw[2] else {}
        except Exception:
            dto_event["_raw_properties"] = {}
    return dto_events


def extract_daily_leads(target_date: datetime | None = None) -> dict:
    extractor = PosthogExtractor()
    dto = PosthogDTO()

    if target_date is None:
        target_date = datetime.now() - timedelta(days=1)

    day_start = target_date.replace(hour=0, minute=0, second=0, microsecond=0)
    day_end = target_date.replace(hour=23, minute=59, second=59, microsecond=0)

    # Step 1 — Get SIRET registrations for the target day
    print(f"▶ Fetching SIRET events for {day_start.date()}...")
    raw_siret_response = extractor.get_siret_events(day_start, day_end)
    siret_events = dto.convert_raw_response_to_posthog_events(raw_siret_response)

    if not siret_events:
        print("  Aucun SIRET enregistré pour cette date.")
        return {}

    # Step 2 — Build person_id → siret mapping (deduplicate: keep first registration)
    siret_by_person: dict[str, str] = {}
    for event in siret_events:
        person_id = event["person_id"]
        siret = event["siret"]
        if person_id and siret and person_id not in siret_by_person:
            siret_by_person[person_id] = siret

    print(f"  Found {len(siret_by_person)} unique visitors with a SIRET.")

    # Step 3 — Fetch all events for those person_ids
    person_ids = list(siret_by_person.keys())
    print(f"▶ Fetching all actions for {len(person_ids)} person(s)...")
    raw_actions_response = extractor.get_events_by_person_ids(person_ids)

    raw_results = raw_actions_response.get("results", [])
    all_actions = dto.convert_raw_response_to_posthog_events(raw_actions_response)
    all_actions = _enrich_with_raw_properties(all_actions, raw_results)

    # Step 4 — Group by SIRET, filter to meaningful events
    actions_by_siret: dict[str, list] = {}
    for action in all_actions:
        if action["event_name"] not in MEANINGFUL_EVENTS:
            continue
        person_id = action["person_id"]
        siret = siret_by_person.get(person_id)
        if not siret:
            continue
        actions_by_siret.setdefault(siret, []).append(action)

    # Sort each siret's events by date
    for siret in actions_by_siret:
        actions_by_siret[siret].sort(key=lambda e: e["event_date"])

    return actions_by_siret


def build_md(actions_by_siret: dict, target_date: datetime) -> str:
    lines = []
    lines.append(f"# Leads du {target_date.strftime('%Y-%m-%d')}\n")

    if not actions_by_siret:
        lines.append("_Aucun lead trouvé pour cette date._\n")
        return "\n".join(lines)

    lines.append(f"**{len(actions_by_siret)} entreprise(s) ont saisi leur SIRET sans envoyer de formulaire.**\n")

    for siret, events in sorted(actions_by_siret.items()):
        lines.append(f"## SIRET {siret}\n")
        lines.append(f"_{len(events)} action(s)_\n")
        lines.append("| Heure | Action |")
        lines.append("|-------|--------|")
        for ev in events:
            ts = ev["event_date"].strftime("%H:%M")
            label = _parse_action_label(ev)
            lines.append(f"| {ts} | {label} |")
        lines.append("")

    return "\n".join(lines)


def write_md(actions_by_siret: dict, target_date: datetime, output_path: str) -> None:
    content = build_md(actions_by_siret, target_date)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"▶ Report written to {output_path}")


if __name__ == "__main__":
    target_date = None
    output_path = None

    args = sys.argv[1:]
    if "--date" in args:
        idx = args.index("--date")
        target_date = datetime.strptime(args[idx + 1], "%Y-%m-%d")
    if "--output" in args:
        idx = args.index("--output")
        output_path = args[idx + 1]

    if target_date is None:
        target_date = datetime.now() - timedelta(days=1)

    if output_path is None:
        output_path = f"leads_{target_date.strftime('%Y-%m-%d')}.md"

    leads = extract_daily_leads(target_date)
    write_md(leads, target_date, output_path)
