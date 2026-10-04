# EHC Wintistars – Club-Website

Neue Website für den Eishockeyclub EHC Wintistars (Winterthur), ersetzt www.wintistars.ch.
Astro (SSG, TypeScript strict) + Sanity (Headless CMS) + Cloudflare Pages. Kommunikation mit Yves auf Deutsch.

Projektbrief, Entscheide, Status und offene Punkte: @docs/projekt.md
Allgemeine Astro-Hinweise: @AGENTS.md

## Befehle

- `npm run dev` – Website lokal (http://localhost:4321), liest veröffentlichte Inhalte aus Sanity
- `npm run build` – statischer Build nach `dist/`
- `npm run check` – Typecheck Website; vor jedem Commit ausführen
- `npm run studio` – Sanity Studio lokal (http://localhost:3333), eigenes Paket unter `studio/` (`npm --prefix studio install`)
- `npm --prefix studio run check` – Typecheck Studio
- `npm run studio:deploy` – Studio manuell nach wintistars.sanity.studio veröffentlichen (braucht `npx sanity login`).
  Normalerweise nicht nötig: `.github/workflows/studio-deploy.yml` deployt bei Änderungen unter `studio/` auf `main`.

Website-Build und Dev-Server brauchen keine Secrets: Das Dataset ist öffentlich, Projekt-ID/Dataset stehen in `src/lib/sanity.ts`
und `studio/sanity.cli.ts`. Optional lokal `.env` (Vorlage `.env.example`) mit `SANITY_AUTH_TOKEN` für Skripte/CLI – nie committen.
GitHub-Secrets: `SANITY_AUTH_TOKEN` (Studio-Deploy), `CLOUDFLARE_DEPLOY_HOOK` (täglicher Rebuild).

## Struktur

- `studio/schemaTypes/` – Content-Modell (Quelle der Wahrheit); `fields.ts` = gemeinsame Felder (Bild, Rich Text, Slug)
- `src/lib/sanity.ts` – Sanity-Client und alle GROQ-Abfragen (`getNews`, `getTeam`, `getSeiten`, `getHome`, `getSpiele`, `getSpielplanEinstellungen`, `getVerein`, `getAlben`)
- `src/lib/sihf.ts` + `src/lib/spielplan.ts` – Spielplan: SIHF-Export (Meisterschaft) + Sanity-Spiele; Zeiten immer über `src/lib/zeit.ts` (Europe/Zurich)
- `src/lib/types.ts` – TS-Typen passend zu den GROQ-Projektionen
- `src/lib/verein.ts` – fester Teamname `VEREIN` («EHC Wintistars») für Team-Seite, Spielplan, Kalender
- `src/lib/image.ts` + `src/components/SanityPicture.astro` – Bilder über das Sanity-Bild-CDN
- Design «Taktiktafel» (gewählter Entwurf B): `src/styles/site.css` (global: Tokens, Kopf, Fuss, alle Bausteine),
  `src/layouts/BaseLayout.astro` (Kopf/Navigation, Fuss, Einblend-Script). Alles hängt am Wrapper `.d`;
  `.d-js` am `<html>` = JavaScript aktiv.
- `src/components/start/Hero.astro` – Hero: Spielzüge im Loop, Klick aufs Logo = Eis aufbereiten (Eismaschine)
- `src/components/team/TeamBand.astro` – Team-Band mit Eismaschine im Hintergrund, Kadertafel und Spielerkarte
  (Startseite und `/team/`); Gruppierung/Sortierung in `src/lib/kader.ts`
- `src/components/spiele/` (Nächstes Spiel, Spieltabelle), `src/components/club/` (Erfolge, Eckdaten, Kontakt),
  `Galerie.astro`, `NewsKarte.astro`, `SektionKopf.astro`, `Magnet.astro` (Logo), `Eismaschine.astro`
- `src/lib/logo.ts` – Pfad zum Logo (noch Rasterbild-Platzhalter; beim Vektor-Logo nur hier ändern)
- `src/components/richtext/` – Portable Text (Rich Text) inkl. Bildern
- `functions/api/kontakt.ts` – Cloudflare Pages Function für das Kontaktformular (Versand über Resend)
- `src/pages/` – Routen: `/`, `/news/`, `/news/[slug]`, `/spielplan`, `/spielplan.ics`, `/galerie`,
  `/[...slug]` (weitere Seiten vom Typ `seite`)
- Navigation (`src/lib/navigation.ts`): Menüpunkte springen zu Abschnitten der Startseite (`#news`, `#team`, `#spiele`,
  `#club`, `#kontakt`), dort hebt das Menü den aktuellen Abschnitt hervor. Eigene Unterseiten nur, wo sie mehr zeigen
  (Spielplan, News, Galerie). `/team/`, `/club/`, `/kontakt/`, `/spieler/*` leiten per `public/_redirects` um.

## Konventionen

- Dokumenttypen: `news`, `album` (Galerie), `spieler`, `team`, `spielplan`, `verein` (Club – Allgemein: Eckdaten, Kontakt-E-Mail), `seite`,
  `spiel` (nur Plausch/Turnier; Meisterschaft kommt über `spielplan.sihfUrl`).
  Startseite = `seite` mit Slug `home`.
- Der Club hat **ein** Team. `team` (Teaminfos & Kader), `spielplan` (Einstellungen) und `verein` sind Singletons mit fester
  `_id` = Typname: geöffnet über `studio/structure.ts`, abgesichert in `studio/sanity.config.ts` (`SINGLETONS`:
  keine Vorlage zum Neu-Erstellen, kein Löschen/Duplizieren). Abfragen per `*[_id == "team"][0]`; fehlt das Dokument,
  muss die Website trotzdem bauen.
  «Über uns» auf der Startseite = Inhalt der Seite `home`, Hero-Text = deren Einleitung.
- Team → Spieler ist ein Referenz-Array (`team.spieler`, Reihenfolge = Kader-Reihenfolge). Spieler gehören implizit zum Team.
- Änderung am Content-Modell immer synchron in Schema, GROQ, Typen und Komponenten → Subagent `sanity-schema`.

## Rahmenbedingungen

- Editoren haben **keinen GitHub-Zugang**: Inhalte gehören nach Sanity, nicht ins Repo.
  Keine Bilder/Texte hart codieren, die sich ändern können. Studio-Texte für Nicht-Techniker formulieren.
- Logo nur als originalgetreue Vektordatei verwenden, nie aus Fotos nachbauen (aktuell Platzhalter, `src/lib/logo.ts`).
  Farben = Tokens auf `.d` in `src/styles/site.css` (Trikotfarben Navy/Orange/Sand/Crème).
- Änderungen immer per Branch + Pull Request auf `main` (Branch-Protection ist noch nicht aktiv). Yves merged selbst.
- UI-Texte auf Deutsch (de-CH, «ss» statt «ß»).

## Betrieb & Deployment

- Live (bis Domain umgehängt ist): <https://wintistars.pages.dev>. Cloudflare Pages baut bei jedem Push auf `main`,
  bei Veröffentlichung im Studio (Sanity-Webhook → Deploy-Hook) und per `.github/workflows/rebuild.yml` (täglich).
- Studio: `.github/workflows/studio-deploy.yml` deployt bei Änderungen unter `studio/`. Der Studio-Build liest die
  Root-`tsconfig.json` (erweitert `astro/tsconfigs/strict`) → in CI immer auch `npm ci` im Root.
- Nach Änderungen am Content-Modell prüfen, ob bestehende Dokumente in Sanity migriert werden müssen.

## Hinweise für Agents

- Sanity-Daten lesen/schreiben per CLI aus `studio/` (nutzt Yves' `npx sanity login`):
  `npx sanity documents query --api-version 2026-10-01 '<GROQ>'`, `npx sanity documents create <datei.json> --replace`,
  `npx sanity documents delete <id>`. Schreiben in `production` ist live (Webhook löst Build aus) → vorher mit Yves abklären.
- Browser-Automation im **gehosteten** Studio (wintistars.sanity.studio → läuft im sanity.io-Dashboard-iframe)
  funktioniert nicht zuverlässig. Stattdessen das lokale Studio (`npm run studio`, http://localhost:3333) in Yves' Chrome
  verwenden (Login dort macht Yves) oder die CLI.
- «Mein Browser» = Claude in Chrome (Yves' Chrome mit seinen Logins).
- `.env` ist für Claude per `.claude/settings.json` gesperrt; nicht umgehen. Secrets nie ins Repo oder in Commits.
- Commit-Messages ohne Co-Autor-Trailer (ein lokaler Hook blockiert ihn).
- Zeiten im Spielplan immer über `src/lib/zeit.ts` (Europe/Zurich); der Build-Server läuft in UTC.
