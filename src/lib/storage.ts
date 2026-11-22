type Area = 'localStorage' | 'sessionStorage';

/**
 * Web Storage that never throws. Blocked site data throws on mere access,
 * private modes and full quotas throw on writes: all of them just mean
 * "nothing remembered", never a page that fails to start.
 */
export function storageArea(area: Area): Storage | null {
  try {
    return window[area];
  } catch {
    return null;
  }
}

export function readStorage(area: Area, key: string): string | null {
  try {
    return storageArea(area)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

/** `null` removes the key. */
export function writeStorage(area: Area, key: string, value: string | null) {
  try {
    const storage = storageArea(area);
    if (value === null) storage?.removeItem(key);
    else storage?.setItem(key, value);
  } catch {
    // Not remembered; everything else keeps working.
  }
}
