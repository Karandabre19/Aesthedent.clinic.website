import { z } from "zod";
import { DOCTORS } from "../../lib/clinic";
import { insights } from "../../lib/insights.js";
import { insightContent, resolveInsightOverrides, getFeaturedInsightSlugs, type InsightOverride } from "./insight-mapping";
import { imageFromRecord, imageFromStudioReference } from "./image";
import { editorialText } from "./content-validation";

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
  for (const [parsed, prefix] of [[content, []], [sources, ["sources"]], [review, ["review"]]] as const) if (!parsed.success) for (const issue of parsed.error.issues) issues.push({ message: issue.message, path: [...prefix, ...issue.path] });
  if (!content.success) return issues;
  if (!insights.some(item => item.slug === doc.slug)) issues.push({ message: "Use an existing article URL.", path: ["slug"] });
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
