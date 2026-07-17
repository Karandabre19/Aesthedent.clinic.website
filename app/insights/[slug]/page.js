import { insights } from '@/lib/insights';
import InsightDetailClient from './InsightDetailClient';

// HAZARD (not fixed here — Phase 4): article bodies live in an `insightsData`
// object inside InsightDetailClient.js, separate from lib/insights.js. The two
// slug lists agree today, but adding an insight to the lib without adding the
// body puts a URL in the sitemap that renders "not found". Worth consolidating
// onto one source.
export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const insight = insights.find((i) => i.slug === slug);

  if (!insight) return {};

  return {
    title: insight.metaTitle ?? insight.title,
    description: insight.excerpt,
    alternates: {
      canonical: `/insights/${slug}`,
    },
    openGraph: {
      title: insight.title,
      description: insight.excerpt,
      url: `https://www.aesthedentpune.com/insights/${slug}`,
      type: 'article',
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <InsightDetailClient slug={slug} />;
}
