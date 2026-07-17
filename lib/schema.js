// Centralised JSON-LD. Single source of truth for NAP so the clinic's details
// can never drift between the Dentist block, the footer and the contact page.
//
// Coverage decisions are grounded in audit/02-schema-matrix.md, which measured
// all 10 competitors:
//   - FAQPage:       only 1 of 10 competitors has it, and 28 FAQs are already
//                    written in lib/services.js. Cheapest real differentiator.
//   - Organization
//     + WebSite:     every fetchable competitor has both; we had neither.
//   - BreadcrumbList: 5 of 10 have it; we had none.
//   - MedicalProcedure: ZERO of 10 have it. Included because it is accurate and
//                    differentiating, NOT because it closes a gap.
//   - AggregateRating: DELIBERATELY ABSENT. See the note on buildAggregateRating
//                    at the bottom of this file.

export const SITE_URL = 'https://www.aesthedentpune.com';
const CLINIC_ID = `${SITE_URL}/#clinic`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const NAP = {
  name: 'Aesthedent Dental Clinic',
  streetAddress: 'No.5 First Floor, AJ Tower, above Irani Cafe, Dahanukar Colony, Kothrud',
  addressLocality: 'Pune',
  addressRegion: 'Maharashtra',
  postalCode: '411038',
  addressCountry: 'IN',
  telephone: '+919309816336',
  latitude: 18.497271,
  longitude: 73.813467,
  mapUrl: 'https://maps.app.goo.gl/BVb9iy5EQkmbYSVPA',
};

// Every URL below was OBSERVED ranking in the Phase 2C brand SERP for
// "aesthedent dental clinic kothrud" (audit/raw/2c-serp-indexation.json) and
// then checked to resolve. None are reconstructed or guessed — a sameAs that
// 404s is a false statement to Google about who we are.
// Verified 2026-07-17: all return 200 except Practo, which returns 403 to
// non-browser agents while ranking at #5 — bot-blocking, not a dead link.
export const SAME_AS = [
  'https://maps.app.goo.gl/BVb9iy5EQkmbYSVPA',
  'https://www.facebook.com/p/Aesthedent-Dental-Clinic-Kothrud-100063903827787/',
  'https://www.instagram.com/drwathodkar_aesthedent_clinic/',
  'https://www.practo.com/pune/clinic/aesthedent-dental-clinic-kothrud',
  'https://kivihealth.com/clinic/aesthedent-dental-clinic,-kothrud',
  'https://www.justdial.com/Pune/Aesthedent-Dental-Clinic-Kothrud-Above-Irani-Cafe-Dahanukar-Colony-Kothrud/020PXX20-XX20-211118031742-X6C4_BZDET',
];

const openingHours = [
  {
    '@type': 'OpeningHoursSpecification',
    // Wednesday is deliberately absent — the clinic is closed. Verified against
    // the live Google Business Profile in audit/02-gbp-comparison.md.
    dayOfWeek: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '10:00',
    closes: '20:00',
  },
];

/** Dentist + LocalBusiness. The primary local entity. */
export function buildClinicSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Dentist', 'LocalBusiness'],
    '@id': CLINIC_ID,
    name: NAP.name,
    url: SITE_URL,
    image: `${SITE_URL}/aesthadent_logo.png`,
    logo: `${SITE_URL}/aesthadent_logo.png`,
    telephone: NAP.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: NAP.streetAddress,
      addressLocality: NAP.addressLocality,
      addressRegion: NAP.addressRegion,
      postalCode: NAP.postalCode,
      addressCountry: NAP.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: NAP.latitude,
      longitude: NAP.longitude,
    },
    hasMap: NAP.mapUrl,
    openingHoursSpecification: openingHours,
    // Areas we genuinely serve from Kothrud. Kept to the immediate catchment —
    // claiming all of Pune would be a lie a search engine can check.
    areaServed: [
      'Kothrud', 'Karve Nagar', 'Deccan', 'Erandwane', 'Warje', 'Bavdhan', 'Paud Road',
    ].map((n) => ({ '@type': 'Place', name: `${n}, Pune` })),
    medicalSpecialty: 'Dentistry',
    sameAs: SAME_AS,
    // NOTE: no priceRange. We publish no pricing anywhere (NEEDS-INPUT P1-P12),
    // so any value here would be invented.
    // NOTE: no aggregateRating. See buildAggregateRating below.
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: NAP.name,
    url: SITE_URL,
    logo: `${SITE_URL}/aesthadent_logo.png`,
    telephone: NAP.telephone,
    sameAs: SAME_AS,
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: NAP.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-IN',
  };
}

/**
 * BreadcrumbList. `trail` is [{ name, path }] ordered root -> current.
 * The current page is included with its own URL, per Google's guidance.
 */
export function buildBreadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

/**
 * FAQPage from the FAQs already written in lib/services.js.
 * Returns null for an empty list — an FAQPage with no questions is invalid.
 */
export function buildFaqSchema(faqs) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** MedicalProcedure for a service page. */
export function buildProcedureSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: service.title,
    description: service.shortDesc,
    url: `${SITE_URL}/services/${service.slug}`,
    procedureType: 'https://schema.org/TherapeuticProcedure',
    bodyLocation: 'Mouth',
    howPerformed: service.process?.map((p) => `${p.title}: ${p.desc}`).join(' '),
    provider: { '@id': CLINIC_ID },
  };
}

/**
 * NOT WIRED UP — deliberately.
 *
 * The real values are known: 277 reviews at 5.0, measured from the live Google
 * Business Profile on 2026-07-17 (audit/02-gbp-comparison.md). The site itself
 * still displays a stale 263.
 *
 * Two reasons this stays unused until the clinic confirms:
 *  1. aggregateRating states a fact to Google. It should not ship on a number
 *     nobody has signed off, and review counts drift daily.
 *  2. Self-serving AggregateRating in LocalBusiness/Dentist markup is outside
 *     Google's guidelines and is ignored for rich results — 4 competitors do it
 *     anyway. It is a parity move, not a star-rating win. Worth knowing before
 *     choosing to ship it.
 *
 * To enable: confirm the numbers, then spread this into buildClinicSchema().
 */
export function buildAggregateRating({ ratingValue, reviewCount }) {
  return {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}
