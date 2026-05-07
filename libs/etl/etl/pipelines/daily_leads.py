"""
Extract and display all PostHog actions for companies that registered their SIRET yesterday.
Outputs a human-readable .md file and a machine-readable .json file.

Usage:
    python -m etl.pipelines.daily_leads
    python -m etl.pipelines.daily_leads --date 2024-03-25
    python -m etl.pipelines.daily_leads --date 2024-03-25 --output /path/to/leads
"""
import json
import sys
from datetime import datetime, timedelta
from urllib.parse import urlparse

from etl.extract.posthog_extractor import PosthogExtractor
from etl.tools.db_manager import DBManager
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

PLACEHOLDER_CONTACT = {"phone": "01 23 45 67 89", "email": "contact@placeholder.fr"}


# ─── Helpers ────────────────────────────────────────────────────────────────


def _extract_slug_from_url(url: str) -> str | None:
    if not url:
        return None
    path = urlparse(url).path.rstrip("/")
    parts = path.split("/")
    return parts[-1] if parts else None


def _parse_action_label(event: dict) -> str:
    name = event["event_name"]
    label = EVENT_LABELS.get(name, name)

    if name == "$pageview":
        raw_props = event.get("_raw_properties", {})
        current_url = raw_props.get("$current_url") or event.get("url", "")
        if current_url:
            path = urlparse(current_url).path
            label += f" → {path}"
    elif name == "external_link_clicked_v2":
        title = event.get("title", "")
        link = event.get("link", "")
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
    for dto_event, raw in zip(dto_events, raw_results):
        try:
            dto_event["_raw_properties"] = json.loads(raw[2]) if raw[2] else {}
        except Exception:
            dto_event["_raw_properties"] = {}
    return dto_events


# ─── DB enrichment ──────────────────────────────────────────────────────────


def _fetch_company_info(sirets: list[str]) -> dict[str, dict]:
    """Returns {siret: {naf_section, naf_code, region, workforce_min, workforce_max}} from the companies table."""
    if not sirets:
        return {}
    placeholders = ",".join(["%s"] * len(sirets))
    query = f"""
        SELECT siret, naf_section, naf_code, region, workforce_min, workforce_max
        FROM __SCHEMA_NAME__.companies
        WHERE siret IN ({placeholders})
    """
    try:
        rows = DBManager().query(query, sirets)
        return {
            row[0]: {
                "naf_section": row[1] or "",
                "naf_code": row[2] or "",
                "region": row[3] or "",
                "workforce_min": row[4],
                "workforce_max": row[5],
            }
            for row in rows
        }
    except Exception as e:
        print(f"  Warning: could not fetch company info: {e}")
        return {}


def _extract_denominations(actions_by_siret: dict) -> dict[str, str]:
    """Extract company denomination from raw PostHog event properties, keyed by siret."""
    result = {}
    for siret, events in actions_by_siret.items():
        for ev in events:
            raw_props = ev.get("_raw_properties", {})
            company_raw = raw_props.get("company", "")
            if not company_raw:
                continue
            try:
                company = json.loads(company_raw) if isinstance(company_raw, str) else company_raw
                denomination = company.get("denomination", "")
                if denomination:
                    result[siret] = denomination
                    break
            except Exception:
                continue
    return result


def _fetch_content_themes(slugs_by_type: dict[str, list[str]]) -> dict[str, dict]:
    """Returns {slug: {title, themes: list[str], type}} for programs and projects."""
    result = {}

    for table, content_type in [("programs", "program"), ("projects", "project")]:
        slugs = slugs_by_type.get(table, [])
        if not slugs:
            continue
        placeholders = ",".join(["%s"] * len(slugs))
        query = f"""
            SELECT slug, name, themes
            FROM __SCHEMA_NAME__.{table}
            WHERE slug IN ({placeholders})
        """
        try:
            rows = DBManager().query(query, slugs)
            for row in rows:
                slug, name, themes_raw = row
                themes = [t.strip() for t in (themes_raw or "").split("|") if t.strip()]
                result[slug] = {"title": name, "themes": themes, "type": content_type}
        except Exception as e:
            print(f"  Warning: could not fetch {table} themes: {e}")

    return result


def _build_content_visited(events: list[dict], content_db: dict) -> list[dict]:
    """Deduplicated list of programs/projects the lead visited, with metadata."""
    seen = set()
    content_visited = []

    for ev in events:
        if ev["event_name"] != "detail_page_view":
            continue
        url = ev.get("url") or ev.get("_raw_properties", {}).get("url", "")
        slug = _extract_slug_from_url(url)
        obj_type = ev.get("object_type", "")
        title = ev.get("title", slug or "")

        if not slug or slug in seen:
            continue
        seen.add(slug)

        db_entry = content_db.get(slug, {})
        content_visited.append({
            "type": obj_type or db_entry.get("type", ""),
            "title": db_entry.get("title") or title,
            "slug": slug,
            "path": url if url.startswith("/") else urlparse(url).path,
            "themes": db_entry.get("themes", []),
        })

    return content_visited


def _collect_all_themes(content_visited: list[dict]) -> list[str]:
    seen = set()
    themes = []
    for item in content_visited:
        for theme in item.get("themes", []):
            if theme not in seen:
                seen.add(theme)
                themes.append(theme)
    return themes


# ─── Core extraction ────────────────────────────────────────────────────────


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

    print(f"  {len(siret_by_person)} visiteur(s) unique(s) avec SIRET.")

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

    for siret in actions_by_siret:
        actions_by_siret[siret].sort(key=lambda e: e["event_date"])

    # Step 5 — Enrich with DB data (company info + content themes)
    print("▶ Enriching with DB data...")
    company_info = _fetch_company_info(list(actions_by_siret.keys()))

    # Collect slugs to look up from detail_page_view events
    slugs_by_type: dict[str, list[str]] = {"programs": [], "projects": []}
    for events in actions_by_siret.values():
        for ev in events:
            if ev["event_name"] != "detail_page_view":
                continue
            url = ev.get("url") or ev.get("_raw_properties", {}).get("url", "")
            slug = _extract_slug_from_url(url)
            obj_type = ev.get("object_type", "")
            if slug:
                key = "programs" if obj_type == "program" else "projects"
                if slug not in slugs_by_type[key]:
                    slugs_by_type[key].append(slug)

    content_db = _fetch_content_themes(slugs_by_type)
    denominations = _extract_denominations(actions_by_siret)

    return {
        "siret_events_by_siret": actions_by_siret,
        "company_info": company_info,
        "content_db": content_db,
        "denominations": denominations,
        "target_date": target_date,
    }


# ─── Formatters ─────────────────────────────────────────────────────────────


def build_json(extracted: dict) -> list:
    actions_by_siret = extracted["siret_events_by_siret"]
    company_info = extracted["company_info"]
    content_db = extracted["content_db"]
    denominations = extracted.get("denominations", {})
    target_date: datetime = extracted["target_date"]

    leads = []
    for siret, events in sorted(actions_by_siret.items()):
        info = company_info.get(siret, {})
        content_visited = _build_content_visited(events, content_db)
        themes = _collect_all_themes(content_visited)

        first_seen = events[0]["event_date"]
        last_seen = events[-1]["event_date"]
        time_spent_minutes = max(1, int((last_seen - first_seen).total_seconds() / 60))

        leads.append({
            "date": target_date.strftime("%Y-%m-%d"),
            "siret": siret,
            "denomination": denominations.get(siret, ""),
            "naf_section": info.get("naf_section", ""),
            "naf_code": info.get("naf_code", ""),
            "region": info.get("region", ""),
            "workforce_min": info.get("workforce_min"),
            "workforce_max": info.get("workforce_max"),
            "first_seen": first_seen.isoformat(),
            "last_seen": last_seen.isoformat(),
            "time_spent_minutes": time_spent_minutes,
            "themes": themes,
            "content_visited": content_visited,
            "contact": PLACEHOLDER_CONTACT,
            "actions": [
                {
                    "datetime": ev["event_date"].isoformat(),
                    "event": ev["event_name"],
                    "label": _parse_action_label(ev),
                }
                for ev in events
            ],
        })

    return leads


def build_md(extracted: dict) -> str:
    actions_by_siret = extracted["siret_events_by_siret"]
    target_date: datetime = extracted["target_date"]

    lines = [f"# Leads du {target_date.strftime('%Y-%m-%d')}\n"]

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


# ─── Entry point ────────────────────────────────────────────────────────────


if __name__ == "__main__":
    target_date = None
    output_stem = None

    args = sys.argv[1:]
    if "--date" in args:
        idx = args.index("--date")
        target_date = datetime.strptime(args[idx + 1], "%Y-%m-%d")
    if "--output" in args:
        idx = args.index("--output")
        output_stem = args[idx + 1]

    if target_date is None:
        target_date = datetime.now() - timedelta(days=1)

    if output_stem is None:
        output_stem = f"leads_{target_date.strftime('%Y-%m-%d')}"

    extracted = extract_daily_leads(target_date)

    md_path = f"{output_stem}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(build_md(extracted))
    print(f"▶ MD report written to {md_path}")

    json_path = f"{output_stem}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(build_json(extracted), f, ensure_ascii=False, indent=2)
    print(f"▶ JSON report written to {json_path}")
