import { z } from "zod";
import { imageForDocument, type CmsImage } from "./image";
import { seoCopy, mapSeo, type SeoControls } from "./seo-mapping";
import { insights } from "../../lib/insights.js";

// Same list the Studio offers. Published and preview reads now agree; the
// authenticated inventory on 2026-10-17 held no stored category values to strand.
export const insightCategories = [...new Set(insights.map((item: { category: string }) => item.category))] as [string, ...string[]];

const text = z.string().min(1).regex(/\S/, "Use nonblank text.").regex(/^(?![\s\S]*<\/?[A-Za-z][^>]*>)[\s\S]*$/, "Use plain text.");
const optionalText = (maximum: number) => z.preprocess(value => value == null || typeof value === 'string' && !value.trim() ? undefined : value, text.max(maximum).optional());
const key = z.string().min(1);
export const insightSlug = z.string().min(1).max(96).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words joined by hyphens, up to 96 characters.');
export const maxInsights = 1000;
export const safeInsightLink = z.string().refine((href) => {
  if (/[\s\\\u0000-\u001f\u007f]/.test(href)) return false;
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  if (/^#[A-Za-z0-9_-]+$/.test(href)) return true;
  try {
    const url = new URL(href);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}, "Use a root-relative path, section fragment or HTTPS link.");
const link = z.object({ _type: z.literal("link"), _key: key, href: safeInsightLink });
const span = z.object({ _type: z.literal("span"), _key: key, text: z.string(), marks: z.array(key).default([]) });
const block = z.object({
  _type: z.literal("block"), _key: key,
  style: z.enum(["normal", "lead", "h2", "h3"]).default("normal"),
  listItem: z.enum(["bullet", "number"]).nullish(),
  level: z.number().int().min(1).max(3).nullish(),
  markDefs: z.array(link).default([]), children: z.array(span).min(1),
}).superRefine((value, context) => {
  const definitions = value.markDefs.map((mark) => mark._key);
  const validMarks = new Set(["strong", "em", ...definitions]);
  if (new Set(definitions).size !== definitions.length || definitions.some((mark) => mark === "strong" || mark === "em")) context.addIssue({ code: "custom", message: "Link keys must be unique." });
  if (new Set(value.children.map((child) => child._key)).size !== value.children.length) context.addIssue({ code: "custom", message: "Span keys must be unique." });
  if (value.children.some((child) => child.marks.some((mark) => !validMarks.has(mark)))) context.addIssue({ code: "custom", message: "Unsupported or unresolved text mark." });
  if (value.listItem && value.style !== "normal" || !value.listItem && value.level != null) context.addIssue({ code: "custom", message: "Invalid list structure." });
}).transform((value) => ({
  // Explicit construction keeps required renderer fields required even in this
  // repository's pre-existing non-strict TypeScript configuration.
  _type: value._type, _key: value._key, style: value.style,
  children: value.children.map((child) => ({ _type: child._type, _key: child._key, text: child.text, marks: child.marks })),
  markDefs: value.markDefs.map((mark) => ({ _type: mark._type, _key: mark._key, href: mark.href })),
  ...(value.listItem ? { listItem: value.listItem, level: value.level ?? 1 } : {}),
}));
export const insightBody = z.array(block).min(1).max(200)
  .refine((blocks) => new Set(blocks.map((item) => item._key)).size === blocks.length, "Block keys must be unique.")
  .refine((blocks) => blocks.some((item) => item.children.some((child) => child.text.trim().length > 0)), "Add article text.");
export type InsightBody = z.infer<typeof insightBody>;

export const insightContent = z.object({
  seo: seoCopy.nullish(),
  title: text.max(180), excerpt: text.max(600), metaTitle: optionalText(100),
  metaDescription: optionalText(320), listingTitle: optionalText(180), listingExcerpt: optionalText(600),
  modifiedAt: z.preprocess(value => value == null || value === '' ? undefined : value, z.string().datetime({ offset: true }).optional()),
  category: z.enum(insightCategories, { message: "Choose one of the existing Insight categories." }), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date in YYYY-MM-DD format.").refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }, "Use a valid calendar date."),
  readTimeMinutes: z.number().int().min(1).max(60), featured: z.boolean(), body: insightBody,
});
export const insightDocument = insightContent.extend({
  _id: key.refine((id) => !id.startsWith("drafts.") && !id.startsWith("versions.")), slug: insightSlug,
});
export type InsightOverride = {
  seo?: SeoControls;
  slug: string; title: string; excerpt: string; metaTitle: string; category: string;
  date: string; publishedDate: string; readTime: string; featured: boolean; body: InsightBody; coverImage?: CmsImage;
  metaDescription?: string; listingTitle?: string; listingExcerpt?: string; modifiedAt?: string;
  author?: { name: string; url: string }; reviewer?: { name: string; url: string }; reviewedAt?: string;
  sources?: { title: string; url: string }[];
};
type ExistingInsight = { slug: string; featured?: boolean };

// Once CMS content is supplied, its Featured selection replaces the static default.
export function getFeaturedInsightSlugs(overrides: readonly ExistingInsight[], existing: readonly ExistingInsight[]): string[] {
  return (overrides.length ? overrides : existing).filter(item => item.featured).map(item => item.slug);
}

export function resolveInsightOverrides(input: unknown, existing: readonly ExistingInsight[]): { overrides: InsightOverride[]; status: string } {
  const parsed = z.array(insightDocument).max(maxInsights).safeParse(input);
  if (!parsed.success) return { overrides: [], status: "invalid" };
  if (!parsed.data.length) return { overrides: [], status: "missing" };
  if (new Set(parsed.data.map((doc) => doc.slug)).size !== parsed.data.length) return { overrides: [], status: "ambiguous" };
  const overrides = parsed.data.map((doc): InsightOverride => ({
    slug: doc.slug, title: doc.title, excerpt: doc.excerpt, metaTitle: doc.metaTitle ?? doc.title,
    category: doc.category, publishedDate: doc.date,
    date: new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${doc.date}T00:00:00Z`)),
    readTime: `${doc.readTimeMinutes} min read`, featured: doc.featured, body: doc.body,
    ...(doc.metaDescription ? { metaDescription: doc.metaDescription } : {}), ...(doc.listingTitle ? { listingTitle: doc.listingTitle } : {}),
    ...(doc.seo ? { seo: mapSeo({ ...doc.seo, metaTitle: undefined, metaDescription: undefined }) } : {}),
    ...(doc.listingExcerpt ? { listingExcerpt: doc.listingExcerpt } : {}), ...(doc.modifiedAt ? { modifiedAt: doc.modifiedAt } : {}),
    ...(imageForDocument(input, doc._id, "coverImage") ? { coverImage: imageForDocument(input, doc._id, "coverImage") } : {}),
  }));
  if (getFeaturedInsightSlugs(overrides, existing).length > 1) return { overrides: [], status: "ambiguous" };
  return { overrides, status: "sanity" };
}

