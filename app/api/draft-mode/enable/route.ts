import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { getSanityClient } from "../../../../sanity/lib/client";

export async function GET(request: Request) {
  const client = getSanityClient(), token = process.env.SANITY_API_READ_TOKEN;
  if (process.env.NEXT_PUBLIC_SANITY_PREVIEW_ENABLED !== "true" || !client || !token) return new Response("Authenticated preview is not configured.", { status: 503, headers: { "Cache-Control": "no-store" } });
  // The official handler verifies the Sanity preview secret before issuing a
  // signed Next draft cookie. Never enable draft mode from a plain query flag.
  const handler = defineEnableDraftMode({ client: client.withConfig({ token, useCdn: false }) });
  return handler.GET(request);
}
