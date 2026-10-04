import { defineField, defineType } from 'sanity';
import { bildField } from './fields';

export const spieler = defineType({
  name: 'spieler',
  title: 'Spieler',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'nummer', title: 'Rückennummer', type: 'number', validation: (rule) => rule.integer().min(0).max(99) }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      description: 'Leer lassen, wenn noch unbekannt.',
      options: {
        list: [
          { title: 'Torhüter', value: 'torhueter' },
          { title: 'Verteidiger', value: 'verteidiger' },
          { title: 'Sturm', value: 'sturm' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'funktion',
      title: 'Funktion im Team',
      type: 'string',
      description: 'Zum Beispiel Captain, Assistant Captain, Betreuer oder Kassier. Leer lassen, wenn keine.',
    }),
    defineField({ name: 'jahrgang', title: 'Jahrgang', type: 'number', validation: (rule) => rule.integer().min(1940).max(2030) }),
    bildField('portrait', 'Porträt'),
  ],
  orderings: [{ title: 'Name', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] }],
  preview: {
    select: { name: 'name', nummer: 'nummer', funktion: 'funktion', media: 'portrait' },
    prepare: ({ name, nummer, funktion, media }) => {
      // Untertitel z. B. «#12 · Captain»; fehlende Teile weglassen.
      const teile = [nummer != null ? `#${nummer}` : undefined, funktion || undefined].filter(Boolean);
      return { title: name, subtitle: teile.length ? teile.join(' · ') : undefined, media };
    },
  },
});
