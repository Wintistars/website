// Typen der Storyblok-Komponenten. Muss mit storyblok/components.json übereinstimmen.
import type { ISbStoryData, StoryblokRichTextInput } from '@storyblok/astro';

export interface SbAsset {
  id: number | null;
  filename: string | null;
  alt: string | null;
  title?: string | null;
  focus?: string | null;
}

interface Blok<C extends string> {
  _uid: string;
  component: C;
  _editable?: string;
}

// --- Content-Typen (eigene Stories) ---

export interface NewsContent extends Blok<'news'> {
  titel: string;
  datum: string; // "YYYY-MM-DD HH:mm"
  lead?: string;
  bild?: SbAsset;
  text?: StoryblokRichTextInput;
}

export type SpielerPosition = 'torhueter' | 'verteidiger' | 'sturm';

export interface SpielerContent extends Blok<'spieler'> {
  name: string;
  nummer?: string;
  position?: SpielerPosition | '';
  jahrgang?: string;
  portrait?: SbAsset;
  text?: StoryblokRichTextInput;
}

export interface TeamContent extends Blok<'team'> {
  name: string;
  kategorie?: string;
  teamfoto?: SbAsset;
  trainer?: string;
  beschreibung?: StoryblokRichTextInput;
  // Mit resolve_relations "team.spieler" aufgelöst; sonst UUID-Strings.
  spieler?: (SpielerStory | string)[];
}

export interface SeiteContent extends Blok<'seite'> {
  titel: string;
  body?: (TextBlok | BildBlok)[];
}

// --- Verschachtelbare Blöcke (innerhalb von "seite") ---

export interface TextBlok extends Blok<'text'> {
  text?: StoryblokRichTextInput;
}

export interface BildBlok extends Blok<'bild'> {
  bild?: SbAsset;
  legende?: string;
}

export type NewsStory = ISbStoryData<NewsContent>;
export type SpielerStory = ISbStoryData<SpielerContent>;
export type TeamStory = ISbStoryData<TeamContent>;
export type SeiteStory = ISbStoryData<SeiteContent>;
