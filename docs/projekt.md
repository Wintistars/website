# Projekt: Neue Website EHC Wintistars (Winterthur)

## Ziel

Ersatz der bestehenden Website <https://www.wintistars.ch/> durch eine moderne, schnelle Club-Website.
Vorbild für einen professionellen Auftritt: <https://www.ehc-winterthur.ch>.

## Inhalte

- News
- Spielerporträts und Teamfotos
- Spielplan: Meisterschaft automatisch von Swiss Ice Hockey, Plausch-/Turnierspiele im Studio (umgesetzt)
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
| Content-Typen | `news`, `album`, `spieler`, `team`, `spielplan`, `verein`, `seite`, `spiel` | Schema in `studio/schemaTypes/`. Startseite = `seite` mit Adresse `home`. Ein Team: `team` (Teaminfos & Kader), `spielplan` (SIHF-Link) und `verein` (Club – Allgemein: Eckdaten, Kontakt-E-Mail) sind Singletons, Seite `/team/`. `album` = Galerie-Album (Fotos). Struktur ist vorläufig und kann sich mit dem Design noch ändern. |
| Code | GitHub-Repo <https://github.com/Wintistars/website> (Organisation «Wintistars»), `main` geschützt, Pull Requests | |
| Hosting | **Cloudflare Pages** (Free) – Build `npm run build`, Output `dist` | 500 Builds/Monat. Netlify Free verworfen (nur ca. 20 Deploys/Monat), Vercel Hobby verbietet kommerzielle Nutzung (Sponsoren). |
| Rebuild | Sanity-Webhook (create/update/delete) → Deploy-Hook von Cloudflare Pages; zusätzlich GitHub Action `rebuild.yml` täglich 04:00 UTC und Mo 22:45 UTC | Inhalte gehen ohne Entwickler live; SIHF-Resultate kommen ohne Webhook. |
| Studio-Deploy | GitHub Action `studio-deploy.yml` bei Änderungen unter `studio/` auf `main` | Editoren sehen neue Felder ohne manuellen Deploy. CI installiert auch die Root-Pakete (der Studio-Build liest die Root-`tsconfig`). |
| Spielplan | Meisterschaft automatisch aus dem CSV-Export des SIHF Game Centers (beim Build, `src/lib/sihf.ts`), Plausch-/Turnierspiele als Sanity-Typ `spiel`; täglicher Rebuild per GitHub Action | Kein Abtippen. Export ist nicht offiziell dokumentiert: Fällt er aus, fehlen nur die Meisterschaftsspiele (Warnung im Build-Log). Zusätzlich Kalender-Abo `/spielplan.ics`. |
| Bilder | Sanity-Bild-CDN (`src/lib/image.ts`, `SanityPicture`) | Keine Bilder im Repo; Grössen/Formate on the fly, Hotspot-Zuschnitt. |
| Firebase | Bewusst **nicht** gewählt | Kein Bedarf an Login oder Echtzeitdaten. |
| E-Mail / Postfach | **Bestehendes GMX-Konto `ehcwintistars@gmx.ch`** (FreeMail) als Club-Postfach; `info@wintistars.ch` wird nach dem DNS-Umzug per Cloudflare Email Routing (gratis) dorthin weitergeleitet | Postfach ist seit Jahren in Gebrauch (Ordner, Anfragen, Formular der Wix-Website), gratis, kein Antrag nötig. Antworten kommen von `ehcwintistars@gmx.ch`. Google Workspace for Nonprofits verworfen (2026-11-03): Antrag unsicher. Entschieden 2026-11-03 (ersetzt Entscheid vom 2026-10-05). Ausweichlösung, falls GMX nicht reicht: Zoho Mail Free oder Postfach beim Schweizer Registrar – Besucher sehen weiterhin nur `info@`. |
| Wix | Wird **gekündigt**, sobald die neue Website live ist (heute ca. 200 CHF/Jahr) | Wix als CMS verworfen (2026-10-05): kostet weiter, spart keinen Dienst. Mail «bei Wix» wäre kostenpflichtiges Google Workspace. Das Wix-Kontaktformular liefert heute an `ehcwintistars@gmx.ch`. |
| Domain | `.ch` zu einem Schweizer Registrar (z. B. Infomaniak, Hostpoint, ca. 15–20 CHF/Jahr), DNS bei Cloudflare (gratis) | Cloudflare Registrar unterstützt `.ch` nicht. |

### Bekannte Kompromisse

- **Sanity Free kennt nur die Rollen Administrator und Viewer**: Editoren sind Administratoren (können
  auch Mitglieder verwalten und Daten löschen). Falls das zum Problem wird: Growth-Plan ($15/Benutzer/Monat)
  mit Rolle «Editor», oder Non-Profit-Plan bei Sanity anfragen.
- Das Projekt startete im 30-tägigen Growth-Trial (bis ca. 2026-11-02); danach Free-Plan prüfen.
- Cloudflare- und Sanity-Konto sind aktuell persönliche Konten von Yves; Umstellung auf das Club-Konto `ehcwintistars@gmx.ch` geplant.
- GMX FreeMail: gemeinsames Passwort (keine Delegation), 1 GB Speicher, Werbung. Inaktive Gratis-Konten können gelöscht
  werden → regelmässig einloggen.

- Die Kontakt-E-Mail steht nicht im HTML (Schutz vor Spam-Sammlern): `src/components/EmailLink.astro` setzt sie erst im
  Browser per JavaScript ein. Ohne JavaScript zeigt der Link «E-Mail» und führt zum Kontaktformular.

### Konten, Zugänge, Tokens

Siehe [README → Systeme und Konten](../README.md#systeme-und-konten) (einzige Quelle; dort nachführen).

## Vorgehen / Status

1. [x] Astro-Projekt anlegen (Grundgerüst, Content-Typen, Seitenstruktur)
2. [x] CMS-Wechsel auf Sanity, Studio im Repo
3. [x] GitHub-Repository Wintistars/website angelegt und gepusht (altes SirSiLves/wintistars abgelöst)
   - [ ] `main` schützen (Branch-Protection)
4. [x] Studio deployen (https://wintistars.sanity.studio) – seit 2026-10-03 automatisch per GitHub Action
5. [x] Cloudflare Pages mit dem Repository verbunden (2026-10-03) → <https://wintistars.pages.dev>
   - Cloudflare-Account `fd52f99b603613c078b3bbcf2afb2586` (register@ruosch.me), Pages-Projekt `wintistars`
   - GitHub-App «Cloudflare Workers and Pages» in der Organisation **Wintistars**, Zugriff **nur** auf `website`
   - Production-Branch `main` (jeder Push deployt automatisch), Preset Astro, `npm run build` → `dist`,
     Node 22 aus `.nvmrc`, keine Umgebungsvariablen
6. [x] Rebuild bei Veröffentlichung eingerichtet (2026-10-03)
   - Cloudflare: Deploy-Hook `sanity-publish` (Branch `main`) unter Pages → wintistars → Settings → Builds
   - Sanity: Webhook «Cloudflare Rebuild» (Dataset `production`, Create/Update/Delete, POST, ohne Entwürfe)
   - Die Hook-URL ist geheim (wer sie kennt, kann Builds auslösen) und steht deshalb nicht im Repo.
   - [x] Ende-zu-Ende getestet: Veröffentlichen im Studio → neuer Cloudflare-Build, Inhalte live
7. [x] Spielplan (2026-10-03): SIHF-Import + Plauschspiele, `/spielplan/`, `/spielplan.ics`, täglicher Rebuild
   - SIHF-Quelle: Studio → Spielplan → Einstellungen = `https://www.sihf.ch/de/game-center/team/109-2-710048`
     (Conte Hockey Cup A, Region Ostschweiz). Zu Saisonbeginn prüfen, ob Link/Liga noch stimmen.
8. [x] Ein Team statt Teams (2026-10-03): Singletons `team` und `spielplan`, Seite `/team/`
9. [x] Inhalte erfassen (2026-10-05; Fotos folgen 2027)
   - [x] Spieler (29) und Kader importiert (2026-10-04, aus der Spielerliste; ohne die 6 Einträge mit unvollständigem
     Namen: Kevin H, Markus, Curdin, Pascal, Dennis, Raffi). Ohne Nummer: Luca Pivetta, Alex Wibner, Robin Gisler,
     Cristian Peralba, Brian Bollhalder; ohne Position (Gruppe «Weitere»): Robin Gisler, Cristian Peralba, Brian Bollhalder
   - [x] Startseite (`home`: Einleitung, Über uns), Erfolge, «Club – Allgemein» (Eckdaten), Album «Archiv» (5 Fotos der alten Website)
   - [x] Erste News (2), Kontakt-E-Mail in «Club – Allgemein» (Postfach siehe Punkt 12)
   - [x] Plauschspiele (16) und Abschlussturnier der Saison 2026/27 von <https://www.wintistars.ch/spielplan> übernommen
   - Seiten `club` und `kontakt` entfallen: seit dem Design «Taktiktafel» Abschnitte der Startseite (`#club`, `#kontakt`)
   - [ ] Teamfoto und Spielerporträts (erst 2027, bis dahin Platzhalter)
10. [ ] Editoren im Sanity-Projekt einladen
11. [x] Design: Entwurf B «Taktiktafel» gewählt und umgesetzt (2026-10-04), Entwürfe A/C entfernt
   - [ ] Logo als Vektordatei (aktuell Rasterbild-Platzhalter `public/logo-platzhalter.webp`)
   - [ ] Kontaktformular aktivieren: Versand über Resend (Code vorhanden), Empfänger `KONTAKT_AN` = `ehcwintistars@gmx.ch`.
     Braucht eine bei Resend verifizierte Domain → nach dem DNS-Umzug (Punkt 13). Bis dahin zeigt das Formular bei Fehlern
     die Kontakt-E-Mail aus «Club – Allgemein» an.
12. [ ] E-Mail (Entscheid 2026-11-03: GMX `ehcwintistars@gmx.ch`)
   - Stand 2026-11-03 (geprüft im Postfach): 103 Mails mit Ordnern, Wix-Kontaktformular liefert hierhin; Kontoinhaber und
     Absendername Michael Holzer, Wiederherstellung nur über seine private Hotmail-Adresse, keine Mobilnummer,
     Zwei-Faktor aus, Passwort von 2017, POP3/IMAP aus, keine Weiterleitungen oder Filterregeln
   - [ ] Mit Michael klären: Konto gehört dem Club; Wiederherstellungs-Adresse/-Nummer auf Club-Kontrolle umstellen
   - [ ] Neues Passwort setzen, im Club-Passwortmanager ablegen (siehe README)
   - [ ] Absendername auf «EHC Wintistars» ändern; POP3/IMAP aktivieren für alle, die das Postfach lesen
   - [ ] Sofort: Kontakt-E-Mail in Studio → «Club – Allgemein» auf `ehcwintistars@gmx.ch` setzen
     (`info@wintistars.ch` hat noch keine MX-Einträge, Mail dorthin kommt nicht an)
   - [ ] Nach dem DNS-Umzug: Cloudflare Email Routing `info@wintistars.ch` → `ehcwintistars@gmx.ch`, dann Kontakt-E-Mail
     wieder auf `info@` umstellen
   - [ ] Logins von Sanity, Cloudflare, GitHub auf `ehcwintistars@gmx.ch` umstellen
13. [ ] Go-live und Wix-Ausstieg
   - [ ] Domain zu Schweizer Registrar transferieren, DNS zu Cloudflare, Website auf Cloudflare Pages umhängen
     (danach Email Routing für `info@` einrichten, siehe Punkt 12)
   - [ ] Wix kündigen

## Offene Punkte

- `main` ist noch **nicht** geschützt (Branch-Protection fehlt, Stand 2026-10-03). Trotzdem immer Branch + PR.
- GitHub pausiert geplante Workflows (`rebuild.yml`) nach 60 Tagen ohne Commits → dann in Actions wieder aktivieren.
- SIHF-Export ist nicht offiziell dokumentiert; bei Formatänderung `src/lib/sihf.ts` anpassen (Build-Log zeigt `[sihf]`-Warnung).
- Logo als Vektordatei beschaffen (Original), danach Farben/Design-Tokens in `src/styles/global.css` festlegen.
- Live-Vorschau von Entwürfen (Sanity Presentation/Visual Editing): braucht eine SSR-Vorschau-Umgebung. Noch nicht eingerichtet.
