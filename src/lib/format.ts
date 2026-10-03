// Anzeige-Formatierung (Schweizer Deutsch).
import type { SpielerPosition } from './types';

/** "2026-10-03" -> "3. Oktober 2026". Mittag statt Mitternacht, damit keine Zeitzone den Tag verschiebt. */
export function formatDatum(datum: string): string {
  return new Date(`${datum}T12:00:00`).toLocaleDateString('de-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const POSITION_LABEL: Record<SpielerPosition, string> = {
  torhueter: 'Torhüter',
  verteidiger: 'Verteidiger',
  sturm: 'Sturm',
};
