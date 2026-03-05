# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**BORDUR** — static website for a Russian paving tile, curb, and compensator manufacturer. Pure HTML + CSS + JS, no frameworks, no build tools, no npm. Design reference: braer.ru.

## Development

No build step — open files directly in a browser or use a local static server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

There are no tests, linters, or compilation steps. Edit files and refresh the browser.

### Git commits

**Never create git commits automatically after making code changes.** Only commit when the user explicitly asks (e.g., "сделай коммит", "commit this").

---

## Reference Site Inspection (mandatory)

When the user shares a URL as a design reference, **always** open it with `mcp__playwright__browser_navigate`, take a full-page screenshot with `mcp__playwright__browser_take_screenshot` (`fullPage: true`) saving to the `screenshots/` directory, and read the screenshot to understand how the page actually looks. Do not rely solely on HTML/text fetched via `WebFetch` — visual context (layout, spacing, typography, colors, imagery) is critical for accurate design work.

---

## Visual Development

### Design Principles
- Design specification in `DOCS.md` (~900 lines) — read before making significant visual changes
- Design reference: braer.ru — when in doubt about layout or style, inspect the reference site first
- When making visual (front-end, UI/UX) changes, always refer to `DOCS.md` and the Key Conventions section below

### Frontend Design Skill (mandatory)

Whenever the user requests a design change, redesign, or new UI work — or you are making a significant UI change as part of a larger task — **always** invoke the `frontend-design` skill before implementing. This ensures distinctive, high-quality aesthetics that avoid generic AI patterns. Pass the task context (section name, design reference, mood) as arguments to the skill. "Significant" means any change that affects layout, typography, colors, spacing, or introduces new visual components.

### Comprehensive Design Review

Invoke the `design-review` skill for thorough validation when:
- Completing a significant UI/UX feature
- Before finalizing any PR with visual changes
- Needing accessibility and full responsiveness testing

### Quick Visual Check (mandatory after every front-end change)

IMMEDIATELY after implementing any front-end change:

1. **Identify what changed** — review the modified files/sections
2. **Navigate to affected pages** — `mcp__playwright__browser_navigate` → `http://localhost:8080/<path>`, viewport 1440×900
3. **Take a full-page screenshot** — save to `screenshots/` with a descriptive name
4. **Verify visually** — compare against the design reference or user's request. Check exact hex colors, pixel spacing, font sizes
5. **Check console errors** — `mcp__playwright__browser_console_messages` level `error`. Fix any before continuing
6. **Fix and repeat** — if anything is off, fix and go back to step 2
7. **Mobile check** — resize to 375×812, screenshot, verify responsive layout

| Action | Tool |
|--------|------|
| Open page | `mcp__playwright__browser_navigate` |
| Resize viewport | `mcp__playwright__browser_resize` |
| Full-page screenshot | `mcp__playwright__browser_take_screenshot` (`fullPage: true`) |
| Console errors | `mcp__playwright__browser_console_messages` |
| DOM snapshot | `mcp__playwright__browser_snapshot` |

### Local server

The project has no build step. Start a static server before visual checks:

```bash
python3 -m http.server 8080
```

Then pages are accessible at:
- Homepage: `http://localhost:8080/index.html`
- Subpages: `http://localhost:8080/pages/catalog-plitka.html`

---

## Architecture

### Pages

| Path | Description |
|------|-------------|
| `index.html` | Homepage: Hero tabs, video banner, stats, interactive catalog, FAQ, contacts map, callback form |
| `pages/catalog.html` | Catalog overview — links to category pages |
| `pages/catalog-plitka.html` | Tile catalog with filters (form, collection, thickness) + product popup |
| `pages/catalog-bordyury.html` | Curb catalog with filters (collection) + product popup |
| `pages/catalog-kompensatory.html` | Compensator catalog with filters + SVG cross-section popup |
| `pages/about.html` | About the company |

### Entry point

**Active homepage:** `index.html` — all inner pages link here via `../index.html`.
Old versions (`index-v2.html`, `index-v3.html`) are kept for reference only; do not modify them.

### Shared assets

All pages load the same scripts in this exact order:

```html
<script src="js/header.js"></script>
<script src="js/footer.js"></script>
<script src="js/main-v3.js"></script>
<script src="js/lead-form.js"></script>
```

For subpages in `pages/`, prefix with `../js/`.

| File | Role |
|------|------|
| `css/style-v3.css` | Single CSS file — design system, all components, responsive |
| `js/header.js` | Injects header + mobile menu HTML (IIFE, auto-detects subpage path) |
| `js/footer.js` | Injects footer + cookie bar + back-to-top (IIFE, auto-detects subpage path) |
| `js/main-v3.js` | Core JS: scroll effects, hero tabs, promo bar, animations, Yandex Maps, callback form |
| `js/lead-form.js` | Lead form modal (injects its own CSS + HTML dynamically) |

`header.js` and `footer.js` use `isSubpage` (regex on `window.location.pathname`) to build correct relative links. Pages contain **no inline header/footer HTML** — it is fully injected by JS. They expose `window.__closeMenu` for mobile menu integration with `main-v3.js`.

### Catalog pages

Each catalog page has its own JS file loaded after `main-v3.js`:

| JS file | Responsibility |
|---------|----------------|
| `js/catalog-plitka.js` | Tile catalog: filters + popup with size visualization blocks |
| `js/catalog-bordyury.js` | Curb catalog: filters + popup with specs/logistics tabs |
| `js/catalog-kompensatory.js` | Compensator catalog: filters + popup with SVG cross-section profile |

**Product data** lives entirely in `data-*` attributes on `.product-card` elements — no JSON, no API calls at runtime.

### File layout

```
bordur/
├── index.html                      ← Active homepage
├── css/style-v3.css                ← All styles (design system + components)
├── js/
│   ├── header.js                   ← Dynamic header + mobile menu (IIFE)
│   ├── footer.js                   ← Dynamic footer + cookie bar (IIFE)
│   ├── main-v3.js                  ← Core JS
│   ├── lead-form.js                ← Lead form modal
│   ├── catalog-plitka.js
│   ├── catalog-bordyury.js
│   └── catalog-kompensatory.js
├── pages/
│   ├── about.html
│   ├── catalog.html
│   ├── catalog-plitka.html         ← Tile products
│   ├── catalog-bordyury.html       ← Curb products
│   └── catalog-kompensatory.html   ← Compensator products
├── img/                            ← Product images (plitka/, bordyury/, kompensatory/, gonami/)
├── img-main/                       ← Hero / gallery images
├── video/production.mp4            ← Background video for v4-banner section
├── scripts/                        ← Utility scripts (scraping, data generation)
│   ├── gonami_all_products.json    ← 32 scraped competitor products
│   └── generate_gonami_catalog.py  ← Generates HTML cards from JSON → catalog pages
├── data/                           ← Source product data (DOCX/TXT)
└── DOCS.md                         ← Full design specification (~900 lines)
```

### index.html structure

Page-specific inline `<style>` blocks are used for v4-banner, stats overlay, and FAQ. Sections in order:

1. **Hero** — tabs for 3 product categories
2. **v4-banner** — video background + factory photo + title overlay
3. **v4-stats** — stats strip (negative margin overlaps banner bottom)
4. **Interactive catalog** (`.ic`) — sidebar categories + variant thumbnails + detail panel with carousel (inline `<script>`)
5. **FAQ** accordion (inline `<script>`)
6. **Contacts map** — Yandex Maps with location sidebar (driven by `main-v3.js`)
7. **Callback form**

### Key Design Patterns

- **Header** (`header.js`) — transparent on scroll-top, solid on scroll down; mobile burger menu with slide-in overlay
- **Hero** uses tabbed interface for 3 product categories with background images
- **v4-banner** — fullscreen video background with factory photo overlay and title; stats strip overlaps bottom via negative margin
- **Interactive catalog** (`.ic`) — sidebar category list + thumbnail grid + detail panel with image carousel (inline `<script>`)
- **Product cards** — image block + body (name, specs, price, "Подробнее" button); clicking opens a detail popup driven by `data-*` attributes
- **FAQ** — accordion with `<details>`/`<summary>` or JS toggle (inline `<script>`)
- **Scroll animations** — any element with `data-anim` attribute gets `anim--visible` class on viewport entry via `IntersectionObserver`

### CSS Custom Properties (key tokens)

Colors: `--orange: #EA7627`, `--dark: #1a1a1a`, `--light-bg: #f5f5f5`
Font: Open Sans (300–800)
Breakpoints: 1024px (tablet), 768px (mobile), 480px (small mobile)

---

## Key Conventions

### CSS

- **Naming:** BEM — `block__element--modifier`
- **Variables:** defined in `:root` in `style-v3.css`. Primary accent: `--orange: #EA7627`
- **Adding styles:** append to the end of `style-v3.css` under a section comment. Inline `<style>` blocks inside a page are acceptable for page-specific one-offs only
- **Breakpoints:** 1024px (tablet) · 768px (mobile) · 480px (small mobile)
- **Font:** Open Sans from Google Fonts, weights 300–800

### Animations

Add `data-anim="up|left|right|scale|fade"` to any element. `main-v3.js` uses `IntersectionObserver` to add `anim--visible` when the element enters the viewport.

### Images

- **Product photos:** background-removed PNG/WebP — always use `background-size:contain; background-repeat:no-repeat; background-color:#f5f5f5`
- **Gallery/hero:** full-bleed JPG or WebP
- **Competitor (Gonami) photos:** `img/gonami/products/` — WebP with English (transliterated) filenames

### Links

- Inner page → homepage: `../index.html`
- Inner page → inner page: relative sibling (`catalog-plitka.html`, `about.html`)
- When changing the homepage filename, update `HOME` and `HASH_HOME` in both `js/header.js` and `js/footer.js`

### Language

All UI text and content is in **Russian**.

---

## Product Card Format

Product data is stored in `data-*` attributes on `.product-card` divs. Catalog JS reads these to drive filters and the detail popup.

**Tile card — key attributes:**

| Attribute | Example | Notes |
|-----------|---------|-------|
| `data-forma` | `kvadrat` | Transliterated slug used by filter |
| `data-collection` | `color-mix` | `color-mix` or `mono` |
| `data-thickness` | `70` | Numeric mm, used by filter |
| `data-name` | full product name | Shown in popup title |
| `data-desc` | description | Shown in popup |
| `data-size` | `500×500 мм` | Displayed in card specs |
| `data-thick` | `70 мм` | Displayed in popup |
| `data-weight` | `160 кг/м²` | |
| `data-strength` | `М400` | Concrete grade |
| `data-frost` | `F200` | Frost resistance cycles |
| `data-price` | `2050` | Numeric, shown as `₽/м²` |

**Curb card** uses the same pattern without `data-forma`, `data-truck40`, `data-pallet-m2`, `data-pcs-m2`.

---

## Important Notes

- `DOCS.md` contains the full design specification (~900 lines). Read it before making significant design changes.
- Yandex Maps API key is a placeholder (`YOUR_API_KEY`) in `main-v3.js` — needs a real key for production.
- When updating links to the homepage, also update `HOME` / `HASH_HOME` in `js/header.js` and `js/footer.js`.
- `scripts/generate_gonami_catalog.py` — re-run this (not the HTML directly) when Gonami product data changes. It reads `scripts/gonami_all_products.json` and appends cards to the catalog pages idempotently.
