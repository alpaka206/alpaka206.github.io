import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/** A Storage backed by a Map, standing in for the browser's. */
function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, String(value)),
    removeItem: (key) => void map.delete(key),
    clear: () => map.clear(),
    key: (index) => [...map.keys()][index] ?? null,
    get length() {
      return map.size;
    },
  };
}

/** A fresh module is a fresh page load; the stubbed storage survives it, as the browser's would. */
async function load() {
  vi.resetModules();
  const { useSession } = await import('./session');
  useSession.getState().start(false);
  return useSession;
}

describe('session', () => {
  beforeEach(() => vi.stubGlobal('window', { sessionStorage: memoryStorage(), localStorage: memoryStorage() }));
  afterEach(() => vi.unstubAllGlobals());

  it('boots the first time and comes back to where the visitor left on reload', async () => {
    let session = await load();
    expect(session.getState().phase).toBe('boot');
    session.getState().go('desktop');
    session = await load();
    expect(session.getState().phase).toBe('desktop');
    session.getState().go('locked');
    session = await load();
    expect(session.getState().phase).toBe('locked');
  });

  it('starts over after logging out or shutting down', async () => {
    let session = await load();
    session.getState().go('desktop');
    session.getState().go('login');
    session = await load();
    expect(session.getState().phase).toBe('boot');
  });

  it('keeps the current phase when the desktop mounts again', async () => {
    const session = await load();
    session.getState().go('locked');
    session.getState().start(false);
    expect(session.getState().phase).toBe('locked');
  });

  it('still starts when the browser refuses storage', async () => {
    vi.stubGlobal('window', {
      get sessionStorage(): Storage {
        throw new DOMException('blocked', 'SecurityError');
      },
      get localStorage(): Storage {
        throw new DOMException('blocked', 'SecurityError');
      },
    });
    const session = await load();
    expect(session.getState().phase).toBe('boot');
    session.getState().go('desktop');
    expect(session.getState().phase).toBe('desktop');
  });
});
