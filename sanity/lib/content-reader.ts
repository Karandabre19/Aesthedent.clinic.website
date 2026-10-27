import "server-only";
import { getContentClient } from "./client";

export async function readPublishedContent<T>(query: string, params: Record<string, unknown>, tag: string, resolve: (input: unknown) => { value: T; status: string }, publishedOnly = false): Promise<T> {
  const { client, preview } = await getContentClient(publishedOnly);
  if (!client) {
    console.error(`[${tag}] CMS configuration unavailable; retaining static content.`);
    return resolve([]).value;
  }
  try {
    const input = await client.fetch<unknown>(query, params, preview ? { cache: "no-store" } : { cache: "force-cache", next: { revalidate: 60, tags: [tag] } });
    const result = resolve(input);
    if (result.status === "invalid" || result.status === "ambiguous") console.error(`[${tag}] Invalid or ambiguous published content; retaining static content.`);
    return result.value;
  } catch (error) {
    // Name/status only: Sanity error messages can echo query text, never config values.
    const reason = error instanceof Error ? `${error.name}${"statusCode" in error ? ` ${String(error.statusCode)}` : ""}` : "unknown error";
    console.error(`[${tag}] CMS read failed (${reason}); retaining static content.`);
    return resolve([]).value;
  }
}
