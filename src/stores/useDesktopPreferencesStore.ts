import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { WallpaperId } from './desktopModels';

type DesktopPreferencesState = {
  wallpaperId: WallpaperId;
  soundEnabled: boolean;
  lastBrowserUrl: string | null;
  recentLauncherIds: string[];
  setWallpaper: (wallpaperId: WallpaperId) => void;
  toggleSound: () => void;
  setLastBrowserUrl: (url: string | null) => void;
  recordLauncherUse: (launcherId: string) => void;
  resetPreferences: () => void;
};

const DEFAULT_WALLPAPER: WallpaperId = 'windows-cloud';
const RECENT_LAUNCHER_LIMIT = 6;

export const useDesktopPreferencesStore =
  create<DesktopPreferencesState>()(
    persist(
      (set) => ({
        wallpaperId: DEFAULT_WALLPAPER,
        soundEnabled: false,
        lastBrowserUrl: null,
        recentLauncherIds: [],
        setWallpaper: (wallpaperId) => set({ wallpaperId }),
        toggleSound: () =>
          set((state) => ({ soundEnabled: !state.soundEnabled })),
        setLastBrowserUrl: (url) => set({ lastBrowserUrl: url }),
        recordLauncherUse: (launcherId) =>
          set((state) => ({
            recentLauncherIds: [
              launcherId,
              ...state.recentLauncherIds.filter((id) => id !== launcherId),
            ].slice(0, RECENT_LAUNCHER_LIMIT),
          })),
        resetPreferences: () =>
          set({
            wallpaperId: DEFAULT_WALLPAPER,
            soundEnabled: false,
            lastBrowserUrl: null,
            recentLauncherIds: [],
          }),
      }),
      {
        name: 'desktop_preferences',
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
