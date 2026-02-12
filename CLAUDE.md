# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BORDUR — static website for a Russian paving tile, curb, and compensator manufacturer. Pure HTML + CSS + JS, no frameworks, no build tools, no npm. Design reference: braer.ru.

## Architecture

**Current main page:** `index-4.html` (latest version; all inner pages link here).
Previous versions (`index.html`, `index-v2.html`, `index-v3.html`) are kept for reference only.

**Shared assets (loaded by ALL pages via `<script>` tags):**
- `css/style-v3.css` — single CSS file (design system, all components, responsive)
- `js/header.js` — dynamically injects header + mobile menu HTML (IIFE, auto-detects main vs subpage paths)
- `js/footer.js` — dynamically injects footer + cookie bar + back-to-top HTML (IIFE, auto-detects paths)
- `js/main-v3.js` — core JS (header scroll, hero tabs, promo bar, scroll animations, contacts map with Yandex Maps, callback form, smooth scroll)
- `js/lead-form.js` — lead generation modal (dynamically injected CSS + HTML)

**Script load order** (important — header.js/footer.js must come before main-v3.js):
```html
<script src="js/header.js"></script>
<script src="js/footer.js"></script>
<script src="js/main-v3.js"></script>
<script src="js/lead-form.js"></script>
```
For subpages, prefix with `../js/`.

**Dynamic components:** `header.js` and `footer.js` use path detection (`isSubpage` check via regex on `window.location.pathname`) to automatically build correct relative links. They expose `window.__closeMenu` for mobile menu integration with `main-v3.js`. Pages do NOT contain inline header/footer HTML — it's all injected by JS.

**Catalog pages** each have their own JS file (loaded after main-v3.js):
- `js/catalog-plitka.js` — tile catalog filters + popup with size visualization blocks
- `js/catalog-bordyury.js` — curb catalog filters + popup with specs/logistics tabs
- `js/catalog-kompensatory.js` — compensator catalog filters + popup with SVG cross-section profile

**Product data** lives in `data-*` attributes on `.product-card` HTML elements (no JSON/API).

## Key Conventions

- **CSS naming:** BEM methodology (`block__element--modifier`)
- **CSS variables:** Defined in `:root` in style-v3.css. Primary accent: `--orange: #EA7627`
- **Animations:** Use `data-anim="up|left|right|scale|fade"` attributes; JS IntersectionObserver adds `anim--visible` class
- **New styles:** Add to end of `style-v3.css`, grouped by section comments. For page-specific experiments (like index-4.html), inline `<style>` blocks are acceptable.
- **Responsive breakpoints:** 1024px (tablet), 768px (mobile), 480px (small mobile)
- **Font:** Open Sans from Google Fonts (weights 300–800)
- **Image format:** Product photos are PNG (background-removed) with `background-size:contain; background-repeat:no-repeat; background-color:#f5f5f5`. Gallery/hero images are JPG/WebP.
- **Links from inner pages to main:** `../index-4.html` (relative paths)
- **Links between inner pages:** Relative sibling paths (`catalog-plitka.html`, `about.html`)
- **Language:** All UI text and content is in Russian

## File Layout

```
bordur/
├── index-4.html               ← Active homepage (hero, video banner, catalog, FAQ, contacts, callback)
├── css/style-v3.css           ← All styles
├── js/
│   ├── header.js              ← Dynamic header + mobile menu injection (IIFE)
│   ├── footer.js              ← Dynamic footer + cookie bar + back-to-top injection (IIFE)
│   ├── main-v3.js             ← Core JS (scroll, animations, map, forms)
│   ├── lead-form.js           ← Lead form modal
│   ├── catalog-plitka.js      ← Tile catalog logic
│   ├── catalog-bordyury.js    ← Curb catalog logic
│   └── catalog-kompensatory.js ← Compensator catalog logic
├── pages/
│   ├── about.html
│   ├── catalog.html
│   ├── catalog-plitka.html    ← 31 tile products
│   ├── catalog-bordyury.html  ← 8 curb products
│   └── catalog-kompensatory.html ← 4 compensator products
├── img/                        ← Product images by category (plitka/, bordyury/, kompensatory/)
├── img-main/                   ← Hero/gallery images
├── video/production.mp4        ← Background video for v4-banner section
├── data/                       ← Source product data (DOCX/TXT)
└── DOCS.md                     ← Detailed project spec (design system, components, page specs)
```

## index-4.html Structure

The homepage has page-specific inline `<style>` for v4-banner, stats overlay, and FAQ sections. Key sections in order:
1. **Hero** with tabs (3 product categories)
2. **v4-banner** — video background + factory photo + title overlay
3. **v4-stats** — stats strip overlapping banner bottom (negative margin technique)
4. **Interactive catalog** (`.ic`) — sidebar categories + variant thumbnails + detail panel with carousel (inline `<script>`)
5. **FAQ** accordion (inline `<script>`)
6. **Contacts map** — Yandex Maps with location sidebar (driven by main-v3.js)
7. **Callback form**

## Important Notes

- `DOCS.md` contains the full design specification (~900 lines). Read it before making significant design changes.
- Yandex Maps API key is a placeholder (`YOUR_API_KEY`) in main-v3.js — needs real key for production.
- There are no tests, linters, or build steps. Just edit files directly.
- When updating links to the homepage, remember to also update `js/header.js` and `js/footer.js` (they have `HOME` and `HASH_HOME` variables that derive from `index-4.html`).
