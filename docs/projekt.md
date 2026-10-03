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
| Content-Typen | `news`, `spieler`, `team`, `seite` | Schema in `studio/schemaTypes/`. Startseite = `seite` mit Adresse `home`. |
| Code | GitHub-Repo unter einer Club-Organisation, `main` geschützt, Pull Requests | |
| Hosting | **Cloudflare Pages** (Free) – Build `npm run build`, Output `dist` | 500 Builds/Monat. Netlify Free verworfen (nur ca. 20 Deploys/Monat), Vercel Hobby verbietet kommerzielle Nutzung (Sponsoren). |
| Rebuild | Sanity-Webhook (create/update/delete) → Deploy-Hook von Cloudflare Pages | Inhalte gehen ohne Entwickler live. |
| Bilder | Sanity-Bild-CDN (`src/lib/image.ts`, `SanityPicture`) | Keine Bilder im Repo; Grössen/Formate on the fly, Hotspot-Zuschnitt. |
| Firebase | Bewusst **nicht** gewählt | Kein Bedarf an Login oder Echtzeitdaten. |

### Bekannte Kompromisse

- **Sanity Free kennt nur die Rollen Administrator und Viewer**: Editoren sind Administratoren (können
  auch Mitglieder verwalten und Daten löschen). Falls das zum Problem wird: Growth-Plan ($15/Benutzer/Monat)
  mit Rolle «Editor», oder Non-Profit-Plan bei Sanity anfragen.
- Das Projekt startete im 30-tägigen Growth-Trial (bis ca. 2026-11-02); danach Free-Plan prüfen.
- Cloudflare-Konto ist aktuell das persönliche Konto von Yves; für die Übergabe an den Club ggf. später ein Club-Konto.

## Vorgehen / Status

1. [x] Astro-Projekt anlegen (Grundgerüst, Content-Typen, Seitenstruktur)
2. [x] CMS-Wechsel auf Sanity, Studio im Repo
3. [ ] GitHub-Repository (Club-Organisation) anlegen und pushen, `main` schützen
4. [ ] Studio deployen (`npx sanity login`, dann `npm run studio:deploy`)
5. [ ] Cloudflare Pages mit dem Repository verbinden (Framework Astro, `npm run build`, `dist`)
6. [ ] Deploy-Hook von Cloudflare als Sanity-Webhook eintragen (sanity.io/manage → API → Webhooks)
7. [ ] Editoren im Sanity-Projekt einladen; Inhalte von der alten Seite migrieren (Testlauf)
8. [ ] Domain wintistars.ch erst nach Fertigstellung umhängen (DNS-Zugriff vorher klären)

## Offene Punkte

- Spielplan: gibt es eine nutzbare Datenquelle von Swiss Ice Hockey (API/Export)? Bis dahin Platzhalter `/spielplan/`.
- Logo als Vektordatei beschaffen (Original), danach Farben/Design-Tokens in `src/styles/global.css` festlegen.
- Live-Vorschau von Entwürfen (Sanity Presentation/Visual Editing): braucht eine SSR-Vorschau-Umgebung. Noch nicht eingerichtet.
- DNS-Zugriff für wintistars.ch klären.
