import { getPageSeo } from '@/sanity/lib/seo';
import { getPresentationPage } from '@/sanity/lib/presentation-pages';
import { getServices } from '@/sanity/lib/services';
import ServicesClient from './ServicesClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

const fallbackMetadata = {
  title: 'Dental Treatments in Kothrud, Pune',
  description:
    'Dental implants, root canals, braces and aligners, dentures and full mouth rehabilitation at our clinic in Kothrud, Pune. Prosthodontist-led.',
  alternates: {
    canonical: '/services',
  },
};
export async function generateMetadata() { return (await getPageSeo('/services', fallbackMetadata)).metadata; }

export default async function Page() {
  const seoState = await getPageSeo('/services', fallbackMetadata);
  return (
    <>
      <>{seoState.structuredData && <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ])}
      />}</>
      <ServicesClient presentation={await getPresentationPage('servicesPage')} services={await getServices()} />
    </>
  );
}
