import { notFound } from 'next/navigation';
import { getServiceBySlug, getAllServiceSlugs } from '@/lib/services';
import JsonLd from '@/components/seo/JsonLd';
import { buildFaqSchema, buildProcedureSchema, buildBreadcrumbSchema } from '@/lib/schema';
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
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      {/* The FAQs were already written in lib/services.js and shipped unmarked.
          Only 1 of 10 competitors has FAQPage — see audit/02-schema-matrix.md. */}
      <JsonLd
        schema={[
          buildFaqSchema(service.faqs),
          buildProcedureSchema(service),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.title, path: `/services/${slug}` },
          ]),
        ]}
      />
      <ServiceDetailClient slug={slug} />
    </>
  );
}
