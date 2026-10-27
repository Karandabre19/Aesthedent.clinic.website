"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { imageUrl } from "../../sanity/lib/image-url";
import type { CmsImage } from "../../sanity/lib/image";

type Props = ImageProps & { imageOverride?: CmsImage; cropWidth: number; cropHeight: number; cmsOnly?: boolean };
export default function EditorialImage({ imageOverride, cropWidth, cropHeight, src, alt, onError, cmsOnly = false, ...props }: Props) {
  const candidate = imageOverride ? imageUrl(imageOverride, cropWidth, cropHeight) : undefined;
  const [failedSource, setFailedSource] = useState<string>();
  const useOverride = Boolean(candidate && failedSource !== candidate);
  if (cmsOnly && !useOverride) return <div aria-hidden="true" className={props.className} style={{ ...props.style, backgroundColor: 'hsl(var(--color-primary-light))', ...(props.fill ? { position: 'absolute', inset: 0 } : {}) }} />;
  // Static imports infer dimensions; their remote replacements must supply them.
  const dimensions = useOverride && !props.fill ? { width: props.width ?? cropWidth, height: props.height ?? cropHeight } : {};
  return <Image {...props} {...dimensions} src={useOverride ? candidate! : src} alt={useOverride ? imageOverride?.alt ?? alt : alt} onError={(event) => {
    if (useOverride) setFailedSource(candidate);
    else onError?.(event);
  }} />;
}
