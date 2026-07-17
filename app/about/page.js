import AboutClient from './AboutClient';

// Wording provisional — final copy lands in Phase 4A once Phase 2 keyword data
// confirms the positioning. Structure (unique title, self-canonical) is the
// Phase 1 deliverable.
export const metadata = {
  title: 'About Our Clinic',
  description:
    'Aesthedent is a dental clinic in Kothrud, Pune. We explain the diagnosis, the options and the cost before any treatment starts.',
  alternates: {
    canonical: '/about',
  },
};

export default function Page() {
  return <AboutClient />;
}
