import ServicesClient from './ServicesClient';

export const metadata = {
  title: 'Dental Services in Kothrud',
  description:
    'Dental implants, root canals, braces and aligners, dentures and full mouth rehabilitation at Aesthedent in Kothrud, Pune.',
  alternates: {
    canonical: '/services',
  },
};

export default function Page() {
  return <ServicesClient />;
}
