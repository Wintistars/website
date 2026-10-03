// Meisterschaftsspiele aus dem öffentlichen Spielplan-Export von Swiss Ice Hockey (SIHF Game Center).
// Der Export ist nicht offiziell dokumentiert: Bei Fehlern gibt es eine Warnung im Build-Log und
// eine leere Liste, damit die Website trotzdem gebaut wird.
import { zuerichZeit } from './zeit';

const EXPORT_URL = 'https://www.sihf.ch/umbraco/GameCenter/Team/ExportSchedule';
const SPIEL_URL = 'https://www.sihf.ch/de/game-center/game/';

export interface SihfTeamId {
  leagueId: string;
  regionId: string;
  teamId: string;
}

export interface SihfSpiel {
  id: string;
  beginn: Date;
  heim: string;
  gast: string;
  /** z. B. "4:3"; leer, solange nicht gespielt. */
  resultat?: { heim: number; gast: number };
  /** Verlängerung/Penaltyschiessen oder Forfait, wie von der SIHF geliefert. */
  zusatz?: string;
  /** Status im Wortlaut der SIHF, z. B. "Wie geplant", "Ende", "Forfait". */
  status: string;
  verschoben: boolean;
  ort?: string;
  /** z. B. "CHC-A · Regular Season" */
  wettbewerb?: string;
  link: string;
}

/** Liest "<leagueId>-<regionId>-<teamId>" aus einem Link auf die SIHF-Teamseite. */
export function parseSihfUrl(url: string): SihfTeamId | null {
  try {
    const { hostname, pathname } = new URL(url);
    if (!/(^|\.)sihf\.ch$/.test(hostname)) return null;
    const match = pathname.match(/\/(\d+)-(\d+)-(\d+)\/?$/);
    return match ? { leagueId: match[1], regionId: match[2], teamId: match[3] } : null;
  } catch {
    return null;
  }
}

export async function getSihfSpiele(sihfUrl: string): Promise<SihfSpiel[]> {
  const id = parseSihfUrl(sihfUrl);
  if (!id) {
    console.warn(`[sihf] Link nicht erkannt, Meisterschaftsspiele fehlen: ${sihfUrl}`);
    return [];
  }
  const url = new URL(EXPORT_URL);
  url.search = new URLSearchParams({ ...id, format: 'Csv', languageCode: 'de' }).toString();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const spiele = parseCsv(await res.text());
    console.info(`[sihf] ${spiele.length} Spiele für Team ${id.teamId} geladen`);
    return spiele;
  } catch (error) {
    console.warn(`[sihf] Spielplan nicht geladen (${url}): ${error}`);
    return [];
  }
}

/** Semikolon-getrennt, mit Kopfzeile. Spalten werden über den Namen gelesen, weil sie je Saison variieren. */
export function parseCsv(csv: string): SihfSpiel[] {
  const [kopf, ...zeilen] = csv.replace(/^﻿/, '').split(/\r?\n/).filter((z) => z.trim());
  if (!kopf) return [];
  const spalten = kopf.split(';').map((s) => s.trim());
  for (const pflicht of ['Datum', 'Zeit', 'Home', 'Away', 'Id']) {
    if (!spalten.includes(pflicht)) throw new Error(`Spalte "${pflicht}" fehlt im SIHF-Export`);
  }

  return zeilen.flatMap((zeile) => {
    const werte = zeile.split(';');
    const feld = (name: string) => werte[spalten.indexOf(name)]?.trim() || undefined;

    const datum = feld('Datum')?.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    const zeit = feld('Zeit')?.match(/^(\d{1,2}):(\d{2})$/);
    const id = feld('Id');
    if (!datum || !id) return [];

    const tore = feld('Resultat')?.match(/^(\d+):(\d+)$/);
    const status = feld('Status') ?? '';
    const zusatz = feld('OT/SO') ?? (status === 'Forfait' ? 'Forfait' : undefined);

    return [
      {
        id,
        beginn: zuerichZeit(+datum[3], +datum[2], +datum[1], zeit ? +zeit[1] : 0, zeit ? +zeit[2] : 0),
        heim: feld('Home') ?? '?',
        gast: feld('Away') ?? '?',
        resultat: tore ? { heim: +tore[1], gast: +tore[2] } : undefined,
        zusatz,
        status,
        verschoben: feld('Versch.')?.toLowerCase() === 'true',
        ort: feld('Stadion'),
        wettbewerb: [feld('Liga'), feld('Phase')].filter(Boolean).join(' · ') || undefined,
        link: SPIEL_URL + id,
      },
    ];
  });
}
