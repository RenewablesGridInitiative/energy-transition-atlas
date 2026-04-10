#!/usr/bin/env python3.11
"""
Scrape blog posts from SafeLines4Birds (safelines4birds.eu) for the
Energy Transition Atlas.

SL4B is a Wix-hosted site. Blog posts describe real-world bird protection
practices (nesting platforms, bird flight diverters, sensitivity mapping, etc.).
Posts about events, brochures, and press releases are skipped.

Usage
-----
    python3.11 scrape_sl4b.py            # scrape and merge into CSV
    python3.11 scrape_sl4b.py --dry-run  # preview without writing

    # Then rebuild JSX data:
    python3.11 csv_to_jsx.py
"""

import argparse
import csv
import re
import time
import xml.etree.ElementTree as ET
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ── Paths ──
CSV_PATH = Path(__file__).parent / "practices_master.csv"

# ── Config ──
SITEMAP_INDEX_URL = "https://www.safelines4birds.eu/sitemap.xml"
BLOG_SITEMAP_URL = "https://www.safelines4birds.eu/blog-posts-sitemap.xml"
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
REQUEST_DELAY = 1.5  # seconds between requests

BRAND = "SL4B"
DEFAULT_THEME = "Nature"
DEFAULT_TOPIC = "Bird Protection"
DEFAULT_INF = "Grids"

# ── CSV columns ──
COLUMNS = [
    "id", "title", "url", "brand", "theme", "topic", "inf", "year",
    "country", "org", "desc", "img", "award",
]

# ── Countries to detect in title/description ──
COUNTRY_LIST = [
    "France", "Portugal", "Germany", "Spain", "Ukraine", "Belgium",
    "Netherlands", "Italy", "Greece", "Bulgaria", "Hungary", "Poland",
    "Romania", "Austria", "Croatia", "Czech Republic", "Slovakia",
    "Slovenia", "Serbia", "Switzerland", "Norway", "Sweden", "Denmark",
    "Finland", "Lithuania", "Latvia", "Estonia", "Ireland", "UK",
    "United Kingdom",
]

# ── Known organisations (TSOs, NGOs) mentioned in SL4B posts ──
KNOWN_ORGS = [
    "E-REDES", "RTE", "HOPS", "LPO", "EDP", "MAVIR", "Ukrenergo",
    "RED Eléctrica", "REE", "Elia", "TenneT", "Amprion", "50Hertz",
    "TransnetBW", "LIFE", "BirdLife", "Nabu", "RSPB", "SEO",
    "LPO PACA", "EMS", "NOS BiH",
]

# ── Keywords that indicate a NEWS/EVENT post (not a practice) ──
SKIP_KEYWORDS = [
    "brochure", "press release", "launch of", "conference held",
    "workshop held", "event held", "key takeaways", "key actions",
    "key principles",
]


def normalize_title_for_dedup(title: str) -> str:
    """Normalize a title for duplicate detection."""
    t = title.lower()
    t = re.sub(r'[\u2010-\u2015\u2212\-\u2013\u2014\u2011]', ' ', t)
    t = re.sub(r'[:"\'()\u201c\u201d\u2018\u2019\u00ab\u00bb]', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def is_practice_post(title: str, desc: str) -> bool:
    """Return True if the post describes an actual practice, not news/events."""
    text = f"{title} {desc}".lower()
    for kw in SKIP_KEYWORDS:
        if kw in text:
            return False
    return True


def extract_country(title: str, desc: str) -> str:
    """Extract country name from title and description text."""
    text = f"{title} {desc}"
    found = []
    for c in COUNTRY_LIST:
        if c.lower() in text.lower():
            found.append(c)
    if found:
        return ", ".join(found[:2])  # Cap at 2 countries
    # Check for Brussels -> Belgium
    if "brussels" in text.lower():
        return "Belgium"
    return "Europe"  # Fallback for pan-European posts


def extract_org(title: str, body_text: str) -> str:
    """Extract organisation name from body text."""
    text = f"{title} {body_text}"
    for org in KNOWN_ORGS:
        if org in text:
            return org
    return "SafeLines4Birds"


def classify_topic(title: str, desc: str) -> str:
    """Classify more specific topic from content."""
    text = f"{title} {desc}".lower()
    if any(w in text for w in ["nesting", "nest platform", "nest box"]):
        return "Bird Protection"
    if any(w in text for w in ["diverter", "flight diverter", "bfd"]):
        return "Bird Protection"
    if any(w in text for w in ["sensitivity map", "collision map", "risk map"]):
        return "Bird Protection, Monitoring & Reporting"
    if any(w in text for w in ["gps track", "tracking", "telemetry"]):
        return "Bird Protection, Monitoring & Reporting"
    if any(w in text for w in ["training", "capacity building", "awareness"]):
        return "Bird Protection, Creating Awareness & Capacity Building"
    if any(w in text for w in ["electrocution", "insulation"]):
        return "Bird Protection"
    return "Bird Protection"


# ── Sitemap fetching ──
def fetch_blog_urls() -> list[str]:
    """Fetch blog post URLs from the SL4B sitemap."""
    print(f"Fetching blog sitemap: {BLOG_SITEMAP_URL}")
    resp = requests.get(BLOG_SITEMAP_URL, headers={"User-Agent": USER_AGENT}, timeout=30)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")
    urls = [loc.text.strip() for loc in soup.find_all("loc") if loc.text]
    print(f"  Found {len(urls)} blog post URLs")
    return urls


# ── Page scraping ──
def scrape_blog_post(url: str) -> dict | None:
    """Scrape a single SL4B blog post. Returns dict or None on failure."""
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        print(f"  WARNING: Failed to fetch {url}: {e}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")

    # Title from og:title
    og_title = soup.find("meta", property="og:title")
    title = og_title["content"].strip() if og_title and og_title.get("content") else ""
    if not title:
        h1 = soup.find("h1")
        title = h1.get_text(strip=True) if h1 else ""
    if not title:
        print(f"  WARNING: No title found at {url}")
        return None

    # Description from og:description
    og_desc = soup.find("meta", property="og:description")
    desc = og_desc["content"].strip() if og_desc and og_desc.get("content") else ""
    if not desc:
        # Fallback: first paragraph > 50 chars
        for p in soup.find_all("p"):
            text = p.get_text(strip=True)
            if len(text) > 50:
                desc = text
                break
    if desc and len(desc) > 500:
        desc = desc[:497] + "..."

    # Image from og:image
    og_img = soup.find("meta", property="og:image")
    img = og_img["content"].strip() if og_img and og_img.get("content") else ""

    # Year from article:published_time
    pub_time = soup.find("meta", property="article:published_time")
    year = ""
    if pub_time and pub_time.get("content"):
        m = re.search(r"(\d{4})", pub_time["content"])
        if m:
            year = m.group(1)

    # Collect body text for org extraction
    body_text = " ".join(p.get_text(strip=True) for p in soup.find_all("p") if len(p.get_text(strip=True)) > 20)

    # Extract country and org
    country = extract_country(title, desc)
    org = extract_org(title, body_text)
    topic = classify_topic(title, desc)

    return {
        "title": title,
        "url": url,
        "img": img,
        "country": country,
        "org": org,
        "year": year,
        "desc": desc,
        "topic": topic,
    }


# ── CSV operations ──
def load_csv() -> tuple[list[str], list[dict]]:
    """Load existing CSV."""
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


def merge_posts(posts: list[dict], dry_run: bool = False) -> int:
    """Merge scraped posts into CSV. Returns count of added practices."""
    fieldnames, rows = load_csv()

    # Build normalized title set for dedup
    existing_titles = {normalize_title_for_dedup(r["title"]): i
                       for i, r in enumerate(rows)}

    # Next available ID
    max_id = max(int(r["id"]) for r in rows) if rows else 0
    next_id = max_id + 1

    added = 0
    skipped_dup = 0
    skipped_event = 0

    for post in posts:
        title = post["title"]
        norm_title = normalize_title_for_dedup(title)

        # Skip if already exists
        if norm_title in existing_titles:
            skipped_dup += 1
            continue

        # Skip events/news posts
        if not is_practice_post(title, post["desc"]):
            if dry_run:
                print(f"  SKIP (event/news): {title[:70]}")
            skipped_event += 1
            continue

        new_row = {
            "id": str(next_id),
            "title": title,
            "url": post["url"],
            "brand": BRAND,
            "theme": DEFAULT_THEME,
            "topic": post["topic"],
            "inf": DEFAULT_INF,
            "year": post["year"],
            "country": post["country"],
            "org": post["org"],
            "desc": post["desc"],
            "img": post["img"],
            "award": "false",
        }

        if dry_run:
            print(f"  ADD: [{next_id}] {title[:70]}")
            print(f"       Country={post['country']}  Org={post['org']}  Year={post['year']}  Topic={post['topic']}")
        else:
            rows.append(new_row)

        existing_titles[norm_title] = len(rows) - 1
        next_id += 1
        added += 1

    if not dry_run and added > 0:
        save_csv(fieldnames, rows)

    print(f"\nResults:")
    print(f"  Posts scraped:        {len(posts)}")
    print(f"  Added to CSV:         {added}")
    print(f"  Skipped (duplicate):  {skipped_dup}")
    print(f"  Skipped (event/news): {skipped_event}")
    print(f"  Total practices:      {len(rows) + (added if dry_run else 0)}")

    return added


# ── Main ──
def main():
    parser = argparse.ArgumentParser(
        description="Scrape SafeLines4Birds blog posts for ETA")
    parser.add_argument("--dry-run", action="store_true",
                        help="Preview changes without writing to CSV")
    args = parser.parse_args()

    # Step 1: Fetch blog post URLs from sitemap
    urls = fetch_blog_urls()

    # Step 2: Scrape each blog post
    posts = []
    for i, url in enumerate(urls):
        slug = url.split("/")[-1][:50]
        print(f"  [{i+1}/{len(urls)}] {slug}")
        post = scrape_blog_post(url)
        if post:
            posts.append(post)
        else:
            print(f"    Skipped (failed to load)")
        if i < len(urls) - 1:
            time.sleep(REQUEST_DELAY)

    print(f"\nSuccessfully scraped {len(posts)}/{len(urls)} posts")

    # Step 3: Merge into CSV
    added = merge_posts(posts, dry_run=args.dry_run)

    if not args.dry_run and added > 0:
        print(f"\nNext step: python3.11 csv_to_jsx.py")
    elif args.dry_run:
        print(f"\nDry run complete. Run without --dry-run to apply changes.")


if __name__ == "__main__":
    main()
