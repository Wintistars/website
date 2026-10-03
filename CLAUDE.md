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
- `src/lib/sanity.ts` – Sanity-Client und alle GROQ-Abfragen (`getNews`, `getTeams`, `getSpieler`, `getSeiten`, `getHome`, `getSpiele`, `getSihfQuellen`)
- `src/lib/sihf.ts` + `src/lib/spielplan.ts` – Spielplan: SIHF-Export (Meisterschaft) + Sanity-Spiele; Zeiten immer über `src/lib/zeit.ts` (Europe/Zurich)
- `src/lib/types.ts` – TS-Typen passend zu den GROQ-Projektionen
- `src/lib/image.ts` + `src/components/SanityPicture.astro` – Bilder über das Sanity-Bild-CDN
- `src/components/richtext/` – Portable Text (Rich Text) inkl. Bildern
- `src/components/content/` – Darstellung je Dokumenttyp
- `src/pages/` – Routen: `/`, `/news/[slug]`, `/teams/[slug]`, `/spieler/[slug]`, `/spielplan`, `/spielplan.ics`, `/[...slug]` (Typ `seite`)

## Konventionen

- Dokumenttypen: `news`, `spieler`, `team`, `seite`, `spiel` (nur Plausch/Turnier; Meisterschaft kommt über `team.sihfUrl`). Startseite = `seite` mit Slug `home`.
  Navigation (`src/lib/navigation.ts`) verlinkt `/club/` und `/kontakt/` → dafür braucht es Seiten mit diesen Slugs.
- Team → Spieler ist ein Referenz-Array (`team.spieler`, Reihenfolge = Kader-Reihenfolge).
- Änderung am Content-Modell immer synchron in Schema, GROQ, Typen und Komponenten → Subagent `sanity-schema`.

## Rahmenbedingungen

- Editoren haben **keinen GitHub-Zugang**: Inhalte gehören nach Sanity, nicht ins Repo.
  Keine Bilder/Texte hart codieren, die sich ändern können. Studio-Texte für Nicht-Techniker formulieren.
- Logo nur als originalgetreue Vektordatei verwenden, nie aus Fotos nachbauen.
  Farben in `src/styles/global.css` sind Platzhalter, bis Logo/Trikotfarben definitiv sind.
- `main` ist geschützt: Änderungen per Branch + Pull Request.
- UI-Texte auf Deutsch (de-CH, «ss» statt «ß»).
