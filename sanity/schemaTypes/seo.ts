import { SeoImpactInput } from "../studio/SeoImpactInput";
import { defineField, defineType, getPublishedId, type DocumentDefinition, type ValidationContext } from "sanity";
import { canonicalProblem, documentRoute, mapSeo, pageRoutes, seoCopy, type SeoControls } from "../lib/seo-mapping";
import { publicRoutes } from "../lib/navigation-data";
import { contentErrors } from "../lib/content-validation";
import { textField } from "./content-fields";
import { editorialImage } from "./editorial-fields";
import { requireSanityEnvironment } from "../env";
import { insightFieldErrors } from "../lib/insight-review";
import { backlinksField } from './backlinks';
import { SITE_URL } from '../../lib/schema.js';

export function seoField(shared = false, article = false) {
  return defineField({ name: shared ? "defaults" : "seo", title: shared ? "Shared SEO defaults" : "Search and social sharing", type: "object", components: { input: SeoImpactInput }, options: { collapsible: true, collapsed: false },
    description: shared ? "Fallback copy and social image only. Existing page-specific metadata takes precedence. Shared defaults cannot deindex the website or change its canonical URLs." : "Empty overrides retain the page's existing metadata. Review the effective preview and search-visibility warnings before publishing. URLs remain fixed.",
    fields: [...(!shared ? [backlinksField(SITE_URL),
      textField("focusKeyword", "Focus keyword", false, false, { maxLength: 80, description: 'The main phrase patients search for that this page should rank for, e.g. "dental implants in Kothrud". The checks above show where it is missing.' }),
      defineField({ name: "secondaryKeywords", title: "Related keywords", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, description: 'Up to eight related phrases, e.g. "tooth implant cost Pune". Used for the keywords tag and the checks.', validation: rule => rule.max(8).unique() }),
    ] : []), ...(!article ? [textField("metaTitle", "Search result title", false, false, { maxLength: 180 }), textField("metaDescription", "Search result description", false, true, { maxLength: 600 })] : []), ...["ogTitle", "ogDescription", "twitterTitle", "twitterDescription"].map(name => textField(name, name.replace("og", "Open Graph ").replace("twitter", "Twitter / X ").replace(/([A-Z])/g, " $1"), false, name.endsWith("Description"), { maxLength: name.endsWith("Description") ? 600 : 180 })), editorialImage("socialImage", "social"), ...(!shared ? [
      defineField({ name: "canonicalRoute", title: "Canonical page", description: "Leave empty for this page. Selecting another page asks search engines to prefer it and removes this URL from the sitemap. Existing Aesthedent routes only; external canonicals are not supported.", type: "string", options: { list: publicRoutes.map(value => ({ title: value, value })) }, validation: rule => rule.custom((value, context) => !value || value === documentRoute(context.document) || "Cross-page canonical: explain the decision and verify the target is indexable and self-canonical.").warning() }),
      ...["index", "follow"].map(name => defineField({ name, title: name === "index" ? "Allow search indexing" : "Allow search engines to follow links", type: "boolean", description: "Unset means Yes. Turning this off is an advanced search-visibility decision; an explanation is required.", validation: rule => rule.custom(value => value !== false || "This changes search visibility. Review the reason and effective metadata before publication.").warning() })),
      textField("visibilityReason", "Reason for search-visibility / canonical change", false, true, { maxLength: 1000 }),
      defineField({ name: "structuredData", title: "Include this page's supported structured data", type: "boolean", hidden: ({ document }) => ["homePage", "experiencePage"].includes(document?._type ?? ""), description: "Unset means Yes. Controls existing page-specific builders only; clinic facts and technical entity markup remain code-owned." }),
      defineField({ name: "faqStructuredData", title: "Include visible treatment FAQ structured data", type: "boolean", hidden: ({ document }) => document?._type !== "service", description: "Unset means Yes. FAQ markup always uses the same answers displayed on the page; it never creates a rich-result guarantee." }),
    ] : [])], validation: rule => rule.custom(value => value == null || contentErrors(seoCopy, value)),
  });
}
export async function validateDocumentSeo(value: unknown, context: ValidationContext) {
  const route = documentRoute(value);
  if (!route || !value || typeof value !== "object") return true;
  const raw = Reflect.get(value, "seo"); if (raw == null) return true;
  // The SEO input already pinpoints malformed values; this validator only owns
  // cross-page decisions and must not add an unhelpful parent error.
  const seo = mapSeo(raw); if (!seo) return true;
  let peers: Record<string, SeoControls> = {};
  if (seo.canonicalRoute && seo.canonicalRoute !== route) {
    try {
      const { apiVersion } = requireSanityEnvironment();
      // Only the target can invalidate this decision; unrelated articles must
      // not make canonical checks fail when the content catalogue grows.
      const singleton = Object.entries(pageRoutes).find(([, path]) => path === seo.canonicalRoute)?.[0];
      const type = singleton ?? (seo.canonicalRoute.startsWith('/services/') ? 'service' : 'insight');
      const records = await context.getClient({ apiVersion }).withConfig({ perspective: "published", useCdn: false }).fetch<unknown>('*[!(_id in path("drafts.**")) && !(_id in path("versions.**")) && _type == $type && select($singleton != null => _id == $singleton, slug.current == $slug)][0...2]{_type,slug,seo{canonicalRoute,index,visibilityReason}}', { type, singleton: singleton ?? null, slug: seo.canonicalRoute.split('/').at(-1) });
      if (!Array.isArray(records) || records.length > 1) throw new Error("Invalid response");
      for (const record of records) { const path = documentRoute(record); if (path) { if (Object.hasOwn(peers, path)) throw new Error("Ambiguous canonical target"); peers[path] = mapSeo(record.seo) ?? {}; } }
    } catch { return { message: "Could not verify the canonical target. Save the draft and retry before publication.", path: ["seo", "canonicalRoute"] }; }
  }
  const problem = canonicalProblem(route, seo, peers);
  const field = Reflect.get(value, "_type") === "insight" && problem === "Explain why another page should be canonical." ? "visibilityReason"
    : Reflect.get(value, "_type") === "insight" && problem === "Use either noindex or a cross-page canonical; these signals conflict." ? "index" : "canonicalRoute";
  return problem ? { message: problem, path: ["seo", field] } : true;
}
export function withPageSeo(model: DocumentDefinition): DocumentDefinition {
  if (!pageRoutes[model.name] && !["service", "insight"].includes(model.name)) return model;
  const original = model.validation;
  const seo = seoField(false, model.name === "insight");
  // The Insight parent validates text at its exact nested path. Retain image,
  // keyword uniqueness and search-visibility checks not owned by that contract.
  const insightSeo = model.name === "insight" ? {
    fields: seo.fields.map(field => field.name === "secondaryKeywords" ? { ...field, validation: (rule: import("sanity").ArrayRule<unknown[]>) => rule.unique().error("Remove repeated related keywords; each phrase should appear once.") } : ["backlinks", "socialImage", "canonicalRoute", "index", "follow"].includes(field.name) ? field : { ...field, validation: undefined }),
    validation: (rule: import("sanity").Rule) => rule.custom(value => insightFieldErrors("seo", value)),
  } : {};
  return { ...model, groups: [...(model.groups ?? []), ...(!model.groups?.some(group => group.name === "seo") ? [{ name: "seo", title: "Search and social sharing" }] : [])], fields: [...model.fields, { ...seo, ...insightSeo, group: "seo" }], validation: rule => {
    const existing = typeof original === "function" ? original(rule) : original;
    return [...(Array.isArray(existing) ? existing : existing ? [existing] : []), rule.custom(validateDocumentSeo)];
  } };
}
export const seoSettings = defineType({ name: "seoSettings", title: "Shared SEO defaults", type: "document", fields: [seoField(true)], validation: rule => rule.custom((_, context) => getPublishedId(context.document?._id ?? "") === "seoSettings" || "Use Shared SEO defaults in Structure."), preview: { prepare: () => ({ title: "Shared SEO defaults" }) } });
