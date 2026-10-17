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
    .refine((steps) => steps.every((step, i) => step.step === i + 1), "Number steps consecutively from 1 in their display order."),
  faqs: z.array(questionAnswer).min(1).max(30),
});
export const serviceDocument = serviceContent.extend({ _id: publishedId, slug: z.string().refine((slug) => services.some((item) => item.slug === slug), "Use an existing treatment URL.") });

export function resolveServices(input: unknown) {
  const result = publishedCollection(input, serviceDocument, (item) => item.slug, services.length);
  if (result.status !== "sanity") return { value: services, status: result.status };
  // The two existing treatment-specific lists must not disappear or be added to other layouts.
  if (result.records.some((doc) => Boolean(doc.aboutList) !== Boolean(services.find((item) => item.slug === doc.slug)?.aboutList))) return { value: services, status: "invalid" };
  return { value: services.map((item) => {
    const doc = result.records.find((record) => record.slug === item.slug);
    if (!doc) return item;
    const { _id, slug, aboutList, ...content } = doc;
    const coverImage = imageForDocument(input, _id, "coverImage");
    return { ...item, ...content, ...(aboutList ? { aboutList } : {}), ...(coverImage ? { coverImage } : {}) };
  }), status: result.status };
}
