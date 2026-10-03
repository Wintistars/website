# Projekt: Neue Website EHC Wintistars (Winterthur)

## Ziel

Ersatz der bestehenden Website <https://www.wintistars.ch/> durch eine moderne, schnelle Club-Website.
Vorbild für einen professionellen Auftritt: <https://www.ehc-winterthur.ch>.

## Inhalte

- News
- Spielerporträts und Teamfotos
- Spielplan (wenn möglich automatisch aus der Verbandsquelle – noch zu prüfen)
- Allgemeine Seiten (Club, Kontakt usw.)

## Design-Vorgaben

- Logo muss 1:1 dem Original entsprechen, als saubere **Vektordatei** (nicht aus Fotos ausgeschnitten).
- Trikotfotos dienen nur als Design-Inspiration, nicht als Inhalt.

## Rollen

- **Yves**: Architektur, Code, Betrieb.
- **Andere Clubmitglieder**: pflegen Inhalte im Sanity Studio (Fotos hochladen, News aktualisieren) und
  haben **keinen Zugriff auf GitHub**. Alles, was Editoren tun müssen, muss im Studio möglich sein.

## Architektur-Entscheide

| Thema | Entscheid | Begründung |
| --- | --- | --- |
| Framework | Astro, Static Site Generation, TypeScript strict | Schnell, wenig JS. Ursprünglich Angular geplant; Angular-Komponenten wären als Astro-Islands möglich. |
| CMS | **Sanity** (Free-Plan), Studio unter `studio/`, gehostet auf `wintistars.sanity.studio` | Gratis bis 20 Benutzer, Bild-CDN, Schema im Code. Storyblok verworfen (2026-10-03): Free nur 1 Benutzer, ab 5 Benutzern $99/Monat. |
| Sanity-Projekt | Projekt-ID `j2uq9efj`, Dataset `production` (öffentlich), Organisation `ofwcx1pff` | Öffentliches Dataset: Build braucht keinen Token; Entwürfe bleiben privat. |
| Content-Typen | `news`, `spieler`, `team`, `seite`, `spiel` | Schema in `studio/schemaTypes/`. Startseite = `seite` mit Adresse `home`. |
| Code | GitHub-Repo <https://github.com/Wintistars/website> (Organisation «Wintistars»), `main` geschützt, Pull Requests | |
| Hosting | **Cloudflare Pages** (Free) – Build `npm run build`, Output `dist` | 500 Builds/Monat. Netlify Free verworfen (nur ca. 20 Deploys/Monat), Vercel Hobby verbietet kommerzielle Nutzung (Sponsoren). |
| Rebuild | Sanity-Webhook (create/update/delete) → Deploy-Hook von Cloudflare Pages | Inhalte gehen ohne Entwickler live. |
| Spielplan | Meisterschaft automatisch aus dem CSV-Export des SIHF Game Centers (beim Build, `src/lib/sihf.ts`), Plausch-/Turnierspiele als Sanity-Typ `spiel`; täglicher Rebuild per GitHub Action | Kein Abtippen. Export ist nicht offiziell dokumentiert: Fällt er aus, fehlen nur die Meisterschaftsspiele (Warnung im Build-Log). Zusätzlich Kalender-Abo `/spielplan.ics`. |
| Bilder | Sanity-Bild-CDN (`src/lib/image.ts`, `SanityPicture`) | Keine Bilder im Repo; Grössen/Formate on the fly, Hotspot-Zuschnitt. |
| Firebase | Bewusst **nicht** gewählt | Kein Bedarf an Login oder Echtzeitdaten. |

### Bekannte Kompromisse

- **Sanity Free kennt nur die Rollen Administrator und Viewer**: Editoren sind Administratoren (können
  auch Mitglieder verwalten und Daten löschen). Falls das zum Problem wird: Growth-Plan ($15/Benutzer/Monat)
  mit Rolle «Editor», oder Non-Profit-Plan bei Sanity anfragen.
- Das Projekt startete im 30-tägigen Growth-Trial (bis ca. 2026-11-02); danach Free-Plan prüfen.
- Cloudflare-Konto ist aktuell das persönliche Konto von Yves; langfristig Club-E-Mail-Konto oder zweites Mitglied.

### Eigentum / Zugänge (Empfehlung)

| Dienst | Stand | Empfehlung |
| --- | --- | --- |
| GitHub | Organisation `Wintistars`, Repo `website` | Zweiten Owner (z. B. Vorstand) hinzufügen; altes `SirSiLves/wintistars` archivieren/löschen |
| Sanity | Organisation `ofwcx1pff` von Yves | Zweiten Admin einladen |
| Cloudflare | Persönliches Konto Yves, Pages-Projekt `wintistars` | Später Club-Konto oder zweites Mitglied |
| Domain wintistars.ch | Inhaber unklar | Sollte auf den Club laufen; vor dem Umhängen klären |

## Vorgehen / Status

1. [x] Astro-Projekt anlegen (Grundgerüst, Content-Typen, Seitenstruktur)
2. [x] CMS-Wechsel auf Sanity, Studio im Repo
3. [x] GitHub-Repository Wintistars/website angelegt und gepusht (altes SirSiLves/wintistars abgelöst)
   - [ ] `main` schützen (Branch-Protection)
4. [x] Studio deployen (https://wintistars.sanity.studio) (`npx sanity login`, dann `npm run studio:deploy`)
5. [x] Cloudflare Pages mit dem Repository verbunden (2026-10-03) → <https://wintistars.pages.dev>
   - Cloudflare-Account `fd52f99b603613c078b3bbcf2afb2586` (register@ruosch.me), Pages-Projekt `wintistars`
   - GitHub-App «Cloudflare Workers and Pages» in der Organisation **Wintistars**, Zugriff **nur** auf `website`
   - Production-Branch `main` (jeder Push deployt automatisch), Preset Astro, `npm run build` → `dist`,
     Node 22 aus `.nvmrc`, keine Umgebungsvariablen
6. [x] Rebuild bei Veröffentlichung eingerichtet (2026-10-03)
   - Cloudflare: Deploy-Hook `sanity-publish` (Branch `main`) unter Pages → wintistars → Settings → Builds
   - Sanity: Webhook «Cloudflare Rebuild» (Dataset `production`, Create/Update/Delete, POST, ohne Entwürfe)
   - Die Hook-URL ist geheim (wer sie kennt, kann Builds auslösen) und steht deshalb nicht im Repo.
   - [ ] Ende-zu-Ende testen: Inhalt im Studio veröffentlichen → neuer Deploy in Cloudflare sichtbar
7. [ ] Editoren im Sanity-Projekt einladen; Inhalte von der alten Seite migrieren (Testlauf)
8. [ ] Domain wintistars.ch erst nach Fertigstellung umhängen (DNS-Zugriff vorher klären)

## Offene Punkte

- Spielplan-Rebuild: Secret `CLOUDFLARE_DEPLOY_HOOK` im GitHub-Repo setzen (Wert = Deploy-Hook `sanity-publish`),
  sonst schlägt `.github/workflows/rebuild.yml` fehl. GitHub pausiert geplante Workflows nach 60 Tagen ohne Commits.
- Spielplan: SIHF-Link beim Team im Studio eintragen (`https://www.sihf.ch/de/game-center/team/109-2-710048`).
- Logo als Vektordatei beschaffen (Original), danach Farben/Design-Tokens in `src/styles/global.css` festlegen.
- Live-Vorschau von Entwürfen (Sanity Presentation/Visual Editing): braucht eine SSR-Vorschau-Umgebung. Noch nicht eingerichtet.
- DNS-Zugriff für wintistars.ch klären.
