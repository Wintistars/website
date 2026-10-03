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
- **Andere Clubmitglieder**: pflegen Inhalte in Storyblok (Fotos hochladen, News aktualisieren) und
  haben **keinen Zugriff auf GitHub**. Alles, was Editoren tun müssen, muss in Storyblok möglich sein.

## Architektur-Entscheide

| Thema | Entscheid | Begründung |
| --- | --- | --- |
| Framework | Astro, Static Site Generation, TypeScript strict | Schnell, wenig JS. Ursprünglich Angular geplant; Angular-Komponenten wären als Astro-Islands möglich. |
| CMS | Storyblok (Headless) | Editoren mit eigenen Logins und eingeschränkten Rollen, Visual Editor. Anbindung via `@storyblok/astro`, Token als Umgebungsvariable. |
| Content-Typen | `news`, `spieler`, `team`, `seite` (+ Blöcke `text`, `bild`) | Schema in `storyblok/components.json`. |
| Code | GitHub-Repo unter einer Club-Organisation, `main` geschützt, Pull Requests | |
| Hosting | Cloudflare Pages **oder** Netlify (noch offen) – Build `npm run build`, Output `dist` | Beide gratis für statische Seiten. |
| Rebuild | Storyblok-Webhook «Story published» → Deploy-Hook des Hostings | Inhalte gehen ohne Entwickler live. |
| Bilder | Storyblok-Bild-CDN (`src/lib/image.ts`, `SbPicture`) | Keine Bilder im Repo; Grössen/WebP on the fly. |
| Firebase | Bewusst **nicht** gewählt | Kein Bedarf an Login oder Echtzeitdaten. |

## Vorgehen / Status

1. [x] Astro-Projekt anlegen (Grundgerüst mit Storyblok-Anbindung, Content-Typen, Seitenstruktur)
2. [ ] GitHub-Repository (Club-Organisation) anlegen und pushen, `main` schützen
3. [ ] Hosting mit dem Repository verbinden, `STORYBLOK_TOKEN` setzen
4. [ ] Storyblok-Space anlegen (Region EU), Content-Typen gemäss `storyblok/components.json`, Ordner `news/`, `teams/`, `spieler/`, Story `home` (Typ `seite`), Editor-Rollen
5. [ ] Deploy-Hook des Hostings als Storyblok-Webhook «Story published» eintragen
6. [ ] Inhalte von der alten Seite migrieren (Testlauf durch die Editoren)
7. [ ] Domain wintistars.ch erst nach Fertigstellung umhängen (DNS-Zugriff vorher klären)

## Offene Punkte

- Hosting: Cloudflare Pages oder Netlify?
- Spielplan: gibt es eine nutzbare Datenquelle von Swiss Ice Hockey (API/Export)? Bis dahin Platzhalter `/spielplan/`.
- Logo als Vektordatei beschaffen (Original), danach Farben/Design-Tokens in `src/styles/global.css` festlegen.
- Visual Editor (Live-Vorschau beim Bearbeiten): braucht eine Vorschau-Umgebung (Dev-Server mit HTTPS oder SSR-Preview-Deploy). Noch nicht eingerichtet.
- DNS-Zugriff für wintistars.ch klären.
