import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { WallpaperId } from './desktopModels';

type DesktopPreferencesState = {
  wallpaperId: WallpaperId;
  soundEnabled: boolean;
  setWallpaper: (wallpaperId: WallpaperId) => void;
  toggleSound: () => void;
  resetPreferences: () => void;
};

const DEFAULT_WALLPAPER: WallpaperId = 'windows-cloud';

export const useDesktopPreferencesStore =
  create<DesktopPreferencesState>()(
    persist(
      (set) => ({
        wallpaperId: DEFAULT_WALLPAPER,
        soundEnabled: false,
        setWallpaper: (wallpaperId) => set({ wallpaperId }),
        toggleSound: () =>
          set((s) => ({ soundEnabled: !s.soundEnabled })),
        resetPreferences: () =>
          set({
            wallpaperId: DEFAULT_WALLPAPER,
            soundEnabled: false,
          }),
      }),
      {
        name: 'desktop_preferences',
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
