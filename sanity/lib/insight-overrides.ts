import type { InsightOverride } from "./insight-mapping";

// Pure client-safe merge: existing context copy/IDs/covers/order survive absent CMS data.
export function applyInsightOverrides<T extends { slug: string }>(existing: readonly T[], overrides: readonly InsightOverride[], context: "article" | "listing" = "article") {
  return existing.map((item) => {
    const override = overrides.find((doc) => doc.slug === item.slug);
    return override ? { ...item, ...override, ...(context === "listing" ? { title: override.listingTitle ?? override.title, excerpt: override.listingExcerpt ?? override.excerpt } : {}) } : item;
  });
}
