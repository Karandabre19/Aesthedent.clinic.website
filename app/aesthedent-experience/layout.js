// Fixed in Phase 1:
//  - URLs pointed at https://aesthedent.clinic (wrong domain - live site is
//    www.aesthedentpune.com), so OG/canonical referenced a site we don't own.
//  - `canonical` was a top-level key; the valid Next.js key is
//    `alternates.canonical`, so no canonical tag was ever emitted.
//  - `openGraph.image` / `twitter.image` are not valid keys (they are `images`,
//    plural), so both social images were silently dropped.
// Wording is provisional pending Phase 2 keyword data - see Phase 4A.
export const metadata = {
  // `absolute` bypasses the root "%s | Aesthedent" template - the brand is
  // already in this page's name, and the template would double it.
  //
  // Phase 4B: was 'The Aesthedent Experience | Kothrud, Pune' - brand-first, for
  // a brand term with effectively no search volume. This is one of only THREE
  // pages Google has indexed (audit/02-serp-positions.md), so a third of our
  // entire index presence was pointed at a query nobody types. Repointed at
  // "painless dental treatment kothrud", which the page's existing 1,454 words
  // already describe.
  //
  // D9 applied 2026-08-04: was 66 chars, which truncated the brand out of the
  // SERP. Now 48. "Specialist-Led" was dropped because the H1 and the meta
  // description both already carry it - the brand does not survive anywhere else.
  title: { absolute: 'Painless Dental Treatment in Kothrud | Aesthedent' },
  description:
    'Painless dental treatment in Kothrud, Pune. We explain every step before we start, so nothing catches you by surprise. Specialist prosthodontist-led.',
  alternates: {
    canonical: '/aesthedent-experience',
  },
  openGraph: {
    title: 'Painless Dental Treatment in Kothrud | Aesthedent',
    description:
      'What it is like to be treated here: we show you the scan, explain it in plain words, and agree the plan before anything begins.',
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
    title: 'Painless Dental Treatment in Kothrud | Aesthedent',
    description:
      'Specialist prosthodontist-led treatment in Kothrud, Pune. We explain every step before we start.',
    images: ['/homepage-banner.png'],
  },
};

export default function LandingPageLayout({ children }) {
  return children;
}
