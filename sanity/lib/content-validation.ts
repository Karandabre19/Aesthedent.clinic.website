import { z, type ZodType } from "zod";

export const editorialText = z.string().min(1).max(16000).regex(/\S/, "Use nonblank text.").regex(/^(?![\s\S]*<\/?[A-Za-z][^>]*>)[\s\S]*$/, "Use plain text, not HTML.");
export const publishedId = z.string().min(1).refine((id) => !id.startsWith("drafts.") && !id.startsWith("versions."), "Published documents only.");
export const questionAnswer = z.object({ q: editorialText.max(300), a: editorialText.max(4000) });
export const titleDescription = z.object({ title: editorialText.max(180), desc: editorialText.max(4000) });

export function studioPath(value: unknown, path: (string | number)[]) {
  let current = value;
  return path.map((segment) => {
    if (typeof segment === "number" && Array.isArray(current)) {
      current = current[segment];
      // Keyed paths keep the error attached to the right item after array edits.
      if (current && typeof current === "object" && "_key" in current && typeof current._key === "string") return { _key: current._key };
    } else {
      current = current && typeof current === "object" ? Reflect.get(current, segment) : undefined;
    }
    return segment;
  });
}

export function contentErrors(schema: ZodType<unknown>, value: unknown) {
  const result = schema.safeParse(value);
  return result.success ? true : result.error.issues.map((issue) => ({ message: issue.message, path: studioPath(value, issue.path) }));
}

export function publishedCollection<T>(input: unknown, schema: ZodType<T>, key: (item: T) => string, maximum: number) {
  const parsed = z.array(schema).max(maximum).safeParse(input);
  if (!parsed.success) return { records: [], status: "invalid" } as const;
  if (!parsed.data.length) return { records: [], status: "missing" } as const;
  if (new Set(parsed.data.map(key)).size !== parsed.data.length) return { records: [], status: "ambiguous" } as const;
  return { records: parsed.data, status: "sanity" } as const;
}
