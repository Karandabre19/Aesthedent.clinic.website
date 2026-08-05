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
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(body)}`;
}

/**
 * Countable patient/case numbers are DELIBERATELY ABSENT.
 *
 * "5000+ Happy Patients", "500+ successful cases", "1000+ patients" and
 * "98% success rate" have all appeared on this site with no source behind any of
 * them (audit/NEEDS-INPUT.md N3, N4, N5, N10). Until Dr. Sahil supplies a real
 * countable figure, the trust number we use is the one anyone can verify for
 * themselves: REVIEWS.count five-star Google reviews.
 *
 * Do not add a patient count here without a source.
 */
