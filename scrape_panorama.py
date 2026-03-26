#!/usr/bin/env python3.11
"""
Scrape energy-transition-related solutions from the IUCN PANORAMA database.

PANORAMA (panorama.solutions) is protected by Cloudflare, which blocks direct
HTTP requests.  This script uses a two-phase approach:

  Phase 1 — Browser extraction (manual)
    Open the browser console on panorama.solutions/en/explore-solutions and
    paste the JavaScript snippet printed by  `--print-js`.  The snippet fetches
    all solutions in the PANORAMA Mitigation community, visits each solution
    page, and copies a JSON array to the clipboard.

  Phase 2 — CSV merge (automated)
    Paste the JSON into  panorama_raw.json  and run this script without flags.
    It filters for energy-relevant solutions, maps fields to the ETA CSV
    schema, and appends them to practices_master.csv.

Usage
-----
    # Step 1: print the browser JS snippet
    python3.11 scrape_panorama.py --print-js

    # Step 2: after pasting JSON into panorama_raw.json
    python3.11 scrape_panorama.py

    # Step 3: rebuild the JSX data
    python3.11 csv_to_jsx.py
"""

import argparse
import csv
import json
import re
import sys
from pathlib import Path

# ── Paths ──
RAW_JSON = Path(__file__).parent / "panorama_raw.json"
CSV_PATH = Path(__file__).parent / "practices_master.csv"

# ── Energy-relevance keywords (case-insensitive) ──
# Solutions whose title or description match any of these are kept.
ENERGY_KEYWORDS = re.compile(
    r"(?i)\b("
    r"renewable|solar|wind|hydro|geothermal|biomass|biogas|bioenergy|"
    r"photovoltaic|turbine|electricity|power\s*grid|power\s*line|"
    r"transmission|energy\s*transition|energy\s*efficiency|"
    r"clean\s*energy|green\s*energy|low.carbon|decarboni[sz]|"
    r"off.grid|mini.grid|microgrid|grid\s*integration|"
    r"energy\s*storage|battery|hydrogen|fuel\s*cell|"
    r"climate\s*mitigation|carbon\s*reduction|emission|"
    r"energy\s*access|energy\s*poverty|cookstove|clean\s*cooking|"
    r"electric\s*vehicle|e.mobility|charging\s*station"
    r")\b"
)

# ── Theme classification ──
def classify_theme(title: str, desc: str) -> str:
    """Assign an ETA theme based on keywords in title/description."""
    text = f"{title} {desc}".lower()
    if any(w in text for w in ["bird", "wildlife", "biodiversity", "species",
                                "habitat", "ecosystem", "nature", "marine",
                                "coral", "forest", "wetland", "mangrove"]):
        return "Nature"
    if any(w in text for w in ["community", "stakeholder", "indigenous",
                                "gender", "livelihood", "acceptance",
                                "engagement", "participat"]):
        return "People"
    if any(w in text for w in ["planning", "governance", "policy", "regulation",
                                "framework", "strategy", "assessment"]):
        return "Planning"
    return "Technology"


def classify_topic(title: str, desc: str, theme: str) -> str:
    """Assign an ETA topic based on keywords."""
    text = f"{title} {desc}".lower()
    if "bird" in text or "avian" in text:
        return "Bird Protection"
    if "solar" in text or "photovoltaic" in text:
        return "Solar Energy"
    if "wind" in text and ("offshore" in text or "marine" in text):
        return "Offshore Wind"
    if "wind" in text:
        return "Wind Energy"
    if "hydro" in text or "hydropower" in text:
        return "Hydropower"
    if "grid" in text or "transmission" in text or "power line" in text:
        return "Grid Infrastructure"
    if "storage" in text or "battery" in text or "hydrogen" in text:
        return "Energy Storage"
    if "cookstove" in text or "cooking" in text or "energy access" in text:
        return "Energy Access"
    if "efficiency" in text:
        return "Energy Efficiency"
    if "biogas" in text or "biomass" in text or "bioenergy" in text:
        return "Bioenergy"
    if "climate" in text or "mitigation" in text or "carbon" in text:
        return "Climate Adaptation & Resilience"
    if theme == "People":
        return "Public Acceptance & Engagement"
    if theme == "Planning":
        return "Advocating for Optimised Grids"
    return "Climate Adaptation & Resilience"


def classify_infrastructure(title: str, desc: str) -> str:
    """Assign an infrastructure type."""
    text = f"{title} {desc}".lower()
    if "offshore" in text:
        return "Offshore wind"
    if "solar" in text or "photovoltaic" in text:
        return "Solar"
    if "wind" in text:
        return "Onshore wind"
    if "grid" in text or "transmission" in text or "power line" in text:
        return "Grids"
    if "hydro" in text:
        return "Hydropower"
    return ""


# ── Browser JS snippet ──
BROWSER_JS = r"""
// ─── PANORAMA Scraper — paste in browser console on panorama.solutions ───
// Fetches all solutions from PANORAMA Mitigation community, then scrapes
// each solution page for title, description, image, country, and org.
// Result is copied to clipboard as JSON.

(async function() {
  const BASE = 'https://panorama.solutions';

  // 1. Fetch all solution nids from the Mitigation community via Views AJAX
  //    The explore-solutions page uses Drupal Views with AJAX pagination.
  //    We use the map REST endpoint which returns all results at once.
  console.log('Fetching solution list from Mitigation community...');

  // Get solutions filtered by Mitigation community (id 11173)
  // We need to use the Views AJAX endpoint with the facet filter
  let allNids = new Set();
  let page = 0;
  let hasMore = true;

  // Use the map endpoint with multiple relevant keywords to cast a wide net
  const keywords = [
    'renewable energy', 'solar', 'wind power', 'hydropower',
    'energy transition', 'electricity', 'power grid', 'transmission',
    'clean energy', 'biogas', 'biomass', 'energy efficiency',
    'off-grid', 'mini-grid', 'energy storage', 'battery',
    'clean cooking', 'cookstove', 'energy access',
    'carbon reduction', 'emission reduction', 'climate mitigation',
    'decarbonization', 'low carbon', 'green energy',
    'electric vehicle', 'hydrogen', 'fuel cell', 'geothermal',
    'photovoltaic', 'turbine'
  ];

  let allSolutions = {};

  for (const kw of keywords) {
    try {
      const url = `${BASE}/en/rest/explore-solution/json/map?keyword=${encodeURIComponent(kw)}&field_ecosystem=All&sort_by=changed&sort_order=DESC`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.features) {
        for (const f of data.features) {
          allSolutions[f.properties.nid] = {
            nid: f.properties.nid,
            title: f.properties.title.trim(),
            coords: f.geometry.type === 'Point' ? f.geometry.coordinates : (f.geometry.coordinates?.[0] || null)
          };
        }
      }
      console.log(`  "${kw}": ${data.features?.length || 0} results (${Object.keys(allSolutions).length} unique total)`);
    } catch(e) {
      console.warn(`  "${kw}" failed:`, e.message);
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 300));
  }

  const nids = Object.keys(allSolutions);
  console.log(`\nFound ${nids.length} unique solutions. Scraping details...`);

  // 2. Scrape each solution page for details
  const results = [];
  let i = 0;

  for (const nid of nids) {
    i++;
    const sol = allSolutions[nid];
    try {
      // Fetch the solution page HTML
      const pageResp = await fetch(`${BASE}/en/node/${nid}`);
      const html = await pageResp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract URL (canonical or from the page)
      const canonical = doc.querySelector('link[rel="canonical"]');
      const url = canonical ? canonical.getAttribute('href') : `${BASE}/en/node/${nid}`;

      // Extract description (intro/summary text)
      const introEl = doc.querySelector('.field--name-field-solution-what-is-your-sol, .field--name-body, .solution-intro__text, article p');
      const desc = introEl ? introEl.textContent.trim().substring(0, 500) : '';

      // Extract image
      const imgEl = doc.querySelector('.field--name-field-media-preview-image img, .solution-hero img, article img');
      const img = imgEl ? (imgEl.getAttribute('src') || '') : '';
      const fullImg = img.startsWith('/') ? BASE + img : img;

      // Extract country from location field
      const locEl = doc.querySelector('.field--name-field-location, .solution-meta__location');
      const country = locEl ? locEl.textContent.trim().replace(/^Location:?\s*/i, '') : '';

      // Extract organisation
      const orgEl = doc.querySelector('.field--name-field-provider-organisation, .solution-provider__name, .solution-teaser__author');
      const org = orgEl ? orgEl.textContent.trim().replace(/^by\s+/i, '') : '';

      // Extract themes/tags
      const tagEls = doc.querySelectorAll('.field--name-field-theme .field__item, .taxonomy-term-reference a');
      const tags = Array.from(tagEls).map(t => t.textContent.trim());

      results.push({
        nid: parseInt(nid),
        title: sol.title,
        url: url,
        desc: desc,
        img: fullImg,
        country: country,
        org: org,
        tags: tags,
        coords: sol.coords
      });

      if (i % 10 === 0) console.log(`  Scraped ${i}/${nids.length}...`);
    } catch(e) {
      console.warn(`  Failed nid ${nid}: ${e.message}`);
      results.push({
        nid: parseInt(nid),
        title: sol.title,
        url: `${BASE}/en/node/${nid}`,
        desc: '', img: '', country: '', org: '', tags: [], coords: sol.coords
      });
    }

    // Rate limit: 500ms between requests
    await new Promise(r => setTimeout(r, 500));
  }

  // 3. Copy to clipboard
  const json = JSON.stringify(results, null, 2);
  await navigator.clipboard.writeText(json);
  console.log(`\nDone! ${results.length} solutions copied to clipboard.`);
  console.log('Paste into panorama_raw.json and run: python3.11 scrape_panorama.py');

  // Also store in window for inspection
  window.__panoramaResults = results;
})();
"""


def print_js():
    """Print the browser JS snippet."""
    print("=" * 72)
    print("PANORAMA Browser Scraper")
    print("=" * 72)
    print()
    print("1. Open https://panorama.solutions/en/explore-solutions in Chrome")
    print("2. Open DevTools (Cmd+Option+J / F12)")
    print("3. Paste the following JavaScript into the Console tab:")
    print()
    print("-" * 72)
    print(BROWSER_JS)
    print("-" * 72)
    print()
    print("4. Wait for it to finish (may take 2-5 minutes)")
    print("5. The JSON is now on your clipboard")
    print(f"6. Create {RAW_JSON} and paste the JSON content")
    print("7. Run: python3.11 scrape_panorama.py")
    print("8. Run: python3.11 csv_to_jsx.py")


def load_existing_ids() -> set:
    """Load existing practice IDs from the CSV."""
    ids = set()
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            ids.add(int(row["id"]))
    return ids


def load_existing_titles() -> set:
    """Load existing practice titles for dedup."""
    titles = set()
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            titles.add(row["title"].strip().lower())
    return titles


def next_id() -> int:
    """Get the next available practice ID."""
    max_id = 0
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            max_id = max(max_id, int(row["id"]))
    return max_id + 1


def merge_into_csv(solutions: list[dict]) -> int:
    """Filter energy-relevant solutions and append to CSV. Returns count added."""
    existing_titles = load_existing_titles()
    current_id = next_id()
    added = 0
    skipped_relevance = 0
    skipped_dup = 0

    # Read existing rows to append
    rows = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            rows.append(row)

    for sol in solutions:
        title = sol.get("title", "").strip()
        desc = sol.get("desc", "").strip()
        url = sol.get("url", "").strip()

        # Skip if no title
        if not title:
            continue

        # Energy relevance filter
        search_text = f"{title} {desc} {' '.join(sol.get('tags', []))}"
        if not ENERGY_KEYWORDS.search(search_text):
            skipped_relevance += 1
            continue

        # Dedup by title
        if title.lower() in existing_titles:
            skipped_dup += 1
            continue

        theme = classify_theme(title, desc)
        topic = classify_topic(title, desc, theme)
        inf = classify_infrastructure(title, desc)
        country = sol.get("country", "").strip()
        org = sol.get("org", "").strip()
        img = sol.get("img", "").strip()

        # Truncate description to reasonable length
        if len(desc) > 400:
            desc = desc[:397] + "..."

        row = {
            "id": str(current_id),
            "title": title,
            "url": url,
            "brand": "Panorama",
            "theme": theme,
            "topic": topic,
            "inf": inf,
            "year": "",
            "country": country,
            "org": org,
            "desc": desc,
            "img": img,
            "award": "false",
        }
        rows.append(row)
        existing_titles.add(title.lower())
        current_id += 1
        added += 1

    # Write back
    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nResults:")
    print(f"  Total solutions in JSON:  {len(solutions)}")
    print(f"  Skipped (not energy):     {skipped_relevance}")
    print(f"  Skipped (duplicate title): {skipped_dup}")
    print(f"  Added to CSV:             {added}")
    print(f"  New total practices:      {len(rows)}")

    return added


def main():
    parser = argparse.ArgumentParser(description="Scrape PANORAMA solutions for ETA")
    parser.add_argument("--print-js", action="store_true",
                        help="Print the browser JS snippet and exit")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show what would be added without writing")
    parser.add_argument("--input", type=str, default=str(RAW_JSON),
                        help=f"Path to raw JSON file (default: {RAW_JSON})")
    args = parser.parse_args()

    if args.print_js:
        print_js()
        return

    json_path = Path(args.input)
    if not json_path.exists():
        print(f"Error: {json_path} not found.")
        print(f"Run  python3.11 {__file__} --print-js  for instructions.")
        sys.exit(1)

    with open(json_path, encoding="utf-8") as f:
        solutions = json.load(f)

    print(f"Loaded {len(solutions)} solutions from {json_path}")

    if args.dry_run:
        # Just show what would be added
        energy_count = 0
        for sol in solutions:
            text = f"{sol.get('title', '')} {sol.get('desc', '')} {' '.join(sol.get('tags', []))}"
            if ENERGY_KEYWORDS.search(text):
                energy_count += 1
                print(f"  + {sol.get('title', '?')}")
        print(f"\n{energy_count}/{len(solutions)} solutions are energy-relevant")
        return

    added = merge_into_csv(solutions)
    if added > 0:
        print(f"\nNext step: python3.11 csv_to_jsx.py")
    else:
        print("\nNo new practices added.")


if __name__ == "__main__":
    main()
