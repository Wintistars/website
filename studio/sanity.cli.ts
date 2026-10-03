import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: { projectId: 'j2uq9efj', dataset: 'production' },
  // Veröffentlicht unter https://wintistars.sanity.studio
  studioHost: 'wintistars',
  deployment: { autoUpdates: true },
});
