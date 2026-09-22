# CSV Validation Rules — practices_master.csv

This file is the **single source of truth** for CSV validation. Both the browser-side validator (`admin.html`) and the CI validator (`validate_csv.py`) must enforce these rules identically. When a rule changes here, update both implementations in the same commit.

## Header row

- Must be the first line of the file.
- Two valid header shapes are accepted:

  **Canonical (14 columns)** — preferred for new exports:

  ```
  id,title,url,brand,theme,topic,inf,year,country,org,desc,img,img_copyright,award
  ```

  **Legacy (13 columns)** — older CSVs that omit `img_copyright` still validate and rebuild the site. Missing credits become empty strings in `csv_to_jsx.py`.

  ```
  id,title,url,brand,theme,topic,inf,year,country,org,desc,img,award
  ```

- Column names are case-sensitive. No extra columns, no missing columns, no reordering.
- If `img_copyright` is present, it must appear immediately after `img` and before `award`.

## Row shape

- Every non-empty row after the header must have exactly as many fields as the header row (13 or 14) after RFC 4180 CSV parsing (quoted commas count as one field).
- Empty trailing lines are ignored.

## Per-field rules

| # | Column | Required | Type | Rule |
|---|--------|----------|------|------|
| 1 | `id` | yes | integer | Positive integer. Unique across all rows. |
| 2 | `title` | yes | string | Non-empty after trim. |
| 3 | `url` | yes | string | Starts with `http://` or `https://`. No whitespace. |
| 4 | `brand` | yes | string | One of the keys in `admin-config.json`'s `atlasPartnerLabels` map. Defaults to `RGI`, `OCEaN`, `Panorama`, `SL4B` when no config is set. Both validators pick up additions automatically. |
| 5 | `theme` | no | string | May be empty. May be comma-separated composite (e.g. `"People, Planning"`). |
| 6 | `topic` | no | string | May be empty. May be comma-separated composite. |
| 7 | `inf` | yes | string | Non-empty after trim. |
| 8 | `year` | no | integer or empty | If present: integer 1900..current-year+1. |
| 9 | `country` | no | string | May be empty. Typical values: country name, region (e.g. `Europe`, `Worldwide`). |
| 10 | `org` | no | string | May be empty. |
| 11 | `desc` | no | string | May be empty. |
| 12 | `img` | no | string | If present: starts with `http://` or `https://`. |
| 13 | `img_copyright` | no | string | Optional column. May be empty. Owner name only (e.g. `TenneT`); the site adds the © symbol when displaying it. Omitted entirely in legacy 13-column CSVs. |
| 14 | `award` | yes | boolean literal | Exactly `true` or `false` (case-insensitive). |

## Error reporting

- Validators report at most the first 20 problems; stop after that to avoid noise.
- Each problem has:
  - Row number (1-based, counting the header as row 1 — so first data row is row 2).
  - Column name (from the header).
  - Short human-readable message (e.g. "must be a positive integer", "not a valid URL", "brand must be one of RGI, OCEaN, Panorama, SL4B").
- For duplicate `id`, report every duplicate row with the colliding id.
- Header mismatch message: `First row must be: id,title,…,img_copyright,award (img_copyright may be omitted)`.

## Why two implementations?

The browser validator gives instant feedback without a round-trip; the CI validator is the last line of defence against someone pushing CSV directly via `git` without going through the admin. They share the same rules but live in different runtimes — duplication is accepted over a shared-runtime dependency.
