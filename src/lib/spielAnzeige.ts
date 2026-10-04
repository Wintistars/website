// Kleine Helfer für die Darstellung von Spielen (Matchplan, Tabellen, Spielplan-Seite).
import { ART_LABEL, type Spiel } from './spielplan';
import { ZEITZONE } from './zeit';

/** Ort ohne Adresse («Eishalle Deutweg, Winterthur» → «Eishalle Deutweg») */
export const kurzOrt = (s: Spiel) => s.ort?.split(',')[0]?.trim() || undefined;

/** «Meisterschaft · Frauenfeld» */
export const metaZeile = (s: Spiel) => [ART_LABEL[s.art], kurzOrt(s)].filter(Boolean).join(' · ');

/** «12.10.» */
export const kurzDatum = (d: Date) => d.toLocaleDateString('de-CH', { timeZone: ZEITZONE, day: '2-digit', month: '2-digit' });

/** Resultat aus unserer Sicht («5:3» = wir zuerst) */
export function score(s: Spiel): string {
  if (!s.resultat) return '';
  const { heim, gast } = s.resultat;
  return s.wir === 'gast' ? `${gast}:${heim}` : `${heim}:${gast}`;
}

/** Schriftgrösse nach Namenslänge, damit lange Gegnernamen sauber umbrechen. */
export const laenge = (name: string) => (name.length > 28 ? 'l3' : name.length > 20 ? 'l2' : name.length > 13 ? 'l1' : 'l0');

export const AUSGANG_LABEL = { sieg: 'Sieg', niederlage: 'Niederlage', unentschieden: 'Unentschieden' } as const;
