import DoctorClient from './DoctorClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

// NOTE: credentials (BDS/MDS, registration numbers, education) are still
// missing from this page — see audit/NEEDS-INPUT.md C1–C7. Phase 4D builds
// per-doctor pages once Dr. Sahil supplies them.
export const metadata = {
  title: 'Dentists in Kothrud, Pune — Our Team',
  description:
    'Meet the dentists at Aesthedent in Kothrud, Pune: Dr. Sahil Wathodkar, lead dentist, founder and prosthodontist, and Dr. Aishwarya Kulkarni, surgeon.',
  alternates: {
    canonical: '/doctor',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Our Team', path: '/doctor' },
        ])}
      />
      <DoctorClient />
    </>
  );
}
