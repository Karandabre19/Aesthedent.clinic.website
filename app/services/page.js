import ServicesClient from './ServicesClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

export const metadata = {
  title: 'Dental Treatments in Kothrud, Pune',
  description:
    'Dental implants, root canals, braces and aligners, dentures and full mouth rehabilitation at our clinic in Kothrud, Pune. Prosthodontist-led.',
  alternates: {
    canonical: '/services',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ])}
      />
      <ServicesClient />
    </>
  );
}
