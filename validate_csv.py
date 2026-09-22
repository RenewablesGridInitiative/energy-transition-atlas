#!/usr/bin/env python3.11
"""Validate practices_master.csv against the rules in VALIDATION.md.

Run in CI before csv_to_jsx.py. Exits non-zero on any validation error,
printing a human-readable summary so the failing GitHub Action log is
directly actionable by a non-technical admin.

The rules here MUST match admin.html's validatePractices() in behaviour;
VALIDATION.md is the shared spec.
"""

import csv
import datetime
import json
import os
import re
import sys

DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(DIR, "practices_master.csv")
CONFIG_PATH = os.path.join(DIR, "admin-config.json")

HEADERS = ["id", "title", "url", "brand", "theme", "topic", "inf", "year",
           "country", "org", "desc", "img", "img_copyright", "award"]
# Older exports omit img_copyright; both shapes are valid. Missing credits
# become empty strings in csv_to_jsx.py so the site still builds.
HEADERS_WITHOUT_IMG_COPYRIGHT = [
    "id", "title", "url", "brand", "theme", "topic", "inf", "year",
    "country", "org", "desc", "img", "award",
]
DEFAULT_BRANDS = {"RGI", "OCEaN", "Panorama", "SL4B"}
REQUIRED_NON_EMPTY = ("title", "url", "brand", "inf")
URL_RE = re.compile(r"^https?://\S+$")
MAX_REPORTED = 20


def allowed_brands():
    """Brand allow-list: union of admin-config.json's atlasPartnerLabels keys
    (when present) and the default four. Keeps the Python validator in sync
    with what the admin UI considers valid."""
    try:
        with open(CONFIG_PATH, encoding="utf-8-sig") as f:
            cfg = json.load(f)
        labels = cfg.get("atlasPartnerLabels") or {}
        if labels:
            return set(labels.keys()) | DEFAULT_BRANDS
    except (OSError, json.JSONDecodeError):
        pass
    return set(DEFAULT_BRANDS)


def validate(path):
    errors = []  # list of (row_num, column, message)

    def push(row_num, column, message):
        if len(errors) < MAX_REPORTED:
            errors.append((row_num, column, message))

    with open(path, encoding="utf-8-sig") as f:  # strip BOM if present
        reader = csv.reader(f)
        try:
            header = next(reader)
        except StopIteration:
            return [(1, "header", "CSV is empty")]

        if header == HEADERS:
            columns = HEADERS
        elif header == HEADERS_WITHOUT_IMG_COPYRIGHT:
            columns = HEADERS_WITHOUT_IMG_COPYRIGHT
        else:
            return [(1, "header",
                     f"First row must be: {','.join(HEADERS)} "
                     f"(img_copyright may be omitted)")]

        id_rows = {}
        max_year = datetime.datetime.now().year + 1
        brands_ok = allowed_brands()

        for idx, row in enumerate(reader):
            row_num = idx + 2  # header is row 1
            if len(row) != len(columns):
                push(row_num, "(row)", f"expected {len(columns)} columns, found {len(row)}")
                continue
            r = dict(zip(columns, row))

            id_val = r["id"].strip()
            if not id_val:
                push(row_num, "id", "must be set")
            elif not id_val.isdigit() or int(id_val) <= 0:
                push(row_num, "id", "must be a positive integer")
            else:
                id_rows.setdefault(int(id_val), []).append(row_num)

            for f_name in REQUIRED_NON_EMPTY:
                if not r[f_name].strip():
                    push(row_num, f_name, "must not be empty")

            url = r["url"].strip()
            if url and not URL_RE.match(url):
                push(row_num, "url", "must start with http:// or https:// and contain no spaces")

            img = r["img"].strip()
            if img and not URL_RE.match(img):
                push(row_num, "img", "must be empty or start with http:// or https://")

            brand = r["brand"].strip()
            if brand and brand not in brands_ok:
                push(row_num, "brand", f"must be one of {', '.join(sorted(brands_ok))}")

            year = r["year"].strip()
            if year:
                if not year.isdigit() or not (1900 <= int(year) <= max_year):
                    push(row_num, "year", f"must be blank or an integer between 1900 and {max_year}")

            award = r["award"].strip().lower()
            if award not in ("true", "false"):
                push(row_num, "award", 'must be "true" or "false"')

        for _id, rows in id_rows.items():
            if len(rows) > 1:
                for r_num in rows:
                    others = [x for x in rows if x != r_num]
                    push(r_num, "id", f"duplicate id {_id} (also on row{'s' if len(others) > 1 else ''} {', '.join(map(str, others))})")

    return errors


def main():
    if not os.path.isfile(CSV_PATH):
        print(f"ERROR: {CSV_PATH} does not exist.", file=sys.stderr)
        sys.exit(2)

    errors = validate(CSV_PATH)
    if not errors:
        print(f"practices_master.csv passed validation.")
        return

    print(f"::error::practices_master.csv has {len(errors)} validation problem(s):", file=sys.stderr)
    for row_num, column, message in errors:
        print(f"  Row {row_num} · {column}: {message}", file=sys.stderr)
    if len(errors) == MAX_REPORTED:
        print(f"  (Reporting cut off at {MAX_REPORTED} problems. Fix these and re-push to see the rest.)", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
