#!/usr/bin/env python3.11
"""Convert practices_master.csv to a JS array for EnergyTransitionAtlas.jsx."""

import csv
import json
import re
import sys

import os as _os
_DIR = _os.path.dirname(_os.path.abspath(__file__))
CSV_PATH = _os.path.join(_DIR, "practices_master.csv")
JSX_PATH = _os.path.join(_DIR, "EnergyTransitionAtlas.jsx")

# Marker comments in the JSX that delimit the PRACTICES array
ARRAY_START = "const PRACTICES = ["
ARRAY_END_LINE = "];"


def csv_to_js_array(csv_path):
    """Read CSV and produce JS array literal lines."""
    with open(csv_path, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    lines = []
    for r in rows:
        # Build each field carefully
        _id = int(r["id"])
        title = json.dumps(r["title"], ensure_ascii=False)
        url = json.dumps(r["url"], ensure_ascii=False)
        brand = json.dumps(r["brand"], ensure_ascii=False)
        dim = json.dumps(r["theme"], ensure_ascii=False)  # CSV "theme" → JSX "dim"
        topic = json.dumps(r["topic"], ensure_ascii=False)
        inf = json.dumps(r["inf"], ensure_ascii=False)

        # Year: integer or null
        try:
            year = int(r["year"]) if r["year"] else "null"
        except ValueError:
            year = "null"

        country = json.dumps(r["country"], ensure_ascii=False)
        org = json.dumps(r["org"], ensure_ascii=False)
        desc = json.dumps(r["desc"], ensure_ascii=False)
        img = json.dumps(r["img"], ensure_ascii=False)
        award = "true" if r["award"].lower() == "true" else "false"

        line = (
            f"  {{ id: {_id}, title: {title}, url: {url}, brand: {brand}, "
            f"dim: {dim}, topic: {topic}, inf: {inf}, year: {year}, "
            f"country: {country}, org: {org}, desc: {desc}, img: {img}, "
            f"award: {award} }},"
        )
        lines.append(line)

    return lines


def update_jsx(jsx_path, js_lines):
    """Replace the PRACTICES array in the JSX file."""
    with open(jsx_path, encoding="utf-8") as f:
        content = f.read()

    # Find the array boundaries
    start_idx = content.index(ARRAY_START)
    # Find the closing "];" after the array start
    # We need the first "];" that appears after "const PRACTICES = ["
    search_from = start_idx + len(ARRAY_START)
    end_idx = content.index(ARRAY_END_LINE, search_from)
    end_idx += len(ARRAY_END_LINE)

    # Build replacement
    new_array = ARRAY_START + "\n" + "\n".join(js_lines) + "\n" + ARRAY_END_LINE

    new_content = content[:start_idx] + new_array + content[end_idx:]

    with open(jsx_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Updated {jsx_path} with {len(js_lines)} practices")


def main():
    js_lines = csv_to_js_array(CSV_PATH)
    print(f"Generated {len(js_lines)} JS practice entries from CSV")
    update_jsx(JSX_PATH, js_lines)


if __name__ == "__main__":
    main()
