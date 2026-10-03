import type { StructureResolver } from 'sanity/structure';

// Navigation im Studio, in der Reihenfolge, wie Editoren sie brauchen.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Inhalte')
    .items([
      S.documentTypeListItem('news').title('News'),
      S.documentTypeListItem('team').title('Teams'),
      S.documentTypeListItem('spieler').title('Spieler'),
      S.divider(),
      S.documentTypeListItem('seite').title('Seiten'),
    ]);
