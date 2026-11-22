import { useCallback, useMemo, useState } from 'react';
import { readStorage, writeStorage } from '@/lib/storage';
import { HOME_ITEMS, type HomeItem } from './items';

const KEY = 'phone-home-order';
const DEFAULT_ORDER = HOME_ITEMS.map((item) => item.id);
const BY_ID = new Map(HOME_ITEMS.map((item) => [item.id, item]));

/** The saved order, minus ids that no longer exist, plus new items at the end. */
function load(): string[] {
  try {
    const saved: unknown = JSON.parse(readStorage('localStorage', KEY) ?? 'null');
    if (!Array.isArray(saved)) return DEFAULT_ORDER;
    const known = saved.filter((id): id is string => typeof id === 'string' && BY_ID.has(id));
    return [...new Set([...known, ...DEFAULT_ORDER])];
  } catch {
    return DEFAULT_ORDER;
  }
}

/** Home Screen order, remembered on this device (localStorage 'phone-home-order'). */
export function useHomeOrder() {
  const [order, setOrder] = useState(load);
  const save = useCallback((next: string[]) => {
    setOrder(next);
    writeStorage('localStorage', KEY, JSON.stringify(next));
  }, []);
  const reset = useCallback(() => save(DEFAULT_ORDER), [save]);
  const items = useMemo(() => order.map((id) => BY_ID.get(id)).filter((item): item is HomeItem => Boolean(item)), [order]);
  return { order, items, save, reset };
}
