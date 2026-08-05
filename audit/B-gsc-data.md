# Part B - Google Search Console Data

**Status: BLOCKED. Not executed.**

**Why:** No Google Search Console connector is exposed to this session, and the Semrush connector present in the account is unauthorized - its tools do not surface, and OAuth cannot be completed in a non-interactive session. GSC's crawl-stats, coverage, request-indexing history and performance data are private to the Google account and reachable **only** through GSC (or a GSC connector). I could not pull any of it.

This file therefore contains: (1) the exact numbers still needed, in paste-ready form; (2) the externally-observable substitutes I *was* able to gather; (3) a note on which questions only GSC can answer.

Per the brief, this file is raw numbers only. Interpretation is in `audit/C-synthesis.md`.

---

## What I need from you (paste or screenshot - then Part B/C become real)

The two starred items are the ones the whole diagnosis turns on.

### ★ B1 - Crawl stats  (Settings → Crawl stats)
```
Total crawl requests, last 90 days:        __________
Average per day:                           __________   ← the number that confirms/kills the crawl-budget hypothesis
Breakdown by response - 200 / 3xx / 4xx / 5xx / other:  __________
Breakdown by purpose - Discovery vs Refresh:            __________
Breakdown by Googlebot type - Smartphone / Desktop / other: __________
Average response time (ms):                __________
```
**The one question:** how many distinct URLs/day does Google actually fetch on this domain? ~1 → crawl-budget hypothesis confirmed. ~20 with nothing indexed → hypothesis wrong, different mechanism.

### ★ B2 - Links  (Links → External links)
```
Total external links:                      __________
Total linking domains (sites):             __________   ← if ≈0, hypothesis holds
Top linking sites:                         __________
TOP LINKED PAGES (most important line in this whole file):
   1. __________
   2. __________
   3. __________
Top anchor text:                           __________
```
**The one question:** do the "top linked pages" include `/aesthedent-experience` and/or `/services/dentures`? If yes → external links explain the indexed set (Part A proved it's not on-page). If the only externally-linked page is `/`, the indexed set is crawl-randomness, not links.

### B3 - Index coverage  (Pages → the 18 unindexed)
```
Confirmed indexed (expect 3):   /  ,  /aesthedent-experience  ,  /services/dentures   [confirm]
For a sample of the 18: exact status string + Last crawled date + Google-selected canonical
```

### B5 - Was Request Indexing actually submitted?
```
For any of the 18: has "Request Indexing" ever been used? Any change in Last-crawled after 2026-07-17?
```
Materially changes the diagnosis (`/services/dentures` could simply have been hand-submitted once).

### B4 / B6 / B7 / B8 (lower priority)
```
B4 Performance (3 mo): top queries w/ impressions·clicks·CTR·avg position; are the ~30-40 daily
   impressions branded ("aesthedent") or non-branded (Kothrud intent)? which page serves them?
B6 Sitemaps: submitted status, last read date, discovered count (expect 21), errors
B7 Manual actions + Security: expect "No issues" on both - rule out
B8 Page experience / CWV: field data if any exists (site likely below CrUX threshold)
```

---

## Externally-observable data I DID gather (no GSC needed)

### Index status - confirmed, agrees with your GSC
`site:` scrape, 2026-07-17 (`audit/raw/2c-serp-indexation.json`): Google returns exactly **3** URLs for `site:aesthedentpune.com` - `/`, `/aesthedent-experience`, `/services/dentures`. Matches GSC "3 of 21 indexed."

### robots.txt (live, 2026-07-18)
```
User-agent: *
Allow: /
Sitemap: https://www.aesthedentpune.com/sitemap.xml
```
No bot-specific rules. GPTBot / ClaudeBot / PerplexityBot / Google-Extended / CCBot / Bingbot - none named, none blocked. Nothing suppresses crawl. (B7-adjacent: no robots-level block exists.)

### Sitemap (live, 2026-07-18)
- 21 URLs, all absolute, no trailing slash (canonical-consistent).
- All 21 share one `lastmod`: `2026-07-17T13:07:06.502Z` - build-time, identical across every URL.
- Indexed URLs sit at sitemap positions **#1, #2, #14**.

### Brand SERP citations (proxy for where external links *might* originate)
From the same scrape, ranking profiles for "aesthedent" queries: Facebook, Instagram, Practo, Justdial, KiviHealth. **These are the most likely sources of any external links.** Whether any of them **deep-link** to `/aesthedent-experience` or `/services/dentures` (vs. only the homepage) is the exact thing B2 would reveal - and is `[UNTESTABLE from this session]`: I cannot reliably crawl those profiles' outbound links here.

### Core Web Vitals (lab, not field - B8 partial)
From Phase 3 (`audit/raw/3-performance-measured.json`): homepage cold load ~1.1 s, 36 requests. **No CrUX field data exists** - PageSpeed Insights returned no field metrics; the domain is almost certainly below the CrUX reporting threshold (itself a low-traffic signal). Real field data requires GSC B8.

---

## Questions ONLY GSC can answer (no external substitute exists)
- Actual crawl rate (pages/day) - **B1**. The single most decisive number.
- Which pages carry external links - **B2 "top linked pages."**
- Exact per-URL coverage status + Google-selected canonical for the 18 - **B3.**
- Whether Request Indexing was ever submitted - **B5.**
- Whether the ~30–40 daily impressions are branded or Kothrud-intent - **B4.**
- Manual action / security status - **B7.**
