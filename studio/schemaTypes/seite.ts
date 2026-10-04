import { defineField, defineType } from 'sanity';
import { bildField, richTextField, slugField } from './fields';

export const seite = defineType({
  name: 'seite',
  title: 'Seite',
  type: 'document',
  description: 'Allgemeine Seite (Club, Kontakt …). Adresse «home» = Inhalt der Startseite.',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'string', validation: (rule) => rule.required() }),
    slugField('titel'),
    bildField('titelbild', 'Titelbild', {
      description: 'Grosses Bild oben auf der Seite. Auf der Startseite der Hintergrund des Kopfbereichs.',
    }),
    defineField({
      name: 'einleitung',
      title: 'Einleitung',
      type: 'text',
      rows: 3,
      description: 'Kurzer Text unter dem Titel (1–2 Sätze).',
      validation: (rule) => rule.max(300).warning('Bitte kurz halten (höchstens 300 Zeichen).'),
    }),
    richTextField('body', 'Inhalt'),
  ],
  preview: { select: { title: 'titel', subtitle: 'slug.current' } },
});
