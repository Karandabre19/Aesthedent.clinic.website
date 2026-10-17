import { z } from "zod";

export const sanityEnvironment = z.object({
  projectId: z.string().regex(/^[a-z0-9]{8}$/),
  dataset: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/),
  apiVersion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }).default("2026-10-16"),
});

export function getSanityEnvironment() {
  const result = sanityEnvironment.safeParse({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || undefined,
  });
  return result.success ? result.data : null;
}

export function requireSanityEnvironment() {
  const environment = getSanityEnvironment();
  if (!environment) throw new Error("Check NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and NEXT_PUBLIC_SANITY_API_VERSION. No configuration values are logged.");
  return environment;
}
