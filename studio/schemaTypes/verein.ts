import { defineArrayMember, defineField, defineType } from 'sanity';

// Allgemeine Angaben zum Club: Singleton mit der festen ID "verein" (siehe structure.ts und sanity.config.ts).
export const verein = defineType({
  name: 'verein',
  title: 'Club – Allgemein',
  type: 'document',
  fields: [
    defineField({
      name: 'fakten',
      title: 'Eckdaten',
      type: 'array',
      description:
        'Kurze Fakten zum Club, z. B. Gründung, Meisterschaft, Spielort, Saison. Erscheinen auf der Startseite, der Club-Seite und beim Kontakt.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'fakt',
          title: 'Eckdatum',
          fields: [
            defineField({
              name: 'titel',
              title: 'Bezeichnung',
              type: 'string',
              description: 'Zum Beispiel «Gegründet».',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Angabe',
              type: 'string',
              description: 'Zum Beispiel «1993 in Winterthur».',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'titel', subtitle: 'text' } },
        }),
      ],
    }),
    defineField({
      name: 'kontaktEmail',
      title: 'Kontakt-E-Mail',
      type: 'email',
      description: 'Empfänger für Anfragen über die Website. Wird auf der Website als Kontaktadresse angezeigt.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Club – Allgemein' }),
  },
});
