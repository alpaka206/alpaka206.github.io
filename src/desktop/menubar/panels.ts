import { create } from 'zustand';

/** Surfaces that drop from the menu bar. Only one is open at a time, as on macOS. */
export type Panel = 'spotlight' | 'controlCenter' | 'notificationCenter';

export const usePanel = create<{ open: Panel | null }>(() => ({ open: null }));

/** Whatever had keyboard focus before a panel opened gets it back when the panel closes. */
let returnTo: HTMLElement | null = null;

function setOpen(open: Panel | null) {
  const before = usePanel.getState().open;
  if (!before && open) returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  usePanel.setState({ open });
  if (before && !open && returnTo) {
    const target = returnTo;
    returnTo = null;
    requestAnimationFrame(() => {
      if (document.activeElement === document.body) target.focus({ preventScroll: true });
    });
  }
}

export const togglePanel = (panel: Panel) => setOpen(usePanel.getState().open === panel ? null : panel);

export const closePanel = () => setOpen(null);

/** Marks the menu bar button that toggles a panel, so pressing it does not count as clicking outside. */
export const panelToggle = (panel: Panel) => ({ 'data-panel-toggle': panel });

export const toggleSelector = (panel: Panel) => `[data-panel-toggle="${panel}"]`;
