# Phase 4 - Content & Local SEO Spine

**Date:** 2026-08-03 · **Mode:** READ-ONLY. Nothing was changed. No code touched.
**Status:** proposal awaiting your approval. Prompt 2 does not exist until you sign this off.

Every route figure below (words, in-links, depth, indexation) is carried from
`audit/A-repo-reverse-engineering.md` §A2/§A3 and `audit/02-serp-positions.md`,
both measured from built HTML - not re-estimated here. Anything I could not
ground is marked `[NEEDS-INPUT]` and collected in §8.

---

## 0. Three things you should read before the tables

**0.1 - The positioning change costs us the Tier-1 term in the H1, and that is fine.**
The approved hero H1 is *"The dentist that takes the fear away."* It contains neither
"dentist in Kothrud" nor "dental clinic". Phase 4A had deliberately rewritten the H1 to
`Dental Care in Kothrud, Pune. Redefined.` precisely to get those terms into it
(`NEEDS-INPUT.md` D7). So this is a real trade, not a free one.

I think the trade is correct and I have planned around it: the `<title>` stays keyword-first
and unchanged (already Googlebot-verified), the approved sub-line carries
*"Kothrud's specialist prosthodontist-led clinic"* one element below the H1, and §7 puts
"dental clinic in Kothrud" into an H2 in the trust bar. Google reads all of these. What it
buys is the one thing no competitor on the list has: a differentiated first line. **No action
needed from you - flagging it so the trade is on the record, not so you reconsider it.**

**0.2 - The single highest-leverage change in this document is one title.**
`/aesthedent-experience` is **one of only three indexed pages on the site**, and its title is
`The Aesthedent Experience | Kothrud, Pune` - brand-first, for a brand term with effectively
no search volume. We are spending one third of our entire index presence on a query nobody
types. §5 revises it to `Specialist Dental Treatments in Kothrud | Aesthedent`. That is a
metadata edit to an already-crawled page, which is the fastest-acting change available to us.

**0.3 - This spine cannot fix the indexation problem, and is not trying to.**
`C-synthesis.md` is unambiguous: the 18 unindexed pages have `Last crawled: N/A` - Google has
never fetched them, so no on-page change can be evaluated by Google yet. Content work here is
**preparation for the crawl, plus the one lever we do control**: routing internal equity from
the 3 crawled pages into the 18 (§6). Nothing in this document should be sold to you as a fix
for crawl-demand starvation. That remains off-site and time.

---

## 1. Route inventory - all 21

★ = indexed by Google (3 of 21). Words / In-links / Depth from `A-repo-reverse-engineering.md` §A2–A3.

| # | Route | Current `<title>` (rendered) | Current H1 | Words | In-links | Primary topic | **The ONE keyword it should own** |
|---|---|---|---|---:|---:|---|---|
| 1 | **`/`** ★ | Dentist in Kothrud, Pune \| Aesthedent Dental Clinic | Dental Care in Kothrud, Pune. Redefined. → *becoming* "The dentist that takes the fear away." | 1171 | 21 | Clinic homepage | **dentist in kothrud** |
| 2 | **`/aesthedent-experience`** ★ | The Aesthedent Experience \| Kothrud, Pune | Specialized **Unique** Treatments. | 1454 | **1** | Specialist treatment portfolio | **specialist dentist kothrud** |
| 3 | **`/services/dentures`** ★ | Specialist Grade Dentures in Kothrud, Pune \| Aesthedent | Specialist Grade Dentures | 458 | 21 | Dentures | **dentures in kothrud** |
| 4 | `/services` | Dental Treatments in Kothrud, Pune \| Aesthedent | Our Dental Services | 412 | 21 | Treatment hub | **dental treatments in kothrud** |
| 5 | `/services/dental-implants` | Dental Implants in Kothrud, Pune \| Aesthedent | Dental Implants | 468 | 21 | Implants | **dental implant kothrud** |
| 6 | `/services/root-canal` | Root Canal Treatment in Kothrud, Pune \| Aesthedent | Root Canal Treatment | 455 | 21 | RCT | **root canal kothrud** |
| 7 | `/services/full-mouth-rehabilitation` | Full Mouth Rehabilitation in Kothrud, Pune \| Aesthedent | Full Mouth Rehabilitation | 456 | 21 | FMR | **full mouth rehabilitation pune** |
| 8 | `/services/orthodontic-treatment` | Orthodontic Treatment in Kothrud, Pune \| Aesthedent | Orthodontic Treatment | 452 | 21 | Braces / aligners | **braces kothrud** |
| 9 | `/services/wisdom-tooth-surgery` | Wisdom Tooth Surgery in Kothrud, Pune \| Aesthedent | Wisdom Tooth Surgery | 429 | 21 | Third molars | **wisdom tooth removal kothrud** |
| 10 | `/services/tooth-fillings` | Tooth Colored Fillings in Kothrud, Pune \| Aesthedent | Tooth Colored Fillings | 446 | 21 | Fillings | **tooth filling kothrud** |
| 11 | `/services/digital-smile-design` | Digital Smile Design in Kothrud, Pune \| Aesthedent | Digital Smile Design | 455 | 21 | DSD | **digital smile design pune** |
| 12 | `/doctor` | Dentists in Kothrud, Pune - Our Team \| Aesthedent | Top Dentists in Kothrud, Pune – Our Team | 641 | 21 | The two dentists | **prosthodontist kothrud** |
| 13 | `/about` | Dental Clinic in Kothrud - About Us \| Aesthedent | We explain **everything** before we start. | 589 | 21 | Clinic philosophy | **dental clinic in kothrud** |
| 14 | `/contact` | Contact Our Dentist in Kothrud, Pune \| Aesthedent | Get in Touch | 339 | 21 | NAP / directions | **dentist near me kothrud** |
| 15 | `/insights` | Dental Advice from Our Kothrud Dentists \| Aesthedent | Insights | 446 | 21 | Article hub | *(hub - no money term)* |
| 16 | `/insights/dental-implants-pune-specialist` | Why a Prosthodontist for Dental Implants? \| Aesthedent | Why choose a Prosthodontist for your Dental Implants? | 508 | 1 | Specialist rationale | **prosthodontist vs dentist for implants** |
| 17 | `/insights/root-canal-pain-myths` | Is root canal treatment painful? \| Aesthedent | Is root canal treatment painful? | 469 | 8 | RCT pain | **is root canal painful** |
| 18 | `/insights/best-dentist-kothrud-pune` | How to find a good dentist in Kothrud \| Aesthedent | How to find a good dentist in Kothrud | 429 | 8 | Choosing a dentist | **how to choose a dentist** |
| 19 | `/insights/teeth-whitening-safety` | Is teeth whitening safe for your enamel? \| Aesthedent | Is teeth whitening safe for your enamel? | 425 | 2 | Whitening safety | **is teeth whitening safe** |
| 20 | `/insights/dental-anxiety-tips` | Afraid of the dentist? Here is how we help \| Aesthedent | Afraid of the dentist? Here is how we help | 436 | 1 | Dental anxiety | **dental anxiety** |
| 21 | `/insights/when-to-get-braces` | When is the right time to get braces? \| Aesthedent | When is the right time to get braces? | 462 | 1 | Braces timing | **when to get braces** |

### 1.1 Weak H1s (7 of 21)

These carry no keyword and no positioning. They are the cheapest wins in the document:

| Route | H1 today | Problem |
|---|---|---|
| `/contact` | "Get in Touch" | Zero terms. Generic. |
| `/insights` | "Insights" | Zero terms. One word. |
| `/services` | "Our Dental Services" | No location. |
| `/aesthedent-experience` | "Specialized Unique Treatments." | No location, no service noun. **On an indexed page.** |
| `/services/*` ×8 | bare service name (`Dental Implants`) | No location, while the `<title>` has it - H1 and title should mirror (`03-gap-analysis.md` §3.2). |

### 1.2 Cannibalisation - 5 real collisions

| # | Pages | Competing for | Severity | Resolution |
|---|---|---|---|---|
| **C1** | `/insights/best-dentist-kothrud-pune` **vs** `/` | *dentist in kothrud* / *best dentist kothrud* | **High** - an informational article is aimed squarely at our #1 money term, and its slug bakes it in | Slug stays (hard rule). Retitle the article to the **choosing** intent (§5), strip "best dentist in Kothrud" phrasing from its body, and add an in-body link to `/` with anchor *"dental clinic in Kothrud"*. Article funnels; homepage converts. |
| **C2** | `/insights/dental-implants-pune-specialist` **vs** `/services/dental-implants` **vs** `/doctor` | *prosthodontist* + *dental implants pune* | **High** - three pages, one concept | Split by intent: `/doctor` owns **prosthodontist kothrud** (who), `/services/dental-implants` owns **dental implant kothrud** (what/cost), the article owns **prosthodontist vs dentist for implants** (why). Article links to both. |
| **C3** | `/insights/when-to-get-braces` **vs** `/services/orthodontic-treatment` | *braces* | Medium | Article = timing/age (informational). Service = **braces kothrud** (commercial). Article must not carry "braces in Kothrud" in title or H1. |
| **C4** | `/insights/root-canal-pain-myths` **vs** `/services/root-canal` | *painless root canal* | Medium | Service `shortDesc` currently says "painless RCT" - that also conflicts with the N6/N7 rewording already done. Move the entire pain conversation to the article; service page keeps clinical scope. |
| **C5** | `/aesthedent-experience` **vs** `/services` **vs** `/about` | *specialist / treatments / how we work* | **High, and delicate** - one of the three is indexed | `/aesthedent-experience` = **specialist-led treatment showcase** (implants + FMR depth). `/services` = **catalogue hub** (all 8, shallow). `/about` = **the fear wedge / how we work**. Titles in §5 enforce the split. |

**Not cannibalisation, but noted:** `/insights/teeth-whitening-safety` targets whitening, and **there is no whitening service page** - the article is an orphan pointing at an offer we do not document. See §3.2.

---

## 2. Keyword → URL map

Rule applied throughout: **every term maps to exactly one existing URL.** Where a term had no
home, the fix is content on an existing page. Two terms could not be solved that way; they are
in §3 for your decision, not assumed.

### Tier 1 - money terms

| Keyword | Owner URL | Currently indexed? | How it is won |
|---|---|---|---|
| **dentist in kothrud** | `/` | ★ yes | `<title>` already keyword-first (verified - do not touch). Trust-bar H2 and §7 sections carry it in body. Hero H1 no longer does; §0.1. |
| **dental clinic in kothrud** | `/about` | no | Title already leads with it. Needs the term in H1 + first paragraph, which currently open on "We explain everything". |
| **dentist near me kothrud** | `/contact` | no | "Near me" is resolved by Google Business Profile, not by copy. The page's job is corroboration: address, landmarks, Paud Road/Karve Nagar approach directions, hours. `03-gap-analysis.md` §3.5 shows GBP already ranks 2–3 for the local pack; this page must not contradict it. |

> **Honest note:** `/about` is not indexed and, per `C-synthesis.md`, may not be crawled for
> months. Assigning our #2 money term to an uncrawled page is a bet on §6 working. If you would
> rather `/` carry both Tier-1 terms until the crawl arrives, say so - it is a one-line change to
> the trust-bar H2 and I'll re-cut §7.

### Tier 2 - service + local

| Keyword | Owner URL | Homeless today? |
|---|---|---|
| dental implant kothrud | `/services/dental-implants` | no |
| root canal kothrud | `/services/root-canal` | no |
| braces kothrud | `/services/orthodontic-treatment` | no |
| wisdom tooth removal kothrud | `/services/wisdom-tooth-surgery` | no |
| tooth filling kothrud | `/services/tooth-fillings` | no |
| dentures in kothrud | `/services/dentures` ★ | no |
| dental treatments in kothrud | `/services` | no |
| **dental implant cost pune** | `/services/dental-implants` - **new cost section, existing URL** | **YES - zero INR exists anywhere in 21 routes** (`03-gap-analysis.md` §3.4). **BLOCKED on `NEEDS-INPUT` P1–P12.** |

**On `dental implant cost pune`:** `03-gap-analysis.md` §3.1 previously floated a **new**
`/dental-implant-cost-pune` URL. I am overruling that here, per your hard rule and because the
cheaper option was never tested: a cost section on `/services/dental-implants` serves the same
intent on a page that already exists, already has 21 in-links, and already carries
`MedicalProcedure` + `FAQPage` schema. If it demonstrably fails to rank after the page is
crawled and the pricing is live, *then* a dedicated URL is worth asking you about. Not before.

### Tier 3 - defensible

| Keyword | Owner URL | Why this page |
|---|---|---|
| **prosthodontist kothrud** | `/doctor` | The query wants a *person*, not a procedure. Soulful's per-doctor pages are what rank for practitioner queries (`03-gap-analysis.md` §3.4). **Blocked on `NEEDS-INPUT` C1–C7** - we cannot claim a specialism without the MDS and Council registration to back it. |
| **full mouth rehabilitation pune** | `/services/full-mouth-rehabilitation` | Already correct. Note the term is *Pune*-level, not Kothrud - FMR patients travel; §4 handles this. |
| **digital smile design pune** | `/services/digital-smile-design` | Already correct. Also `Pune`-level. **`NEEDS-INPUT` C9** - the page presents DSD as a branded protocol with no named certification. |

**The strategic point about Tier 3:** these are the only three terms where being a
prosthodontist-led clinic is a *structural* advantage rather than a marketing line. The
national chains (Sabka, Clove) and the aggregators (Practo, JustDial) that own Tier 1 do not
compete meaningfully on full-mouth rehabilitation. **Tier 3 is where this site can actually
win first**, and it is the reason §6 pushes equity toward FMR and the doctor page.

---

## 3. Terms with no home

### 3.1 Solved with content on an existing page - no approval needed
- `dental implant cost pune` → cost section on `/services/dental-implants` (blocked on P1–P12).
- `emergency dentist kothrud` / `dentist open sunday kothrud` → `/contact`. The clinic is open
  weekends and closed Wednesday, which is a genuine differentiator currently stated only as
  hours data. Becomes a sentence. **`NEEDS-INPUT` B1** - is Wednesday fully closed or
  emergency-only? I will not write "emergency care available" without that answer.
- `prosthodontist vs dentist` → already `/insights/dental-implants-pune-specialist`.

### 3.2 Needs your decision - I am not proceeding on these

**① Teeth whitening has an article but no service.**
`/insights/teeth-whitening-safety` (425 words, 2 in-links) discusses whitening; there is no
`/services/teeth-whitening`. Three options, and I am not picking for you because two of them
create a URL:
- **(a)** Leave it. The article stands alone as informational content. Zero risk. Zero gain.
- **(b)** Add whitening to `/services/digital-smile-design` as a section. No new URL. Muddies a
  Tier-3 page that is currently clean.
- **(c)** New URL `/services/teeth-whitening`. **Requires your approval per the hard rule.**
  Consistent with the existing pattern, but adds a 22nd uncrawled page to a site where 18 are
  already starved - which argues against it until crawl demand improves.
  *My recommendation: (a) now, revisit after indexation recovers.*

**② Per-doctor pages.**
`03-gap-analysis.md` §3.4 identifies these as the largest page-inventory gap, and Soulful ranks
with them. They would be **new URLs** (`/doctor/dr-sahil-wathodkar`). **Requires your approval,
and is blocked on `NEEDS-INPUT` C1–C7 regardless.** Not planned here.

**③ Area landing pages - recommended AGAINST.**
`/dentist-in-karve-nagar` and similar. This is exactly the thin-content pattern the brief warns
about, `NEEDS-INPUT` B3 has not confirmed the areas reflect real patient origin, and it would
multiply uncrawled pages. §4 gets the local relevance into existing pages instead. **Raising it
only to close it off explicitly.**

---

## 4. Local relevance layer

**Method, stated so you can check it:** the clinic is at AJ Tower, Dahanukar Colony, Kothrud
411038 (from `/contact` metadata). Assignments below reason from **travel behaviour by treatment
type** - urgent/painful treatments are chosen by proximity, high-consideration and multi-visit
treatments draw from further out - combined with each area's position relative to the clinic.

**This is inference about how patients travel, not a claim about where our patients come from.**
`NEEDS-INPUT` **B3** must confirm the catchment before any of this ships. If B3 comes back
different, the reasoning framework survives and only the area names change.

| Service | Areas to name | Why these, specifically |
|---|---|---|
| **Root canal** | Kothrud, **Paud Road**, Karve Nagar | Pain-driven and same-day. Nearest credible clinic wins; nobody crosses Pune with an abscess. Paud Road is the artery patients describe their location by. |
| **Tooth fillings** | Kothrud, Paud Road | Routine, single-visit, lowest consideration. Pure convenience radius. |
| **Wisdom tooth surgery** | Kothrud, Karve Nagar, Warje | Semi-urgent, and patients are usually driven home afterwards - the accompanying-person logistics make short trips matter. |
| **Orthodontics / braces** | Kothrud, Karve Nagar, Erandwane | 18–24 months of **monthly** visits, often fitted around school or work. Cumulative travel is the real cost; this is the strongest honest local argument on the site. |
| **Dentures** ★ | Deccan, Erandwane, Kothrud | Older established residential areas. Denture patients skew older, frequently accompanied, and need several fitting appointments. **This page is indexed - its local copy will be read first.** |
| **Dental implants** | Bavdhan, Warje, Kothrud | High-consideration surgical treatment; patients research and travel for a specialist. Bavdhan and Warje are realistic outer catchment via Chandani Chowk and the Warje flyover. |
| **Full mouth rehabilitation** | Bavdhan, Erandwane, Deccan | Highest consideration on the site, staged over months. Patients select on specialism, not distance - which is exactly why this page should read Pune-wide with Kothrud as the anchor, not Kothrud-only. |
| **Digital smile design** | Deccan, Erandwane, Bavdhan | Elective and aesthetic. Discretionary-spend areas; the same Pune-wide logic as FMR. |

### 4.1 How this must be written

Natural sentence, inside existing prose:
> *"Most of our orthodontic patients come from Kothrud and Karve Nagar, and because braces mean
> a check-up roughly every month for a year and a half, being ten minutes away matters more than
> people expect."*

Never a list, never a footer strip, never:
> ~~*"Serving Kothrud, Karve Nagar, Deccan, Erandwane, Warje, Bavdhan and Paud Road."*~~

**Hard ceiling: two area names per page, in body prose, once each.** Seven pages each naming two
areas gives the site full coverage of all seven areas without any single page looking optimised.
`/contact` is the one exception - directions legitimately name several.

---

## 5. Metadata table - all 21

`app/layout.tsx` appends the template `%s | Aesthedent` (**13 characters**). So a child title
must be **≤ 47 chars** to render under 60. "Rendered" below is the full string Google sees.
Rows marked **KEEP** are Googlebot-verified per your brief and are not being touched.

| # | Route | Proposed title (child value) | Rendered | Meta description (<155) | Proposed H1 |
|---|---|---|---:|---|---|
| 1 | `/` ★ | *(absolute)* Dentist in Kothrud, Pune \| Aesthedent Dental Clinic - **KEEP** | 51 | **KEEP** current | **The dentist that takes the fear away.** *(approved)* |
| 2 | `/aesthedent-experience` ★ | *(absolute)* **Specialist Dental Treatments in Kothrud \| Aesthedent** | **52** | Implants and full mouth rehabilitation in Kothrud, planned by a specialist prosthodontist. We explain every step before we start. | **Specialist-led dental treatments in Kothrud, Pune** |
| 3 | `/services/dentures` ★ | Dentures in Kothrud, Pune | 38 | Full and partial dentures in Kothrud, fitted by a prosthodontist. We talk you through every stage before anything begins. | **Dentures in Kothrud, Pune** |
| 4 | `/services` | Dental Treatments in Kothrud, Pune - **KEEP** | 47 | **KEEP** current | **Dental treatments in Kothrud, Pune** |
| 5 | `/services/dental-implants` | Dental Implants in Kothrud, Pune - **KEEP** | 45 | Dental implants in Kothrud, placed and planned by a specialist prosthodontist. We explain the whole plan, and the cost, before we start. | **Dental implants in Kothrud, Pune** |
| 6 | `/services/root-canal` | Root Canal Treatment in Kothrud, Pune - **KEEP** | 50 | Root canal treatment in Kothrud. If the fear is what has kept you away, tell us - we explain each step and stop whenever you raise your hand. | **Root canal treatment in Kothrud, Pune** |
| 7 | `/services/full-mouth-rehabilitation` | Full Mouth Rehabilitation in Pune | 46 | Full mouth rehabilitation in Pune, planned by a prosthodontist and staged over months so you always know what happens next. | **Full mouth rehabilitation in Pune** |
| 8 | `/services/orthodontic-treatment` | Braces & Aligners in Kothrud, Pune | 47 | Braces and clear aligners in Kothrud. Monthly visits close to home, and a plan you understand before the first bracket goes on. | **Braces and aligners in Kothrud, Pune** |
| 9 | `/services/wisdom-tooth-surgery` | Wisdom Tooth Removal in Kothrud, Pune | 50 | Wisdom tooth removal in Kothrud. We show you the X-ray, explain what we are doing and why, and keep discomfort to a minimum. | **Wisdom tooth removal in Kothrud, Pune** |
| 10 | `/services/tooth-fillings` | Tooth Coloured Fillings in Kothrud | 47 | Tooth-coloured fillings in Kothrud, Pune. Conservative, tooth-matched restorations, explained before we pick up an instrument. | **Tooth-coloured fillings in Kothrud, Pune** |
| 11 | `/services/digital-smile-design` | Digital Smile Design in Pune | 41 | Digital Smile Design in Pune - see your smile planned on screen and agree it before any treatment is carried out. | **Digital Smile Design in Pune** |
| 12 | `/doctor` | Prosthodontist & Dentists in Kothrud | 49 | Meet the dentists at Aesthedent, Kothrud: Dr. Sahil Wathodkar, prosthodontist and founder, and Dr. Aishwarya Kulkarni, dental surgeon. | **Prosthodontist and dentists in Kothrud, Pune** |
| 13 | `/about` | Dental Clinic in Kothrud - How We Work | 51 | A dental clinic in Kothrud, Pune for people who would rather not be here. We explain everything before we start, and stop when you ask. | **A dental clinic in Kothrud for people who dread the dentist** |
| 14 | `/contact` | Dental Clinic Address in Kothrud, Pune | 51 | Aesthedent, AJ Tower, Dahanukar Colony, Kothrud, Pune 411038. Open 10am–8pm including weekends, closed Wednesday. Call +91 93098 16336. | **Visit our dental clinic in Kothrud, Pune** |
| 15 | `/insights` | Dental Advice from Kothrud Dentists | 48 | Straight answers to what patients actually ask us - root canals, implants, braces and being frightened of the dentist. | **Dental advice from our dentists in Kothrud** |
| 16 | `/insights/dental-implants-pune-specialist` | Why a Prosthodontist for Implants? - **KEEP*** | 47 | What a prosthodontist does that a general dentist does not, and why it changes the outcome of an implant. | **Why choose a prosthodontist for your dental implants?** |
| 17 | `/insights/root-canal-pain-myths` | Is a Root Canal Painful? - **KEEP*** | 37 | What a root canal actually feels like now, why the reputation is forty years out of date, and what we do for anxious patients. | **Is root canal treatment painful?** |
| 18 | `/insights/best-dentist-kothrud-pune` | How to Choose a Dentist in Kothrud | 47 | What to look at when choosing a dentist, the questions worth asking, and the answers that should make you walk away. | **How to choose a dentist in Kothrud** |
| 19 | `/insights/teeth-whitening-safety` | Is Teeth Whitening Safe for Enamel? | 48 | Professional whitening versus home kits, what the evidence says about enamel, and when a dentist will tell you not to. | **Is teeth whitening safe for your enamel?** |
| 20 | `/insights/dental-anxiety-tips` | Afraid of the Dentist? How We Help | 47 | What we actually do for frightened patients - the raise-your-hand signal, narrated treatment, and appointments that stop when you need them to. | **Afraid of the dentist? Here is how we help** |
| 21 | `/insights/when-to-get-braces` | When Is the Right Time for Braces? | 47 | Age, timing and what to expect from orthodontic treatment at different life stages - for children, teenagers and adults. | **When is the right time to get braces?** |

`*` = shortened from current for margin, not repositioned.
**All 21 titles verified unique.** No two share a head term (C1–C5 resolved).

### 5.1 Changes that touch shared data, not just metadata
Three of these edit `lib/services.js` `title`, which drives the H1, the `<title>`, the nav
dropdown and every card label simultaneously:
- `"Specialist Grade Dentures"` → `"Dentures"` - **on our indexed page.** "Specialist Grade" is
  an unsourced quality claim, and nobody searches it.
- `"Tooth Colored Fillings"` → `"Tooth-Coloured Fillings"` - Indian English.
- `"Orthodontic Treatment"` → `"Braces & Aligners"` - matches how patients search; "orthodontic
  treatment" is clinician vocabulary.

Flagging because the blast radius is wider than a metadata edit, though it is still content-only.

---

## 6. Internal-link plan

**This is the only lever in this document that acts on the actual problem.** `A3` measured what
the 3 indexed pages currently link *out* to, and it is remarkably little:

| Indexed page | Currently links out to | Gap |
|---|---|---|
| `/` | `/aesthedent-experience`, `/services`, `/doctor`, `/contact`, + `services.slice(0,6)` | **Omits `dentures` (7th) and `digital-smile-design` (8th) entirely.** No links to `/about`, `/insights`, or any article. |
| `/aesthedent-experience` | **2 service pages only** (`isFeatured` = implants + FMR), anchor text **"Know More"** | **The largest untapped asset on the site.** 1454 words, indexed, and it links to nothing else - not `/services`, `/doctor`, `/about`, `/contact`, `/insights`, nor 6 of 8 services. |
| `/services/dentures` | `/services` + 3 "Other Services" cards | Card links, generic anchors. No link to `/doctor` despite dentures being the most prosthodontist-dependent treatment on the site. |

### 6.1 Priority A - from the 3 indexed pages into the 18 (do first)

| From | To | Anchor text | Placement |
|---|---|---|---|
| `/aesthedent-experience` | `/doctor` | *prosthodontist in Kothrud* | In the existing "Prosthodontist Specialist Portfolio" intro prose. **Highest-value single link in the plan** - exact-match anchor from an indexed page into the Tier-3 owner. |
| `/aesthedent-experience` | `/services/dentures` ★ | *dentures fitted by a prosthodontist* | Existing treatment-portfolio copy |
| `/aesthedent-experience` | `/services/root-canal` | *root canal treatment in Kothrud* | Existing copy |
| `/aesthedent-experience` | `/services/orthodontic-treatment` | *braces and aligners* | Existing copy |
| `/aesthedent-experience` | `/services/digital-smile-design` | *Digital Smile Design* | Existing copy |
| `/aesthedent-experience` | `/about` | *how we work* | Closing prose |
| `/aesthedent-experience` | ×2 remaining services | descriptive | Existing copy |
| `/` | `/services/dentures` ★ | *dentures in Kothrud* | Services section prose |
| `/` | `/services/digital-smile-design` | *Digital Smile Design in Pune* | Services section prose |
| `/` | `/about` | *why we explain everything first* | "What happens when you visit" section |
| `/` | `/insights/dental-anxiety-tips` | *if you are frightened of the dentist* | Hero-adjacent or promises section - **carries the positioning** |
| `/` | `/insights` | *dental advice from our dentists* | Footer of body content |
| `/services/dentures` ★ | `/services/dental-implants` | *dental implants in Kothrud* | In-body: implants vs dentures is *the* decision denture patients are making |
| `/services/dentures` ★ | `/services/full-mouth-rehabilitation` | *full mouth rehabilitation* | In-body, same paragraph |
| `/services/dentures` ★ | `/doctor` | *our prosthodontist* | In-body |

**Fix "Know More".** Every service card on `/aesthedent-experience` uses it. Replace with the
service name (`Dental implants in Kothrud →`). This is a content string change inside the
existing button - no design change.

### 6.2 Priority B - informational → commercial funnels

| From | To | Anchor |
|---|---|---|
| `/insights/best-dentist-kothrud-pune` | `/` | *dental clinic in Kothrud* - **resolves C1** |
| `/insights/root-canal-pain-myths` | `/services/root-canal` | *root canal treatment in Kothrud* |
| `/insights/dental-implants-pune-specialist` | `/services/dental-implants` | *dental implants in Kothrud* |
| `/insights/dental-implants-pune-specialist` | `/doctor` | *our prosthodontist* |
| `/insights/when-to-get-braces` | `/services/orthodontic-treatment` | *braces and aligners in Kothrud* |
| `/insights/dental-anxiety-tips` | `/about` | *how we work with anxious patients* |
| `/insights/teeth-whitening-safety` | `/services/digital-smile-design` | *smile design in Pune* |

### 6.3 Priority C - repair the weakest pages
Three articles have **1 in-link** each (`dental-anxiety-tips`, `dental-implants-pune-specialist`,
`when-to-get-braces`) and sit at depth 2. `dental-anxiety-tips` carries our entire wedge and is
the least-linked page on the site. Priority A already gives it a homepage link; `/about` should
link to it too.

### 6.4 What I am *not* proposing
No new nav items, no footer link blocks, no "related posts" widgets, no breadcrumb changes.
Every link above goes **inside prose or an existing button that already exists**. Adding link
furniture would be a design change, and the brief forbids it.

---

## 7. Homepage section → keyword map

The nine approved sections. Current implementation differs (`HomeClient.js` renders hero →
trust badges → "nervous" interactive → smile stories → treatment experience → services →
insights → doctors → contact), so rows are marked **NEW** where no section exists yet.

| # | Section | Carries | Local term | Notes |
|---|---|---|---|---|
| 1 | **Hero** | *(brand + positioning)* | - | Approved H1 carries no keyword by design (§0.1). Sub-line carries *Kothrud* + *specialist prosthodontist*. Marathi line stays. |
| 2 | **Trust bar** | **dental clinic in Kothrud** | Kothrud | H2 here is where the Tier-1 term lands now that the H1 does not carry it. Holds 5.0 / 277 reviews - both GBP-verified (`02-gbp-comparison.md`). **`10+ Years` and `5000+ Patients` remain unsourced - N3/N4.** |
| 3 | **4 promises** | *dentist who explains everything*, *raise your hand* | - | Pure wedge. No keywords. Do not optimise this section. |
| 4 | **Services** | **dental treatments in Kothrud** + all 8 service terms | Kothrud | Must render **all 8**, not `slice(0,6)` - currently drops dentures (indexed) and DSD. |
| 5 | **What happens when you visit** - **NEW** | *what happens at a first dental appointment*, **dental anxiety** | - | The section that makes the positioning concrete. Links to `/about` and `/insights/dental-anxiety-tips`. |
| 6 | **Reviews** | *dentist reviews Kothrud* | Kothrud | 5.0 / 277 verified. **`aggregateRating` still not wired - D6, your call.** |
| 7 | **Doctors** | **prosthodontist kothrud** | Kothrud | Feeds §6's key link into `/doctor`. **Credentials blocked on C1–C7.** |
| 8 | **Pricing** - **NEW** | **dental implant cost pune**, *root canal cost Kothrud* | Pune | **FULLY BLOCKED on `NEEDS-INPUT` P1–P12.** Cannot be written. See §8. |
| 9 | **Contact** | **dentist near me kothrud** | Kothrud, Paud Road, Karve Nagar | Only place a multi-area mention is natural - as directions. Weekend opening + Wednesday closure stated in prose. |

**Keyword density check:** "Kothrud" appears in 6 of 9 sections. That is at the top of the
acceptable range for a single page. If the pricing section ships Pune-level, it balances. If
any section starts repeating "dentist in Kothrud" verbatim, cut it - §1.2's own evidence is that
Silver Pearls stuffs the term and ranks **last** of the independents.

---

## 8. NEEDS-INPUT additions

**I have NOT written these into `audit/NEEDS-INPUT.md`** - you said edit nothing, and that
outranks the standing rule. Ready to append verbatim on your word.

| # | Item | Blocks |
|---|---|---|
| **L1** | **Confirm the 7 areas reflect real patient origin** (B3, re-raised - §4 depends entirely on it) | All local copy on 8 service pages |
| **L2** | Is Wednesday fully closed, or emergency-only? (B1, re-raised) | `/contact` copy, *emergency dentist* term |
| **L3** | Do patients actually travel from Bavdhan/Warje for implants and FMR, or is that my inference? | §4 implant + FMR assignments |
| **S1** | Approve renaming `"Specialist Grade Dentures"` → `"Dentures"` - affects our **indexed** page's H1, title and nav label | §5.1 |
| **S2** | Approve `"Orthodontic Treatment"` → `"Braces & Aligners"` | §5.1 |
| **W1** | Teeth whitening: option (a), (b) or (c)? - **(c) creates a new URL** | §3.2① |
| **P13** | *(extends P1–P12)* If full pricing is not coming, will you approve **"from ₹X"** for implants and root canals only? Two numbers unblocks section 8 and the strongest Tier-2 term we do not serve. | §7 §8, `dental implant cost pune` |

**Still blocking from the existing list:** C1–C7 (doctor credentials → `/doctor`, Tier-3
*prosthodontist kothrud*), C9 (DSD certification), P1–P12 (all pricing), N3/N4 (`10+ Years`,
`5000+ Patients` - **live in SSR HTML right now, still unsourced**), D6 (`aggregateRating`).

---

## 9. Sequence I recommend, if you approve

1. **`/aesthedent-experience` title + H1** - §5 row 2. Indexed page, brand-first title, fastest-acting change available.
2. **Priority A internal links** - §6.1. The only lever that acts on the 18.
3. **Homepage H1 + trust-bar H2** - the approved positioning, with the Tier-1 term relocated.
4. **Weak H1s** - §1.1, seven pages.
5. **Cannibalisation fixes** - §1.2, C1 and C2 first.
6. **Local layer** - §4. *Gated on L1.*
7. **Pricing** - §7 row 8. *Gated on P1–P12 or P13.*

Steps 1–5 are unblocked and touch content only. Steps 6–7 need answers first.

---

## 10. What this document does not claim

- It will not get the 18 pages crawled. `C-synthesis.md` §C3 stands: that is off-site and time.
- The §4 area assignments are reasoned inference about travel behaviour, **not** measured patient data (L1/L3).
- No medical fact, price, credential or statistic has been invented anywhere above. Where one was needed, the row says `NEEDS-INPUT` and stops.
- No URL is renamed, moved or deleted. Three new-URL ideas were raised and all three are parked for your decision (§3.2), none assumed.
