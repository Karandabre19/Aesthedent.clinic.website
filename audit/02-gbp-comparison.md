# Phase 2B — Google Business Profile Comparison

**Actor:** `compass/crawler-google-places`
**Raw:** `audit/raw/2b-gbp-landscape.json` (60 places), `2b-gbp-dental-clinic-kothrud.json`, `2b-gbp-dental-implant-kothrud.json`, `2b-gbp-best-dentist-kothrud.json`
**Date:** 2026-07-17 · **Cost:** $0.40

The brief called this the single most important dataset in the audit. It was — because **it disproves the brief's own hypothesis.**

---

## Headline: the map pack is not the problem

The brief supposed that "Aesthedent's 263 reviews may already be a leading position that isn't converting into map pack presence for a fixable reason."

It *is* converting. Measured ranks in the Kothrud local finder:

| Query | Aesthedent rank |
|---|---|
| `dental implant Kothrud` | **2** |
| `dental clinic Kothrud` | **3** |
| `best dentist in Kothrud` | **3** |
| `dentist Kothrud Pune` | **15** ← anomaly, see below |

Top-3 for three of four Tier-1 local queries. **Local visibility is a strength, not a weakness.** Any roadmap that spends its first month "fixing the map pack" is fixing something that mostly works.

### Methodology note — this was nearly reported wrong

The first run passed all three searches to one actor run. Searches 2 and 3 came back with sparse, offset ranks (16, 19, 20, 34…) and no Aesthedent, which reads as *"we don't rank for dental clinic Kothrud."*

That reading would have been **false**. The actor **deduplicates places across searches in a single run** — verified: 60 records, 60 unique `placeId`s, and search 1 holds a contiguous 1–20 while later searches only contain places not already emitted. Aesthedent was missing from searches 2–3 because it had *already been returned under search 1*, not because it doesn't rank.

Re-running each query as its **own isolated run** produced the true ranks above — the opposite conclusion. Per-search rank is only trustworthy from a single-query run.

---

## Verified: the numbers on the site are stale

| | Site says | **Google actually says** |
|---|---|---|
| Rating | 5.0 (`app/page.js:46`) | **5.0** — confirmed |
| Reviews | **263** | **277** |

`NEEDS-INPUT` **N1 answered** (rating 5.0 is real). **N2 answered** (count is 277, not 263 — the site is 14 behind).

The review count is hardcoded. It will drift again. Recommend either wiring it to a source or accepting a periodic manual update — flagged for Phase 4.

The GBP is **claimed**, the website field points correctly at `https://www.aesthedentpune.com/`, and hours are **correct** including the Wednesday closure:
```
Mon–Tue 10-8 · Wed CLOSED · Thu–Sun 10-8
```
This matches `openingHoursSpecification` in `app/layout.tsx` exactly. Nothing to fix.

---

## The competitive table

Deduplicated across all searches; ranked by review count.

| Reviews | Rating | Photos | Clinic |
|---|---|---|---|
| 1924 | 4.6 | — | "dentist" *(see note)* |
| 1003 | 4.9 | — | Unique Children's Clinic Dental & Implant |
| 722 | 4.9 | **345** | Soulful Dental Care |
| 663 | 5.0 | 137 | SmyleXL Dental Clinic |
| 508 | 4.9 | — | Perfect Smile Dental Clinic® |
| 498 | 4.9 | 100 | Suyash Dental Clinic |
| 337 | 5.0 | 88 | Odontoville Dental Clinic |
| 324 | 5.0 | 163 | Novacare Dental |
| 294 | 5.0 | 79 | Silver Pearls |
| 292 | 5.0 | — | Dr. Kayande Dental Clinic & Implant Centre |
| 290 | 5.0 | — | Ivory Dental Clinic |
| **277** | **5.0** | **36** | **Aesthedent** ← us |
| 247 | 5.0 | 149 | Orion Dental Specialities |
| 203 | 4.9 | — | Dr Mukesh Dental Solutions |
| 142 | 4.7 | 38 | Clove Dental Kothrud *(chain)* |

*The rank-1 entry literally titled "dentist" with 1924 reviews at 4.6 is anomalous — possibly a mis-titled or aggregated listing. Flagged, not explained.*

### Where we lead
- **5.0 rating** — matched by several, beaten by none.
- **Top-3 local rank** for implant / dental clinic / best dentist queries.
- **Correct, complete NAP + hours + attributes.** Service options, Accessibility, Amenities, Crowd, Planning, Payments are all populated.

### Where we trail

**1. Photos — 36 is the lowest in the entire comparison set.**

| Clinic | Photos |
|---|---|
| Soulful Dental | 345 |
| Novacare | 163 |
| Orion | 149 |
| SmyleXL | 137 |
| Suyash | 100 |
| Odontoville | 88 |
| Silver Pearls | 79 |
| **Aesthedent** | **36** |

Soulful has **9.6× our photo count**. This is the clearest, cheapest, most concrete GBP gap in the data.

**2. Q&A — zero seeded.** `questionsAndAnswers: 0`. Nothing to answer, nothing to rank.

**3. Review volume — 7th of 15.** Respectable, not leading. Combined with a 5.0 rating it's a strong position, but Soulful (722) and SmyleXL (663) have 2.4–2.6× our count.

---

## Two hypotheses tested and killed

Both would have made confident, plausible, **wrong** recommendations.

### ✗ "The primary category is wrong — it says Prosthodontist"
**False.** Aesthedent's primary category is already **`Dental clinic`**, with 8 sensible secondaries (Cosmetic dentist, Dental implants periodontist, Dentist, Denture care center, Endodontist, Oral surgeon, Orthodontist, Prosthodontist).

The site leads with "Prosthodontist" — **the GBP does not.** The positioning problem the brief describes is a *website* problem, not a GBP problem.

### ✗ "We rank 15th for `dentist Kothrud Pune` because our category is wrong"
**False.** I checked the primary category of the top 10 for that query: **10 of 10 are `Dental clinic`** — identical to ours. Same tally for `dental clinic Kothrud`, where we rank 3rd. Category cannot explain a rank difference when it's constant across both.

**The `dentist Kothrud Pune` anomaly is unexplained.** We rank 15th there while ranking 2nd–3rd for three sibling queries, with a better rating and more reviews than several clinics above us (Dr. Neharkar 101 reviews → rank 3; Dr. Sanap's 98 → rank 6). Proximity doesn't explain it either — the whole top 10 sits within 1.2 km of us.

Candidate explanations I have **not** verified: query-level volatility, business/profile age (~4 months), or prominence signals (citations, links). **I am not going to invent a cause.** It needs a repeat measurement over time to see whether rank 15 is even stable.

---

## GBP action plan (Phase 4F preview — grounded only in the above)

| Priority | Action | Evidence |
|---|---|---|
| **1** | **Photos: 36 → 100+.** Clinic interior, equipment, team, before/after (consent permitting). | Lowest of all 15 measured; leader has 345 |
| **2** | **Seed Q&A.** Post and answer the real questions — cost, Wednesday closure, implant timelines, parking. | `questionsAndAnswers: 0` |
| **3** | **Sustain review velocity.** 277 @ 5.0 is strong; the goal is holding the rating while closing the gap to Soulful (722). | 7th of 15 by volume, 1st by rating |
| **4** | **Do NOT change the primary category.** | Already `Dental clinic` — matches 10/10 of the top 10 |
| **5** | Re-measure `dentist Kothrud Pune` over several weeks | Rank 15 vs 2–3 elsewhere is unexplained; may be noise |

### Not measured — needs your GBP access
- **Review velocity (reviews/month over 12 months).** Requires per-review dates: `maxReviews: 100` across 11 clinics on a **$5 free-plan budget** was not affordable against higher-value scrapes. The review-generation SOP in 4F (QR at reception, WhatsApp follow-up, 8–12/month target) is a sensible default but is **not yet grounded in measured competitor velocity** — I'm flagging that rather than dressing it up as data-driven.
- **Post frequency.** Not exposed by this actor.
