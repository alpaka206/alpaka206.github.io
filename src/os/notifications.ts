import { create } from 'zustand';
import type { MediaKey } from '@/content/types';
import type { AppId, AppProps } from './apps';

export interface Notice {
  id: string;
  app: string;
  icon: MediaKey;
  title: string;
  body: string;
  time: Date;
  open?: { app: AppId; props?: Partial<AppProps[AppId]> };
}

interface NotificationsState {
  /** Everything posted this session, newest first (Notification Center). */
  history: Notice[];
  /** The banner currently on screen. */
  banner: Notice | null;
  post: (notice: Omit<Notice, 'id' | 'time'>) => void;
  dismissBanner: () => void;
  clear: () => void;
}

let counter = 0;

export const useNotifications = create<NotificationsState>((set) => ({
  history: [],
  banner: null,
  post: (notice) => {
    const full = { ...notice, id: `n${++counter}`, time: new Date() };
    set((s) => ({ history: [full, ...s.history], banner: full }));
  },
  dismissBanner: () => set({ banner: null }),
  clear: () => set({ history: [], banner: null }),
}));
