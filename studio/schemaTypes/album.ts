import { defineArrayMember, defineField, defineType } from 'sanity';

// Fotoalbum für die Galerie. Alben ohne Fotos erscheinen nicht auf der Website.
export const album = defineType({
  name: 'album',
  title: 'Galerie-Album',
  type: 'document',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'datum',
      title: 'Datum',
      type: 'date',
      description: 'Wann die Fotos entstanden sind; bestimmt die Reihenfolge (neuste zuerst).',
      options: { dateFormat: 'DD.MM.YYYY' },
    }),
    defineField({ name: 'beschreibung', title: 'Beschreibung', type: 'text', rows: 2 }),
    defineField({
      name: 'bilder',
      title: 'Fotos',
      type: 'array',
      description: 'Mehrere Fotos auf einmal hierher ziehen. Reihenfolge per Ziehen ändern.',
      options: { layout: 'grid' },
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternativtext',
              type: 'string',
              description: 'Kurze Bildbeschreibung für Screenreader und Suchmaschinen.',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'legende', title: 'Bildlegende', type: 'string' }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  orderings: [{ title: 'Datum, neuste zuerst', name: 'datumDesc', by: [{ field: 'datum', direction: 'desc' }] }],
  preview: {
    select: { title: 'titel', subtitle: 'datum', media: 'bilder.0' },
  },
});
