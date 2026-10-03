// @ts-check
import { defineConfig } from 'astro/config';

// Inhalte kommen zur Build-Zeit aus Sanity (src/lib/sanity.ts); keine Integration nötig.
// https://astro.build/config
export default defineConfig({
  site: 'https://www.wintistars.ch',
  output: 'static',
});
