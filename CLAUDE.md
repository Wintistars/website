# EHC Wintistars – Club-Website

Neue Website für den Eishockeyclub EHC Wintistars (Winterthur), ersetzt www.wintistars.ch.
Astro (SSG, TypeScript strict) + Storyblok (Headless CMS). Kommunikation mit Yves auf Deutsch.

Projektbrief, Entscheide, Status und offene Punkte: @docs/projekt.md
Allgemeine Astro-Hinweise: @AGENTS.md

## Befehle

- `npm run dev` – Dev-Server (lädt Storyblok-Entwürfe, braucht `STORYBLOK_TOKEN` in `.env`)
- `npm run build` – statischer Build nach `dist/` (lädt veröffentlichte Inhalte)
- `npm run check` – Typecheck (`astro check`); vor jedem Commit ausführen

Ohne gültigen `STORYBLOK_TOKEN` schlägt der Build bewusst fehl (keine leere Seite deployen).

## Struktur

- `astro.config.mjs` – Storyblok-Integration, Mapping Komponentenname → `src/storyblok/*.astro`
- `storyblok/components.json` – Content-Modell (Quelle der Wahrheit)
- `src/lib/types.ts` – TS-Typen der Storyblok-Komponenten
- `src/lib/storyblok.ts` – einziger Datenzugriff auf Storyblok (`getNews`, `getTeams`, …)
- `src/lib/image.ts` – URLs fürs Storyblok-Bild-CDN; `src/components/SbPicture.astro` nutzen
- `src/storyblok/` – Rendering je Storyblok-Komponente (mit `storyblokEditable`)
- `src/pages/` – Routen: `/`, `/news/[slug]`, `/teams/[slug]`, `/spieler/[slug]`, `/spielplan`, `/[...slug]` (Typ `seite`)

## Storyblok-Konventionen

- Ordner (full_slug-Präfix): `news/`, `teams/`, `spieler/`; Seiten liegen im Root, Startseite = Story `home`.
- Content-Typen: `news`, `spieler`, `team`, `seite`; verschachtelbare Blöcke: `text`, `bild`.
- Team → Spieler ist eine Relation (`team.spieler`, aufgelöst via `resolve_relations`).
- Änderung am Content-Modell immer an drei Stellen synchron: `storyblok/components.json`,
  `src/lib/types.ts`, `src/storyblok/*.astro` (+ Mapping in `astro.config.mjs`).
  Dafür gibt es den Subagent `storyblok-schema`.

## Rahmenbedingungen

- Editoren haben **keinen GitHub-Zugang**: Inhalte gehören nach Storyblok, nicht ins Repo.
  Keine Bilder/Texte hart codieren, die sich ändern können.
- Logo nur als originalgetreue Vektordatei verwenden, nie aus Fotos nachbauen.
  Farben in `src/styles/global.css` sind Platzhalter, bis Logo/Trikotfarben definitiv sind.
- Secrets nur über Umgebungsvariablen (`.env` ist gitignored, Vorlage `.env.example`).
- `main` ist geschützt: Änderungen per Branch + Pull Request.
- UI-Texte auf Deutsch (de-CH, «ss» statt «ß»).
