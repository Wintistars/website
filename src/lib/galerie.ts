// Fotos aus den Galerie-Alben (Sanity) für die Galerie-Komponente aufbereiten.
import type { Foto } from '../components/Galerie.astro';
import { imageSrcset, imageUrl } from './image';
import type { Album } from './types';

type AlbumBild = Album['bilder'][number];

export function zuFoto(b: AlbumBild): Foto {
  const breite = b.dimensions?.width ?? 1600;
  const hoehe = b.dimensions?.height ?? 1067;
  return {
    titel: b.legende || b.alt || '',
    url: imageUrl(b, Math.min(2000, breite)),
    klein: imageUrl(b, 800),
    srcset: imageSrcset(b, [480, 800, 1200].filter((w) => w <= breite)),
    breite,
    hoehe,
  };
}

/** Die ersten Fotos der neusten Alben (für die Startseite) */
export function ausgewaehlteFotos(alben: Album[], anzahl: number): Foto[] {
  return alben.flatMap((a) => a.bilder).slice(0, anzahl).map(zuFoto);
}
