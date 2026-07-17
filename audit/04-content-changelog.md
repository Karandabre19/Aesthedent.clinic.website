# Phase 4 — Content & Code Changelog

**Branch:** `seo/phase-1-technical-fixes`
**Build:** green · **Check:** `node scripts/seo-check.mjs` → **308 assertions across 21 routes, 0 failures**
**Verified in a real browser** against the production build.

Scope: indexation first (your instruction), then the unblocked schema/metadata work. **4C (service page rewrites) and 4D (doctor pages) remain blocked** on pricing and credentials.

---

## 0. Indexation — done first, as instructed

### Sitemap completeness ✅
`app/sitemap.js` emits **21 of 21** URLs. Nothing missing. It builds from the `services` and `insights` arrays, so it self-maintains.

### All 21 URLs verified live ✅
Every URL returns **HTTP 200** on production. `robots.txt` is clean (`Allow: /`, sitemap declared). `sitemap.xml` reachable, 3869 bytes.

### Mega-dropdown crawlability ✅ — **not the problem**
You were right to suspect it, but it's fine. The dropdown is **CSS-hidden (`opacity-0 pointer-events-none`), not conditionally rendered**, so the anchors are in the server HTML. Verified against the **live** site, not the source:

```
$ curl -s https://www.aesthedentpune.com/ | grep -o 'href="/services/[a-z-]*"' | sort -u
→ all 8 service pages present as real <a href>
```

`next/link` renders real anchors. Googlebot can see and follow every one.

### The conclusion this forces

**Nothing technical is blocking discovery.** Sitemap complete, all URLs 200, robots permissive, every page internally linked with crawlable anchors. Google *can* reach these pages and is **choosing not to index them**.

That removes the entire "broken crawl path" family of explanations and leaves two: the **duplicate-title signature** (21 identical titles, no canonicals — fixed in Phase 1) and **domain age** (~4 months). Search Console separates them; still not provided.

### The 18 URLs → `audit/UNINDEXED-URLS.txt`
Prioritised: 7 service money pages → 4 hub/trust pages → 7 insights. GSC allows ~10–12 manual submissions/day.

> ⚠️ **Submit only after this branch deploys.** Requesting indexing now makes Google re-crawl the same duplicate titles and re-confirm its decision. Deploy first, then submit.

---

## 1. Schema — shipped

New: `lib/schema.js` (single source of truth for NAP) + `components/seo/JsonLd.js` (server component, so JSON-LD is in the HTML with JS disabled).

### Before → After

| | Before | After |
|---|---|---|
| Homepage blocks | 1 | **3** |
| Types | `Dentist` | `Dentist` + `LocalBusiness`, `Organization`, `WebSite` |
| Service page blocks | 0 | **6** — the 3 above + `FAQPage`, `MedicalProcedure`, `BreadcrumbList` |
| **FAQs marked up** | **0** | **28** |
| `sameAs` | 1 (Google Maps) | **6** |
| `areaServed` | – | 7 localities |
| `hasMap`, `logo`, `medicalSpecialty` | – | ✅ |

We went from **the thinnest schema of all 11 sites measured** to more coverage than any independent competitor [`audit/02-schema-matrix.md`].

### 28 FAQs, zero new writing
Every FAQ was **already written** in `lib/services.js` and shipping unmarked. Only **1 of 10 competitors** has `FAQPage`. Content existed; markup didn't.

```
4 dental-implants   4 root-canal      3 full-mouth-rehabilitation
4 tooth-fillings    3 wisdom-tooth-surgery
4 orthodontic-treatment  3 dentures   3 digital-smile-design
= 28
```

### `sameAs` — every URL observed, none invented
**I got this wrong first and caught it.** I reconstructed the profile URLs from memory and **three of five were fabricated** — the Facebook slug was missing "Kothrud", the Instagram handle was `drwathodkar_aesthedent` instead of `drwathodkar_aesthedent_clinic`, and Justdial's real URL carries a long ID.

Every URL now in `sameAs` was **observed ranking** in the Phase 2C brand SERP [`audit/raw/2c-serp-indexation.json`] and then checked to resolve. All return 200 except Practo (403 to non-browser agents while ranking #5 — bot-blocking, not dead).

A `sameAs` that 404s is a false statement to Google about who you are. Worth the extra check.

### Deliberately NOT shipped
- **`aggregateRating`** — held per your instruction. `buildAggregateRating()` is written and ready in `lib/schema.js`; enable once you confirm 277 @ 5.0. See `NEEDS-INPUT` D6 for the guidelines caveat.
- **`priceRange`** — we publish no pricing, so any value would be invented.
- **`Person`** — needs credentials (`NEEDS-INPUT` C1–C9).

---

## 2. Absolute medical claims — reworded

You asked for `100% Painless`. Fixing it surfaced two more of the same kind, both live. All three now claim a **process we control**, not an **outcome we can't promise**.

| Where | Before | After |
|---|---|---|
| Homepage stat | `100% Painless / Treatments` | **`100% Comfort-First / Every Treatment`** |
| `/services` | `Painless Procedures` — *"gentle techniques for **zero discomfort**"* | **`Comfort-First Procedures`** — *"…to keep discomfort to a minimum"* |
| `/aesthedent-experience` | *"Painless protocols that **ensure** safety and **zero procedure anxiety**"* | *"Comfort-first sedation protocols, designed to keep you calm and settled throughout"* |

The check now **fails the build** if any of these strings return.

### ⚠️ Found while doing this: `Lifetime guarantee`
`lib/landing-page-content.js:37` contains *"Painless treatment. Natural results. **Lifetime guarantee.**"*

**It is not live** — the file is imported but only `.faqs` is consumed, so the string never renders. I verified this rather than assume. But it is a serious clinical and legal claim sitting one line of code away from production. **Recommend deleting it** (`NEEDS-INPUT` N9). Not deleted unilaterally — it's your copy.

---

## 3. Review count — corrected

`263 Reviews` → **`277 Reviews`**, verified against the live GBP [`audit/02-gbp-comparison.md`]. The site was 14 behind.

It's hardcoded and **will drift again** — `NEEDS-INPUT` D5.

Rating `5.0` **verified correct**. `10+ Years` and `5000+ Happy Patients` remain **unsourced and shipping** (`NEEDS-INPUT` N3/N4).

---

## 4A. Metadata — final wording

The positioning question the brief flagged is now settled by data, not opinion: **of the eight independents ranking #2–#8 for `dentist in kothrud`, not one leads with "prosthodontist"** [`audit/02-serp-positions.md`]. Prosthodontics is now the *reason to choose us* in the description — not the label.

| Route | Title | Len |
|---|---|---|
| `/` | Dentist in Kothrud, Pune \| Aesthedent Dental Clinic | 51 |
| `/about` | Dental Clinic in Kothrud — About Us \| Aesthedent | 47 |
| `/contact` | Contact Our Dentist in Kothrud, Pune \| Aesthedent | 48 |
| `/doctor` | Dentists in Kothrud, Pune — Our Team \| Aesthedent | 48 |
| `/services` | Dental Treatments in Kothrud, Pune \| Aesthedent | 46 |
| `/insights` | Dental Advice from Our Kothrud Dentists \| Aesthedent | 51 |
| `/aesthedent-experience` | The Aesthedent Experience \| Kothrud, Pune | 41 |
| `/services/[slug]` | *[Service]* in Kothrud, Pune \| Aesthedent | 45–55 |

All ≤60. All unique. Tier-1 term in the front half. Brand last. **Descriptions all ≤155** — now enforced by the check, because I shipped a 156 and a 158 by counting with my eyes.

**What we did not copy:** Silver Pearls' `Best Dentist in Kothrud | Best Dental Clinic in Kothrud, Pune` repeats the term and ranks **#8 — the lowest independent in the top 8**. The location token works; the stuffing doesn't.

### H1
```
was:  Redefining Dental Care in Pune.        ← no "dentist", no "Kothrud"
now:  Dental Care in Kothrud, Pune. Redefined.
```
The brief's own direction. Same voice, same shimmer-on-"Dental Care", same accent on the closing word. Renders as three visual lines instead of two — verified in-browser, GSAP timeline intact (27 chars, all animated to `opacity: 1`).

---

## 5. `link-text` — Lighthouse's one failure, fixed

Lighthouse mobile on the live site: **A11y 100, Best Practices 100, SEO 92**, one failure — `link-text` on the Google Maps links.

Root cause was the *same* duplicate-span pattern as the doctor cards: `<span class="hidden sm:inline">Visit Clinic</span><span class="sm:hidden">Location</span>` puts both in the DOM, so the link's accessible name read `Visit ClinicLocation`. Added descriptive `aria-label`s to all three Maps/reviews links.

---

## Verification

```bash
npm run build && node scripts/seo-check.mjs   # → 308 passed, 0 failed
```

The check grew from 142 → 308 assertions this phase. New coverage: schema types per route, JSON-LD parses, FAQPage carries real questions, `aggregateRating` **absent** (guards your hold), no stale `263`, no absolute medical claims, description length.

**Two of my own errors were caught by it, not by me** — a 156-char description and a 158-char one. The `sameAs` fabrication was caught by checking the raw data.

---

## Still blocked

| Item | Needs |
|---|---|
| **4C** — service page cost sections | Pricing `P1–P12`. The single biggest content gap; competitors rank for `dental implant cost pune` and we serve nothing. **I will not invent dental prices.** |
| **4D** — per-doctor pages + `Person` schema | Credentials `C1–C9` (BDS/MDS, registration numbers, education) |
| **4E** — `aggregateRating` | Your confirmation of 277 @ 5.0 |
| **4D** — `/privacy`, `/terms` | Real legal copy. Every page currently links to both → **sitewide 404s** |
| **4D** — before/after gallery | Signed patient consent (`B5`) |
| **4F** — GBP plan | GBP access. Photos (36 → 100+) and Q&A seeding are the actions; review-velocity targets are **not** data-grounded (couldn't afford the scrape) |

**Note on 4C:** the brief's 1200–1800 word target should be dropped — the data says depth isn't the gap (`audit/03-gap-analysis.md` §3.3). What's missing is the **cost topic**, not word count.
