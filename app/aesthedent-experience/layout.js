// Fixed in Phase 1:
//  - URLs pointed at https://aesthedent.clinic (wrong domain — live site is
//    www.aesthedentpune.com), so OG/canonical referenced a site we don't own.
//  - `canonical` was a top-level key; the valid Next.js key is
//    `alternates.canonical`, so no canonical tag was ever emitted.
//  - `openGraph.image` / `twitter.image` are not valid keys (they are `images`,
//    plural), so both social images were silently dropped.
// Wording is provisional pending Phase 2 keyword data — see Phase 4A.
export const metadata = {
  // `absolute` bypasses the root "%s | Aesthedent" template — the brand is
  // already in this page's name, and the template would double it.
  title: { absolute: 'The Aesthedent Experience | Kothrud, Pune' },
  description:
    'How we work: specialist-led implants, full mouth rehabilitation and prosthodontic care in Kothrud, Pune. We explain every step before we start.',
  alternates: {
    canonical: '/aesthedent-experience',
  },
  openGraph: {
    title: 'The Aesthedent Experience | Aesthedent',
    description:
      'A specialist-led approach to implants, rehabilitation and long-term oral health in Kothrud, Pune.',
    url: 'https://www.aesthedentpune.com/aesthedent-experience',
    siteName: 'Aesthedent Dental Clinic',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/homepage-banner.png',
        width: 1200,
        height: 630,
        alt: 'Aesthedent Dental Clinic, Kothrud, Pune',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Aesthedent Experience | Aesthedent',
    description:
      'Specialist-led implants, full mouth rehabilitation and prosthodontic care in Kothrud, Pune.',
    images: ['/homepage-banner.png'],
  },
};

export default function LandingPageLayout({ children }) {
  return children;
}
