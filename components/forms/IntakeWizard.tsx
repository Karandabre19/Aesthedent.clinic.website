'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from 'react';
import { Button as ButtonBase } from '@/components/ui/button';
import { Input as InputBase } from '@/components/ui/input';
import { Label as LabelBase } from '@/components/ui/label';
import { Textarea as TextareaBase } from '@/components/ui/textarea';
import { INTAKE_FORM } from '@/lib/intake-form-config';
import { EMPTY_ANSWERS, getScreens } from '@/lib/intake-form-types';
import type { StepConfig } from '@/lib/intake-form-types';
import { isValidPhone } from '@/lib/intake-form-message';
import type { Answers } from '@/lib/intake-form-message';

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
 * Field rendering (Task 3) and the review screen + WhatsApp send (Task 4) are
 * deliberately NOT built here — each unfilled screen shows a disabled
 * placeholder control so the wizard is fully navigable and typecheckable in
 * the meantime, and the review step (screen === TOTAL) shows a short stand-in
 * section instead of the answer table and send button.
 *
 * WHAT THIS IS NOT: a diagnostic tool. This screen shell renders whatever
 * question config/steps supply; it adds no clinical branching of its own —
 * an intake form that appears to triage is making a clinical claim this site
 * is not allowed to make.
 *
 * State is React-local only. Nothing is persisted: no localStorage, no
 * sessionStorage, no network call.
 */

// 9 step configs collapse into 8 screens because `contactMethod` and `phone`
// share the label "Step 6 of 8" and render together — see getScreens().
const SCREENS = getScreens();
const TOTAL = SCREENS.length;

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

/**
 * Stand-in for Task 3's real field renderers (text / single-select / slider /
 * tel / day-time / textarea). Disabled and non-interactive on purpose — this
 * task wires screens, validation, focus and nav, not inputs.
 */
function FieldPlaceholder({ step }: { step: StepConfig }) {
  const inputId = `iw-${step.id}`;
  const Control = step.type === 'textarea' ? Textarea : Input;
  return (
    <div>
      <Label htmlFor={inputId} className="sr-only">
        {step.question}
      </Label>
      <Control
        id={inputId}
        disabled
        readOnly
        aria-hidden="true"
        tabIndex={-1}
        placeholder={`Task 3 renders a "${step.type}" control here`}
        className="mt-2 h-12 text-base opacity-60"
      />
    </div>
  );
}

/* ── the wizard ──────────────────────────────────────────────────────────── */

export default function IntakeWizard() {
  const [screen, setScreen] = useState(0); // 0-indexed; screen === TOTAL is the review step
  const [a, setA] = useState<Answers>(EMPTY_ANSWERS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Read and set by Task 4's review/send screen; declared here so the state
  // shape doesn't shift under that task.
  const [sent, setSent] = useState(false);

  const reduceMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

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
            // Task 4 replaces this with the answer table and the WhatsApp send
            // button (a real <a href target="_blank">, never window.open).
            <section aria-labelledby="step-h">
              <h3
                id="step-h"
                ref={headingRef}
                tabIndex={-1}
                className="mb-2 text-xl font-semibold text-[hsl(var(--color-text))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary))] focus-visible:ring-offset-2"
              >
                {INTAKE_FORM.review.title}
              </h3>
              <p className="text-[hsl(var(--color-text-muted))]">
                Review screen coming soon — your answers are safe, nothing has been sent.
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
                  <FieldPlaceholder step={step} />
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
            {INTAKE_FORM.buttons.back}
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}

        {!isReview && (
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
