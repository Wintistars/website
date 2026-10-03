import { defineArrayMember, defineField, defineType } from 'sanity';
import { bildField, richTextField } from './fields';

// Der Club hat genau ein Team: Singleton mit der festen ID "team" (siehe structure.ts und sanity.config.ts).
// Der Teamname ist fest im Code (src/lib/verein.ts).
export const team = defineType({
  name: 'team',
  title: 'Teaminfos & Kader',
  type: 'document',
  fields: [
    bildField('teamfoto', 'Teamfoto'),
    defineField({ name: 'trainer', title: 'Trainer', type: 'string' }),
    richTextField('beschreibung', 'Beschreibung'),
    defineField({
      name: 'spieler',
      title: 'Kader',
      type: 'array',
      description: 'Spieler in Anzeigereihenfolge. Neue Spieler zuerst unter Team → Spieler erfassen.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'spieler' }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { media: 'teamfoto' },
    prepare: ({ media }) => ({ title: 'Teaminfos & Kader', media }),
  },
});
