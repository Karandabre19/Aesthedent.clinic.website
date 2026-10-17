import { getPageSeo } from '@/sanity/lib/seo';
import { getPresentationPage } from '@/sanity/lib/presentation-pages';
import { getDoctors } from '@/sanity/lib/pages';
import DoctorClient from './DoctorClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

// NOTE: credentials (BDS/MDS, registration numbers, education) are still
// missing from this page - see audit/NEEDS-INPUT.md C1–C7. Phase 4D builds
// per-doctor pages once Dr. Sahil supplies them.
const fallbackMetadata = {
  title: 'Dentists in Kothrud, Pune - Our Team',
  description:
    'Meet the dentists at Aesthedent in Kothrud, Pune: Dr. Sahil Wathodkar, lead dentist, founder and prosthodontist, and Dr. Aishwarya Kulkarni, surgeon.',
  alternates: {
    canonical: '/doctor',
  },
};
export async function generateMetadata() { return (await getPageSeo('/doctor', fallbackMetadata)).metadata; }

export default async function Page() {
  const seoState = await getPageSeo('/doctor', fallbackMetadata);
  return (
    <>
      <>{seoState.structuredData && <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Our Team', path: '/doctor' },
        ])}
      />}</>
      <DoctorClient presentation={await getPresentationPage('teamPage')} doctorNarratives={await getDoctors()} />
    </>
  );
}
