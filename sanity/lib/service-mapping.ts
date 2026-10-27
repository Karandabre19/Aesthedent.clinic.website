import { z } from "zod";
import { services } from "../../lib/services.js";
import { editorialText as text, publishedCollection, publishedId, questionAnswer, titleDescription } from "./content-validation";
import { imageForDocument } from "./image";

export const serviceContent = z.object({
  title: text.max(180), shortDesc: text.max(600), problem: text.max(1000), solution: text.max(2000), benefit: text.max(300),
  hero: z.object({ headline: text.max(200), promise: text.max(2000) }), aboutHeading: text.max(200), fullDescription: text,
  aboutList: z.object({ heading: text.max(200), items: z.array(titleDescription).min(1).max(20) }).nullish(),
  benefits: z.array(text.max(2000)).min(1).max(20), whyAesthedent: z.array(titleDescription).min(1).max(12),
  process: z.array(titleDescription.extend({ step: z.number().int().min(1).max(20) })).min(1).max(20)
    .superRefine((steps, context) => steps.forEach((step, index) => {
      if (step.step !== index + 1) context.addIssue({ code: 'custom', path: [index, 'step'], message: `Use step ${index + 1} at this position. Renumber after moving a step.` });
    })),
  faqs: z.array(questionAnswer).min(1).max(30),
});
export const serviceDocument = serviceContent.extend({ _id: publishedId, slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase, hyphenated treatment URL.") });

/** Website defaults for a treatment that exists only in the CMS; its content comes from the document. */
const newServiceBase = (slug: string) => ({
  slug, locality: "Kothrud, Pune", isFeatured: false, icon: "Sparkles",
  image: "/clinic/treatment-process.jpeg", imageAlt: "Treatment room at Aesthedent Dental Clinic, Kothrud",
});
export const MAXIMUM_SERVICES = 1000;

export function resolveServices(input: unknown) {
  const result = publishedCollection(input, serviceDocument, (item) => item.slug, MAXIMUM_SERVICES);
  if (result.status !== "sanity") return { value: services, status: result.status };
  // The two existing treatment-specific lists must not disappear or be added to other layouts.
  if (result.records.some((doc) => { const known = services.find((item) => item.slug === doc.slug); return known && Boolean(doc.aboutList) !== Boolean(known.aboutList); })) return { value: services, status: "invalid" };
  const merge = <T extends object>(item: T, doc: (typeof result.records)[number]) => {
    const { _id, slug, aboutList, ...content } = doc;
    // Either image fills in for the other: the card image on cards, the banner on the page.
    const card = imageForDocument(input, _id, "coverImage"), banner = imageForDocument(input, _id, "bannerImage");
    return { ...item, ...content, ...(aboutList ? { aboutList } : {}), ...(card ?? banner ? { coverImage: card ?? banner } : {}), ...(banner ?? card ? { bannerImage: banner ?? card } : {}) };
  };
  const existing = services.map((item) => {
    const doc = result.records.find((record) => record.slug === item.slug);
    return doc ? merge(item, doc) : item;
  });
  const added = result.records.filter((doc) => !services.some((item) => item.slug === doc.slug)).map((doc) => merge(newServiceBase(doc.slug), doc));
  return { value: [...existing, ...added], status: result.status };
}
