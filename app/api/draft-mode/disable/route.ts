import { draftMode } from "next/headers";

export async function POST(request: Request) {
  const url = new URL(request.url);
  if (request.headers.get("origin") !== url.origin) return new Response("Same-origin preview exit required.", { status: 403 });
  (await draftMode()).disable();
  return new Response(null, { status: 303, headers: { Location: "/", "Cache-Control": "no-store" } });
}
