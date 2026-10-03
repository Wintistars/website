import { defineField, defineType } from 'sanity';

// Spiele, die Swiss Ice Hockey nicht kennt (Plauschspiele, Turniere usw.).
// Meisterschaftsspiele kommen automatisch über den SIHF-Link unter Spielplan → Einstellungen.

const ARTEN = [
  { title: 'Plauschspiel', value: 'plausch' },
  { title: 'Turnier', value: 'turnier' },
  { title: 'Cup', value: 'cup' },
  { title: 'Anderes', value: 'anderes' },
];

const TORE_BESCHREIBUNG = 'Nach dem Spiel ausfüllen. Leer lassen, solange das Spiel nicht gespielt ist.';

export const spiel = defineType({
  name: 'spiel',
  title: 'Plausch- & Turnierspiel',
  type: 'document',
  fields: [
    defineField({
      name: 'beginn',
      title: 'Datum und Anpfiff',
      type: 'datetime',
      options: { timeStep: 5, dateFormat: 'DD.MM.YYYY' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ende',
      title: 'Ende (optional)',
      type: 'datetime',
      description: 'Zum Beispiel bei Turnieren, die mehrere Stunden dauern.',
      options: { timeStep: 5, dateFormat: 'DD.MM.YYYY' },
      validation: (rule) =>
        rule.custom((ende, context) => {
          const beginn = (context.document as { beginn?: string } | undefined)?.beginn;
          if (!ende || !beginn) return true;
          return new Date(ende) > new Date(beginn) ? true : 'Das Ende muss nach dem Anpfiff liegen.';
        }),
    }),
    defineField({ name: 'gegner', title: 'Gegner', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'heimspiel',
      title: 'Heimspiel',
      type: 'boolean',
      description: 'Ein: Wir sind Gastgeber. Aus: Auswärtsspiel.',
      initialValue: true,
    }),
    defineField({ name: 'ort', title: 'Ort / Eisfeld', type: 'string', description: 'z. B. «Eishalle Wetzikon»' }),
    defineField({
      name: 'art',
      title: 'Art',
      type: 'string',
      options: { list: ARTEN, layout: 'radio' },
      initialValue: 'plausch',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'toreTeam',
      title: 'Tore Wintistars',
      type: 'number',
      description: TORE_BESCHREIBUNG,
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'toreGegner',
      title: 'Tore Gegner',
      type: 'number',
      description: TORE_BESCHREIBUNG,
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({ name: 'abgesagt', title: 'Abgesagt / verschoben', type: 'boolean', initialValue: false }),
    defineField({ name: 'bemerkung', title: 'Bemerkung', type: 'string', description: 'z. B. «Treffpunkt 19.00 Uhr»' }),
  ],
  orderings: [
    { title: 'Datum, neuste zuerst', name: 'beginnDesc', by: [{ field: 'beginn', direction: 'desc' }] },
    { title: 'Datum, älteste zuerst', name: 'beginnAsc', by: [{ field: 'beginn', direction: 'asc' }] },
  ],
  preview: {
    select: {
      gegner: 'gegner',
      heimspiel: 'heimspiel',
      beginn: 'beginn',
      art: 'art',
      toreTeam: 'toreTeam',
      toreGegner: 'toreGegner',
      abgesagt: 'abgesagt',
    },
    prepare({ gegner, heimspiel, beginn, art, toreTeam, toreGegner, abgesagt }) {
      const wir = 'Wintistars';
      const heim = heimspiel !== false;
      const title = heim ? `${wir} – ${gegner ?? '?'}` : `${gegner ?? '?'} – ${wir}`;
      const datum = beginn
        ? new Date(beginn).toLocaleString('de-CH', {
            timeZone: 'Europe/Zurich',
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Kein Datum';
      const artTitel = ARTEN.find((a) => a.value === art)?.title;
      const hatResultat = typeof toreTeam === 'number' && typeof toreGegner === 'number';
      const resultat = hatResultat ? (heim ? `${toreTeam}:${toreGegner}` : `${toreGegner}:${toreTeam}`) : undefined;
      const subtitle = [datum, artTitel, resultat, abgesagt ? 'abgesagt' : undefined].filter(Boolean).join(' · ');
      return { title, subtitle };
    },
  },
});
