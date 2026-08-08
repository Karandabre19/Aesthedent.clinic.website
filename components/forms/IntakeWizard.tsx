'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Hand } from 'lucide-react';
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from 'react';
import { Button as ButtonBase } from '@/components/ui/button';
import { Input as InputBase } from '@/components/ui/input';
import { Label as LabelBase } from '@/components/ui/label';
import { Textarea as TextareaBase } from '@/components/ui/textarea';
import { INTAKE_FORM } from '@/lib/intake-form-config';
import { EMPTY_ANSWERS, getScreens } from '@/lib/intake-form-types';
import type { StepConfig } from '@/lib/intake-form-types';
import { assembleMessage, isValidPhone, normalisePhone } from '@/lib/intake-form-message';
import type { Answers } from '@/lib/intake-form-message';
import { buildWhatsappLink, WHATSAPP_NUMBER } from '@/lib/clinic';

// The shadcn kit under components/ui is untyped .jsx (the project sets
// checkJs:false), so TypeScript infers "no props at all" for each forwardRef
// export and rejects every attribute. These aliases restore prop typing at the
// call site WITHOUT touching the shared kit — every other page imports those
// same files as plain JS and must keep working. Task 3's field renderers reuse
// Input/Label/Textarea from here; only Button is exercised by this file today.
const Button = ButtonBase as ComponentType<
  ComponentPropsWithoutRef<'button'> & { variant?: string; size?: string; asChild?: boolean }
>;
const Input = InputBase as ComponentType<ComponentPropsWithoutRef<'input'>>;
const Label = LabelBase as ComponentType<ComponentPropsWithoutRef<'label'>>;
const Textarea = TextareaBase as ComponentType<ComponentPropsWithoutRef<'textarea'>>;

/**
 * The intake wizard's shell: screens, progress, validation and focus.
 *
 * The review step (screen === TOTAL) renders a definition list of every
 * non-empty answer plus the WhatsApp send button (a real anchor — see
 * `waLink` below). This is click-to-chat: WhatsApp opens with the message
 * prefilled and the PATIENT taps send there; the site never transmits
 * anything itself. The six field renderers (text, tel, textarea,
 * single-select, slider, day-time) are also built here, see `Field` below,
 * dispatched on `step.type`.
 *
 * WHAT THIS IS NOT: a diagnostic tool. This screen shell renders whatever
 * question config/steps supply; it adds no clinical branching of its own —
 * an intake form that appears to triage is making a clinical claim this site
 * is not allowed to make. The comfort slider (Step 5) is reassurance copy
 * only: it swaps a sentence of text and never gates navigation or alters any
 * other answer.
 *
 * State is React-local only. Nothing is persisted: no localStorage, no
 * sessionStorage, no network call.
 */

// 9 step configs collapse into 8 screens because `contactMethod` and `phone`
// share the label "Step 6 of 8" and render together — see getScreens().
const SCREENS = getScreens();
const TOTAL = SCREENS.length;

// lib/clinic.ts's WHATSAPP_NUMBER is the single source of truth for the
// clinic's number and is deliberately digits-only, because it goes into a URL
// parameter. There is no separately-exported tel: form, so the '+' is added
// here rather than hardcoding the digits a second time. The strip is defensive:
// if anyone punctuates the constant again, the tel: link still works even
// though the WhatsApp link would not.
const CLINIC_TEL = `+${WHATSAPP_NUMBER.replace(/[^\d]/g, '')}`;

/* ── small presentational pieces ─────────────────────────────────────────── */

/**
 * Renders TOTAL segments driven by the SCREEN index, never the config index —
 * with 9 configs and 8 screens those are not the same number.
 */
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

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-2 text-sm font-medium text-[hsl(var(--destructive))]">
      {children}
    </p>
  );
}

/** Updates one answer field. Generic per-call so `set('comfort', 0)` stays a
 * number and `set('name', 'x')` stays a string — no `string | number` union
 * to accidentally widen the wrong field. */
type SetAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => void;

const optionButtonBase =
  'flex min-h-[56px] w-full flex-col items-start justify-center gap-0.5 rounded-2xl border p-4 text-left text-base transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary))] focus-visible:ring-offset-2';
const optionButtonState = (selected: boolean) =>
  selected
    ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]/5 shadow-sm'
    : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:border-[hsl(var(--color-primary))]/50';

/**
 * Dispatches on `step.type` and renders the real control for one of the six
 * question shapes the config can describe. Every control reads its current
 * value from `a` and writes through `set`; errors are looked up by
 * `step.id` (the shell already keys `errors` that way, including the
 * `schedule` step's combined day/time error) and rendered by the caller via
 * `FieldError` — this component only wires `aria-describedby` /
 * `aria-invalid` so the two stay associated.
 */
function Field({
  step,
  a,
  set,
  setErrors,
  errors,
}: {
  step: StepConfig;
  a: Answers;
  set: SetAnswer;
  setErrors: (e: Record<string, string>) => void;
  errors: Record<string, string>;
}) {
  const inputId = `iw-${step.id}`;
  const errorId = `${inputId}-err`;
  const hasError = Boolean(errors[step.id]);

  switch (step.type) {
    case 'text': {
      return (
        <div>
          <Label htmlFor={inputId} className="sr-only">
            {step.question}
          </Label>
          <Input
            id={inputId}
            type="text"
            autoComplete={step.autocomplete}
            placeholder={step.placeholder}
            value={a[step.id]}
            onChange={(e) => set(step.id, e.target.value)}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            className="text-base"
          />
        </div>
      );
    }

    case 'tel': {
      return (
        <div>
          <Label htmlFor={inputId} className="sr-only">
            {step.question}
          </Label>
          <Input
            id={inputId}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder={step.placeholder}
            value={a[step.id]}
            onChange={(e) => set(step.id, e.target.value)}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            className="text-base"
          />
        </div>
      );
    }

    case 'textarea': {
      return (
        <div>
          <Label htmlFor={inputId} className="sr-only">
            {step.question}
          </Label>
          <Textarea
            id={inputId}
            placeholder={step.placeholder}
            value={a[step.id]}
            onChange={(e) => set(step.id, e.target.value)}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            rows={4}
            className="text-base"
          />
        </div>
      );
    }

    case 'single-select': {
      const gridCols = step.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1';
      return (
        <div
          role="group"
          aria-label={step.question}
          aria-describedby={hasError ? errorId : undefined}
          className={`grid gap-3 ${gridCols}`}
        >
          {step.options.map((option) => {
            const selected = a[step.id] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  set(step.id, option.value);
                  setErrors({});
                }}
                className={`${optionButtonBase} ${optionButtonState(selected)}`}
              >
                <span className="font-medium text-[hsl(var(--color-text))]">{option.value}</span>
                {'sub' in option && option.sub && (
                  <span className="text-sm text-[hsl(var(--color-text-muted))]">{option.sub}</span>
                )}
              </button>
            );
          })}
        </div>
      );
    }

    case 'slider': {
      const levels = step.levels;
      const comfort = a.comfort;
      return (
        <div>
          <div className="flex items-center gap-4">
            <Hand
              aria-hidden="true"
              style={{ transform: `scale(${1 + comfort * 0.12}) rotate(${comfort * -8}deg)` }}
              className="h-8 w-8 shrink-0 text-[hsl(var(--color-primary))] transition-transform duration-300 motion-reduce:transition-none"
            />
            <input
              id={inputId}
              type="range"
              min={0}
              max={2}
              step={1}
              value={comfort}
              onChange={(e) => set('comfort', Number(e.target.value))}
              aria-valuetext={levels[comfort].value}
              aria-label={step.question}
              aria-describedby={hasError ? errorId : undefined}
              className="h-11 w-full accent-[hsl(var(--color-primary))]"
            />
          </div>
          <p aria-live="polite" className="mt-4 text-base text-[hsl(var(--color-text-muted))]">
            {levels[comfort].note}
          </p>
        </div>
      );
    }

    case 'day-time': {
      return (
        <div>
          <fieldset>
            <legend className="mb-2 text-base font-medium text-[hsl(var(--color-text))]">
              {INTAKE_FORM.review.rowLabels.day}
            </legend>
            <div
              className="grid grid-cols-3 gap-2 sm:grid-cols-4"
              aria-describedby={hasError ? errorId : undefined}
            >
              {step.days.map((day) => {
                const disabled = 'disabled' in day && Boolean(day.disabled);
                const title = 'title' in day ? day.title : undefined;
                const selected = a.day === day.value;
                return (
                  <button
                    key={day.value}
                    type="button"
                    disabled={disabled}
                    title={title}
                    aria-pressed={selected}
                    onClick={() => {
                      set('day', day.value);
                      setErrors({});
                    }}
                    className={`min-h-[44px] min-w-[44px] rounded-xl border px-3 py-2 text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
                      selected
                        ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]/5 text-[hsl(var(--color-primary))]'
                        : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:border-[hsl(var(--color-primary))]/50'
                    }`}
                  >
                    {day.value}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="mb-2 text-base font-medium text-[hsl(var(--color-text))]">
              {INTAKE_FORM.review.rowLabels.time}
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {step.times.map((time) => {
                const selected = a.time === time.value;
                return (
                  <button
                    key={time.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      set('time', time.value);
                      setErrors({});
                    }}
                    className={`min-h-[44px] w-full rounded-xl border px-3 py-2 text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary))] focus-visible:ring-offset-2 ${
                      selected
                        ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]/5 text-[hsl(var(--color-primary))]'
                        : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:border-[hsl(var(--color-primary))]/50'
                    }`}
                  >
                    {time.value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      );
    }

    default:
      return null;
  }
}

/* ── the wizard ──────────────────────────────────────────────────────────── */

export default function IntakeWizard() {
  const [screen, setScreen] = useState(0); // 0-indexed; screen === TOTAL is the review step
  const [a, setA] = useState<Answers>(EMPTY_ANSWERS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Set true when the patient taps "Send via WhatsApp"; only ever flips the
  // on-screen reassurance copy below the review table — it cannot know
  // whether WhatsApp actually opened or whether the patient went on to tap
  // send there, so it never claims the message was sent.
  const [sent, setSent] = useState(false);

  const reduceMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const set: SetAnswer = (key, value) => setA((prev) => ({ ...prev, [key]: value }));

  // The comfort LABEL is resolved here, not inside assembleMessage — that keeps
  // lib/intake-form-message.ts import-free so its checks can load the real code.
  const comfortLevels = (INTAKE_FORM.steps.find((s) => s.id === 'comfort') as {
    levels?: readonly { value: string; note: string }[];
  }).levels!;

  const message = useMemo(
    () => assembleMessage(a, comfortLevels[a.comfort]?.value ?? ''),
    [a, comfortLevels],
  );
  const waLink = useMemo(() => buildWhatsappLink(message), [message]);

  // Same rows assembleMessage sends, in the same order, so the table the
  // patient reviews matches the message it will send exactly — including
  // which optional rows (comfort default aside, chiefly notes) are skipped
  // when left blank.
  const { rowLabels } = INTAKE_FORM.review;
  const reviewRows = useMemo<[string, string][]>(
    () =>
      (
        [
          [rowLabels.name, a.name.trim()],
          [rowLabels.patientFor, a.patientFor],
          [rowLabels.reason, a.reason],
          [rowLabels.duration, a.duration],
          [rowLabels.comfort, comfortLevels[a.comfort]?.value ?? ''],
          [rowLabels.contactMethod, a.contactMethod],
          [rowLabels.phone, normalisePhone(a.phone)],
          [rowLabels.day, a.day],
          [rowLabels.time, a.time],
          [rowLabels.notes, a.notes.trim()],
        ] as [string, string][]
      ).filter(([, v]) => v),
    [a, comfortLevels, rowLabels],
  );

  // Move focus to the new screen's heading so screen-reader and keyboard users
  // are told where they landed. Skipped on first paint so the page does not
  // steal focus on load.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [screen]);

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

  function next() {
    if (validate(screen)) setScreen((s) => Math.min(s + 1, TOTAL));
  }
  function back() {
    setErrors({});
    setScreen((s) => Math.max(s - 1, 0));
  }

  const variants = reduceMotion
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  const isReview = screen === TOTAL;

  return (
    <div>
      <ProgressBar screen={screen} total={TOTAL} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={screen}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {isReview ? (
            <section aria-labelledby="step-h">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--color-primary))]">
                {INTAKE_FORM.review.label}
              </p>
              <h3
                id="step-h"
                ref={headingRef}
                tabIndex={-1}
                className="mb-6 text-xl font-semibold text-[hsl(var(--color-text))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary))] focus-visible:ring-offset-2"
              >
                {INTAKE_FORM.review.title}
              </h3>

              <dl className="divide-y divide-[hsl(var(--border))] overflow-hidden rounded-2xl border border-[hsl(var(--border))]">
                {reviewRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-col gap-0.5 bg-[hsl(var(--color-bg-alt))] px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <dt className="shrink-0 text-sm font-medium text-[hsl(var(--color-text-muted))]">
                      {label}
                    </dt>
                    <dd className="text-base text-[hsl(var(--color-text))] sm:text-right">{value}</dd>
                  </div>
                ))}
              </dl>

              {sent && (
                <p role="status" className="mt-4 text-sm text-[hsl(var(--color-text-muted))]">
                  WhatsApp opened in a new tab with this message ready to go — just tap send there
                  and we&apos;ll take it from there.
                </p>
              )}

              <p className="mt-6 text-base text-[hsl(var(--color-text-muted))]">
                {INTAKE_FORM.review.callAlt}{' '}
                <a
                  href={`tel:${CLINIC_TEL}`}
                  className="font-semibold text-[hsl(var(--color-primary))] underline underline-offset-4 hover:no-underline"
                >
                  {INTAKE_FORM.review.callAltStrong}
                </a>
              </p>
            </section>
          ) : (
            <section aria-labelledby="step-h">
              {SCREENS[screen].map((step, i) => (
                <div key={step.id} className={i > 0 ? 'mt-8' : undefined}>
                  <h3
                    id={i === 0 ? 'step-h' : undefined}
                    ref={i === 0 ? headingRef : undefined}
                    tabIndex={i === 0 ? -1 : undefined}
                    className="mb-2 text-xl font-semibold text-[hsl(var(--color-text))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary))] focus-visible:ring-offset-2"
                  >
                    {step.question}
                  </h3>
                  {'helper' in step && step.helper && (
                    <p className="mb-4 text-[hsl(var(--color-text-muted))]">{step.helper}</p>
                  )}
                  <Field step={step} a={a} set={set} setErrors={setErrors} errors={errors} />
                  {errors[step.id] && (
                    <FieldError id={`iw-${step.id}-err`}>{errors[step.id]}</FieldError>
                  )}
                </div>
              ))}
            </section>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav — thumb-reachable on mobile */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {screen > 0 ? (
          <Button variant="outline" onClick={back} className="h-12 px-6">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            {isReview ? INTAKE_FORM.review.backButton : INTAKE_FORM.buttons.back}
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {isReview ? (
          // Real anchor, not window.open: it survives popup blockers and
          // supports long-press / middle-click. This is click-to-chat — the
          // patient still taps send inside WhatsApp; the site never
          // transmits the message itself.
          <Button
            asChild
            className="h-12 bg-[hsl(var(--color-primary))] px-8 text-base hover:opacity-90"
          >
            <a href={waLink} target="_blank" rel="noopener noreferrer" onClick={() => setSent(true)}>
              {INTAKE_FORM.review.sendButton}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        ) : (
          <Button
            onClick={next}
            className="h-12 bg-[hsl(var(--color-primary))] px-8 text-base hover:opacity-90"
          >
            {screen === TOTAL - 1 ? INTAKE_FORM.buttons.review : INTAKE_FORM.buttons.continue}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
