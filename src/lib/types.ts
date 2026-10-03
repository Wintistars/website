// Typen der Inhalte, wie sie die GROQ-Abfragen in src/lib/sanity.ts liefern.
// Muss mit dem Schema in studio/schemaTypes/ übereinstimmen.
import type { PortableTextBlock } from '@portabletext/types';
import type { SanityImageObject } from '@sanity/image-url';

export interface SanityImage extends SanityImageObject {
  alt?: string;
  /** Per GROQ aus asset->metadata.dimensions ergänzt. */
  dimensions?: { width: number; height: number; aspectRatio: number };
}

/** Rich Text (Portable Text) inkl. eingebetteter Bilder. */
export type RichText = (PortableTextBlock | (SanityImage & { _type: 'image'; _key: string }))[];

export type SpielerPosition = 'torhueter' | 'verteidiger' | 'sturm';

export interface News {
  _id: string;
  titel: string;
  slug: string;
  datum: string; // YYYY-MM-DD
  lead?: string;
  bild?: SanityImage;
  text?: RichText;
}

export interface Spieler {
  _id: string;
  name: string;
  slug: string;
  nummer?: number;
  position?: SpielerPosition;
  jahrgang?: number;
  portrait?: SanityImage;
  text?: RichText;
}

export interface TeamRef {
  name: string;
  slug: string;
}

export interface SpielerMitTeams extends Spieler {
  teams: TeamRef[];
}

export interface Team {
  _id: string;
  name: string;
  slug: string;
  kategorie?: string;
  teamfoto?: SanityImage;
  trainer?: string;
  beschreibung?: RichText;
  spieler: Spieler[];
}

export interface Seite {
  _id: string;
  titel: string;
  slug: string;
  body?: RichText;
}
