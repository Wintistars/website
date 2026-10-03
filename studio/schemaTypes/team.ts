import { defineArrayMember, defineField, defineType } from 'sanity';
import { bildField, richTextField, slugField } from './fields';

export const team = defineType({
  name: 'team',
  title: 'Team',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
    slugField('name'),
    defineField({ name: 'kategorie', title: 'Kategorie', type: 'string', description: 'z. B. «1. Mannschaft», «U15»' }),
    defineField({
      name: 'reihenfolge',
      title: 'Reihenfolge',
      type: 'number',
      description: 'Position in der Teamübersicht (kleinste Zahl zuerst).',
      initialValue: 10,
    }),
    bildField('teamfoto', 'Teamfoto'),
    defineField({ name: 'trainer', title: 'Trainer', type: 'string' }),
    defineField({
      name: 'sihfUrl',
      title: 'Spielplan Swiss Ice Hockey (Link)',
      type: 'url',
      description:
        'Link zur Teamseite im SIHF Game Center, z. B. https://www.sihf.ch/de/game-center/team/109-2-710048. ' +
        'Meisterschaftsspiele und Resultate erscheinen dann automatisch im Spielplan. ' +
        'Zu Saisonbeginn prüfen, ob der Link noch stimmt.',
      validation: (rule) =>
        rule.uri({ scheme: ['https', 'http'] }).custom((wert) => {
          if (!wert) return true;
          const fehler =
            'Bitte den Link zur Teamseite auf sihf.ch einfügen, z. B. https://www.sihf.ch/de/game-center/team/109-2-710048 (am Schluss drei Zahlen mit Bindestrichen).';
          let url: URL;
          try {
            url = new URL(wert);
          } catch {
            return fehler;
          }
          const hostOk = url.hostname === 'sihf.ch' || url.hostname === 'www.sihf.ch';
          const idOk = url.pathname.split('/').some((segment) => /^\d+-\d+-\d+$/.test(segment));
          return hostOk && idOk ? true : fehler;
        }),
    }),
    richTextField('beschreibung', 'Beschreibung'),
    defineField({
      name: 'spieler',
      title: 'Kader',
      type: 'array',
      description: 'Spieler in Anzeigereihenfolge. Neue Spieler zuerst unter «Spieler» erfassen.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'spieler' }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  orderings: [{ title: 'Reihenfolge', name: 'reihenfolgeAsc', by: [{ field: 'reihenfolge', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'kategorie', media: 'teamfoto' } },
});
