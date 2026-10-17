import { editorialImage } from "./editorial-fields";
import { defineField, defineType } from "sanity";
import { Stethoscope } from "lucide-react";
import { z } from "zod";
import { services } from "../../lib/services.js";
import { serviceContent } from "../lib/service-mapping";
import { contentErrors } from "../lib/content-validation";
import { descriptionList, faqField, stableSlug, textField, textList } from "./content-fields";

export const service = defineType({ name: "service", title: "Treatment", type: "document", icon: Stethoscope,
  description: "Existing treatments only. Use clinic-reviewed clinical copy and permitted treatment imagery. Locality, navigation labels, icons and ordering remain in code; no prices or new capabilities are introduced.",
  groups: [{ name: "summary", title: "Identity and summaries", default: true }, { name: "detail", title: "Treatment page" }, { name: "process", title: "Benefits and steps" }, { name: "questions", title: "FAQs" }],
  fields: [editorialImage("coverImage", "service"), stableSlug(services.map((item) => item.slug)), textField("title", "Treatment title", true, false, { maxLength: 180 }), textField("shortDesc", "Card and SEO summary", true, true, { maxLength: 600, rows: 3, description: "Treatment cards, page metadata and treatment structured data share this summary. Up to 600 characters; navigation labels remain separate." }),
    textField("problem", "Patient concern", true, true, { maxLength: 1000 }), textField("solution", "Treatment explanation", true, true, { maxLength: 2000 }), textField("benefit", "Short benefit", true, false, { maxLength: 300 }),
    defineField({ name: "hero", title: "Treatment introduction", type: "object", options: { collapsible: true, collapsed: false }, fields: [textField("headline", "Headline", true, false, { maxLength: 200 }), textField("promise", "Introduction", true, true, { maxLength: 2000 })], validation: (r) => r.required() }),
    textField("aboutHeading", "About section heading", true, false, { maxLength: 200 }), textField("fullDescription", "Treatment detail", true, true, { rows: 10, description: "Main treatment explanation. Blank lines separate website paragraphs; no HTML. Up to 16,000 characters." }),
    defineField({ name: "aboutList", title: "Existing treatment-specific list", description: "Required for orthodontics and dentures; leave unset for other treatments to preserve their layout.", type: "object", options: { collapsible: true, collapsed: false }, fields: [textField("heading", "Heading", true, false, { maxLength: 200 }), descriptionList("items", "Treatment types")] }),
    textList("benefits", "Benefits"), descriptionList("whyAesthedent", "Why Aesthedent", false, { maximum: 12 }), descriptionList("process", "Treatment steps", true), faqField(),
  ].map((field) => ({ ...field, group: ["slug", "title", "shortDesc", "problem", "solution", "benefit"].includes(field.name) ? "summary" : field.name === "faqs" ? "questions" : ["benefits", "whyAesthedent", "process"].includes(field.name) ? "process" : "detail" })), validation: (r) => r.custom((value) => {
    const errors = contentErrors(serviceContent, value);
    if (errors !== true) return errors;
    const slug = z.object({ current: z.string() }).safeParse(value?.slug);
    const current = slug.success ? services.find((item) => item.slug === slug.data.current) : undefined;
    return !current || Boolean(current.aboutList) === Boolean(value?.aboutList) || { message: "Keep the existing treatment-specific list for orthodontics/dentures only.", path: ["aboutList"] };
  }), preview: { select: { title: "title", subtitle: "slug.current" } },
});
