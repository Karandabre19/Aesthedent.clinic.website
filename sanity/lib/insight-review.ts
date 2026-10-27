import { z } from "zod";
import { DOCTORS } from "../../lib/clinic";
import { insights } from "../../lib/insights.js";
import { insightContent, insightSlug, resolveInsightOverrides, getFeaturedInsightSlugs, type InsightOverride } from "./insight-mapping";
import { imageFromRecord, imageFromStudioReference } from "./image";
import { editorialText, studioPath } from "./content-validation";
import { backlinkIssues } from './backlinks';
import { SITE_URL } from '../../lib/schema.js';

export const reviewerKeys = ["sahil", "aishwarya"] as const;
export const reviewChecks = {
  identityConfirmed: "Named clinician identity, suitability for this topic and actual sign-off verified",
  clinicalAccuracyConfirmed: "Clinical claims checked for accuracy and approved by that clinician",
  sourcesConfirmed: "Sources support the claims and were checked by the reviewer",
  usefulnessConfirmed: "Useful, original and focused on the reader; no padding or keyword stuffing",
  completenessConfirmed: "Complete explanation and SEO metadata; no placeholders or unfinished sections",
  linksConfirmed: "Internal destinations and external links checked",
  mediaPermissionConfirmed: "Effective cover imagery, alt text, relevance and republication rights checked",
  datesConfirmed: "Publication and modification dates reflect real events",
};
const sourceUrl = z.string().url().refine(value => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password && !/[\s\\\u0000-\u001f\u007f]/.test(value);
}, "Use a source's HTTPS URL without credentials.");
export const articleSources = z.array(z.object({ title: editorialText.max(200), url: sourceUrl })).min(1).max(20)
  .refine(values => new Set(values.map(v => v.url)).size === values.length, "Use each source once.");
const reviewEvidence = z.object({
  clinicianKey: z.enum(reviewerKeys), approvalReference: editorialText.max(2000),
  reviewedAt: z.string().datetime({ offset: true }),
  ...Object.fromEntries(Object.keys(reviewChecks).map(key => [key, z.literal(true)])),
});
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
export function normalizeInsightDocument(value: unknown): Record<string, unknown> {
  const doc = record(value), slug = doc.slug;
  return { ...doc, slug: typeof slug === "string" ? slug : record(slug).current };
}
function imageIdentity(value: unknown) {
  const image = record(value), asset = record(image.asset);
  return { assetId: asset._ref ?? asset._id ?? null, alt: image.alt ?? null,
    crop: image.crop ? Object.fromEntries(["top", "bottom", "left", "right"].map(k => [k, record(image.crop)[k]])) : null,
    hotspot: image.hotspot ? Object.fromEntries(["x", "y", "width", "height"].map(k => [k, record(image.hotspot)[k]])) : null };
}
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key, v]) => !key.startsWith("_") && v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, canonical(v)]));
  return value;
}
export async function reviewDigest(value: unknown) {
  const doc = normalizeInsightDocument(value), content = insightContent.parse(doc), review = record(doc.review);
  const payload = canonical({ version: 1, slug: doc.slug, ...content, seo: content.seo ? Object.fromEntries(Object.entries({ ...content.seo, socialImage: content.seo.socialImage ? imageIdentity(content.seo.socialImage) : undefined }).filter(([, value]) => value != null)) : null, ...Object.fromEntries(["metaTitle", "metaDescription", "listingTitle", "listingExcerpt", "modifiedAt"].map(key => [key, Reflect.get(content, key) ?? null])), coverImage: imageIdentity(doc.coverImage), sources: doc.sources ?? [], authorKey: doc.authorKey ?? null,
    review: Object.fromEntries(["clinicianKey", "approvalReference", "reviewedAt", ...Object.keys(reviewChecks), "authorshipConfirmed"].map(k => [k, review[k] ?? null])) });
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
  return `v1:${Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("")}`;
}
export type ReadinessIssue = { message: string; path: (string | number)[] };
export function readinessIssues(value: unknown, now = new Date()): ReadinessIssue[] {
  const doc = normalizeInsightDocument(value), content = insightContent.safeParse(doc), sources = articleSources.safeParse(doc.sources), review = reviewEvidence.safeParse(doc.review);
  const issues: ReadinessIssue[] = [];
  for (const issue of backlinkIssues(record(doc.seo).backlinks, SITE_URL)) {
    const entries = record(doc.seo).backlinks;
    const path = issue.path.map(segment => typeof segment === 'object' && Array.isArray(entries) ? entries.findIndex(entry => entry?._key === segment._key) : segment);
    issues.push({ message: issue.message, path: ['seo', 'backlinks', ...path.filter((segment): segment is string | number => typeof segment === 'string' || typeof segment === 'number')] });
  }
  for (const [parsed, prefix] of [[content, []], [sources, ["sources"]], [review, ["review"]]] as const) {
    if (parsed.success) continue;
    for (const issue of parsed.error.issues) {
      const message = issue.path.length === 0 && prefix[0] === "sources"
        ? "Add at least one real clinical source, with a title and HTTPS link, checked by the reviewing clinician."
        : issue.path.length === 0 && prefix[0] === "review"
          ? "Enter the actual reviewing clinician, approval reference and review date, then confirm the review checks and use Record clinician sign-off."
          : issue.message;
      issues.push({ message, path: [...prefix, ...issue.path] });
    }
  }
  if (!content.success) return issues;
  if (!insightSlug.safeParse(doc.slug).success) issues.push({ message: "Enter the title, then generate a lowercase article web address using hyphens.", path: ["slug"] });
  if (!insights.some(item => item.category === content.data.category)) issues.push({ message: "Review this article's category against the existing categories.", path: ["category"] });
  if (content.data.date > now.toISOString().slice(0, 10)) issues.push({ message: "First publication cannot be in the future. No scheduled publishing is configured.", path: ["date"] });
  if (content.data.modifiedAt && (Date.parse(content.data.modifiedAt) < Date.parse(content.data.date) || Date.parse(content.data.modifiedAt) > now.valueOf())) issues.push({ message: "Use the actual update time, after first publication and not in the future.", path: ["modifiedAt"] });
  if (review.success && (Date.parse(review.data.reviewedAt) > now.valueOf() || content.data.modifiedAt && Date.parse(review.data.reviewedAt) < Date.parse(content.data.modifiedAt))) issues.push({ message: "Review must be real, not future-dated, and cover the latest substantive update.", path: ["review", "reviewedAt"] });
  let section = false;
  for (const [index, block] of content.data.body.entries()) {
    if (block.style === "h2") section = true;
    if (block.style === "h3" && !section) issues.push({ message: "Introduce an H2 section before an H3 subsection.", path: ["body", index] });
  }
  if (!section) issues.push({ message: "Add a meaningful H2 section; the page supplies H1.", path: ["body"] });
  if (doc.authorKey != null && (!reviewerKeys.includes(doc.authorKey as typeof reviewerKeys[number]) || record(doc.review).authorshipConfirmed !== true)) issues.push({ message: "Confirm actual authorship and attribution permission; a clinician identity alone is not authorship.", path: ["authorKey"] });
  const image = record(doc.coverImage);
  if (Object.keys(image).length && !(imageFromRecord(doc.coverImage) || imageFromStudioReference(doc.coverImage))) issues.push({ message: "Check the cover asset, descriptive alt, delivery format and crop before recording review.", path: ["coverImage"] });
  const socialImage = record(doc.seo).socialImage;
  if (socialImage && !(imageFromRecord(socialImage) || imageFromStudioReference(socialImage))) issues.push({ message: "Check the social image, alternative text and crop before recording review.", path: ["seo", "socialImage"] });
  return issues;
}
export async function checkInsightReadiness(value: unknown): Promise<ReadinessIssue[]> {
  const issues = readinessIssues(value), doc = record(value), review = record(doc.review);
  if (doc.editorialStatus !== "ready") issues.push({ message: "Save as draft or submit for review. Record the real clinician sign-off before publishing.", path: ["editorialStatus"] });
  if (!issues.length && (typeof review.recordedBy !== "string" || !review.recordedBy || !z.string().datetime({ offset: true }).safeParse(review.recordedAt).success || Date.parse(String(review.recordedAt)) > Date.now() || review.digest !== await reviewDigest(value))) issues.push({ message: "Review is absent or stale. Record sign-off again for this exact content version.", path: ["review"] });
  return issues;
}

// Studio presentation only: published readers and review digests keep their
// original contracts. Paths are relative to the input being validated.
const insightLabels: Record<string, string> = {
  slug: "Article web address", title: "Article title", excerpt: "Short summary",
  metaTitle: "Shorter title for Google", metaDescription: "Description for Google and sharing",
  listingTitle: "Different title on the Insights page", listingExcerpt: "Different summary on the Insights page",
  category: "Category", date: "Publication date", modifiedAt: "Actual update time",
  readTimeMinutes: "Reading time", featured: "Featured selection", body: "Article body",
  sources: "References checked by the doctor", review: "Doctor’s approval", editorialStatus: "Article progress",
  authorKey: "Verified author", coverImage: "Article cover", seo: "Search and social sharing",
  clinicianKey: "Which doctor checked this article?", approvalReference: "Where is the doctor’s approval recorded?",
  reviewedAt: "When did the doctor check it?", authorshipConfirmed: "The named author wrote this article and agreed to be named",
  url: "Link to that source", href: "Link destination", alt: "Picture description",
  socialImage: "Social sharing image", canonicalRoute: "Canonical page",
  visibilityReason: "Reason for search-visibility / canonical change",
  focusKeyword: "Focus keyword", secondaryKeywords: "Related keywords",
  ogTitle: "Open Graph title", ogDescription: "Open Graph description",
  twitterTitle: "Twitter / X title", twitterDescription: "Twitter / X description",
  index: "Allow indexing", follow: "Allow link following",
  ...reviewChecks,
  identityConfirmed: "I checked the reviewer’s identity, their knowledge of this topic, and their approval",
  clinicalAccuracyConfirmed: "The doctor checked and approved the medical information",
  sourcesConfirmed: "The doctor checked that the references support what this article says",
  usefulnessConfirmed: "The article helps readers and is original, without filler or repeated search phrases",
  completenessConfirmed: "The article and search descriptions are finished, with no missing sections or temporary text",
  linksConfirmed: "I opened the links and checked that they go to the right pages",
  mediaPermissionConfirmed: "The pictures fit this article, have accurate descriptions, and we have permission to publish them again",
  datesConfirmed: "The publication and update dates are when those events really happened",
};
export function insightFieldLabel(path: readonly unknown[]): string {
  if (path[0] === "sources" && path.at(-1) === "title") return "References checked by the doctor → Title of the source";
  return path.filter((part): part is string => typeof part === "string" && part in insightLabels)
    .map(part => insightLabels[part]).join(" → ") || "Article content";
}

function fieldMessage(issue: z.ZodIssue, path: (string | number)[]) {
  const label = insightFieldLabel(path);
  const field = path.at(-1);
  if (path[0] === "review" && typeof field === "string" && field in reviewChecks) return "Tick this box only after this check has really been completed. Leave it unticked if you are still waiting.";
  if (field === "clinicianKey") return "Choose the doctor who checked and approved this article.";
  if (field === "reviewedAt" || field === "modifiedAt") return "Use the date and time picker to choose when this actually happened. Include the timezone, for example +05:30 for India.";
  if (field === "url" || field === "href") return field === "url" ? "Open the source the doctor checked, copy its web address and paste it here. It must start with https:// and contain no spaces or sign-in details." : "Paste the full link starting with https://, or a website page such as /contact. For a heading on this page, use # followed by its section name.";
  if (path[0] === "sources" && field === "title") return "Enter the title of the study, guideline or article the doctor checked. Use plain text, without HTML, up to 200 characters.";
  if (field === "approvalReference") return "Describe where a clinic colleague can find the doctor’s actual approval, such as their email or signed note. Explain how they are qualified to check this topic. Use plain text, up to 2,000 characters.";
  if (path[0] === "sources" && path.length === 1 && issue.code === "too_small") return "Click Add item below. Add the title and web link of at least one source the doctor used to check this article.";
  if (path[0] === "body" && path.length === 1 && issue.code === "too_small") return "Click into Article body and start writing. Add the full article text and at least one Section heading.";
  if (issue.code === "invalid_type" && issue.received === "undefined") {
    if (path[0] === "sources" && path.length === 1) return "Click Add item below. Add the title and web link of at least one source the doctor used to check this article.";
    if (path[0] === "review" && path.length === 1) return "Open Doctor’s approval below. Choose the doctor, describe where their approval is saved, enter when they checked the article, and complete the checkboxes.";
    const missing: Record<string, string> = { title: "Write the heading readers should see at the top of this article.", excerpt: "Write a short introduction explaining what readers will learn from this article.", category: "Choose the topic that best describes this article from the list.", date: "Choose the day this article was first published, using the date picker.", readTimeMinutes: "Estimate how many minutes this article takes to read. Enter a whole number, such as 5.", body: "Click into Article body and start writing. Add the full article text and at least one Section heading.", featured: "Choose whether this article should be highlighted at the top of the Insights page." };
    return missing[String(path[0])] ?? `Fill in ${label} before publishing.`;
  }
  if (path[0] === "readTimeMinutes" && !(issue.code === "invalid_type" && issue.received === "undefined")) return "Enter a whole number of minutes from 1 to 60.";
  if (issue.code === "too_big") return issue.type === "array" ? `Keep no more than ${issue.maximum} items in ${label}.` : `Shorten ${label} to ${issue.maximum} characters or fewer.`;
  if (issue.code === "too_small") {
    if (issue.type === "array") return `Add at least ${issue.minimum} ${path[0] === "sources" ? "clinical source" : "item"}${issue.minimum === 1 ? "" : "s"}.`;
    if (issue.type === "number") return "Enter a whole number of minutes from 1 to 60.";
    return `Write some text in ${label}; spaces alone do not count.`;
  }
  if (issue.message === "Required") return `Complete ${label} before publishing.`;
  if (/Invalid literal|Invalid enum|Expected |Invalid input|Invalid datetime/.test(issue.message)) return path[0] === "body" ? "This text block has unsupported formatting. Reapply its paragraph, heading, list or link formatting in the editor." : `Choose a valid value for ${label}.`;
  const bodyMessages: Record<string, string> = {
    "Link keys must be unique.": "A link in this block is duplicated. Remove the affected link and add it again.",
    "Span keys must be unique.": "This text block contains duplicated text formatting. Recreate the affected block using the editor.",
    "Block keys must be unique.": "Two text blocks share an internal identifier. Recreate the duplicated block using the editor.",
    "Unsupported or unresolved text mark.": "This block contains an unsupported or broken link or text style. Remove and reapply that formatting.",
    "Invalid list structure.": "Use the editor’s list controls on a normal paragraph; headings cannot also be list items.",
  };
  const simplerMessages: Record<string, string> = {
    "Use nonblank text.": "Type some words here; spaces alone do not count.",
    "Use plain text.": "Remove any pasted HTML code, such as <p> or <b>. Enter only the words readers should see.",
    "Use plain text, not HTML.": "Remove any pasted HTML code, such as <p> or <b>. Enter only the words readers should see.",
    "Choose one of the existing Insight categories.": "Choose a topic from the Category list.",
    "Use a valid calendar date.": "Choose a real day, month and year using the date picker.",
    "Use a date in YYYY-MM-DD format.": "Use the date picker to choose the day, month and year.",
  };
  return bodyMessages[issue.message] ?? simplerMessages[issue.message] ?? issue.message;
}

export function insightFieldErrors(field: string, value: unknown) {
  const schema = field === "sources" ? articleSources : field === "review" ? reviewEvidence : insightContent.shape[field as keyof typeof insightContent.shape];
  if (!schema) return true;
  const parsed = schema.safeParse(value);
  if (parsed.success) return true;
  const issues = parsed.error.issues.flatMap(issue => {
    if (field === "sources" && issue.message === "Use each source once." && Array.isArray(value)) {
      return value.flatMap((source, index) => value.findIndex(other => record(other).url === record(source).url) === index ? [] : [{ message: "This source is already listed. Remove the duplicate source.", path: studioPath(value, [index, "url"]) }]);
    }
    if (field === "body" && issue.message === "Block keys must be unique." && Array.isArray(value)) {
      // Duplicate keys cannot identify a unique block. The index is the safe
      // focus target until the editor recreates that block with a fresh key.
      return value.flatMap((block, index) => value.findIndex(other => record(other)._key === record(block)._key) === index ? [] : [{ message: "This block duplicates another block’s internal identifier. Recreate this block using the editor.", path: [index] }]);
    }
    // Portable Text structure/style metadata has no separate editable input.
    // Annotation destinations do: preserve their full link-field paths.
    const annotation = issue.path.includes("markDefs") && issue.path.at(-1) === "href";
    const path = field === "body" && !annotation ? issue.path.slice(0, 1) : issue.path;
    return [{ message: fieldMessage(issue, [field, ...issue.path]), path: studioPath(value, path) }];
  });
  return issues.filter((issue, index) => issues.findIndex(other => JSON.stringify(other.path) === JSON.stringify(issue.path)) === index);
}

export async function insightStudioReadiness(value: unknown) {
  const doc = normalizeInsightDocument(value);
  const local = [insightContent.safeParse(doc), articleSources.safeParse(doc.sources), reviewEvidence.safeParse(doc.review)];
  const prefixes: (string | number)[][] = [[], ["sources"], ["review"]];
  const localPaths = new Set(local.flatMap((parsed, index) => parsed.success ? [] : parsed.error.issues.map(issue => JSON.stringify([...prefixes[index], ...issue.path]))));
  const issues = (await checkInsightReadiness(value)).filter(issue => {
    if (localPaths.has(JSON.stringify(issue.path)) || issue.path[0] === "slug") return false;
    const image = issue.path[0] === "coverImage" ? record(doc.coverImage) : issue.path[0] === "seo" && issue.path[1] === "socialImage" ? record(record(doc.seo).socialImage) : undefined;
    // Selected-image alt text has its own exact field validator. Do not add a
    // second containing-image error for that same missing description.
    if (image && record(image.asset)._ref && (typeof image.alt !== "string" || !image.alt.trim() || /<\/?[A-Za-z][^>]*>/.test(image.alt))) return false;
    return true;
  });
  return issues.map(issue => {
    const path = issue.path[0] === "authorKey" && reviewerKeys.includes(doc.authorKey as typeof reviewerKeys[number]) ? ["review", "authorshipConfirmed"] : issue.path;
    const instructions: Record<string, string> = {
      "Introduce an H2 section before an H3 subsection.": "This Subsection heading needs a Section heading before it. Select the heading text and use the text-style menu to change it to Section heading, or add a Section heading above it.",
      "Add a meaningful H2 section; the page supplies H1.": "Enter a section name in the Section heading box above the article editor, then click Add section heading. You can also select existing text and choose Section heading from the text-style menu.",
      "Save as draft or submit for review. Record the real clinician sign-off before publishing.": "After the doctor approves this article, fill in Doctor’s approval. Then choose Save doctor’s approval from the document actions menu beside Publish.",
      "Review is absent or stale. Record sign-off again for this exact content version.": "The doctor’s approval has not been saved for these changes. After the doctor checks the latest article, complete Doctor’s approval and click Save doctor’s approval below those fields.",
      "First publication cannot be in the future. No scheduled publishing is configured.": "Choose today or an earlier day for Publication date. This website cannot publish articles automatically on a future date.",
      "Use the actual update time, after first publication and not in the future.": "Choose when the latest meaningful change was made. It must be after the article’s publication date and cannot be in the future.",
      "Review must be real, not future-dated, and cover the latest substantive update.": "Choose when the doctor checked these changes. That cannot be in the future or before the latest article update. If the doctor has not checked the changes yet, wait for their approval.",
      "Confirm actual authorship and attribution permission; a clinician identity alone is not authorship.": "Confirm that the person selected as author really wrote this article and agreed to be named. Otherwise, clear the author selection.",
      "Check the cover asset, descriptive alt, delivery format and crop before recording review.": "Select an available article picture, describe what it shows, and check its crop. If you do not want to replace the current website picture, remove this optional picture selection.",
      "Check the social image, alternative text and crop before recording review.": "Select an available sharing picture, describe what it shows, and check its crop. Remove this optional selection if you do not want to replace the sharing picture.",
    };
    const message = instructions[issue.message] ?? issue.message;
    return { message, path: studioPath(value, path) };
  });
}
export async function resolvePublishedInsights(input: unknown, existing: readonly { slug: string; featured?: boolean }[]) {
  const parsed = resolveInsightOverrides(Array.isArray(input) ? input.map(normalizeInsightDocument) : input, existing);
  if (parsed.status !== "sanity" || !Array.isArray(input)) return parsed;
  const eligible: InsightOverride[] = [];
  for (const raw of input) {
    const doc = normalizeInsightDocument(raw);
    if (doc.editorialStatus !== "ready") continue;
    if ((await checkInsightReadiness(doc)).length) return { overrides: [], status: "invalid" };
    const mapped = parsed.overrides.find(item => item.slug === doc.slug);
    if (!mapped) return { overrides: [], status: "invalid" };
    const review = reviewEvidence.parse(doc.review), author = doc.authorKey ? DOCTORS[doc.authorKey as keyof typeof DOCTORS] : undefined;
    eligible.push({ ...mapped, reviewer: { name: DOCTORS[review.clinicianKey].name, url: "/doctor" }, reviewedAt: review.reviewedAt,
      ...(author ? { author: { name: author.name, url: "/doctor" } } : {}), sources: articleSources.parse(doc.sources).map(({ title, url }) => ({ title, url })) });
  }
  if (getFeaturedInsightSlugs(eligible, existing).length > 1) return { overrides: [], status: "ambiguous" };
  return { overrides: eligible, status: eligible.length ? "sanity" : "unreviewed" };
}
