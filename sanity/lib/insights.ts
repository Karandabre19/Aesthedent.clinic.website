import "server-only";
import { cache } from "react";
import { insights } from "../../lib/insights.js";
import { getContentClient } from "./client";
import { insightsQuery } from "./insight-query";
import { resolveInsightOverrides } from "./insight-mapping";
import type { InsightOverride } from "./insight-mapping";
import { resolvePublishedInsights } from "./insight-review";

export const getInsightOverrides = cache(async (publishedOnly = false): Promise<InsightOverride[]> => {
  const { client, preview } = await getContentClient(publishedOnly);
  if (!client) {
    console.error("[insights] CMS configuration unavailable; retaining existing content.");
    return [];
  }
  try {
    const input = await client.fetch<unknown>(insightsQuery, { slugs: insights.map((item) => item.slug) }, preview ? { cache: "no-store" } : { cache: "force-cache", next: { revalidate: 60, tags: ["insights"] } });
    const result = preview ? resolveInsightOverrides(input, insights) : await resolvePublishedInsights(input, insights);
    if (result.status === "invalid" || result.status === "ambiguous") console.error("[insights] Invalid or ambiguous published content; retaining existing content.");
    return result.overrides;
  } catch {
    console.error("[insights] CMS read failed; retaining existing content.");
    return [];
  }
});
