import "server-only";
import { draftMode } from "next/headers";
import { createClient } from "next-sanity";
import { getSanityEnvironment } from "../env";

export function getSanityClient() {
  const environment = getSanityEnvironment();
  if (!environment) return null;
  return createClient({
    ...environment,
    perspective: "published",
    useCdn: false,
    stega: false,
    timeout: 5000,
    // Cold-start network blips otherwise drop straight to static fallback.
    maxRetries: 2,
  });
}

// The preview cookie is signed by Next and can only be enabled by the validated
// Sanity preview-secret route. Tokens never cross the server boundary.
export async function getContentClient(publishedOnly = false) {
  const client = getSanityClient();
  const preview = !publishedOnly && (await draftMode()).isEnabled;
  if (!preview) return { client, preview: false };
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) return { client: null, preview: true };
  return { client: client?.withConfig({ token, perspective: "drafts", useCdn: false }) ?? null, preview: true };
}
