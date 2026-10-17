import { z } from "zod";
import { editorialText } from "./content-validation";
import { imageProfiles, type ImageProfileKey, imageFromRecord } from "./image";

type TextField = { kind: "text"; title: string; description: string; max: number; multiline?: boolean };
type ImageField = { kind: "image"; profile: ImageProfileKey };
type HeadlineField = { kind: "headline" };
export type EditorialField = TextField | ImageField | HeadlineField;
export type SectionSpec = { name: string; title: string; fields: Record<string, EditorialField> };
export type EditorialSections = Record<string, Record<string, unknown>>;
const text = (title: string, description: string, max: number, multiline = false): TextField => ({ kind: "text", title, description, max, multiline });
const image = (profile: ImageProfileKey): ImageField => ({ kind: "image", profile });
export const headlineFields = {
  opening: text("Headline opening phrase", "Opening words on the first animated homepage line; currently ‘The dentist’.", 24),
  continuation: text("Headline first-line continuation", "Animated phrase following the opening words; currently ‘that takes’.", 24),
  emphasis: text("Headline highlighted second line", "Highlighted second line; currently ‘the fear away.’ Include its punctuation.", 32),
};
export const homeSections: SectionSpec[] = [
  { name: "hero", title: "Hero", fields: {
    eyebrow: text("Hero eyebrow", "Displayed above the homepage headline. Keep approved brand wording short.", 60),
    headline: { kind: "headline" },
    supportingCopy: text("Hero supporting paragraph", "One paragraph below the headline. Use clinic-approved service and comfort statements.", 280, true),
    whatsappLabel: text("Hero WhatsApp button text", "Changes the visible WhatsApp label, not the clinic number or message.", 32),
    mapDesktopLabel: text("Hero map button text — larger screens", "Map-action text on larger screens; currently ‘Visit Clinic’.", 24),
    mapMobileLabel: text("Hero map button text — phones", "Short map-action text on phones; currently ‘Location’.", 16),
    desktopImage: image("heroDesktop"), mobileImage: image("heroMobile"),
  } },
  { name: "treatments", title: "Treatments Introduction", fields: {
    eyebrow: text("Treatments eyebrow", "Small introductory label above the homepage treatment heading.", 40),
    heading: text("Treatments section heading", "Homepage heading above all eight treatments. Preserve approved local search intent.", 100),
    intro: text("Treatments introduction", "Paragraph before the treatment cards. Clinical planning statements require clinic review.", 400, true),
    allTreatmentsLabel: text("All-treatments link text", "Link below the treatments; its destination remains /services.", 64),
  } },
  { name: "appointment", title: "Appointment Introduction", fields: {
    heading: text("Appointment section heading", "Heading immediately above the homepage appointment wizard.", 80),
    intro: text("Appointment introduction", "One paragraph introducing the wizard; questions and booking behavior are unchanged.", 300, true),
  } },
  { name: "visitPresentation", title: "Visit Process", fields: {
    eyebrow: text("Visit process eyebrow", "Small label above the six-stage visit process; currently ‘Your Visit’.", 40),
    processLinkLabel: text("Process link text", "Link to the existing Experience page below the visit stages.", 48),
    treatmentImage: image("visitTreatment"), equipmentImage: image("visitEquipment"),
  } },
  { name: "team", title: "Team Introduction", fields: {
    eyebrow: text("Team eyebrow", "Small label above the homepage team introduction.", 40),
    heading: text("Team section heading", "Heading above the two existing clinician cards.", 100),
    intro: text("Team introduction", "Paragraph above the profiles. Named-clinician or care statements need clinician review.", 400, true),
    teamLinkLabel: text("Full-team link text", "Link below the profiles; its destination remains /doctor.", 40),
  } },
  { name: "reviews", title: "Reviews Introduction", fields: {
    heading: text("Reviews section heading", "Heading above the six shared homepage review cards.", 80),
    intro: text("Reviews introduction", "Paragraph below the heading. Do not imply outcomes beyond permitted quotations.", 300, true),
    allReviewsLabel: text("All-reviews link text", "Existing Google-reviews link below the cards; destination stays fixed.", 48),
  } },
  { name: "insights", title: "Insights Introduction", fields: {
    eyebrow: text("Insights eyebrow", "Small label above the homepage Insights heading; currently ‘Knowledge Hub’.", 40),
    heading: text("Insights section heading", "Heading above the homepage’s four article cards.", 80),
    intro: text("Insights introduction", "Supporting paragraph above the homepage article selection.", 300, true),
    allInsightsLabel: text("All-insights link text", "Link to the existing Insights listing; destination remains /insights.", 40),
  } },
  { name: "contact", title: "Contact Introduction", fields: {
    eyebrow: text("Contact eyebrow", "Small label above the homepage contact invitation.", 40),
    heading: text("Contact invitation heading", "Heading of the homepage’s final contact section.", 80),
    intro: text("Contact invitation", "Invitation paragraph. Address, phone and opening hours are edited nowhere in this document.", 300, true),
    whatsappLabel: text("Contact WhatsApp button text", "Visible label of the existing WhatsApp action.", 32),
    contactPageLabel: text("Contact-page link text", "Link to the existing Contact page; destination remains /contact.", 40),
    image: image("contact"),
  } },
];
export const aboutSections: SectionSpec[] = [
  { name: "hero", title: "Opening", fields: {
    eyebrow: text("About eyebrow", "Small label above the About-page headline.", 40),
    intro: text("About opening paragraph", "Text before the existing Experience-page link. Write it so the following link reads naturally.", 500, true),
    experienceLinkLabel: text("Experience link text", "Linked words at the end of the opening paragraph; destination stays fixed.", 60),
    whatsappLabel: text("About booking button text", "Visible label of the existing WhatsApp booking action.", 32),
    teamLabel: text("About team-link text", "Visible label linking to the existing doctor page.", 40), image: image("aboutHero"),
  } },
  { name: "storyPresentation", title: "Story", fields: {
    eyebrow: text("Story eyebrow", "Small label above the founding-story heading.", 40),
    heading: text("Story heading", "Heading above the existing founding and care-approach paragraphs.", 100),
  } },
  { name: "valuesPresentation", title: "Values", fields: {
    eyebrow: text("Values eyebrow", "Small label above the clinic-values heading.", 40),
    heading: text("Values heading", "Heading introducing the four fixed clinic-value cards.", 100),
    intro: text("Values introduction", "Paragraph below the heading; the four cards are edited separately.", 240, true),
  } },
  { name: "clinicExperience", title: "Clinic Image", fields: {
    image: image("aboutClinic"), eyebrow: text("Clinic experience eyebrow", "Small presentation label above the existing clinic image overlay.", 60),
    contactLabel: text("Clinic-experience contact-link text", "Visible contact link in the photo overlay; destination remains /contact.", 32),
  } },
  { name: "closing", title: "Closing", fields: {
    heading: text("About closing heading", "Heading above the final About-page booking invitation.", 100),
    whatsappLabel: text("About final booking-button text", "Visible label of the final WhatsApp booking action.", 40),
  } },
];
export const experienceSections: SectionSpec[] = [
  { name: "banner", title: "Banner", fields: {
    image: image("experienceBanner"),
    callLabel: text("Banner call-button text", "Visible label of the banner’s existing telephone action.", 32),
    whatsappLabel: text("Banner WhatsApp-button text", "Visible label of its consultation action; WhatsApp message stays fixed.", 40),
  } },
  { name: "technologyPresentation", title: "Technology", fields: {
    heading: text("Technology section heading", "Heading above the four existing technology cards.", 100),
    intro: text("Technology introduction", "Paragraph introducing the technology cards. Equipment/service claims need clinic review.", 300, true),
  } },
  { name: "visitPresentation", title: "Visit Image", fields: { image: image("experienceVisit") } },
  { name: "faqPresentation", title: "FAQs", fields: {
    heading: text("FAQ section heading", "Heading above the Experience-page question list.", 80),
    intro: text("FAQ introduction", "Short paragraph introducing the questions; answers are edited separately.", 300, true),
  } },
  { name: "reviewPresentation", title: "Reviews Introduction", fields: {
    heading: text("Experience reviews heading", "Heading above the first three shared review cards.", 80),
    intro: text("Experience reviews introduction", "Paragraph above the reviews; do not imply unverified treatment outcomes.", 300, true),
  } },
  { name: "closing", title: "Closing", fields: {
    eyebrow: text("Experience closing eyebrow", "Small label above the final invitation; currently ‘Take the First Step’.", 40),
    intro: text("Experience closing invitation", "Paragraph above the final contact actions. Keep consultation/care wording clinic-approved.", 400, true),
    callLabel: text("Final call-button text", "Visible final telephone label; tracking ID and destination stay fixed.", 32),
    whatsappLabel: text("Final WhatsApp-button text", "Visible final WhatsApp label; tracking ID and message stay fixed.", 40),
  } },
];

const unset = (value: unknown) => value == null || typeof value === "string" && !value.trim() ? undefined : value;
export function optionalText(field: TextField) {
  const contract = editorialText.max(field.max).refine(value => field.multiline || !/[\r\n]/.test(value), "Use a single line.");
  return z.preprocess(unset, contract.optional());
}
const headline = z.preprocess(value => {
  if (value && typeof value === "object" && !Array.isArray(value) && Object.keys(headlineFields).every(key => unset(Reflect.get(value, key)) === undefined)) return undefined;
  return unset(value);
}, z.object(Object.fromEntries(Object.entries(headlineFields).map(([key, field]) => [key, editorialText.max(field.max).refine(v => !/[\r\n]/.test(v), "Use a single line.")]))).optional());
export function sectionCopySchema(spec: SectionSpec) {
  return z.object(Object.fromEntries(Object.entries(spec.fields).filter(([, f]) => f.kind !== "image").map(([key, field]) => [key, field.kind === "text" ? optionalText(field) : headline])));
}
export function resolveSections(editorial: unknown, media: unknown, specs: SectionSpec[]): EditorialSections {
  const source = z.record(z.unknown()).safeParse(editorial), images = z.record(z.unknown()).safeParse(media);
  if (!source.success) return {};
  const output: EditorialSections = {};
  for (const spec of specs) {
    const raw = z.record(z.unknown()).safeParse(source.data[spec.name]);
    if (!raw.success) continue;
    const copy = sectionCopySchema(spec).safeParse(raw.data);
    const values: Record<string, unknown> = copy.success ? Object.fromEntries(Object.entries(copy.data).filter(([, value]) => value !== undefined)) : {};
    const group = images.success ? z.record(z.unknown()).safeParse(images.data[spec.name]) : null;
    for (const [key, field] of Object.entries(spec.fields)) if (field.kind === "image") {
      const value = imageFromRecord(group?.success ? group.data[key] : undefined, imageProfiles[field.profile].portrait);
      if (value) values[key] = value;
    }
    if (Object.keys(values).length) output[spec.name] = values;
  }
  return output;
}
