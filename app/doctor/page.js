import { BacklinkReferences } from '@/components/seo/BacklinkReferences';
import { getPageSeo } from '@/sanity/lib/seo';
import { getPresentationPage } from '@/sanity/lib/presentation-pages';
import { getDoctors, getTeamValues } from '@/sanity/lib/pages';
import DoctorClient from './DoctorClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

// Doctor documents own photos and qualifications. Registration/identity facts
// retain their existing source; this page never invents missing credentials.
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
      <DoctorClient backlinkSection={<BacklinkReferences entries={seoState.backlinks} />} presentation={await getPresentationPage('teamPage')} doctorNarratives={await getDoctors()} teamValues={await getTeamValues()} />
    </>
  );
}
