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
