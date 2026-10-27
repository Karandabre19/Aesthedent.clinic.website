import { BacklinkReferences } from '@/components/seo/BacklinkReferences';
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

// Existing URLs are prebuilt. New, clinically reviewed CMS articles render on demand.
export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const articles = applyInsightOverrides(insights, await getInsightOverrides());
  const insight = articles.find((i) => i.slug === slug);

  if (!insight) notFound();

  return (await getPageSeo(`/insights/${slug}`, insightSeo(insight).metadata)).metadata;
}

export default async function Page({ params }) {
  const { slug } = await params;
  const overrides = await getInsightOverrides();
  const articles = applyInsightOverrides(insights, overrides);
  const insight = articles.find((i) => i.slug === slug);

  if (!insight) notFound();

  const seoState = await getPageSeo(`/insights/${slug}`, {});

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
      <InsightDetailClient backlinkSection={<BacklinkReferences entries={seoState.backlinks} />} presentation={await getPresentationPage('insightsPage')} slug={slug} insightOverrides={overrides} relatedInsights={articles} />
    </>
  );
}
