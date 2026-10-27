import type { InsightOverride } from "./insight-mapping";

// Pure client-safe merge: existing context copy/IDs/covers/order survive absent CMS data.
export function applyInsightOverrides<T extends { slug: string; featured?: boolean }>(existing: readonly T[], overrides: readonly InsightOverride[], context: "article" | "listing" = "article") {
  const mapped = existing.map((item) => {
    const override = overrides.find((doc) => doc.slug === item.slug);
    return override ? { ...item, ...override, ...(context === "listing" ? { title: override.listingTitle ?? override.title, excerpt: override.listingExcerpt ?? override.excerpt } : {}) } : overrides.length && item.featured ? { ...item, featured: false } : item;
  });
  const added = overrides.filter(override => !existing.some(item => item.slug === override.slug)).map(override => ({
    ...override, id: `cms-${override.slug}`, image: '',
    ...(context === 'listing' ? { title: override.listingTitle ?? override.title, excerpt: override.listingExcerpt ?? override.excerpt } : {}),
  }));
  return [...mapped, ...added];
}
