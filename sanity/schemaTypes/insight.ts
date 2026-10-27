import { editorialImage } from "./editorial-fields";
import { BookOpen } from "lucide-react";
import { defineArrayMember, defineField, defineType, getPublishedId } from "sanity";
import { z } from "zod";
import { insights } from "../../lib/insights.js";
import { requireSanityEnvironment } from "../env";
import { getFeaturedInsightSlugs, insightContent, insightSlug, maxInsights } from "../lib/insight-mapping";
import { insightFeaturedQuery } from "../lib/insight-query";
import { insightFieldErrors, insightFieldLabel, insightStudioReadiness, reviewChecks, reviewerKeys } from "../lib/insight-review";
import { DOCTORS } from "../../lib/clinic";
import { InsightArticleInput, InsightBodyInput, InsightReadinessInput } from "../studio/InsightReadinessInput";
import { InsightReviewInput } from "../studio/RecordInsightReviewAction";

export const insight = defineType({
  name: "insight", title: "Insight", type: "document", icon: BookOpen,
  description: "Choose an article, write your changes, then ask a doctor to check them. Saving a draft does not put it on the website. Publish only after the doctor’s approval has been saved for these changes.",
  groups: [{ name: "article", title: "Article details", default: true }, { name: "body", title: "Article text" }, { name: "review", title: "Doctor’s approval" }, { name: "seo", title: "Google and sharing" }],
  fields: [editorialImage("coverImage", "insight"),
    defineField({ name: "slug", title: "Article web address", type: "slug", options: { source: 'title', maxLength: 96 }, components: { input: InsightArticleInput },
      description: "For a new article, enter its title and click Generate. Or choose an existing article below. Keep a published article’s address unchanged.",
      validation: (rule) => rule.custom(async (value, context) => {
        if (!value?.current) return "Enter the article title, then click Generate in Article web address.";
        if (!insightSlug.safeParse(value.current).success) return "Use lowercase words joined by hyphens, up to 96 characters, such as preparing-for-your-dental-visit.";
        if (!context.document?._id) return true;
        try {
          const { apiVersion } = requireSanityEnvironment();
          const previous = await context.getClient({ apiVersion }).withConfig({ perspective: "published" }).fetch<string | null>(
            '*[_id == $id][0].slug.current', { id: getPublishedId(context.document._id) },
          );
          return !previous || previous === value.current || `This article is published at /insights/${previous}. Keep that address. Create a separate article for a new page.`;
        } catch { return "We couldn’t check which website article this document belongs to. Check your internet connection and try again; if this continues, contact the website administrator."; }
      }),
    }),
    defineField({ name: "title", title: "Article title", description: "The main heading readers see on this article and its preview cards. Write up to 180 characters.", type: "string" }),
    defineField({ name: "excerpt", title: "Short summary", description: "Write a short introduction that helps readers decide whether to read the article. Shown on article cards and used for search previews. Up to 600 characters.", type: "text", rows: 3 }),
    defineField({ name: "metaTitle", title: "Shorter title for Google (optional)", type: "string", description: "Leave empty to use Article title. If that title is too long for a search result, write a shorter version here. Up to 100 characters." }),
    defineField({ name: "metaDescription", title: "Description for Google and sharing (optional)", type: "text", rows: 3, description: "Leave empty to use Short summary. Otherwise, write a short description for search results and shared links. Around 140–160 characters usually fits; the limit is 320." }),
    defineField({ name: "listingTitle", title: "Different title on the Insights page (optional)", type: "string", description: "Leave empty to use Article title. Fill this only if the article’s card on the Insights page needs a different title. Up to 180 characters." }),
    defineField({ name: "listingExcerpt", title: "Different summary on the Insights page (optional)", type: "text", rows: 3, description: "Leave empty to use Short summary. Fill this only if the article’s card on the Insights page needs a different summary. Up to 600 characters." }),
    defineField({ name: "category", type: "string", options: { list: [...new Set(insights.map((item) => item.category))] } }),
    defineField({ name: "date", title: "Publication date", type: "date", description: "Use the actual first publication date; future scheduling is not supported." }),
    defineField({ name: "modifiedAt", title: "When the article was last updated (optional)", type: "datetime", description: "Fill this only when you made a meaningful change to the article, not every time you save. Choose when that change was made. The website will show it as Updated." }),
    defineField({ name: "authorKey", title: "Verified article author (optional)", type: "string", description: "Select only the person who actually wrote this article, with verified attribution permission. A doctor profile is not proof of authorship. Leave unset when unknown.", options: { list: reviewerKeys.map(value => ({ value, title: DOCTORS[value].name })) } }),
    defineField({ name: "sources", title: "References checked by the doctor", type: "array", description: "Add the studies, guidelines or articles the doctor used to check the medical information. Click Add item, enter the source’s title, then paste its website link starting with https://. At least one is needed to publish; you can save a draft without one. The limit is 20. Only add sources the doctor actually checked.", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", title: "Title of the study, guideline or article", type: "string" }), defineField({ name: "url", title: "Link to that source", type: "url" })] })], validation: r => r.custom(value => insightFieldErrors("sources", value)) }),
    defineField({ name: "editorialStatus", title: "Article progress", type: "string", initialValue: "draft", options: { list: [{ value: "draft", title: "Still writing" }, { value: "inReview", title: "Waiting for the doctor to check" }, { value: "ready", title: "Ready — save the doctor’s approval first" }] }, components: { input: InsightReadinessInput }, description: "Use this to track your work. After a doctor approves the article, fill in Doctor’s approval and choose Save doctor’s approval from the menu beside Publish." }),
    defineField({ name: "review", title: "Doctor’s approval", type: "object", components: { input: InsightReviewInput }, options: { collapsible: true, collapsed: false }, validation: r => r.custom(value => insightFieldErrors("review", value)), description: "Fill this in after a doctor has checked and approved the article. Name the doctor, explain where their approval is recorded, choose the date, and confirm the checks below. Then click Save doctor’s approval below these fields. If you change the article afterwards, ask the doctor to check those changes again.", fields: [
      defineField({ name: "clinicianKey", title: "Which doctor checked this article?", type: "string", options: { list: reviewerKeys.map(value => ({ value, title: DOCTORS[value].name })) } }),
      defineField({ name: "approvalReference", title: "Where is the doctor’s approval recorded?", type: "text", rows: 3, description: "Describe the actual email, signed note or other saved approval that a clinic colleague could find and check. Include how the doctor is qualified to review this topic. Up to 2,000 characters. Do not fill this in until approval exists." }),
      defineField({ name: "reviewedAt", title: "When did the doctor check it?", type: "datetime" }),
      ...Object.keys(reviewChecks).map(name => defineField({ name, title: insightFieldLabel([name]), type: "boolean", initialValue: false })),
      defineField({ name: "authorshipConfirmed", title: "The named author wrote this article and agreed to be named", type: "boolean", initialValue: false }),
      ...["digest", "recordedBy", "recordedAt"].map(name => defineField({ name, title: name === "digest" ? "Recorded content version" : name === "recordedBy" ? "Recorded by editor ID" : "Recorded at", type: "string", readOnly: true })),
    ] }),
    defineField({ name: "readTimeMinutes", title: "Reading time (minutes)", type: "number", description: "Estimate a whole number of minutes from 1 to 60." }),
    defineField({ name: "featured", title: "Featured on the Insights listing", type: "boolean", initialValue: false,
      description: "Turn this on to show this article in the large highlighted space at the top of the Insights page. Only one published article can use that space. This does not change which articles appear on Home or under Related articles.",
      validation: (r) => r.custom(async (value, context) => {
        const errors = insightFieldErrors("featured", value);
        if (errors !== true) return errors;
        // Allow editors to turn this off even when another record needs repair.
        if (value !== true) return true;
        const slug = z.object({ current: z.string() }).safeParse(context.document?.slug);
        if (!slug.success || !insightSlug.safeParse(slug.data.current).success || !context.document?._id) return true;
        try {
          const { apiVersion } = requireSanityEnvironment();
          const input = await context.getClient({ apiVersion }).withConfig({ perspective: "published", useCdn: false }).fetch<unknown>(
            insightFeaturedQuery, { id: getPublishedId(context.document._id), slugs: insights.map((item) => item.slug) },
          );
          const published = z.array(z.object({ slug: insightSlug, featured: z.boolean() })).max(maxInsights).safeParse(input);
          if (!published.success) return "We couldn’t verify which article is highlighted. Try again; if this continues, contact the website administrator.";
          if (new Set(published.data.map((item) => item.slug)).size !== published.data.length) return "Two saved documents are linked to the same article. Ask the website administrator to fix the duplicate before changing the highlighted article.";
          const peers = published.data.map((item) => ({ slug: item.slug, featured: item.featured }));
          const featured = getFeaturedInsightSlugs([...peers, { slug: slug.data.current, featured: true }], insights);
          const conflicts = featured.filter((item) => item !== slug.data.current);
          const titles = conflicts.map(slug => `“${insights.find(article => article.slug === slug)?.title ?? "the currently highlighted article"}”`);
          return !conflicts.length || `First open ${titles.join(", ")}, turn off Featured on the Insights listing, and publish that change. Then return here and turn Featured on for this article.`;
        } catch { return "We couldn’t verify which article is highlighted. Check your internet connection and try again; if this continues, contact the website administrator."; }
      }),
    }),
    defineField({ name: "body", title: "Article body", type: "array", components: { input: InsightBodyInput }, description: "Write the article here. Enter a section name in Section heading and click Add section heading. You can also select existing heading text and choose Section heading from the text-style menu. Use Subsection heading only inside a section. The article title is already shown above the text on the website. The limit is 200 paragraphs, headings and list items.",
      of: [defineArrayMember({ type: "block",
        styles: [{ title: "Paragraph", value: "normal" }, { title: "Lead paragraph", value: "lead" }, { title: "Section heading", value: "h2" }, { title: "Subsection heading", value: "h3" }],
        lists: [{ title: "Bullets", value: "bullet" }, { title: "Numbered list", value: "number" }],
        marks: { decorators: [{ title: "Strong", value: "strong" }, { title: "Emphasis", value: "em" }], annotations: [
          defineArrayMember({ name: "link", type: "object", fields: [defineField({ name: "href", title: "Destination", type: "string", description: "Use a page path starting with /, a #section, or a full HTTPS link." })] }),
        ] },
      })],
    }),
  ].map(field => ({ ...field,
    ...(Object.hasOwn(insightContent.shape, field.name) && field.name !== "featured" ? {
      validation: (rule: import("sanity").Rule) => field.name === "metaDescription"
        ? [rule.custom(value => insightFieldErrors(field.name, value)), rule.custom(value => typeof value !== "string" || value.length <= 160 || "Longer descriptions may be truncated; review the effective snippet.").warning()]
        : rule.custom(value => insightFieldErrors(field.name, value)),
    } : {}),
    description: ["title", "excerpt", "category", "date", "readTimeMinutes", "body"].includes(field.name) ? `Required before publishing. ${"description" in field ? field.description : "Complete this field; drafts save while it is incomplete."}` : "description" in field ? field.description : undefined,
    group: ["metaTitle", "metaDescription"].includes(field.name) ? "seo" : ["sources", "editorialStatus", "review", "authorKey"].includes(field.name) ? "review" : field.name === "body" ? "body" : "article" })),
  validation: (r) => r.custom(async value => {
    const issues = await insightStudioReadiness(value);
    return issues.length ? issues : true;
  }),
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
