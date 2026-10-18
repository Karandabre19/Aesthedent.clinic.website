import { defineArrayMember, defineField, getPublishedId } from "sanity";
import { requireSanityEnvironment } from "../env";
import { editorialText } from "../lib/content-validation";

export function textField(name: string, title: string, required = true, multiline = false, options: { maxLength?: number; description?: string; rows?: number } = {}) {
  const maximum = options.maxLength ?? 16000;
  return defineField({ name, title, type: multiline ? "text" : "string",
    ...(multiline ? { rows: options.rows ?? 5 } : {}),
    description: options.description ?? `Plain text, up to ${maximum.toLocaleString("en")} characters. Keep clinic-reviewed wording.`,
    validation: (r) => (required ? r.required() : r).max(maximum).custom((value) => value == null || editorialText.safeParse(value).success || "Use nonblank plain text without HTML."),
  });
}
export function textList(name: string, title: string, minimum = 1, maximum = 20) {
  return defineField({ name, title, type: "array", description: `${minimum}–${maximum} items, in website display order. Each item is plain text, up to 2,000 characters.`, of: [defineArrayMember({ type: "string", validation: (r) => r.required().max(2000).custom((value) => value == null || editorialText.safeParse(value).success || "Use nonblank plain text without HTML.") })], validation: (r) => r.required().min(minimum).max(maximum) });
}
export function descriptionList(name: string, title: string, steps = false, options: { maximum?: number; length?: number; description?: string } = {}) {
  const maximum = options.maximum ?? 20;
  return defineField({ name, title, type: "array",
    description: options.description ?? (options.length ? `Keep exactly ${options.length} items in their existing positions; each position keeps its website icon.` : steps ? "Number steps consecutively from 1 in display order. Renumber after moving a step." : `1–${maximum} items, in website display order.`),
    options: { sortable: !options.length },
    of: [defineArrayMember({ type: "object", fields: [
    ...(steps ? [defineField({ name: "step", title: "Step number", type: "number", validation: (r) => r.required().integer().min(1).max(20) })] : []),
    textField("title", "Title", true, false, { maxLength: 180 }), textField("desc", "Description", true, true, { maxLength: 4000 }),
  ], preview: { select: { title: "title", subtitle: "desc" } } })], validation: (r) => options.length ? r.required().length(options.length) : r.required().min(1).max(maximum) });
}
export function faqField(name = "faqs", question = "q", answer = "a") {
  return defineField({ name, title: "Frequently asked questions", type: "array", description: "1–30 questions in display order. Keep clinic-reviewed wording; where present, structured data uses these same answers.", of: [defineArrayMember({ type: "object", fields: [textField(question, "Question", true, false, { maxLength: 300 }), textField(answer, "Answer", true, true, { maxLength: 4000 })], preview: { select: { title: question, subtitle: answer } } })], validation: (r) => r.required().min(1).max(30) });
}
export function stableSlug(known: readonly string[], title = "Existing URL", allowNew = false) {
  return defineField({ name: "slug", title, type: "slug", description: allowNew ? `Lowercase words joined by hyphens, e.g. "teeth-cleaning". Existing pages: ${known.join(", ")}. Never rename a published URL.` : `Existing identifiers only: ${known.join(", ")}. Never rename a published identifier.`, validation: (r) => r.required().custom(async (value, context) => {
    if (!value?.current) return true;
    if (allowNew ? !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) : !known.includes(value.current)) return allowNew ? "Use lowercase letters, numbers and single hyphens." : "Choose an existing identifier.";
    if (!context.document?._id) return true;
    try {
      const { apiVersion } = requireSanityEnvironment();
      const previous = await context.getClient({ apiVersion }).withConfig({ perspective: "published", useCdn: false }).fetch<unknown>('*[_id == $id][0].slug.current', { id: getPublishedId(context.document._id) });
      return previous == null || previous === value.current || "Keep the published identifier.";
    } catch { return "Could not verify the published identifier. Check access and retry."; }
  }) });
}
