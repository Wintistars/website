import { defineField, defineType } from 'sanity';
import { richTextField, slugField } from './fields';

export const seite = defineType({
  name: 'seite',
  title: 'Seite',
  type: 'document',
  description: 'Allgemeine Seite (Club, Kontakt …). Adresse «home» = Inhalt der Startseite.',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'string', validation: (rule) => rule.required() }),
    slugField('titel'),
    richTextField('body', 'Inhalt'),
  ],
  preview: { select: { title: 'titel', subtitle: 'slug.current' } },
});
