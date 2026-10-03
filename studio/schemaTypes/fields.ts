import { defineArrayMember, defineField } from 'sanity';

/** Bild mit Hotspot (Zuschnitt) und Pflicht-Alternativtext. */
export function bildField(name: string, title: string, options: { required?: boolean } = {}) {
  return defineField({
    name,
    title,
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
    ],
    validation: options.required ? (rule) => rule.required() : undefined,
  });
}

/** Rich Text mit Überschriften, Listen, Links und Bildern. */
export function richTextField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'Überschrift', value: 'h2' },
          { title: 'Zwischentitel', value: 'h3' },
          { title: 'Zitat', value: 'blockquote' },
        ],
      }),
      defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        fields: [
          defineField({ name: 'alt', title: 'Alternativtext', type: 'string' }),
          defineField({ name: 'legende', title: 'Bildlegende', type: 'string' }),
        ],
      }),
    ],
  });
}

export function slugField(source: string) {
  return defineField({
    name: 'slug',
    title: 'Adresse (URL)',
    type: 'slug',
    description: 'Wird aus dem Titel erzeugt. Nach dem Veröffentlichen nicht mehr ändern, sonst funktionieren Links nicht mehr.',
    options: { source, maxLength: 96 },
    validation: (rule) => rule.required(),
  });
}
