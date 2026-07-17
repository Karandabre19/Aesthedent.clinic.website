import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us — Kothrud, Pune',
  description:
    'Visit Aesthedent at AJ Tower, Dahanukar Colony, Kothrud, Pune 411038. Open Mon–Sun 10am–8pm, Wednesday closed. Call +91 93098 16336.',
  alternates: {
    canonical: '/contact',
  },
};

export default function Page() {
  return <ContactClient />;
}
