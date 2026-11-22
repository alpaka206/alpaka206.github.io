import { useEffect, useState, useSyncExternalStore } from 'react';

/**
 * Real device status for the menu bar and the phone status bar. When the
 * browser does not expose a value, the hooks return null and the icon is not
 * drawn: nothing on screen pretends to know what it does not.
 */
interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
}

export function useBattery() {
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null);
  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    if (!nav.getBattery) return;
    let manager: BatteryManager | undefined;
    let disposed = false;
    const update = () => manager && setBattery({ level: manager.level, charging: manager.charging });
    nav.getBattery().then((m) => {
      if (disposed) return;
      manager = m;
      update();
      m.addEventListener('levelchange', update);
      m.addEventListener('chargingchange', update);
    }, () => undefined);
    return () => {
      disposed = true;
      manager?.removeEventListener('levelchange', update);
      manager?.removeEventListener('chargingchange', update);
    };
  }, []);
  return battery;
}

const subscribeOnline = (notify: () => void) => {
  window.addEventListener('online', notify);
  window.addEventListener('offline', notify);
  return () => {
    window.removeEventListener('online', notify);
    window.removeEventListener('offline', notify);
  };
};

export const useOnline = () => useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);

/** Re-renders once a minute on the minute, for clocks. */
export function useMinute() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setNow(new Date());
        schedule();
      }, 60_000 - (Date.now() % 60_000) + 20);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);
  return now;
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', notify);
      return () => list.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
