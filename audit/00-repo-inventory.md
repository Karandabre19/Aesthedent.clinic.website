# Phase 0 — Repo Inventory

**Date:** 2026-07-17
**Commit:** `dac8a13`
**Build status:** green (`next build` exit 0, TypeScript clean)
**Method:** every claim below is read from the repo or extracted from real build output in `.next/server/app/*.html`. Nothing here is inferred from the brief.

---

## 1. Route tree

Next.js App Router. Nine routes, one API catch-all.

| Route | File | Render mode |
|---|---|---|
| `/` | `app/page.js` | ○ Static |
| `/about` | `app/about/page.js` | ○ Static |
| `/aesthedent-experience` | `app/aesthedent-experience/page.js` | ○ Static |
| `/contact` | `app/contact/page.js` | ○ Static |
| `/doctor` | `app/doctor/page.js` | ○ Static |
| `/insights` | `app/insights/page.js` | ○ Static |
| `/insights/[slug]` | `app/insights/[slug]/page.js` | **ƒ Dynamic** |
| `/services` | `app/services/page.js` | ○ Static |
| `/services/[slug]` | `app/services/[slug]/page.js` | **ƒ Dynamic** |
| `/sitemap.xml` | `app/sitemap.js` | ○ Static |
| `/api/[[...path]]` | `app/api/[[...path]]/route.js` | ƒ Dynamic |

The brief assumed a route at `/services/dental-implants`. There is no such directory — the eight services are data objects in `lib/services.js` rendered through the `[slug]` segment. The URL exists; the file does not.

**Service slugs** (`lib/services.js`): `dental-implants`, `root-canal`, `full-mouth-rehabilitation`, `tooth-fillings`, `wisdom-tooth-surgery`, `orthodontic-treatment`, `dentures`, `digital-smile-design` — all eight named in Phase 4C already exist as data.

---

## 2. Per-route SEO table

Titles and meta are extracted from prerendered HTML, not from source.

| Route | `<title>` | Meta description | H1 (as a crawler reads it) | Words | H2s | Canonical | OG |
|---|---|---|---|---|---|---|---|
| `/` | *root* (see below) | *root* | `RedefiningRedefiningDental Care in Pune.in Pune.` | 1181 | 10 | **none** | inherited |
| `/about` | *root, identical* | *root, identical* | `We explain everything before we start.` | 577 | 7 | **none** | inherited |
| `/aesthedent-experience` | `The Aesthedent Experience \| Premium Dental Care in Kothrud, Pune` | own (see §3) | `Specialized Unique Treatments.` | 1439 | 12 | **none** | own, broken |
| `/contact` | *root, identical* | *root, identical* | `Get in Touch` | 322 | 4 | **none** | inherited |
| `/doctor` | *root, identical* | *root, identical* | `Top Dentists in Kothrud, Pune – Our Team` | 633 | 8 | **none** | inherited |
| `/insights` | *root, identical* | *root, identical* | `Insights` | 433 | 6 | **none** | inherited |
| `/insights/[slug]` | *root, identical* | *root, identical* | *(post title)* | n/a | — | **none** | inherited |
| `/services` | *root, identical* | *root, identical* | `Our Dental Services` | 402 | 5 | **none** | inherited |
| `/services/[slug]` | *root, identical* | *root, identical* | *(service title, e.g. `Dental Implants`)* | n/a | — | **none** | inherited |

Word counts include nav + footer boilerplate (~120 words), so subtract that for true body content.

**Root metadata** (`app/layout.tsx:17`), inherited by every route except `/aesthedent-experience`:
- Title: `Aesthedent Dental Clinic — Reclaim Your Smile | Specialist Prosthodontist in Kothrud, Pune` (89 chars — truncates in SERP at ~60)
- Description: `Aesthedent is a specialized Prosthodontist clinic in Kothrud, Pune. Experience expert dental implants, full mouth rehabilitation, and specialist-led clinical care. Reclaim your smile today.` (187 chars — truncates at ~155)

---

## 3. The finding that outranks every bug in the brief

**Every single page component is `'use client'`.**

```
app/page.js                      CLIENT | no metadata
app/about/page.js                CLIENT | no metadata
app/contact/page.js              CLIENT | no metadata
app/doctor/page.js               CLIENT | no metadata
app/services/page.js             CLIENT | no metadata
app/services/[slug]/page.js      CLIENT | no metadata
app/insights/page.js             CLIENT | no metadata
app/insights/[slug]/page.js      CLIENT | no metadata
app/aesthedent-experience/page.js CLIENT | no metadata
```

A client component cannot export `metadata` or `generateMetadata`. Next.js does not warn — it silently emits nothing. Only two files in the entire repo export metadata: `app/layout.tsx` and `app/aesthedent-experience/layout.js`.

The consequence: **every URL on this site except `/aesthedent-experience` serves the byte-identical title and meta description.** All eight service pages, every insight post, `/doctor`, `/contact`, `/services` — one title between them.

This is why Phase 4A ("every page gets a unique title") is not a copywriting task. It is a refactor: each route needs a server wrapper (`layout.js`, or splitting the page into a server shell + client body) before a single unique title can exist. That work has to land before the rewrite, and it is not in the brief's plan.

Related, same root cause:
- **No canonical tag on any page.** `app/aesthedent-experience/layout.js:19` tries: `canonical: 'https://aesthedent.clinic/...'`. That is not a valid Next.js metadata key — canonical must be `alternates: { canonical }`. It is silently dropped. Verified absent from built HTML.
- **No `generateStaticParams`** on either dynamic segment, so all eight service pages — the money pages — are server-rendered on demand (ƒ) instead of prerendered. Slower TTFB, worse crawl economics, no static HTML at the edge.

---

## 4. Bugs from the brief — confirmed, corrected, or wrong

Verified against `.next/server/app/index.html` from a real build.

| # | Claim | Verdict |
|---|---|---|
| 1 | H1 reads `RedefiningRedefining Dental Care in Pune.in Pune.` | **Confirmed.** Actual: `RedefiningRedefiningDental Care in Pune.in Pune.` |
| 1b | Doctor cards duplicated by split-text | **Wrong root cause** — see below |
| 2 | Counters SSR as zero | **Confirmed.** Extracted: `0.0`, `0+`, `0+`, `0%` |
| 3 | Metadata leads with prosthodontist | **Confirmed** (`app/layout.tsx:19`) |
| 4a | `meta-keywords` present | **Confirmed** |
| 4b | `twitter:card` is `summary` | **Confirmed** — emitted by Next as a side effect of `openGraph` being set with no `twitter` block |
| 4c | Footer © 2025 hardcoded | **Confirmed** (`components/layout/Footer.js:164`) |

### Bug 1 — root cause located

`HeroWord` in `app/page.js:156-174` renders the text twice by design:

```jsx
<span className="hero-word-shell" aria-label={text}>
  <span className="sr-only">{text}</span>                 {/* layer 1: readable */}
  <span className="hero-word" aria-hidden="true">          {/* layer 2: per-char */}
    {text.split('').map(char => <span className="hero-char">{char}</span>)}
  </span>
</span>
```

Worth saying plainly: **the accessibility side of this is already correct.** The clone is `aria-hidden`, the readable copy is `sr-only`, and there is an `aria-label`. A screen reader hears it once. The brief's fix requirement ("the cloned layer must be aria-hidden") is already satisfied.

The problem is narrower: Google's text extraction strips tags and concatenates without honouring `aria-hidden`, so the indexed H1 is the doubled string. `Dental Care` is not wrapped in `HeroWord` (it is a plain shimmer span at `app/page.js:469`) which is exactly why it appears once while `Redefining` and `in Pune.` appear twice — that asymmetry confirms the mechanism.

**Second instance:** `app/aesthedent-experience/page.js:62` defines the same component; used at lines 576 and 583 inside an `<h2>`, producing `RECLAIMRECLAIM … SMILESMILE`. Lower impact (h2, secondary page) but same fix.

Those are the only two. `grep` for split-text patterns across `app/` and `components/` returns exactly these two files. No GSAP `SplitText` plugin is used anywhere — this is a hand-rolled equivalent.

### Bug 1b — the brief is wrong about the doctor cards

The doctor names do appear twice in the DOM, but not because of split-text. `app/page.js:806` renders a name card in `hidden sm:block` and `app/page.js:829` renders a second copy in `sm:hidden` — desktop and mobile variants of the same content, both in the DOM, one hidden by CSS at any breakpoint.

Different cause, different fix (render once, reposition with CSS), and materially lower severity — duplicate `<h3>` across breakpoints is a common, largely benign pattern. It should be cleaned up, but it does not belong in the same severity class as the H1.

### Bug 2 — root cause located

`AnimatedStatNumber` (`app/page.js:52-76`) initialises `useState(0)` and only animates from `useInView`, which never fires on the server. SSR therefore emits the initial state. Confirmed in built HTML.

Two things the brief did not flag:

- **`263` IS in the HTML** — it is a static string in the `sub` field (`app/page.js:46`), so the review count already indexes fine. Only the rating and the three counters are zeroed.
- **`5000` is NOT in the HTML at all**, and `aggregateRating` is absent from the JSON-LD.

---

## 5. Structured data — it exists

The brief said to state explicitly if there is none. There is: `app/layout.tsx:68-110`, a single `Dentist` block, homepage only, hardcoded.

**Present and correct:** `@type: Dentist`, name, image, `@id`, url, telephone, full `PostalAddress`, `geo` (18.497271 / 73.813467 — matches the brief), `openingHoursSpecification` correctly excluding Wednesday, `sameAs` → Google Maps.

**Missing:** `aggregateRating` (the single highest-value gap — 263 reviews are invisible to rich results), `priceRange`, `areaServed`, `hasMap`, `medicalSpecialty`, `makesOffer`. No `LocalBusiness`, `MedicalBusiness`, `MedicalProcedure`, `FAQPage`, `Person`, `Review`, or `BreadcrumbList` anywhere on the site.

`FAQPage` is the cheapest win available: `lib/services.js` already contains 3–4 hand-written FAQs per service (28 Q&As total), all unmarked. The content exists; only the markup is missing.

---

## 6. robots / sitemap / noindex

- `public/robots.txt` — clean. `Allow: /`, sitemap declared. No stray blocks.
- `app/sitemap.js` — correct, builds from `services` + `insights` arrays, so it stays in sync automatically. Builds to `/sitemap.xml`.
- **No `noindex` anywhere.** Grepped `app/` and `components/` — no leftover staging blocks. Clean.
- `metadataBase` is set correctly to `https://www.aesthedentpune.com` (`app/layout.tsx:18`).

Sitemap sets `lastModified: new Date()` — every URL claims it was modified at build time. Harmless but it makes the signal worthless to Google.

---

## 7. next.config.js

- No redirects, no rewrites, no i18n.
- `images.remotePatterns` allows `images.pexels.com` only. **Three of eight service pages use Pexels stock photos as their primary image** (`dental-implants`, `root-canal`, `digital-smile-design` — `lib/services.js`). Stock imagery on money pages is an E-E-A-T liability worth raising in Phase 3.
- `output: 'standalone'`, `experimental.optimizeCss: true`, `turbopack: {}`.
- CSP is `frame-ancestors 'self'` only. `Access-Control-Allow-Origin` defaults to `*` — irrelevant to SEO, flagged for the record.

---

## 8. Animation stack

| Component | File | Library | Note |
|---|---|---|---|
| `HeroWord` | `app/page.js:156` | GSAP timeline | **Bug 1, instance 1 — in `<h1>`** |
| `HeroWord` | `app/aesthedent-experience/page.js:62` | GSAP timeline | **Bug 1, instance 2 — in `<h2>`** |
| `AnimatedStatNumber` | `app/page.js:52` | Framer `animate()` | **Bug 2** |
| `TrustStatCard` | `app/page.js:78` | Framer Motion | wraps the above |
| `AnimatedSection` | `components/ui/AnimatedSection.js` | Framer Motion | sitewide scroll reveal |
| `MagneticWrapper`, `HeroParticles` | `components/ui/InteractiveHighTech.js` | Framer Motion | hero |
| `SmoothScrollProvider` | `components/layout/SmoothScrollProvider.js` | Lenis | sitewide |
| `MotionProvider` | `components/layout/MotionProvider.js` | Framer Motion | sitewide |

Payload: `gsap` + `@gsap/react` + `framer-motion` + `lenis` all load sitewide. Quantified against competitors in Phase 3.7.

Credit where due: the homepage hero already handles `prefers-reduced-motion` properly (`app/page.js:199`) — it short-circuits to a static end state. The stat counter does **not**, which is part of Bug 2's fix.

---

## 9. Analytics

- **GTM `GTM-KJC8DRH9`** — present, `app/layout.tsx:42`, `strategy="lazyOnload"` behind `requestIdleCallback` with a 3.5s timeout, plus a `<noscript>` iframe fallback. Deliberately deferred for performance.
- **`pushToDataLayer`** (`lib/gtm.ts`) — wired; homepage fires `home_view` (`app/page.js:189`).
- **Search Console** — no verification file in `public/`, no `google-site-verification` meta. Either unverified or verified by DNS/Analytics, which I can't see from here. **Need access to confirm.**

---

## 10. Other findings the brief did not have

1. **`app/aesthedent-experience/layout.js` points at the wrong domain.** `openGraph.url` and the (dead) canonical both say `https://aesthedent.clinic/...`. The live site is `www.aesthedentpune.com`.
2. **OG and Twitter images on that page are silently dropped.** It uses `openGraph.image` and `twitter.image`; the valid Next.js keys are `images` (plural, array). Wrong key = no tag emitted.
3. **The site contradicts itself on volume, and neither figure is sourced.** Homepage claims `5000+ Happy Patients` (`app/page.js:48`); the experience page's Twitter description claims `500+ successful cases` (`aesthedent-experience/layout.js:16`). Both are unverified; they differ by 10×. Going into `audit/NEEDS-INPUT.md`.
4. **`100% Painless Treatments`** (`app/page.js:49`) is an absolute claim on health content. Needs Dr. Sahil's sign-off or a rewording before it goes anywhere near schema.
5. **Repo first commit: 2026-03-25** — under four months ago. Directly relevant to the Phase 3 verdict. Repo age ≠ domain age ≠ go-live date, which is why I need the real launch date from you.
6. **`.env` is tracked in git.** I checked before raising alarm: `MONGO_URL` is `mongodb://localhost`, no credentials embedded. **Not a breach** — housekeeping only. `.gitignore:84` covers `.env*.local` but not bare `.env`.
7. **`mongodb` is a dependency** and `serverExternalPackages` is configured, but no page reads from it. Dead weight in the bundle graph.

---

## 11. What's missing — consolidated

**Blocking Phase 4:**
- Per-page metadata is architecturally impossible until routes get server wrappers (§3)
- No canonical tags sitewide
- No `generateStaticParams` — service pages render on demand

**Content/schema:**
- No `aggregateRating` — 263 reviews invisible to rich results
- No `FAQPage` despite 28 FAQs already written
- No `MedicalProcedure`, `Person`, `BreadcrumbList`
- No cost/pricing content anywhere (0 of 8 service pages mention INR)
- Service pages ~400–600 words vs the 1200–1800 target
- No location pages, no areas-served block, no before/after gallery
- Doctor page: two thin cards, no BDS/MDS, no registration number, no education

**Housekeeping:**
- `keywords` meta, `twitter:card: summary`, hardcoded © 2025, wrong domain in experience layout, dropped OG/Twitter images

---

## 12. Phase 1 preview

Not yet implemented — Phase 1 begins on your go-ahead. Planned order:

1. H1 split-text (both instances) — clean text in `<h1>`, clone moved outside and kept `aria-hidden`
2. Stat counters — real values in SSR HTML, animate display only, honour `prefers-reduced-motion`
3. Housekeeping — drop `keywords`, `summary_large_image`, dynamic year, fix wrong domain + `images` keys
4. **Recommend pulling forward:** the server/client route split (§3). Bug 3's fix is a per-page metadata rewrite, and there is nowhere to put it until this lands.

Bug 3's copy rewrite stays held for Phase 2 data, per the brief.
