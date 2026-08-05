# Part C - Synthesis

**Date:** 2026-07-18
Every claim cites a number from Part A or Part B. Off-page items I could not measure are marked `[NEEDS B1/B2]`.
Part B was not executable (no GSC/Semrush access from this session); this synthesis rests on Part A + the status strings you supplied. Where a GSC number would change or confirm a conclusion, it says so.

---

## C1 - The mechanism

**Two questions, two mechanisms. They are different, and conflating them is what has cost weeks.**

### Q1: Why are the 18 not indexed?
Because **Google has never crawled them.** Your GSC status is `Discovered - currently not indexed / Last crawled: N/A`. That is not a content verdict, a title verdict, or a canonical verdict - **all of those require a crawl to trigger, and no crawl happened.** Google discovered the URLs (from the sitemap - B6-adjacent, sitemap lists all 21) and **declined to spend crawl budget fetching them**, for three months.

The mechanism is **crawl-demand starvation**: on a ~4-month-old domain with near-zero external authority, Google allocates a minimal crawl budget - enough to fetch and periodically refresh the homepage, and little else. The 18 sit in a discovery queue that never gets serviced.

**This is supported, not merely asserted:**
- The status string itself (`Last crawled: N/A`) means uncrawled, not rejected.
- Part A: on-page factors **do not predict** which pages got crawled (see Q2) - so crawl selection is being driven from off the page.
- No CrUX field data exists (`audit/raw/3-performance-measured.json`) → traffic is below Google's reporting threshold → low crawl demand is consistent.

### Q2: Why those specific 3, and not the other 18?
**Part A eliminated every on-page explanation** (nine measured factors; full table in `A-repo-reverse-engineering.md`). The indexed set is:
- **`/`** - the homepage. Always crawled first. No puzzle.
- **`/aesthedent-experience`** - has the **fewest internal links on the entire site (1 in-link, A3)**, so internal equity did not pull it in. It is a purpose-built landing page (own `layout.js`, own `landing-page-content.js`, own metadata since 2026-04-09). The most probable reason it earned a crawl is an **external reference** (ad/social destination) - `[NEEDS B2: is it in "top linked pages"?]`.
- **`/services/dentures`** - the genuine anomaly. On every measured axis it is a **statistical twin** of the seven unindexed service pages (depth 1, 21 in-links, 458 words, 9 H2s, identical schema - A2). It is **not** on the homepage grid, and it sits at **sitemap position #14** with the other services around it uncrawled. Nothing on-page selected it.

**So the crawled set is driven by off-page signals or randomness, not site structure.** The three surviving explanations for dentures, in order of how cleanly they'd fit:
1. An **external deep-link** to `/services/dentures` `[NEEDS B2]`.
2. A **manual "Request Indexing"** submitted for it once `[NEEDS B5]` - the cleanest single-page explanation.
3. **Crawl randomness** - on a near-zero-demand domain, Google fetched a tiny, essentially arbitrary sample of the sitemap and dentures was in it.

I **cannot distinguish these three** without GSC. The evidence that separates them: B2 "top linked pages" (→ #1), B5 request-indexing history (→ #2); if both are empty, #3 by elimination.

---

## C2 - Hypothesis scorecard

| Candidate cause | Verdict | Evidence (Part A/B number) |
|---|---|---|
| **Crawl budget / crawl demand** | **SUPPORTED** | `Last crawled: N/A` on all 18; on-page factors don't predict the crawled set (A2/A3); no CrUX data. Confirm rate with **B1**. |
| **Near-zero backlinks** | **SUPPORTED by inference, UNCONFIRMED** | Consistent with everything above, but the linking-domains count is **B2**. Not yet a measured number. |
| **Domain age (~4 months)** | **SUPPORTED** | Go-live ~2026-03/04 (confirmed earlier). Compounds low crawl demand. **Cannot be separated from the backlink factor** with current data - both depress crawl demand and co-occur. |
| **Content similarity / templating** | **CONTRADICTED** | Mean cosine **0.192**, max 0.414 (A4) - not clones. And 17 were never crawled, so content cannot be the cause anyway. |
| **Internal link depth / count** | **CONTRADICTED (inverted)** | Indexed `/aesthedent-experience` = **1** in-link; unindexed `/services/dental-implants` = **51** (A3). |
| **Sitemap position** | **CONTRADICTED** | dentures indexed at **#14**; positions #3–13 unindexed (A6). |
| **`lastmod` freshness** | **CONTRADICTED** | all 21 identical (A6). |
| **Duplicate titles / no canonical** *(my own Phase 3 lead)* | **CONTRADICTED as the cause of the 18** | Duplicate-content signals require a crawl; `Last crawled: N/A` means no crawl occurred. See correction below. |
| **robots / noindex block** | **CONTRADICTED** | nothing disallowed; all bots allowed (A6); no `noindex` / `X-Robots-Tag` anywhere. |
| **Manual Request-Indexing on dentures** | **UNTESTABLE here** | **B5.** The single cleanest explanation for the dentures anomaly. |
| **Google-selected canonical mismatch** | **UNTESTABLE here** | **B3.** |

### Falsifying the backlink hypothesis (as asked - I tried)
The hypothesis is **near-zero backlinks → minimal crawl budget → homepage crawled, rest starved.** It would be **wrong** if either:
- **B1 shows Google crawling many URLs/day (say >15) yet not indexing** - that would move the bottleneck downstream to quality/duplication, not budget. *But `Last crawled: N/A` already partly pre-closes this: the 18 are demonstrably not being crawled.*
- **B2 shows meaningful linking domains (say ≥15) with pages still uncrawled** - then "near-zero backlinks" is simply false and low crawl demand needs another explanation.

Both falsification tests are exactly B1 and B2. On current evidence the hypothesis **survives and is well-supported** - but "supported" is not "confirmed," and I am flagging plainly that **I have not seen the linking-domains number.** If B2 comes back with real links, I am wrong, and you'll know from one figure.

**The honest limit:** even if the hypothesis is right, I cannot tell you whether **backlinks** or **domain youth** is the *dominant* driver - they co-occur and both starve crawl demand. B2's linking-domains count is the one number that separates them.

---

## C3 - The verdict  (< 300 words)

**Aesthedent's 18 pages are not indexed because Google has never crawled them - and Google has never crawled them because a four-month-old domain with near-zero external authority earns almost no crawl budget.** This is a crawl-*demand* problem, not a defect. Part A measured nine on-page factors - internal links, depth, sitemap position, freshness, content similarity, schema, robots - and **every one is cleared.** Nothing on the page is broken. The pages are simply waiting in a discovery queue Google isn't servicing.

Ranked by contribution:
1. **Low crawl demand from domain youth + minimal off-site signals** - the whole ballgame. `Last crawled: N/A` × 18.
2. **Near-zero backlinks specifically** - the most likely driver of #1, strongly consistent but **unconfirmed** until GSC B2. (1 and 2 can't be cleanly separated yet.)
3. Everything else - **negligible or already fixed.**

**Correction to my own earlier verdict (Rule 4):** in Phase 3 I led with duplicate titles / missing canonicals as the probable cause. **That was over-weighted.** Duplicate-content consolidation requires a crawl; these pages were never crawled, so that mechanism never fired. The Phase 1 title/canonical fixes are correct hygiene for *when* pages get crawled - they are **not** why the pages aren't crawled, and deploying them will not, by itself, force crawling.

**So, bluntly: the domain is young, nothing on-page is broken, and this needs months, not fixes.** What moves crawl demand is off-site - citations and links from real sites, brand search volume, and time - plus manual Request-Indexing to nudge individual URLs and a validation (started 2026-07-17) to prompt re-evaluation. Anyone selling you an on-page fix for this is selling you the wrong thing.

---

## C4 - What we still can't know (and what would answer it)

| Open question | Answer lives in |
|---|---|
| Actual crawl rate - is it ~1 URL/day (confirms budget starvation) or higher? | **GSC B1** crawl stats |
| Do any external links exist, and do they point at `/aesthedent-experience` / `/services/dentures`? | **GSC B2** "top linked pages" / **Semrush** backlinks |
| Is **backlinks** or **domain age** the dominant driver of low crawl demand? | **B2** linking-domains count separates them |
| Was `/services/dentures` hand-submitted via Request Indexing? (cleanest dentures explanation) | **GSC B5** |
| Are the ~30–40 daily impressions branded or Kothrud-intent, and which page serves them? | **GSC B4** |
| Has the 2026-07-17 validation changed any Last-crawled dates yet? | **GSC B3**, re-checked now |
| Did any now-deleted old catalogue URLs (`/services/tooth-extraction` etc., now 404 - A7) ever get crawled/indexed and are now dangling? | **GSC B3** (full URL list incl. removed) |

**One number closes most of this: B2's "top linked pages."** If it lists the two non-homepage indexed URLs, the mechanism is external links and Part A's elimination is complete. If it's empty, the indexed set is crawl-randomness and the entire lever is "raise crawl demand." Either way, paste it and this stops being inference.
