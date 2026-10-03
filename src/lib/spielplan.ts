// Spielplan = Meisterschaftsspiele von Swiss Ice Hockey (automatisch) + Plausch-/Turnierspiele aus Sanity.
import { getSihfQuellen, getSpiele } from './sanity';
import { getSihfSpiele, type SihfSpiel } from './sihf';
import type { SanitySpiel, SpielArt, TeamRef } from './types';

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
  team: TeamRef;
  heim: string;
  gast: string;
  heimspiel: boolean;
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
  /** Mehr als ein Team im Spielplan: Team pro Spiel anzeigen. */
  mehrereTeams: boolean;
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
    mehrereTeams: new Set(spiele.map((s) => s.team.slug)).size > 1,
  };
}

export async function getNaechstesSpiel(jetzt = new Date()): Promise<Spiel | undefined> {
  const { kommend } = await getSpielplan(jetzt);
  return kommend.find((s) => !s.hinweis);
}

async function ladeSpiele(): Promise<Spiel[]> {
  const [quellen, eigene] = await Promise.all([getSihfQuellen(), getSpiele()]);
  const sihf = await Promise.all(
    quellen.map(async (team) => {
      const spiele = await getSihfSpiele(team.sihfUrl);
      const sihfName = eigenerName(spiele);
      return spiele.map((s) => vonSihf(s, team, sihfName));
    }),
  );

  // Spielen zwei eigene Teams gegeneinander, liefert die SIHF das Spiel bei beiden.
  const eindeutig = new Map<string, Spiel>();
  for (const spiel of [...sihf.flat(), ...eigene.map(vonSanity)]) {
    if (!eindeutig.has(spiel.id)) eindeutig.set(spiel.id, spiel);
  }
  return [...eindeutig.values()].sort((a, b) => a.beginn.getTime() - b.beginn.getTime());
}

/** Unser Team kommt in jedem Spiel vor; die SIHF schreibt den Namen evtl. anders als wir («EHC Winti Stars»). */
function eigenerName(spiele: SihfSpiel[]): string | undefined {
  const anzahl = new Map<string, number>();
  for (const s of spiele) for (const name of [s.heim, s.gast]) anzahl.set(name, (anzahl.get(name) ?? 0) + 1);
  const kandidaten = [...anzahl].filter(([, n]) => n === spiele.length);
  return kandidaten.length === 1 ? kandidaten[0][0] : undefined;
}

function vonSihf(s: SihfSpiel, team: TeamRef, sihfName: string | undefined): Spiel {
  // Unser Team mit dem Namen aus Sanity anzeigen, damit es überall gleich heisst.
  const name = (n: string) => (n === sihfName ? team.name : n);
  return {
    id: `sihf-${s.id}`,
    quelle: 'sihf',
    beginn: s.beginn,
    team: { name: team.name, slug: team.slug },
    heim: name(s.heim),
    gast: name(s.gast),
    heimspiel: s.heim === sihfName,
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
  const wir = s.team.name;
  return {
    id: s._id,
    quelle: 'sanity',
    beginn: new Date(s.beginn),
    ende: s.ende ? new Date(s.ende) : undefined,
    team: s.team,
    heim: s.heimspiel ? wir : s.gegner,
    gast: s.heimspiel ? s.gegner : wir,
    heimspiel: s.heimspiel,
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
