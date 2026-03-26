# CLAUDE.md — Energy Transition Atlas

## Project Overview

The **Energy Transition Atlas** is a mobile-first single-page web application that displays a searchable, filterable directory of ~321 energy transition best practices. It is owned by the Global Initiative for Nature, Grids and Renewables (GINGR), a joint initiative of the Renewables Grid Initiative (RGI) and the International Union for Conservation of Nature (IUCN).

**Live site:** https://beston54.github.io/energy-transition-atlas/
**Repo:** https://github.com/beston54/energy-transition-atlas

## Architecture

- **Frontend:** Single React 18 component (`EnergyTransitionAtlas.jsx`) loaded via Babel standalone transpilation
- **Styling:** Tailwind CSS (CDN)
- **Data:** Practice data is inlined as a static JS array (`const PRACTICES = [...]`) in the JSX file — there is no API or database
- **Hosting:** GitHub Pages, deployed from `main` branch root (`/`)
- **Entry point:** `index.html` loads the JSX and renders it client-side

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Entry point — loads React, Babel, Tailwind, and the JSX component |
| `EnergyTransitionAtlas.jsx` | Main React component (~1800 lines). Contains all UI, filters, data, and logic |
| `practices_master.csv` | Master data CSV (321 practices, 13 columns). Source of truth for practice data |
| `build_master_csv.py` | Python build script that merges Excel + scraped website data into the CSV |
| `csv_to_jsx.py` | Converts `practices_master.csv` into the JS array and injects it into the JSX file |
| `scrape_panorama.py` | Two-phase IUCN Panorama scraper: browser JS + Python CSV merge |
| `scrape_ocean.py` | OCEaN Enhancement & Restoration Projects scraper (sitemap + BeautifulSoup) |
| `classify_crosscutting.py` | Script to identify and apply cross-cutting theme/topic classifications |
| `panorama_raw.json` | Raw scraped data from Panorama (698 solutions, 17 energy-relevant) |
| `gingr-logo-grey.svg` | GINGR logo used in the footer |
| `ETA_Atlas_Prototype.jsx` | Earlier prototype version (kept for reference, not used) |

## Data Pipeline

```
Excel spreadsheet  ──┐
                      ├──> build_master_csv.py ──> practices_master.csv ──> csv_to_jsx.py ──> EnergyTransitionAtlas.jsx
Website scraping   ──┘

Panorama browser JS ──> panorama_raw.json ──> scrape_panorama.py ──> practices_master.csv ──> csv_to_jsx.py
```

### build_master_csv.py

Reads from two sources:
1. **Excel file** (`ETA_New DB_filled_Final.xlsx`) — "New Website" and "Old Website" sheets with manually curated data
2. **Website scraping** — fetches all practice pages from `renewables-grid.eu/database-sitemap.xml` for metadata, images, and country/year enrichment

Key features:
- **Image scoring** (`score_image_url()`): Ranks image candidates preferring JPG gallery photos over branded PNG graphics
- **Image resolution upgrade** (`upgrade_image_resolution()`): Replaces 322x196 thumbnails with 644x398 versions, validates via HEAD requests
- **Fuzzy deduplication** (`normalize_title_for_dedup()`): Strips punctuation variants (en-dash, hyphens, colons) to detect duplicate practices
- **Topic normalization** (`normalize_topic()`): Standardizes topic formatting to title case with ampersands (e.g., "Public Acceptance & Engagement")
- **Quality scoring** (`practice_quality_score()`): When duplicates exist, keeps the version with new-style URL, description, image, and topic

Run: `python3.11 build_master_csv.py` (requires `openpyxl`, `requests`, `beautifulsoup4`)

### csv_to_jsx.py

Reads `practices_master.csv` and replaces the `const PRACTICES = [...]` array in `EnergyTransitionAtlas.jsx`. Maps CSV `theme` column to JSX `dim` key. Uses `ensure_ascii=False` for proper UTF-8 output.

Run: `python3.11 csv_to_jsx.py`

## CSV Schema (13 columns)

| Column | Type | Description |
|--------|------|-------------|
| `id` | int | Auto-assigned sequential ID |
| `title` | string | Practice title |
| `url` | string | Link to full practice page on renewables-grid.eu, panorama.solutions, or offshore-coalition.eu |
| `brand` | string | "RGI", "OCEaN", or "Panorama" — determines Atlas Partner filter and source linking |
| `theme` | string | One of: People, Technology, Nature, Planning (maps to `dim` in JSX) |
| `topic` | string | Normalized topic (e.g., "Bird Protection", "Climate Adaptation & Resilience") |
| `inf` | string | Infrastructure type filter (often empty) |
| `year` | int/empty | Year the practice was published |
| `country` | string | Country or region |
| `org` | string | Organisation name |
| `desc` | string | Short description (used for search, not displayed on cards) |
| `img` | string | Image URL (preferably 644x398 resolution) |
| `award` | bool | Whether the practice received a Grid Award |

## Frontend Component Structure (EnergyTransitionAtlas.jsx)

- **PRACTICES array** (lines 26–348): Inline data, 321 practice objects
- **DIMENSION_TOPICS** (lines ~331-342): Dynamically computed theme→topic mapping from PRACTICES data
- **THEME_COLORS** (lines ~358-366): Theme-specific color classes (amber/emerald/sky/violet) + `themeClasses()` helper
- **Filter state**: Multi-select dropdowns for Infrastructure, Theme, Topic, Country, Year, Organisation + Award toggle
- **"Load More" pattern**: Shows 21 practices initially, +21 per click (replaced pagination)
- **Views**: Grid (responsive 1/2/3 columns) and List
- **Sort**: Newest, Oldest, A-Z, Z-A
- **Search**: Free-text AND search across title, desc, org, topic, country, dim
- **URL params**: Filter state synced to URL query params for shareability
- **Modals**: Submission form, Submission Criteria

## Design Tokens

- **Primary purple:** `#58044D`
- **Cream background:** `#FFF8E5`
- **Charcoal text:** `#424244`
- **Light grey:** `#C9C9C9`
- **Font:** Albert Sans (Google Fonts)
- **Card hover:** `-translate-y-1`, shadow, text color to purple
- **Theme badges:** Color-coded per theme (People=amber, Nature=emerald, Technology=sky, Planning=violet)
- **Topic badges:** Purple outline pills

## Common Tasks

### Refresh practice data from website
```bash
python3.11 build_master_csv.py   # ~2 min, scrapes all 278 practice pages
python3.11 csv_to_jsx.py         # Updates the JSX inline data
```

### Deploy
```bash
git add EnergyTransitionAtlas.jsx practices_master.csv
git commit -m "Update practice data"
git push origin main
# GitHub Pages auto-deploys from main branch
```

### Refresh Panorama practices
```bash
# Step 1: Open panorama.solutions in browser, paste JS from:
python3.11 scrape_panorama.py --print-js
# Step 2: Save clipboard JSON to panorama_raw.json
# Step 3: Merge into CSV
python3.11 scrape_panorama.py
python3.11 csv_to_jsx.py
```

### Refresh OCEaN practices
```bash
python3.11 scrape_ocean.py   # Scrapes 20 Enhancement & Restoration Projects
python3.11 csv_to_jsx.py     # Updates the JSX inline data
```

### Reclassify cross-cutting practices
```bash
python3.11 classify_crosscutting.py  # DRY_RUN=True by default, prints candidates
# Review output, then set DRY_RUN=False in script and re-run to apply
python3.11 csv_to_jsx.py
```

### Add a new practice manually
Add a row to `practices_master.csv`, then run `python3.11 csv_to_jsx.py` to sync.

## Known Data Quality Notes

- **5 practices** have old-style URLs (`database.html?detail=123`) that may not resolve — these are unique practices with no new-URL equivalent (3 old-style duplicates were removed)
- **0 practices** have empty topic fields (6 were backfilled)
- **0 practices** have empty infrastructure fields (141 were backfilled using topic/title classification rules)
- **2 practices** have no image (old website entries with broken URLs)
- **~92 practices** have no description (mostly older/scraped entries)
- `"Europe"` and `"Worldwide"` are used as country values for multi-country practices
- **17 Panorama practices** have no descriptions (scraper captured boilerplate sidebar text; descriptions were cleared)
- **17 Panorama practices** have no year data (Panorama doesn't expose publication dates in the same way)
- **19 OCEaN practices** have descriptions scraped from project pages (Objectives sections)
- **23 practices** have composite (cross-cutting) themes and/or topics (e.g., "Nature, Technology")

---

## 21-Task Improvement Sprint — COMPLETE (2026-03-26)

Original plan was at `.claude/plans/tingly-cooking-micali.md` (since deleted).

### Completed

**Track B — CSV Data Cleanup**
- Removed 5 near-duplicate practices (IDs 67, 140, 143, 147, 161) → 285 practices
- Merged EconiQ data (description + country from ID 67 into ID 66) before deletion
- Backfilled all 141 empty infrastructure fields using topic/title classification rules
- Re-ran `csv_to_jsx.py` → JSX updated with 285 practices

**Track A1 — Quick filter/sort fixes (Tasks 2, 23, 16, 12, 18)**
- Multi-word AND search: query tokens all must match (line ~890)
- Added `dim` to search haystack (line ~888)
- Null-year sort fix: `(a.year ?? 0)` pattern (lines ~908-911)
- Result count: "Showing X of Y practices" (line ~1428)
- Semicolon infrastructure matching: `p.inf.split(/[;,]\s*/)` (line ~902)

**Track A2 — Card improvements (Tasks 1, 3)**
- Added `THEME_COLORS` constant + `themeClasses()` helper (lines ~358-366)
- Replaced brand "RGI" badge with colored theme badge + topic pill on grid cards (lines ~1480-1490)
- Same badges added to list view cards (lines ~1519-1527)
- Theme colors: People=amber, Nature=emerald, Technology=sky, Planning=violet

**Earlier fixes (pre-sprint)**
- Fixed broken cascading theme→topic filter by replacing hardcoded `DIMENSION_TOPICS` with dynamic computation from PRACTICES data (lines ~331-342)
- Consolidated similar topics and reassigned 35+ practices to Planning theme
- Filled 6 empty topics in CSV

**A3: Color contrast (Task 9)** — completed 2026-03-26
- Replaced all `opacity-60`/`opacity-50` on text elements with solid WCAG AA colors
- Result count, card metadata, search icons: `text-[#6B6B6D]` (replaces `text-[#424244] opacity-60`)
- Empty state text: `text-[#767676]` (replaces `text-[#424244] opacity-50`)
- Search icons (desktop + mobile): `text-[#767676]`
- Filter chip labels: `text-[#58044D]/60` (keeps purple tint within chip context)
- Left `disabled:opacity-50` on form selects (standard disabled state, not a contrast issue)

**A4: Filter layout (Tasks 5, 13, 4)** — completed 2026-03-26
- Promoted Topic filter to mobile primary row (now shows Infrastructure, Theme, Topic all in primary row)
- Moved Award out of `expandedFilters` into a standalone toggle button with `IconAward` star icon in both desktop and mobile primary filter rows
- Added cascading filter hint: Topic label dynamically shows selected theme names (e.g., "Topic (People, Nature)") when themes are active
- Mobile expanded panel no longer duplicates Topic filter

**A5: Empty state (Task 17)** — completed 2026-03-26
- Empty state now shows clickable filter chips with remove buttons for each active filter
- Each chip shows label + value + X icon; clicking removes that specific filter
- "Clear all filters" button retained below chips

**A6: Accessibility (Tasks 10, 21)** — completed 2026-03-26
- FilterDropdown: added `aria-expanded`, `aria-haspopup="listbox"`, `role="listbox"`, `role="option"`, `aria-selected` on options, Escape key closes dropdown and returns focus to trigger button
- SubmissionCriteriaModal: added `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap (Tab/Shift+Tab cycle), Escape key closes, auto-focus on open, focus restoration on close

**A7: Content & forms (Tasks 22, 19)** — completed 2026-03-26
- Added amber "Preview" demo banners to both Submit and Contact forms explaining they don't send data, with link to email contact
- Added partner descriptions to About page: RGI, OCEaN, GINGR each have a short paragraph describing their role

### Remaining

All 21 sprint tasks are now complete. No remaining tasks.

---

## Panorama Integration & Planning Reclassification (2026-03-26)

### Completed

**IUCN Panorama Scraping**
- Created `scrape_panorama.py` with two-phase approach: browser JS snippet (Phase 1) + Python CSV merge (Phase 2)
- Phase 1 uses Panorama's map REST API (`/en/rest/explore-solution/json/map`) with 31 energy keywords to find solutions
- Phase 2 scrapes each solution page for title, description, image, country, organisation
- Energy relevance filter (`ENERGY_KEYWORDS` regex) reduces 698 raw solutions to 17 energy-relevant ones
- Automatic theme/topic/infrastructure classification based on keywords
- Deduplication by title against existing CSV practices
- Brand set to "Panorama" (appears as Atlas Partner filter option)
- Browser scraper must run on panorama.solutions due to Cloudflare protection

**Data Quality Fixes**
- Cleared boilerplate descriptions ("Be part of a community, inspire other people to find solutions.") from all 17 Panorama practices — the browser scraper grabbed sidebar text, not actual content
- Fixed HTML entities in titles (`&quot;` → `"`)
- Cleaned multi-location country fields (removed newlines, simplified to primary country)
- Removed 1 false positive (gorilla conservation practice matched "emission" but was not energy-related)

**Planning Theme Reclassification**
- Reclassified 6 practices from People/Technology → Planning (spatial planning, policy, legislation, EIA)
- Reclassified 6 practices from People → Planning, People (planning context with engagement focus)
- Planning theme: 51 pure + 9 composite = 60 planning-related practices (was 45)

**About Page Updates**
- Added Panorama as 6th contributing partner with description
- GINGR ownership, RGI/IUCN co-founding, and all 5 original partners were already present from sprint

**Final counts:** 302 practices total (285 RGI + 17 Panorama)

---

## 7-Task Improvement Sprint — COMPLETE (2026-03-26)

### Completed

**Task 1: Remove "Grids, offshore wind" infrastructure value**
- Practice ID 235 ("HV Voltage Source Converter for Skagerrak 4 Interconnector") changed from `"Grids, Offshore wind"` to `"Grids"`
- Infrastructure filter dropdown no longer shows composite value

**Task 2: Cross-cutting practices classification**
- Created `classify_crosscutting.py` with keyword-based analysis of title + description
- 11 practices reclassified with composite themes (e.g., Nature → Nature, Technology)
- 2 practices gained composite topics (e.g., Bird Protection → Bird Protection, Monitoring & Reporting)
- Total composite practices: 12 → 23
- Key cross-cuts: AI/IoT bird detection (Nature+Tech), planning dialogues (People+Planning), nature-based solutions (Nature+Tech)

**Task 3: Better Panorama practice photos**
- 15 of 17 Panorama practices updated from org logos to actual project photos
- Used Chrome browser to bypass Cloudflare and extract `cover_small` style images from Panorama solution pages
- 2 practices already had suitable photos (IDs 299, 308)

**Task 4: OCEaN scraper and practices**
- Created `scrape_ocean.py` — fetches sitemap from `oc_db_project-sitemap.xml`, scrapes 20 Enhancement & Restoration Project pages
- 19 new OCEaN practices added (IDs 309–327)
- 1 RGI practice re-branded to OCEaN ("Fish hotels", ID 125) via fuzzy title matching
- Theme: mostly Nature, topic: mostly "Nature Conservation & Restoration", inf: "Offshore wind"
- OCEaN automatically appears in Atlas Partner filter (brand system is dynamic)

**Task 5: About page — Vision, Mission & Values**
- Moved "Our Vision" section above Contributing Partners (was below)
- Updated vision text to match gingr.org: "A rapid energy transition enabled by wind, solar and electricity grids..."
- Added "Our Mission" section with GINGR's monitoring/reporting framework mission
- Added "Our Values" section with Nature-Positive (emerald accent) and People-Positive (amber accent) cards

**Task 6: Footer — GINGR only**
- Removed `<GreyscaleRGILogo />` and vertical divider from footer
- Updated contact to "GINGR Secretariat, c/o Renewables Grid Initiative" with `info@gingr.org`
- Updated copyright to "© 2026 GINGR – Global Initiative for Nature, Grids and Renewables"
- Changed all `communication@renewables-grid.eu` references across the site to `info@gingr.org`

**Task 7: Mobile filter layout**
- Mobile filter row changed from `flex-wrap` (two lines) to horizontally scrollable single row
- Added `.scrollbar-hide` CSS utility for clean scroll UX
- Search icon and Sort dropdown pinned to the right with `flex-shrink-0`
- All filter buttons/dropdowns have `flex-shrink-0` to prevent squishing

**Final counts:** 321 practices total (284 RGI + 20 OCEaN + 17 Panorama)

## Learnings for Future Sessions

- **Always re-read file before editing.** The JSX file is ~1650 lines and frequently modified. The Edit tool requires a fresh read — stale reads cause "file modified since read" errors.
- **Dynamic DIMENSION_TOPICS pattern.** The cascading theme→topic filter was broken due to case mismatches in a hardcoded mapping. The fix computes the mapping dynamically from PRACTICES data, eliminating the entire class of bugs. This pattern should be preserved.
- **csv_to_jsx.py only replaces the PRACTICES array.** All other JSX code (components, helpers, styles) survives regeneration. Safe to run after CSV changes.
- **Composite themes/topics.** Some practices have multi-value themes like `"People, Planning"`. The `split(", ")` pattern is used throughout for proper filtering and badge rendering.
- **Line numbers shift.** After editing the PRACTICES array (285 entries vs 290), all subsequent line numbers shift. Always re-read target sections before editing.
- **Worktree agents for CSV work.** Track B ran successfully in a worktree. The agent copied the updated CSV back to main and re-ran csv_to_jsx.py. Clean up the worktree branch after merging: `git branch -D worktree-agent-a0610c89`
- **WCAG AA contrast colors.** Use `#6B6B6D` for secondary text on cream `#FFF8E5` background (replaces `opacity-60`), and `#767676` for tertiary/placeholder text (replaces `opacity-50`). Both pass WCAG AA at these sizes.
- **Award filter is now a standalone toggle button**, not a FilterDropdown. It uses `aria-pressed` and `IconAward`. If re-adding it to expandedFilters, remember to also remove the standalone button to avoid duplication.
- **SubmissionCriteriaModal has a focus trap.** Uses `useEffect` with keydown listener for Tab cycling and Escape close. Focus is restored to the previously focused element on close. This pattern should be replicated for any future modals.
- **Mobile filter layout.** Primary row is now a horizontally scrollable single row with basicFilters (Infrastructure, Theme, Topic) + Award toggle + More button, with search icon and Sort pinned right. The expanded panel only shows Year, Location, Organisation, Atlas Partner, and view toggles. Don't re-add Topic or Award to the expanded panel.
- **Panorama scraper limitations.** Cloudflare blocks direct Python HTTP requests to panorama.solutions. The browser JS snippet must be pasted manually in DevTools. The scraper's description extraction often captures sidebar boilerplate instead of actual content — descriptions may need manual clearing or a better CSS selector.
- **Panorama map API.** The endpoint `/en/rest/explore-solution/json/map?keyword=X&field_ecosystem=All` returns GeoJSON features with `nid` and `title`. Broad keywords (e.g., "climate mitigation") return many non-energy results; the Python-side `ENERGY_KEYWORDS` filter is essential.
- **Brand field drives Atlas Partner filter.** The `allBrands` computed set and `selBrands` filter state are derived dynamically from PRACTICES data. Adding a new brand value (e.g., "Panorama") automatically creates a new filter option. The `BRAND_LINKS` constant maps brand names to URLs for the partner link overlay.
- **Planning reclassification pitfalls.** Keywords like "plan" match "power plant", "sea " matches coastal locations. Manual review is essential — automated reclassification should be conservative and use multi-word patterns.
- **OCEaN website is scrapable with Python.** Unlike Panorama (Cloudflare-blocked), offshore-coalition.eu allows direct `requests` + `BeautifulSoup` scraping. The sitemap at `oc_db_project-sitemap.xml` lists all 20 Enhancement & Restoration Projects. Metadata fields use `div.font-bold.text-secondary` label/value patterns.
- **Cross-cutting classification requires DRY_RUN.** The `classify_crosscutting.py` script defaults to `DRY_RUN = True` — always review candidates before applying. Keywords like "community" or "stakeholder" in Nature descriptions are strong signals for adding People as a second theme.
- **Mobile filter scrollbar-hide pattern.** The `.scrollbar-hide` CSS class hides scrollbars across browsers (webkit, Firefox, IE/Edge). Applied to the mobile filter row with `overflow-x-auto`. Filters scroll horizontally while search/sort stay pinned right via `flex-shrink-0`.
- **Panorama image replacement via browser.** Cloudflare blocks WebFetch/requests, so use Chrome MCP tools to visit each solution page. The `cover_small` Drupal image style provides good card images. Look for images via `.field--name-field-image img` or `og:image` meta tag — avoid `organisation-logo` path images.
- **Footer and contact email.** The footer now uses GINGR-only branding with `info@gingr.org`. All email references across Submit form, Contact form, and footer were updated. The Privacy Policy link still points to renewables-grid.eu.
- **About page structure.** Order is: intro paragraphs → Vision → Mission → Values (2 cards) → Contributing Partners. Values use `border-l-4` with emerald/amber accents matching the Nature/People theme colors.
