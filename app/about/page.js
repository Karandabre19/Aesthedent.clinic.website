import { getPageSeo } from '@/sanity/lib/seo';
import { getAboutContent } from '@/sanity/lib/pages';
import AboutClient from './AboutClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

// COLLISION C5 (audit/01-content-spine.md §1.2): /about, /services and
// /aesthedent-experience were all pointed at "specialist / treatments / how we
// work". Resolved by giving each a distinct term:
//   /aesthedent-experience → painless dental treatment kothrud  (Part A)
//   /services              → dental treatments in kothrud
//   /about                 → dental clinic in kothrud           ← this page
// "About Us" told Google nothing; "How We Work" states the page's actual intent
// and keeps the keyword first.
//
// PHASE 4F REVISION. Part C gave this page "dental clinic in kothrud". Part F
// then created /dental-clinic-in-kothrud, whose URL is an exact match for that
// term - so the two would have competed, which is the sixth cannibalisation one
// part after we cleared five.
//
// Resolved by moving this page to the term it is genuinely best placed to win
// and nothing else on the site targets: the nervous-patient query. That is the
// wedge (no competitor in the Kothrud top 8 competes on dental anxiety), it
// matches this page's existing H1, and it collides with nothing -
// /insights/dental-anxiety-tips is informational, this is commercial.
const fallbackMetadata = {
  title: 'Dentist for Nervous Patients in Kothrud',
  description:
    'A Kothrud dentist for people who dread dentists. We explain everything before we start, go at your pace, and stop the moment you raise a hand.',
  alternates: {
    canonical: '/about',
  },
};
export async function generateMetadata() { return (await getPageSeo('/about', fallbackMetadata)).metadata; }

export default async function Page() {
  const seoState = await getPageSeo('/about', fallbackMetadata);
  return (
    <>
      <>{seoState.structuredData && <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About Our Clinic', path: '/about' },
        ])}
      />}</>
      <AboutClient editorial={await getAboutContent()} />
    </>
  );
}
