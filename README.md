# EHC Wintistars – Website

Club-Website des EHC Wintistars (Winterthur). Astro (statisch) + Sanity (CMS) + Cloudflare Pages.
Hintergrund, Entscheide und Status: [docs/projekt.md](docs/projekt.md).

Live (Vorschau-Domain): <https://wintistars.pages.dev> · Studio für Editoren: <https://wintistars.sanity.studio>

## Aufbau

```text
 Editoren ──► Sanity Studio (wintistars.sanity.studio) ──► Sanity (Inhalte, Bilder)
                                    │ Veröffentlichen → Webhook
                                    ▼
 GitHub (Code) ──Push auf main──► Cloudflare Pages ──Build──► wintistars.pages.dev (später wintistars.ch)
   │ GitHub Actions: täglicher Rebuild,                ▲
   │ Studio-Deploy                                     │ Spielplan (CSV-Export, kein Konto)
   └───────────────────────────────────────────────────┘ Swiss Ice Hockey (sihf.ch)

 Besucher ──Kontaktformular──► Cloudflare Pages Function ──► E-Mail an den Club
 Domain wintistars.ch: heute bei Wix (inkl. DNS), alte Website läuft dort bis zum Go-live
```

## Systeme und Konten

Hier steht, **welches Konto** welches System besitzt – **nie Passwörter**. Bei jedem Wechsel (neuer Admin, Login umgestellt,
Dienst gekündigt) diese Tabelle im selben Pull Request nachführen.

| System | Wofür | Verwaltung | Konto / Login | Admins | Kosten | Stand |
| --- | --- | --- | --- | --- | --- | --- |
| **GitHub** | Code, Pull Requests, Actions (Rebuild, Studio-Deploy) | <https://github.com/Wintistars> → Repo `website` | Organisation `Wintistars` | `SirSiLves` (Yves) | 0 | ✅ |
| **Cloudflare Pages** | Website hosten, Build, Kontaktformular-Function | <https://dash.cloudflare.com> → Workers & Pages → `wintistars` | Account `fd52f99b603613c078b3bbcf2afb2586`, Login `register@ruosch.me` (Yves, persönlich) | Yves | 0 | ✅ |
| **Sanity** | CMS: Inhalte, Bilder, Studio | <https://www.sanity.io/manage> → Projekt `j2uq9efj` (Organisation `ofwcx1pff`) | Login `register@ruosch.me` (Yves, persönlich) | Yves | 0 (Free; Growth-Trial bis ca. 2026-11-02) | ✅ |
| **Wix** | Alte Website, Domain `wintistars.ch` inkl. DNS, altes Postfach | <https://manage.wix.com> → Website «ehcwintistars» | Login: _zu ergänzen_ | Yves hat Zugriff, weitere: _zu ergänzen_ | ca. 200 CHF/Jahr | Wird nach dem Go-live gekündigt |
| **Google Workspace for Nonprofits** | E-Mail `info@wintistars.ch` (gemeinsame Inbox), Kontaktformular-Versand | <https://admin.google.com> | Antrag mit neutralem Google-Konto (_zu ergänzen_), danach `info@wintistars.ch` | _zu ergänzen_ | 0 | Geplant, Statuten werden besorgt |
| **Domain-Registrar** (nach Wix) | `wintistars.ch` | _zu ergänzen_ (z. B. Infomaniak, Hostpoint) | Club-Konto `info@wintistars.ch` | – | ca. 15–20 CHF/Jahr | Geplant |
| **Swiss Ice Hockey** | Spielplan Meisterschaft (öffentlicher CSV-Export) | Link in Studio → Spielplan → Einstellungen | Kein Konto nötig | – | 0 | ✅ |

**Ziel:** Alle Konten laufen auf das Club-Konto `info@wintistars.ch` (Login per «Mit Google anmelden»), und jedes System
hat mindestens **zwei Admins** (Yves + jemand vom Vorstand). Sobald `info@` existiert, die Logins von Sanity, Cloudflare
und GitHub umstellen und die Tabelle nachführen.

**Passwörter** gehören nicht ins Repo. Ablage: _noch offen_ – Empfehlung: Passwortmanager mit gemeinsamem Club-Tresor
(z. B. Bitwarden-Organisation), auf den mindestens zwei Personen Zugriff haben.

### Tokens, Secrets, Hooks

Werte stehen nie im Repo. Website-Build und `npm run dev` brauchen keine davon.

| Name | Wo gespeichert | Rechte | Wofür |
| --- | --- | --- | --- |
| `SANITY_AUTH_TOKEN` (Token «Local Development») | Lokal in `.env` im Repo-Root (Vorlage `.env.example`) | Alle Rollen | Lokale Skripte/CLI (`set -a; source .env; set +a`) |
| `SANITY_AUTH_TOKEN` (Token «GitHub Actions – Studio deploy») | GitHub → Repo `website` → Settings → Secrets | Nur «Deploy Studio» | `.github/workflows/studio-deploy.yml` |
| `CLOUDFLARE_DEPLOY_HOOK` | GitHub → Repo `website` → Settings → Secrets | Löst nur einen Build aus | `.github/workflows/rebuild.yml` (täglicher Rebuild) |
| Deploy-Hook `sanity-publish` | Cloudflare → Pages → `wintistars` → Settings → Builds | Löst nur einen Build aus | Ziel des Sanity-Webhooks |
| Sanity-Webhook «Cloudflare Rebuild» | sanity.io/manage → Projekt → API → Webhooks | – | Rebuild bei Veröffentlichung im Studio |
| GitHub-App «Cloudflare Workers and Pages» | GitHub → Organisation `Wintistars` → Settings → GitHub Apps | Nur Repo `website` | Cloudflare liest den Code |
| `RESEND_API_KEY`, `KONTAKT_AN`, `KONTAKT_VON` | Cloudflare → Pages → `wintistars` → Settings → Variables and Secrets | Senden über Resend | Kontaktformular – nicht gesetzt, entfällt mit Umstellung auf Google Apps Script |

Tokens verwalten/widerrufen: sanity.io/manage → Projekt → API → Tokens. Den lokalen Token mit allen Rollen nie als
GitHub-Secret verwenden. Die Hook-URLs sind geheim (wer sie kennt, kann Builds auslösen).

## Lokal starten

```bash
nvm use                     # Node 22
npm install
npm --prefix studio install
npm run dev                 # Website: http://localhost:4321
npm run studio              # Studio:  http://localhost:3333
```

Optional für lokale Skripte/CLI mit Schreibrechten in Sanity: `cp .env.example .env` und `SANITY_AUTH_TOKEN` eintragen
(Token aus sanity.io/manage → API → Tokens). `.env` wird nie committet. Übersicht aller Tokens/Secrets:
[Tokens, Secrets, Hooks](#tokens-secrets-hooks).

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Website lokal |
| `npm run build` | Statischer Build nach `dist/` |
| `npm run check` | Typecheck Website |
| `npm run studio` | Sanity Studio lokal |
| `npm run studio:deploy` | Studio manuell nach wintistars.sanity.studio veröffentlichen |

## Deployment

- **Website:** Cloudflare Pages baut bei jedem Push auf `main` (Framework «Astro», `npm run build`, Output `dist`,
  keine Umgebungsvariablen). Zusätzlich ruft ein Sanity-Webhook beim Veröffentlichen den Deploy-Hook auf, und
  `.github/workflows/rebuild.yml` baut täglich neu (Spielplan/Resultate von Swiss Ice Hockey).
- **Studio:** `.github/workflows/studio-deploy.yml` deployt bei Änderungen unter `studio/` auf `main`.
- GitHub-Secrets: `SANITY_AUTH_TOKEN` (nur Rolle «Deploy Studio»), `CLOUDFLARE_DEPLOY_HOOK`.

## Content-Modell

Siehe [studio/schemaTypes/](studio/schemaTypes/). Die Startseite zeigt die Seite mit der Adresse `home`.
Der Club hat ein Team: «Teaminfos & Kader» (`team`, Seite `/team/`) und «Spielplan – Einstellungen» (`spielplan`,
SIHF-Link für die Meisterschaftsspiele) gibt es im Studio je genau einmal.
