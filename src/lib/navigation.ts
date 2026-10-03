// Hauptnavigation. Allgemeine Seiten (Club, Kontakt …) sind Storyblok-Stories vom Typ "seite".
export const NAVIGATION = [
  { label: 'News', href: '/news/' },
  { label: 'Teams', href: '/teams/' },
  { label: 'Spielplan', href: '/spielplan/' },
  { label: 'Club', href: '/club/' },
  { label: 'Kontakt', href: '/kontakt/' },
] as const;
