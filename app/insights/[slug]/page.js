import { notFound } from 'next/navigation';
import { getPageSeo } from '@/sanity/lib/seo';
import { getPresentationPage } from '@/sanity/lib/presentation-pages';
import { insights } from '@/lib/insights';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';
import InsightDetailClient from './InsightDetailClient';
import { getInsightOverrides } from '@/sanity/lib/insights';
import { applyInsightOverrides } from '@/sanity/lib/insight-overrides';
import { insightSeo } from '@/sanity/lib/insight-seo';

// HAZARD (not fixed here - Phase 4): article bodies live in an `insightsData`
// object inside InsightDetailClient.js, separate from lib/insights.js. The two
// slug lists agree today, but adding an insight to the lib without adding the
// body puts a URL in the sitemap that renders "not found". Worth consolidating
// onto one source.
export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

// Article URLs are a fixed code-owned list; anything else is a real 404 rather
// than a 200 "not found" page that search engines could index.
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const articles = applyInsightOverrides(insights, await getInsightOverrides());
  const insight = articles.find((i) => i.slug === slug);

  if (!insight) notFound();

  return (await getPageSeo(`/insights/${slug}`, insightSeo(insight).metadata)).metadata;
}

export default async function Page({ params }) {
  const { slug } = await params;
  const seoState = await getPageSeo(`/insights/${slug}`, {});
  const overrides = await getInsightOverrides();
  const articles = applyInsightOverrides(insights, overrides);
  const insight = articles.find((i) => i.slug === slug);

  if (!insight) notFound();

  return (
    <>
      <>{seoState.structuredData && <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
          { name: insight?.title ?? slug, path: `/insights/${slug}` },
        ])}
      />}</>
      {insight && <>{seoState.structuredData && <JsonLd schema={insightSeo(insight).structuredData} />}</>}
      <InsightDetailClient presentation={await getPresentationPage('insightsPage')} slug={slug} insightOverrides={overrides} relatedInsights={articles} />
    </>
  );
}
