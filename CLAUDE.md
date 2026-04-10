# CLAUDE.md — Energy Transition Atlas

## Project Overview

The **Energy Transition Atlas** is a mobile-first single-page web application displaying a searchable, filterable directory of 323 energy transition best practices. It is owned by the Global Initiative for Nature, Grids and Renewables (GINGR), a joint initiative of RGI and IUCN.

**Live site:** https://renewablesgridinitiative.github.io/energy-transition-atlas/
**Repo:** https://github.com/RenewablesGridInitiative/energy-transition-atlas

## Architecture

- **Frontend:** Single React 18 component (`EnergyTransitionAtlas.jsx`, ~1984 lines) loaded via Babel standalone transpilation
- **Styling:** Tailwind CSS (CDN)
- **Data:** Practice data is inlined as a static JS array (`const PRACTICES = [...]`) — no API or database
- **Hosting:** GitHub Pages, deployed from `main` branch root
- **Entry point:** `index.html` loads React, Babel, Tailwind, and the JSX component

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Entry point |
| `EnergyTransitionAtlas.jsx` | Main React component — all UI, filters, data, and logic |
| `practices_master.csv` | Master data (323 practices, 13 columns). Source of truth |
| `build_master_csv.py` | Merges Excel + scraped website data into the CSV |
| `csv_to_jsx.py` | Converts CSV into the PRACTICES JS array and injects into JSX |
| `scrape_panorama.py` | Two-phase IUCN Panorama scraper (browser JS + Python merge) |
| `scrape_ocean.py` | OCEaN scraper (sitemap + BeautifulSoup) |
| `scrape_descriptions.py` | Backfills empty `desc` fields by scraping practice URLs |
| `classify_crosscutting.py` | Identifies and applies cross-cutting theme/topic classifications |
| `logos/` | Partner logos: `gingr.svg`, `gingr-white.svg`, `rgi.svg`, `rgi-white.svg`, `ocean.svg`, `iucn.png`, `sl4b.svg`, `panorama.svg`, `grid-award.svg` |
| `favicon.png` | Site favicon (GINGR brand asset) |
| `admin.html` | Password-protected admin page (GitHub PAT auth, not linked from main nav) |
| `admin-config.json` | Editable About page text, loaded at runtime by the JSX component |
| `.github/workflows/update-practices.yml` | GitHub Action: auto-regenerates JSX PRACTICES array when CSV is pushed |

## Data Pipeline

```
Excel spreadsheet  ──┐
                      ├──> build_master_csv.py ──> practices_master.csv ──> csv_to_jsx.py ──> JSX
Website scraping   ──┘

Panorama browser JS ──> panorama_raw.json ──> scrape_panorama.py ──> CSV ──> csv_to_jsx.py
OCEaN sitemap ──> scrape_ocean.py ──> CSV ──> csv_to_jsx.py
```

`csv_to_jsx.py` only replaces the `const PRACTICES = [...]` array. All other JSX code survives regeneration.

## CSV Schema (13 columns)

| Column | Type | Description |
|--------|------|-------------|
| `id` | int | Auto-assigned sequential ID |
| `title` | string | Practice title |
| `url` | string | Link to practice page (renewables-grid.eu, panorama.solutions, or offshore-coalition.eu) |
| `brand` | string | "RGI", "OCEaN", or "Panorama" — drives Atlas Partner filter |
| `theme` | string | People, Technology, Nature, Planning, or composite (e.g., "Nature, Technology") |
| `topic` | string | Normalized topic, may be composite (e.g., "Bird Protection, Monitoring & Reporting") |
| `inf` | string | Infrastructure type (e.g., "Grids", "Offshore wind") |
| `year` | int/empty | Publication year |
| `country` | string | Country, region, or "Europe"/"Worldwide" |
| `org` | string | Organisation name |
| `desc` | string | Short description (used in search and detail popup) |
| `img` | string | Image URL (preferably 644x398) |
| `award` | bool | Whether the practice won an RGI Grid Awards Good Practice of the Year |

## Frontend Features

- **Practice detail popup:** Click a card to see full metadata (theme, topic, infrastructure, year, country, org, Atlas Partner, description) with a "Go to practice" external link. Shows "RGI Grid Awards — Good Practice of the Year (YYYY)" for award winners. Modal locks body scroll (`overflow: hidden`) to prevent page jumping. Accessible modal with focus trap.
- **Filters:** Multi-select dropdowns for Infrastructure, Theme, Topic, Country (with region groupings), Year, Organisation, Atlas Partner. Standalone Award toggle button.
- **Search:** Free-text AND search across title, desc, org, topic, country, theme
- **Sort:** Newest, Oldest, A-Z, Z-A
- **Views:** Grid (responsive 1/2/3 columns) and List
- **Load More:** Shows 21 practices initially, +21 per click
- **CSV Export:** "Download filtered results as CSV" button on Contact page
- **URL params:** Filter state synced to query params for shareability
- **Country normalization:** `COUNTRY_NORMALIZE` + `normalizeCountry()` — UI-layer only, CSV untouched
- **Cascading filters:** Theme→Topic filter dynamically computed from PRACTICES data. Topic label shows active theme names.
- **Empty state:** Shows clickable filter chips with remove buttons for each active filter
- **Brand bar:** Desktop-only partner logo strip with equalised logo sizes. Hidden on mobile.
- **About page:** Atlas-focused intro → Vision → Mission → Values → How Practices Are Collected → RGI Grid Awards (Golden Pylon, three categories) → Contributing Partners (with logos) → Partner CTA. Text is partner-inclusive, not GINGR-specific.
- **Favicon:** GINGR brand favicon (`favicon.png`), linked in `index.html`.
- **Mobile:** Filters wrap onto two rows. Hamburger menu with slide-out overlay for navigation.

## Design Tokens

- **Primary purple:** `#6B21A8`
- **Cream background:** `#FFF8E5`
- **Charcoal text:** `#424244`
- **Secondary text:** `#6B6B6D` (WCAG AA on cream)
- **Tertiary text:** `#767676` (WCAG AA on cream)
- **Font:** Albert Sans (Google Fonts)
- **Theme colors:** People=amber, Nature=emerald, Technology=sky, Planning=violet
- **Card hover:** `-translate-y-1`, shadow, text color to purple

## Common Tasks

### Refresh practice data from website
```bash
python3.11 build_master_csv.py   # ~2 min, scrapes practice pages
python3.11 csv_to_jsx.py         # Updates the JSX inline data
```

### Backfill missing descriptions
```bash
python3.11 scrape_descriptions.py  # Scrapes empty desc fields from practice URLs
python3.11 csv_to_jsx.py
```

### Refresh Panorama practices
```bash
python3.11 scrape_panorama.py --print-js  # Get browser JS snippet
# Paste in DevTools on panorama.solutions, save JSON to panorama_raw.json
python3.11 scrape_panorama.py              # Merge into CSV
python3.11 csv_to_jsx.py
```

### Refresh OCEaN practices
```bash
python3.11 scrape_ocean.py   # Scrapes Enhancement & Restoration Projects
python3.11 csv_to_jsx.py
```

### Deploy
```bash
git add EnergyTransitionAtlas.jsx practices_master.csv
git commit -m "Update practice data"
git push origin main
# GitHub Pages auto-deploys from main branch
```

### Add a practice manually
Add a row to `practices_master.csv`, then run `python3.11 csv_to_jsx.py`.

### Update practices via Admin page
Navigate to `admin.html`, authenticate with a GitHub PAT that has `repo` scope, and upload a new CSV. A GitHub Action automatically runs `csv_to_jsx.py` and commits the regenerated JSX.

### Edit About page text
Use the Admin page's "Edit About Page" tab. Changes are saved to `admin-config.json` via GitHub API and appear on the live site immediately.

## Data Quality Notes

- **323 practices:** 284 RGI + 20 OCEaN + 17 Panorama (2 Panorama are missing images)
- **5 practices** have old-style URLs (`database.html?detail=123`) that may not resolve
- **17 Panorama practices** have no year data
- **23 practices** have composite (cross-cutting) themes and/or topics
- All descriptions are backfilled (was ~109 empty, scraped via `scrape_descriptions.py`)
- All infrastructure fields are populated (141 were backfilled via classification rules)
- `"Europe"` and `"Worldwide"` are used as country values for multi-country practices

## Learnings for Future Sessions

- **Always re-read file before editing.** The JSX file is ~1984 lines. Line numbers shift after any edit. The Edit tool requires a fresh read.
- **Composite themes/topics.** Practices can have multi-value themes like `"People, Planning"`. The `split(", ")` pattern is used throughout for filtering and badge rendering.
- **Brand field is dynamic.** Adding a new brand value (e.g., "Panorama") to CSV automatically creates a new Atlas Partner filter option. `BRAND_LINKS` constant maps brand names to URLs.
- **Award filter is a standalone toggle button**, not a FilterDropdown. Uses `aria-pressed` and `IconAward`.
- **Focus trap pattern.** `PracticeDetailModal` and `SubmissionCriteriaModal` both use `useEffect` with keydown listener for Tab cycling and Escape close, with focus restoration. Replicate for future modals.
- **Mobile filter layout.** Filters wrap onto two rows. Brand bar is hidden on mobile (`hidden md:flex`). Don't re-add horizontal scrolling.
- **Panorama scraper limitations.** Cloudflare blocks Python requests. Browser JS snippet must be pasted in DevTools. Description extraction often captures sidebar boilerplate — may need manual clearing.
- **OCEaN is scrapable with Python.** offshore-coalition.eu allows direct requests + BeautifulSoup. Sitemap at `oc_db_project-sitemap.xml`.
- **Cross-cutting classification requires DRY_RUN.** `classify_crosscutting.py` defaults to `DRY_RUN = True`. Keywords like "plan" match "power plant" — manual review is essential.
- **Country normalization is UI-layer only.** CSV is untouched. `COUNTRY_NORMALIZE` maps cities/variants to clean country names. Region groupings (Northern Europe, etc.) are computed in the filter dropdown.
- **Footer uses GINGR-only branding** with `info@gingr.org`. Privacy Policy link still points to renewables-grid.eu. Footer grid is `2fr 1fr 1fr` to give the GINGR description column more space.
- **IUCN logo needs dark background** (`logoBg: true` / `invert: true`) — it's white-on-transparent PNG.
- **Tailwind CDN arbitrary values work** for things like `grid-cols-[2fr_1fr_1fr]`.
- **Modal body scroll lock.** `PracticeDetailModal` sets `document.body.style.overflow = 'hidden'` on open and restores on close. Without this, opening a modal from the top of the page causes scroll-to-bottom.
- **RGI Grid Awards branding.** The ceremony is "RGI Grid Awards", the trophy is the "Golden Pylon", the award name is "Good Practice of the Year YYYY". Three categories: Nature-Positive, People-Positive, Innovation. Reference: https://renewables-grid.eu/award/
- **About page tone.** Text should be Atlas-focused and partner-inclusive, not GINGR-specific. Leave room for new partners to join. Avoid overly prescriptive "Nature-Positive / People-Positive" framing in general Atlas copy (reserve for award categories).
- **Admin page (`admin.html`).** Standalone page, not linked from main nav. Uses GitHub Personal Access Token for auth (stored in `sessionStorage` only). Commits files via GitHub Contents API. Token needs `repo` scope (or fine-grained "Contents: Read and write" on this repo).
- **About page text is now dynamic.** Loaded from `admin-config.json` at runtime via `fetch()`. Falls back to inline defaults if the file is missing or fails to load. Editable through the admin page.
- **Submit page is now informational.** No form — shows submission criteria inline and partner pathway cards with external links. The `SubmissionCriteriaModal` component was removed.
- **Contact page has no form.** Just email link + address + CSV export. `contactForm`/`contactSuccess` states were removed.
- **Hero graphic is responsive.** The `HeroGraphic` component renders an animated SVG (globe + topic icons). On mobile it appears below the text (smaller, `w-48`), on desktop it sits to the right (`lg:w-5/12`). Uses CSS `@keyframes` for rotation and floating animations.
- **csv_to_jsx.py uses relative paths.** Updated from hardcoded `/Users/intern/Desktop/ETA/` to `os.path.dirname(__file__)`.

## Custom Domain Setup

The site is hosted on GitHub Pages. To add a custom domain:

1. **Buy a domain** from any registrar (Namecheap, Cloudflare, etc.)
2. **DNS records** — add four A records pointing to GitHub's IPs:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
   - Optionally add a CNAME for `www` → `renewablesgridinitiative.github.io`
3. **GitHub Settings** — repo Settings → Pages → Custom domain → enter the domain → check "Enforce HTTPS"
4. GitHub auto-creates a `CNAME` file in the repo. HTTPS certificate provisions within ~30 minutes.
5. The admin page will be accessible at `https://yourdomain.com/admin.html`

## Admin Page

**URL:** `admin.html` (not linked from the main navigation — direct URL only)

**Authentication:** Uses a GitHub Personal Access Token (PAT) entered at runtime. The token is stored in `sessionStorage` only (cleared on tab close) and is never committed to the repository. Only users with write access to the GitHub repo can use the admin page.

**How to create a token:**
1. GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
2. Set repository access to this repo only
3. Grant "Contents: Read and write" permission
4. Generate and copy the token

**Features:**
- **Upload CSV tab:** Drag-and-drop `practices_master.csv`. The file is committed to the repo via GitHub API. A GitHub Action (`.github/workflows/update-practices.yml`) automatically runs `csv_to_jsx.py` to regenerate the PRACTICES array and commits the result.
- **Edit About Page tab:** Edit vision, mission, values, collection text, and partner CTA. Changes are saved to `admin-config.json` via GitHub API and appear on the live site immediately (the JSX component loads this file at runtime via `fetch()`).

**Security:** The admin page is publicly accessible (it's in a public repo) but does nothing without a valid PAT. Security comes from the GitHub token, not from hiding the page. To restrict further, move the repo to a company GitHub org and/or make it private (requires a paid GitHub plan for Pages on private repos).

## Completed Sprints (Summary)

All sprints completed 2026-03-26/27. Key milestones:
1. **21-task sprint:** Dedup, filter fixes, card redesign, accessibility, WCAG contrast, empty state, form previews
2. **Panorama integration:** 17 IUCN Panorama practices, Planning reclassification
3. **7-task sprint:** Cross-cutting classification, OCEaN scraper (20 practices), About page vision/mission/values, GINGR footer branding
4. **About/footer sprint:** Partner logos, Grid Award section, country normalization, partner CTA
5. **14-task sprint:** Practice detail popup, CSV export, brand bar, mobile menu redesign, region groupings, description backfill, hero tagline, contact GINGR branding, submission criteria update, dead code removal
6. **Mobile/brand fixes:** Brand bar hidden on mobile, filters wrap instead of scroll, white logos for desktop brand bar
7. **8-fix sprint:** Modal scroll lock, equalised brand bar logos, About page rewrite (Atlas-focused, partner-inclusive), footer grid rebalance, Atlas Partner in popup, RGI Grid Awards branding (Golden Pylon, categories), favicon
8. **Branding & admin sprint:** Primary color changed to `#6B21A8` (vivid purple), animated hero SVG (globe + topic icons, desktop only), Submit page redesigned as informational (no form, partner pathways), Contact page simplified (email only, no form), GitHub-native admin page (`admin.html`) with PAT auth for CSV upload + About text editing, About page text extracted to `admin-config.json` for runtime loading, GitHub Action for auto-regenerating JSX from CSV
