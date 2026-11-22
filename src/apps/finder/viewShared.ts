import { useLayoutEffect, useSyncExternalStore, type FocusEvent, type KeyboardEvent, type MouseEvent, type RefObject } from 'react';
import type { FinderItem, Listing } from './items';
import { click, moveTo, only, type Selection } from './selection';
import { canvasMeasure, clearMeasureCache, type Measure } from './truncate';

/** What every Finder view receives from its window. */
export interface ViewProps {
  list: Listing;
  selection: Selection;
  onSelectionChange: (selection: Selection) => void;
  /** Double-click (and Enter / ⌘O / ⌘↓ at the window level). */
  onOpen: (item: FinderItem) => void;
  onContextMenu: (event: MouseEvent, item: FinderItem) => void;
  /** Accessible name of the item collection, e.g. "프로젝트". */
  label: string;
}

export const itemElement = (root: ParentNode | null | undefined, id: string) =>
  root?.querySelector<HTMLElement>(`[data-item-id="${CSS.escape(id)}"]`) ?? null;

/** DOM id for aria-activedescendant; prefixed per view so two windows never collide. */
export const optionId = (prefix: string, itemId: string) => `${prefix}-${itemId.replace(/[^\w-]/g, '_')}`;

/** Scrolls the item the keyboard is on into view as the selection moves. */
export function useRevealFocus(root: RefObject<HTMLElement | null>, focus: string | null) {
  useLayoutEffect(() => {
    if (focus) itemElement(root.current, focus)?.scrollIntoView({ block: 'nearest' });
  }, [root, focus]);
}

/**
 * Pointer selection as Finder does it: select on mouse down so a press
 * already highlights, keep a multiple selection until mouse up so it can be
 * dragged, and select the item under a right click before its menu opens.
 */
export function pointerHandlers(item: FinderItem, props: ViewProps, order: readonly string[]) {
  const { selection, onSelectionChange } = props;
  const selected = selection.ids.includes(item.id);
  return {
    onMouseDown(event: MouseEvent) {
      if (event.button !== 0) return;
      const mods = { meta: event.metaKey || event.ctrlKey, shift: event.shiftKey };
      if (!selected || mods.meta || mods.shift) onSelectionChange(click(selection, order, item.id, mods));
    },
    onClick(event: MouseEvent) {
      if (selected && selection.ids.length > 1 && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
        onSelectionChange(click(selection, order, item.id, {}));
      }
    },
    onDoubleClick() {
      props.onOpen(item);
    },
    onContextMenu(event: MouseEvent) {
      if (!selected) onSelectionChange(click(selection, order, item.id, {}));
      props.onContextMenu(event, item);
    },
  };
}

/** Tabbing into a view with nothing selected selects its first item, as Finder does, so the focus always shows. */
export function selectFirstOnFocus(props: ViewProps, first: string | undefined) {
  return (event: FocusEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget || !first || props.selection.ids.length) return;
    if (event.currentTarget.matches(':focus-visible')) props.onSelectionChange(only(first));
  };
}

/**
 * Keys shared by the list-like views: Home and End, and ⇧ to extend. Arrow
 * targets come from the view (`step`), which knows its own geometry.
 */
export function navigate(
  event: KeyboardEvent,
  props: ViewProps,
  order: readonly string[],
  step: (from: number, key: string) => number | null,
): boolean {
  const { selection, onSelectionChange } = props;
  if (event.metaKey || event.ctrlKey || event.altKey) return false;
  const from = selection.focus ? order.indexOf(selection.focus) : -1;
  let target: number | null;
  if (event.key === 'Home') target = 0;
  else if (event.key === 'End') target = order.length - 1;
  else if (event.key.startsWith('Arrow')) target = from < 0 ? 0 : step(from, event.key);
  else return false;
  event.preventDefault();
  const id = target === null ? undefined : order[target];
  if (id) onSelectionChange(moveTo(selection, order, id, event.shiftKey));
  return true;
}

let fontsVersion = 0;

const subscribeFonts = (notify: () => void) => {
  const done = () => {
    fontsVersion += 1;
    clearMeasureCache();
    notify();
  };
  document.fonts.addEventListener('loadingdone', done);
  return () => document.fonts.removeEventListener('loadingdone', done);
};

let family: string | undefined;
const withFamily = (font: string) => {
  family ??= getComputedStyle(document.documentElement).getPropertyValue('--font-text').trim() || 'system-ui';
  return `${font} ${family}`;
};

/**
 * Text widths in a label font (a CSS shorthand without the family, e.g.
 * '400 12px'), measured on a canvas so truncation matches what the browser
 * draws. Web fonts finishing their load re-render, so labels first measured
 * in a fallback face are measured again.
 */
export function useLabelMeasure(font: string): Measure {
  useSyncExternalStore(
    subscribeFonts,
    () => fontsVersion,
    () => 0,
  );
  return canvasMeasure(withFamily(font));
}
