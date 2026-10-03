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
