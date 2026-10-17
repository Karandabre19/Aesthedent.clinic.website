import { createImageUrlBuilder } from "@sanity/image-url";
import type { CmsImage } from "./image";

// Only validated, serializable asset references cross into client components.
export function imageUrl(image: CmsImage, width: number, height: number) {
  return createImageUrlBuilder({ projectId: image.projectId, dataset: image.dataset })
    .image({ asset: { _ref: image.assetId }, ...(image.crop ? { crop: image.crop } : {}), ...(image.hotspot ? { hotspot: image.hotspot } : {}) })
    .width(width).height(height).fit("crop").auto("format").url();
}
