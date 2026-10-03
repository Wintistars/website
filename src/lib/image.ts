// Bildoptimierung über das Storyblok-Bild-CDN (https://www.storyblok.com/docs/api/image-service).
import type { SbAsset } from './types';

export interface SbImageOptions {
  width?: number;
  height?: number;
  quality?: number;
}

/** URL eines Storyblok-Assets in gewünschter Grösse, als WebP und mit Fokuspunkt. */
export function sbImage(asset: SbAsset | undefined | null, opts: SbImageOptions = {}): string | null {
  if (!asset?.filename) return null;
  const { width = 0, height = 0, quality = 80 } = opts;
  const filters = [`format(webp)`, `quality(${quality})`];
  if (asset.focus) filters.push(`focal(${asset.focus})`);
  return `${asset.filename}/m/${width}x${height}/filters:${filters.join(':')}`;
}

/** srcset für responsive Bilder; Höhe wird über das Seitenverhältnis mitskaliert. */
export function sbSrcset(asset: SbAsset | undefined | null, widths: number[], ratio?: number): string | undefined {
  if (!asset?.filename) return undefined;
  return widths
    .map((w) => `${sbImage(asset, { width: w, height: ratio ? Math.round(w / ratio) : 0 })} ${w}w`)
    .join(', ');
}
