import { notFound } from 'next/navigation';
import { getServiceBySlug, getAllServiceSlugs } from '@/lib/services';
import JsonLd from '@/components/seo/JsonLd';
import { buildFaqSchema, buildProcedureSchema, buildBreadcrumbSchema } from '@/lib/schema';
import ServiceDetailClient from './ServiceDetailClient';

// Prerender all eight service pages at build time. Without this they were
// ƒ Dynamic - server-rendered on every request, despite the content being fully
// static. These are the commercial money pages.
export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) return {};

  // "[Service] in [locality]" - location in the front half of the title.
  //
  // Phase 4D: locality is now per-service rather than hardcoded "Kothrud, Pune".
  // Full mouth rehabilitation and Digital Smile Design are Pune-level terms -
  // patients choose those on specialism and travel for them, so pinning them to
  // one suburb narrows the page for no gain (audit/01-content-spine.md §4).
  const title = `${service.title} in ${service.locality}`;

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
          Only 1 of 10 competitors has FAQPage - see audit/02-schema-matrix.md. */}
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
