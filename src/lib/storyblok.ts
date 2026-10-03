// Zentraler Datenzugriff auf Storyblok. Seiten holen Inhalte nur über diese Funktionen.
import { useStoryblokApi, type ISbStoriesParams, type ISbStoryData } from '@storyblok/astro';
import type { NewsStory, SeiteStory, SpielerStory, TeamStory } from './types';

/** Ordner in Storyblok (full_slug-Präfix) je Content-Typ. */
export const FOLDERS = {
  news: 'news/',
  team: 'teams/',
  spieler: 'spieler/',
} as const;

export const HOME_SLUG = 'home';

const version: 'draft' | 'published' =
  import.meta.env.STORYBLOK_VERSION ?? (import.meta.env.DEV ? 'draft' : 'published');

function api() {
  if (!import.meta.env.STORYBLOK_TOKEN) {
    throw new Error('STORYBLOK_TOKEN fehlt. Siehe .env.example bzw. Umgebungsvariablen des Hostings.');
  }
  return useStoryblokApi();
}

/** Der Storyblok-Client wirft Plain-Objects; für lesbare Build-Fehler in Error umwandeln. */
function toError(err: unknown, what: string): Error {
  if (err instanceof Error) return err;
  const { status, message } = (err ?? {}) as { status?: number; message?: string };
  const e = new Error(`Storyblok ${what}: ${status ?? '?'} ${message ?? ''}`.trim());
  (e as Error & { status?: number }).status = status;
  return e;
}

async function getAll<S extends ISbStoryData>(params: ISbStoriesParams): Promise<S[]> {
  try {
    return (await api().getAll('cdn/stories', { version, ...params })) as S[];
  } catch (err) {
    throw toError(err, `cdn/stories (${params.content_type ?? 'alle'})`);
  }
}

async function getOne<S extends ISbStoryData>(slug: string, params: ISbStoriesParams = {}): Promise<S> {
  try {
    const { data } = await api().get(`cdn/stories/${slug}`, { version, ...params });
    return data.story as S;
  } catch (err) {
    throw toError(err, `cdn/stories/${slug}`);
  }
}

export async function getNews(limit?: number): Promise<NewsStory[]> {
  const params: ISbStoriesParams = {
    content_type: 'news',
    starts_with: FOLDERS.news,
    sort_by: 'content.datum:desc',
  };
  if (limit) {
    // getAll paginiert immer komplett; für "die neusten N" reicht eine Seite.
    try {
      const { data } = await api().get('cdn/stories', { version, ...params, per_page: limit });
      return data.stories as NewsStory[];
    } catch (err) {
      throw toError(err, 'cdn/stories (news)');
    }
  }
  return getAll<NewsStory>(params);
}

export function getTeams(): Promise<TeamStory[]> {
  return getAll<TeamStory>({
    content_type: 'team',
    starts_with: FOLDERS.team,
    sort_by: 'position:asc',
    resolve_relations: 'team.spieler',
  });
}

export function getSpieler(): Promise<SpielerStory[]> {
  return getAll<SpielerStory>({ content_type: 'spieler', starts_with: FOLDERS.spieler });
}

/** Alle allgemeinen Seiten ausser der Startseite. */
export async function getSeiten(): Promise<SeiteStory[]> {
  const seiten = await getAll<SeiteStory>({ content_type: 'seite' });
  return seiten.filter((s) => s.full_slug !== HOME_SLUG);
}

export async function getHome(): Promise<SeiteStory | null> {
  try {
    return await getOne<SeiteStory>(HOME_SLUG);
  } catch (err) {
    // Startseite ist optional (Fallback rendert nur die News); andere Fehler weiterwerfen.
    if ((err as { status?: number }).status === 404) return null;
    throw err;
  }
}

/** Teams, in denen ein Spieler geführt wird. */
export function teamsVonSpieler(spieler: SpielerStory, teams: TeamStory[]): TeamStory[] {
  return teams.filter((t) =>
    (t.content.spieler ?? []).some((s) => (typeof s === 'string' ? s : s.uuid) === spieler.uuid),
  );
}
