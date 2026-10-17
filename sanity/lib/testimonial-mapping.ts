import { z } from "zod";
import { getTestimonials } from "../../lib/testimonials.js";
import { editorialText as text, publishedCollection, publishedId } from "./content-validation";

export const testimonialSlots = getTestimonials("latest").map((review) => String(review.id));
export const reviewSource = z.string().url().refine((href) => {
  const url = new URL(href);
  return url.protocol === "https:" && !url.username && !url.password && ["www.google.com", "google.com", "maps.google.com", "maps.app.goo.gl", "g.co"].includes(url.hostname);
}, "Use the specific public Google review's HTTPS link; verify the attribution and quotation manually.");
export const testimonialContent = z.object({
  slot: z.string().refine((slot) => testimonialSlots.includes(slot), "Choose an existing review position."),
  name: text.max(180), service: text.max(180), rating: z.number().int().min(1).max(5), text: text.max(6000),
  sourceUrl: reviewSource, verifiedGoogleReview: z.literal(true), publicationPermissionConfirmed: z.literal(true),
});
export const testimonialDocument = testimonialContent.extend({ _id: publishedId });
export function resolveTestimonials(input: unknown) {
  const existing = getTestimonials("latest");
  const result = publishedCollection(input, testimonialDocument, (doc) => doc.slot, existing.length);
  if (result.status !== "sanity") return { value: existing, status: result.status };
  return { value: existing.map((item) => {
    const doc = result.records.find((record) => record.slot === String(item.id));
    // Provenance/permission details stay out of public props; the existing key/order survives.
    return doc ? { ...item, name: doc.name, service: doc.service, rating: doc.rating, text: doc.text, verifiedGoogleReview: true } : item;
  }), status: result.status };
}
