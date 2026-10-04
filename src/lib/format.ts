// Anzeige-Formatierung (Schweizer Deutsch).

/** "2026-10-03" -> "3. Oktober 2026". Mittag statt Mitternacht, damit keine Zeitzone den Tag verschiebt. */
export function formatDatum(datum: string): string {
  return new Date(`${datum}T12:00:00`).toLocaleDateString('de-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
