// Datum/Zeit in Schweizer Ortszeit, unabhängig von der Zeitzone des Build-Servers (Cloudflare: UTC).
export const ZEITZONE = 'Europe/Zurich';

/** Differenz Zürich – UTC in Millisekunden zum Zeitpunkt `datum`. */
function offset(datum: Date): number {
  const teile = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: ZEITZONE,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })
      .formatToParts(datum)
      .map((t) => [t.type, Number(t.value)]),
  );
  return Date.UTC(teile.year, teile.month - 1, teile.day, teile.hour, teile.minute, teile.second) - datum.getTime();
}

/** Zeitpunkt aus Schweizer Ortszeit (Monat 1–12), inkl. Sommerzeit. */
export function zuerichZeit(jahr: number, monat: number, tag: number, stunde: number, minute: number): Date {
  const alsUtc = Date.UTC(jahr, monat - 1, tag, stunde, minute);
  const erster = new Date(alsUtc - offset(new Date(alsUtc)));
  return new Date(alsUtc - offset(erster));
}

/** "Mo, 12.10.2026" */
export function formatSpieltag(datum: Date): string {
  return datum.toLocaleDateString('de-CH', {
    timeZone: ZEITZONE,
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** "21:00" */
export function formatUhrzeit(datum: Date): string {
  return datum.toLocaleTimeString('de-CH', { timeZone: ZEITZONE, hour: '2-digit', minute: '2-digit' });
}
