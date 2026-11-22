/**
 * Reads the public GitHub profile and its most recently updated repositories.
 * Unauthenticated calls are limited to 60 an hour per visitor, so one result
 * is kept in sessionStorage for ten minutes.
 */
const GITHUB_USER = 'alpaka206';
const API = 'https://api.github.com';
const CACHE_KEY = `github:${GITHUB_USER}`;
export const CACHE_TTL = 10 * 60 * 1000;

export interface Profile {
  login: string;
  name: string | null;
  avatarUrl: string;
  url: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
}

interface Repo {
  id: number;
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  fork: boolean;
  updatedAt: string;
}

export interface Snapshot {
  profile: Profile;
  repos: Repo[];
  savedAt: number;
}

export class GitHubError extends Error {
  /** When the hourly limit resets, if that is why the request failed. */
  readonly resetAt?: Date;
  constructor(message: string, resetAt?: Date) {
    super(message);
    this.resetAt = resetAt;
  }
}

/** The fields the window shows, so the cache stays small. */
const toProfile = (raw: Record<string, unknown>): Profile => ({
  login: String(raw.login),
  name: typeof raw.name === 'string' ? raw.name : null,
  avatarUrl: String(raw.avatar_url),
  url: String(raw.html_url),
  bio: typeof raw.bio === 'string' ? raw.bio : null,
  followers: Number(raw.followers),
  following: Number(raw.following),
  publicRepos: Number(raw.public_repos),
});

const toRepo = (raw: Record<string, unknown>): Repo => ({
  id: Number(raw.id),
  name: String(raw.name),
  url: String(raw.html_url),
  description: typeof raw.description === 'string' ? raw.description : null,
  language: typeof raw.language === 'string' ? raw.language : null,
  stars: Number(raw.stargazers_count),
  fork: raw.fork === true,
  updatedAt: String(raw.pushed_at ?? raw.updated_at),
});

async function get(path: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(`${API}${path}`, { signal, headers: { Accept: 'application/vnd.github+json' } });
  if (response.ok) return response.json();
  const reset = response.headers.get('x-ratelimit-reset');
  if ((response.status === 403 || response.status === 429) && response.headers.get('x-ratelimit-remaining') === '0') {
    throw new GitHubError('rate-limit', reset ? new Date(Number(reset) * 1000) : undefined);
  }
  throw new GitHubError(`http-${response.status}`);
}

export async function fetchSnapshot(signal: AbortSignal, now = Date.now()): Promise<Snapshot> {
  const [user, repos] = await Promise.all([
    get(`/users/${GITHUB_USER}`, signal),
    get(`/users/${GITHUB_USER}/repos?sort=updated&per_page=12`, signal),
  ]);
  return {
    profile: toProfile(user as Record<string, unknown>),
    repos: (repos as Record<string, unknown>[]).map(toRepo),
    savedAt: now,
  };
}

export function readCache(storage: Pick<Storage, 'getItem'>, now: number): Snapshot | null {
  try {
    const snapshot = JSON.parse(storage.getItem(CACHE_KEY) ?? 'null') as Snapshot | null;
    return snapshot && now - snapshot.savedAt < CACHE_TTL ? snapshot : null;
  } catch {
    return null;
  }
}

export function writeCache(storage: Pick<Storage, 'setItem'>, snapshot: Snapshot) {
  try {
    storage.setItem(CACHE_KEY, JSON.stringify(snapshot));
  } catch {
    // Private mode or a full quota: the next visit simply asks GitHub again.
  }
}

/** Colours GitHub (linguist) gives the languages this account uses most. */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  Kotlin: '#a97bff',
  Swift: '#f05138',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#663399',
  SCSS: '#c6538c',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
  Go: '#00add8',
  Rust: '#dea584',
  Dart: '#00b4ab',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  MDX: '#fcb32c',
  'Jupyter Notebook': '#da5b0b',
};

export const languageColor = (language: string) => LANGUAGE_COLORS[language] ?? '#8e8e93';

const numbers = new Intl.NumberFormat('ko-KR');

/** Followers, repositories and stars as Korean GitHub writes them: "1,234". */
export const formatCount = (count: number) => numbers.format(count);

const relative = new Intl.RelativeTimeFormat('ko-KR', { numeric: 'auto' });
const calendar = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

/** "3시간 전", "어제", "12일 전", then a date: how GitHub words "Updated …". */
export function updatedLabel(iso: string, now: number): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ['second', 60],
    ['minute', 60],
    ['hour', 24],
    ['day', 30],
  ];
  let value = seconds;
  for (const [unit, size] of steps) {
    if (Math.abs(value) < size) return `${relative.format(value, unit)} 업데이트`;
    value = Math.round(value / size);
  }
  return `${calendar.format(new Date(iso))} 업데이트`;
}
