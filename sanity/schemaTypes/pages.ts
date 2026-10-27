import { defineArrayMember, defineField, defineType, getPublishedId } from "sanity";
import { BookHeart, Home, Users } from "lucide-react";
import { contentErrors, editorialText, studioPath } from "../lib/content-validation";
import { aboutContent, doctorContent, doctorKeys, experienceContent, homeContent, visitStages } from "../lib/page-mapping";
import { descriptionList, faqField, stableSlug, textField } from "./content-fields";
import { aboutSections, experienceSections, homeSections } from "../lib/editorial-sections";
import { editorialImage, sectionFields } from "./editorial-fields";

export const doctor = defineType({ name: "doctor", title: "Doctor", type: "document", icon: Users,
  description: "Manage the existing doctor's photo, qualifications and profile text. Have the named doctor verify qualifications and photo permission before publishing. Names, registrations and roles retain their existing source.",
  fields: [stableSlug(doctorKeys, "Existing doctor identity (not a new URL)"), textField("bio", "Team biography", true, true, { maxLength: 6000, rows: 8, description: "Biography on the Doctor page, up to 6,000 characters." }), textField("philosophy", "Personal care philosophy", true, true, { maxLength: 2000 }), textField("homeSummary", "Homepage summary", true, true, { maxLength: 1000, rows: 3, description: "Short narrative on this doctor's homepage card. Separate from the team biography; up to 1,000 characters." }),
    // One minimum check avoids duplicate native required/type errors for a stored null array.
    defineField({ name: 'qualifications', title: 'Qualifications (required before publishing)', type: 'array', description: 'Add at least one qualification verified by this doctor. Drag to reorder. Institution, awarding body and year are optional.', validation: r => r.custom(value => value == null || Array.isArray(value) && value.length === 0 ? 'Add at least one doctor-verified qualification before publishing.' : true), of: [defineArrayMember({ type: 'object', name: 'doctorQualification', title: 'Qualification', fields: [
      defineField({ name: 'title', title: 'Qualification name', type: 'string' }),
      defineField({ name: 'institution', title: 'Institution (optional)', type: 'string' }),
      defineField({ name: 'awardingBody', title: 'Awarding body (optional)', type: 'string' }),
      defineField({ name: 'year', title: 'Year awarded (optional)', type: 'number' }),
    ], preview: { select: { title: 'title', institution: 'institution', year: 'year' }, prepare: ({ title, institution, year }) => ({ title: title || 'Qualification', subtitle: [institution, year].filter(Boolean).join(' · ') }) } })] }),
    defineField({ name: 'specializations', title: 'Specializations (optional)', type: 'array', description: 'Add one doctor-verified area of practice per item. Drag to reorder. Leave empty to hide this list on the website.', of: [defineArrayMember({ name: 'doctorSpecialization', title: 'Specialization', type: 'object', fields: [defineField({ name: 'title', title: 'Specialization name', type: 'string' })], preview: { select: { title: 'title' } } })] }),
    editorialImage("portrait", "portrait", true)],
  validation: r => r.custom(value => {
    const result = doctorContent.safeParse(value);
    if (result.success) return true;
    return result.error.issues.filter((issue, index, issues) => !issues.slice(0, index).some(previous => JSON.stringify(previous.path) === JSON.stringify(issue.path))).map(issue => ({
      message: issue.path[0] === 'specializations' ? issue.path.at(-1) === 'title' ? 'Enter the specialization name using 1–160 characters of plain text.' : 'Use Add item for each specialization, up to 20 entries. Remove incomplete or extra items.' : issue.path[0] !== 'qualifications' ? issue.message : issue.path.at(-1) === 'title' ? 'Enter the qualification name using 1–160 characters of plain text.' : issue.path.at(-1) === 'year' ? 'Enter the four-digit year awarded, from 1900 through this year, or leave it empty.' : issue.path.at(-1) === 'institution' || issue.path.at(-1) === 'awardingBody' ? 'Use up to 200 characters, or leave this optional detail empty.' : 'Keep no more than 20 qualifications. Remove extra entries.',
      path: studioPath(value, issue.path),
    }));
  }),
  preview: { select: { title: "slug.current", subtitle: "homeSummary", media: 'portrait' }, prepare: ({ title, subtitle, media }) => ({ title: title === "sahil" ? "Dr. Sahil Wathodkar" : title === "aishwarya" ? "Dr. Aishwarya Kulkarni Wathodkar" : "Select an existing doctor", subtitle, media }) },
});
export const homePage = defineType({ name: "homePage", title: "Homepage", type: "document", icon: Home,
  description: "Existing visit content plus optional page introductions, action labels and approved images. Shared treatments, doctors, reviews and Insights have their own records. Facts, promises, destinations and layout stay in code.",
  groups: homeSections.flatMap((s) => [{ name: s.name, title: s.title, ...(s.name === "hero" ? { default: true } : {}) }, ...(s.name === "hero" ? [{ name: "brandStatement", title: "Brand statement" }] : [])]),
  initialValue: { visitSteps: visitStages.map((stage, index) => ({ _type: "object", _key: `stage${index + 1}`, stage })) },
  fields: [defineField({ name: "brandStatement", title: "Marketing heading", type: "string", group: "brandStatement",
    description: "Heading below the trust badges and above the treatments section. Current wording: ‘दातों के साथ भी, दातों के बाद भी’. Optional single-line plain text, up to 200 characters. Publish Homepage to update the website; empty hides this heading without restoring hardcoded text.",
    validation: rule => rule.max(200).custom(value => value == null || value === "" || editorialText.safeParse(value).success && !/[\r\n]/.test(value) || "Use a single line of plain text without HTML."),
  }), ...[textField("visitHeading", "Visit section heading", true, false, { maxLength: 200 }), textField("visitQuote", "Existing founder quotation (including quotation marks)", true, true, { maxLength: 2000 }),
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

