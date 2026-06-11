"""
Generate per-company anonymous statistics for the sector stats dashboard.
Outputs libs/data/static/sector_stats.json.

One record per unique company (SIRET) that registered on the site, containing
their NAF profile, content visited, themes explored, and operator conversions.
All stats (global vs subset comparison) are computed client-side.

Usage:
    python -m etl.pipelines.sector_stats_pipeline
    python -m etl.pipelines.sector_stats_pipeline --output /path/to/sector_stats.json
"""
import json
import sys
from collections import defaultdict
from datetime import datetime
from urllib.parse import urlparse

from etl.tools.db_manager import DBManager


def _slug_from_url(url: str) -> str:
    if not url:
        return ""
    path = urlparse(url).path.rstrip("/")
    parts = path.split("/")
    return parts[-1] if parts else ""


def _split_themes(raw: str) -> list[str]:
    """Split ' | '-separated themes string into a list, stripping blanks."""
    if not raw:
        return []
    return [t.strip() for t in raw.split("|") if t.strip()]


class SectorStatsPipeline:
    def run(self, output_path: str) -> None:
        print("Connecting to database…")
        db = DBManager()

        print("  Fetching company profiles…")
        companies_rows = self._fetch_companies(db)

        print("  Fetching content visits…")
        content_rows = self._fetch_content(db)

        print("  Fetching external click operators…")
        click_op_rows = self._fetch_click_operators(db)

        print("  Fetching opportunity operators…")
        opp_op_rows = self._fetch_opportunity_operators(db)

        print("  Fetching program metadata…")
        program_rows = self._fetch_programs(db)

        print("  Fetching project metadata…")
        project_rows = self._fetch_projects(db)

        print("  Fetching date range…")
        date_range = self._fetch_date_range(db)

        print("  Assembling records…")
        result = self._assemble(
            companies_rows, content_rows, click_op_rows, opp_op_rows,
            program_rows, project_rows, date_range
        )

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        n = len(result["companies"])
        print(f"▶ {n} company records written to {output_path}")

    # ── DB fetchers ──────────────────────────────────────────────────────────

    def _fetch_companies(self, db: DBManager) -> list:
        """One row per unique SIRET that registered, with their company profile."""
        return db.query("""
            SELECT
                c.siret,
                COALESCE(c.naf_section, '') AS naf_section,
                COALESCE(c.naf_division, '') AS naf_division,
                COALESCE(c.naf_group, '') AS naf_group,
                COALESCE(c.naf_class, '') AS naf_class,
                COALESCE(c.naf_code, '') AS naf_code,
                COALESCE(c.region, '') AS region,
                c.workforce_min,
                c.workforce_max,
                DATE(MIN(w.date)) AS first_seen
            FROM __SCHEMA_NAME__.web_registered_siret w
            JOIN __SCHEMA_NAME__.companies c ON c.siret = w.siret
            GROUP BY
                c.siret, c.naf_section, c.naf_division, c.naf_group,
                c.naf_class, c.naf_code, c.region, c.workforce_min, c.workforce_max
        """)

    def _fetch_content(self, db: DBManager) -> list:
        """Distinct (siret, type, slug) tuples — one per unique content page visited."""
        return db.query("""
            SELECT DISTINCT
                siret,
                COALESCE(type, 'project') AS type,
                SUBSTRING(current_url FROM '[^/]+$') AS slug
            FROM __SCHEMA_NAME__.detail_page_view
            WHERE siret IS NOT NULL AND siret <> ''
              AND current_url IS NOT NULL AND current_url <> ''
        """)

    def _fetch_click_operators(self, db: DBManager) -> list:
        """Distinct (siret, operator) pairs from external link clicks on program pages."""
        return db.query("""
            SELECT DISTINCT e.siret, p.contact_operator
            FROM __SCHEMA_NAME__.external_link_clicked_events e
            JOIN __SCHEMA_NAME__.programs p
              ON p.slug = SUBSTRING(e.current_url FROM '[^/]+$')
            WHERE e.siret IS NOT NULL AND e.siret <> ''
              AND p.contact_operator IS NOT NULL AND p.contact_operator <> ''
        """)

    def _fetch_opportunity_operators(self, db: DBManager) -> list:
        """Distinct (siret, operator) pairs from opportunities."""
        return db.query("""
            SELECT DISTINCT company_siret, opportunity_operator
            FROM __SCHEMA_NAME__.opportunities
            WHERE company_siret IS NOT NULL AND company_siret <> ''
              AND opportunity_operator IS NOT NULL AND opportunity_operator <> ''
        """)

    def _fetch_programs(self, db: DBManager) -> list:
        return db.query("""
            SELECT slug, name, themes, COALESCE(contact_operator, '') AS contact_operator
            FROM __SCHEMA_NAME__.programs
            WHERE slug IS NOT NULL AND slug <> ''
        """)

    def _fetch_projects(self, db: DBManager) -> list:
        return db.query("""
            SELECT slug, name, COALESCE(themes, '') AS themes
            FROM __SCHEMA_NAME__.projects
            WHERE slug IS NOT NULL AND slug <> ''
        """)

    def _fetch_date_range(self, db: DBManager) -> dict:
        rows = db.query("""
            SELECT MIN(date)::date, MAX(date)::date
            FROM __SCHEMA_NAME__.web_registered_siret
        """)
        if rows and rows[0][0]:
            return {"first": str(rows[0][0]), "last": str(rows[0][1])}
        today = datetime.now().strftime("%Y-%m-%d")
        return {"first": today, "last": today}

    # ── Assembly ─────────────────────────────────────────────────────────────

    def _assemble(
        self,
        companies_rows, content_rows, click_op_rows, opp_op_rows,
        program_rows, project_rows, date_range
    ) -> dict:
        # Build content_meta: slug → {title, type, themes, operator?}
        content_meta: dict[str, dict] = {}
        for slug, name, themes_raw, operator in program_rows:
            content_meta[slug] = {
                "title": name,
                "type": "program",
                "themes": _split_themes(themes_raw),
                **({"operator": operator} if operator else {}),
            }
        for slug, name, themes_raw in project_rows:
            if slug not in content_meta:  # programs take precedence on slug clash
                content_meta[slug] = {
                    "title": name,
                    "type": "project",
                    "themes": _split_themes(themes_raw),
                }

        # Index per siret
        visited_by_siret: dict[str, dict[str, list]] = defaultdict(lambda: {"project": [], "program": []})
        for siret, content_type, slug in content_rows:
            if slug and slug in content_meta:
                bucket = content_type if content_type in ("project", "program") else "project"
                if slug not in visited_by_siret[siret][bucket]:
                    visited_by_siret[siret][bucket].append(slug)

        click_ops_by_siret: dict[str, set] = defaultdict(set)
        for siret, operator in click_op_rows:
            click_ops_by_siret[siret].add(operator)

        opp_ops_by_siret: dict[str, set] = defaultdict(set)
        for siret, operator in opp_op_rows:
            opp_ops_by_siret[siret].add(operator)

        # Build final company records (no SIRET in output — anonymous)
        companies = []
        for row in companies_rows:
            (siret, naf_section, naf_division, naf_group, naf_class, naf_code,
             region, wf_min, wf_max, first_seen) = row

            visited_projects = visited_by_siret[siret]["project"]
            visited_programs = visited_by_siret[siret]["program"]

            # Derive themes: union of themes from all visited content
            theme_set: set[str] = set()
            for slug in visited_projects + visited_programs:
                meta = content_meta.get(slug)
                if meta:
                    theme_set.update(meta["themes"])

            click_ops = sorted(click_ops_by_siret[siret])
            opp_ops = sorted(opp_ops_by_siret[siret])

            companies.append({
                "naf_section": naf_section,
                "naf_division": naf_division,
                "naf_group": naf_group,
                "naf_class": naf_class,
                "naf_code": naf_code,
                "region": region,
                "wf_min": wf_min,
                "wf_max": wf_max,
                "visited_projects": visited_projects,
                "visited_programs": visited_programs,
                "themes": sorted(theme_set),
                "has_external_click": len(click_ops) > 0,
                "has_opportunity": len(opp_ops) > 0,
                "external_click_operators": click_ops,
                "opportunity_operators": opp_ops,
                "first_seen": str(first_seen) if first_seen else "",
            })

        return {
            "generated_at": datetime.now().isoformat(),
            "date_range": date_range,
            "companies": companies,
            "content_meta": content_meta,
        }


if __name__ == "__main__":
    output_path = "sector_stats.json"
    args = sys.argv[1:]
    if "--output" in args:
        idx = args.index("--output")
        output_path = args[idx + 1]

    SectorStatsPipeline().run(output_path)
