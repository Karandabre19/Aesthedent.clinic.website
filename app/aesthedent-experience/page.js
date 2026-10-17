import { getPublishedTestimonials } from '@/sanity/lib/testimonials';
import { getExperienceContent } from '@/sanity/lib/pages';
import ExperienceClient from './ExperienceClient';
import { getServices } from '@/sanity/lib/services';

export default async function Page() {
  const [services, reviewCards, editorial] = await Promise.all([getServices(), getPublishedTestimonials(), getExperienceContent()]);
  return <ExperienceClient services={services} reviewCards={reviewCards} editorial={editorial} />;
}
