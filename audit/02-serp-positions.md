# Phase 2C — Live SERP Positions & Indexation

**Actor:** `apify/google-search-scraper` · `countryCode: in`, `languageCode: en`
**Raw:** `audit/raw/2c-serp-tier1.json`, `2c-serp-indexation.json`, `2c-serp-indexation-paths.json`
**Date:** 2026-07-17 · **Cost:** $0.08

---

## The finding that explains the entire audit

```
site:aesthedentpune.com   →   3 URLs indexed
```

Out of ~21 routes, Google has indexed **three**:

1. `/services/dentures`
2. `/`
3. `/aesthedent-experience`

Verified with independent per-path probes rather than resting on one `site:` query:

| Probe | Result |
|---|---|
| `site:aesthedentpune.com` | 3 URLs |
| `site:www.aesthedentpune.com` | same 3 URLs |
| `site:aesthedentpune.com/services` | **1** — only `/services/dentures` |
| `site:aesthedentpune.com/services/dental-implants` | **0** ← the flagship money page |
| `site:aesthedentpune.com/doctor` | **0** |
| `site:aesthedentpune.com/insights` | **0** |

**Not indexed:** 7 of 8 service pages, `/services`, `/about`, `/contact`, `/doctor`, `/insights`, and all 6 insight articles.

You cannot rank for `root canal kothrud` when `/services/root-canal` is not in the index. Every content, keyword and copy recommendation downstream is moot until this is fixed. **This is the answer to "why isn't the site ranking".**

*(`site:` counts are approximate by nature — but six independent probes agreeing on "0" for specific known-good URLs is not noise.)*

---

## Direct proof that the H1 bug had search consequences

```
"Redefining Dental Care in Pune"   →   0 results
```

The homepage **is** indexed. Yet an exact-phrase search for its own H1 returns nothing.

Because that string never existed in the HTML. Google indexed:
```
RedefiningRedefiningDental Care in Pune.in Pune.
```
The clean phrase isn't in the document, so it matches nothing. This is empirical confirmation that Bug 1 was not cosmetic — and that the Phase 1 fix was worth shipping. Re-run this query after deploy; it should start matching.

---

## Organic positions — Tier 1 & 2

| Keyword | Aesthedent organic |
|---|---|
| dentist in kothrud | not in top 9 |
| dental clinic in kothrud | not in top 9 |
| best dentist in kothrud | not in top 9 |
| dentist near me kothrud | not in top 9 |
| dental implant kothrud | not in top 9 |
| dental implant cost pune | not in top 8 |
| root canal kothrud | not in top 9 |
| prosthodontist in pune | not in top 9 |
| full mouth rehabilitation pune | not in top 9 |
| braces kothrud | not in top 9 |

**0 of 10.** Entirely consistent with 3 pages indexed — the pages that would rank don't exist as far as Google is concerned.

> **Data-quality note:** the first run returned `dental implant kothrud` with **zero results in every array and no error** — a scrape failure, not an empty SERP. I re-ran it separately rather than report "0 results" as a finding. The re-run returned a normal 9-result SERP (shown below). One invalid data point, caught and discarded.

---

## Who owns organic instead

### `dentist in kothrud`
| # | Domain | |
|---|---|---|
| 1 | **practo.com** | aggregator |
| 2 | sabkadentist.com | *chain* |
| 3 | smileinn.in | |
| 4 | thedentalstudio.co.in | |
| 5 | oriondentalspecialities.com | |
| 6 | soulfuldental.com | |
| 7 | **justdial.com** | aggregator |
| 8 | silverpearlsdental.com | |

### `dental implant kothrud`
| # | Domain | |
|---|---|---|
| 1 | **practo.com** | aggregator |
| 2 | smileinn.in | |
| 3 | thedentalstudio.co.in | |
| 4 | microdentdentistry.com | |
| 5 | oriondentalspecialities.com | |
| 6 | clovedental.in | *chain* |
| 7 | brightsmileclinic.org | |
| 8 | drmukeshdental.com | |
| 9 | instagram.com/suyashdental | |

**Aggregators take the #1 slot on both.** Practo is unbeatable on these terms and should be treated as a channel to be *listed on*, not a competitor to outrank — the brief's chain-segmentation logic (Sabka, Clove) applies to Practo and Justdial with even more force.

The eight beatable independents from the brief are exactly who occupies #2–#8. They are reachable — **once our pages exist in the index.**

---

## Brand search — we don't fully own our own name

### `aesthedent`
| # | Result |
|---|---|
| 1 | instagram.com |
| 2 | instagram.com |
| 3 | **find-and-update.company-information.service.gov.uk** |
| 4 | **uk.trustpilot.com/review/aesthed…** |
| 5 | facebook.com |
| **6** | **aesthedentpune.com** ← us |
| 7 | accessdata.fda.gov |
| 8 | linkedin.com |

There is a **UK entity sharing the "Aesthedent" name** (Companies House + Trustpilot), and it outranks the clinic for the bare brand term. Our own site is **#6 for our own name**.

### `aesthedent dental clinic kothrud`
| # | Result |
|---|---|
| **1** | **aesthedentpune.com** ← us |
| 2 | facebook.com |
| 3 | justdial.com |
| 4 | instagram.com |
| 5 | practo.com |
| 6 | kivihealth.com |
| 7 | facebook.com |
| 8 | practo.com |
| 9 | justdial.com |

Qualified brand search is fine. Only the ambiguous single word is contested — and by a genuinely different business, which limits how much can be done. Not a priority; noted for completeness.

**Useful side-finding:** Aesthedent already has profiles on **Justdial, Practo, KiviHealth, Facebook and Instagram**. Citations exist and are indexed. None are in the site's `sameAs` (which lists only Google Maps) — a free Phase 4E win, and it answers `NEEDS-INPUT` B4 in part.

---

## What this means for the roadmap

1. **Indexation is priority zero.** Nothing else matters until more than 3 pages are indexed.
2. **Phase 1 already addressed the most likely cause.** All 21 pages previously shipped a **byte-identical title and meta description with no canonical**. That is a textbook duplicate-content signature — Google consolidates near-duplicates and indexes a handful. Phase 1 gave every route a unique title and a self-referencing canonical, and prerendered the service pages. Whether that was *the* cause is a hypothesis the deploy will test, and I'd rather frame it that way than claim it as proven.
3. **Site age is a live confounder.** ~4 months old (go-live confirmed March/April 2026). Some of this is Google simply not having finished. Search Console will separate "excluded as duplicate" from "discovered — not yet indexed"; those have very different answers. **Still blocked on Search Console access.**
4. **Local is already working** — see `02-gbp-comparison.md`. Don't spend the roadmap there.

## Not done — budget
- People Also Ask / related searches: captured in raw JSON, not yet analysed.
- Aggregator listing audit (where Aesthedent is present vs absent on Practo/Justdial/Lybrate): partially answered above.
- Per-keyword map-pack composition on the SERP itself (as opposed to the local finder used in 2B).
