#!/usr/bin/env python3.11
"""
classify_crosscutting.py — Identify and apply cross-cutting theme/topic classifications.

Reads practices_master.csv, identifies practices that should appear in multiple
themes or topics based on conservative keyword matching, and optionally applies
changes directly to the CSV.

Set DRY_RUN = True (default) to preview candidates without modifying the CSV.
Set DRY_RUN = False to apply changes.
"""

import csv
import re
import sys
from collections import defaultdict

DRY_RUN = True

CSV_PATH = "practices_master.csv"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def has_keywords(text, keywords):
    """Return list of matched keywords found in text (case-insensitive)."""
    if not text:
        return []
    text_lower = text.lower()
    matched = []
    for kw in keywords:
        if re.search(kw, text_lower):
            matched.append(kw)
    return matched


def themes_set(row):
    """Return set of current themes."""
    return set(t.strip() for t in row["theme"].split(",") if t.strip())


def topics_set(row):
    """Return set of current topics."""
    return set(t.strip() for t in row["topic"].split(",") if t.strip())


def searchable(row):
    """Combine title + desc + topic for keyword matching."""
    parts = [row.get("title", ""), row.get("desc", ""), row.get("topic", "")]
    return " ".join(p for p in parts if p)


# ---------------------------------------------------------------------------
# Cross-cutting rules
# ---------------------------------------------------------------------------
# Each rule is: (current_theme_filter, added_theme, triggering_keywords, min_matches)
# current_theme_filter: practice must currently have this theme (or None for any)
# added_theme: theme to add
# triggering_keywords: regex patterns to search in title+desc
# min_matches: how many distinct keyword groups must match (for conservatism)

THEME_RULES = [
    # Nature practices with community/engagement signals → add People
    {
        "name": "Nature + People (community engagement)",
        "current_theme": "Nature",
        "add_theme": "People",
        "keywords": [
            r"\bcommunity\b", r"\bcommunities\b",
            r"\bstakeholder\b", r"\bengagement\b", r"\bparticipat",
            r"\beducation\b", r"\bawareness\b", r"\blivelihood\b",
            r"\bcitizen\b", r"\bcitizens\b",
        ],
        "min_matches": 2,  # need at least 2 different keyword hits
    },
    # Nature practices with monitoring technology signals → add Technology
    {
        "name": "Nature + Technology (monitoring tech)",
        "current_theme": "Nature",
        "add_theme": "Technology",
        "keywords": [
            r"\bai\b", r"\bartificial intelligence\b",
            r"\bradar\b", r"\bsensor\b", r"\bsensors\b",
            r"\btracking\b", r"\bdetection\b", r"\bdetect\b",
            r"\bdrone\b", r"\bdrones\b", r"\biot\b",
            r"\bremote sensing\b", r"\bsatellite\b",
            r"\bautonomous\b", r"\balgorithm\b",
        ],
        "min_matches": 2,
    },
    # Technology practices with environmental/wildlife signals → add Nature
    {
        "name": "Technology + Nature (environmental protection)",
        "current_theme": "Technology",
        "add_theme": "Nature",
        "keywords": [
            r"\bwildlife\b", r"\bhabitat\b", r"\becosystem\b",
            r"\bbiodiversity\b", r"\bspecies\b",
            r"\bnature-inclusive\b", r"\bnature.based\b",
            r"\bbird\b", r"\bbirds\b",
            r"\bseagrass\b", r"\breef\b", r"\bmarine\b",
            r"\benvironmental protection\b",
            r"\bnature4",  # e.g. Nature4Networks
        ],
        "min_matches": 2,
    },
    # Technology practices with planning/regulation signals → add Planning
    {
        "name": "Technology + Planning (regulation/policy)",
        "current_theme": "Technology",
        "add_theme": "Planning",
        "keywords": [
            r"\bspatial planning\b", r"\bregulat", r"\bpermitting\b",
            r"\bpolicy\b", r"\blegislation\b", r"\beia\b",
            r"\benvironmental impact assessment\b",
            r"\bstrategic planning\b", r"\bplanning framework\b",
        ],
        "min_matches": 2,
    },
    # People practices with conservation/biodiversity signals → add Nature
    # Must have conservation as a CENTRAL focus, not just a partner mention
    {
        "name": "People + Nature (conservation focus)",
        "current_theme": "People",
        "add_theme": "Nature",
        "keywords": [
            r"\bbird.*(conservation|protection|collision|electrocution)\b",
            r"\b(conservation|protection).*(bird|wildlife|species)\b",
            r"\bbiodiversity\b.*\b(protect|conserv|restor|enhanc)\b",
            r"\bhabitat\b.*\b(protect|restor|conserv)\b",
            r"\becosystem restoration\b",
            r"\bwildlife protection\b",
        ],
        "min_matches": 1,  # These patterns are already very specific
    },
    # Planning practices with engagement signals → add People
    {
        "name": "Planning + People (public engagement)",
        "current_theme": "Planning",
        "add_theme": "People",
        "keywords": [
            r"\bcommunity\b", r"\bcommunities\b",
            r"\bstakeholder engagement\b", r"\bpublic participation\b",
            r"\bcitizen\b", r"\bcitizens\b", r"\bdialogue\b",
            r"\bconsultation\b",
        ],
        "min_matches": 2,
    },
]

# Topic cross-cutting rules
TOPIC_RULES = [
    # Bird Protection practices with monitoring tech → add Monitoring & Reporting
    {
        "name": "Bird Protection + Monitoring",
        "current_topic": "Bird Protection",
        "add_topic": "Monitoring & Reporting",
        "keywords": [
            r"\bmonitor\b", r"\bmonitoring\b", r"\bradar\b",
            r"\btrack\b", r"\btracking\b", r"\bdetect\b",
            r"\bsurveillance\b", r"\bdata collect\b",
            r"\bgis\b", r"\bmapping\b",
        ],
        "min_matches": 2,
    },
    # Grid Development Planning with engagement → add Public Acceptance & Engagement
    {
        "name": "Grid Planning + Public Engagement",
        "current_topic": "Grid Development Planning",
        "add_topic": "Public Acceptance & Engagement",
        "keywords": [
            r"\bpublic\b.*\bparticipat", r"\bstakeholder engagement\b",
            r"\bcommunity\b.*\binvolv", r"\bcitizen\b",
            r"\bdialogue\b", r"\bconsultation\b",
            r"\btransparency\b", r"\btransparent\b",
        ],
        "min_matches": 2,
    },
    # Spatial planning with nature → add Nature Conservation & Restoration
    {
        "name": "Spatial Planning + Nature Conservation",
        "current_topic": "Spatial & Strategic Planning",
        "add_topic": "Nature Conservation & Restoration",
        "keywords": [
            r"\bnature\b", r"\bbiodiversity\b", r"\becosystem\b",
            r"\bhabitat\b", r"\bwildlife\b", r"\benvironmental\b",
            r"\bconservation\b",
        ],
        "min_matches": 2,
    },
    # Integrated Vegetation Management with monitoring → add Monitoring & Reporting
    {
        "name": "IVM + Monitoring",
        "current_topic": "Integrated Vegetation Management",
        "add_topic": "Monitoring & Reporting",
        "keywords": [
            r"\bmonitor\b", r"\bmonitoring\b",
            r"\bsatellite\b", r"\bremote sensing\b",
            r"\bgis\b", r"\bdata\b.*\bcollect",
            r"\bresearch\b.*\bprogramme\b",
        ],
        "min_matches": 2,
    },
    # Climate Adaptation with nature/NbS → add Nature Conservation & Restoration
    {
        "name": "Climate Adaptation + Nature",
        "current_topic": "Climate Adaptation & Resilience",
        "add_topic": "Nature Conservation & Restoration",
        "keywords": [
            r"\bnature-based\b", r"\bnature.based solution\b",
            r"\bbiodiversity\b", r"\becosystem\b",
            r"\bhabitat\b", r"\bwildlife\b",
            r"\bnature-inclusive\b",
        ],
        "min_matches": 2,
    },
]


def classify_crosscutting(rows):
    """Identify and return cross-cutting candidates."""
    candidates = []

    for row in rows:
        current_themes = themes_set(row)
        current_topics = topics_set(row)
        text = searchable(row)
        rid = row["id"]

        # Apply theme rules
        for rule in THEME_RULES:
            req_theme = rule["current_theme"]
            add_theme = rule["add_theme"]

            # Skip if practice doesn't have the required theme
            if req_theme not in current_themes:
                continue
            # Skip if practice already has the theme to add
            if add_theme in current_themes:
                continue

            matched = has_keywords(text, rule["keywords"])
            if len(matched) >= rule["min_matches"]:
                candidates.append({
                    "id": rid,
                    "title": row["title"],
                    "rule": rule["name"],
                    "type": "theme",
                    "current": row["theme"],
                    "current_topic": row["topic"],
                    "add": add_theme,
                    "keywords": matched,
                })

        # Apply topic rules
        for rule in TOPIC_RULES:
            req_topic = rule["current_topic"]
            add_topic = rule["add_topic"]

            if req_topic not in current_topics:
                continue
            if add_topic in current_topics:
                continue

            matched = has_keywords(text, rule["keywords"])
            if len(matched) >= rule["min_matches"]:
                candidates.append({
                    "id": rid,
                    "title": row["title"],
                    "rule": rule["name"],
                    "type": "topic",
                    "current": row["topic"],
                    "current_topic": row["topic"],
                    "add": add_topic,
                    "keywords": matched,
                })

    return candidates


def apply_changes(rows, candidates):
    """Apply cross-cutting changes to rows in-place. Returns count of modified rows."""
    # Group candidates by ID
    changes_by_id = defaultdict(list)
    for c in candidates:
        changes_by_id[c["id"]].append(c)

    modified = 0
    for row in rows:
        rid = row["id"]
        if rid not in changes_by_id:
            continue

        changed = False
        current_themes = themes_set(row)
        current_topics = topics_set(row)

        for c in changes_by_id[rid]:
            if c["type"] == "theme":
                if c["add"] not in current_themes:
                    current_themes.add(c["add"])
                    changed = True
            elif c["type"] == "topic":
                if c["add"] not in current_topics:
                    current_topics.add(c["add"])
                    changed = True

        if changed:
            # Sort themes in canonical order
            theme_order = ["Nature", "People", "Technology", "Planning"]
            sorted_themes = sorted(current_themes, key=lambda t: theme_order.index(t) if t in theme_order else 99)
            row["theme"] = ", ".join(sorted_themes)

            # Sort topics alphabetically
            sorted_topics = sorted(current_topics)
            row["topic"] = ", ".join(sorted_topics)
            modified += 1

    return modified


def main():
    # Read CSV
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    print(f"Loaded {len(rows)} practices from {CSV_PATH}")
    print(f"DRY_RUN = {DRY_RUN}\n")

    # Find candidates
    candidates = classify_crosscutting(rows)

    # Deduplicate: a practice might match the same rule via different keyword combos
    # Group by (id, rule, add)
    seen = set()
    unique_candidates = []
    for c in candidates:
        key = (c["id"], c["rule"], c["add"])
        if key not in seen:
            seen.add(key)
            unique_candidates.append(c)
    candidates = unique_candidates

    if not candidates:
        print("No cross-cutting candidates found.")
        return

    # Print candidates grouped by rule
    rules_used = defaultdict(list)
    for c in candidates:
        rules_used[c["rule"]].append(c)

    unique_ids = set(c["id"] for c in candidates)
    print(f"Found {len(candidates)} cross-cutting suggestions for {len(unique_ids)} unique practices:\n")

    for rule_name, items in sorted(rules_used.items()):
        print(f"{'='*80}")
        print(f"RULE: {rule_name} ({len(items)} matches)")
        print(f"{'='*80}")
        for c in items:
            print(f"  ID {c['id']:>3}: {c['title'][:70]}")
            print(f"         Current {c['type']}: {c['current']}")
            if c["type"] == "theme":
                print(f"         Current topic: {c['current_topic']}")
            print(f"         Add {c['type']}: {c['add']}")
            print(f"         Keywords: {', '.join(c['keywords'])}")
            print()

    if DRY_RUN:
        print(f"\n{'='*80}")
        print("DRY RUN — no changes applied.")
        print(f"Set DRY_RUN = False in {__file__} and run again to apply changes.")
        print(f"{'='*80}")
    else:
        modified = apply_changes(rows, candidates)
        # Write back
        with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        print(f"\n{'='*80}")
        print(f"APPLIED: {modified} practices updated in {CSV_PATH}.")
        print(f"{'='*80}")
        print(f"\nRun 'python3.11 csv_to_jsx.py' to sync changes to the JSX file.")


if __name__ == "__main__":
    main()
