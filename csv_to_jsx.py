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


def _split_composite(value):
    """Split a composite CSV cell (e.g. "Nature, Technology") into a list.
    Trims whitespace; empty input becomes []. Single values become [value]."""
    if not value:
        return []
    return [part.strip() for part in str(value).split(",") if part.strip()]


def csv_to_js_array(csv_path):
    """Read CSV and produce JS array literal lines.

    Validates each row and raises SystemExit with a human-readable message
    when something is wrong. Intended to run after validate_csv.py in CI;
    this is the last line of defence for typos that slip past the validator.
    """
    with open(csv_path, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    lines = []
    for row_idx, r in enumerate(rows):
        row_num = row_idx + 2  # header is row 1

        def fail(column, message):
            sys.stderr.write(f"::error::Row {row_num} · {column}: {message}\n")
            sys.exit(1)

        def field(col):
            if col not in r:
                fail(col, "column missing from CSV — did the header row get renamed?")
            return r[col]

        try:
            _id = int(field("id"))
        except (TypeError, ValueError):
            fail("id", f"expected integer, got {field('id')!r}")

        title = json.dumps(field("title"), ensure_ascii=False)
        url = json.dumps(field("url"), ensure_ascii=False)
        brand = json.dumps(field("brand"), ensure_ascii=False)
        # Composite fields (theme, topic) are delimited in the CSV with ", ".
        # We parse them here at build time so the runtime JSX receives arrays
        # and never has to call `.split(", ")` — eliminating the ambiguity of a
        # literal comma-space inside a single value.
        dim = json.dumps(_split_composite(field("theme")), ensure_ascii=False)
        topic = json.dumps(_split_composite(field("topic")), ensure_ascii=False)
        inf = json.dumps(field("inf"), ensure_ascii=False)

        year_raw = (field("year") or "").strip()
        if not year_raw:
            year = "null"
        else:
            try:
                year = str(int(year_raw))
            except ValueError:
                year = "null"  # tolerate malformed but non-blank year

        country = json.dumps(field("country"), ensure_ascii=False)
        org = json.dumps(field("org"), ensure_ascii=False)
        desc = json.dumps(field("desc"), ensure_ascii=False)
        img = json.dumps(field("img"), ensure_ascii=False)

        award_raw = (field("award") or "").strip().lower()
        if award_raw not in ("true", "false"):
            fail("award", f'expected "true" or "false", got {field("award")!r}')
        award = "true" if award_raw == "true" else "false"

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
