# Phase 3 — Gap Analysis

**Date:** 2026-07-17
Every claim below cites a file in `audit/raw/`. Where I could not measure something, it says so rather than guessing.

**Competitor segmentation (per the brief):** `sabkadentist.com` and `clovedental.in` are national chains with domain authority we cannot match — a **separate benchmark class**, not beatable targets. The data adds two more to that class: **`practo.com` and `justdial.com` take the #1 organic slot for both `dentist in kothrud` and `dental implant kothrud`** [`2c-serp-tier1.json`]. Aggregators are a channel to be *listed on*, not outranked. The real fight is the eight independents — and they occupy #2–#8, so they are reachable.

---

## 3.1 URL architecture gap — **real**

| | Pattern |
|---|---|
| **Aesthedent** | `/services/dental-implants` — **no location token** |
| soulfuldental.com | `/snoring-and-sleep-apnea-treatment-in-kothrud-pune/`, `/in-house-3d-dental-scanner-in-kothrud-pune/`, `/conscious-sedation-treatment-in-kothrud-pune/`, `/oral-sedation-treatment-in-kothrud-pune/` — flat root slugs, **location baked in** |
| | also flat non-location slugs: `/invisalign/`, `/tmj/`, `/denture/`, `/wisdom-tooth-painless-extraction/` |

Source: `2a-competitors-independent.json`.

**Recommendation — deliberately conservative.** Do **not** rewrite the existing eight service URLs. They are only four months old, `/services/dentures` is one of just three pages Google has indexed [`2c-serp-indexation.json`], and redirecting a freshly-indexed URL to chase a slug keyword risks losing the little index presence we have for a marginal gain. `next.config.js` currently has **zero redirects**, so any rename needs a redirect map built from scratch.

Instead: keep `/services/[slug]` and add **new** location-bearing landing pages where intent justifies them (Phase 4D `/dental-clinic-in-kothrud`, `/dental-implant-cost-pune`). New URLs, no redirect risk, same benefit.

---

## 3.2 Title / H1 pattern gap — **fixed in Phase 1**

Titles carrying a location token [`2a-competitors-independent.json`]:

| Site | % of titles |
|---|---|
| smileinn.in | 100% |
| silverpearlsdental.com | 92% |
| microdentdentistry.com | 89% |
| thedentalstudio.co.in | 86% |
| soulfuldental.com | 80% |
| oriondentalspecialities.com | 79% |
| toothandcodental.com | 74% |
| **Aesthedent — before Phase 1** | **one title sitewide** |
| **Aesthedent — after Phase 1** | **100%** |

The structural pattern, as asked — the pattern, not the stuffing:
```
[Service or Role] in [Location] | [Brand]      ← H1 mirrors the title
```

**The stuffing is not what works.** Silver Pearls' `Best Dentist in Kothrud | Best Dental Clinic in Kothrud, Pune` ranks **#8 — the lowest independent in the top 8** [`2c-serp-tier1.json`]. Meanwhile Soulful (#6) and Smile Inn (#3) use the clean single-location form. Phase 1 adopted the clean form (`Dental Implants in Kothrud, Pune | Aesthedent`) and needs no further change beyond the Phase 4A wording pass.

---

## 3.3 Content depth gap — **does not exist; the brief has this backwards**

Median words per page [`2a-competitors-independent.json`, 147 pages]:

| Site | Median | Organic rank |
|---|---|---|
| silverpearlsdental.com | **1748** | **#8** |
| smileinn.in | 746 | **#3** |
| oriondentalspecialities.com | 510 | #5 |
| toothandcodental.com | 473 | — |
| thedentalstudio.co.in | 468 | #4 |
| microdentdentistry.com | 373 | — |
| soulfuldental.com | **228** | **#6** |
| **all competitor pages** | **430** | |

**The shallowest site (228) outranks the deepest (1748) by two places.** Our pages — homepage 1181, experience 1439, doctor 633, about 577, services 402 — already sit at or above the 430 median. Our homepage is **5× the median of the site outranking us**.

**Recommendation: drop the 1200–1800 word target from Phase 4C.** It is ~12,000 words of medical copy requiring Dr. Sahil's clinical sign-off, to close a gap the data says is not there. The one exception is genuinely missing *topics* (cost — §3.4), not word count.

*Caveat: 7 sites is a small sample and rank has many inputs. The claim is narrow: depth does not explain who outranks us. That is enough to kill the work item.*

---

## 3.4 Page inventory gap — **real, and the most actionable content finding**

Not depth — **count and coverage**. Soulful runs **46 pages**; we have ~21 routes and 8 service pages.

| Page type | 5+ competitors have it | We have it |
|---|---|---|
| Per-**doctor** pages, keyword titles | yes — Soulful runs one per dentist | **no** — one `/doctor`, two thin cards |
| Narrow single-intent service pages | yes — `/tmj/`, `/invisalign/`, `/denture/` | partial — 8 broad pages |
| **Cost / pricing content** | yes — they rank `dental implant cost pune` | **no — zero INR anywhere in 21 routes** |
| Location-bearing landing pages | yes | **no** |
| Privacy / Terms | yes | **no — and we link to both from every page → sitewide 404s** |

Soulful's doctor pages, each owning a distinct query [`2a-competitors-independent.json`]:
```
/about-dr-swapnil-rachha/        → "Pediatric Dentist in Karve Nagar | Dr. Swapnil Rachha"
/about-dr-sneha-rachha/          → "Dental Surgeon Near Me | Dr. Sneha Rachha"
/about-dr-shruti-sarwate-athalye/→ "Cosmetic Dentist Near Me | Dr. Shruti Sarwate Athalye"
```

**Cost is the one place where writing new content is clearly justified** — the intent exists, competitors serve it, we serve nothing. **Blocked on `NEEDS-INPUT` P1–P12.** I will not invent dental prices.

---

## 3.5 Local signal gap — **we lead; do not spend the roadmap here**

Measured ranks [`2b-gbp-*.json`]:

| Query | Aesthedent |
|---|---|
| `dental implant Kothrud` | **2** |
| `dental clinic Kothrud` | **3** |
| `best dentist in Kothrud` | **3** |
| `dentist Kothrud Pune` | **15** ← unexplained |

**Where we lead:** 5.0 rating (matched by several, beaten by none); top-3 for three of four Tier-1 local queries; correct NAP, hours (incl. Wednesday closure), attributes; **primary category already `Dental clinic`** — matching 10 of 10 in the top 10.

**Where we trail:**

| Signal | Us | Field |
|---|---|---|
| **GBP photos** | **36 — lowest of all 15 measured** | Soulful 345, Novacare 163, Orion 149, SmyleXL 137, Suyash 100, Odontoville 88, Silver Pearls 79 |
| **Q&A seeded** | **0** | — |
| Review volume | 277 (7th of 15) | Soulful 722, SmyleXL 663, Suyash 498 |

**Verified:** review count is **277, not the 263 on the site**. Rating 5.0 confirmed. `NEEDS-INPUT` N1/N2 answered.

**Two hypotheses tested and killed** — both would have shipped confident, wrong advice:
- ✗ *"Primary category is wrong / says Prosthodontist"* — it is already `Dental clinic`. The prosthodontist problem is on the **website**, not the GBP.
- ✗ *"Rank 15 on `dentist Kothrud Pune` is a category problem"* — **10 of 10** of that top 10 use the same `Dental clinic` primary we do. Category is constant; it cannot explain a difference.

**The rank-15 anomaly is unexplained and stays that way.** Proximity doesn't explain it (the whole top 10 is within 1.2 km of us); reviews don't (Dr. Neharkar ranks #3 with 101 reviews vs our 277). Candidates I have *not* verified: query volatility, profile age (~4 months), prominence. Needs repeat measurement.

**Not measured:** review velocity (reviews/month) — needs per-review dates; `maxReviews: 100` × 11 clinics was unaffordable against the **$5 free-plan credit** and lost to higher-value scrapes. The Phase 4F velocity SOP is therefore a **sensible default, not a data-grounded target**.

---

## 3.6 Trust / E-E-A-T gap — **real, and blocked on you**

| | Competitors | Us |
|---|---|---|
| Doctor credentials | Soulful: page per dentist, role + location titles | **two thin cards, no BDS/MDS, no registration number, no education** |
| `Person` schema | thedentalstudio, microdent, clovedental | **none** |
| Real clinical photography | — | **3 of 8 service pages use Pexels stock** (`dental-implants`, `root-canal`, `digital-smile-design`) [`lib/services.js`] |

Stock photography on the flagship implant page actively undermines E-E-A-T on health content.

Also live and unsourced [`NEEDS-INPUT` N3–N6]: `10+ Years`, `5000+ Happy Patients`, `100% Painless Treatments`. Phase 1 **removed** the contradictory `500+ successful cases` (it disagreed with `5000+` by 10×). The remainder need Dr. Sahil. **`100% Painless` is an absolute claim on medical content and should be reworded regardless.**

**Blocked:** `NEEDS-INPUT` C1–C9.

---

## 3.7 Technical gap — **we are far ahead; the brief's premise is wrong again**

The brief: *"GSAP + Lenis + Framer Motion is a heavy stack — quantify the cost."*

Quantified [`3-performance-measured.json`], cold cache, same machine and network:

| | **Aesthedent** | smileinn.in (**#3**) | soulfuldental.com (**#6**) |
|---|---|---|---|
| **Load** | **1,123 ms** | 16,408 ms | 20,510 ms |
| **DOMContentLoaded** | **464 ms** | 14,341 ms | 5,883 ms |
| JS (wire) | 324 KB | 255 KB | 408 KB |
| JS (uncompressed) | 1,011 KB | 824 KB | 1,410 KB |
| **CSS** | **128 KB** | 1,343 KB | 2,027 KB |
| **JS files** | **20** | 46 | 66 |
| **Requests** | **36** | 144 | 159 |

**The two sites outranking us are 15–18× slower than us.** Our CSS is 10–16× lighter; we make a quarter of the requests. The animation stack costs ~324 KB on the wire — **less than the WordPress site at #6**.

Lighthouse (mobile, live site): **Accessibility 100, Best Practices 100, SEO 92**. One failure: `link-text` — the Google Maps links lack descriptive text. Minor; worth a fix.

**Conclusion: performance is not why Aesthedent is not ranking, and the GSAP/Lenis/Framer stack does not need defending or removing.** Any roadmap item to "reduce the animation bundle" would be optimising the one thing we already win.

*Caveats: PageSpeed Insights (which the brief specified) returned `Quota exceeded` on the anonymous tier for all 10 sites — a free PSI API key would give real CrUX field data from actual Pune users. These are lab numbers from one machine, single sample. Load times vary; the structural figures (requests, CSS weight, file counts) do not.*

---

## 3.8 The one-page verdict

**Under 300 words. Blunt.**

**Aesthedent is not ranking organically because Google has indexed 3 of ~21 pages.**

`site:aesthedentpune.com` returns `/`, `/aesthedent-experience`, `/services/dentures`. Seven of eight service pages, `/about`, `/contact`, `/doctor`, `/services`, `/insights` and all six articles are **absent from the index** — confirmed by six independent per-path probes [`2c-serp-indexation*.json`]. You cannot rank for `root canal kothrud` when that page does not exist to Google. Absent from organic top-10 for **all 10** Tier-1/2 keywords is not a mystery; it is arithmetic.

**Ranked by impact:**

1. **Indexation (critical).** Until this moves, nothing else matters. Most likely cause: every page shipped a **byte-identical title and meta description with no canonical** — a textbook duplicate signature; Google consolidates near-duplicates and keeps a handful. **Phase 1 fixed exactly this** (unique titles, self-referencing canonicals, prerendered service pages). Whether it was *the* cause is a hypothesis the deploy tests — **and Search Console would confirm it in thirty seconds. Still not provided.**

2. **The domain is four months old (major, and partly nothing-is-broken).** Go-live ~March/April 2026, confirmed. Some of this is Google simply not having finished. **If Search Console says "Discovered – currently not indexed", the honest answer is: nothing is broken, wait.** If it says "Duplicate without user-selected canonical", Phase 1 already shipped the fix.

3. **The H1 was garbled (real, fixed).** Not theoretical: `"Redefining Dental Care in Pune"` as an exact phrase returns **0 results** while the homepage *is* indexed — because Google indexed `RedefiningRedefiningDental Care in Pune.in Pune.` [`2c-serp-indexation.json`].

4. **Page coverage (moderate).** Soulful has 46 pages to our 21. Missing: cost content, per-doctor pages.

5. **GBP photos: 36, lowest of 15 (small, cheap).**

**What is NOT the problem — stop planning to fix these:** the map pack (we rank **2nd–3rd**), content depth (the shallowest competitor outranks the deepest), performance (we are **15–18× faster** than the sites beating us), and the GBP category (already correct).

**Honest bottom line:** roughly half of this is a real, now-fixed technical defect. The other half is a four-month-old domain that needs time. Anyone promising you a position is guessing.
