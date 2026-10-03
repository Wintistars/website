import { defineField, defineType } from 'sanity';

// Einstellungen für den Spielplan: Singleton mit der festen ID "spielplan" (siehe structure.ts und sanity.config.ts).
export const spielplan = defineType({
  name: 'spielplan',
  title: 'Spielplan – Einstellungen',
  type: 'document',
  fields: [
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
  ],
  preview: { prepare: () => ({ title: 'Spielplan – Einstellungen' }) },
});
