import type { Metadata } from "next";
export const siteMetadata: Metadata = {
  metadataBase: new URL('https://www.aesthedentpune.com'),
  title: {
    default: 'Dentist in Kothrud, Pune | Aesthedent Dental Clinic',
    // Child routes supply just their own name; the brand is appended here so it
    // stays last, never first.
    template: '%s | Aesthedent',
  },
  description:
    'Aesthedent is a dental clinic in Kothrud, Pune. Implants, root canals and full mouth rehabilitation, led by a prosthodontist. Open weekends.',
  // Deliberately NO `alternates.canonical` here. Child routes inherit root
  // metadata, so a canonical set at this level points every page at "/" and
  // asks Google to de-index the site. Each route declares its own.
  openGraph: {
    title: 'Dentist in Kothrud, Pune | Aesthedent Dental Clinic',
    description: 'A dental clinic in Kothrud, Pune. Implants, root canals and full mouth rehabilitation. We explain everything before we start.',
    url: 'https://www.aesthedentpune.com',
    siteName: 'Aesthedent Dental Clinic',
    locale: 'en_IN',
    type: 'website',
    // Dimensions must match the real file (1672x941), not the 1200x630 OG
    // template size - crawlers lay the card out from these numbers, so a wrong
    // ratio gets the preview letterboxed or cropped. Stays the landscape
    // banner: the portrait mobile crop is wrong for a social card.
    images: [{ url: '/homepage-banner.png', width: 1672, height: 941, alt: 'Aesthedent Dental Clinic, Kothrud, Pune' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dentist in Kothrud, Pune | Aesthedent Dental Clinic',
    description: 'A dental clinic in Kothrud, Pune. Implants, root canals and full mouth rehabilitation.',
    images: ['/homepage-banner.png'],
  },
};
