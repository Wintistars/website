// Anzeige-Formatierung (Schweizer Deutsch).

export function formatDatum(datum: string): string {
  const d = new Date(datum.replace(' ', 'T'));
  return d.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const POSITION_LABEL: Record<string, string> = {
  torhueter: 'Torhüter',
  verteidiger: 'Verteidiger',
  sturm: 'Sturm',
};
