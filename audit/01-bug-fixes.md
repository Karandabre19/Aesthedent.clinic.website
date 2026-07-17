# Phase 1 — Bug Fixes

**Branch:** `seo/phase-1-technical-fixes`
**Build:** green (exit 0, TypeScript clean)
**Automated check:** `node scripts/seo-check.mjs` — **142 assertions across 21 routes, 0 failures** (was 42 failures at baseline)
**Verified in a real browser** against the production build on `next start`, not just against source.

Bug 3 (metadata keyword positioning) remains **held for Phase 4A**, per the brief. Phase 1 fixed the *structure* that makes a rewrite possible; the wording decision waits on Phase 2 volume data.

---

## Method: the check came first

Before changing any code I wrote `scripts/seo-check.mjs`, which reads built HTML from `.next/server/app/*.html` the way a crawler does — strip tags, ignore `aria-hidden`, concatenate. Baseline run: **42 failures**. That's the evidence the bugs were real, in the repo, at commit `dac8a13`.

Two of my own assertions were wrong at first and are worth recording, because both would have made this report a lie:

1. **`\b0\.0` never matched.** Stripped text is `Scroll0.0Google Rating` — `l` and `0` are both word characters, so there is no word boundary. The check reported PASS on a genuinely broken page.
2. **`/0\+\s*Years/` matched the *fix*.** `0+Years` appears inside the correct `10+Years`; same for `0+Happy` in `5000+Happy` and `0%Painless` in `100%Painless`. The check reported FAIL on working code. Fixed with a `(?<![\d.])` lookbehind, then unit-tested both ways — fires on broken text, silent on correct text.

The check is committed and runnable, so these fixes stay fixed.

---

## BUG 1 — Duplicated H1 · **fixed**

### Before (extracted from real build output)
```
<h1> → "RedefiningRedefiningDental Care in Pune.in Pune."
```

### After
```
<h1> → "Redefining Dental Care in Pune."
h1 aria-label → "Redefining Dental Care in Pune."
```

### Root cause
`HeroWord` (`app/page.js:156`) rendered the text twice: an `sr-only` readable copy plus an `aria-hidden` per-character layer for the GSAP reveal. Extractors ignore `aria-hidden`, so both copies were indexed.

Confirmation of the mechanism: `Dental Care` was **not** wrapped in `HeroWord` (it is a plain shimmer span), which is precisely why it appeared once while `Redefining` and `in Pune.` doubled. My check encodes this as a control — `"Dental Care" exactly once` passed at baseline while the other two failed.

### What changed, and a correction to the brief
The brief required the cloned layer be `aria-hidden` and moved outside the `<h1>`. **The clone was already `aria-hidden`, and the accessibility was already correct** — screen readers heard the heading once via `sr-only` + `aria-label`.

Rather than relocate the clone, I **removed it**. There is now exactly one copy of the text (the character spans), and the accessible name lives in `aria-label` on the `<h1>` itself — which is reliable precisely because a heading has a role, unlike the bare `<span>` the old `aria-label` sat on. No clone to move, and one fewer text node in the DOM.

A literal `{' '}` was added between the two block-level hero lines so the text content reads `Redefining Dental Care…` rather than `RedefiningDental Care…`. Whitespace between block boxes is not rendered, so there is no visual change.

**Both instances fixed.** The second was `app/aesthedent-experience/page.js:62`, used inside an `<h2>`:
- Before: `RECLAIMRECLAIM YOUR SMILESMILE`
- After: `RECLAIM YOUR SMILE` (verified in browser; `aria-label="Reclaim your smile"`)

Those are the only two — grep for split-text patterns across `app/` and `components/` returns exactly these files. No GSAP `SplitText` plugin is used anywhere.

### Animation survived — measured, not assumed
| Probe | Result |
|---|---|
| `.hero-char` elements | 18 (10 line-1, 8 line-2) — targets intact |
| `.hero-line-1 .hero-char` computed opacity | `1` (starts at `opacity-0`) |
| computed transform | `matrix(1, 0, 0, 1, 0, 0)` (starts at `translate-y-[1.15em]`) |
| `.sr-only` layers remaining | **0** |

Characters start hidden and offset and end revealed and in place, so the GSAP timeline ran to completion. The fix kept the `.hero-char` class names the timeline targets, which is why nothing else had to move.

---

## BUG 1b — Doctor cards · **fixed, but the brief's diagnosis was wrong**

The names were in the DOM twice, but **not** because of split-text. `app/page.js:806` rendered a `hidden sm:block` overlay and `:829` an `sm:hidden` block — desktop and mobile copies of the same content, one hidden by CSS at any breakpoint. Different cause, different fix, and much lower severity than a garbled H1.

Fixed by rendering each element once and repositioning with responsive utilities (`p-4 … sm:absolute sm:top-6`) instead of duplicating markup. `<h3>` count for doctors went **4 → 2**.

Verified visually at both breakpoints:
- **Desktop (1440px):** name card overlay top, role badge + glass description panel bottom — unchanged from the original design.
- **Mobile (390px):** image, then name, role pill and description below.

One deliberate change: mobile's role now uses the same pill badge as desktop instead of plain uppercase text. Unifies the treatment; flag it if you want the old mobile styling back.

---

## BUG 2 — Counters render as zero · **fixed**

### Before
```
0.0  Google Rating   263 Reviews
0+   Years Experience
0+   Happy Patients
0%   Painless Treatments
```

### After (SSR HTML, extracted from build)
```
5.0  Google Rating   263 Reviews
10+  Years Experience
5000+ Happy Patients
100% Painless Treatments
```

### Root cause
`AnimatedStatNumber` (`app/page.js:52`) used `useState(0)` and only animated on `useInView`, which never fires on the server — so the initial state is what shipped.

Two details the brief did not have:
- **`263` was already in the HTML** (a static string in the `sub` field), so the review count always indexed fine. Only the rating and the three counters were zeroed.
- **`5000` appeared nowhere** in the HTML before this fix.

### The fix, and a bug I introduced and caught
Seeded state with the real value so SSR ships it, and drop to 0 only when the count-up actually starts.

My first attempt reset to `0` in a `useLayoutEffect` on mount. It passed every HTML assertion — the SSR output was correct — but browser testing at 390px showed stats 3 and 4 **stuck at `0+` and `0%`**. They were below the fold, so `useInView` never fired; the reset ran anyway and the animation never did. They would have sat at zero until the user scrolled.

Moving the reset inside the `isInView` effect fixes it: off-screen stats keep their real value until they scroll into view, and hold it permanently if JS never runs. **This bug was invisible to the HTML check and only surfaced by driving the real page.**

### Verified in the browser (production build)
Recorded every distinct value from before page scripts ran:

| Time | Displayed |
|---|---|
| 34ms | `5.0 \| 10+ \| 5000+ \| 100%` ← real values painted from SSR |
| 415ms | `0.0 \| 0+ \| 0+ \| 0%` ← hydration lands, count-up starts |
| 615–635ms | `0.1 … 0.2 … 0.4` ← counting |
| 2416ms | `5.0 \| 10+ \| 5000+ \| 100%` ← settled |

**228 distinct states** — the animation is intact.

**`prefers-reduced-motion: reduce`** (emulated on the same build): **1 distinct state**. The value never changes from the real one — no reset, no animation, no flash. Hero text also renders immediately.

### Honest tradeoff — your call
There is now a **~380ms window where the real value is visible before the count-up restarts from 0**. This is unavoidable: the browser paints server HTML before React hydrates, so any "real value in HTML + animate from zero" design flashes. The options:

1. **Current:** real value → brief pause → count up from 0. SEO correct, animation preserved.
2. Drop the count-up on first load; animate only on scroll-in. No flash, less delight.
3. Revert to counting from 0 — reintroduces a 0.0-rated clinic in the index. **Not recommended.**

I chose (1) because it satisfies the brief. Say the word if the flash bothers you.

---

## BUG 4 — Housekeeping · **fixed**

| Item | Before | After |
|---|---|---|
| `meta keywords` | present on every page | removed |
| `twitter:card` | `summary` | `summary_large_image` |
| Footer copyright | hardcoded `© 2025` | `{new Date().getFullYear()}` |
| Experience page domain | `https://aesthedent.clinic` (**not our domain**) | `https://www.aesthedentpune.com` |
| Experience `openGraph.image` | invalid key — silently dropped | `openGraph.images` (array) |
| Experience `twitter.image` | invalid key — silently dropped | `twitter.images` (array) |
| Experience `canonical` | top-level key — **never emitted** | `alternates.canonical` |

On `twitter:card`: I was sceptical this claim was accurate, since the root layout has no `twitter` block at all and Next doesn't normally invent one. Checked the built HTML — it was real. Next emits `summary` as a side effect of `openGraph` being set without a `twitter` block. Confirmed, not assumed.

Also removed: the `500+ successful cases` claim in the experience page's Twitter description. It contradicted the homepage's `5000+ Happy Patients` by 10×, and neither is sourced (`NEEDS-INPUT.md` N4/N5). It is not replaced with another number until someone confirms one.

---

## The refactor — approved and shipped

The Phase 0 blocker: every page was `'use client'`, so no route could export metadata, and **all nine served an identical title**.

Each route is now a **server shell** that exports metadata and renders the client body:

```
app/page.js          (server: metadata + canonical)  → app/HomeClient.js
app/about/page.js                                    → app/about/AboutClient.js
app/contact/page.js                                  → app/contact/ContactClient.js
app/doctor/page.js                                   → app/doctor/DoctorClient.js
app/services/page.js                                 → app/services/ServicesClient.js
app/services/[slug]/page.js  (+generateMetadata      → .../ServiceDetailClient.js
                              +generateStaticParams)
app/insights/page.js                                 → app/insights/InsightsClient.js
app/insights/[slug]/page.js  (+both)                 → .../InsightDetailClient.js
```

Moved with `git mv`, so history is preserved. Client components now receive a resolved `slug` prop instead of unwrapping `params` themselves.

### Result 1 — every route has a unique title under 60 chars

| Route | Title | Len |
|---|---|---|
| `/` | Dental Clinic in Kothrud, Pune \| Aesthedent | 43 |
| `/about` | About Our Clinic \| Aesthedent | 29 |
| `/contact` | Contact Us — Kothrud, Pune \| Aesthedent | 41 |
| `/doctor` | Our Dentists in Kothrud \| Aesthedent | 36 |
| `/services` | Dental Services in Kothrud \| Aesthedent | 39 |
| `/insights` | Dental Insights & Advice \| Aesthedent | 41 |
| `/aesthedent-experience` | The Aesthedent Experience \| Kothrud, Pune | 41 |
| `/services/dental-implants` | Dental Implants in Kothrud, Pune \| Aesthedent | 45 |
| `/services/full-mouth-rehabilitation` | Full Mouth Rehabilitation in Kothrud, Pune \| Aesthedent | 55 |
| `/insights/root-canal-pain-myths` | Is root canal treatment painful? \| Aesthedent | 45 |

A `title.template` of `'%s | Aesthedent'` on the root keeps the brand **last, never first**, per the Phase 4A rule.

**All wording is provisional.** Phase 4A rewrites it once Phase 2 confirms whether "Prosthodontist" really is near-zero volume. These titles deliberately do not pre-empt that call — they are descriptive and location-bearing, not strategic.

The expanded check immediately earned its keep: it caught `/insights/dental-implants-pune-specialist` at **66 chars**. Rather than degrade a good headline, I added an optional `metaTitle` field used for `<title>` only; the article keeps its editorial title.

### Result 2 — a site-killing bug I introduced and caught

My first pass put `alternates: { canonical: '/' }` on the **root layout**. Child routes inherit root metadata, so **every page canonicalised to the homepage** — an explicit instruction to Google to de-index the entire site. My check said "has canonical" and passed, because it only tested *presence*.

Fixed twice over: the root layout no longer declares a canonical (with a comment explaining why), each route declares its own, and **the check now asserts the canonical's value equals the route's own URL**. All 21 routes verified self-referencing.

This is the single most dangerous thing that happened this phase, and presence-only checking hid it.

### Result 3 — the money pages are now prerendered

`generateStaticParams` on both dynamic segments flipped them from **ƒ Dynamic → ● SSG**:

```
● /services/[slug]     8 pages prerendered
● /insights/[slug]     6 pages prerendered
```

All eight commercial service pages are now static HTML at build time instead of server-rendered on every request.

---

## Found while verifying — reported, not fixed

### 1. The hero background animation has never run
GSAP logs `target .hero-bg-image not found`. On `main`, `.hero-bg-image` appears **5 times — every one a GSAP selector string, never a `className`**. The element never existed, so the hero's load zoom (`scale 1.08 → 1`) and ambient drift have been dead since launch.

One-line fix (add the class to the `<Image>`), **not applied**: enabling an animation that has been off since launch is a visible change to the hero, and that's your design call, not mine. Say the word.

### 2. Every page links to two 404s
The sitewide footer links to `/privacy` and `/terms`. **Neither route exists.** Every page on the site points at two broken URLs. Real legal content is needed — added to Phase 4D and `NEEDS-INPUT.md`.

### 3. Insights have two sources of truth
Article bodies live in an `insightsData` object inside `InsightDetailClient.js`, separate from `lib/insights.js` (which drives the sitemap). The slug lists agree **today** — I checked, no live 404s. But adding an insight to the lib without adding a body would put a URL in the sitemap that renders "not found". Flagged in code; consolidating is a Phase 4 job.

### 4. Sitemap `lastModified` is meaningless
`app/sitemap.js` sets `lastModified: new Date()`, so every URL claims modification at build time. Harmless, but the signal is worthless to Google. Worth wiring to real dates.

---

## What is still open

- **Bug 3** — metadata keyword positioning. Held for Phase 4A pending Phase 2 data, as instructed.
- **`5.0` rating and `263` reviews** are still unverified (`NEEDS-INPUT.md` N1/N2). They now render in SSR HTML, which makes verifying them more urgent, not less. **They are deliberately NOT in `aggregateRating` yet** — schema states a fact to Google, and I will not put an unverified number there. Phase 2B reads the real values; Phase 4E ships the schema.
- **`100% Painless Treatments`** and **`10+ Years`** remain unsourced and now ship in HTML. Recommend rewording the absolute painless claim regardless of what Phase 2 finds.

## Files changed

```
app/layout.tsx                                  metadata: keywords out, twitter card, title template
app/page.js                          NEW        server shell
app/HomeClient.js                    (moved)    HeroWord, AnimatedStatNumber, doctor cards
app/about|contact|doctor|services|insights/page.js   NEW  server shells
app/{about,contact,doctor,services,insights}/*Client.js  (moved)
app/services/[slug]/page.js          NEW        generateMetadata + generateStaticParams
app/services/[slug]/ServiceDetailClient.js      (moved) takes slug prop
app/insights/[slug]/page.js          NEW        generateMetadata + generateStaticParams
app/insights/[slug]/InsightDetailClient.js      (moved) takes slug prop
app/aesthedent-experience/layout.js             domain, images keys, canonical
app/aesthedent-experience/page.js               HeroWord dedupe
components/layout/Footer.js                     dynamic year
lib/insights.js                                 optional metaTitle
scripts/seo-check.mjs                NEW        142 assertions, 21 routes
```

## Reproduce

```bash
npm run build && node scripts/seo-check.mjs   # → 142 passed, 0 failed
```
