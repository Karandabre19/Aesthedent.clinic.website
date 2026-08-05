# Part A - Repo Reverse-Engineering

**Mode:** read-only. Nothing changed.
**Date:** 2026-07-18
**Every claim cites a measured number.** Anything I couldn't ground is marked `[UNGROUNDED SPECULATION]`.

## Headline

**I measured nine on-page properties across all 21 routes. Not one of them isolates the indexed 3 from the unindexed 18.** The internal-link, sitemap-position, freshness, depth, content-similarity and robots hypotheses are each refuted with a number below. The single indexed service page (`/services/dentures`) is statistically indistinguishable from the seven unindexed ones, and the indexed landing page (`/aesthedent-experience`) has the **fewest internal links on the entire site**. Whatever selected the 3 is **not on the page**. That points off-site - and the data to confirm it is exactly the GSC Links/Crawl-stats report I can't reach (Part B).

Two corrections to the brief up front (Rule 4):
1. **The branch analysed here is NOT byte-identical to production.** This branch's `HomeClient.js` shows the rating counter at `5.0` / `10+ years`; the brief states production shows `4.7` / `9+`. Four commits land after mine (Bing auth XML, banner swaps). Structural facts (links, depth, word counts) are regime-independent and hold; exact live counter values are not re-audited (they're on your verified list).
2. **I retract, before making it, the "page age explains it" claim.** Git dating is unreliable here - the service catalogue was overhauled (original slugs `tooth-extraction`, `cleaning-polishing`, `kids-dentistry` are gone) across **five separate "initialize" commits between 2026-04-11 and 04-13**. Individual page birth dates can't be cleanly recovered from git. That hypothesis is **untestable here**; only GSC's first-discovered date settles it.

---

## A1 - Route map

21 indexable routes + 1 API catch-all. All prerendered.

| Route | File | Render | In sitemap |
|---|---|---|---|
| `/` ★ | `app/page.js` → `HomeClient.js` | Static (○) | yes |
| `/about` | `app/about/page.js` | Static | yes |
| `/aesthedent-experience` ★ | `app/aesthedent-experience/page.js` | Static | yes |
| `/contact` | `app/contact/page.js` | Static | yes |
| `/doctor` | `app/doctor/page.js` | Static | yes |
| `/insights` | `app/insights/page.js` | Static | yes |
| `/insights/[slug]` ×6 | `app/insights/[slug]/page.js` | SSG (●) | yes |
| `/services` | `app/services/page.js` | Static | yes |
| `/services/[slug]` ×8 (incl. `dentures` ★) | `app/services/[slug]/page.js` | SSG (●) | yes |
| `/sitemap.xml` | `app/sitemap.js` | Static | - |
| `/api/[[...path]]` | route handler | Dynamic (ƒ) | no |

★ = one of the 3 indexed per GSC (confirmed by my 2026-07-17 `site:` scrape → `audit/raw/2c-serp-indexation.json`: the only three URLs Google returns are `/`, `/aesthedent-experience`, `/services/dentures`).

**Context, not a live state:** on this branch the `[slug]` routes are `● SSG` (prerendered). In Phase 0 (pre-fix, = the regime Google actually crawled) they were `ƒ Dynamic` - server-rendered on demand. Both return 200 HTML that Googlebot renders fine; and dentures was Dynamic too, so this did not select it. Noted for completeness.

---

## A2 - Page table (sorted by click-depth; ★ = indexed)

Word count / H2 / JSON-LD from this branch's built HTML (`.next/server/app/*.html`). In-links and depth from the parsed internal-link graph (A3).

| Depth | In-links | Words | H2 | JSON-LD types | Route |
|---:|---:|---:|---:|---|---|
| 0 | 21 | 1171 | 10 | Dentist, LocalBusiness, Organization, WebSite | **`/` ★** |
| 1 | **1** | 1454 | 12 | Dentist, LocalBusiness, Organization, WebSite | **`/aesthedent-experience` ★** |
| 1 | 21 | 589 | 7 | + BreadcrumbList | `/about` |
| 1 | 21 | 339 | 4 | + BreadcrumbList | `/contact` |
| 1 | 21 | 641 | 8 | + BreadcrumbList | `/doctor` |
| 1 | 21 | 446 | 6 | + BreadcrumbList | `/insights` |
| 1 | 21 | 412 | 5 | + BreadcrumbList | `/services` |
| 1 | 21 | 468 | 9 | + FAQPage, MedicalProcedure, BreadcrumbList | `/services/dental-implants` |
| 1 | 21 | **458** | 9 | + FAQPage, MedicalProcedure, BreadcrumbList | **`/services/dentures` ★** |
| 1 | 21 | 455 | 9 | + FAQPage, MedicalProcedure, BreadcrumbList | `/services/digital-smile-design` |
| 1 | 21 | 456 | 9 | + FAQPage, MedicalProcedure, BreadcrumbList | `/services/full-mouth-rehabilitation` |
| 1 | 21 | 452 | 9 | + FAQPage, MedicalProcedure, BreadcrumbList | `/services/orthodontic-treatment` |
| 1 | 21 | 455 | 9 | + FAQPage, MedicalProcedure, BreadcrumbList | `/services/root-canal` |
| 1 | 21 | 446 | 9 | + FAQPage, MedicalProcedure, BreadcrumbList | `/services/tooth-fillings` |
| 1 | 21 | 429 | 9 | + FAQPage, MedicalProcedure, BreadcrumbList | `/services/wisdom-tooth-surgery` |
| 1 | 8 | 429 | 8 | + BreadcrumbList | `/insights/best-dentist-kothrud-pune` |
| 1 | 8 | 469 | 8 | + BreadcrumbList | `/insights/root-canal-pain-myths` |
| 1 | 2 | 425 | 8 | + BreadcrumbList | `/insights/teeth-whitening-safety` |
| 2 | 1 | 436 | 7 | + BreadcrumbList | `/insights/dental-anxiety-tips` |
| 2 | 1 | 508 | 8 | + BreadcrumbList | `/insights/dental-implants-pune-specialist` |
| 2 | 1 | 462 | 9 | + BreadcrumbList | `/insights/when-to-get-braces` |

### What the 3 indexed share that the 18 don't: **nothing measurable**

- **Depth:** 0, 1, 1. The 18 span 1–2. No separation - eleven depth-1 pages are unindexed.
- **In-links:** 21, **1**, 21. The indexed set contains both the most-linked value (21) *and the single least-linked page on the site (1)*. No separation.
- **Words:** 1171, 1454, 458. `/services/dentures` at 458 sits dead-centre of the service band (446–468) - it is not the longest, shortest, or an outlier.
- **H2 / JSON-LD:** `/services/dentures` is byte-for-structure identical to the other seven service pages (9 H2s, same 7 schema types).

**`/services/dentures` is a statistical twin of `/services/dental-implants`, `/root-canal`, etc.** on every measured axis. There is no on-page reason it is the one indexed service.

### Titles / canonicals of the 3 (this branch)
```
/                       Dentist in Kothrud, Pune | Aesthedent Dental Clinic   → canonical /
/aesthedent-experience  The Aesthedent Experience | Kothrud, Pune             → canonical /aesthedent-experience
/services/dentures      Specialist Grade Dentures in Kothrud, Pune | ...      → canonical /services/dentures
```
Caveat: these are the **post-fix** titles. At crawl time (old regime) all pages except `/` and `/aesthedent-experience` shared one duplicate title - see A5.

---

## A3 - Internal link graph

Parsed from built HTML: distinct source-pages linking to each target, and total anchors.

| Target | Source pages | Total anchors | In nav? |
|---|---:|---:|---|
| `/` ★ | 21 | 85 | yes (logo + Home) |
| `/services` | 21 | 51 | yes |
| `/services/dental-implants` | 21 | **51** | yes (dropdown) |
| `/services/root-canal` | 21 | 50 | yes |
| `/services/full-mouth-rehabilitation` | 21 | 51 | yes |
| `/services/wisdom-tooth-surgery` | 21 | 43 | yes |
| `/services/orthodontic-treatment` | 21 | 43 | yes |
| `/services/tooth-fillings` | 21 | 25 | yes |
| **`/services/dentures` ★** | 21 | **22** | yes (dropdown) |
| `/services/digital-smile-design` | 21 | 22 | yes |
| `/about`, `/contact`, `/doctor`, `/insights` | 21 | 42–45 | yes |
| **`/aesthedent-experience` ★** | **1** | **1** | **no - single homepage body link** |

**The two non-homepage indexed pages hold the extremes:**
- `/aesthedent-experience` receives **1 in-link** - the fewest of any page. Not in nav, not in footer; reachable only from one "Learn about our process" link on the homepage. **Yet it is indexed.**
- `/services/dentures` has **22 total anchors - tied for the fewest of any service page.** The most-linked services (`dental-implants` 51, `root-canal` 50, `full-mouth-rehabilitation` 51) are **all unindexed.**

> All 8 service pages get 21 "chrome" in-links because the nav "Treatments" dropdown lists every service on every page. The differentiator is body/contextual anchors - and there, dentures is at the bottom, not the top.

**Verdict on internal linking: refuted, and inverted.** If internal link equity drove crawl selection, `/services/dental-implants` (51 anchors, on the homepage grid) would be indexed before `/services/dentures` (22 anchors, absent from the homepage grid - the homepage renders `services.slice(0,6)`, and dentures is the 7th). The opposite is true.

Weakest-signal pages (nav+footer only, no in-body links): the three depth-2 insight articles (`dental-anxiety-tips`, `dental-implants-pune-specialist`, `when-to-get-braces`) each have 1 in-link. All unindexed - consistent, but so are 21-in-link pages, so this is not the mechanism.

---

## A4 - Content similarity across the 8 service pages

Cosine similarity on each page's unique content fields (`fullDescription`, `benefits`, `process`, `faqs` from `lib/services.js`), stopwords removed.

- **Mean pairwise cosine: 0.192**
- **Max pairwise cosine: 0.414** (`root-canal` ~ `tooth-fillings`)
- `dentures` vs others: 0.09–0.36 - mid-pack, no outlier

**These are low.** Templated clones with a swapped noun score 0.8+. At 0.19 mean, the service pages are genuinely distinct prose. **Refuted: the pages are not templated clones**, so a "Google deprioritised a duplicate cluster" story does not fit.

Logical note that matters more than the number: **GSC reports the 17 unindexed service/insight pages as `Last crawled: N/A`.** Google never fetched their bodies. **Any content-based cause - similarity, thinness, quality - is therefore logically incapable of explaining the *never-crawled* status.** Content can only affect indexing *after* a crawl. A4 is measured and clean, but it was never a candidate for the actual mechanism.

---

## A5 - Metadata generation

- Every route now exports `metadata` (static routes) or `generateMetadata` (the two `[slug]` segments). Confirmed 21/21 unique titles and 21/21 self-referencing canonicals on this branch (verified by `scripts/seo-check.mjs`, 308 assertions).
- **At crawl time this was NOT true.** Pre-fix (Phase 0), every page component was `'use client'` and could not export metadata; only `/` and `/aesthedent-experience` (via its own `layout.js`) had unique titles. **The other 19 shared one byte-identical title and description with no canonical.**
- **This is the strongest on-page correlate - but it only covers 2 of 3.** Unique-title-at-crawl-time cleanly explains why `/` and `/aesthedent-experience` were the non-homepage survivors. It **fails on `/services/dentures`**, which carried the same duplicate title as the seven unindexed service pages. So even the best on-page signal leaves the dentures anomaly unexplained.
- No dynamic metadata can fail at build: `generateMetadata` reads static `lib/*` arrays; build is green.

---

## A6 - Sitemap & robots (live production)

**Sitemap** (`https://www.aesthedentpune.com/sitemap.xml`, fetched live):
- **21 URLs.** All absolute. No trailing slashes → consistent with the canonicals. ✅
- **All 21 carry one identical `lastmod`: `2026-07-17T13:07:06.502Z`.** `app/sitemap.js` sets `lastModified: new Date()`, so every URL claims it changed at build time. **Refuted: `lastmod` freshness cannot distinguish the 3** - all 21 are identical, and the value is meaningless to Google as a change signal.
- **Sitemap order vs indexed set:** positions of the indexed 3 are **#1, #2, #14**. `/services/dentures` sits at **#14 of 21**, indexed - while **#3–#13 (about, contact, doctor, services, insights, dental-implants, root-canal, full-mouth-rehabilitation, tooth-fillings, wisdom-tooth-surgery, orthodontic-treatment) are all unindexed.** **Refuted: sitemap position does not select the set** (a position-14 URL beat eleven higher ones).
  - Residual: #1 and #2 being indexed is consistent with "top-of-sitemap crawled first," but #14 breaks it.

**robots.txt** (live):
```
User-agent: *
Allow: /
Sitemap: https://www.aesthedentpune.com/sitemap.xml
```
- **No bot-specific rules.** Explicitly checked for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`, `Bingbot` - **none named, none disallowed.** All are allowed via the wildcard. Nothing is blocked from anyone.
- **Refuted: robots is not suppressing crawl.** Clean negative finding. (Side note for AI-visibility strategy, not indexation: GPTBot / Google-Extended / CCBot being unblocked means LLM crawlers may train on / cite the site - a choice to make deliberately, not a bug.)

---

## A7 - Config

`next.config.js`:
- **Zero redirects, zero rewrites** (grepped - confirmed). Relevant later: the old catalogue URLs (`/services/tooth-extraction`, `/services/cleaning-polishing`, `/services/kids-dentistry`, `/services/teeth-whitening`) were removed in the overhaul and, with no redirects, now **404**. If Google ever discovered any of those, they are dead ends with no forwarding. `[UNGROUNDED SPECULATION]` whether any were ever crawled - needs GSC.
- `images.remotePatterns`: `images.pexels.com` only (3 service pages still use Pexels stock heroes).
- Headers: CSP `frame-ancestors 'self'`, permissive CORS. No `X-Robots-Tag`, no `noindex` anywhere (grepped app/ + live headers).

---

## The narrowing (feeds Part C)

Every on-page hypothesis, measured and closed:

| Hypothesis | Verdict | The number |
|---|---|---|
| Internal link depth / count | **Refuted (inverted)** | indexed `/aesthedent-experience` = 1 in-link; unindexed `/services/dental-implants` = 51 |
| Homepage-grid presence | **Refuted** | dentures is absent from the homepage grid (`slice(0,6)`); dental-implants is present and unindexed |
| Sitemap position | **Refuted** | dentures indexed at #14; #3–#13 unindexed |
| `lastmod` freshness | **Refuted** | all 21 identical (`2026-07-17T13:07:06Z`) |
| Content similarity / templating | **Refuted + moot** | mean cosine 0.192; and 17 were never crawled |
| Page weight / render cost | **Moot** | never crawled → never measured by Google |
| robots / noindex blocking | **Refuted** | nothing disallowed, all bots allowed |
| Unique title at crawl time | **Partial** | explains `/` + `/aesthedent-experience`; **fails on `/services/dentures`** |
| Page age | **Untestable here** | git unreliable (catalogue overhaul, 5 re-init commits 04-11→04-13) |
| **External backlinks to those URLs** | **Untestable here** | **needs GSC Links report (B2) / Semrush - the surviving hypothesis** |
| **Manual "Request Indexing"** | **Untestable here** | needs GSC URL-inspection history (B5) |

**Only off-page hypotheses survive.** I have eliminated every on-page factor with a measurement, which *isolates* the cause to external links, manual submission, or crawl randomness on a near-zero-demand domain - the three things that live behind the GSC connector. This is not a failure to find the answer; it is a measured proof of *where* the answer is. Your instinct to lead with B1/B2 is correct, and Part A now shows *why* those are the only reports that can close it.

Raw data: `audit/raw/2c-serp-indexation.json` (indexed set), live sitemap/robots fetched 2026-07-18, link-graph and similarity computed from repo + `.next/server/app/`.
