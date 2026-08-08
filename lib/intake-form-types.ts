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
