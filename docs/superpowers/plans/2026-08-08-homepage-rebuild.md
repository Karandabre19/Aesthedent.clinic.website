# Aesthedent Homepage Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the patient intake form as an 8-step config-driven wizard, reassemble the homepage to the supplied section spec, and run a mobile design pass -without touching any route, slug, canonical, or page metadata.

**Architecture:** All intake copy moves into `lib/intake-form-config.ts`; `IntakeWizard.tsx` renders from that config and holds no strings of its own. The homepage (`app/HomeClient.js`, 1139 lines) is **reordered and restyled in place**, not rewritten -sections move as whole JSX blocks. Every number renders from `lib/clinic.ts` constants.

**Tech Stack:** Next.js 16 App Router, React 18, TypeScript 6 (`strict: false`, `checkJs: false`), Tailwind 3, shadcn/ui (untyped `.jsx`), Framer Motion 12, GSAP, lucide-react.

## Global Constraints

Every task's requirements implicitly include this section.

- **No route, slug, canonical, or page metadata changes.** Nothing in `app/**/page.js` metadata exports, `app/sitemap.js`, or `lib/schema.js` canonical fields.
- **Homepage has exactly ONE `<h1>`** -the hero. Everything else `<h2>`/`<h3>`.
- **Treatments section: WHITE background + gold heading.** Gold is the existing `--color-accent: 39 100% 50%`. Do not import a second palette.
- **All numbers render from `lib/clinic.ts` constants.** Never hardcode a stat in a component.
- **No "Top Dentists".** Self-awarded claim.
- **No "painless" as an outcome promise.** `rootCanals` is a COUNT -label `Root Canals` / `Completed`, never "Painless Root Canals". Patient quotes containing the word are fine; clinic assertions are not.
- **Dr. Aishwarya is NEVER called a specialist.** She is `General & Family Dentist, Co-Owner`. `lib/clinic.ts` carries `isSpecialist: false` for her.
- **React state only** -no `localStorage`, no `sessionStorage`, no network call from the form.
- **The form collects triage context only.** It must not diagnose or suggest treatment.
- **Type-check + build after each job.**
- **Do NOT import a second palette** (`--teal`/`--amber`/`--ivory`). Map onto existing tokens.

### Verification commands (this repo has no test runner)

`package.json` has no test script and `tests/` holds only a vestigial `__init__.py`. Do not add a test framework -that is scope the user did not ask for. Verify with:

```bash
npx tsc --noEmit                      # type-check
npx next build                        # production build
node scratch/check-message.mjs        # pure-function assertions (Task 1)
```

Pure logic (`assembleMessage`, phone normalisation) is verified by running real assertions through Node. Rendering, `<h1>` count, and mobile widths are verified in the browser via the Chrome DevTools MCP tools.

### shadcn typing gotcha

`components/ui/*.jsx` is untyped and `tsconfig.json` sets `checkJs: false`, so TypeScript infers "no props at all" for each `forwardRef` export and rejects every attribute. The existing `IntakeWizard.tsx` solves this with local `ComponentType` aliases. **Keep that pattern** -do not retype the shared kit, because every other page imports those same files as plain JS and must keep working.

```ts
const Button = ButtonBase as ComponentType<
  ComponentPropsWithoutRef<'button'> & { variant?: string; size?: string; asChild?: boolean }
>;
```

---

# JOB 1 -Intake Form

## File Structure

| File | Responsibility |
|---|---|
| `lib/intake-form-config.ts` | **Create.** All copy, options, validation patterns. Single source of truth for form content. |
| `lib/intake-form-message.ts` | **Create.** `Answers` type + the pure functions: `normalisePhone`, `isValidPhone`, `assembleMessage`. **Zero runtime imports** -see below. |
| `lib/intake-form-types.ts` | **Create.** `StepConfig` union, `EMPTY_ANSWERS`, `getScreens()`. Config-dependent glue. |
| `components/forms/IntakeWizard.tsx` | **Rewrite in place.** Renders from config. Currently a 5-step build. |
| `scratch/check-message.mjs` | **Create** (scratch, not committed). Node assertions importing the **real** functions. |

**Why the pure functions get their own file.** Node 24 strips TypeScript types natively, so `scratch/check-message.mjs` can `import` a `.ts` module directly and assert against the **code that actually ships** -but only if that module has no runtime imports of its own (Node ESM will not resolve the extensionless `./intake-form-config` specifier that Next/webpack accepts).

Keeping `intake-form-message.ts` import-free is what makes the verification real. The alternative -a check script that re-declares the phone regex -is a test that passes while the shipped function is broken, which is worse than no test. Consequently `assembleMessage` takes the resolved comfort **label** as a parameter rather than looking it up from the config:

```ts
assembleMessage(a: Answers, comfortLabel: string): string
```

The component resolves it (`levels[a.comfort].value`) and passes it in.

---

### Task 1: Config, types, and the message assembler

**Files:**
- Create: `lib/intake-form-config.ts`
- Create: `lib/intake-form-message.ts`
- Create: `lib/intake-form-types.ts`
- Create: `scratch/check-message.mjs`

**Interfaces:**
- Consumes: `buildWhatsappLink(body: string): string` from `lib/clinic.ts` (already exists, line 103).
- Produces, from `lib/intake-form-message.ts` (**no runtime imports in this file**):
  - `type Answers` -`{ name, patientFor, reason, duration, comfort, contactMethod, phone, day, time, notes }`. `comfort` is a `number` (slider index 0–2); everything else is `string`.
  - `normalisePhone(raw: string): string`
  - `isValidPhone(raw: string): boolean`
  - `assembleMessage(a: Answers, comfortLabel: string): string`
- Produces, from `lib/intake-form-config.ts`:
  - `INTAKE_FORM` -the config object, exactly as specified below.
- Produces, from `lib/intake-form-types.ts`:
  - `type StepConfig`
  - `EMPTY_ANSWERS: Answers`
  - `getScreens(): StepConfig[][]` -groups consecutive step configs by shared `label`, returning 8 arrays from 9 configs.

**Why `Answers` keys are not step ids:** the `schedule` step produces two answers (`day` and `time`), and `review.rowLabels` lists them separately. There are 9 step configs, 8 screens, and 10 answer keys. These three counts are all correct and all different.

- [ ] **Step 1: Create the config file**

Create `lib/intake-form-config.ts` with the config object **exactly as given in the spec** -every string verbatim, no paraphrasing. Prefix it with this comment:

```ts
/**
 * Every string the intake wizard renders. The component holds no copy of its
 * own, so changing what a patient reads means editing this file and nothing
 * else.
 *
 * SHAPE NOTE: there are 9 entries in `steps` but the labels read "of 8".
 * `contactMethod` and `phone` deliberately share "Step 6 of 8" and render on
 * one screen -the spec offers "A phone call" as a contact method, so a number
 * has to be collected or a patient who asks to be called cannot be called.
 * Screens are derived by grouping consecutive entries that share a `label`;
 * see getScreens() in ./intake-form-types.
 *
 * BOUNDARY: this form collects triage context only. No symptom branching, no
 * clinical follow-ups, no suggested treatment. A form that appears to triage is
 * making a clinical claim this site is not allowed to make.
 */
```

Then this object, verbatim. Every string here is final patient-facing copy -transcribe, do not paraphrase:

```ts
export const INTAKE_FORM = {
  eyebrow: "We're here when you're ready",
  title: "Let's get you seen, comfortably.",
  intro: "Tell us a little about what's going on. No forms with fifty fields -just a short conversation, and we'll take it from there.",

  steps: [
    {
      id: "name",
      label: "Step 1 of 8",
      question: "What's your name?",
      type: "text",
      placeholder: "Your full name",
      autocomplete: "name",
      required: true,
    },
    {
      id: "patientFor",
      label: "Step 2 of 8",
      question: "Who is this appointment for?",
      type: "single-select",
      columns: 2,
      required: true,
      options: [
        { value: "Myself" },
        { value: "My child" },
        { value: "A parent" },
        { value: "Someone else" },
      ],
    },
    {
      id: "reason",
      label: "Step 3 of 8",
      question: "What brings you in?",
      type: "single-select",
      columns: 1,
      required: true,
      options: [
        { value: "Tooth pain or sensitivity", sub: "Something's hurting and needs a look" },
        { value: "Missing tooth / implants",  sub: "Replacing one or more teeth" },
        { value: "Root canal concern",        sub: "Suspected infection or old RCT pain" },
        { value: "Smile design / cosmetic",   sub: "Whitening, veneers, alignment" },
        { value: "Routine check-up",          sub: "Cleaning, cavity check, general health" },
        { value: "Something else",            sub: "We'll ask you to explain below" },
      ],
    },
    {
      id: "duration",
      label: "Step 4 of 8",
      question: "How long has this been going on?",
      type: "single-select",
      columns: 2,
      required: true,
      options: [
        { value: "Just started" },
        { value: "A few weeks" },
        { value: "Over a month" },
        { value: "Not urgent -planning ahead" },
      ],
    },
    {
      id: "comfort",
      label: "Step 5 of 8",
      question: "How are you feeling about the visit?",
      type: "slider",
      required: false,
      default: 0,
      levels: [
        { value: "Calm",
          note: "Good to know. We'll keep things simple and quick." },
        { value: "A little nervous",
          note: "Totally normal. We talk you through every step before it happens, and pause any time you ask." },
        { value: "Quite anxious",
          note: "We hear you -many patients feel this way. Raise your hand at any point during treatment and we stop immediately. That's our word." },
      ],
    },
    {
      id: "contactMethod",
      label: "Step 6 of 8",
      question: "How should we reach you?",
      type: "single-select",
      columns: 2,
      required: true,
      options: [
        { value: "WhatsApp" },
        { value: "A phone call" },
      ],
    },
    {
      id: "phone",
      label: "Step 6 of 8",
      question: "What's your mobile number?",
      helper: "So we can reach you about your appointment.",
      type: "tel",
      placeholder: "10-digit mobile number",
      inputMode: "numeric",
      required: true,
      // shown immediately after contactMethod, on the same step
      validation: "^[6-9]\\d{9}$",
      errorMessage: "Please enter a valid 10-digit mobile number.",
    },
    {
      id: "schedule",
      label: "Step 7 of 8",
      question: "Which day and time work for you?",
      helper: "We're open Monday–Sunday, 10 AM – 8 PM. Closed Wednesdays.",
      type: "day-time",
      required: true,
      days: [
        { value: "Mon" }, { value: "Tue" },
        { value: "Wed", disabled: true, title: "Closed Wednesdays" },
        { value: "Thu" }, { value: "Fri" }, { value: "Sat" }, { value: "Sun" },
      ],
      times: [
        { value: "Morning (10 – 1)" },
        { value: "Afternoon (1 – 4)" },
        { value: "Evening (4 – 8)" },
      ],
    },
    {
      id: "notes",
      label: "Step 8 of 8",
      question: "Anything else you'd like to share?",
      type: "textarea",
      placeholder: "Optional -describe symptoms, past treatment, or questions you have",
      required: false,
    },
  ],

  review: {
    label: "Almost done",
    title: "Here's what we'll send",
    sendButton: "Send via WhatsApp",
    callAlt: "Prefer to talk now?",
    callAltStrong: "Call the clinic directly",
    backButton: "Back & edit",
    rowLabels: {
      name: "Name",
      patientFor: "Appointment for",
      reason: "Reason for visit",
      duration: "Duration",
      comfort: "Comfort level",
      contactMethod: "Contact via",
      phone: "Mobile",
      day: "Preferred day",
      time: "Preferred time",
      notes: "Notes",
    },
  },

  buttons: { continue: "Continue", back: "Back", review: "Review" },
} as const;
```

**Transcription notes** (these are easy to "fix" by accident -don't):
- The em-dashes (`—`), en-dashes in times (`10 – 1`), and the curly apostrophes are intentional. Keep them.
- `validation: "^[6-9]\\d{9}$"` keeps the doubled backslash -it is a string, not a regex literal.
- The aligned whitespace in the `reason` options is cosmetic; preserving it is fine, reflowing it is also fine.
- `review.rowLabels.reason` is `"Reason for visit"` while the assembled message line is `"Reason"`. Both are correct -the review table and the WhatsApp body use different wording on purpose.

- [ ] **Step 2: Create the pure message module**

Create `lib/intake-form-message.ts`. **This file must have no `import` statements** -that is what lets the verification script load the real code. Do not add one.

```ts
/**
 * The pure half of the intake form: the answer shape, phone normalisation, and
 * the WhatsApp message assembler.
 *
 * NO IMPORTS IN THIS FILE, DELIBERATELY. Node 24 strips TypeScript types
 * natively, so scratch/check-message.mjs can import this module directly and
 * assert against the code that actually ships. Node ESM will not resolve the
 * extensionless specifiers Next accepts, so a single import here would force
 * the checks to re-declare the phone regex -and a check that re-declares the
 * thing it checks passes happily while the shipped function is broken.
 *
 * That is why assembleMessage takes the comfort LABEL as a parameter instead
 * of looking it up in the config: the lookup is the component's job.
 */

/**
 * The shape the wizard holds. Deliberately NOT keyed by step id: `schedule`
 * yields two answers (day + time), so 9 step configs produce 10 answer keys.
 * `comfort` is the slider INDEX, not its label.
 */
export interface Answers {
  name: string;
  patientFor: string;
  reason: string;
  duration: string;
  comfort: number;
  contactMethod: string;
  phone: string;
  day: string;
  time: string;
  notes: string;
}

/** 10-digit Indian mobile, starts 6-9. Tolerates spaces, dashes, brackets, +91. */
export function normalisePhone(raw: string): string {
  return raw.replace(/[\s\-()]/g, '').replace(/^(\+?91)/, '');
}

export function isValidPhone(raw: string): boolean {
  return /^[6-9]\d{9}$/.test(normalisePhone(raw));
}

/**
 * Assembles the WhatsApp body. Skips empty rows, so an optional field the
 * patient left blank never ships as a dangling "Notes: ".
 */
export function assembleMessage(a: Answers, comfortLabel: string): string {
  const rows: [string, string][] = [
    ['Name', a.name.trim()],
    ['Appointment for', a.patientFor],
    ['Reason', a.reason],
    ['Duration', a.duration],
    ['Comfort level', comfortLabel],
    ['Preferred contact', a.contactMethod],
    ['Mobile', normalisePhone(a.phone)],
    ['Preferred day', a.day],
    ['Preferred time', a.time],
    ['Notes', a.notes.trim()],
  ];

  return [
    'Hello Aesthedent Dental Clinic,',
    "I'd like to book an appointment.",
    '',
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
  ].join('\n');
}
```

- [ ] **Step 3: Create the config-dependent glue**

Create `lib/intake-form-types.ts`:

```ts
import { INTAKE_FORM } from './intake-form-config';
import type { Answers } from './intake-form-message';

export type StepConfig = (typeof INTAKE_FORM.steps)[number];

export const EMPTY_ANSWERS: Answers = {
  name: '', patientFor: '', reason: '', duration: '', comfort: 0,
  contactMethod: '', phone: '', day: '', time: '', notes: '',
};

/**
 * Groups consecutive step configs that share a `label` into one screen.
 * 9 configs -> 8 screens, because contactMethod and phone both read
 * "Step 6 of 8".
 */
export function getScreens(): StepConfig[][] {
  const screens: StepConfig[][] = [];
  for (const step of INTAKE_FORM.steps) {
    const last = screens[screens.length - 1];
    if (last && last[0].label === step.label) last.push(step);
    else screens.push([step]);
  }
  return screens;
}
```

- [ ] **Step 4: Write assertions against the real functions**

Create `scratch/check-message.mjs`. It imports the **shipped** module -do not re-declare any logic here.

```js
// scratch/check-message.mjs -verification scratch, not committed.
// Imports the real .ts module so a broken shipped function fails these checks.
import assert from 'node:assert/strict';
import { isValidPhone, normalisePhone, assembleMessage } from '../lib/intake-form-message.ts';

// Accepts the forms a real patient types.
for (const good of ['9309816336', '+919309816336', '93098 16336', '93098-16336', '919309816336']) {
  assert.equal(isValidPhone(good), true, `should accept ${good}`);
}

// Rejects what it must.
for (const bad of ['5309816336', '930981633', '93098163361', '', 'abcdefghij']) {
  assert.equal(isValidPhone(bad), false, `should reject "${bad}"`);
}

assert.equal(normalisePhone('+91 93098-16336'), '9309816336', 'strips +91, space and dash');

const full = {
  name: '  Asha Kulkarni  ', patientFor: 'Myself', reason: 'Tooth pain or sensitivity',
  duration: 'A few weeks', comfort: 1, contactMethod: 'WhatsApp', phone: '+919309816336',
  day: 'Thu', time: 'Morning (10 – 1)', notes: 'Upper right molar aches with cold water.',
};

const body = assembleMessage(full, 'A little nervous');
assert.ok(body.startsWith('Hello Aesthedent Dental Clinic,\nI\'d like to book an appointment.\n\n'), 'greeting block');
assert.ok(body.includes('Name: Asha Kulkarni'), 'name is trimmed');
assert.ok(body.includes('Mobile: 9309816336'), 'phone is normalised in the message');
assert.ok(body.includes('Comfort level: A little nervous'), 'comfort label passed through');

// Empty optional fields must not produce dangling label lines.
const sparse = assembleMessage({ ...full, notes: '   ', day: '', time: '' }, 'Calm');
assert.ok(!sparse.includes('Notes:'), 'blank Notes line must be omitted');
assert.ok(!sparse.includes('Preferred day:'), 'blank day line must be omitted');
assert.ok(sparse.includes('Name: Asha Kulkarni'), 'filled rows survive');

console.log('OK -all message/phone assertions passed');
```

- [ ] **Step 5: Run the assertions**

Run: `node scratch/check-message.mjs`
Expected: `OK -all message/phone assertions passed`

A `MODULE_TYPELESS_PACKAGE_JSON` warning on stderr is expected and harmless.

To prove the checks actually bind to the shipped code, temporarily break the regex in `lib/intake-form-message.ts` -change `[6-9]` to **`[6-8]`** -re-run, confirm it FAILS with an `AssertionError` and exit code 1, then revert and confirm it passes again.

Use `[6-8]`, not `[7-9]`: every "good" fixture starts with 9, so narrowing the range at the top end still accepts all of them and the check would pass against broken code -exactly the false-confidence this negative check exists to rule out.

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `lib/intake-form-config.ts`, `lib/intake-form-message.ts`, or `lib/intake-form-types.ts`.

- [ ] **Step 7: Commit**

```bash
git add lib/intake-form-config.ts lib/intake-form-message.ts lib/intake-form-types.ts
git commit -m "feat(form): add config-driven intake form content and assembler

All intake copy moves into one file so changing what a patient reads
does not mean touching the component. The assembler skips empty lines,
so an optional field left blank never ships as a dangling label."
```

---

### Task 2: Wizard shell -screens, progress, navigation, focus

**Files:**
- Modify: `components/forms/IntakeWizard.tsx` (full rewrite, 635 lines currently)

**Interfaces:**
- Consumes: `INTAKE_FORM`, `Answers`, `EMPTY_ANSWERS`, `getScreens`, `isValidPhone`, `assembleMessage` from Task 1; `buildWhatsappLink` from `lib/clinic.ts`.
- Produces: `export default function IntakeWizard()` -mounted by Task 8.

**Carry forward from the current implementation** (these are already right, do not regress them):
- Send is a real `<a href target="_blank" rel="noopener noreferrer">`, never `window.open`.
- Focus moves to each new screen's heading, **skipped on first paint** via a `firstRender` ref so the page does not steal focus on load.
- `useReducedMotion()` collapses the transition to `{ duration: 0 }` with empty variants.
- No persistence of any kind.

- [ ] **Step 1: Write the shell**

Replace the file. Structure:

```tsx
'use client';

const SCREENS = getScreens();          // 8
const TOTAL = SCREENS.length;          // 8

export default function IntakeWizard() {
  const [screen, setScreen] = useState(0);      // 0-indexed; TOTAL = review
  const [a, setA] = useState<Answers>(EMPTY_ANSWERS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const reduceMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  // ...
}
```

Progress bar renders **8 segments** driven by screen index -never by config index:

```tsx
function ProgressBar({ screen, total }: { screen: number; total: number }) {
  return (
    <div
      className="mb-8 flex gap-1.5"
      role="progressbar"
      aria-valuenow={Math.min(screen + 1, total)}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuetext={`Step ${Math.min(screen + 1, total)} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
            i < screen
              ? 'bg-[hsl(var(--color-primary))]'
              : i === screen
                ? 'bg-[hsl(var(--color-accent))]'
                : 'bg-[hsl(var(--color-bg-alt))]'
          }`}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Add per-screen validation**

Validation reads `required` off the config rather than hardcoding step numbers:

```tsx
function validate(screenIndex: number): boolean {
  const e: Record<string, string> = {};
  for (const step of SCREENS[screenIndex]) {
    if (step.id === 'phone') {
      if (!a.phone.trim()) e.phone = 'We need a number to reach you.';
      else if (!isValidPhone(a.phone))
        e.phone = (step as { errorMessage?: string }).errorMessage
          ?? 'Please enter a valid 10-digit mobile number.';
      continue;
    }
    if (step.id === 'schedule') {
      if (!a.day) e.schedule = 'Please pick a day.';
      else if (!a.time) e.schedule = 'Please pick a time.';
      continue;
    }
    if (!(step as { required?: boolean }).required) continue;
    const v = a[step.id as keyof Answers];
    if (typeof v === 'string' && !v.trim()) e[step.id] = 'Please answer this to continue.';
  }
  setErrors(e);
  return Object.keys(e).length === 0;
}
```

- [ ] **Step 3: Add focus management and navigation**

```tsx
useEffect(() => {
  if (firstRender.current) { firstRender.current = false; return; }
  headingRef.current?.focus();
}, [screen]);

function next() { if (validate(screen)) setScreen((s) => Math.min(s + 1, TOTAL)); }
function back() { setErrors({}); setScreen((s) => Math.max(s - 1, 0)); }
```

Nav buttons use `INTAKE_FORM.buttons.continue` / `.back` / `.review`. The final step's forward button reads `review` (from config), and the review screen's send button reads `INTAKE_FORM.review.sendButton`.

- [ ] **Step 4: Type-check and build**

Run: `npx tsc --noEmit && npx next build`
Expected: both succeed. Build may warn about unused imports until Task 3 lands -errors are not acceptable, warnings are.

- [ ] **Step 5: Commit**

```bash
git add components/forms/IntakeWizard.tsx
git commit -m "feat(form): rebuild wizard shell for 8 config-driven screens

Screens are derived by grouping step configs that share a label, so the
9 configs render as 8 screens and the progress bar tracks screens, not
configs. Validation reads `required` off the config instead of switching
on step number."
```

---

### Task 3: Field renderers

**Files:**
- Modify: `components/forms/IntakeWizard.tsx`

**Interfaces:**
- Consumes: `StepConfig` from Task 1, shell state from Task 2.
- Produces: one renderer per `type` in the config -`text`, `tel`, `textarea`, `single-select`, `slider`, `day-time`. Dispatched by `step.type`.

**Accessibility requirements -all six renderers:**
- Option cards are real `<button type="button" aria-pressed={selected}>`, not divs.
- Day/time groups sit in `<fieldset>` with a `<legend>`.
- Slider has `aria-valuetext` naming the level, not the number.
- Errors are `role="alert"` and wired via `aria-describedby` + `aria-invalid`.
- Inputs are `text-base` (16px) minimum so iOS does not zoom on focus.
- Tap targets ≥ 44×44.

- [ ] **Step 1: Text, tel, and textarea renderers**

`tel` sets `type="tel"`, `inputMode="numeric"`, `autoComplete="tel"`. `text` reads `autocomplete` from config (`"name"`). Both render `step.helper` under the question when present.

- [ ] **Step 2: single-select renderer**

Reads `columns` from config (1 or 2) to pick `grid-cols-1` vs `sm:grid-cols-2`, and renders `option.sub` as a second line when present:

```tsx
<button
  type="button"
  aria-pressed={selected}
  onClick={() => { set(step.id, option.value); setErrors({}); }}
  className={`flex min-h-[56px] w-full flex-col items-start justify-center gap-0.5 rounded-2xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary))] focus-visible:ring-offset-2 ${
    selected
      ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]/5 shadow-sm'
      : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:border-[hsl(var(--color-primary))]/50'
  }`}
>
  <span className="font-medium text-[hsl(var(--color-text))]">{option.value}</span>
  {'sub' in option && option.sub && (
    <span className="text-sm text-[hsl(var(--color-text-muted))]">{option.sub}</span>
  )}
</button>
```

- [ ] **Step 3: Comfort slider renderer**

A native `<input type="range" min={0} max={2} step={1}>` -native gives keyboard and screen-reader behaviour for free. The hand icon scales and rotates with value; the note text swaps from `levels[value].note`.

```tsx
<input
  type="range" min={0} max={2} step={1}
  value={a.comfort}
  onChange={(e) => set('comfort', Number(e.target.value))}
  aria-valuetext={levels[a.comfort].value}
  aria-label={step.question}
  className="w-full accent-[hsl(var(--color-primary))]"
/>
```

Icon transform, suppressed under reduced motion:

```tsx
<Hand
  aria-hidden="true"
  style={{ transform: `scale(${1 + a.comfort * 0.12}) rotate(${a.comfort * -8}deg)` }}
  className="h-8 w-8 text-[hsl(var(--color-primary))] transition-transform duration-300 motion-reduce:transition-none"
/>
```

The note is `aria-live="polite"` so the reassurance is announced when the level changes.

**This step is reassurance copy only.** It changes no downstream logic and appears in the message as a plain "Comfort level" line. It must not gate, branch, or alter any clinical suggestion.

- [ ] **Step 4: day-time renderer**

Two `<fieldset>`s. Wednesday is `disabled` with `title="Closed Wednesdays"` from config -render it visually muted and non-interactive, and make sure `disabled` is on the real `<button>` so keyboard users skip it:

```tsx
<button
  type="button"
  disabled={'disabled' in day && day.disabled}
  title={'title' in day ? day.title : undefined}
  aria-pressed={a.day === day.value}
  className="... disabled:cursor-not-allowed disabled:opacity-40"
>
```

Helper line renders `INTAKE_FORM.steps` schedule `helper`: *"We're open Monday–Sunday, 10 AM – 8 PM. Closed Wednesdays."*

- [ ] **Step 5: Verify in browser**

Start dev server, open `http://localhost:3000`, and walk all 8 steps with **keyboard only** (Tab / Shift-Tab / Space / arrows). Confirm: Wednesday is unreachable, each step's heading receives focus, errors announce.

- [ ] **Step 6: Type-check, build, commit**

```bash
npx tsc --noEmit && npx next build
git add components/forms/IntakeWizard.tsx
git commit -m "feat(form): add the six field renderers

Option cards are real buttons with aria-pressed, day/time sit in
fieldsets, and the comfort slider is a native range input so keyboard
and screen-reader behaviour comes free. Wednesday is disabled on the
button itself, so keyboard users skip it rather than tabbing to a day
the clinic is shut."
```

---

### Task 4: Review screen and send

**Files:**
- Modify: `components/forms/IntakeWizard.tsx`

**Interfaces:**
- Consumes: `INTAKE_FORM.review`, `assembleMessage`, `buildWhatsappLink`.
- Produces: the completed `IntakeWizard` default export.

- [ ] **Step 1: Build the review screen**

Renders at `screen === TOTAL`. Shows `review.label`, `review.title`, then a definition list of `review.rowLabels` → answers, **skipping empty rows** so the patient sees exactly what will send. Then:

- `review.sendButton` -"Send via WhatsApp"
- `review.backButton` -"Back & edit"
- `review.callAlt` + `review.callAltStrong` as a `tel:` link

```tsx
// The comfort LABEL is resolved here, not inside assembleMessage -that keeps
// lib/intake-form-message.ts import-free so its checks can load the real code.
const comfortLevels = (INTAKE_FORM.steps.find((s) => s.id === 'comfort') as {
  levels?: readonly { value: string; note: string }[];
}).levels!;

const message = useMemo(
  () => assembleMessage(a, comfortLevels[a.comfort]?.value ?? ''),
  [a, comfortLevels],
);
const waLink = useMemo(() => buildWhatsappLink(message), [message]);
```

Send is a real anchor:

```tsx
<a href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => setSent(true)}>
  {INTAKE_FORM.review.sendButton}
</a>
```

- [ ] **Step 2: Verify the assembled message end-to-end**

In the browser, fill every field and confirm the review block matches this shape exactly:

```
Hello Aesthedent Dental Clinic,
I'd like to book an appointment.

Name: Asha Kulkarni
Appointment for: Myself
Reason: Tooth pain or sensitivity
Duration: A few weeks
Comfort level: A little nervous
Preferred contact: WhatsApp
Mobile: 9309816336
Preferred day: Thu
Preferred time: Morning (10 – 1)
Notes: Upper right molar aches with cold water.
```

Then re-run leaving **Notes blank** and confirm no `Notes:` line appears.

- [ ] **Step 3: Type-check, build, commit**

```bash
npx tsc --noEmit && npx next build
git add components/forms/IntakeWizard.tsx
git commit -m "feat(form): add review screen and WhatsApp send

Send is a real anchor, so it survives popup blockers and supports
long-press and middle-click. Empty optional rows are skipped, so the
review shows exactly what will be sent and nothing more."
```

## 🛑 STOP -JOB 1 REPORT

Report: the config path, a sample assembled message, and confirmation that 9 configs render as 8 screens. Do not start Job 2 until the user responds.

---

# JOB 2 -Homepage Assembly

## File Structure

| File | Responsibility |
|---|---|
| `lib/clinic.ts` | **Modify.** Add `STATS`; rewrite the closing policy comment to record provenance. |
| `lib/testimonials.js` | **Modify.** Filter `getTestimonials()` to flagged reviews only. |
| `audit/NEEDS-INPUT.md` | **Modify.** Log the stat source against N3/N4/N5/N10. |
| `app/HomeClient.js` | **Modify.** Reorder sections, restyle Treatments, move promise cards, rewrite the 6-step list. |

---

### Task 5: Add STATS with provenance

**Files:**
- Modify: `lib/clinic.ts:107-118` (the closing comment)
- Modify: `audit/NEEDS-INPUT.md`

**Interfaces:**
- Produces: `export const STATS = { years, patients, implants, rootCanals } as const;` -consumed by Task 7's ratings bar.

**This is the task the design doc flagged.** `lib/clinic.ts:107-118` currently forbids exactly these numbers. Its stated release condition is *"Until Dr. Sahil supplies a real countable figure"*, which the spec satisfies. **Replace the comment -do not delete it and do not leave it standing above the numbers it forbids.** A future auditor who finds a prohibition sitting above the prohibited values will strip them again.

- [ ] **Step 1: Replace the closing comment and add STATS**

Replace lines 107-118 of `lib/clinic.ts` with:

```ts
/**
 * Countable figures, confirmed by Dr. Sahil on 2026-08-08.
 *
 * THIS BLOCK USED TO BE A PROHIBITION. "5000+ Happy Patients", "500+
 * successful cases", "1000+ patients" and "98% success rate" had all shipped
 * with no source behind any of them (audit/NEEDS-INPUT.md N3, N4, N5, N10),
 * and were stripped. The rule was never "no numbers" -it was "no numbers
 * without a source", and it named its own release condition: until Dr. Sahil
 * supplies a real countable figure.
 *
 * He has. These four are his, given 2026-08-08, and that is why they are here
 * when the earlier ones were removed. Anything NOT in this object still needs
 * a source before it ships.
 *
 * rootCanals is a COUNT OF PROCEDURES. It renders as "Root Canals /
 * Completed" and must never be labelled "Painless Root Canals" -pain is an
 * outcome that varies by patient and procedure, which is precisely why
 * "100% Painless Treatments" was removed from the trust bar already.
 */
export const STATS = {
  years: '10+',
  patients: '1000+',
  implants: '100+',
  rootCanals: '500+',
} as const;
```

- [ ] **Step 2: Log the provenance in the audit file**

Add to `audit/NEEDS-INPUT.md` under N3/N4/N5/N10 -a note that the four figures were supplied by Dr. Sahil on 2026-08-08 and now live in `lib/clinic.ts` `STATS`, and that "98% success rate" remains unsourced and is **not** reinstated.

- [ ] **Step 3: Type-check and commit**

```bash
npx tsc --noEmit
git add lib/clinic.ts audit/NEEDS-INPUT.md
git commit -m "feat(clinic): add clinic-confirmed countable stats with provenance

The comment this replaces forbade exactly these numbers, but its own
release condition was a real source from Dr. Sahil. He supplied all four
on 2026-08-08, so the block now records why the ban lifted rather than
vanishing and leaving the next auditor to strip them again."
```

---

### Task 6: Filter testimonials to verified reviews

**Files:**
- Modify: `lib/testimonials.js:171-174`

**Interfaces:**
- Produces: `getTestimonials(type, limit)` returning only `verifiedGoogleReview === true` entries. Consumed by `app/HomeClient.js:715` and `app/aesthedent-experience/page.js:1147`.

Entries 2–6 stay in the file. The audit's open question against them is *"confirm against the live profile"*, and deleting them destroys the thing awaiting verification. Unflagged data that never renders is inert.

- [ ] **Step 1: Add the filter**

```js
// Only reviews we can point at on the live Google profile ever render. Entries
// without the flag stay in the file because audit T4 still has to check them
// against the profile -real gets the flag, not-real gets deleted. Data that
// never renders is inert; deleted data is unrecoverable.
export const getTestimonials = (type = 'latest', limit = null) => {
  const source = type === 'latest' ? testimonialsData.latest : testimonialsData.all;
  const verified = source.filter((t) => t.verifiedGoogleReview === true);
  return limit ? verified.slice(0, limit) : verified;
};
```

- [ ] **Step 2: Verify the count**

Run: `node -e "import('./lib/testimonials.js').then(m => { const v = m.getTestimonials('all'); console.log(v.length, v.map(t => t.id).join(',')); })"`
Expected: `4 9,8,7,1`

Then run `npx next build`, and in the browser confirm the homepage renders **4** review cards and `/aesthedent-experience` also shows only those 4.

- [ ] **Step 3: Commit**

```bash
git add lib/testimonials.js
git commit -m "fix(reviews): render only reviews verified on the Google profile

Applied in the shared helper so the homepage and /aesthedent-experience
cannot disagree about which reviews are real. Unverified entries stay in
the file pending audit T4 rather than being deleted."
```

---

### Task 7: Hero, ratings bar, Marathi section, Treatments restyle

**Files:**
- Modify: `app/HomeClient.js:75-96` (trustStats), `:501-647` (hero + trust bar), `:648-712` (Marathi + promise cards), `:801-914` (services)

**Interfaces:**
- Consumes: `STATS` from Task 5.
- Produces: the reordered top half of the homepage.

- [ ] **Step 1: Rewrite `trustStats` to 5 entries**

Replace the array at `app/HomeClient.js:75-96`. Keep the existing count-up component. Update the comment above it -it currently says "REMOVED: 10+ Years Experience (N3) and 5000+ Happy Patients (N4)", which will be false.

| Value | Label | Sub |
|---|---|---|
| `REVIEWS_NUMERIC.rating` (1 decimal) | Google Rating | `${REVIEWS.count} Reviews` |
| `STATS.years` | Years | Experience |
| `STATS.patients` | Happy | Patients |
| `STATS.implants` | Implants | Placed |
| `STATS.rootCanals` | Root Canals | Completed |

`STATS` values are strings with `+` suffixes, so they use the existing `display` field (literal string) rather than `value` (count-up), matching how `'MDS'` already works at line 84.

- [ ] **Step 2: Confirm hero copy and the single `<h1>`**

Hero keeps current live copy. Verify eyebrow, `<h1>` (`HERO_HEADING`, line 58), sub-line, body, and both CTAs match the spec. `HERO_HEADING` must stay in sync with the composed words -the comment at line 46 explains why.

- [ ] **Step 3: Strip the paragraph from the Marathi section**

Remove the `<p>` at `:658-678` -it **moves to Doctors in Task 8**. Cut it, do not retype it: it contains three internal links (`/insights/dental-anxiety-tips`, `/about`, `/dental-clinic-in-kothrud`) that the content spine depends on. Losing them is an SEO regression.

The Marathi `<h2>` stays and gets generous vertical padding -it is a brand statement.

- [ ] **Step 4: Cut the four promise cards**

Cut the `<AdvancedPromiseCard>` block at `:681-711` intact. It moves to Doctors in Task 8. All four, verbatim.

- [ ] **Step 5: Restyle Treatments white + gold**

At `:802`, change `bg-[hsl(var(--primary))]` → `bg-white`. At `:810`, change `text-white` → `text-[hsl(var(--color-accent))]`.

Card text was written for a blue background and will be invisible on white. Every `text-white` and `text-white/*` inside this section must move to `--color-text` / `--color-text-muted`, and card borders need a visible value on white.

**Contrast gate:** gold `39 100% 50%` on white is ~2.1:1 -it FAILS AA for body text. It is permitted for the large `<h2>` only (3:1 large-text threshold, verify at final rendered size). Card body and anchors stay on `--color-text` / `--color-primary`. If the heading fails, darken the token -never a one-off hex.

- [ ] **Step 6: Verify all 8 treatment cards**

Confirm all 8 render (implants, root canal, full mouth rehab, tooth-coloured fillings, wisdom tooth, braces & aligners, dentures, digital smile design) with descriptions from the spec and anchors reading the treatment name (`Dental Implants →`), not "Explore details".

- [ ] **Step 7: Build and commit**

```bash
npx next build
git add app/HomeClient.js
git commit -m "feat(home): 5-stat ratings bar, white/gold treatments, section prep

Treatments moves off blue onto white with a gold heading; card text that
was written for a dark ground moves onto text tokens so it stays legible.
Gold is heading-only -it fails AA against white at body size.

The Marathi section's paragraph and the four promise cards are cut here
and land in Doctors next, so the tree is briefly short two blocks."
```

---

### Task 8: Form mount, visit process, reviews, doctors, contact

**Files:**
- Modify: `app/HomeClient.js` -sections 5 through 9

- [ ] **Step 1: Mount the intake form as section 5**

```jsx
import IntakeWizard from '@/components/forms/IntakeWizard';
```

Full-width section with `<h2>` *"Let's get you seen, comfortably."* and the spec's sub-line. Because the wizard is `'use client'` and `HomeClient.js` already is, no boundary change is needed.

- [ ] **Step 2: Rewrite the visit-process section as a semantic `<ol>`**

Currently a `<div>` of strings at `:757+` with 6 items whose wording does not match the spec. Replace with the spec's 6 steps verbatim, in a real `<ol>`, plus the lead blockquote:

> "We don't just treat teeth -we plan every case with the precision of a specialist and the patience of someone who remembers you're a person, not a procedure."

CTA: `Learn about our process →` → `/aesthedent-experience`.

- [ ] **Step 3: Reviews section**

`<h2>` *"Real Stories From Real Patients"*, sub *"These transformations inspire us every day—and we love sharing them."* Change `limit={3}` → `limit={4}`. Task 6's filter guarantees all 4 are verified. Confirm cards use initials avatars -the `image` fields are Pexels stock photos of unrelated people and must never render (`lib/testimonials.js:26-29`). Footer link: `View all patient stories →`.

- [ ] **Step 4: Doctors section + moved content**

Eyebrow `Our Team`; `<h2>` **`Meet your dentists in Kothrud`** (never "Top Dentists"). Paste the paragraph cut in Task 7 Step 3 as the sub-line, **with its three internal links intact**.

Cards from `DOCTORS` in `lib/clinic.ts` -do not retype credentials:
- Dr. Sahil -`Lead Dentist & Founder` / `Specialist Prosthodontist, Founder & Co-Owner` / `BDS, MDS (Prosthodontics) -Bharati Vidyapeeth, Pune`
- Dr. Aishwarya -`Dental Surgeon` / `General & Family Dentist, Co-Owner` / `BDS -Bharati Vidyapeeth, Pune`

**Dr. Aishwarya must not be called a specialist anywhere in this block.**

Link `Meet the full team →` → `/doctor`. Then paste the four promise cards cut in Task 7 Step 4, verbatim.

- [ ] **Step 5: Ready-to-talk section**

Keep existing content. One change: two CTA options -(a) button → `/contact` labelled `Go to contact page`, and (b) an inline block with `Message on WhatsApp` (via `buildWhatsappMessage()`), a `tel:` button for `+91 93098 16336`, and the address. Hours: `Mon - Sun: 10 AM - 8 PM` + `(Wednesday Holiday)`.

- [ ] **Step 6: Verify exactly one `<h1>`**

Build, serve, then in the browser console:

```js
document.querySelectorAll('h1').length   // must be 1
document.querySelector('h1').textContent // "The dentist that takes the fear away."
```

Also confirm rendered section order: Navbar · Hero+Ratings · Marathi · Treatments · Form · Visit · Reviews · Doctors+Promises · Ready to talk.

- [ ] **Step 7: Build and commit**

```bash
npx tsc --noEmit && npx next build
git add app/HomeClient.js
git commit -m "feat(home): assemble sections to spec

Promise cards and the positioning paragraph land in Doctors. The visit
process becomes a real ordered list. Reviews render the 4 verified cards
with initials avatars -the stock photos in the data file are strangers
and must never appear as patients."
```

## 🛑 STOP -JOB 2 REPORT

Report the rendered section order and confirm exactly one `<h1>`. Do not start Job 3 until the user responds.

---

# JOB 3 -Mobile Design Pass

This is a design pass over the assembled page, not a refactor. No new heavy assets -the ~1.1s load is a constraint.

### Task 9: Type scale, spacing, and rhythm

**Files:**
- Modify: `app/globals.css`, `app/HomeClient.js`

- [ ] **Step 1: Establish the mobile type scale**

Headings use `clamp()` with a real mobile scale -do not just shrink desktop values. Body 16–17px, line-height 1.6–1.75. **Nothing below 14px anywhere.** Cap measure at ~38–42ch on phone via a utility:

```css
.measure { max-width: 42ch; }
@media (min-width: 768px) { .measure { max-width: 65ch; } }
```

- [ ] **Step 2: Normalise section padding and gutters**

Consistent mobile section padding (tighter than desktop, not cramped) and 20–24px gutters, so each section reads as a distinct block.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css app/HomeClient.js
git commit -m "feat(mobile): real mobile type scale and consistent rhythm"
```

---

### Task 10: Per-section mobile rules and width verification

**Files:**
- Modify: `app/HomeClient.js`, `components/forms/IntakeWizard.tsx`

- [ ] **Step 1: Apply the per-section rules**

| Section | Rule |
|---|---|
| Ratings bar (5 stats) | 2-column grid or horizontal scroll -**must not squash** |
| Treatment cards | Single column; overlay text passes AA on white |
| 6-step list | Numbered, one idea per row, scannable |
| Promise cards | Single column, full text readable |
| Doctor cards | Single column, credentials clearly visible |
| Form | Tap targets ≥44×44, primary action thumb-reachable at bottom, inputs ≥16px, `inputMode="numeric"` on phone |
| Reviews | Single column, initials avatars, no truncation mid-sentence |

- [ ] **Step 2: Verify at 360 / 390 / 414px**

Use the Chrome DevTools MCP tools: resize to each width, screenshot, and check for overflow, overlap, and horizontal scroll.

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth  // true at all three
```

- [ ] **Step 3: Confirm no duplicate sticky CTA**

The existing floating WhatsApp button (`components/ui/WhatsAppButton.js`) is enough. Do not add a second sticky bar.

- [ ] **Step 4: Confirm reduced motion**

Emulate `prefers-reduced-motion: reduce` and confirm the wizard swaps steps instantly, the comfort-slider icon does not animate, and count-up stats hold their real values.

- [ ] **Step 5: Build and commit**

```bash
npx tsc --noEmit && npx next build
git add -A
git commit -m "feat(mobile): per-section mobile rules and width fixes

Verified at 360/390/414 -no overflow, overlap, or horizontal scroll."
```

## 🛑 STOP -JOB 3 REPORT

Report with notes at all three widths.

---

## Self-Review Notes

**Spec coverage.** Job 1 sections 1A–1D → Tasks 1–4. Job 2 sections 1–9 → Tasks 5–8 (nav unchanged; hero §2 → Task 7 Step 2; Marathi §3 → Task 7 Step 3; treatments §4 → Task 7 Steps 5–6; form §5 → Task 8 Step 1; visit §6 → Step 2; reviews §7 → Step 3; doctors + promises §8 → Step 4; contact §9 → Step 5). Job 3 → Tasks 9–10.

**Deliberate deviations from the spec, all recorded in the design doc:**
1. Treatments is currently blue; the spec says "keep white". Task 7 Step 5 *makes* it white -the spec describes the target, not the current state.
2. Reviews 2–6 are not deleted as the spec assumes; the flag filter reaches the same rendered outcome (Task 6).
3. `STATS` contradicts a standing comment; Task 5 rewrites the comment rather than ignoring it.
4. Gold-on-white is heading-only. The spec says "gold heading" but does not mention that gold fails AA at body size on white -Task 7 Step 5 constrains it.

**Type consistency.** `Answers` is defined once in Task 1 and referenced unchanged in Tasks 2–4. `getScreens()`, `assembleMessage()`, `normalisePhone()`, `isValidPhone()` keep identical names throughout. `STATS` field names (`years`, `patients`, `implants`, `rootCanals`) match between Task 5 and Task 7.

**Known risk.** `app/HomeClient.js` is 1139 lines and Tasks 7–8 move large JSX blocks between sections. Cut-and-paste whole blocks rather than retyping -the moved paragraph carries three internal links the content spine depends on, and the promise cards carry four blocks of verbatim copy.
