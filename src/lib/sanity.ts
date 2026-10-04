// Zentraler Datenzugriff auf Sanity. Seiten holen Inhalte nur über diese Funktionen.
// Das Dataset ist öffentlich: Der Build liest veröffentlichte Inhalte ohne Token.
import { createClient } from '@sanity/client';
import type { News, SanitySpiel, Seite, Spieler, SpielplanEinstellungen, Team } from './types';

export const SANITY_PROJECT_ID = 'j2uq9efj';
export const SANITY_DATASET = 'production';

/** Slug der Seite, deren Inhalt auf der Startseite erscheint. */
export const HOME_SLUG = 'home';

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2026-10-01',
  // Kein CDN: Der Build läuft direkt nach dem Veröffentlichen und soll den neusten Stand sehen.
  useCdn: false,
  perspective: 'published',
});

// Bilder inkl. Alt-Text, Hotspot/Crop und Originalmassen.
const image = (field: string) => `${field}{..., "dimensions": asset->metadata.dimensions}`;
const richText = (field: string) => `${field}[]{..., _type == "image" => {..., "dimensions": asset->metadata.dimensions}}`;

const spielerFields = `_id, name, "slug": slug.current, nummer, position, jahrgang, ${image('portrait')}, ${richText('text')}`;

export function getNews(limit?: number): Promise<News[]> {
  const range = limit ? `[0...${limit}]` : '';
  return client.fetch(
    `*[_type == "news" && defined(slug.current)] | order(datum desc) ${range} {
      _id, titel, "slug": slug.current, datum, lead, ${image('bild')}, ${richText('text')}
    }`,
  );
}

/** Teaminfos & Kader (Singleton mit ID "team"); null, solange nichts veröffentlicht ist. */
export function getTeam(): Promise<Team | null> {
  return client.fetch(
    `*[_id == "team"][0] {
      _id, ${image('teamfoto')}, trainer, ${richText('beschreibung')},
      "erfolge": coalesce(erfolge[]{_key, saison, titel}, []),
      "spieler": coalesce(spieler[]->{${spielerFields}}, [])
    }`,
  );
}

export function getSpieler(): Promise<Spieler[]> {
  return client.fetch(`*[_type == "spieler" && defined(slug.current)] { ${spielerFields} }`);
}

/** Manuell erfasste Spiele (Plausch/Turnier), chronologisch. */
export function getSpiele(): Promise<SanitySpiel[]> {
  return client.fetch(
    `*[_type == "spiel" && defined(beginn)] | order(beginn asc) {
      _id, beginn, ende, gegner,
      "heimspiel": coalesce(heimspiel, true), ort, "art": coalesce(art, "plausch"),
      toreTeam, toreGegner, "abgesagt": coalesce(abgesagt, false), bemerkung
    }`,
  );
}

/** Spielplan-Einstellungen (Singleton mit ID "spielplan"): SIHF-Link für die Meisterschaftsspiele. */
export function getSpielplanEinstellungen(): Promise<SpielplanEinstellungen | null> {
  return client.fetch(`*[_id == "spielplan"][0] { sihfUrl }`);
}

/** Alle allgemeinen Seiten ausser der Startseite. */
export function getSeiten(): Promise<Seite[]> {
  return client.fetch(
    `*[_type == "seite" && defined(slug.current) && slug.current != $home] {
      _id, titel, "slug": slug.current, ${image('titelbild')}, einleitung, ${richText('body')}
    }`,
    { home: HOME_SLUG },
  );
}

/** Startseiten-Inhalt (optional). */
export function getHome(): Promise<Seite | null> {
  return client.fetch(
    `*[_type == "seite" && slug.current == $home][0] {
      _id, titel, "slug": slug.current, ${image('titelbild')}, einleitung, ${richText('body')}
    }`,
    { home: HOME_SLUG },
  );
}
