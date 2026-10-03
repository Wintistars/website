import { defineField, defineType } from 'sanity';
import { bildField, richTextField, slugField } from './fields';

export const spieler = defineType({
  name: 'spieler',
  title: 'Spieler',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
    slugField('name'),
    defineField({ name: 'nummer', title: 'Rückennummer', type: 'number', validation: (rule) => rule.integer().min(0).max(99) }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      options: {
        list: [
          { title: 'Torhüter', value: 'torhueter' },
          { title: 'Verteidiger', value: 'verteidiger' },
          { title: 'Sturm', value: 'sturm' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'jahrgang', title: 'Jahrgang', type: 'number', validation: (rule) => rule.integer().min(1940).max(2030) }),
    bildField('portrait', 'Porträt'),
    richTextField('text', 'Text'),
  ],
  orderings: [{ title: 'Name', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] }],
  preview: {
    select: { name: 'name', nummer: 'nummer', media: 'portrait' },
    prepare: ({ name, nummer, media }) => ({ title: name, subtitle: nummer != null ? `#${nummer}` : undefined, media }),
  },
});
