import { z } from "zod";
import { getSanityEnvironment } from "../env";

const profile = (title: string, width: number, height: number, composition: string, portrait = false) => ({ title, width, height, composition, portrait });
export const imageProfiles = {
  social: profile("Social sharing image", 1200, 630, "Wide landscape, about 1.91:1. Show an approved editorial image with a clear central subject and space at the edges for sharing previews. Avoid embedded small text; check the actual sharing crop."),
  heroDesktop: profile("Desktop hero artwork", 1672, 941, "Landscape, about 16:9. Keep the subject clear of the left headline and allow edge cropping."),
  heroMobile: profile("Mobile hero artwork", 941, 1672, "Portrait, about 9:16. Keep the subject visible behind the mobile text; desktop and mobile artwork are independent."),
  visitTreatment: profile("Visit treatment photo", 900, 1200, "Portrait, about 3:4. Show a permitted treatment/clinic scene; leave room around the subject for the existing crop."),
  visitEquipment: profile("Visit equipment photo", 900, 1200, "Portrait, about 3:4. Show relevant clinic equipment, with its important details inside the crop."),
  contact: profile("Contact-section photo", 800, 600, "Landscape, about 4:3. Use a permitted clinic image without embedded contact text."),
  aboutHero: profile("About opening image", 800, 500, "Landscape, about 8:5. Use an approved clinic/editorial photo. The current fallback is stock imagery, not verified clinic provenance."),
  aboutClinic: profile("About clinic-experience photo", 1600, 900, "Wide landscape, about 16:9. Keep important details outside the left text overlay and allow responsive cropping."),
  experienceBanner: profile("Experience banner photo", 1600, 900, "Wide landscape, about 16:9. The central headline overlays this image; avoid embedded text and keep the composition calm."),
  experienceVisit: profile("Experience visit-process photo", 800, 1000, "Portrait, about 4:5. Show the clinic chair/equipment; this slot remains hidden below its existing large-screen breakpoint."),
  service: profile("Treatment image", 1200, 900, "Landscape, about 4:3. Shared across cards and the detail page, which also crops to 16:10. Keep the subject central; use no unapproved patient identity/outcome claims."),
  portrait: profile("Clinician portrait", 600, 750, "Portrait, about 4:5. Confirm this is the named clinician and permission covers both Home and the doctor page. Keep the face within the hotspot.", true),
  insight: profile("Article cover", 1600, 900, "Wide landscape, about 16:9. Cards crop near 16:10, detail to 21:9 and social previews to 1200:630. Keep the subject central and check every crop; use approved editorial imagery."),
};
export type ImageProfileKey = keyof typeof imageProfiles;
const fraction = z.number().finite().min(0).max(1);
const crop = z.object({ top: fraction, bottom: fraction, left: fraction, right: fraction }).refine(v => v.top + v.bottom < 1 && v.left + v.right < 1);
const hotspot = z.object({ x: fraction, y: fraction, width: fraction.positive(), height: fraction.positive() }).refine(v => v.x - v.width / 2 >= -0.000001 && v.x + v.width / 2 <= 1.000001 && v.y - v.height / 2 >= -0.000001 && v.y + v.height / 2 <= 1.000001);
const inputImage = z.object({
  asset: z.object({ _id: z.string().regex(/^image-[A-Za-z0-9]+-\d+x\d+-[a-z0-9]+$/), url: z.string().url(), mimeType: z.string(), metadata: z.object({ dimensions: z.object({ width: z.number().int().positive(), height: z.number().int().positive() }) }) }),
  alt: z.string().max(200).nullish(), crop: crop.nullish(), hotspot: hotspot.nullish(),
});
export type CmsImage = { projectId: string; dataset: string; assetId: string; alt?: string; crop?: z.infer<typeof crop>; hotspot?: z.infer<typeof hotspot> };
// Uploads retain their originals. These are the actual transformable formats,
// not file-size/resolution caps; other source formats need a delivery copy.
export const transformableImageTypes = ["image/jpeg", "image/pjpeg", "image/png", "image/webp", "image/tiff", "image/avif", "image/gif"];
export function imageFromRecord(value: unknown, portrait = false): CmsImage | undefined {
  const parsed = inputImage.safeParse(value), env = getSanityEnvironment();
  if (!parsed.success || !env) return undefined;
  const { asset, alt, crop: c, hotspot: h } = parsed.data;
  const url = new URL(asset.url), dimensions = asset.metadata.dimensions;
  const match = asset._id.match(/-(\d+)x(\d+)-([a-z0-9]+)$/);
  if (!match || Number(match[1]) !== dimensions.width || Number(match[2]) !== dimensions.height || !transformableImageTypes.includes(asset.mimeType)) return undefined;
  const expected = `/images/${env.projectId}/${env.dataset}/${asset._id.slice(6).replace(/-([a-z0-9]+)$/, ".$1")}`;
  if (url.protocol !== "https:" || url.hostname !== "cdn.sanity.io" || url.port || url.username || url.password || url.pathname !== expected || url.search || url.hash) return undefined;
  if (!portrait && (!alt?.trim() || /<\/?[A-Za-z][^>]*>/.test(alt))) return undefined;
  return { projectId: env.projectId, dataset: env.dataset, assetId: asset._id, ...(!portrait ? { alt: alt!.trim() } : {}), ...(c ? { crop: c } : {}), ...(h ? { hotspot: h } : {}) };
}
export function imageForDocument(input: unknown, id: string, key: string, portrait = false) {
  if (!Array.isArray(input)) return undefined;
  const doc = input.find((value: unknown) => value && typeof value === "object" && Reflect.get(value, "_id") === id);
  return imageFromRecord(doc && typeof doc === "object" ? Reflect.get(doc, key) : undefined, portrait);
}
// Studio holds references; the server query dereferences them. Both forms must
// validate the same crop/alt contract without turning a local path into an asset.
export function imageFromStudioReference(value: unknown) {
  if (!value || typeof value !== "object") return undefined;
  const selected = Reflect.get(value, "asset"), env = getSanityEnvironment();
  const id = selected && typeof selected === "object" ? Reflect.get(selected, "_ref") : undefined;
  if (!env || typeof id !== "string") return undefined;
  const match = id.match(/^image-[A-Za-z0-9]+-(\d+)x(\d+)-(jpg|jpeg|pjpeg|png|webp|tif|tiff|avif|gif)$/);
  if (!match) return undefined;
  const format = match[3] === "jpg" ? "jpeg" : match[3] === "tif" ? "tiff" : match[3];
  return imageFromRecord({ ...value, asset: { _id: id, url: `https://cdn.sanity.io/images/${env.projectId}/${env.dataset}/${id.slice(6).replace(/-([a-z0-9]+)$/, ".$1")}`, mimeType: `image/${format}`, metadata: { dimensions: { width: Number(match[1]), height: Number(match[2]) } } } });
}
