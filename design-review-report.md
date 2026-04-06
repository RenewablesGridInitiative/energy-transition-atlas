# Energy Transition Atlas — Multi-Persona Design Review

**Date:** 2026-04-06
**Reviewed by:** 7 AI agents representing distinct audience personas
**Focus:** Aesthetics, mobile experience, accessibility, branding
**Overall Score: 6.4 / 10**

---

## Executive Summary

Seven reviewers representing different audiences (EU policy professional, UX designer, mobile-first NGO worker, accessibility expert, NGO comms director, academic researcher, and climate investor) independently assessed the Energy Transition Atlas. Key findings:

1. **Accessibility is the biggest gap.** Practice cards are not keyboard-navigable, hero animations lack a `prefers-reduced-motion` opt-out, and most touch targets are below the 44px minimum.
2. **Mobile is solid but needs refinement.** The responsive foundation is good (single-column cards, slide-out menu, hidden brand bar), but filter dropdowns overflow, touch targets are cramped, and there's no loading state.
3. **Brand identity is strong but under-leveraged.** The purple + cream palette is distinctive and consistently applied. However, partner logos aren't shown (text links only), brand bar is hidden on mobile, and Open Graph meta tags are missing.
4. **Data users are underserved.** CSV export is buried on the Contact page, Year/Country filters are hidden behind "More Options," and image-heavy cards slow research scanning.
5. **The visual foundation is above-average for the NGO sector** but falls short of institutional-grade platforms. A focused sprint on the quick wins below would move the score above 7.5.

---

## Reviewer Scores

| # | Persona | Rating | Primary Concern |
|---|---------|--------|-----------------|
| 1 | EU Energy Policy Professional | 7.5/10 | Partner logos missing from brand bar |
| 2 | UX/Visual Designer | 7/10 | Font loading may be broken; touch targets |
| 3 | Mobile-First NGO Worker (25) | 7/10 | Loading blank screen; tiny dropdown targets |
| 4 | Accessibility Expert | 5/10 | Cards not keyboard-accessible; no reduced-motion |
| 5 | NGO Communications Director | 7/10 | No OG meta tags; no mobile partner branding |
| 6 | Academic Researcher | 6/10 | CSV export buried; search hidden on mobile |
| 7 | Climate Investor | 5.5/10 | Blank loading screen; filter UX overwhelming on mobile |

---

## Mobile Experience (Priority Section)

All 7 reviewers assessed the mobile experience. Here are the consensus mobile findings:

### What works well on mobile
- **Single-column card layout** — correct ratio, readable titles, theme badges wrap naturally
- **Slide-out navigation** — 288px purple panel is comfortable on 390px screens, large touch targets on menu items
- **Hero graphic compromise** — 20% opacity globe behind text adds texture without clutter
- **Back-to-top button** — 48x48px, well-positioned in thumb zone (bottom-right)
- **Body scroll lock on modal** — prevents background jumping, a common mobile pitfall avoided
- **Brand bar hidden on mobile** — reduces clutter (though partner visibility suffers)

### What needs improvement on mobile
- **Touch targets too small** (5 reviewers) — dropdown rows ~28px, filter pills ~32px, modal close ~24px
- **No loading state** (3 reviewers) — Babel transpilation causes 1-3s blank screen
- **Filter dropdowns overflow** (4 reviewers) — `w-72` fixed width clips on right-aligned buttons at 375px
- **Search bar hidden** (2 reviewers) — requires gear icon tap + panel expansion before typing
- **Filter density overwhelming** (2 reviewers) — 8+ controls on 375px, needs bottom-sheet pattern
- **Modal close unreachable** (1 reviewer) — top-right x on tall phones is outside thumb zone
- **No partner branding on mobile** (2 reviewers) — stakeholders on phones see zero partner attribution until footer

---

## Top 10 Prioritized Design Suggestions

### 1. Make practice cards keyboard-accessible
**What:** Add `tabIndex={0}`, `role="button"`, and `onKeyDown` (Enter/Space triggers click) to each card `<div>`. Add `focus-visible:outline-2 outline-offset-2 outline-[#6B21A8]`.
**Why:** Screen reader and keyboard users cannot access any of the 323 practices — a WCAG 2.1 Level A failure. *(Accessibility Expert, UX Designer)*
**Effort:** S (< 1 hour)
**Before:** Cards are inert divs, invisible to assistive tech
**After:** Cards are focusable, announced as interactive, operable via keyboard

### 2. Increase touch targets to 48px minimum
**What:** Set `min-height: 48px` on filter pills, dropdown option rows (`py-1.5` → `py-3`), view toggle buttons, modal close button, and About page nav pills.
**Why:** Five reviewers flagged this. Current 24-36px targets cause mis-taps on mobile. *(UX Designer, Mobile Worker, Accessibility Expert, Researcher, Investor)*
**Effort:** S
**Before:** Cramped, error-prone tapping on all filter interactions
**After:** Comfortable, WCAG-compliant touch across all interactive elements

### 3. Add `prefers-reduced-motion` media query
**What:** Wrap the 6 `@keyframes` animations in `@media (prefers-reduced-motion: no-preference) { ... }`. When reduced motion is preferred, set `animation: none` for all `.hero-*` classes.
**Why:** WCAG 2.3.3 requirement. Perpetual 90s rotation and floating icons have no opt-out. *(Accessibility Expert, UX Designer)*
**Effort:** S
**Before:** Animations always play regardless of user preferences
**After:** Animations respect OS accessibility settings

### 4. Add Open Graph and Twitter Card meta tags
**What:** In `index.html` `<head>`, add `og:title`, `og:description`, `og:image` (branded 1200x630 card), `og:url`, `twitter:card=summary_large_image`, and matching Twitter tags.
**Why:** Shared links produce blank previews on LinkedIn, WhatsApp, Slack — a major barrier for an advocacy tool. *(NGO Comms Director)*
**Effort:** S
**Before:** Empty, unbranded link previews everywhere
**After:** Rich branded social cards when shared on any platform

### 5. Add loading skeleton/spinner
**What:** Add inline `<style>` + HTML spinner inside the `#root` div in `index.html`. React mount replaces it automatically. Use GINGR purple + cream with a simple pulsing animation.
**Why:** Three reviewers noted the blank screen during Babel transpilation undermines first impressions. *(Mobile Worker, Comms Director, Investor)*
**Effort:** M (half day)
**Before:** White/blank screen for 1-3 seconds on every load
**After:** Branded skeleton appears instantly, transitions to content

### 6. Display partner logos in brand bar
**What:** Replace text links with `<img>` tags referencing existing assets (`logos/rgi-white.svg`, `logos/ocean.svg`, etc.). Equalize heights at ~28px with `object-contain`.
**Why:** Logo assets exist but aren't used. Text links undermine institutional credibility. *(Policy Pro, Comms Director, Investor)*
**Effort:** S
**Before:** "GINGR | RGI | IUCN" as plain text links
**After:** Recognizable partner logos reinforcing multi-stakeholder credibility

### 7. Fix filter dropdown viewport overflow
**What:** Replace fixed `w-72` with `max-w-[calc(100vw-2rem)]` on mobile. Add `right-0` positioning for right-aligned dropdowns. Consider `position: fixed` or portal on mobile.
**Why:** Four reviewers observed clipping on 375px screens. Filters are the primary interaction. *(Policy Pro, Mobile Worker, Researcher, Investor)*
**Effort:** S
**Before:** Right-side dropdowns clip off-screen on phones
**After:** Dropdowns stay within viewport on all screen widths

### 8. Move CSV export to results toolbar
**What:** Add download icon-button next to sort/view controls with tooltip "Export filtered results as CSV." Keep Contact page copy as secondary location.
**Why:** Researchers — a key audience — can't find the export. Data users expect export adjacent to data. *(Academic Researcher)*
**Effort:** S
**Before:** Export hidden 3 clicks away on Contact page
**After:** One-click export visible alongside filtered results

### 9. Verify and fix font loading
**What:** Audit `index.html` for Google Fonts `<link>` tags loading League Gothic and Kantumruy Pro. The JSX references these fonts but they may not be declared in the HTML head. Add `font-display: swap`.
**Why:** If fonts don't load, the entire typographic hierarchy collapses to system sans-serif. *(UX Designer)*
**Effort:** S
**Before:** Potentially broken font stack with invisible degradation
**After:** Reliable, performant font loading with graceful fallback

### 10. Full-screen mobile filter panel (bottom sheet)
**What:** On screens below `md`, replace inline filter dropdowns with a "Filters" button opening a full-screen bottom sheet (`position: fixed; inset: 0`). Show active filter count as badge. Include "Apply" and "Clear all" at bottom.
**Why:** Three reviewers found 8+ filter controls overwhelming on 375px. Bottom-sheet is standard in mobile directories. *(Policy Pro, Researcher, Investor)*
**Effort:** M
**Before:** Cramped multi-row filter bar with tiny controls
**After:** Clean single button opening a spacious, scrollable filter panel

---

## Quick Wins (single session, ~4 hours)

These 8 items are S-effort with high or medium impact:

- [ ] Cards: `tabIndex={0}`, `role="button"`, `onKeyDown`, focus outline
- [ ] Touch targets: `min-h-[48px]` on pills, dropdown rows, toggles, modal close
- [ ] `prefers-reduced-motion` wrapper around all `@keyframes`
- [ ] OG/Twitter meta tags in `index.html`
- [ ] Partner logos in brand bar (assets already in `logos/`)
- [ ] Dropdown overflow: `max-w-[calc(100vw-2rem)]` + right-align fix
- [ ] CSV export icon-button in toolbar
- [ ] Font audit: confirm fonts load, add `font-display: swap`

---

## Strategic Improvements (roadmap)

### Near-term (1-2 sprints)
- **Loading skeleton** — inline HTML/CSS spinner replaced on React mount. Eliminates blank-screen problem without changing the build pipeline.
- **Full-screen mobile filter panel** — bottom-sheet pattern with filter count badge. Transforms mobile filtering from cluttered to polished.
- **Hero data callouts** — surface "323 practices / 40+ countries / 6 partners" and an above-the-fold search bar for data-oriented users.
- **Mobile partner branding** — compact "A GINGR platform by RGI & IUCN" line visible on mobile, replacing the hidden brand bar.

### Medium-term (architecture discussion needed)
- **Build pipeline migration** (Vite or similar) — eliminates Babel-in-browser transpilation, enables code splitting. High effort but resolves root performance issue.
- **Compact table/research view** — sortable, dense table mode alongside grid/list. High value for academic and investor personas.
- **Brand bar contrast fix** — `#C9C9C9` on `#424244` fails WCAG AA at 3.6:1. Lighten text to `#E0E0E0` (~5.2:1).

---

## Appendix: Full Reviewer Perspectives

### Review 1: EU Energy Policy Professional (7.5/10)

The site projects a credible, semi-institutional identity. The purple-and-cream palette is distinctive without being flashy, and the League Gothic headings give it a conference-ready feel. The brand bar with text links (not logos) weakens institutional credibility. The filter architecture is strong with cascading theme-to-topic, region groupings, and URL param syncing. On tablet, the hero takes meaningful space but is acceptable. The mobile slide-out menu is well-executed with good touch targets. Filter dropdowns could overflow the viewport edge on narrow devices. The practice detail modal works well on tablet with proper scroll lock.

**Top suggestions:** Add partner logos to brand bar/footer. Full-screen mobile filter panel. Vary typography on long-form pages (About page relies too heavily on League Gothic all-caps headings at a single size).

---

### Review 2: UX/Visual Designer (7/10)

The design system is reasonably coherent — consistent border-radius language (`rounded-full` for pills, `rounded-xl` for cards, `rounded-2xl` for modals), systematic color usage, and disciplined spacing. Minor button height mismatch in the toolbar row (2px). The violet theme color creates some confusion with the primary purple. The 90s globe rotation is well-calibrated and floating icons feel organic. Card hover has a timing mismatch: lift at 200ms vs image zoom at 300ms.

Critical finding: League Gothic and Kantumruy Pro are referenced in the JSX but may not be loaded via `<link>` tags in `index.html`, potentially collapsing the typographic hierarchy to system fonts. Touch targets are significantly undersized for mobile (filter pills ~32px, dropdown options ~28px, modal close ~24px). No `focus-visible` ring on cards.

**Top suggestions:** Fix font loading. Increase mobile touch targets to 48px. Align animation timing and add focus-visible to cards.

---

### Review 3: Mobile-First Young Professional (7/10)

Clean, confident first impression on mobile. The purple header is bold, cream background warm. Smart decision to hide the brand bar. But the Babel standalone file (~2MB) causes a noticeable blank-screen delay with no loading state. The hero globe at 20% opacity behind text is tasteful, taking ~40-45% of viewport — borderline acceptable. "MENU" as text is actually more discoverable than a hamburger icon. The slide-out at 288px on a 390px screen is comfortable.

Finding "Bird Protection" in "Germany" takes 6 taps — reasonable. But dropdown options at `py-1.5` (~24px) are too small for fingers. Modal close button (x) in top-right is hard to reach one-handed on tall phones — needs swipe-to-dismiss or bottom-positioned close. The back-to-top button (48x48px) is perfectly placed.

**Top suggestions:** Add loading skeleton. Increase touch targets on filter dropdowns. Move modal close to thumb zone.

---

### Review 4: Accessibility Expert (5/10)

Color contrast mostly passes: #424244 on #FFF8E5 is ~10.5:1, #6B6B6D on #FFF8E5 is ~4.8:1, #767676 on #FFF8E5 is borderline at ~4.5:1. However, brand bar text (#C9C9C9 on #424244) **fails AA at ~3.6:1**.

**Critical:** No `prefers-reduced-motion` media query exists anywhere. Six perpetual CSS animations with no opt-out — vestibular disorder risk. **Critical:** Practice cards have no `tabIndex`, `role="button"`, or `onKeyDown`. Keyboard and screen reader users cannot reach any of the 323 practices. This fails WCAG SC 2.1.1 and SC 4.1.2. Filter dropdowns have ARIA mismatch (role="option" on labels). Mobile menu lacks focus trap (unlike the modal which has one). Award badge SVG is invisible to screen readers.

Touch targets: filter pills ~32px, dropdown options ~28px, modal close ~24px, view toggles ~36px, About nav pills ~26px — most below 44px minimum.

**Top suggestions:** Make cards keyboard-accessible. Add prefers-reduced-motion. Increase mobile touch targets.

---

### Review 5: NGO Communications Director (7/10)

Reads as "well-designed initiative platform" — appropriate for GINGR positioning. Purple + cream is distinctive vs typical blue/green NGO sites. Strong brand discipline: purple applied consistently across all interactive elements. About page is well-structured with partner-inclusive tone. Submit and Contact pages maintain consistency.

**Critical gap:** No Open Graph or Twitter Card meta tags. Shared links produce blank previews on LinkedIn, WhatsApp, Slack. For an NGO communications tool, this is a high-impact omission. Brand bar is hidden on mobile — stakeholders viewing shared links on phones see zero partner attribution until the footer. The brand bar uses text links instead of the logo assets that exist in the repo.

**Top suggestions:** Add OG/Twitter meta tags with branded social image. Show partner branding on mobile. Add partner logos to brand bar and About page.

---

### Review 6: Academic Researcher (6/10)

Default grid view is too image-heavy for research. Card images consume half the visual weight while metadata (year, country, org) is rendered in tiny secondary grey. List view is available but not default. The filter system is well-designed: AND search, cascading theme→topic, region groupings, URL params. But Year and Country are hidden behind "More Options" — researchers need these constantly.

**CSV export is buried on the Contact page** — a significant discoverability problem. The export itself is well-implemented (respects filters, UTF-8 BOM, descriptive filename). Practice modal provides all 13 fields in logical layout but has no citation copy feature.

On mobile, the search bar requires 3 interactions to reach (scroll past hero, tap gear icon, then find search input). Load-more pagination means 16 taps for the full 323-item dataset.

**Top suggestions:** Move CSV export to results toolbar. Make search and year/country always visible. Offer compact table view.

---

### Review 7: Climate Investor (5.5/10)

Visual language is competent but not investment-grade. The single 2100-line React component transpiled client-side via Babel signals prototype, not production. Data curation is strong (7/10) but technical implementation holds it back (4/10). The hero globe reads as "creative student project" rather than "authoritative platform" — wants prominent data callouts instead (practice count, country count, partner count).

No loading skeleton, no SSR, no code splitting means blank page on load. About page lacks quantitative impact data (downloads, citations, traction). On mobile, filter density is overwhelming — 8+ controls on 375px with dropdown overflow risk. Would hesitate to show this to a co-investor from a phone.

**Top suggestions:** Proper build pipeline + loading skeleton. Lead with data callouts not illustration. Bottom-sheet mobile filter pattern.

---

*Report generated by 7 AI reviewer agents with moderator synthesis and design director prioritization.*
