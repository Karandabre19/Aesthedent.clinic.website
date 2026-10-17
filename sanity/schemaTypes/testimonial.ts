import { defineField, defineType, getPublishedId } from "sanity";
import { MessageCircle } from "lucide-react";
import { getTestimonials } from "../../lib/testimonials.js";
import { contentErrors } from "../lib/content-validation";
import { reviewSource, testimonialContent } from "../lib/testimonial-mapping";
import { requireSanityEnvironment } from "../env";
import { textField } from "./content-fields";

export const testimonial = defineType({ name: "testimonial", title: "Verified Google review", type: "document", icon: MessageCircle,
  description: "Authentic, clinic-verified quotations and approved attribution only. No fabricated reviews, stock patient photos or inferred permission. Attestations are manual and must be rechecked after edits; they are not proof of consent. No review statistics are managed here.",
  fields: [
    defineField({ name: "slot", title: "Existing display position", type: "string", options: { list: getTestimonials("latest").map((review, index) => ({ title: `Position ${index + 1}`, value: String(review.id) })) }, validation: (r) => r.required().custom(async (value, context) => {
      if (!value || !context.document?._id) return true;
      try {
        const { apiVersion } = requireSanityEnvironment();
        const count = await context.getClient({ apiVersion }).withConfig({ perspective: "raw", useCdn: false }).fetch<unknown>(
          'count(*[_type == "testimonial" && slot == $slot && !(_id in path("versions.**")) && !(_id in [$id,$draft])])',
          { slot: value, id: getPublishedId(context.document._id), draft: `drafts.${getPublishedId(context.document._id)}` },
        );
        return count === 0 || "This display position is already assigned. Edit its existing document instead.";
      } catch { return "Could not verify this review position. Check access and retry."; }
    }) }),
    textField("name", "Approved public attribution", true, false, { maxLength: 180 }), textField("service", "Approved service label", true, false, { maxLength: 180 }),
    defineField({ name: "rating", title: "Original review rating", type: "number", validation: (r) => r.required().integer().min(1).max(5) }),
    textField("text", "Exact approved quotation", true, true, { maxLength: 6000, rows: 8, description: "Exact source wording approved for republication. Up to 6,000 characters; recheck both attestations after any edit." }),
    defineField({ name: "sourceUrl", title: "Specific public Google review link", description: "Internal provenance reference. This does not replace the website's generic Google-reviews link. A URL alone is not evidence of republication permission.", type: "url", validation: (r) => r.required().custom((value) => reviewSource.safeParse(value).success || "Use the specific review's Google HTTPS link.") }),
    defineField({ name: "verifiedGoogleReview", title: "Quotation, rating and attribution verified against the source", type: "boolean", initialValue: false, validation: (r) => r.required().custom((value) => value === true || "Verify the exact public review before publishing.") }),
    defineField({ name: "publicationPermissionConfirmed", title: "Clinic confirms permission to republish this quotation and attribution", type: "boolean", initialValue: false, validation: (r) => r.required().custom((value) => value === true || "Confirm publication permission before publishing.") }),
  ], validation: (r) => r.custom((value) => contentErrors(testimonialContent, value)), preview: { select: { title: "name", subtitle: "service" } },
});
