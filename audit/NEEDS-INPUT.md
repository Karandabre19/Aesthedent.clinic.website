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
| A5 | Domain registration date - if the domain predates the site | Phase 3.8 verdict | Open (low priority given A4) |

**On A4:** confirmed go-live ~March/April 2026 - the site is **~4 months old**, matching the repo's first commit (2026-03-25). This is now a leading candidate for the Phase 3 verdict: a domain this new may simply not have been fully evaluated by Google yet. Phase 2C + Search Console will show whether the pages are even indexed, which decides whether "not ranking" is a defect or just arithmetic.

---

## Unverified numbers currently live on the site

These are already published. I did not write them and will not carry them into schema or new copy until confirmed. `aggregateRating` in particular puts a number in front of Google as a factual claim.

| # | Claim | Where | Status |
|---|---|---|---|
| N1 | **Google rating `5.0`** | `app/HomeClient.js` | ✅ **VERIFIED 2026-07-17** - the live GBP really is 5.0 [`audit/02-gbp-comparison.md`]. Still **not** in `aggregateRating` - held per your instruction. |
| N2 | ~~`263 Reviews`~~ → **`277 Reviews`** | `app/HomeClient.js` | ✅ **CORRECTED** - the live GBP shows **277**; the site was 14 behind. Updated. **This is hardcoded and will drift again** - see D5. |
| N3 | **`10+ Years Experience`** | `app/HomeClient.js` | ❌ **STILL UNSOURCED.** Whose - Dr. Sahil's, or the clinic's? The clinic cannot be 10 years old if the domain is 4 months old. Shipping in SSR HTML today. |
| N4 | **`5000+ Happy Patients`** | `app/HomeClient.js` | ❌ **STILL UNSOURCED.** Shipping in SSR HTML today. |
| N5 | ~~`500+ successful cases`~~ | *was* `aesthedent-experience/layout.js:16` | ✅ **REMOVED in Phase 1** - contradicted N4 by 10×. Not replaced with another number. |
| N6 | ~~`100% Painless Treatments`~~ → **`100% Comfort-First / Every Treatment`** | `app/HomeClient.js` | ✅ **REWORDED.** Was an absolute claim about a clinical *outcome* (pain varies by patient; it cannot be promised). Now a claim about our *process*, which the clinic controls. **Still needs Dr. Sahil's nod on the new wording.** |
| N7 | ~~`zero discomfort`~~ → `keep discomfort to a minimum` | `app/services/ServicesClient.js` | ✅ **REWORDED** - same problem as N6, found while fixing it. |
| N8 | ~~`ensure safety and zero procedure anxiety`~~ → `designed to keep you calm and settled` | `app/aesthedent-experience/page.js` | ✅ **REWORDED** - same problem as N6. |
| N9 | **`Lifetime guarantee`** | `lib/landing-page-content.js:37` | ⚠️ **NOT LIVE, BUT ARMED.** The file is imported by the experience page, but only `.faqs` is consumed - so the string never renders. It is a serious clinical/legal claim sitting one line of code away from going live. **Recommend deleting it.** |
| N10 | ~~`98% success rate`~~ | `app/aesthedent-experience/page.js` | ✅ **REMOVED in Phase 4B (2026-08-03).** Found during the Part A retitle; **not previously logged**. An unsourced clinical success statistic, shipping in SSR HTML on one of our three *indexed* pages - the highest-exposure unsourced claim on the site. Sentence now reads "The software and hardware behind every plan we build." **Needs a real source before any number returns.** |

---

## Clinical / credentials - needs Dr. Sahil

Required for Phase 4D (doctor pages) and 4E (`Person` schema). All blank in the repo today.

| # | Item |
|---|---|
| C1 | Dr. Sahil Wathodkar - full qualifications (BDS/MDS), university, graduation years - ✅ **ANSWERED 2026-08-03:** BDS + MDS, Bharati Vidyapeeth, Pune; Advanced Training in Digital Dentistry. Now in `lib/clinic.ts` and live on the homepage. **Graduation years still open.** |
| C2 | Dr. Sahil Wathodkar - **Dental Council registration number** (state council + number) - **still open**, tracked as `registrationNumber: null` in `lib/clinic.ts` (R1). Does not display while null. |
| C3 | Dr. Aishwarya Kulkarni Wathodkar - full qualifications, university, years - ✅ **ANSWERED 2026-08-03:** BDS, Bharati Vidyapeeth, Pune; Pregnancy Dentistry; Endodontics training. **She is BDS / general & family dentist - NOT a specialist**, and no page may imply otherwise. **Years still open.** |
| C4 | Dr. Aishwarya Kulkarni Wathodkar - **Dental Council registration number** - **still open** (R2), same null-placeholder pattern. |
| C5 | Years in practice, each doctor (resolves N3) |
| C6 | Implant/FMR case counts, if either is to be claimed (resolves N4/N5) |
| C7 | Memberships, fellowships, publications, CE |
| C8 | Implant systems used (Nobel, Straumann, Osstem…) - needed for honest cost bands |
| C9 | Named affiliations/certifications for BPS dentures and Digital Smile Design - `lib/services.js` presented both as branded protocols. **Phase 4D: partly resolved by rewriting.** The **BPS / "Bio-functional Prosthetic System"** branding has been **removed entirely** from the dentures page - it was named as a proprietary protocol with no certification on file, and the underlying clinical points (muscle-movement impressions, bite registration, wax try-in) are true regardless, so they are now described directly. **Digital Smile Design** keeps its name but the copy now describes the *method* and claims **no accredited-provider status**. Supply certification and both can be stated properly. |
| **C10** | **Who performs orthodontic treatment?** `/services/orthodontic-treatment` is live and sells braces and aligners, but **neither clinician's listed credentials include orthodontics** - Dr. Sahil is prosthodontics, Dr. Aishwarya is general/family with endodontics training. The rewritten page therefore **names nobody** and claims no specialist status. If an orthodontist treats or visits, give me the name and qualification. If cases are referred out, say so - referring is a normal, respectable answer and we can write it honestly. |
| **C11** | **Who performs wisdom tooth surgery?** Same gap: `/services/wisdom-tooth-surgery` is live, no listed credential covers oral surgery. The page **names nobody**. Note the pre-Phase-4B homepage described Dr. Aishwarya as a "Dental Surgeon" who is "expert in painless extractions" - that wording is now gone, and it should not return without a qualification behind it. |

---

## Pricing - Phase 4C blocker

Phase 4C requires "real INR ranges" on eight service pages; the repo has **zero pricing content**. Cost pages are a major competitor gap, but published dental pricing is a commercial and clinical commitment.

| # | Item |
|---|---|
| P1 | Consultation fee |
| P2 | Dental implant - per-implant range by system (C8) |
| P3 | Root canal - anterior / premolar / molar, ± crown |
| P4 | Crowns - by material (PFM, zirconia, e.max) |
| P5 | Full mouth rehabilitation - realistic range |
| P6 | Braces vs aligners |
| P7 | Dentures - BPS vs conventional, partial vs full |
| P8 | Wisdom tooth - simple vs surgical |
| P9 | Tooth-coloured fillings |
| P10 | Digital Smile Design - standalone fee or bundled? |
| P11 | **Policy call:** publish real ranges, or "from ₹X"? Ranges rank better and build trust; they also anchor negotiation and invite undercutting. Dr. Sahil's call, not mine. |
| P12 | EMI / insurance / third-party financing - offered? |

---

## Business facts

| # | Item |
|---|---|
| B1 | Wednesday - fully closed, or emergency-only? (Affects `openingHoursSpecification`.) |
| B2 | Languages spoken (English / Hindi / Marathi) - real local trust signal, currently absent |
| B3 | Actual areas served - Phase 4D lists Kothrud, Karve Nagar, Deccan, Erandwane, Warje, Bavdhan, Paud Road. Confirm these reflect where patients genuinely come from; inventing catchment pages is exactly the thin-content pattern the brief says to avoid |
| B4 | Social profiles for `sameAs` (Instagram, Facebook, Practo, Justdial) - only Google Maps is linked today |
| B5 | Before/after gallery - do signed patient consent forms exist? No consent, no gallery |
| B6 | Is `5.0` / `263` current as of today, or a stale snapshot from an earlier edit? |

---

## Content

| # | Item |
|---|---|
| T1 | Three of eight service pages use **Pexels stock photos** as their hero (`dental-implants`, `root-canal`, `digital-smile-design` - `lib/services.js`). Are real clinical photos available? Stock imagery on money pages undercuts E-E-A-T |
| T2 | `दातों के साथ भी, दातों के बाद भी` - confirm the intended English gloss, for `alt`/meta where the Devanagari can't carry |
| T3 | **`/privacy` and `/terms` are linked from the sitewide footer but don't exist** - every page links to two 404s. Needs real legal copy (privacy policy, terms). Do you have existing text, or should Phase 4D draft it for review? |
| T4 | **Testimonials 2–6 in `lib/testimonials.js` have unverifiable provenance** - short, marketing-voiced, and two cite services the clinic does not offer (`Kids Dentistry`, removed from the catalogue; `Teeth Whitening`, no service page). They were shipping labelled "Verified patient" and "Shared on Google". **Phase 4B gated those labels behind a `verifiedGoogleReview` flag**, set only on 1, 7, 8 and 9. **Confirm 2–6 against the live profile: real → flag them; not real → delete them.** Fabricated reviews are a legal exposure, not only a trust one. |
| T5 | **Real Google reviewer photos requested but not available.** The brief asked to swap the grey silhouettes for real reviewer photos; we have none, and the only face images in the repo are Pexels stock photos of unrelated people (which would be worse - a stranger's face captioned with a patient's name). **Shipped initials-based avatars instead.** To use real photos we need the images *and* each reviewer's permission - a reviewer's profile picture is their likeness, not the clinic's asset. |
| T6 | **`components/sections/InstagramShowcase.js` claims `1,500+ Followers` and `500+ Transformations`** - both hardcoded and unsourced, both currently rendering. Not touched in Part B. Confirm or cut. |
| T7 | **`lib/landing-page-content.js` still holds `500+ Implants Successfully Placed` and `98% Long-Term Success Rate`** - same family as N5/N10. Not rendered today (only `.faqs` is consumed) but armed, exactly like N9. **Recommend deleting both lines.** |

---

## Decisions for you - raised in Phase 1

| # | Item |
|---|---|
| D1 | **Hero background animation has never run.** `.hero-bg-image` is referenced by GSAP 5× but the class was never on the element, so the hero's load zoom and ambient drift have been dead since launch. One-line fix, deliberately **not applied** - switching it on is a visible change to the hero. Want it enabled? |
| D2 | **Stat count-up now flashes ~380ms.** Real values paint from SSR, then the count-up restarts from 0. Unavoidable if we want both real values in HTML and a count-from-zero animation. Alternative: animate only on scroll-in (no flash, less delight). Current behaviour acceptable? |
| D3 | **Mobile doctor role badge restyled.** De-duplicating the doctor cards unified mobile's plain uppercase role text to desktop's pill badge. Improvement in my view - say if you want the old mobile styling. |
| D4 | ~~Provisional titles~~ - ✅ **resolved.** Phase 4A shipped the final wording, now grounded in Phase 2: not one of the eight independents ranking #2–#8 leads with "prosthodontist", so the site no longer does either. Prosthodontics is the differentiator in the description, not the label. |
| D5 | **The review count is hardcoded (`277`) and will drift.** It was already 14 behind when I found it. Options: (a) accept a manual update every few months, (b) wire it to a source. Which? |
| D6 | **`aggregateRating` is built but NOT wired up**, per your instruction. `lib/schema.js` has `buildAggregateRating()` ready. Confirm **277 @ 5.0** and I'll enable it. One caveat you should have first: self-serving `AggregateRating` in `LocalBusiness`/`Dentist` markup is **outside Google's guidelines and ignored for rich results** - four competitors publish it anyway. It's a parity move, not a guaranteed star rating. |
| D7 | **Hero H1 restructured** to `Dental Care in Kothrud, Pune. Redefined.` (was `Redefining Dental Care in Pune.` - contained neither Tier-1 term). Same voice, same shimmer-then-accent treatment; now renders as three visual lines rather than two. Verified in-browser; animation intact. Happy with it? |
| D8 | **"Painless" is now a title, an H1 and a target keyword** - `/aesthedent-experience`, Phase 4B Part A. This runs against N6/N7/N8, where we deliberately walked back absolute pain claims (`100% Painless` → `Comfort-First`; `zero discomfort` → `keep discomfort to a minimum`) because pain is an *outcome* that varies by patient and cannot be promised. **Mitigation applied:** "painless" is used only as the search-category noun phrase in title/H1/eyebrow; the body prose promises **process**, not outcome (we show you the scan, explain it, agree the plan, stop when you raise your hand). No sentence claims you will feel nothing. **Dr. Sahil should still sign off on the word appearing in the `<title>` at all** - it is a health claim in a search result. |
| D9 | **New title runs to 66 chars** and will truncate near 60 in Google's SERP; `\| Aesthedent` is what gets cut. Shipped as you specified. Shorter form held ready if you want it: `Painless Dental Treatment in Kothrud \| Aesthedent` (48 chars), which keeps the brand visible and loses only "Specialist-Led" - a phrase the H1 and description both already carry. One-line change. |
