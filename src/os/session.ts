import { create } from 'zustand';
import { readStorage, writeStorage } from '@/lib/storage';

/**
 * off      → black screen, any key or click powers on
 * boot     → logo and progress bar while the first assets load
 * login    → login window (after boot or log out)
 * locked   → lock screen (⌃⌘Q or waking from sleep)
 * desktop  → signed in
 * sleep    → screen off, any input wakes to the lock screen
 */
export type Phase = 'off' | 'boot' | 'login' | 'locked' | 'desktop' | 'sleep';

/** This tab's state ('desktop' or 'locked'), so a reload lands where the visitor left. */
const TAB_PHASE = 'session-phase';
/** When this browser last showed the desktop. */
const LAST_SEEN = 'last-seen';
/** Coming back within this window feels like opening a sleeping Mac: the lock screen, no boot. */
const AWAKE_FOR_MS = 30 * 60 * 1000;

function initialPhase(deepLinked: boolean): Phase {
  if (deepLinked) return 'desktop';
  const tab = readStorage('sessionStorage', TAB_PHASE);
  if (tab === 'desktop' || tab === 'locked') return tab;
  const last = Number(readStorage('localStorage', LAST_SEEN) ?? 0);
  return Date.now() - last < AWAKE_FOR_MS ? 'locked' : 'boot';
}

/** What a reload should come back to: still signed in, locked, or a fresh start. */
function remember(phase: Phase) {
  if (phase === 'desktop') {
    writeStorage('sessionStorage', TAB_PHASE, 'desktop');
    writeStorage('localStorage', LAST_SEEN, String(Date.now()));
  } else if (phase === 'locked' || phase === 'sleep') {
    writeStorage('sessionStorage', TAB_PHASE, 'locked');
  } else {
    // Logged out, shut down or restarting: the next visit starts from the beginning.
    writeStorage('sessionStorage', TAB_PHASE, null);
    writeStorage('localStorage', LAST_SEEN, null);
  }
}

interface SessionState {
  phase: Phase;
  started: boolean;
  /** Picks the first phase once per page load; a remounted desktop (resizing across the phone breakpoint) keeps the current one. */
  start: (deepLinked: boolean) => void;
  go: (phase: Phase) => void;
}

export const useSession = create<SessionState>((set, get) => ({
  phase: 'off',
  started: false,
  start: (deepLinked) => {
    if (get().started) return;
    const phase = initialPhase(deepLinked);
    remember(phase);
    set({ started: true, phase });
  },
  go: (phase) => {
    remember(phase);
    set({ phase });
  },
}));
