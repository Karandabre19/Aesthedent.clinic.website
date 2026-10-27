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
  let stage = "request";
  try {
    const input = await client.fetch<unknown>(insightsQuery, { slugs: insights.map((item) => item.slug) }, preview ? { cache: "no-store" } : { cache: "force-cache", next: { revalidate: 60, tags: ["insights"] } });
    stage = "review validation";
    const result = preview ? resolveInsightOverrides(input, insights) : await resolvePublishedInsights(input, insights);
    if (result.status === "invalid" || result.status === "ambiguous") console.error("[insights] Invalid or ambiguous published content; retaining existing content.");
    return result.overrides;
  } catch (error) {
    // Never log raw SDK errors: messages and responses may contain request data.
    const details: string[] = [stage];
    for (const failure of [error, error instanceof Error ? error.cause : undefined]) {
      if (!failure || typeof failure !== "object") continue;
      if ("name" in failure && typeof failure.name === "string" && /^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(failure.name)) details.push(failure.name);
      if ("statusCode" in failure && typeof failure.statusCode === "number" && Number.isInteger(failure.statusCode) && failure.statusCode >= 100 && failure.statusCode <= 599) details.push(`HTTP ${failure.statusCode}`);
      if ("code" in failure && typeof failure.code === "string" && /^[A-Z][A-Z0-9_]{0,63}$/.test(failure.code)) details.push(failure.code);
    }
    console.error(`[insights] CMS read failed (${[...new Set(details)].join(", ")}); retaining existing content.`);
    return [];
  }
});
