import InsightsClient from './InsightsClient';
import JsonLd from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/lib/schema';

export const metadata = {
  title: 'Dental Advice from Our Kothrud Dentists',
  description:
    'Straight answers to what patients actually ask us about root canals, implants, braces and dental anxiety — from our dentists in Kothrud, Pune.',
  alternates: {
    canonical: '/insights',
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        schema={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
        ])}
      />
      <InsightsClient />
    </>
  );
}
