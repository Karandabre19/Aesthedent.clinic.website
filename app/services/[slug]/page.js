import { notFound } from 'next/navigation';
import { getServiceBySlug, getAllServiceSlugs } from '@/lib/services';
import ServiceDetailClient from './ServiceDetailClient';

// Prerender all eight service pages at build time. Without this they were
// ƒ Dynamic — server-rendered on every request, despite the content being fully
// static. These are the commercial money pages.
export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) return {};

  // "[Service] in Kothrud, Pune" — location in the front half of the title.
  // Full copy rewrite (1200–1800 words, cost sections, FAQ schema) is Phase 4C.
  const title = `${service.title} in Kothrud, Pune`;

  return {
    title,
    description: service.shortDesc,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: `${title} | Aesthedent`,
      description: service.shortDesc,
      url: `https://www.aesthedentpune.com/services/${slug}`,
      type: 'article',
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  if (!getServiceBySlug(slug)) {
    notFound();
  }

  return <ServiceDetailClient slug={slug} />;
}
