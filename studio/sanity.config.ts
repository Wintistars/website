import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { deDELocale } from '@sanity/locale-de-de';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

export default defineConfig({
  name: 'default',
  title: 'EHC Wintistars',
  projectId: 'j2uq9efj',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    deDELocale(),
    // GROQ-Abfragen testen; nur für Admins sinnvoll, schadet Editoren aber nicht.
    visionTool({ defaultApiVersion: '2026-10-01' }),
  ],
  schema: { types: schemaTypes },
});
