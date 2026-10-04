// Kadertafel: neutrale Darstellung ohne Rangfolge. Drei Gruppen (plus «Weitere» für Spieler ohne Position),
// innerhalb nach Rückennummer (ohne Nummer ans Ende, dann alphabetisch).
import { imageUrl } from './image';
import type { Spieler, SpielerPosition } from './types';

export interface KaderSpieler {
  vorname: string;
  name: string;
  /** 0 = keine Nummer */
  nummer: number;
  position?: SpielerPosition;
  funktion?: string;
  /** Porträt-URL, sonst Platzhalter (Silhouette/Nummer) */
  bild?: string;
}

export type Gruppe = SpielerPosition | 'weitere';

export const POS_EINZEL: Record<SpielerPosition, string> = { torhueter: 'Torhüter', verteidiger: 'Verteidiger', sturm: 'Stürmer' };

const GRUPPEN_TITEL: Record<Gruppe, string> = {
  torhueter: 'Torhüter',
  verteidiger: 'Verteidigung',
  sturm: 'Sturm',
  weitere: 'Weitere',
};

/** «Roman Küng-Reinhard» → Vorname «Roman», Name «Küng-Reinhard» */
export function zuKaderSpieler(s: Spieler): KaderSpieler {
  const [vorname, ...rest] = s.name.trim().split(/\s+/);
  return {
    vorname: rest.length ? vorname : '',
    name: rest.length ? rest.join(' ') : vorname,
    nummer: s.nummer ?? 0,
    position: s.position,
    funktion: s.funktion,
    bild: s.portrait?.asset ? imageUrl(s.portrait, 600, 800) : undefined,
  };
}

const nachNummer = (a: KaderSpieler, b: KaderSpieler) =>
  (a.nummer > 0 ? 0 : 1) - (b.nummer > 0 ? 0 : 1) ||
  (a.nummer > 0 && b.nummer > 0 ? a.nummer - b.nummer : 0) ||
  `${a.name} ${a.vorname}`.localeCompare(`${b.name} ${b.vorname}`, 'de-CH');

export function kaderTafel(spieler: Spieler[]) {
  const kader = spieler.map(zuKaderSpieler).sort(nachNummer);
  const gruppen = (['torhueter', 'verteidiger', 'sturm', 'weitere'] as const)
    .map((pos) => ({ pos, spieler: kader.filter((s) => (s.position ?? 'weitere') === pos) }))
    .filter((g) => g.spieler.length > 0);
  /** Reihenfolge fürs gestaffelte Einrasten und für die Spielerkarte: nach Nummer über alle Gruppen */
  const rang = new Map(kader.map((s, i) => [s, i]));
  return { kader, gruppen, rang, GRUPPEN_TITEL };
}
