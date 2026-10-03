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

export type SpielArt = 'plausch' | 'turnier' | 'cup' | 'anderes';

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

/** Singleton `team` (Teaminfos & Kader). Der Teamname ist fest: VEREIN in src/lib/verein.ts. */
export interface Team {
  _id: string;
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

/** Manuell erfasstes Spiel (Plausch/Turnier), Typ `spiel`. */
export interface SanitySpiel {
  _id: string;
  beginn: string; // ISO-Datetime (UTC)
  ende?: string;
  gegner: string;
  heimspiel: boolean;
  ort?: string;
  art: SpielArt;
  toreTeam?: number;
  toreGegner?: number;
  abgesagt: boolean;
  bemerkung?: string;
}

/** Singleton `spielplan` (Spielplan – Einstellungen). */
export interface SpielplanEinstellungen {
  /** Link zur Teamseite im SIHF Game Center (Quelle für Meisterschaftsspiele). */
  sihfUrl?: string;
}
