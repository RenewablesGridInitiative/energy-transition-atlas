#!/usr/bin/env python3.11
"""Update the practice count inside index.html meta/OG tags.

Reads the row count from practices_master.csv and rewrites every
"Explore N proven practices" string in index.html to use the real
count. Safe to run repeatedly.
"""

import csv
import os
import re
import sys

DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(DIR, "practices_master.csv")
HTML_PATH = os.path.join(DIR, "index.html")

# Anything like "Explore 355 proven practices" — case-sensitive but tolerant
COUNT_RE = re.compile(r"Explore\s+\d+\s+proven\s+practices", re.IGNORECASE)


def count_rows(csv_path):
    with open(csv_path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return sum(1 for _ in reader)


def main():
    if not os.path.isfile(CSV_PATH):
        print(f"ERROR: {CSV_PATH} missing", file=sys.stderr)
        sys.exit(2)
    if not os.path.isfile(HTML_PATH):
        print(f"ERROR: {HTML_PATH} missing", file=sys.stderr)
        sys.exit(2)

    n = count_rows(CSV_PATH)
    with open(HTML_PATH, encoding="utf-8") as f:
        html = f.read()

    new_html, n_replacements = COUNT_RE.subn(f"Explore {n} proven practices", html)

    if n_replacements == 0:
        print(f"No 'Explore N proven practices' strings found in {HTML_PATH}; nothing to update.")
        return

    if new_html == html:
        print(f"Meta tags already show {n} practices; no change.")
        return

    with open(HTML_PATH, "w", encoding="utf-8") as f:
        f.write(new_html)
    print(f"Updated {n_replacements} meta tag string(s) to show {n} practices.")


if __name__ == "__main__":
    main()
