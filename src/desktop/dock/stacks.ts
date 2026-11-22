import { placeItems, type FinderItem } from '@/apps/finder/items';
import { AWARD_ITEMS, openQuickLook } from '@/desktop/quicklook/quickLook';
import { FILES } from '@/desktop/surface/files';
import type { FinderLocation } from '@/os/apps';
import { toRect } from '@/os/windows';
import type { StackId } from './items';

/** 다음으로 내용 보기: 부채 모양 / 격자 모양 / 자동 (Dock.app DockMenus.strings, macos.md §16). */
export type StackView = 'fan' | 'grid' | 'auto';

export interface StackEntry {
  /** The file as Finder has it: its name and the icon ItemIcon draws. */
  item: FinderItem;
  /** `origin` is the entry's on-screen rect, for Quick Look and window openings. */
  activate: (origin: DOMRect) => void;
}

interface Stack {
  name: string;
  location: FinderLocation;
  /** Newest first, as a stack sorts by date added. */
  entries: StackEntry[];
}

const documents = [FILES['portfolio-pdf'], FILES.readme];

export const STACKS: Record<StackId, Stack> = {
  awards: {
    name: '수상',
    location: 'awards',
    // Finder lists the certificates in AWARDS order, so the index is the award's.
    entries: placeItems('awards').map((item, index) => ({ item, activate: (origin) => openQuickLook(AWARD_ITEMS, index, origin) })),
  },
  documents: {
    name: '문서',
    location: 'documents',
    entries: documents.map((file) => ({ item: file.item, activate: (origin) => file.open(toRect(origin)) })),
  },
};

/** 자동 picks a fan while the items fit one short column, as macOS does, and a grid after that. */
export const resolveView = (view: StackView, count: number): 'fan' | 'grid' => (view === 'auto' ? (count <= 6 ? 'fan' : 'grid') : view);
