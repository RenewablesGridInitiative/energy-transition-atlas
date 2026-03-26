#!/usr/bin/env python3
"""Backfill missing descriptions for RGI practices in practices_master.csv.

For RGI practices (renewables-grid.eu URLs): scrapes each practice page and
extracts the first meaningful paragraph from the main content area.

Panorama practices (panorama.solutions URLs) are skipped here because
Cloudflare blocks Python requests — use Chrome MCP tools or the browser
JS approach from scrape_panorama.py instead.

Usage:
    python3 scrape_descriptions.py              # Scrape and update CSV
    python3 scrape_descriptions.py --dry-run    # Preview without writing
"""

import csv
import sys
import time
import requests
from bs4 import BeautifulSoup

CSV_PATH = "practices_master.csv"
DRY_RUN = "--dry-run" in sys.argv

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}


def scrape_rgi_description(url):
    """Scrape the first meaningful paragraph from an RGI practice page."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
    except Exception as e:
        print(f"    FETCH ERROR: {e}")
        return ""

    soup = BeautifulSoup(r.text, "html.parser")

    # Try multiple selectors for the main content area
    selectors = [
        ".entry-content p",
        ".wp-block-paragraph",
        "article p",
        ".post-content p",
        "main p",
        ".content p",
    ]

    for selector in selectors:
        paras = soup.select(selector)
        for p in paras:
            text = p.get_text(strip=True)
            # Skip short metadata, navigation, or boilerplate paragraphs
            skip_starts = ("Share", "Organisation:", "Country:", "Year:", "Infrastructure:", "Topic:")
            if len(text) > 60 and not any(text.startswith(s) for s in skip_starts) and "cookie" not in text.lower():
                # Truncate to ~500 chars at a word boundary
                if len(text) > 500:
                    text = text[:497].rsplit(" ", 1)[0] + "..."
                return text

    # Fallback: try meta description
    meta = soup.find("meta", attrs={"name": "description"})
    if meta and meta.get("content", "").strip():
        text = meta["content"].strip()
        if len(text) > 30:
            return text[:500]

    return ""


def main():
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    empty_desc = [r for r in rows if not r.get("desc", "").strip()]
    rgi_empty = [r for r in empty_desc if "renewables-grid.eu" in r.get("url", "")]
    panorama_empty = [r for r in empty_desc if "panorama.solutions" in r.get("url", "")]
    other_empty = [r for r in empty_desc if r not in rgi_empty and r not in panorama_empty]

    print(f"Total practices: {len(rows)}")
    print(f"Empty descriptions: {len(empty_desc)}")
    print(f"  RGI (scrapable): {len(rgi_empty)}")
    print(f"  Panorama (Cloudflare-blocked, skipped): {len(panorama_empty)}")
    print(f"  Other: {len(other_empty)}")
    print()

    if DRY_RUN:
        print("DRY RUN — will not write to CSV")
        print()

    updated = 0
    skipped = 0
    failed = 0

    for i, row in enumerate(rgi_empty):
        title = row["title"][:60]
        url = row["url"]
        print(f"[{i+1}/{len(rgi_empty)}] {title}")

        # Skip old-style URLs that may not resolve
        if "database.html?detail=" in url:
            print(f"    SKIP: old-style URL")
            skipped += 1
            continue

        desc = scrape_rgi_description(url)
        if desc:
            if not DRY_RUN:
                row["desc"] = desc
            updated += 1
            print(f"    OK: {desc[:80]}...")
        else:
            failed += 1
            print(f"    FAILED: no description found")

        # Be polite — don't hammer the server
        time.sleep(0.5)

    print()
    print(f"Results: {updated} updated, {skipped} skipped, {failed} failed")

    if not DRY_RUN and updated > 0:
        with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        print(f"Wrote {CSV_PATH}")
        print("Run: python3 csv_to_jsx.py  to sync into JSX")
    elif DRY_RUN:
        print("(dry run — no changes written)")


if __name__ == "__main__":
    main()
