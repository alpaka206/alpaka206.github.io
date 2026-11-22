import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Appearance = 'auto' | 'light' | 'dark';

export const APPEARANCES: Record<Appearance, string> = { auto: '자동', light: '라이트', dark: '다크' };
export type Accent = 'blue' | 'pink' | 'red' | 'orange' | 'yellow' | 'green' | 'graphite';
export type WallpaperId = 'glass' | 'glass-light' | 'glass-dark' | 'ridge';

export const ACCENTS: Record<Accent, { label: string; light: string; dark: string }> = {
  blue: { label: '파란색', light: '#007aff', dark: '#0a84ff' },
  pink: { label: '분홍색', light: '#ff2d55', dark: '#ff375f' },
  red: { label: '빨간색', light: '#ff3b30', dark: '#ff453a' },
  orange: { label: '주황색', light: '#ff9500', dark: '#ff9f0a' },
  yellow: { label: '노란색', light: '#ffcc00', dark: '#ffd60a' },
  green: { label: '초록색', light: '#28cd41', dark: '#32d74b' },
  graphite: { label: '그래파이트', light: '#8e8e93', dark: '#98989d' },
};

/** `glass` follows the appearance (light wallpaper by day, dark by night). */
export const WALLPAPERS: Record<WallpaperId, { label: string; light: string; dark: string; portraitLight: string; portraitDark: string }> = {
  glass: {
    label: '유리 물결',
    light: 'wallpapers/glass-light',
    dark: 'wallpapers/glass-dark',
    portraitLight: 'wallpapers/glass-light-portrait',
    portraitDark: 'wallpapers/glass-dark-portrait',
  },
  'glass-light': {
    label: '유리 물결, 낮',
    light: 'wallpapers/glass-light',
    dark: 'wallpapers/glass-light',
    portraitLight: 'wallpapers/glass-light-portrait',
    portraitDark: 'wallpapers/glass-light-portrait',
  },
  'glass-dark': {
    label: '유리 물결, 밤',
    light: 'wallpapers/glass-dark',
    dark: 'wallpapers/glass-dark',
    portraitLight: 'wallpapers/glass-dark-portrait',
    portraitDark: 'wallpapers/glass-dark-portrait',
  },
  ridge: {
    label: '능선, 새벽',
    light: 'wallpapers/ridge-dawn',
    dark: 'wallpapers/ridge-dawn',
    portraitLight: 'wallpapers/glass-light-portrait',
    portraitDark: 'wallpapers/glass-dark-portrait',
  },
};

export interface Settings {
  appearance: Appearance;
  accent: Accent;
  wallpaper: WallpaperId;
  /** null follows the operating system (prefers-reduced-motion / -transparency). */
  reduceMotion: boolean | null;
  reduceTransparency: boolean | null;
  sound: boolean;
  /** 0..1, UI sound effects only. */
  volume: number;
  /** 0.3..1, dims the screen with an overlay. */
  brightness: number;
  dockMagnification: boolean;
  /** Dock tile size in pt (macOS `tilesize`); the Dock shrinks it further when it would not fit the screen. */
  dockSize: number;
  dockAutohide: boolean;
  /** Enter browser full screen when signing in, so the real menu bar and Dock get out of the way. */
  fullscreenOnLogin: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  appearance: 'auto',
  accent: 'blue',
  wallpaper: 'glass',
  reduceMotion: null,
  reduceTransparency: null,
  sound: true,
  volume: 0.5,
  brightness: 1,
  dockMagnification: true,
  // The measured macOS 27 Dock runs 64 pt tiles (research/macos.md §8).
  dockSize: 64,
  dockAutohide: false,
  fullscreenOnLogin: true,
};

interface SettingsActions {
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
}

export const useSettings = create<Settings & SettingsActions>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      set: (key, value) => set({ [key]: value } as Pick<Settings, typeof key>),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    { name: 'settings', version: 1 },
  ),
);
