import { z } from "zod";
import { presentationDefinitions, presentationPageNames, presentationSpecs, type PresentationPageName } from "./presentation-definitions";
import { resolveSections } from "./editorial-sections";

export function resolvePresentationPage(input: unknown, name: PresentationPageName) {
  const parsed = z.array(z.object({ _id: z.literal(name), _type: z.literal(name) }).passthrough()).max(1).safeParse(input);
  if (!parsed.success) return { value: {}, status: "invalid" };
  if (!parsed.data.length) return { value: {}, status: "missing" };
  return { value: resolveSections(parsed.data[0], {}, presentationSpecs(name)), status: "sanity" };
}
export { presentationDefinitions, presentationPageNames };
