import { defineField, type FieldDefinition } from "sanity";
import { contentErrors } from "../lib/content-validation";
import { imageProfiles, transformableImageTypes, type ImageProfileKey } from "../lib/image";
import { headlineFields, optionalText, sectionCopySchema, type SectionSpec } from "../lib/editorial-sections";
import { requireSanityEnvironment } from "../env";

export function editorialImage(name: string, profileKey: ImageProfileKey) {
  const guide = imageProfiles[profileKey];
  return defineField({ name, title: guide.title, type: "image", options: { hotspot: true },
    description: `${guide.composition} Recommended ${guide.width} × ${guide.height}px or higher resolution. Original uploads are preserved; the website serves responsive optimized crops. Set the hotspot on the subject and check narrow/wide previews. Dimensions are guidance, not upload limits. Select an existing approved asset or upload a permitted image. ${guide.portrait ? "Alternative text uses the existing named-clinician description." : "Add alternative text describing the selected image."} Leave unset to retain the original website image.`,
    fields: guide.portrait ? [] : [defineField({ name: "alt", title: "Alternative text", type: "string", description: "Describe this particular image without unverified patient identities or clinical promises. Required when an image is selected; up to 200 characters.", validation: r => r.max(200).custom((value, context) => {
      const selected = context.parent && typeof context.parent === "object" && Reflect.get(context.parent, "asset");
      return !selected || typeof value === "string" && /\S/.test(value) && !/<\/?[A-Za-z][^>]*>/.test(value) || "Add a meaningful plain-text description for the selected image.";
    }) })],
    validation: r => [r.assetRequired(), r.custom(async (value, context) => {
      if (!value?.asset?._ref) return true;
      try {
        const { apiVersion } = requireSanityEnvironment();
        const metadata = await context.getClient({ apiVersion }).fetch<{ mimeType?: string; metadata?: { dimensions?: { width?: number; height?: number } } } | null>('*[_id == $id][0]{mimeType,metadata{dimensions{width,height}}}', { id: value.asset._ref });
        if (!metadata || !metadata.mimeType) return "Asset information is unavailable. Check the selected image before publication.";
        if (!transformableImageTypes.includes(metadata.mimeType)) return "Sanity can store this original, but its image pipeline cannot transform this format for these website slots. Select an approved JPEG, PNG, WebP, TIFF, AVIF or GIF delivery copy; retain the original asset.";
        const d = metadata.metadata?.dimensions;
        if (d?.width && d.height && (d.width < guide.width || d.height < guide.height)) return `Below the recommended ${guide.width} × ${guide.height}px. Check sharpness and cropping at the displayed size; this is not an upload restriction.`;
        return true;
      } catch { return "Could not check image guidance. Verify sharpness, crop and permission before publishing."; }
    }).warning()],
  });
}
export function sectionFields(specs: SectionSpec[]): FieldDefinition[] {
  return specs.map(spec => defineField({ name: spec.name, title: spec.title, group: spec.name, type: "object", options: { collapsible: true, collapsed: false },
    description: "Optional presentation overrides. Leave text empty to retain its existing wording. Invalid supplied copy makes this section use its original copy; images fall back independently. Clinic facts and destinations remain code-controlled.",
    fields: Object.entries(spec.fields).map(([name, field]) => {
      if (field.kind === "image") return editorialImage(name, field.profile);
      if (field.kind === "headline") return defineField({ name, title: "Animated homepage headline", type: "object", description: "Supply all three phrases together or leave the group empty. The accessible heading is derived from these same phrases. Keep each phrase short to preserve the two-line composition.", fields: Object.entries(headlineFields).map(([key, f]) => defineField({ name: key, title: f.title, description: `${f.description} Up to ${f.max} characters.`, type: "string", validation: r => r.max(f.max) })) });
      return defineField({ name, title: field.title, description: `${field.description} ${field.multiline ? "Plain text, displayed in the existing paragraph; line breaks do not create rich content." : "Single-line text."} Up to ${field.max} characters. Leave empty for existing wording.`, type: field.multiline ? "text" : "string", ...(field.multiline ? { rows: 3 } : {}), validation: r => r.custom(value => optionalText(field).safeParse(value).success || `Use plain ${field.multiline ? "text" : "single-line text"} up to ${field.max} characters, or leave empty.`) });
    }),
    validation: r => r.custom(value => value == null || contentErrors(sectionCopySchema(spec), value)),
  }));
}
