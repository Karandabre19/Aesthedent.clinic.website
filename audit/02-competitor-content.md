# Phase 2A — Competitor Content

**Actor:** `apify/website-content-crawler` · `playwright:chrome`, depth 2, HTML + markdown saved
**Raw:** `audit/raw/2a-competitors-independent.json` (147 pages), `audit/raw/2a-probe-cost.json` (17 pages)
**Date:** 2026-07-17 · **Cost:** $0.76

**Scope honesty:** the brief specified ~60 pages × 10 domains (600 pages). At the measured ~$0.0076/page that is ~$4.60 — effectively the account's entire **$5/month free credit** on one scrape. I capped it and **aborted the run gracefully at 147 pages** across 7 domains, having already spent the higher-value budget on GBP + SERP. Coverage below is honest about what that missed.

| Domain | Pages crawled |
|---|---|
| soulfuldental.com | 46 |
| toothandcodental.com | 27 |
| oriondentalspecialities.com | 24 |
| microdentdentistry.com | 19 |
| smileinn.in | 12 |
| silverpearlsdental.com | 12 |
| thedentalstudio.co.in | 7 |
| **integritydentalcare.in** | **0 — crawl returned nothing** |
| sabkadentist.com, clovedental.in | not crawled — *chains, separate benchmark class per the brief* |

`integritydentalcare.in` produced zero pages here and also failed a direct fetch in 2D. Two independent failures suggests it blocks automated access. **Not measured — not assumed.**

---

## The content-depth thesis in the brief is wrong

Phase 4C calls for 1200–1800 words per service page because "competitors rank on depth." The data says otherwise.

| Site | Pages | **Median words** | Max | Organic rank, `dentist in kothrud` |
|---|---|---|---|---|
| silverpearlsdental.com | 12 | **1748** | 2615 | **#8** |
| smileinn.in | 12 | 746 | 3704 | **#3** |
| oriondentalspecialities.com | 24 | 510 | 2183 | **#5** |
| toothandcodental.com | 27 | 473 | 1834 | not in top 8 |
| thedentalstudio.co.in | 7 | 468 | 1986 | **#4** |
| microdentdentistry.com | 19 | 373 | 1132 | not in top 8 |
| soulfuldental.com | 46 | **228** | 873 | **#6** |
| **All competitor pages** | **147** | **430** | 3704 | — |

**Median competitor page: 430 words.**

The correlation runs backwards. **Soulful Dental ranks #6 with a median page of 228 words** — while **Silver Pearls, with a median of 1748 (7.7× more), ranks #8, two places lower.**

### Our pages already beat the median

| Our page | Words |
|---|---|
| `/aesthedent-experience` | 1439 |
| `/` | 1181 |
| `/doctor` | 633 |
| `/about` | 577 |
| `/insights` | 433 |
| `/services` | 402 |
| `/contact` | 322 |
| service detail pages | ~400–600 |

Every substantive page is at or above the 430-word competitor median, and our homepage is **5× Soulful's median** — the site that outranks us.

**Recommendation: drop the 1200–1800 word target from Phase 4C.** Writing 8 × 1500 words is roughly 12,000 words of medical copy needing Dr. Sahil's clinical sign-off, to fix a gap the data says does not exist. That effort buys nothing while the pages aren't indexed, and little afterwards. Expand where a *topic* is genuinely missing (cost sections — see below), not to hit a number.

---

## The real structural gaps

### 1. Page count, not page depth

**Soulful: 46 pages. Us: 8 service pages, ~21 routes total.**

Soulful's strategy is many narrow pages, each aimed at one query:
```
/invisalign/
/wisdom-tooth-painless-extraction/
/tmj/
/denture/
/snoring-and-sleep-apnea-treatment-in-kothrud-pune/
/in-house-3d-dental-scanner-in-kothrud-pune/
/conscious-sedation-treatment-in-kothrud-pune/
/oral-sedation-treatment-in-kothrud-pune/
/insvisalign-for-kidstreatment-in-kothrud-pune/
/about-dr-swapnil-rachha/
/about-dr-sneha-rachha/
/about-dr-shruti-sarwate-athalye/
```
Thin pages, but *many* of them, each owning a distinct intent. That is what ranks here — coverage, not depth.

### 2. Location-bearing URLs — we have none

Soulful bakes the location into the **slug**: `…-in-kothrud-pune/`. Ours is `/services/dental-implants` — no location anywhere in the URL.

This is the Phase 3.1 URL-architecture gap, now evidenced rather than assumed.

### 3. Per-doctor pages with keyword-bearing titles

Soulful runs a page per dentist, each title targeting a role + location:

| URL | Title |
|---|---|
| `/about-dr-swapnil-rachha/` | Pediatric Dentist in Karve Nagar \| Dr. Swapnil Rachha |
| `/about-dr-sneha-rachha/` | Dental Surgeon Near Me \| Dr. Sneha Rachha |
| `/about-dr-shruti-sarwate-athalye/` | Cosmetic Dentist Near Me \| Dr. Shruti Sarwate Athalye |

We have **one** `/doctor` page with two thin cards. This validates Phase 4D's per-doctor pages — on *coverage* grounds, not word count. **Blocked on credentials — `NEEDS-INPUT` C1–C7.**

### 4. Title pattern — location in nearly every title

| Site | Titles carrying a location token |
|---|---|
| smileinn.in | **100%** |
| silverpearlsdental.com | 92% |
| microdentdentistry.com | 89% |
| thedentalstudio.co.in | 86% |
| soulfuldental.com | 80% |
| oriondentalspecialities.com | 79% |
| toothandcodental.com | 74% |
| **Aesthedent (post Phase 1)** | **100%** |
| *Aesthedent (before Phase 1)* | *1 title sitewide* |

The structural pattern — as the brief asked, the pattern rather than the stuffing:

```
[Service or Role] in [Location] | [Brand]
```

with the **H1 mirroring the title**. Soulful's homepage: title `Dentist in Kothrud | Best Dental Clinic in Kothrud - Dr. Swapnil Rachha`, H1 `Dentist in Kothrud | Best Dental Clinic in Kothrud`.

Phase 1 already adopted the clean form of this (`Dental Implants in Kothrud, Pune | Aesthedent`) **without** the pipe-stuffed repetition. Silver Pearls' crude `Best Dentist in Kothrud | Best Dental Clinic in Kothrud, Pune` ranks **#8 — the lowest of the independents in the top 8.** The stuffing is not what works; the location token is.

### 5. Cost content — a genuine gap

Competitors rank for `dental implant cost pune`; we have **zero pricing content** across all 21 routes. This is the one place where *adding* content is justified by intent that exists and we don't serve.

**Blocked on `NEEDS-INPUT` P1–P12** — real INR ranges need Dr. Sahil. I will not invent dental prices.

---

## Caveats

- **Rank/word-count correlation is descriptive, not causal.** Seven sites is a small sample and organic rank has many inputs. The claim is narrow and safe: *depth does not explain who outranks us*, because the shallowest site outranks the deepest. That is enough to kill a 12,000-word work item.
- Word counts include nav/footer boilerplate on both sides, so the comparison is like-for-like but absolute values run high.
- Internal link graph, image alt coverage, and CTA placement are **in the raw JSON but not yet analysed** — the crawl was cut short and the budget went to higher-value scrapes. Re-queryable from `audit/raw/2a-competitors-independent.json`.
- `integritydentalcare.in` and `toothandcodental.com` (2D) resisted automated access. Manual review needed if either matters.
