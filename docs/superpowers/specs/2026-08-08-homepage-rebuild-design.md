# Homepage Rebuild — Design

**Date:** 2026-08-08
**Branch:** `seo/phase-1-technical-fixes`
**Scope:** Three sequential jobs — intake form rebuild, homepage assembly, mobile design pass.

The full content spec (every section, every final string) was supplied by the user
and is the authority on copy. This document records only what the spec did NOT
settle: the four places where it collided with the existing codebase, and how each
was resolved. Where this document and the supplied spec disagree, this document wins,
because these resolutions were made with the code in front of us.

---

## Resolved conflict 1 — Countable stats vs. the no-unverified-numbers policy

**The collision.** The spec adds a `STATS` block to `lib/clinic.ts`:

```ts
export const STATS = {
  years: "10+", patients: "1000+", implants: "100+", rootCanals: "500+",
} as const;
```

`lib/clinic.ts:107-118` forbids precisely these numbers. It names `"1000+ patients"`
and `"500+ successful cases"` as unsourced claims stripped during the audit
(NEEDS-INPUT N3/N4/N5/N10) and closes with *"Do not add a patient count here without
a source."* `app/HomeClient.js:68-71` independently records removing `"10+ Years
Experience"` and `"5000+ Happy Patients"` for the same reason.

**Why this is not simply ignoring the rule.** That comment states its own release
condition: *"Until Dr. Sahil supplies a real countable figure."* The condition is a
missing source, not a permanent ban. The spec asserts Dr. Sahil confirmed all four
figures, which satisfies the stated gate.

**Resolution — confirmed by user 2026-08-08.** Add all four. The provenance must be
written down at the same time, in the same commit:

- Rewrite the `lib/clinic.ts` closing comment so it records that the ban was lifted,
  by whom, and on what date — not deleted as though it never existed.
- Update the `trustStats` comment in `app/HomeClient.js` for the same reason.
- Log the source in `audit/NEEDS-INPUT.md` against N3/N4/N5/N10.

A future reader must never find a comment forbidding these numbers sitting directly
above the numbers. That reads as an unnoticed violation, and the next person to audit
the file will strip them again.

**Claim precision.** `rootCanals: "500+"` is a **count of procedures performed**. Its
label is `Root Canals` / `Completed`. It must never be rendered as "Painless Root
Canals" — pain is an outcome that varies by patient and cannot be promised, which is
the exact reasoning that removed "100% Painless Treatments" from this bar already.

## Resolved conflict 2 — The Treatments section is blue, not white

**The collision.** The spec's global rules say the Treatments section *"keeps its
WHITE background + gold heading. Do not revert to blue."* There is nothing to keep.
`app/HomeClient.js:802` is `bg-[hsl(var(--primary))]` — blue — with a white heading at
line 810. The restyle the spec refers to does not exist on this branch.

**Resolution.** Build the intended end state: white background, gold heading using the
existing `--color-accent: 39 100% 50%` token. Do not import a new colour. The spec's
instruction describes the target, and the target is unambiguous even though its
premise was wrong.

**Contrast obligation.** Gold on white is the risky pairing in this whole rebuild.
`39 100% 50%` on white is roughly 2.1:1 — it fails AA for body text. The gold is
permitted for the large `<h2>` only (AA large-text threshold is 3:1, and this still
needs checking at the rendered size); card body copy and link anchors stay on
`--color-text` / `--color-primary`. If the heading fails at its final size, darken via
a token, not a one-off hex.

## Resolved conflict 3 — "The 4 confirmed real" reviews

**The collision.** The spec says render only `verifiedGoogleReview` entries — *"the 4
confirmed real"* — and *"do NOT re-add the deleted reviews 2–6."* Reviews 2–6 were
never deleted. They are still in `lib/testimonials.js`, unflagged, and they render
today on `/aesthedent-experience` as well as feeding the homepage.

Filtering on the flag does yield exactly 4 (ids 9, 8, 7, 1), so the spec's arithmetic
is right even though its premise about deletion is wrong.

**Resolution — confirmed by user 2026-08-08.** Apply the filter inside
`getTestimonials()` in `lib/testimonials.js`, so every consumer gets only flagged
reviews. Both the homepage and `/aesthedent-experience` drop to the 4 real ones.

Entries 2–6 stay in the file. The audit's open question against them is *"confirm
against the live profile — real → add the flag, not real → delete"*, and deleting them
now destroys the thing still awaiting verification. Unflagged data that never renders
is inert; deleted data is unrecoverable.

Note that review id 1 contains *"Not a pinch of pain during my root canal!"* This
stays. It is a patient's own words inside a quotation, not the clinic asserting an
outcome — a different category from a marketing claim, and the distinction is the
whole point of the provenance flag.

## Resolved conflict 4 — Nine step configs for an eight-step form

**The collision.** `INTAKE_FORM.steps` has nine entries but the labels read "of 8".
`contactMethod` and `phone` both carry `label: "Step 6 of 8"`.

**Resolution.** This is intentional, and the spec says so: the phone field is *"shown
immediately after contactMethod, on the same step."* Screens are derived by grouping
consecutive configs that share a `label`, giving 8 screens from 9 configs. The
progress bar renders 8 segments and is driven by screen index, never by config index.

The phone field exists because the spec offers *"A phone call"* as a contact method
but never collected a number — a patient who asks to be called could not be called.

---

## Architecture

**Job 1 — `lib/intake-form-config.ts` + `components/forms/IntakeWizard.tsx`**

All copy and options live in the config. The component renders from it and holds no
strings of its own. The existing wizard is a competent 5-step build that gets replaced
in place, but four of its properties are non-negotiable and carry forward:

- send is a real `<a href target="_blank">`, never `window.open` — survives popup
  blockers, supports long-press and middle-click
- React state only; no `localStorage`, no `sessionStorage`, no network call
- focus moves to each new step heading, skipped on first paint so the page does not
  steal focus on load
- `prefers-reduced-motion` collapses the step transition to nothing

Message assembly stays a pure exported function so it can be eyeballed in review, and
skips empty lines. It routes through the existing `buildWhatsappLink()` — the one place
a `wa.me` URL is constructed.

**Boundary the form must not cross.** It collects triage context only. No symptom
branching, no clinical follow-ups, no suggested treatment. An intake form that appears
to triage is making a clinical claim this site is not allowed to make. The comfort
slider is the one place that reads as clinical and is not — it changes reassurance
copy, nothing else.

**Job 2 — `app/HomeClient.js`** is 1139 lines and gets reordered, not rewritten.
Section order: Navbar · Hero+Ratings · Marathi · Treatments · Intake form · Visit
process · Reviews · Doctors+Promises · Ready to talk. Two moves matter: the paragraph
under the Marathi line goes to Doctors, and the four promise cards move from the
Marathi section to Doctors.

Exactly one `<h1>` — the hero. Everything else `<h2>`/`<h3>`. Routes, slugs, canonicals
and page metadata are untouched throughout.

**Job 3** is a design pass over the assembled page, not a refactor: type scale via
`clamp()`, measure capped ~38–42ch, nothing below 14px, inputs ≥16px so iOS does not
zoom, tap targets ≥44×44. Verified at 360 / 390 / 414px for overflow and overlap.

## Verification

Type-check and build after each job. Each job STOPS and reports before the next
begins.

Manual checks that the build cannot catch: exactly one `<h1>` in the rendered output;
gold-on-white contrast at final rendered size; the assembled WhatsApp message with
empty optional fields omitted; the phone validator against `+91` / spaced / dashed
input; keyboard-only traversal of all 8 steps.
