// Hauptnavigation: Jeder Punkt springt zum passenden Abschnitt der Startseite (dort hebt das Menü beim Scrollen
// den aktuellen Abschnitt hervor). `seite` = ausführliche Unterseite zum Thema, dort ist der Punkt aktiv.
export const NAVIGATION = [
  { label: 'News', abschnitt: 'news', seite: '/news/' },
  { label: 'Team', abschnitt: 'team' },
  { label: 'Spielplan', abschnitt: 'spiele', seite: '/spielplan/' },
  { label: 'Club', abschnitt: 'club' },
  { label: 'Kontakt', abschnitt: 'kontakt' },
] as const;

/** Auf der Startseite nur der Anker (weiches Scrollen ohne Neuladen), sonst zurück zur Startseite */
export const abschnittLink = (abschnitt: string, startseite: boolean) => (startseite ? `#${abschnitt}` : `/#${abschnitt}`);
