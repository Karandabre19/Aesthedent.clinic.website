import { getPageSeo } from '@/sanity/lib/seo';
import { getPublishedTestimonials } from '@/sanity/lib/testimonials';
import { getServices } from '@/sanity/lib/services';
import { getDoctors, getHomeContent } from '@/sanity/lib/pages';
import HomeClient from './HomeClient';
import { insights } from '@/lib/insights';
import { getInsightOverrides } from '@/sanity/lib/insights';
import { applyInsightOverrides } from '@/sanity/lib/insight-overrides';

// Server shell. Exists so this route can export metadata at all - the page body
// is a client component ('use client'), and client components silently export
// no metadata. Title/description come from the root layout defaults.
const fallbackMetadata = {
  alternates: {
    canonical: '/',
  },
};
export async function generateMetadata() { return (await getPageSeo('/', fallbackMetadata)).metadata; }

export default async function Page() {
  const seoState = await getPageSeo('/', fallbackMetadata);
  const [overrides, services, doctorNarratives, reviewCards, editorial] = await Promise.all([
    getInsightOverrides(), getServices(), getDoctors(), getPublishedTestimonials(), getHomeContent(),
  ]);
  const cards = applyInsightOverrides(insights, overrides);
  return <HomeClient insightCards={cards} services={services} doctorNarratives={doctorNarratives} reviewCards={reviewCards} editorial={editorial} />;
}
