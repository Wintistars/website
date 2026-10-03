# EHC Wintistars – Website

Club-Website des EHC Wintistars (Winterthur). Astro (statisch) + Sanity (CMS) + Cloudflare Pages.
Hintergrund, Entscheide und Status: [docs/projekt.md](docs/projekt.md).

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
[docs/projekt.md → Tokens / Secrets](docs/projekt.md#tokens--secrets).

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
