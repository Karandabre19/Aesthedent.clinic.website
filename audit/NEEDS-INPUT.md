# Needs Input

Consolidated list of everything I cannot verify from the repo. Nothing on this list gets published, put into schema, or written into copy until it is answered. Updated as phases progress.

---

## Access / credentials

| # | Item | Blocks | Status |
|---|---|---|---|
| A1 | **Apify API token** | All of Phase 2 | Open |
| A2 | **Search Console** access or CSV export (queries, impressions, positions, coverage) | Phase 2C ground truth, Phase 3.8 verdict | Open |
| A3 | **Google Business Profile** access (or read-only view of Insights) | Phase 4F | Open |
| A4 | **Actual go-live date** of `www.aesthedentpune.com` | Phase 3.8 verdict | **Answered 2026-07-17: ~March/April 2026, with the repo** |
| A5 | Domain registration date — if the domain predates the site | Phase 3.8 verdict | Open (low priority given A4) |

**On A4:** confirmed go-live ~March/April 2026 — the site is **~4 months old**, matching the repo's first commit (2026-03-25). This is now a leading candidate for the Phase 3 verdict: a domain this new may simply not have been fully evaluated by Google yet. Phase 2C + Search Console will show whether the pages are even indexed, which decides whether "not ranking" is a defect or just arithmetic.

---

## Unverified numbers currently live on the site

These are already published. I did not write them and will not carry them into schema or new copy until confirmed. `aggregateRating` in particular puts a number in front of Google as a factual claim.

| # | Claim | Where | Status |
|---|---|---|---|
| N1 | **Google rating `5.0`** | `app/HomeClient.js` | ✅ **VERIFIED 2026-07-17** — the live GBP really is 5.0 [`audit/02-gbp-comparison.md`]. Still **not** in `aggregateRating` — held per your instruction. |
| N2 | ~~`263 Reviews`~~ → **`277 Reviews`** | `app/HomeClient.js` | ✅ **CORRECTED** — the live GBP shows **277**; the site was 14 behind. Updated. **This is hardcoded and will drift again** — see D5. |
| N3 | **`10+ Years Experience`** | `app/HomeClient.js` | ❌ **STILL UNSOURCED.** Whose — Dr. Sahil's, or the clinic's? The clinic cannot be 10 years old if the domain is 4 months old. Shipping in SSR HTML today. |
| N4 | **`5000+ Happy Patients`** | `app/HomeClient.js` | ❌ **STILL UNSOURCED.** Shipping in SSR HTML today. |
| N5 | ~~`500+ successful cases`~~ | *was* `aesthedent-experience/layout.js:16` | ✅ **REMOVED in Phase 1** — contradicted N4 by 10×. Not replaced with another number. |
| N6 | ~~`100% Painless Treatments`~~ → **`100% Comfort-First / Every Treatment`** | `app/HomeClient.js` | ✅ **REWORDED.** Was an absolute claim about a clinical *outcome* (pain varies by patient; it cannot be promised). Now a claim about our *process*, which the clinic controls. **Still needs Dr. Sahil's nod on the new wording.** |
| N7 | ~~`zero discomfort`~~ → `keep discomfort to a minimum` | `app/services/ServicesClient.js` | ✅ **REWORDED** — same problem as N6, found while fixing it. |
| N8 | ~~`ensure safety and zero procedure anxiety`~~ → `designed to keep you calm and settled` | `app/aesthedent-experience/page.js` | ✅ **REWORDED** — same problem as N6. |
| N9 | **`Lifetime guarantee`** | `lib/landing-page-content.js:37` | ⚠️ **NOT LIVE, BUT ARMED.** The file is imported by the experience page, but only `.faqs` is consumed — so the string never renders. It is a serious clinical/legal claim sitting one line of code away from going live. **Recommend deleting it.** |

---

## Clinical / credentials — needs Dr. Sahil

Required for Phase 4D (doctor pages) and 4E (`Person` schema). All blank in the repo today.

| # | Item |
|---|---|
| C1 | Dr. Sahil Wathodkar — full qualifications (BDS/MDS), university, graduation years |
| C2 | Dr. Sahil Wathodkar — **Dental Council registration number** (state council + number) |
| C3 | Dr. Aishwarya Kulkarni — full qualifications, university, years |
| C4 | Dr. Aishwarya Kulkarni — **Dental Council registration number** |
| C5 | Years in practice, each doctor (resolves N3) |
| C6 | Implant/FMR case counts, if either is to be claimed (resolves N4/N5) |
| C7 | Memberships, fellowships, publications, CE |
| C8 | Implant systems used (Nobel, Straumann, Osstem…) — needed for honest cost bands |
| C9 | Named affiliations/certifications for BPS dentures and Digital Smile Design — `lib/services.js` presents both as branded protocols |

---

## Pricing — Phase 4C blocker

Phase 4C requires "real INR ranges" on eight service pages; the repo has **zero pricing content**. Cost pages are a major competitor gap, but published dental pricing is a commercial and clinical commitment.

| # | Item |
|---|---|
| P1 | Consultation fee |
| P2 | Dental implant — per-implant range by system (C8) |
| P3 | Root canal — anterior / premolar / molar, ± crown |
| P4 | Crowns — by material (PFM, zirconia, e.max) |
| P5 | Full mouth rehabilitation — realistic range |
| P6 | Braces vs aligners |
| P7 | Dentures — BPS vs conventional, partial vs full |
| P8 | Wisdom tooth — simple vs surgical |
| P9 | Tooth-coloured fillings |
| P10 | Digital Smile Design — standalone fee or bundled? |
| P11 | **Policy call:** publish real ranges, or "from ₹X"? Ranges rank better and build trust; they also anchor negotiation and invite undercutting. Dr. Sahil's call, not mine. |
| P12 | EMI / insurance / third-party financing — offered? |

---

## Business facts

| # | Item |
|---|---|
| B1 | Wednesday — fully closed, or emergency-only? (Affects `openingHoursSpecification`.) |
| B2 | Languages spoken (English / Hindi / Marathi) — real local trust signal, currently absent |
| B3 | Actual areas served — Phase 4D lists Kothrud, Karve Nagar, Deccan, Erandwane, Warje, Bavdhan, Paud Road. Confirm these reflect where patients genuinely come from; inventing catchment pages is exactly the thin-content pattern the brief says to avoid |
| B4 | Social profiles for `sameAs` (Instagram, Facebook, Practo, Justdial) — only Google Maps is linked today |
| B5 | Before/after gallery — do signed patient consent forms exist? No consent, no gallery |
| B6 | Is `5.0` / `263` current as of today, or a stale snapshot from an earlier edit? |

---

## Content

| # | Item |
|---|---|
| T1 | Three of eight service pages use **Pexels stock photos** as their hero (`dental-implants`, `root-canal`, `digital-smile-design` — `lib/services.js`). Are real clinical photos available? Stock imagery on money pages undercuts E-E-A-T |
| T2 | `दातों के साथ भी, दातों के बाद भी` — confirm the intended English gloss, for `alt`/meta where the Devanagari can't carry |
| T3 | **`/privacy` and `/terms` are linked from the sitewide footer but don't exist** — every page links to two 404s. Needs real legal copy (privacy policy, terms). Do you have existing text, or should Phase 4D draft it for review? |

---

## Decisions for you — raised in Phase 1

| # | Item |
|---|---|
| D1 | **Hero background animation has never run.** `.hero-bg-image` is referenced by GSAP 5× but the class was never on the element, so the hero's load zoom and ambient drift have been dead since launch. One-line fix, deliberately **not applied** — switching it on is a visible change to the hero. Want it enabled? |
| D2 | **Stat count-up now flashes ~380ms.** Real values paint from SSR, then the count-up restarts from 0. Unavoidable if we want both real values in HTML and a count-from-zero animation. Alternative: animate only on scroll-in (no flash, less delight). Current behaviour acceptable? |
| D3 | **Mobile doctor role badge restyled.** De-duplicating the doctor cards unified mobile's plain uppercase role text to desktop's pill badge. Improvement in my view — say if you want the old mobile styling. |
| D4 | ~~Provisional titles~~ — ✅ **resolved.** Phase 4A shipped the final wording, now grounded in Phase 2: not one of the eight independents ranking #2–#8 leads with "prosthodontist", so the site no longer does either. Prosthodontics is the differentiator in the description, not the label. |
| D5 | **The review count is hardcoded (`277`) and will drift.** It was already 14 behind when I found it. Options: (a) accept a manual update every few months, (b) wire it to a source. Which? |
| D6 | **`aggregateRating` is built but NOT wired up**, per your instruction. `lib/schema.js` has `buildAggregateRating()` ready. Confirm **277 @ 5.0** and I'll enable it. One caveat you should have first: self-serving `AggregateRating` in `LocalBusiness`/`Dentist` markup is **outside Google's guidelines and ignored for rich results** — four competitors publish it anyway. It's a parity move, not a guaranteed star rating. |
| D7 | **Hero H1 restructured** to `Dental Care in Kothrud, Pune. Redefined.` (was `Redefining Dental Care in Pune.` — contained neither Tier-1 term). Same voice, same shimmer-then-accent treatment; now renders as three visual lines rather than two. Verified in-browser; animation intact. Happy with it? |
