import { afterEach, describe, expect, it, vi } from 'vitest';
import { CACHE_TTL, fetchSnapshot, GitHubError, languageColor, readCache, updatedLabel, writeCache, type Snapshot } from './api';

const memory = () => {
  const items = new Map<string, string>();
  return { getItem: (key: string) => items.get(key) ?? null, setItem: (key: string, value: string) => void items.set(key, value) };
};

const snapshot: Snapshot = {
  profile: { login: 'alpaka206', name: null, avatarUrl: '', url: '', bio: null, followers: 0, following: 0, publicRepos: 0 },
  repos: [],
  savedAt: 1_000,
};

describe('cache', () => {
  it('serves a snapshot for ten minutes, then asks again', () => {
    const storage = memory();
    writeCache(storage, snapshot);
    expect(readCache(storage, 1_000 + CACHE_TTL - 1)).toEqual(snapshot);
    expect(readCache(storage, 1_000 + CACHE_TTL)).toBeNull();
  });

  it('ignores a damaged entry', () => {
    expect(readCache({ getItem: () => '{oops' }, 0)).toBeNull();
  });
});

describe('fetchSnapshot', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('keeps only the fields the window shows', async () => {
    const user = { login: 'alpaka206', name: '김규원', avatar_url: 'a.png', html_url: 'https://github.com/alpaka206', bio: null, followers: 3, following: 4, public_repos: 5, extra: 'x' };
    const repo = { id: 1, name: 'site', html_url: 'https://github.com/alpaka206/site', description: null, language: 'TypeScript', stargazers_count: 2, fork: false, pushed_at: '2026-11-20T00:00:00Z', updated_at: '2026-11-01T00:00:00Z' };
    vi.stubGlobal('fetch', vi.fn(async (url: string) => Response.json(url.includes('/repos') ? [repo] : user)));
    const result = await fetchSnapshot(new AbortController().signal, 42);
    expect(result).toEqual({
      profile: { login: 'alpaka206', name: '김규원', avatarUrl: 'a.png', url: 'https://github.com/alpaka206', bio: null, followers: 3, following: 4, publicRepos: 5 },
      repos: [{ id: 1, name: 'site', url: 'https://github.com/alpaka206/site', description: null, language: 'TypeScript', stars: 2, fork: false, updatedAt: '2026-11-20T00:00:00Z' }],
      savedAt: 42,
    });
  });

  it('reports the hourly limit with its reset time', async () => {
    const headers = { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1795000000' };
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 403, headers })));
    const error = await fetchSnapshot(new AbortController().signal).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(GitHubError);
    expect((error as GitHubError).message).toBe('rate-limit');
    expect((error as GitHubError).resetAt?.getTime()).toBe(1_795_000_000_000);
  });
});

describe('labels', () => {
  const now = new Date('2026-11-22T12:00:00Z').getTime();

  it('words update times the way GitHub does', () => {
    expect(updatedLabel('2026-11-22T09:00:00Z', now)).toBe('3시간 전 업데이트');
    expect(updatedLabel('2026-11-21T12:00:00Z', now)).toBe('어제 업데이트');
    expect(updatedLabel('2026-11-10T12:00:00Z', now)).toBe('12일 전 업데이트');
    expect(updatedLabel('2026-09-01T12:00:00Z', now)).toBe('2026년 9월 1일 업데이트');
  });

  it('falls back to gray for a language without a colour', () => {
    expect(languageColor('TypeScript')).toBe('#3178c6');
    expect(languageColor('Zig')).toBe('#8e8e93');
  });
});
