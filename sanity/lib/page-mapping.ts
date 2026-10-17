import { z } from "zod";
import { editorialText as text, publishedCollection, publishedId, titleDescription } from "./content-validation";
import { aboutSections, experienceSections, homeSections, resolveSections } from "./editorial-sections";
import { imageForDocument } from "./image";
import { presentationPageNames } from "./presentation-definitions";

export const doctorKeys = ["sahil", "aishwarya"] as const;
export const doctorContent = z.object({ bio: text.max(6000), philosophy: text.max(2000), homeSummary: text.max(1000) });
export const doctorDocument = doctorContent.extend({ _id: publishedId, slug: z.enum(doctorKeys) });
export function resolveDoctors(input: unknown) {
  const result = publishedCollection(input, doctorDocument, (doc) => doc.slug, doctorKeys.length);
  return { value: result.records.map((doc) => {
    const portrait = imageForDocument(input, doc._id, "portrait", true);
    return { slug: doc.slug, bio: doc.bio, philosophy: doc.philosophy, homeSummary: doc.homeSummary, ...(portrait ? { portrait } : {}) };
  }), status: result.status };
}

export const visitStages = ["Checkup", "Diagnosis", "Planning", "Your call", "Treatment", "Follow-up"] as const;
export const homeContent = z.object({
  visitHeading: text.max(200), visitQuote: text.max(2000),
  visitSteps: z.array(z.object({ stage: z.enum(visitStages), detail: text.max(2000) })).length(6)
    .refine((steps) => steps.every((item, index) => item.stage === visitStages[index]), "Keep the six existing visit stages in order."),
});
export const aboutContent = z.object({ storyIntro: text.max(6000), storyApproach: text.max(6000), values: z.array(titleDescription).length(4) });
export const experienceContent = z.object({
  specialistBenefits: z.array(titleDescription).length(3), technology: z.array(titleDescription).length(4), approach: z.array(titleDescription).length(3),
  faqs: z.array(z.object({ question: text.max(300), answer: text.max(4000) })).min(1).max(30),
});
export const singletonNames = ["homePage", "aboutPage", "experiencePage", ...presentationPageNames, "navigation", "seoSettings"] as const;
export type SingletonName = typeof singletonNames[number];
export function resolvePage<T>(input: unknown, name: SingletonName, content: z.ZodType<T>) {
  const result = publishedCollection(input, z.object({ _id: z.literal(name), content }), (doc) => doc._id, 1);
  const record = result.records[0];
  if (!record) return { value: null, status: result.status };
  const raw = Array.isArray(input) ? input[0] : undefined;
  const envelope = z.object({ editorial: z.unknown().optional(), media: z.unknown().optional() }).safeParse(raw);
  const specs = name === "homePage" ? homeSections : name === "aboutPage" ? aboutSections : experienceSections;
  const additions = envelope.success ? resolveSections(envelope.data.editorial, envelope.data.media, specs) : {};
  return { value: { ...record.content, ...additions }, status: result.status };
}
