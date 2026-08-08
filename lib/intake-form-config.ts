/**
 * Every string the intake wizard renders. The component holds no copy of its
 * own, so changing what a patient reads means editing this file and nothing
 * else.
 *
 * SHAPE NOTE: there are 9 entries in `steps` but the labels read "of 8".
 * `contactMethod` and `phone` deliberately share "Step 6 of 8" and render on
 * one screen — the spec offers "A phone call" as a contact method, so a number
 * has to be collected or a patient who asks to be called cannot be called.
 * Screens are derived by grouping consecutive entries that share a `label`;
 * see getScreens() in ./intake-form-types.
 *
 * BOUNDARY: this form collects triage context only. No symptom branching, no
 * clinical follow-ups, no suggested treatment. A form that appears to triage is
 * making a clinical claim this site is not allowed to make.
 */
export const INTAKE_FORM = {
  eyebrow: "We're here when you're ready",
  title: "Let's get you seen, comfortably.",
  intro: "Tell us a little about what's going on. No forms with fifty fields — just a short conversation, and we'll take it from there.",

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
        { value: "Not urgent — planning ahead" },
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
          note: "We hear you — many patients feel this way. Raise your hand at any point during treatment and we stop immediately. That's our word." },
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
      placeholder: "Optional — describe symptoms, past treatment, or questions you have",
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
