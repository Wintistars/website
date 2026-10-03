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

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Website lokal |
| `npm run build` | Statischer Build nach `dist/` |
| `npm run check` | Typecheck Website |
| `npm run studio` | Sanity Studio lokal |
| `npm run studio:deploy` | Studio nach wintistars.sanity.studio veröffentlichen |

## Deployment

Cloudflare Pages: Framework «Astro», Build-Befehl `npm run build`, Output `dist`. Keine Umgebungsvariablen nötig.
Ein Sanity-Webhook ruft beim Veröffentlichen den Deploy-Hook von Cloudflare auf.

## Content-Modell

Siehe [studio/schemaTypes/](studio/schemaTypes/). Die Startseite zeigt die Seite mit der Adresse `home`.
