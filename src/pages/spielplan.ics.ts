// Spielplan als Kalender-Abo (iCalendar), z. B. für Handy-Kalender: https://www.wintistars.ch/spielplan.ics
import type { APIRoute } from 'astro';
import { ART_LABEL, getAlleSpiele, type Spiel } from '../lib/spielplan';
import { VEREIN } from '../lib/verein';

const STANDARD_DAUER_MS = 2 * 60 * 60 * 1000;

export const GET: APIRoute = async ({ site }) => {
  const spiele = await getAlleSpiele();
  const jetzt = utc(new Date());
  const zeilen = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EHC Wintistars//Spielplan//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${VEREIN}`,
    'X-WR-TIMEZONE:Europe/Zurich',
    ...spiele.flatMap((s) => termin(s, jetzt, new URL('/spielplan/', site).href)),
    'END:VCALENDAR',
  ];
  return new Response(zeilen.map(falten).join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};

function termin(s: Spiel, jetzt: string, url: string): string[] {
  const resultat = s.resultat ? ` ${s.resultat.heim}:${s.resultat.gast}` : '';
  const beschreibung = [ART_LABEL[s.art], s.wettbewerb, s.bemerkung, s.link].filter(Boolean).join('\n');
  return [
    'BEGIN:VEVENT',
    `UID:${s.id}@wintistars.ch`,
    `DTSTAMP:${jetzt}`,
    `DTSTART:${utc(s.beginn)}`,
    `DTEND:${utc(s.ende ?? new Date(s.beginn.getTime() + STANDARD_DAUER_MS))}`,
    `SUMMARY:${text(`${s.hinweis ? `[${s.hinweis}] ` : ''}${s.heim} – ${s.gast}${resultat}`)}`,
    ...(s.ort ? [`LOCATION:${text(s.ort)}`] : []),
    `DESCRIPTION:${text(beschreibung)}`,
    `URL:${s.link ?? url}`,
    ...(s.hinweis === 'Abgesagt' ? ['STATUS:CANCELLED'] : []),
    'END:VEVENT',
  ];
}

/** 20261012T190000Z */
function utc(datum: Date): string {
  return datum.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function text(wert: string): string {
  return wert.replace(/[\\;,]/g, (z) => `\\${z}`).replace(/\n/g, '\\n');
}

/** Zeilen über 75 Bytes umbrechen (RFC 5545). */
function falten(zeile: string): string {
  const teile: string[] = [];
  let rest = zeile;
  while (new TextEncoder().encode(rest).length > 75) {
    let n = 74;
    while (new TextEncoder().encode(rest.slice(0, n)).length > 74) n--;
    teile.push(rest.slice(0, n));
    rest = ' ' + rest.slice(n);
  }
  return [...teile, rest].join('\r\n');
}
