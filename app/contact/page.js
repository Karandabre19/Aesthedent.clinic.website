import ContactClient from './ContactClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

export const metadata = {
  title: 'Contact Our Dentist in Kothrud, Pune',
  description:
    'Visit Aesthedent at AJ Tower, Dahanukar Colony, Kothrud, Pune 411038. Open 10am–8pm, weekends too. Closed Wednesday. Call +91 93098 16336.',
  alternates: {
    canonical: '/contact',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <ContactClient />
    </>
  );
}
