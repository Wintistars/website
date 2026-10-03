// Hauptnavigation. Allgemeine Seiten (Club, Kontakt …) sind Sanity-Dokumente vom Typ "seite".
export const NAVIGATION = [
  { label: 'News', href: '/news/' },
  { label: 'Team', href: '/team/' },
  { label: 'Spielplan', href: '/spielplan/' },
  { label: 'Club', href: '/club/' },
  { label: 'Kontakt', href: '/kontakt/' },
] as const;
