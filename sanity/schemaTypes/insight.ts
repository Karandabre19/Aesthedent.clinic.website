import { editorialImage } from "./editorial-fields";
import { BookOpen } from "lucide-react";
import { defineArrayMember, defineField, defineType, getPublishedId } from "sanity";
import { z } from "zod";
import { insights } from "../../lib/insights.js";
import { requireSanityEnvironment } from "../env";
import { getFeaturedInsightSlugs, insightContent, safeInsightLink } from "../lib/insight-mapping";
import { insightFeaturedQuery } from "../lib/insight-query";
import { contentErrors } from "../lib/content-validation";
import { articleSources, checkInsightReadiness, reviewChecks, reviewerKeys } from "../lib/insight-review";
import { DOCTORS } from "../../lib/clinic";
import { InsightReadinessInput } from "../studio/InsightReadinessInput";

export const insight = defineType({
  name: "insight", title: "Insight", type: "document", icon: BookOpen,
  description: "Existing English articles only. Draft imports are not clinical approval. Complete real source/clinician review before publication; the website accepts only the exact reviewed content version. Names and credentials remain code-controlled.",
  groups: [{ name: "article", title: "Article and listing", default: true }, { name: "body", title: "Article body" }, { name: "review", title: "Clinical review" }, { name: "seo", title: "Search and social sharing" }],
  fields: [editorialImage("coverImage", "insight"),
    defineField({ name: "slug", title: "Existing article URL", type: "slug",
      description: `Use an existing slug: ${insights.map((item) => item.slug).join(", ")}. Published URLs cannot be renamed.`,
      validation: (rule) => rule.required().custom(async (value, context) => {
        if (!value?.current) return true;
        if (!insights.some((item) => item.slug === value.current)) return "Use an existing Aesthedent Insight slug.";
        if (!context.document?._id) return true;
        try {
          const { apiVersion } = requireSanityEnvironment();
          const previous = await context.getClient({ apiVersion }).withConfig({ perspective: "published" }).fetch<string | null>(
            '*[_id == $id][0].slug.current', { id: getPublishedId(context.document._id) },
          );
          return !previous || previous === value.current || "Keep the published article URL.";
        } catch { return "Could not verify the published URL. Check access and retry."; }
      }),
    }),
    defineField({ name: "title", title: "Article title", description: "Shared title on article cards, the detail page and applicable metadata. Use approved wording across all these contexts.", type: "string", validation: (r) => r.required().max(180) }),
    defineField({ name: "excerpt", title: "Article summary", description: "Shared card and metadata summary. Plain text, up to 600 characters; approve the wording across its different contexts.", type: "text", rows: 3, validation: (r) => r.required().max(600) }),
    defineField({ name: "metaTitle", title: "Optional shorter SEO title", type: "string", description: "Leave unset to use the title. Keep the article's existing search intent; do not compete with service pages.", validation: (r) => r.max(100) }),
    defineField({ name: "metaDescription", title: "Search and social description", type: "text", rows: 3, description: "Optional search/social summary; defaults to Article summary. Aim near 140–160 characters when useful, not at the expense of accuracy. This is guidance, not a Google length rule.", validation: r => [r.max(320), r.custom(value => !value || value.length <= 160 || "Longer descriptions may be truncated; review the effective snippet.").warning()] }),
    defineField({ name: "listingTitle", title: "Insights-listing title override", type: "string", description: "Only the /insights listing. Leave empty for Article title. Preserve existing contextual wording until its editorial decision; Home, detail and related cards use Article title.", validation: r => r.max(180) }),
    defineField({ name: "listingExcerpt", title: "Insights-listing summary override", type: "text", rows: 3, description: "Only listing cards; defaults to Article summary. Do not duplicate or silently unify existing contextual wording.", validation: r => r.max(600) }),
    defineField({ name: "category", type: "string", options: { list: [...new Set(insights.map((item) => item.category))] }, validation: (r) => r.required() }),
    defineField({ name: "date", title: "Publication date", type: "date", validation: (r) => r.required() }),
    defineField({ name: "modifiedAt", title: "Actual substantive update time", type: "datetime", description: "Optional real update time, with timezone. Do not use import time or routine Studio save time. Shown as Updated and used in metadata/sitemap when provided." }),
    defineField({ name: "authorKey", title: "Verified article author (optional)", type: "string", description: "Select only the person who actually wrote this article, with verified attribution permission. A doctor profile is not proof of authorship. Leave unset when unknown.", options: { list: reviewerKeys.map(value => ({ value, title: DOCTORS[value].name })) } }),
    defineField({ name: "sources", title: "Clinical sources", type: "array", description: "Sources supporting this article's claims, checked by the clinician. Displayed below the body. Do not invent citations, or infer approval from a reputable domain alone.", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", title: "Source title", type: "string", validation: r => r.required().max(200) }), defineField({ name: "url", title: "Source HTTPS URL", type: "url", validation: r => r.required().uri({ scheme: ["https"] }) })] })], validation: r => r.custom(value => value == null || articleSources.safeParse(value).success || "Use 1–20 distinct, labeled HTTPS sources; drafts may leave this unset until review.") }),
    defineField({ name: "editorialStatus", title: "Editorial status and readiness", type: "string", initialValue: "draft", options: { list: [{ value: "draft", title: "Draft — not approved" }, { value: "inReview", title: "In review" }, { value: "ready", title: "Ready — recorded sign-off required" }] }, components: { input: InsightReadinessInput }, description: "Selecting Ready alone does not approve an article. The recorded review must match its publication-relevant content." }),
    defineField({ name: "review", title: "Actual clinician review evidence", type: "object", description: "A clinic editor records a real clinician's sign-off. These attestations are human evidence, not automatic clinical verification. Re-review after content, SEO, links, imagery, attribution or date changes.", fields: [
      defineField({ name: "clinicianKey", title: "Clinician who actually reviewed this topic", type: "string", options: { list: reviewerKeys.map(value => ({ value, title: DOCTORS[value].name })) } }),
      defineField({ name: "approvalReference", title: "Sign-off evidence/reference (internal)", type: "text", rows: 3, description: "Record the real approval record or traceable evidence, including the clinician's suitability for this topic. Never invent a sign-off.", validation: r => r.max(2000) }),
      defineField({ name: "reviewedAt", title: "When the clinician actually reviewed it", type: "datetime" }),
      ...Object.entries(reviewChecks).map(([name, title]) => defineField({ name, title, type: "boolean", initialValue: false })),
      defineField({ name: "authorshipConfirmed", title: "If an author is selected, actual authorship and attribution permission verified", type: "boolean", initialValue: false }),
      ...["digest", "recordedBy", "recordedAt"].map(name => defineField({ name, title: name === "digest" ? "Recorded content version" : name === "recordedBy" ? "Recorded by editor ID" : "Recorded at", type: "string", readOnly: true })),
    ] }),
    defineField({ name: "readTimeMinutes", title: "Reading time (minutes)", type: "number", validation: (r) => r.required().integer().min(1).max(60) }),
    defineField({ name: "featured", title: "Featured on the Insights listing", type: "boolean", initialValue: false,
      description: "The listing considers all six articles. Home keeps its first four; related cards keep their first three, so Featured does not promote an article into those selections. Only one article can be featured. First publish the current choice with Featured off, then publish the new choice. Unpublished articles retain their existing website setting.",
      validation: (r) => r.required().custom(async (value, context) => {
        // Allow editors to turn this off even when another record needs repair.
        if (value !== true) return true;
        const slug = z.object({ current: z.string() }).safeParse(context.document?.slug);
        if (!slug.success || !insights.some((item) => item.slug === slug.data.current) || !context.document?._id) return true;
        try {
          const { apiVersion } = requireSanityEnvironment();
          const input = await context.getClient({ apiVersion }).withConfig({ perspective: "published", useCdn: false }).fetch<unknown>(
            insightFeaturedQuery, { id: getPublishedId(context.document._id), slugs: insights.map((item) => item.slug) },
          );
          const published = z.array(z.object({ slug: z.string().refine((candidate) => insights.some((item) => item.slug === candidate)), featured: z.boolean() })).max(insights.length).safeParse(input);
          if (!published.success) return "Could not verify Featured selection. Check published articles and retry.";
          if (new Set(published.data.map((item) => item.slug)).size !== published.data.length) return "Resolve duplicate Insight URLs before choosing a featured article.";
          const peers = published.data.map((item) => ({ slug: item.slug, featured: item.featured }));
          const featured = getFeaturedInsightSlugs([...peers, { slug: slug.data.current, featured: true }], insights);
          const conflicts = featured.filter((item) => item !== slug.data.current);
          return !conflicts.length || `First publish ${conflicts.join(", ")} with Featured off. Its existing website setting applies even when no CMS document is published.`;
        } catch { return "Could not verify Featured selection. Check access and retry."; }
      }),
    }),
    defineField({ name: "body", type: "array", description: "Complete, useful article content. The page supplies H1; use H2 sections before H3 subsections. Paragraphs, lead, lists, emphasis and safe links retain existing styling. No arbitrary minimum word count; clinical quality requires human review.",
      of: [defineArrayMember({ type: "block",
        styles: [{ title: "Paragraph", value: "normal" }, { title: "Lead paragraph", value: "lead" }, { title: "Section heading", value: "h2" }, { title: "Subsection heading", value: "h3" }],
        lists: [{ title: "Bullets", value: "bullet" }, { title: "Numbered list", value: "number" }],
        marks: { decorators: [{ title: "Strong", value: "strong" }, { title: "Emphasis", value: "em" }], annotations: [
          defineArrayMember({ name: "link", type: "object", fields: [defineField({ name: "href", title: "Destination", type: "string", validation: (r) => r.required().custom((value) => safeInsightLink.safeParse(value).success || "Use a root-relative path, fragment or HTTPS URL.") })] }),
        ] },
      })], validation: (r) => r.required().min(1).max(200),
    }),
  ].map(field => ({ ...field, group: ["metaTitle", "metaDescription"].includes(field.name) ? "seo" : ["sources", "editorialStatus", "review", "authorKey"].includes(field.name) ? "review" : field.name === "body" ? "body" : "article" })),
  validation: (r) => [r.custom((value) => contentErrors(insightContent, value)), r.custom(async value => {
    const issues = await checkInsightReadiness(value);
    return issues.length ? issues : true;
  })],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
