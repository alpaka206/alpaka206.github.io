import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  DesktopNote,
  DesktopPosition,
  NoteColorId,
} from './desktopModels';

type NotesState = {
  notes: DesktopNote[];
  zIndexCounter: number;
  createNote: (
    position: DesktopPosition,
    options?: {
      surfaceVisible?: boolean;
      title?: string;
      content?: string;
      color?: NoteColorId;
    }
  ) => string;
  updateNote: (id: string, patch: Partial<DesktopNote>) => void;
  moveNote: (id: string, position: DesktopPosition) => void;
  setNoteColor: (id: string, color: NoteColorId) => void;
  removeNote: (id: string) => void;
  bringNoteToFront: (id: string) => void;
  resetNotes: () => void;
};

const createNoteId = () =>
  `memo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const INITIAL_Z = 400;

export const useDesktopNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      zIndexCounter: INITIAL_Z,
      createNote: (position, options) => {
        const id = createNoteId();
        set((s) => ({
          zIndexCounter: s.zIndexCounter + 1,
          notes: [
            ...s.notes,
            {
              id,
              title: options?.title ?? 'Memo',
              content: options?.content ?? '',
              color: options?.color ?? 'yellow',
              position,
              zIndex: s.zIndexCounter + 1,
              surfaceVisible: options?.surfaceVisible ?? true,
            },
          ],
        }));
        return id;
      },
      updateNote: (id, patch) =>
        set((s) => ({
          notes: s.notes.map((note) =>
            note.id === id ? { ...note, ...patch } : note
          ),
        })),
      moveNote: (id, position) =>
        set((s) => ({
          notes: s.notes.map((note) =>
            note.id === id ? { ...note, position } : note
          ),
        })),
      setNoteColor: (id, color) =>
        set((s) => ({
          notes: s.notes.map((note) =>
            note.id === id ? { ...note, color } : note
          ),
        })),
      removeNote: (id) =>
        set((s) => ({
          notes: s.notes.filter((note) => note.id !== id),
        })),
      bringNoteToFront: (id) =>
        set((s) => ({
          zIndexCounter: s.zIndexCounter + 1,
          notes: s.notes.map((note) =>
            note.id === id
              ? { ...note, zIndex: s.zIndexCounter + 1 }
              : note
          ),
        })),
      resetNotes: () => set({ notes: [], zIndexCounter: INITIAL_Z }),
    }),
    {
      name: 'desktop_notes',
      version: 2,
      migrate: (persistedState: unknown) => {
        const state = persistedState as
          | { notes?: Array<Partial<DesktopNote>>; zIndexCounter?: number }
          | undefined;

        return {
          notes:
            state?.notes?.map((note) => ({
              id: note.id ?? createNoteId(),
              title: note.title ?? 'Memo',
              content: note.content ?? '',
              color: note.color ?? 'yellow',
              position: note.position ?? { x: 320, y: 180 },
              zIndex: note.zIndex ?? INITIAL_Z,
              surfaceVisible: note.surfaceVisible ?? true,
            })) ?? [],
          zIndexCounter: state?.zIndexCounter ?? INITIAL_Z,
        };
      },
      storage: createJSONStorage(() => localStorage),
    }
  )
);
