import InsightsClient from './InsightsClient';

export const metadata = {
  title: 'Dental Insights & Advice',
  description:
    'Straight answers to the questions patients actually ask us — about root canals, implants, braces and dental anxiety. Written by the Aesthedent team.',
  alternates: {
    canonical: '/insights',
  },
};

export default function Page() {
  return <InsightsClient />;
}
