import { getPageSeo } from '@/sanity/lib/seo';
import { getPresentationPage } from '@/sanity/lib/presentation-pages';
import ContactClient from './ContactClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

const fallbackMetadata = {
  title: 'Contact Our Dentist in Kothrud, Pune',
  description:
    'Visit Aesthedent at AJ Tower, Dahanukar Colony, Kothrud, Pune 411038. Open 10am–8pm, weekends too. Closed Wednesday. Call +91 93098 16336.',
  alternates: {
    canonical: '/contact',
  },
};
export async function generateMetadata() { return (await getPageSeo('/contact', fallbackMetadata)).metadata; }

export default async function Page() {
  const seoState = await getPageSeo('/contact', fallbackMetadata);
  return (
    <>
      <>{seoState.structuredData && <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />}</>
      <ContactClient presentation={await getPresentationPage('contactPage')} />
    </>
  );
}
