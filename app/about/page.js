import AboutClient from './AboutClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

// Wording provisional — final copy lands in Phase 4A once Phase 2 keyword data
// confirms the positioning. Structure (unique title, self-canonical) is the
// Phase 1 deliverable.
export const metadata = {
  title: 'Dental Clinic in Kothrud — About Us',
  description:
    'Why Aesthedent exists, how we work, and what happens when you visit our dental clinic in Kothrud, Pune. We explain everything before we start.',
  alternates: {
    canonical: '/about',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About Our Clinic', path: '/about' },
        ])}
      />
      <AboutClient />
    </>
  );
}
