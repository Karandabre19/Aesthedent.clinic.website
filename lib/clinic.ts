/**
 * Single source of truth for clinic facts that appear in more than one place.
 *
 * Phase 4B. Before this file existed the review count was hardcoded in three
 * separate spots and all three disagreed: HomeClient said 277, AboutClient said
 * 263, and lib/schema.js documented 277 in a comment while shipping nothing.
 * A number that states a fact to Google cannot live in three places.
 *
 * RULE: nothing in this file is a marketing claim. Every value here is
 * externally checkable - the Google Business Profile, or a qualification
 * certificate. If you cannot check it, it does not belong here; it belongs in
 * audit/NEEDS-INPUT.md until someone can.
 */

/**
 * Google Business Profile, as supplied by the clinic 2026-08-03.
 * Previously measured at 277 @ 5.0 on 2026-07-17 (audit/02-gbp-comparison.md).
 *
 * This drifts. When it does, change it HERE and nowhere else.
 */
export const REVIEWS = { rating: '5.0', count: '280' } as const;

/**
 * Numeric forms, derived - never typed out a second time. The homepage trust bar
 * counts up to these, so it needs numbers, not strings.
 */
export const REVIEWS_NUMERIC = {
  rating: Number(REVIEWS.rating),
  count: Number(REVIEWS.count),
} as const;

/**
 * Verified credentials. Confirmed by the clinic 2026-08-03 and already published
 * on /doctor.
 *
 * PRECISION MATTERS HERE. Dr. Sahil holds an MDS and is a specialist
 * prosthodontist. Dr. Aishwarya holds a BDS and is a general and family dentist
 * - she is NOT a specialist, and nothing on the site may imply she is. The
 * clinic is "specialist prosthodontist-led" through Dr. Sahil alone. Overclaiming
 * on a health site is both a trust failure and a regulatory one.
 */
export const DOCTORS = {
  sahil: {
    name: 'Dr. Sahil Wathodkar',
    role: 'Founder & Co-Owner | Prosthodontist',
    /** The qualification that makes "specialist" a fact rather than an adjective. */
    credential: 'BDS, MDS (Prosthodontics) - Bharati Vidyapeeth, Pune',
    shortCredential: 'MDS Prosthodontist',
    isSpecialist: true,
    /** NEEDS-INPUT R1 - Maharashtra State Dental Council registration number. */
    registrationNumber: null,
  },
  aishwarya: {
    name: 'Dr. Aishwarya Kulkarni Wathodkar',
    role: 'Co-Owner | General & Family Dentist',
    credential: 'BDS - Bharati Vidyapeeth, Pune',
    shortCredential: 'BDS, General & Family Dentist',
    isSpecialist: false,
    /** NEEDS-INPUT R2 - registration number. */
    registrationNumber: null,
  },
} as const;

/**
 * Opening hours, matching openingHoursSpecification in app/layout.tsx and the
 * live Google Business Profile (both verified 2026-07-17).
 * Mon-Tue 10-8 · Wed CLOSED · Thu-Sun 10-8 - six days, weekends included.
 */
export const OPENING = {
  daysOpenPerWeek: 6,
  closedDay: 'Wednesday',
  hours: '10am–8pm',
} as const;

/**
 * DIGITS ONLY -country code + number, no '+', no dashes, no spaces.
 *
 * This is not a display string. It is interpolated straight into the `phone`
 * query parameter of the click-to-chat URL below, and WhatsApp rejects any
 * separator there: '91-9309816336' produces a link that opens WhatsApp to
 * nothing. Formatting it for readability silently breaks every WhatsApp CTA on
 * the site at once -the service pages, the Kothrud area page and the intake
 * form all route through buildWhatsappLink().
 *
 * If a human-readable form is ever needed on screen, add a SEPARATE export for
 * it. Do not punctuate this one.
 */
export const WHATSAPP_NUMBER = '919309816336';

/**
 * Builds a WhatsApp deep link whose prefilled message names what the patient was
 * actually reading.
 *
 * Every WhatsApp CTA on the site previously sent the same generic "I would like
 * to book an appointment", so the front desk had no idea whether the enquiry came
 * from the implants page or the braces page. Pass the service title to fix that.
 */
export function buildWhatsappMessage(context?: string): string {
  const body = context
    ? `Hello, Aesthedent Dental Clinic.\nI was reading about ${context} and would like to ask a few questions.`
    : 'Hello, Aesthedent Dental Clinic.\nI would like to book an appointment.';
  return buildWhatsappLink(body);
}

/**
 * The ONE place a wa.me / click-to-chat URL is constructed. Everything that
 * opens WhatsApp goes through here so the number and the encoding live in a
 * single spot -buildWhatsappMessage() above is a thin wrapper over it, and the
 * intake wizard passes its assembled body straight in.
 *
 * This is click-to-chat: it opens WhatsApp with the text prefilled and the
 * PATIENT taps send. It cannot auto-send -no website can without the paid
 * WhatsApp Business API -and that is the behaviour we want, because the enquiry
 * then arrives from the patient's own number and the front desk can just reply.
 */
export function buildWhatsappLink(body: string): string {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(body)}`;
}

/**
 * Countable figures, confirmed by Dr. Sahil on 2026-08-08.
 *
 * THIS BLOCK USED TO BE A PROHIBITION. "5000+ Happy Patients", "500+ successful
 * cases", "1000+ patients" and "98% success rate" had all shipped with no source
 * behind any of them (audit/NEEDS-INPUT.md N3, N4, N5, N10), and were stripped.
 *
 * The rule was never "no numbers" -it was "no numbers without a source", and it
 * named its own release condition: until Dr. Sahil supplies a real countable
 * figure. He has. These four are his, given 2026-08-08, and that is why they are
 * here when the earlier ones were removed.
 *
 * Anything NOT in this object still needs a source before it ships. "98% success
 * rate" in particular was NOT reinstated and must not be.
 *
 * rootCanals is a COUNT OF PROCEDURES. It renders as "Root Canals / Completed"
 * and must never be labelled "Painless Root Canals" -pain is an outcome that
 * varies by patient and procedure, which is precisely why "100% Painless
 * Treatments" was removed from the trust bar already.
 */
export const STATS = {
  years: '10+',
  patients: '1000+',
  implants: '100+',
  rootCanals: '500+',
} as const;
