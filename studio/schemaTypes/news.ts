import { defineField, defineType } from 'sanity';
import { bildField, richTextField, slugField } from './fields';

export const news = defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'string', validation: (rule) => rule.required() }),
    slugField('titel'),
    defineField({
      name: 'datum',
      title: 'Datum',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lead',
      title: 'Lead',
      type: 'text',
      rows: 3,
      description: 'Kurzer Anriss für die Übersicht und Suchmaschinen (1–2 Sätze).',
    }),
    bildField('bild', 'Titelbild'),
    richTextField('text', 'Text'),
  ],
  orderings: [{ title: 'Datum, neuste zuerst', name: 'datumDesc', by: [{ field: 'datum', direction: 'desc' }] }],
  preview: { select: { title: 'titel', subtitle: 'datum', media: 'bild' } },
});
