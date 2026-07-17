# Phase 2D — Schema Coverage Matrix

**Source:** `audit/raw/2d-schema-matrix.json` — regenerate with `node scripts/schema-matrix.mjs`
**Method:** raw `fetch()` of each homepage, JSON-LD parsed from `<script type="application/ld+json">`.
**Date:** 2026-07-17

> **Methodology note — this nearly went wrong.** I first tried reading JSON-LD out of the `apify/website-content-crawler` dataset (2A). It returned **zero** schema for every competitor. That is false: the actor returns *cleaned* HTML with every `<script>` stripped, so JSON-LD is invisible to it. Had I trusted it, this file would have claimed "no competitor uses structured data" — the opposite of the truth. The matrix below comes from raw HTML fetched directly, which costs nothing.

---

## The matrix

`blk` = number of JSON-LD blocks on the homepage.

| Site | blk | Dentist | LocalBusiness | AggregateRating | FAQPage | Review | Breadcrumb | Organization | WebSite | Person |
|---|---|---|---|---|---|---|---|---|---|---|
| **aesthedentpune.com (US)** | **1** | **YES** | – | **–** | **–** | – | **–** | **–** | **–** | – |
| soulfuldental.com | 1 | – | – | – | – | – | YES | YES | YES | – |
| silverpearlsdental.com | 6 | YES | YES | **YES** | **YES** | – | – | YES | YES | – |
| smileinn.in | 2 | – | – | – | – | – | YES | YES | YES | – |
| oriondentalspecialities.com | 1 | – | – | – | – | – | YES | YES | YES | – |
| thedentalstudio.co.in | 1 | YES | – | – | – | – | – | YES | YES | YES |
| microdentdentistry.com | 6 | YES | – | **YES** | – | – | – | YES | YES | YES |
| integritydentalcare.in | 3 | – | – | **YES** | – | YES | – | – | YES | – |
| sabkadentist.com *(chain)* | 3 | – | YES | – | – | – | YES | YES | YES | – |
| clovedental.in *(chain)* | 10 | – | YES | **YES** | – | YES | YES | YES | YES | YES |
| toothandcodental.com | — | **fetch failed** — not measured, not assumed | | | | | | | | |

**`toothandcodental.com` could not be fetched** (connection failure). It is absent from this matrix rather than scored as "no schema" — I don't know either way. Worth a manual check.

---

## What the data says

### 1. Aesthedent has the thinnest schema of every site measured

One block, `Dentist`, plus address/geo/hours. **Every other site that could be fetched has more.** Even the sites with *no* dental-specific type (`soulfuldental`, `smileinn`, `oriondentalspecialities`) carry `Organization` + `WebSite` + `BreadcrumbList`, which we lack entirely.

Full type list, ours (`app/layout.tsx:68`):
```
Dentist, GeoCoordinates, OpeningHoursSpecification, PostalAddress
```
Silver Pearls, for comparison:
```
AggregateRating, Answer, ContactPoint, Dentist, FAQPage, GeoCoordinates,
LocalBusiness, OpeningHoursSpecification, Organization, PostalAddress,
Question, SearchAction, WebSite, person
```

### 2. The AggregateRating gap is the expensive one

Four competitors publish a rating to Google. We publish none — despite holding **the strongest rating/volume combination of any independent in the set**:

| Site | Published rating | Published count | Actual GBP reviews |
|---|---|---|---|
| **Aesthedent** | **none** | **none** | **277 @ 5.0** |
| silverpearlsdental.com | 5.0 | 202 | 294 @ 5.0 |
| microdentdentistry.com | 4.9 | 250 | — |
| clovedental.in *(chain)* | 4.6 | 312 | — |
| integritydentalcare.in | 5 | 21 | — |

Silver Pearls publishes `5.0 / 202`. We have **277 @ 5.0** and tell Google nothing.

**Caveat worth stating plainly:** publishing `AggregateRating` for your own business in `Dentist`/`LocalBusiness` markup is *self-serving review markup*, which Google's guidelines say it ignores for rich results. Every competitor doing it is technically outside guidance. So this is a "match the field" move for parity, **not** a guaranteed stars-in-SERP win — and I'd rather you knew that than be sold a star rating that never appears. It still correctly states NAP + rating as machine-readable facts.

### 3. `FAQPage` is nearly unclaimed — and we already wrote the content

**Only Silver Pearls has `FAQPage`** of all 10 competitors. Meanwhile `lib/services.js` already contains **28 hand-written FAQs** across the eight services, entirely unmarked.

Cheapest high-value win in the audit: the content exists, is genuinely good, and needs markup only. No writing required.

### 4. `MedicalProcedure` is used by nobody

**Zero of ten** competitors use it. The brief's Phase 4E calls for `MedicalProcedure` on every service page — worth doing as a differentiator, but it is emphatically **not** why competitors outrank us, and it should not be prioritised over indexation. Ranking it high would be cargo-culting.

### 5. BreadcrumbList is table stakes and we don't have it

Five of ten (`soulful`, `smileinn`, `orion`, `sabkadentist`, `clove`) ship `BreadcrumbList`. We have none. Cheap, and it improves SERP display of URL paths.

---

## Recommended priority (grounded in the above)

| Priority | Schema | Why — evidence |
|---|---|---|
| **1** | `FAQPage` | 28 FAQs already written; only 1 of 10 competitors has it — real differentiation, zero content cost |
| **2** | `Organization` + `WebSite` | Every fetchable competitor has both; we have neither |
| **3** | `BreadcrumbList` | 5 of 10 have it; we have none |
| **4** | `AggregateRating` | 4 competitors publish it; **blocked on verifying 277/5.0 — see NEEDS-INPUT N1/N2.** Parity move, not a guaranteed rich result (see caveat) |
| **5** | Enrich `Dentist` | Add `priceRange`, `areaServed`, `hasMap`, `medicalSpecialty`, `sameAs` (we link only Google Maps) |
| **6** | `MedicalProcedure` | Nobody has it. Differentiator, not a gap. Do it last |

## What we already do right

Our single `Dentist` block is **correct**: accurate `PostalAddress`, real `geo` (18.497271 / 73.813467), and `openingHoursSpecification` that properly excludes Wednesday. Several competitors with more blocks have *less* accurate local data. The problem is coverage, not correctness.
