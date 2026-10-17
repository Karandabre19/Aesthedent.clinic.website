import { z } from "zod";
import type { Metadata } from "next";
import { publicRoutes } from "./navigation-data";
import { editorialText } from "./content-validation";
import { imageFromRecord, type CmsImage } from "./image";
import { imageUrl } from "./image-url";
import { SITE_URL } from "../../lib/schema.js";
import { siteMetadata } from "../../lib/site-metadata";

const optionalCopy = (maximum: number) => z.preprocess(value => value == null || value === "" ? undefined : value, editorialText.max(maximum).optional());
export const seoCopy = z.object({
  metaTitle: optionalCopy(180), metaDescription: optionalCopy(600), ogTitle: optionalCopy(180), ogDescription: optionalCopy(600), twitterTitle: optionalCopy(180), twitterDescription: optionalCopy(600),
  canonicalRoute: z.preprocess(value => value == null || value === "" ? undefined : value, z.string().refine(value => publicRoutes.includes(value), "Select an existing Aesthedent route.").optional()),
  index: z.boolean().nullish(), follow: z.boolean().nullish(), visibilityReason: optionalCopy(1000), structuredData: z.boolean().nullish(), faqStructuredData: z.boolean().nullish(), socialImage: z.unknown().optional(),
}).superRefine((seo, context) => { if ((seo.index === false || seo.follow === false) && !seo.visibilityReason) context.addIssue({ code: "custom", path: ["visibilityReason"], message: "Explain this search-visibility decision before publication." }); });
export type SeoControls = Omit<z.infer<typeof seoCopy>, "socialImage"> & { socialImage?: CmsImage };
export const pageRoutes: Record<string, string> = { homePage: "/", aboutPage: "/about", experiencePage: "/aesthedent-experience", servicesPage: "/services", teamPage: "/doctor", insightsPage: "/insights", contactPage: "/contact", localLandingPage: "/dental-clinic-in-kothrud" };
export function documentRoute(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const type = Reflect.get(value, "_type"), slug = Reflect.get(value, "slug");
  if (typeof type !== "string") return undefined;
  if (pageRoutes[type]) return pageRoutes[type];
  const current = typeof slug === "string" ? slug : slug && typeof slug === "object" ? Reflect.get(slug, "current") : undefined;
  const route = typeof current === "string" && ["service", "insight"].includes(type) ? `/${type === "service" ? "services" : "insights"}/${current}` : undefined;
  return route && publicRoutes.includes(route) ? route : undefined;
}
export function mapSeo(value: unknown): SeoControls | undefined {
  const parsed = seoCopy.safeParse(value);
  if (!parsed.success) return undefined;
  const { socialImage, ...copy } = parsed.data;
  const image = imageFromRecord(socialImage);
  return { ...copy, ...(image ? { socialImage: image } : {}) };
}
export function canonicalProblem(route: string, seo: SeoControls, records: Record<string, SeoControls> = {}): string | undefined {
  const target = seo.canonicalRoute ?? route;
  if (!publicRoutes.includes(target)) return "Select an existing canonical route.";
  if (target !== route) {
    if (!seo.visibilityReason) return "Explain why another page should be canonical.";
    if (seo.index === false) return "Use either noindex or a cross-page canonical; these signals conflict.";
    if (records[target]?.index === false) return "The canonical target is not indexable.";
    if ((records[target]?.canonicalRoute ?? target) !== target) return "The target must be self-canonical; chains and cycles are not permitted.";
  }
}
export type SeoInventory = { pages: Record<string, SeoControls>; defaults: SeoControls };
export function resolveSeoInventory(input: unknown): { value: SeoInventory; status: string } {
  const empty: SeoInventory = { pages: {}, defaults: {} };
  const parsed = z.array(z.object({ _id: z.string(), _type: z.string(), slug: z.unknown().optional(), seo: z.unknown().optional(), defaults: z.unknown().optional() })).max(40).safeParse(input);
  if (!parsed.success) return { value: empty, status: "invalid" };
  const pages: Record<string, SeoControls> = {}; let defaults: SeoControls = {}, seenDefaults = false;
  for (const raw of parsed.data) {
    if (!raw || typeof raw !== "object" || typeof raw._id !== "string" || raw._id.startsWith("drafts.") || raw._id.startsWith("versions.")) return { value: empty, status: "invalid" };
    if (raw._type === "seoSettings") {
      if (raw._id !== "seoSettings" || seenDefaults) return { value: empty, status: "ambiguous" };
      seenDefaults = true; defaults = mapSeo(raw.defaults) ?? {};
      // Shared copy/image defaults never change site-wide indexing or canonical policy.
      delete defaults.index; delete defaults.follow; delete defaults.canonicalRoute; delete defaults.structuredData; delete defaults.faqStructuredData;
      continue;
    }
    const route = documentRoute(raw);
    if (!route || raw._type === "insight" || pageRoutes[raw._type] && raw._id !== raw._type) continue;
    if (Object.hasOwn(pages, route)) return { value: empty, status: "ambiguous" };
    pages[route] = mapSeo(raw.seo) ?? {};
  }
  // Clear only invalid SEO decisions; public content and other routes survive.
  const valid = Object.fromEntries(Object.entries(pages).filter(([route, seo]) => !canonicalProblem(route, seo, pages)));
  return { value: { pages: valid, defaults }, status: parsed.data.length ? "sanity" : "missing" };
}
export function resolveSeoMetadata(route: string, base: Metadata, defaults: SeoControls = {}, supplied: SeoControls = {}, peers: Record<string, SeoControls> = {}) {
  const seo = canonicalProblem(route, supplied, peers) ? {} : supplied;
  const rootTitle = siteMetadata.title && typeof siteMetadata.title === "object" && "default" in siteMetadata.title ? siteMetadata.title.default : "Aesthedent";
  const baseTitle = typeof base.title === "string" ? base.title : base.title && "absolute" in base.title ? base.title.absolute : base.title && "default" in base.title ? base.title.default : undefined;
  const title = seo.metaTitle ?? baseTitle ?? (route === "/" ? defaults.metaTitle ?? rootTitle : rootTitle);
  const description = seo.metaDescription ?? base.description ?? defaults.metaDescription ?? siteMetadata.description ?? "";
  const canonicalRoute = seo.canonicalRoute ?? route, canonical = `${SITE_URL}${canonicalRoute === "/" ? "/" : canonicalRoute}`;
  const image = seo.socialImage ?? defaults.socialImage;
  const baseImages = base.openGraph?.images;
  const images = seo.socialImage ? [{ url: imageUrl(seo.socialImage, 1200, 630), width: 1200, height: 630, alt: seo.socialImage.alt }] : baseImages ?? (image ? [{ url: imageUrl(image, 1200, 630), width: 1200, height: 630, alt: image.alt }] : siteMetadata.openGraph?.images);
  const socialTitle = seo.ogTitle ?? base.openGraph?.title ?? (route === "/" ? defaults.ogTitle ?? siteMetadata.openGraph?.title : `${title}${String(title).includes("Aesthedent") ? "" : " | Aesthedent"}`);
  const socialDescription = seo.ogDescription ?? seo.metaDescription ?? (route === "/" ? defaults.ogDescription : undefined) ?? base.openGraph?.description ?? description;
  const indexable = seo.index !== false && canonicalRoute === route;
  const metadata: Metadata = { ...base, title: route === "/" ? { absolute: String(title) } : seo.metaTitle ? seo.metaTitle : base.title ?? title, description, alternates: { ...base.alternates, canonical: canonicalRoute }, robots: { index: seo.index !== false, follow: seo.follow !== false },
    openGraph: { ...base.openGraph, type: base.openGraph && "type" in base.openGraph ? base.openGraph.type : "website", title: socialTitle, description: socialDescription, url: canonical, locale: "en_IN", siteName: "Aesthedent Dental Clinic", images },
    twitter: { card: "summary_large_image", title: seo.twitterTitle ?? (route === "/" ? defaults.twitterTitle : undefined) ?? seo.ogTitle ?? socialTitle, description: seo.twitterDescription ?? (route === "/" ? defaults.twitterDescription : undefined) ?? socialDescription, images: images as NonNullable<Metadata["twitter"]>["images"] },
  };
  return { metadata, indexable, structuredData: seo.structuredData !== false, faqStructuredData: seo.faqStructuredData !== false };
}
