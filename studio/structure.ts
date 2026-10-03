import type { StructureResolver } from 'sanity/structure';

// Navigation im Studio, in der Reihenfolge, wie Editoren sie brauchen.
// "team" und "spielplan" sind Singletons: genau ein Dokument mit fester ID (siehe sanity.config.ts).
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Inhalte')
    .items([
      S.documentTypeListItem('news').title('News'),
      S.listItem()
        .title('Spielplan')
        .id('spielplan-ordner')
        .child(
          S.list()
            .title('Spielplan')
            .items([
              S.listItem()
                .title('Einstellungen')
                .id('spielplan')
                .child(S.document().schemaType('spielplan').documentId('spielplan').title('Spielplan – Einstellungen')),
              S.listItem()
                .title('Plausch- & Turnierspiele')
                .schemaType('spiel')
                .child(
                  S.documentTypeList('spiel')
                    .title('Plausch- & Turnierspiele')
                    .defaultOrdering([{ field: 'beginn', direction: 'desc' }]),
                ),
            ]),
        ),
      S.listItem()
        .title('Team')
        .id('team-ordner')
        .child(
          S.list()
            .title('Team')
            .items([
              S.listItem()
                .title('Teaminfos & Kader')
                .id('team')
                .child(S.document().schemaType('team').documentId('team').title('Teaminfos & Kader')),
              S.documentTypeListItem('spieler').title('Spieler'),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem('seite').title('Seiten'),
    ]);
