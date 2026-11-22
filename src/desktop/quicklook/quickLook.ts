import { create } from 'zustand';
import type { NoteId } from '@/content/conversation';
import { AWARDS } from '@/content/profile';
import type { ProjectSlug } from '@/content/types';

/** Space on a selected item opens Quick Look; arrows move through its siblings. */
export type QuickLookItem =
  | { kind: 'project'; slug: ProjectSlug }
  | { kind: 'award'; index: number }
  | { kind: 'pdf' }
  | { kind: 'note'; note: NoteId };

/** Every certificate, newest first as the 수상 folder lists them: what Quick Look pages through from any one of them. */
export const AWARD_ITEMS: readonly QuickLookItem[] = AWARDS.map((_, index) => ({ kind: 'award', index }));

interface QuickLookState {
  items: readonly QuickLookItem[];
  index: number;
  /** Screen rect of the item it grows from (and shrinks back to). */
  origin?: DOMRect;
}

export const useQuickLook = create<QuickLookState>(() => ({ items: [], index: 0 }));

export const openQuickLook = (items: readonly QuickLookItem[], index = 0, origin?: DOMRect) =>
  useQuickLook.setState({ items, index, origin });

export const closeQuickLook = () => useQuickLook.setState({ items: [], index: 0, origin: undefined });

export const stepQuickLook = (delta: number) =>
  useQuickLook.setState((s) => ({ index: Math.min(Math.max(s.index + delta, 0), s.items.length - 1) }));
