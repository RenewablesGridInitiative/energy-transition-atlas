#!/usr/bin/env python3.11
"""
Build master CSV of best practices for the Energy Transition Atlas.
Sources: Excel spreadsheets + scraped WordPress pages.
"""

import csv
import re
import time
import urllib.parse
from pathlib import Path

import openpyxl
import requests
from bs4 import BeautifulSoup

# ── Paths ──
EXCEL_PATH = (
    "/Users/intern/Library/CloudStorage/OneDrive-SharedLibraries-RenewablesGridInitiative/"
    "RGI - Documents/WP3_Social Dimension/2_Communications/Website/"
    "Energy Transition Atlas/ETA_New DB_filled_Final.xlsx"
)
OUTPUT_PATH = "/Users/intern/Desktop/ETA/practices_master.csv"

# ── Sitemap URLs (extracted earlier) ──
SITEMAP_URL = "https://renewables-grid.eu/database-sitemap.xml"

# ── Theme mapping ──
THEME_MAP = {
    "Energy & Nature": "Nature",
    "Energy & Society": "People",
    "Grids & Energy Systems": "Technology",
}

# ── CSV columns (only what the frontend needs) ──
COLUMNS = [
    "id", "title", "url", "brand", "theme", "topic", "inf", "year",
    "country", "org", "desc", "img", "award",
]

# ── Topic normalization (standardize to title case with ampersands) ──
TOPIC_NORMALIZATION = {
    "public acceptance and engagement": "Public Acceptance & Engagement",
    "public acceptance & engagement": "Public Acceptance & Engagement",
    "creating awareness and capacity building": "Creating Awareness & Capacity Building",
    "creating awareness & capacity-building": "Creating Awareness & Capacity Building",
    "creating awareness & capacity building": "Creating Awareness & Capacity Building",
    "climate adaptation and resilience": "Climate Adaptation & Resilience",
    "climate adaptation & resilience": "Climate Adaptation & Resilience",
    "integrated vegetation management": "Integrated Vegetation Management",
    "circularity and supply chains": "Circularity & Supply Chains",
    "circularity & supply chains": "Circularity & Supply Chains",
    "offshore energy and nature": "Nature Conservation & Restoration",
    "offshore energy & nature": "Nature Conservation & Restoration",
    "spatial optimisation": "Spatial Optimisation",
    "energy system planning": "Energy System Planning",
    "energy system optimisation": "Energy System Optimisation",
    "energy system planning & optimisation": "Energy System Planning & Optimisation",
    "bird protection": "Bird Protection",
    "monitoring & reporting": "Monitoring & Reporting",
    "nature conservation & restoration": "Nature Conservation & Restoration",
    "advocating for optimised grids": "Advocating for Optimised Grids",
    "implementing rgi declarations": "Public Acceptance & Engagement",
    "fair & inclusive energy transition": "Fair & Inclusive Energy Transition",
}


def normalize_topic(topic_str):
    """Normalize topic string to consistent formatting."""
    if not topic_str:
        return ""
    # Handle multi-topic (comma-separated)
    parts = [t.strip() for t in topic_str.split(",") if t.strip()]
    normalized = []
    for part in parts:
        key = part.lower().strip()
        norm = TOPIC_NORMALIZATION.get(key, part)  # fallback to original if not in map
        if norm not in normalized:
            normalized.append(norm)
    return ", ".join(normalized)


def normalize_title_for_dedup(title):
    """Normalize a title for duplicate detection.

    Strips punctuation variants (en-dash, em-dash, hyphens, colons),
    collapses whitespace, lowercases.
    """
    t = title.lower()
    # Replace all dash/hyphen variants with space
    t = re.sub(r'[\u2010-\u2015\u2212\-–—‑]', ' ', t)
    # Remove colons, quotes, parentheses
    t = re.sub(r'[:"\'()\u201c\u201d\u2018\u2019\u00ab\u00bb]', '', t)
    # Collapse whitespace
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def practice_quality_score(p):
    """Score a practice's data completeness for dedup preference."""
    score = 0
    if "detail=" not in p.get("url", ""):
        score += 10  # strongly prefer new-style URLs
    if p.get("desc"):
        score += 5
    if p.get("img"):
        score += 3
    if p.get("topic"):
        score += 2
    if p.get("country"):
        score += 1
    if p.get("year"):
        score += 1
    return score


def map_theme(raw_dim):
    """Map old dimension names to new theme names, handling semicolons."""
    if not raw_dim:
        return ""
    parts = [p.strip() for p in raw_dim.split(";")]
    mapped = []
    for p in parts:
        m = THEME_MAP.get(p, p)
        if m not in mapped:
            mapped.append(m)
    return ", ".join(mapped)


def clean_text(val):
    """Clean cell value to string."""
    if val is None:
        return ""
    s = str(val).strip()
    # Normalize whitespace
    s = re.sub(r'\s+', ' ', s)
    return s


def clean_url(val):
    """Clean and strip URL."""
    if val is None:
        return ""
    s = str(val).strip()
    if s.endswith('\n'):
        s = s.strip()
    return s


def normalize_url(url):
    """Normalize URL for dedup comparison."""
    url = url.strip().rstrip("/").lower()
    url = url.replace("http://", "https://")
    # Remove query strings for comparison
    url = url.split("?")[0].split("#")[0]
    return url


def score_image_url(url):
    """Score an image URL to prefer real photos over branded graphics."""
    if not url:
        return -100
    url_lower = url.lower()
    score = 0
    # Prefer JPG (real photos) over PNG (often graphics/infographics)
    if url_lower.endswith(('.jpg', '.jpeg')) or '.jpg' in url_lower or '.jpeg' in url_lower:
        score += 10
    elif url_lower.endswith('.png') or '.png' in url_lower:
        score -= 5
    # Prefer gallery-slider images (curated practice photos)
    if 'gallery-slider' in url_lower:
        score += 5
    # Prefer higher-res 644x398 landscape images for cards
    if '644x398' in url_lower:
        score += 8
    elif '322x196' in url_lower:
        score += 0  # acceptable but low-res
    # Penalize tiny icons (32x32, etc.) — scraping artifacts
    if re.search(r'-\d{1,2}x\d{1,2}[^0-9]', url_lower):
        score -= 50
    # Penalize portrait/infographic dimensions
    if '854x1024' in url_lower or '1024x1024' in url_lower:
        score -= 10
    # Penalize old domain (may be broken)
    if 'old.renewables-grid.eu' in url_lower:
        score -= 20
    # Penalize generic scaled placeholders
    if '-scaled' in url_lower:
        score -= 10
    # Penalize generic theme placeholder images
    for keyword in ['nature_gingr', 'technology_gingr', 'people_gingr', 'planning_gingr']:
        if keyword in url_lower:
            score -= 15
            break
    return score


def upgrade_image_resolution(url, session):
    """Try to upgrade a thumbnail URL to a higher-resolution version.

    Strategy:
    - 322x196-c-default → 644x398-c-default (2x sharper, validated via HEAD)
    - 440x527 → full-res (remove size suffix)
    - 32x32 and other tiny icons → empty (discard)
    - Already 644x398 or larger → keep as-is
    """
    if not url:
        return url

    # Discard tiny icon images
    if re.search(r'-\d{1,2}x\d{1,2}-', url):
        return ""

    # Upgrade 322x196 thumbnails to 644x398
    if '-322x196-c-default' in url:
        upgraded = url.replace('-322x196-c-default', '-644x398-c-default')
        try:
            resp = session.head(upgraded, timeout=10, allow_redirects=True)
            if resp.status_code == 200:
                return upgraded
        except Exception:
            pass
        return url  # fallback to original if 644 doesn't exist

    # Upgrade 440x527 portrait crops to full-res
    if '-440x527' in url:
        # Remove the size suffix: filename-440x527.jpg → filename.jpg
        upgraded = re.sub(r'-440x527', '', url)
        try:
            resp = session.head(upgraded, timeout=10, allow_redirects=True)
            if resp.status_code == 200:
                return upgraded
        except Exception:
            pass
        return url

    return url


def read_excel_sheet(wb, sheet_name):
    """Read practices from an Excel sheet."""
    ws = wb[sheet_name]
    practices = []
    for row in ws.iter_rows(min_row=2, max_row=ws.max_row, values_only=True):
        title = clean_text(row[7])
        if not title:
            continue

        url = clean_url(row[0])
        brand = clean_text(row[1])
        inf = clean_text(row[2])
        raw_dim = clean_text(row[3])
        raw_topic = clean_text(row[4])
        # row[5] = Tags, row[6] = Webinar/Video
        year_val = row[8]
        org = clean_text(row[9])
        desc = clean_text(row[10])
        img = clean_url(row[16])
        # row[19] = Comments
        award_raw = clean_text(row[20])

        # Map theme
        theme = map_theme(raw_dim)

        # Normalize topic (handle semicolons -> commas)
        topic = raw_topic.replace(";", ",") if raw_topic else ""
        # Clean up spacing
        topic = ", ".join(t.strip() for t in topic.split(",") if t.strip())

        # Parse year
        year = ""
        if year_val is not None:
            try:
                year = int(year_val)
            except (ValueError, TypeError):
                year = str(year_val).strip()

        # Parse award
        award = "true" if award_raw and "award" in award_raw.lower() else "false"

        practices.append({
            "title": title,
            "url": url,
            "brand": brand,
            "theme": theme,
            "topic": topic,
            "inf": inf,
            "year": year,
            "country": "",  # Not in Excel — will try to extract from website
            "org": org,
            "desc": desc,
            "img": img,
            "award": award,
        })
    return practices


def get_sitemap_urls():
    """Fetch all practice URLs from the WordPress sitemap."""
    print("Fetching sitemap...")
    resp = requests.get(SITEMAP_URL, timeout=30)
    soup = BeautifulSoup(resp.text, "html.parser")
    urls = []
    for loc in soup.find_all("loc"):
        url = loc.text.strip()
        # Skip the main /database/ page
        if url.rstrip("/").endswith("/database"):
            continue
        urls.append(url)
    print(f"  Found {len(urls)} practice URLs in sitemap")
    return urls


def scrape_practice(url, session):
    """Scrape a single practice page for metadata."""
    try:
        resp = session.get(url, timeout=30)
        resp.raise_for_status()
    except Exception as e:
        print(f"  ERROR fetching {url}: {e}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")

    # Title — use separator to avoid joined words from line breaks
    title_el = soup.find("h1")
    title = title_el.get_text(separator=" ", strip=True) if title_el else ""
    # Collapse multiple spaces
    title = re.sub(r'\s+', ' ', title).strip()

    country = ""
    year = ""
    org = ""
    desc = ""
    img = ""
    topic = ""
    theme = ""

    # ── RGI theme structure: single-pages-meta__item with icon imgs ──
    for item in soup.find_all("div", class_="single-pages-meta__item"):
        icon = item.find("img")
        if not icon:
            continue
        alt = (icon.get("alt") or "").lower()
        text = item.get_text(strip=True)
        if "location" in alt and not country:
            country = text
        elif "calendar" in alt and not year:
            m = re.search(r'(\d{4})', text)
            if m:
                year = m.group(1)

    # ── Organisation from single-pages-meta__text ──
    org_el = soup.find("p", class_="single-pages-meta__text")
    if org_el:
        org_text = org_el.get_text(strip=True)
        # Format: "Organisation: NAME"
        m = re.match(r'Organisation\s*:\s*(.+)', org_text)
        if m:
            org = m.group(1).strip()

    # ── Topic from /topics/ links (first one on the page in the main content) ──
    topic_links = []
    for a in soup.find_all("a", href=re.compile(r'/topics/')):
        t = a.get_text(strip=True)
        href = a.get("href", "")
        if t and t != "Topics" and t not in topic_links:
            topic_links.append(t)
    # Use the first unique topic link that appears in the main practice area
    if topic_links:
        topic = topic_links[0]

    # ── Map scraped topic to theme ──
    TOPIC_TO_THEME = {
        "Bird Protection": "Nature",
        "Integrated Vegetation Management": "Nature",
        "Nature Conservation & Restoration": "Nature",
        "Monitoring & Reporting": "Nature",
        "Circularity & Supply Chains": "Technology",
        "Circularity and Supply Chains": "Technology",
        "Climate Adaptation & Resilience": "Technology",
        "Energy System Planning": "Technology",
        "Energy System Planning & Optimisation": "Technology",
        "Spatial Optimisation": "Technology",
        "Public Acceptance & Engagement": "People",
        "Creating awareness & capacity-building": "People",
        "Creating Awareness & Capacity Building": "People",
        "Fair & Inclusive Energy Transition": "People",
        "Advocating for Optimised Grids": "Planning",
        "Implementing RGI Declarations": "Planning",
        "Energy System Optimisation": "Technology",
        "Energy System Planning & Optimisation": "Technology",
    }
    if topic:
        # Try exact match first, then case-insensitive
        theme = TOPIC_TO_THEME.get(topic, "")
        if not theme:
            for key, val in TOPIC_TO_THEME.items():
                if key.lower() == topic.lower():
                    theme = val
                    break

    # ── Featured image: collect candidates and pick best by score ──
    img_candidates = []

    # Source 1: ALL gallery slider photos (best source — curated practice images)
    for gallery_pic in soup.find_all("picture", class_="gallery-slider__picture"):
        gallery_img = gallery_pic.find("img")
        if gallery_img and gallery_img.get("src"):
            img_candidates.append(gallery_img["src"])

    # Source 2: Content body images (real photos embedded in the article)
    for content_img in soup.select(".single-pages-content img, .entry-content img, article img"):
        src = content_img.get("src", "")
        if (src
                and "renewables-grid.eu" in src
                and not src.endswith(".svg")
                and "icon" not in src.lower()
                and "logo" not in src.lower()
                and not re.search(r'-\d{1,2}x\d{1,2}[^0-9]', src)):  # skip tiny icons
            img_candidates.append(src)

    # Source 3: og:image fallback (often branded graphics, but better than nothing)
    og_img = soup.find("meta", property="og:image")
    if og_img and og_img.get("content"):
        img_candidates.append(og_img["content"])

    # Pick the highest-scored candidate
    if img_candidates:
        img = max(img_candidates, key=score_image_url)

    # ── Description from og:description or first content paragraph ──
    og_desc = soup.find("meta", property="og:description")
    if og_desc and og_desc.get("content"):
        desc = og_desc["content"]

    if not desc:
        # Look for main content paragraphs
        for p in soup.find_all("p"):
            text = p.get_text(strip=True)
            if len(text) > 50 and "cookie" not in text.lower():
                desc = text
                break

    # Clean up desc
    if desc:
        desc = re.sub(r'\s+', ' ', desc).strip()
        if len(desc) > 500:
            desc = desc[:497] + "..."

    return {
        "title": title,
        "url": url,
        "brand": "RGI",
        "theme": theme,
        "topic": topic,
        "inf": "",
        "year": year,
        "country": country,
        "org": org,
        "desc": desc,
        "img": img,
        "award": "false",
    }


def main():
    # ── Step 1: Read Excel data ──
    print("Reading Excel data...")
    wb = openpyxl.load_workbook(EXCEL_PATH)

    new_website = read_excel_sheet(wb, "New Website")
    print(f"  New Website: {len(new_website)} practices")

    old_website = read_excel_sheet(wb, "Old Website(not accessible)")
    print(f"  Old Website: {len(old_website)} practices")

    # Deduplicate: prefer New Website version
    by_title = {}
    # Add old first so new overwrites
    for p in old_website:
        key = p["title"].lower().strip()
        p["source"] = "old_website"
        by_title[key] = p
    for p in new_website:
        key = p["title"].lower().strip()
        p["source"] = "new_website"
        by_title[key] = p

    # Build title index for dedup with scraped data
    title_index = set(by_title.keys())

    print(f"  Combined unique (by title): {len(by_title)} practices")

    # ── Step 2: Scrape ALL website practices for metadata ──
    sitemap_urls = get_sitemap_urls()

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ETA-DataCollector/1.0"
    })

    new_count = 0
    enriched_count = 0
    for i, url in enumerate(sitemap_urls):
        slug = url.rstrip("/").split("/")[-1]
        print(f"  Scraping [{i+1}/{len(sitemap_urls)}]: {slug}")
        result = scrape_practice(url, session)
        if not result:
            continue

        key = result["title"].lower().strip()
        if not key:
            continue

        if key in by_title:
            # Enrich existing practice with scraped data where missing
            existing = by_title[key]
            if not existing["country"] and result["country"]:
                existing["country"] = result["country"]
                enriched_count += 1
            if not existing["year"] and result["year"]:
                existing["year"] = result["year"]
            if not existing["org"] and result["org"]:
                existing["org"] = result["org"]
            if result["img"] and (
                not existing["img"]
                or "old.renewables-grid.eu" in existing["img"]
                or score_image_url(result["img"]) > score_image_url(existing["img"])
            ):
                existing["img"] = result["img"]
            if not existing["topic"] and result["topic"]:
                existing["topic"] = result["topic"]
            if not existing["theme"] and result["theme"]:
                existing["theme"] = result["theme"]
            # Update URL to new website URL if old-style
            if "detail=" in existing["url"]:
                existing["url"] = url
        else:
            result["source"] = "scraped"
            by_title[key] = result
            new_count += 1

        # Be respectful
        if i < len(sitemap_urls) - 1:
            time.sleep(0.3)

    print(f"  New practices from scrape: {new_count}")
    print(f"  Existing practices enriched with country: {enriched_count}")

    # ── Step 3: Second pass — re-scrape practices with missing or bad images ──
    all_practices_temp = list(by_title.values())
    needs_image = [
        p for p in all_practices_temp
        if not p["img"] or "old.renewables-grid.eu" in p.get("img", "")
    ]
    if needs_image:
        print(f"\n  Second pass: re-scraping {len(needs_image)} practices with missing/bad images...")
        for i, p in enumerate(needs_image):
            url = p.get("url", "")
            if not url or "detail=" in url:
                continue
            slug = url.rstrip("/").split("/")[-1]
            print(f"    Re-scraping [{i+1}/{len(needs_image)}]: {slug}")
            result = scrape_practice(url, session)
            if result and result["img"]:
                if (not p["img"]
                        or score_image_url(result["img"]) > score_image_url(p["img"])):
                    p["img"] = result["img"]
                    print(f"      -> Found image!")
            if i < len(needs_image) - 1:
                time.sleep(0.3)

    all_practices = list(by_title.values())

    # ── Step 3b: Deduplicate by normalized title ──
    print(f"\n  Deduplicating {len(all_practices)} practices...")
    dedup_groups = {}
    for p in all_practices:
        key = normalize_title_for_dedup(p["title"])
        dedup_groups.setdefault(key, []).append(p)

    deduped = []
    removed_count = 0
    for key, group in dedup_groups.items():
        if len(group) == 1:
            deduped.append(group[0])
        else:
            # Pick the one with best data quality
            group.sort(key=practice_quality_score, reverse=True)
            best = group[0]
            # Merge any missing fields from duplicates into best
            for other in group[1:]:
                for field in ["desc", "img", "topic", "theme", "country", "year", "org"]:
                    if not best.get(field) and other.get(field):
                        best[field] = other[field]
            deduped.append(best)
            removed_count += len(group) - 1
            for removed in group[1:]:
                print(f"    Removed duplicate: {removed['title'][:60]}")
    all_practices = deduped
    print(f"    Removed {removed_count} duplicates, {len(all_practices)} practices remain")

    # ── Step 3c: Normalize topics ──
    for p in all_practices:
        p["topic"] = normalize_topic(p.get("topic", ""))

    # Log remaining old-URL practices (unique, no new-URL twin)
    old_url_remaining = [p for p in all_practices if "detail=" in p.get("url", "")]
    if old_url_remaining:
        print(f"\n  Note: {len(old_url_remaining)} practices still have old-style URLs (unique, no new twin):")
        for p in old_url_remaining:
            print(f"    {p['title'][:60]}")

    # Sort: year desc, then title asc
    def sort_key(p):
        try:
            y = -int(p["year"]) if p["year"] else 0
        except (ValueError, TypeError):
            y = 0
        return (y, p["title"].lower())

    all_practices.sort(key=sort_key)

    # Assign IDs
    for i, p in enumerate(all_practices, 1):
        p["id"] = i

    # ── Step 4: Upgrade image resolution (322x196 → 644x398) ──
    print(f"\n  Upgrading image resolution...")
    upgraded_count = 0
    discarded_count = 0
    for p in all_practices:
        original = p["img"]
        p["img"] = upgrade_image_resolution(original, session)
        if p["img"] != original:
            if p["img"]:
                upgraded_count += 1
            else:
                discarded_count += 1
    print(f"    Upgraded: {upgraded_count}, Discarded tiny icons: {discarded_count}")

    # ── Step 5: Write CSV ──
    print(f"\nWriting {len(all_practices)} practices to {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(all_practices)

    print("Done!")

    # ── Stats ──
    sources = {}
    themes = {}
    for p in all_practices:
        s = p.get("source", "unknown")
        sources[s] = sources.get(s, 0) + 1
        for t in p.get("theme", "").split(","):
            t = t.strip()
            if t:
                themes[t] = themes.get(t, 0) + 1

    print(f"\nBy source: {sources}")
    print(f"By theme: {themes}")

    # Count with/without key fields
    has_year = sum(1 for p in all_practices if p["year"])
    has_country = sum(1 for p in all_practices if p["country"])
    has_desc = sum(1 for p in all_practices if p["desc"])
    has_img = sum(1 for p in all_practices if p["img"])
    print(f"\nField coverage:")
    print(f"  year: {has_year}/{len(all_practices)}")
    print(f"  country: {has_country}/{len(all_practices)}")
    print(f"  desc: {has_desc}/{len(all_practices)}")
    print(f"  img: {has_img}/{len(all_practices)}")


if __name__ == "__main__":
    main()
