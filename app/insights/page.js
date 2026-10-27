import { BacklinkReferences } from '@/components/seo/BacklinkReferences';
import { getPageSeo } from '@/sanity/lib/seo';
import { getPresentationPage } from '@/sanity/lib/presentation-pages';
import InsightsClient from './InsightsClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';
import { getInsightOverrides } from '@/sanity/lib/insights';

const fallbackMetadata = {
  title: 'Dental Advice from Our Kothrud Dentists',
  description:
    'Straight answers to what patients actually ask us about root canals, implants, braces and dental anxiety - from our dentists in Kothrud, Pune.',
  alternates: {
    canonical: '/insights',
  },
};
export async function generateMetadata() { return (await getPageSeo('/insights', fallbackMetadata)).metadata; }

export default async function Page() {
  const seoState = await getPageSeo('/insights', fallbackMetadata);
  const overrides = await getInsightOverrides();
  return (
    <>
      <>{seoState.structuredData && <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
        ])}
      />}</>
      <InsightsClient backlinkSection={<BacklinkReferences entries={seoState.backlinks} />} presentation={await getPresentationPage('insightsPage')} insightOverrides={overrides} />
    </>
  );
}
