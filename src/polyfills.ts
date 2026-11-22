/**
 * The two newer built-ins the site calls, for browsers above the support
 * floor (vite.config.ts) that still lack them: Safari before 17.4 and 18.
 * Drop each one once the floor passes it.
 */

if (!Map.groupBy) {
  Object.defineProperty(Map, 'groupBy', {
    configurable: true,
    writable: true,
    value<K, T>(items: Iterable<T>, key: (item: T, index: number) => K) {
      const groups = new Map<K, T[]>();
      let index = 0;
      for (const item of items) {
        const group = key(item, index++);
        groups.set(group, [...(groups.get(group) ?? []), item]);
      }
      return groups;
    },
  });
}

if (!URL.parse) {
  Object.defineProperty(URL, 'parse', {
    configurable: true,
    writable: true,
    value(url: string | URL, base?: string | URL) {
      try {
        return new URL(url, base);
      } catch {
        return null;
      }
    },
  });
}
