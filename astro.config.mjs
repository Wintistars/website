// @ts-check
import { defineConfig } from 'astro/config';
import { storyblok } from '@storyblok/astro';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: 'https://www.wintistars.ch',
  output: 'static',
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_TOKEN ?? '',
      apiOptions: { region: 'eu' },
      // Visual-Editor-Bridge nur lokal; die statische Produktivseite braucht sie nicht.
      bridge: process.env.NODE_ENV !== 'production',
      // Storyblok-Komponentenname -> Astro-Komponente (relativ zu src/)
      components: {
        news: 'storyblok/News',
        spieler: 'storyblok/Spieler',
        team: 'storyblok/Team',
        seite: 'storyblok/Seite',
        text: 'storyblok/Text',
        bild: 'storyblok/Bild',
      },
      enableFallbackComponent: true,
    }),
  ],
  image: {
    domains: ['a.storyblok.com'],
  },
});
