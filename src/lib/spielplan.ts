// Spielplan = Meisterschaftsspiele von Swiss Ice Hockey (automatisch) + Plausch-/Turnierspiele aus Sanity.
import { getSpiele, getSpielplanEinstellungen } from './sanity';
import { getSihfSpiele, type SihfSpiel } from './sihf';
import type { SanitySpiel, SpielArt } from './types';
import { VEREIN } from './verein';

/** Ab wann ein Spiel ohne Resultat als vorbei gilt. */
const SPIELDAUER_MS = 3 * 60 * 60 * 1000;

export const ART_LABEL: Record<SpielArt | 'meisterschaft', string> = {
  meisterschaft: 'Meisterschaft',
  plausch: 'Plauschspiel',
  turnier: 'Turnier',
  cup: 'Cup',
  anderes: 'Spiel',
};

export interface Spiel {
  id: string;
  quelle: 'sihf' | 'sanity';
  beginn: Date;
  ende?: Date;
  heim: string;
  gast: string;
  /** Auf welcher Seite wir spielen; leer, wenn unser Team im SIHF-Export nicht erkannt wurde. */
  wir?: 'heim' | 'gast';
  art: SpielArt | 'meisterschaft';
  wettbewerb?: string;
  ort?: string;
  resultat?: { heim: number; gast: number };
  zusatz?: string;
  /** Hinweis wie "Abgesagt" oder "Verschoben", sonst leer. */
  hinweis?: string;
  bemerkung?: string;
  /** Matchblatt im SIHF Game Center. */
  link?: string;
}

export interface Spielplan {
  kommend: Spiel[];
  resultate: Spiel[];
}

let cache: Promise<Spiel[]> | undefined;

/** Alle Spiele, chronologisch. Wird pro Build nur einmal geladen. */
export function getAlleSpiele(): Promise<Spiel[]> {
  cache ??= ladeSpiele();
  return cache;
}

export async function getSpielplan(jetzt = new Date()): Promise<Spielplan> {
  const spiele = await getAlleSpiele();
  const vorbei = (s: Spiel) => !!s.resultat || (s.ende ?? new Date(s.beginn.getTime() + SPIELDAUER_MS)) < jetzt;
  return {
    kommend: spiele.filter((s) => !vorbei(s)),
    resultate: spiele.filter(vorbei).reverse(),
  };
}

export async function getNaechstesSpiel(jetzt = new Date()): Promise<Spiel | undefined> {
  const { kommend } = await getSpielplan(jetzt);
  return kommend.find((s) => !s.hinweis);
}

async function ladeSpiele(): Promise<Spiel[]> {
  const [einstellungen, eigene] = await Promise.all([getSpielplanEinstellungen(), getSpiele()]);
  // Ohne SIHF-Link im Studio (Spielplan → Einstellungen) gibt es keine Meisterschaftsspiele.
  const sihfUrl = einstellungen?.sihfUrl;
  const sihfSpiele = sihfUrl ? await getSihfSpiele(sihfUrl) : [];
  const sihfName = eigenerName(sihfSpiele);
  return [...sihfSpiele.map((s) => vonSihf(s, sihfName)), ...eigene.map(vonSanity)].sort(
    (a, b) => a.beginn.getTime() - b.beginn.getTime(),
  );
}

/** Unser Team kommt in jedem Spiel vor; die SIHF schreibt den Namen evtl. anders als wir («EHC Winti Stars»). */
function eigenerName(spiele: SihfSpiel[]): string | undefined {
  const anzahl = new Map<string, number>();
  for (const s of spiele) for (const name of [s.heim, s.gast]) anzahl.set(name, (anzahl.get(name) ?? 0) + 1);
  const kandidaten = [...anzahl].filter(([, n]) => n === spiele.length);
  return kandidaten.length === 1 ? kandidaten[0][0] : undefined;
}

function vonSihf(s: SihfSpiel, sihfName: string | undefined): Spiel {
  // Unser Team mit dem festen Vereinsnamen anzeigen, damit es überall gleich heisst.
  const name = (n: string) => (sihfName && n === sihfName ? VEREIN : n);
  return {
    id: `sihf-${s.id}`,
    quelle: 'sihf',
    beginn: s.beginn,
    heim: name(s.heim),
    gast: name(s.gast),
    wir: !sihfName ? undefined : s.heim === sihfName ? 'heim' : 'gast',
    art: 'meisterschaft',
    wettbewerb: s.wettbewerb,
    ort: s.ort,
    resultat: s.resultat,
    zusatz: s.zusatz,
    hinweis: s.verschoben ? 'Verschoben' : sihfHinweis(s.status),
    link: s.link,
  };
}

/** Nur Status anzeigen, die vom normalen Ablauf abweichen. */
function sihfHinweis(status: string): string | undefined {
  return /^(wie geplant|ende|forfait|)$/i.test(status.trim()) ? undefined : status;
}

function vonSanity(s: SanitySpiel): Spiel {
  return {
    id: s._id,
    quelle: 'sanity',
    beginn: new Date(s.beginn),
    ende: s.ende ? new Date(s.ende) : undefined,
    heim: s.heimspiel ? VEREIN : s.gegner,
    gast: s.heimspiel ? s.gegner : VEREIN,
    wir: s.heimspiel ? 'heim' : 'gast',
    art: s.art,
    ort: s.ort,
    resultat:
      s.toreTeam != null && s.toreGegner != null
        ? s.heimspiel
          ? { heim: s.toreTeam, gast: s.toreGegner }
          : { heim: s.toreGegner, gast: s.toreTeam }
        : undefined,
    hinweis: s.abgesagt ? 'Abgesagt' : undefined,
    bemerkung: s.bemerkung,
  };
}

/** Sieg, Niederlage oder Unentschieden aus unserer Sicht; leer ohne Resultat oder wenn unklar ist, wer wir sind. */
export function ausgang(spiel: Spiel): 'sieg' | 'niederlage' | 'unentschieden' | undefined {
  const { resultat, wir } = spiel;
  if (!resultat || !wir) return undefined;
  const [unsere, ihre] = wir === 'heim' ? [resultat.heim, resultat.gast] : [resultat.gast, resultat.heim];
  return unsere > ihre ? 'sieg' : unsere < ihre ? 'niederlage' : 'unentschieden';
}

/** Gegner aus unserer Sicht (falls unklar: «Heim – Gast»). */
export function gegner(spiel: Spiel): string {
  if (spiel.wir === 'heim') return spiel.gast;
  if (spiel.wir === 'gast') return spiel.heim;
  return `${spiel.heim} – ${spiel.gast}`;
}
