import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { deDELocale } from '@sanity/locale-de-de';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

// Dokumenttypen, von denen es genau ein Dokument gibt (ID = Typname, siehe structure.ts).
const SINGLETONS = new Set(['team', 'spielplan']);
// Bei Singletons nur Veröffentlichen, Änderungen verwerfen und alte Version wiederherstellen erlauben.
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore']);

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
  schema: {
    types: schemaTypes,
    // Keine «Neu erstellen»-Vorlagen für Singletons.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType) ? actions.filter(({ action }) => action && SINGLETON_ACTIONS.has(action)) : actions,
    newDocumentOptions: (items) => items.filter(({ templateId }) => !SINGLETONS.has(templateId)),
  },
});
