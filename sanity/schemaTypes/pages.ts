import { defineArrayMember, defineField, defineType, getPublishedId } from "sanity";
import { BookHeart, Home, Users } from "lucide-react";
import { contentErrors } from "../lib/content-validation";
import { aboutContent, doctorContent, doctorKeys, experienceContent, homeContent, visitStages } from "../lib/page-mapping";
import { descriptionList, faqField, stableSlug, textField } from "./content-fields";
import { aboutSections, experienceSections, homeSections } from "../lib/editorial-sections";
import { editorialImage, sectionFields } from "./editorial-fields";

export const doctor = defineType({ name: "doctor", title: "Doctor narrative", type: "document", icon: Users,
  description: "Existing doctors only. Names, credentials, registration, roles and treatments remain code-controlled. Portrait replacements require the named clinician’s identity and media permission verification. These are distinct team and homepage narratives; have the named clinician review them.",
  fields: [stableSlug(doctorKeys, "Existing doctor identity (not a new URL)"), textField("bio", "Team biography", true, true, { maxLength: 6000, rows: 8, description: "Narrative on the team page; does not change the clinician's name, credentials or portrait. Up to 6,000 characters." }), textField("philosophy", "Personal care philosophy", true, true, { maxLength: 2000 }), textField("homeSummary", "Homepage summary", true, true, { maxLength: 1000, rows: 3, description: "Short narrative on this doctor's homepage card. Separate from the team biography; up to 1,000 characters." }), editorialImage("portrait", "portrait")],
  validation: (r) => r.custom((value) => contentErrors(doctorContent, value)),
  preview: { select: { title: "slug.current", subtitle: "homeSummary" }, prepare: ({ title, subtitle }) => ({ title: title === "sahil" ? "Dr. Sahil Wathodkar" : title === "aishwarya" ? "Dr. Aishwarya Kulkarni Wathodkar" : "Select an existing doctor", subtitle }) },
});
export const homePage = defineType({ name: "homePage", title: "Homepage", type: "document", icon: Home,
  description: "Existing visit content plus optional page introductions, action labels and approved images. Shared treatments, doctors, reviews and Insights have their own records. Facts, promises, destinations and layout stay in code.",
  groups: homeSections.map((s) => ({ name: s.name, title: s.title, ...(s.name === "hero" ? { default: true } : {}) })),
  initialValue: { visitSteps: visitStages.map((stage, index) => ({ _type: "object", _key: `stage${index + 1}`, stage })) },
  fields: [...[textField("visitHeading", "Visit section heading", true, false, { maxLength: 200 }), textField("visitQuote", "Existing founder quotation (including quotation marks)", true, true, { maxLength: 2000 }),
    defineField({ name: "visitSteps", title: "Six visit stages", description: "Edit each explanation. The six stage names and their order are fixed by the website. All six explanations are required; new documents start with the stage names only, not clinical copy.", type: "array", options: { sortable: false, disableActions: ["add", "remove", "duplicate", "copy"] }, of: [defineArrayMember({ type: "object", fields: [defineField({ name: "stage", title: "Existing stage", type: "string", readOnly: true, options: { list: [...visitStages] }, validation: (r) => r.required() }), textField("detail", "Explanation", true, true, { maxLength: 2000 })], preview: { select: { title: "stage", subtitle: "detail" } } })], validation: (r) => r.required().length(6) })].map(field => ({ ...field, group: "visitPresentation" })), ...sectionFields(homeSections)],
  validation: (r) => r.custom((value) => contentErrors(homeContent, value) !== true ? contentErrors(homeContent, value) : getPublishedId(value?._id ?? "") === "homePage" || "Use the Homepage singleton in Structure."),
  preview: { prepare: () => ({ title: "Homepage" }) },
});
export const aboutPage = defineType({ name: "aboutPage", title: "About", type: "document", icon: BookHeart,
  description: "Existing story and four values, plus optional introductions, action labels and approved images. Statistics, credentials, operational cards and factual claims stay controlled; this is not a second source of clinic facts.",
  groups: aboutSections.map((s) => ({ name: s.name, title: s.title, ...(s.name === "hero" ? { default: true } : {}) })),
  fields: [...[textField("storyIntro", "Founding story", true, true, { maxLength: 6000, rows: 8, description: "First story paragraph on About. Plain text; up to 6,000 characters. Do not add unverified statistics or credentials." }), textField("storyApproach", "Care approach", true, true, { maxLength: 6000, rows: 8 }), descriptionList("values", "Four clinic values", false, { length: 4 })].map(field => ({ ...field, group: field.name === "values" ? "valuesPresentation" : "storyPresentation" })), ...sectionFields(aboutSections)],
  validation: (r) => r.custom((value) => contentErrors(aboutContent, value) !== true ? contentErrors(aboutContent, value) : getPublishedId(value?._id ?? "") === "aboutPage" || "Use the About singleton in Structure."),
  preview: { prepare: () => ({ title: "About" }) },
});
export const experiencePage = defineType({ name: "experiencePage", title: "Experience", type: "document", icon: BookHeart,
  description: "Existing clinical explanations and FAQs plus optional introductions, action labels and approved images. Have the clinic verify equipment, sedation, outcomes and media permission. Guarantees, provider facts and the four-stage process remain in code.",
  groups: [{ name: "explanations", title: "Specialist Explanations" }, { name: "approach", title: "Approach" }, ...experienceSections.map((s) => ({ name: s.name, title: s.title, ...(s.name === "banner" ? { default: true } : {}) }))],
  fields: [...[descriptionList("specialistBenefits", "Three specialist explanations", false, { length: 3 }), descriptionList("technology", "Four existing technology cards", false, { length: 4 }), descriptionList("approach", "Three approach cards", false, { length: 3 }), faqField("faqs", "question", "answer")].map((field) => ({ ...field, group: field.name === "faqs" ? "faqPresentation" : field.name === "technology" ? "technologyPresentation" : field.name === "approach" ? "approach" : "explanations" })), ...sectionFields(experienceSections)],
  validation: (r) => r.custom((value) => contentErrors(experienceContent, value) !== true ? contentErrors(experienceContent, value) : getPublishedId(value?._id ?? "") === "experiencePage" || "Use the Experience singleton in Structure."),
  preview: { prepare: () => ({ title: "Experience" }) },
});

