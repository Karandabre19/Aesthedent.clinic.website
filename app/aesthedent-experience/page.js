import { getPageSeo } from '@/sanity/lib/seo';
import { BacklinkReferences } from '@/components/seo/BacklinkReferences';
import { getPublishedTestimonials } from '@/sanity/lib/testimonials';
import { getExperienceContent } from '@/sanity/lib/pages';
import ExperienceClient from './ExperienceClient';
import { getServices } from '@/sanity/lib/services';

export default async function Page() {
  const seoState = await getPageSeo('/aesthedent-experience', {});
  const [services, reviewCards, editorial] = await Promise.all([getServices(), getPublishedTestimonials(), getExperienceContent()]);
  return <ExperienceClient backlinkSection={<BacklinkReferences entries={seoState.backlinks} />} services={services} reviewCards={reviewCards} editorial={editorial} />;
}
