#!/usr/bin/env python3.11
"""
Scrape Enhancement & Restoration Projects from the OCEaN (Offshore Coalition
for Energy and Nature) database at offshore-coalition.eu.

OCEaN is a WordPress site without Cloudflare — direct HTTP requests work fine.

Usage
-----
    python3.11 scrape_ocean.py            # scrape and merge into CSV
    python3.11 scrape_ocean.py --dry-run  # preview without writing

    # Then rebuild JSX data:
    python3.11 csv_to_jsx.py
"""

import csv
import re
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ── Paths ──
CSV_PATH = Path(__file__).parent / "practices_master.csv"

# ── Config ──
SITEMAP_URL = "https://offshore-coalition.eu/oc_db_project-sitemap.xml"
USER_AGENT = "Mozilla/5.0 (compatible; ETA-Scraper/1.0; +https://beston54.github.io/energy-transition-atlas/)"
REQUEST_DELAY = 1  # seconds between requests

# ── CSV columns ──
COLUMNS = [
    "id", "title", "url", "brand", "theme", "topic", "inf", "year",
    "country", "org", "desc", "img", "award",
]


# ── Title normalization (matches build_master_csv.py) ──
def normalize_title_for_dedup(title: str) -> str:
    """Normalize a title for duplicate detection.

    Strips punctuation variants (en-dash, em-dash, hyphens, colons),
    collapses whitespace, lowercases.
    """
    t = title.lower()
    t = re.sub(r'[\u2010-\u2015\u2212\-\u2013\u2014\u2011]', ' ', t)
    t = re.sub(r'[:"\'()\u201c\u201d\u2018\u2019\u00ab\u00bb]', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


# ── Theme/topic classification ──
def classify_project(title: str, desc: str) -> tuple[str, str]:
    """Return (theme, topic) based on project content."""
    text = f"{title} {desc}".lower()

    # Planning: spatial planning, policy, EIA
    if any(w in text for w in ["spatial planning", "marine spatial",
                                "policy", "regulation", "framework",
                                "environmental impact assessment", "eia"]):
        return "Planning", "Nature Conservation & Restoration"

    # Technology: specific tech innovation (3D printing, sensors, AI)
    if any(w in text for w in ["3d print", "sensor", "monitoring system",
                                "technology readiness", "artificial reef",
                                "innovative", "prototype"]):
        return "Technology", "Nature Conservation & Restoration"

    # Default: Nature (marine restoration/conservation focus)
    if any(w in text for w in ["restor", "reef", "seagrass", "habitat",
                                "biodiversity", "species", "ecosystem",
                                "conservation", "oyster", "coral",
                                "mussel", "fish"]):
        return "Nature", "Nature Conservation & Restoration"

    return "Nature", "Nature Conservation & Restoration"


def classify_infrastructure(title: str, desc: str, inf_type: str) -> str:
    """Determine infrastructure type from page metadata and content."""
    text = f"{title} {desc} {inf_type}".lower()
    if "cable" in text:
        return "Offshore wind"
    if "offsite" in text or "off-site" in text:
        return "Offshore wind"
    if "grid" in text or "substation" in text:
        return "Offshore wind"
    # Default for OCEaN projects
    return "Offshore wind"


# ── Sitemap fetching ──
def fetch_sitemap_urls() -> list[str]:
    """Fetch all project URLs from the OCEaN sitemap."""
    print(f"Fetching sitemap: {SITEMAP_URL}")
    resp = requests.get(SITEMAP_URL, headers={"User-Agent": USER_AGENT}, timeout=30)
    resp.raise_for_status()

    root = ET.fromstring(resp.content)
    # XML namespace for sitemaps
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [loc.text.strip() for loc in root.findall(".//sm:loc", ns) if loc.text]
    print(f"  Found {len(urls)} project URLs")
    return urls


# ── Page scraping ──
def scrape_project_page(url: str) -> dict | None:
    """Scrape a single OCEaN project page. Returns dict or None on failure."""
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  WARNING: Failed to fetch {url}: {e}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")

    # Title: prefer h1, fall back to og:title
    h1 = soup.find("h1")
    og_title = soup.find("meta", property="og:title")
    title = ""
    if h1:
        title = h1.get_text(strip=True)
    elif og_title:
        title = og_title["content"].replace(" - OCEaN", "").strip()
    if not title:
        print(f"  WARNING: No title found at {url}")
        return None

    # Image: og:image meta tag
    og_image = soup.find("meta", property="og:image")
    img = og_image["content"] if og_image else ""

    # Metadata fields: divs with class "font-bold text-secondary" followed by sibling
    meta = {}
    for label_div in soup.find_all("div", class_="font-bold"):
        classes = label_div.get("class", [])
        if "text-secondary" not in classes:
            continue
        label = label_div.get_text(strip=True).rstrip(":")
        val_div = label_div.find_next_sibling("div")
        if val_div:
            meta[label.lower()] = val_div.get_text(strip=True)

    country = meta.get("country", "")
    org = meta.get("implemented by", "")
    location = meta.get("location", "")  # basin/sea
    inf_type = meta.get("type of infrastructure", "")
    period = meta.get("implementation period", "")

    # Year: extract start year from implementation period (e.g. "2023-2027")
    year = ""
    if period:
        year_match = re.search(r"(\d{4})", period)
        if year_match:
            year = year_match.group(1)

    # Description: first content from "Objectives" or "Short description" h2
    desc = ""
    for h2 in soup.find_all("h2"):
        h2_text = h2.get_text(strip=True).lower()
        if "objective" in h2_text or "short description" in h2_text:
            # Collect all following sibling p/ul/ol elements
            parts = []
            for sib in h2.find_next_siblings():
                if sib.name in ("h2", "h1"):
                    break
                text = sib.get_text(strip=True)
                if text:
                    parts.append(text)
            desc = " ".join(parts)
            break

    # Truncate description
    if len(desc) > 500:
        desc = desc[:497] + "..."

    # If no country but we have location/basin, use that
    if not country and location:
        country = location

    return {
        "title": title,
        "url": url,
        "img": img,
        "country": country,
        "org": org,
        "year": year,
        "desc": desc,
        "inf_type": inf_type,
        "location": location,
    }


# ── CSV operations ──
def load_csv() -> tuple[list[str], list[dict]]:
    """Load existing CSV. Returns (fieldnames, rows)."""
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)
    return fieldnames, rows


def save_csv(fieldnames: list[str], rows: list[dict]):
    """Write rows back to CSV."""
    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def find_rebrand_candidates(rows: list[dict]) -> dict[str, int]:
    """Find existing RGI practices that might be OCEaN-sourced.

    Returns {normalized_title: row_index} for RGI practices with
    inf='Offshore wind' or topic containing 'Offshore'.
    """
    candidates = {}
    for i, row in enumerate(rows):
        if row["brand"] != "RGI":
            continue
        if (row.get("inf", "") == "Offshore wind" or
                "offshore" in row.get("topic", "").lower()):
            norm = normalize_title_for_dedup(row["title"])
            candidates[norm] = i
    return candidates


def merge_projects(projects: list[dict], dry_run: bool = False) -> tuple[int, int]:
    """Merge scraped projects into CSV. Returns (added, rebranded) counts."""
    fieldnames, rows = load_csv()

    # Build normalized title set for dedup
    existing_titles = {normalize_title_for_dedup(r["title"]): i
                       for i, r in enumerate(rows)}

    # Find RGI offshore practices that could be re-branded
    rebrand_candidates = find_rebrand_candidates(rows)

    # Next available ID
    max_id = max(int(r["id"]) for r in rows)
    next_id = max_id + 1

    added = 0
    rebranded = 0
    skipped_dup = 0

    for proj in projects:
        title = proj["title"]
        norm_title = normalize_title_for_dedup(title)

        # Check for exact title match in existing data
        if norm_title in existing_titles:
            idx = existing_titles[norm_title]
            existing_row = rows[idx]
            if existing_row["brand"] == "RGI":
                # Re-brand from RGI to OCEaN
                if dry_run:
                    print(f"  REBRAND: [{existing_row['id']}] {existing_row['title']}")
                else:
                    rows[idx]["brand"] = "OCEaN"
                    # Update URL to OCEaN source if the RGI one is broken/old
                    if proj["url"]:
                        rows[idx]["url"] = proj["url"]
                    # Update image if we have a better one
                    if proj["img"] and not existing_row.get("img"):
                        rows[idx]["img"] = proj["img"]
                    # Update description if empty
                    if proj["desc"] and not existing_row.get("desc"):
                        rows[idx]["desc"] = proj["desc"]
                rebranded += 1
            else:
                skipped_dup += 1
            continue

        # Check for fuzzy match against offshore RGI practices
        matched = False
        for cand_title, cand_idx in rebrand_candidates.items():
            # Check if one title contains the other (fuzzy match)
            if (norm_title in cand_title or cand_title in norm_title) and \
               len(norm_title) > 10 and len(cand_title) > 10:
                existing_row = rows[cand_idx]
                if dry_run:
                    print(f"  REBRAND (fuzzy): [{existing_row['id']}] "
                          f"{existing_row['title']} <-> {title}")
                else:
                    rows[cand_idx]["brand"] = "OCEaN"
                    if proj["url"]:
                        rows[cand_idx]["url"] = proj["url"]
                    if proj["img"] and not existing_row.get("img"):
                        rows[cand_idx]["img"] = proj["img"]
                    if proj["desc"] and not existing_row.get("desc"):
                        rows[cand_idx]["desc"] = proj["desc"]
                rebranded += 1
                matched = True
                break

        if matched:
            continue

        # New practice — classify and add
        theme, topic = classify_project(title, proj["desc"])
        inf = classify_infrastructure(title, proj["desc"], proj.get("inf_type", ""))

        new_row = {
            "id": str(next_id),
            "title": title,
            "url": proj["url"],
            "brand": "OCEaN",
            "theme": theme,
            "topic": topic,
            "inf": inf,
            "year": proj["year"],
            "country": proj["country"],
            "org": proj["org"],
            "desc": proj["desc"],
            "img": proj["img"],
            "award": "false",
        }

        if dry_run:
            print(f"  ADD: [{next_id}] {title} ({theme}/{topic})")
        else:
            rows.append(new_row)

        existing_titles[norm_title] = len(rows) - 1
        next_id += 1
        added += 1

    if not dry_run:
        save_csv(fieldnames, rows)

    print(f"\nResults:")
    print(f"  Projects scraped:     {len(projects)}")
    print(f"  Added to CSV:         {added}")
    print(f"  Re-branded RGI->OCEaN: {rebranded}")
    print(f"  Skipped (duplicate):  {skipped_dup}")
    print(f"  Total practices:      {len(rows) + (added if dry_run else 0)}")

    return added, rebranded


# ── Main ──
def main():
    import argparse
    parser = argparse.ArgumentParser(
        description="Scrape OCEaN offshore projects for ETA")
    parser.add_argument("--dry-run", action="store_true",
                        help="Preview changes without writing to CSV")
    args = parser.parse_args()

    # Step 1: Fetch sitemap
    urls = fetch_sitemap_urls()

    # Step 2: Scrape each project page
    projects = []
    for i, url in enumerate(urls):
        print(f"  [{i+1}/{len(urls)}] Scraping {url.split('/')[-2]}")
        proj = scrape_project_page(url)
        if proj:
            projects.append(proj)
        else:
            print(f"    Skipped (failed to load)")
        if i < len(urls) - 1:
            time.sleep(REQUEST_DELAY)

    print(f"\nSuccessfully scraped {len(projects)}/{len(urls)} projects")

    # Step 3: Merge into CSV
    added, rebranded = merge_projects(projects, dry_run=args.dry_run)

    if not args.dry_run and (added > 0 or rebranded > 0):
        print(f"\nNext step: python3.11 csv_to_jsx.py")
    elif args.dry_run:
        print(f"\nDry run complete. Run without --dry-run to apply changes.")


if __name__ == "__main__":
    main()
