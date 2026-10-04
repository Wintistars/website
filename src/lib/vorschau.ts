// Cloudflare Pages setzt beim Build CF_PAGES und CF_PAGES_BRANCH.
// Vorschau-Builds (alle Branches ausser main) zeigen auf der Startseite «Im Aufbau»,
// damit unter der Vorschau-Adresse nur die Design-Entwürfe (/entwurf/) gezeigt werden.
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};

export const IST_VORSCHAU = env.CF_PAGES === '1' && env.CF_PAGES_BRANCH !== 'main';
