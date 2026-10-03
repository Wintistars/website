# EHC Wintistars – Website

Club-Website des EHC Wintistars (Winterthur). Astro (statisch) + Storyblok (CMS).
Hintergrund, Entscheide und Status: [docs/projekt.md](docs/projekt.md).

## Lokal starten

```bash
nvm use            # Node 22
npm install
cp .env.example .env   # STORYBLOK_TOKEN (Preview-Token) eintragen
npm run dev
```

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Dev-Server, zeigt Storyblok-Entwürfe |
| `npm run build` | Statischer Build nach `dist/` (veröffentlichte Inhalte) |
| `npm run preview` | Build lokal ansehen |
| `npm run check` | Typecheck |

## Deployment

Hosting (Cloudflare Pages oder Netlify): Build-Befehl `npm run build`, Output `dist`,
Umgebungsvariable `STORYBLOK_TOKEN` (Public-Token). Der Storyblok-Webhook «Story published»
ruft den Deploy-Hook des Hostings auf, damit veröffentlichte Inhalte automatisch live gehen.

## Content-Modell

Siehe [storyblok/components.json](storyblok/components.json). Ordner in Storyblok:
`news/`, `teams/`, `spieler/`; allgemeine Seiten im Root, Startseite = Story `home`.
