// Bildoptimierung über das Sanity-Bild-CDN (https://www.sanity.io/docs/image-urls).
import { createImageUrlBuilder } from '@sanity/image-url';
import { SANITY_DATASET, SANITY_PROJECT_ID } from './sanity';
import type { SanityImage } from './types';

const builder = createImageUrlBuilder({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET });

/** URL in gewünschter Breite; mit Höhe wird unter Beachtung des Hotspots zugeschnitten. */
export function imageUrl(img: SanityImage, width: number, height?: number): string {
  let b = builder.image(img).width(width).auto('format').quality(80);
  if (height) b = b.height(height).fit('crop');
  return b.url();
}

export function imageSrcset(img: SanityImage, widths: number[], ratio?: number): string {
  return widths.map((w) => `${imageUrl(img, w, ratio ? Math.round(w / ratio) : undefined)} ${w}w`).join(', ');
}
