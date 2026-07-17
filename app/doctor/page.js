import DoctorClient from './DoctorClient';

// NOTE: credentials (BDS/MDS, registration numbers, education) are still
// missing from this page — see audit/NEEDS-INPUT.md C1–C7. Phase 4D builds
// per-doctor pages once Dr. Sahil supplies them.
export const metadata = {
  title: 'Our Dentists in Kothrud',
  description:
    'Meet the dentists at Aesthedent, Kothrud: Dr. Sahil Wathodkar, lead dentist and founder, and Dr. Aishwarya Kulkarni, dental surgeon.',
  alternates: {
    canonical: '/doctor',
  },
};

export default function Page() {
  return <DoctorClient />;
}
