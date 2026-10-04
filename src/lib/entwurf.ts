// NUR FÜR DESIGN-ENTWÜRFE (/entwurf/*): echte Daten aus Sanity/SIHF, ergänzt um Platzhalter.
// Vor dem definitiven Design wieder entfernen.
import { getNews, getTeam } from './sanity';
import { getSpielplan, type Spiel } from './spielplan';
import type { News, SpielerPosition } from './types';

/** Vorläufig: Logo als Rasterbild, bis die Original-Vektordatei vorliegt. */
export const LOGO_PLATZHALTER = '/entwurf/logo-platzhalter.webp';

export interface EntwurfSpieler {
  name: string;
  vorname: string;
  nummer: number;
  position: SpielerPosition;
  slug?: string;
  /** Bild-URL, falls in Sanity vorhanden; sonst Platzhalter darstellen (Silhouette/Nummer). */
  bild?: string;
}

export const POSITION_LABEL: Record<SpielerPosition, string> = {
  torhueter: 'Torhüter',
  verteidiger: 'Verteidiger',
  sturm: 'Stürmer',
};

/** Platzhalter-Kader in realistischer Grösse: 2 Torhüter, 8 Verteidiger, 12 Stürmer. */
const PLATZHALTER_SPIELER: EntwurfSpieler[] = [
  { vorname: 'Marco', name: 'Muster', nummer: 1, position: 'torhueter' },
  { vorname: 'Reto', name: 'Beispiel', nummer: 30, position: 'torhueter' },
  { vorname: 'Simon', name: 'Platzhalter', nummer: 4, position: 'verteidiger' },
  { vorname: 'Lukas', name: 'Exempel', nummer: 7, position: 'verteidiger' },
  { vorname: 'Daniel', name: 'Vorlage', nummer: 22, position: 'verteidiger' },
  { vorname: 'Patrick', name: 'Muster', nummer: 44, position: 'verteidiger' },
  { vorname: 'Roman', name: 'Probe', nummer: 2, position: 'verteidiger' },
  { vorname: 'Kevin', name: 'Beispiel', nummer: 5, position: 'verteidiger' },
  { vorname: 'Dominik', name: 'Vorlage', nummer: 55, position: 'verteidiger' },
  { vorname: 'Adrian', name: 'Test', nummer: 77, position: 'verteidiger' },
  { vorname: 'Andreas', name: 'Test', nummer: 9, position: 'sturm' },
  { vorname: 'Fabian', name: 'Dummy', nummer: 12, position: 'sturm' },
  { vorname: 'Michael', name: 'Probe', nummer: 17, position: 'sturm' },
  { vorname: 'Thomas', name: 'Entwurf', nummer: 19, position: 'sturm' },
  { vorname: 'Stefan', name: 'Skizze', nummer: 27, position: 'sturm' },
  { vorname: 'Nicola', name: 'Muster', nummer: 81, position: 'sturm' },
  { vorname: 'Jonas', name: 'Exempel', nummer: 10, position: 'sturm' },
  { vorname: 'Pascal', name: 'Platzhalter', nummer: 14, position: 'sturm' },
  { vorname: 'Marc', name: 'Dummy', nummer: 21, position: 'sturm' },
  { vorname: 'Lars', name: 'Skizze', nummer: 23, position: 'sturm' },
  { vorname: 'Beat', name: 'Vorlage', nummer: 88, position: 'sturm' },
  { vorname: 'Urs', name: 'Entwurf', nummer: 91, position: 'sturm' },
];

/**
 * Archivfotos der bisherigen Website (wintistars.ch, Wix), direkt vom Wix-Bild-CDN.
 * Nur als Übergang für die Entwürfe; neue Fotos kommen später über Sanity.
 */
export interface ArchivFoto {
  id: string;
  titel: string;
  /** Originalgrösse, für das Seitenverhältnis */
  breite: number;
  hoehe: number;
}

// «Siegerehrung» der alten Startseite ist dasselbe Foto wie «Meisterfeier Steiner-Cup 2015/16» und fehlt deshalb.
export const ARCHIV_FOTOS = {
  mannschaft2016: { id: 'b685bf_9a68092e68a84cddaa7fc8e670c47986.jpg', titel: 'Mannschaft 2016', breite: 2229, hoehe: 1482 },
  meisterfeier2016: { id: '8e1e75_21cf920e387846efbee006ef1a179013~mv2_d_5136_3552_s_4_2.jpg', titel: 'Meisterfeier Steiner-Cup 2015/16', breite: 5136, hoehe: 3552 },
  pokal2018: { id: '8e1e75_79ae4c072e5b4b149968acd6c88d04af~mv2.jpg', titel: 'Pokalübergabe Steiner-Cup 2017/18', breite: 1600, hoehe: 777 },
  pokal: { id: 'b685bf_684396b668b04b97b7e2221ef3970ca8.jpg', titel: 'Pokal', breite: 3123, hoehe: 2184 },
  abschlussturnier2019: { id: '8e1e75_2a18b5f14c6f40ed991928792dad5a61~mv2.jpg', titel: 'Abschlussturnier 2019', breite: 1024, hoehe: 682 },
} satisfies Record<string, ArchivFoto>;

/** URL eines Archivfotos in passender Grösse (Wix skaliert und schneidet zu). */
export function archivFotoUrl(foto: ArchivFoto, breite: number, hoehe?: number): string {
  const w = Math.min(breite, foto.breite);
  const h = hoehe ? Math.round((hoehe * w) / breite) : Math.round((w * foto.hoehe) / foto.breite);
  return `https://static.wixstatic.com/media/${foto.id}/v1/fill/w_${w},h_${h},al_c,q_85,enc_auto/${foto.id}`;
}

// Platzhalter-News als «Rückblicke» zu den Archivfotos (Texte passend zu den Bildlegenden).
const PLATZHALTER_NEWS: (Pick<News, 'titel' | 'slug' | 'datum' | 'lead'> & { foto: ArchivFoto })[] = [
  {
    titel: 'Rückblick: Meister 2017/18',
    slug: '#',
    datum: '2026-10-01',
    lead: 'Platzhalter: Pokalübergabe Steiner-Cup 2017/18 – der zweite Meistertitel in der Liga A des Conte Hockey Cups.',
    foto: ARCHIV_FOTOS.pokal2018,
  },
  {
    titel: 'Rückblick: Meisterfeier 2015/16',
    slug: '#',
    datum: '2026-09-20',
    lead: 'Platzhalter: Die Meisterfeier zum ersten Titel in der Liga A des Conte Hockey Cups.',
    foto: ARCHIV_FOTOS.meisterfeier2016,
  },
  {
    titel: 'Rückblick: Abschlussturnier 2019',
    slug: '#',
    datum: '2026-09-05',
    lead: 'Platzhalter: Die Wintistars am Winterthurer Abschlussturnier 2019.',
    foto: ARCHIV_FOTOS.abschlussturnier2019,
  },
];

/** Erfolge aus der alten Website, bis sie im Studio erfasst sind. */
const PLATZHALTER_ERFOLGE = [
  { saison: '2017/18', titel: 'Meister Conte Hockey Cup, Liga A' },
  { saison: '2015/16', titel: 'Meister Conte Hockey Cup, Liga A' },
  { saison: '–', titel: 'Meister Liga B und Aufstieg in die Liga A' },
  { saison: '–', titel: 'Sieger Winterthurer Saisonabschlussturnier' },
];

export interface EntwurfDaten {
  naechstes?: Spiel;
  kommend: Spiel[];
  resultate: Spiel[];
  news: { titel: string; slug: string; datum: string; lead?: string; bild?: string; platzhalter: boolean }[];
  spieler: EntwurfSpieler[];
  /** Teamfoto-URL aus Sanity, sonst leer → Platzhalter darstellen. */
  teamfoto?: string;
  /** Beschreibung des Teamfotos (Alt-Text/Legende); beim Archivbild «Mannschaft 2016 (Archiv)». */
  teamfotoTitel?: string;
  /** Archivfotos für eine Bildergeschichte/Galerie, bis neue Fotos in Sanity sind. */
  archiv: { titel: string; url: string; breite: number; hoehe: number }[];
  erfolge: { saison: string; titel: string }[];
  /** Kurztext «Über uns» (Platzhalter, aus der alten Website zusammengefasst). */
  ueberUns: string;
}

export async function getEntwurfDaten(): Promise<EntwurfDaten> {
  const [plan, news, team] = await Promise.all([getSpielplan(), getNews(3), getTeam()]);
  const kommend = plan.kommend.filter((s) => !s.hinweis);
  const { imageUrl } = await import('./image');
  const spielerSanity: EntwurfSpieler[] = (team?.spieler ?? []).map((s) => {
    const [vorname, ...rest] = s.name.split(' ');
    return {
      vorname,
      name: rest.join(' ') || vorname,
      nummer: s.nummer ?? 0,
      position: s.position ?? 'sturm',
      slug: s.slug,
      bild: s.portrait?.asset ? imageUrl(s.portrait, 600, 800) : undefined,
    };
  });
  return {
    naechstes: kommend[0],
    kommend,
    resultate: plan.resultate.filter((s) => s.resultat),
    news:
      news.length > 0
        ? news.map((n) => ({ ...n, bild: n.bild?.asset ? imageUrl(n.bild, 1200, 750) : undefined, platzhalter: false }))
        : // Bewusst ohne Bild: News sollen auch ohne Foto gut aussehen (Fotos sind die Ausnahme).
          PLATZHALTER_NEWS.map(({ foto: _foto, ...n }) => ({ ...n, platzhalter: true })),
    spieler: spielerSanity.length > 0 ? spielerSanity : PLATZHALTER_SPIELER,
    // Ohne Teamfoto in Sanity: Platzhalter (kein Archivbild, das wäre nicht das aktuelle Team).
    teamfoto: team?.teamfoto?.asset ? imageUrl(team.teamfoto, 2000) : undefined,
    teamfotoTitel: team?.teamfoto?.asset ? team.teamfoto.alt : undefined,
    archiv: [
      ARCHIV_FOTOS.meisterfeier2016,
      ARCHIV_FOTOS.pokal2018,
      ARCHIV_FOTOS.abschlussturnier2019,
      ARCHIV_FOTOS.pokal,
      ARCHIV_FOTOS.mannschaft2016,
    ].map((f) => ({ titel: f.titel, url: archivFotoUrl(f, 1600), breite: f.breite, hoehe: f.hoehe })),
    erfolge: team?.erfolge?.length ? team.erfolge : PLATZHALTER_ERFOLGE,
    ueberUns:
      'Der EHC Wintistars ist ein Plauscheishockeyclub aus Winterthur, gegründet 1993. Wir spielen im Conte Hockey Cup in Frauenfeld (Liga A) und bestreiten jede Saison rund 15 Spiele gegen befreundete Plauschteams in der Eishalle Deutweg – zwischen Oktober und April rund 30 Matches mit einem Stamm von gut 20 Spielern.',
  };
}
