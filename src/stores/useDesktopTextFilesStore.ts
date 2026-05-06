import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  SYSTEM_TEXT_FILES,
  SYSTEM_TEXT_FILE_LIST,
} from '@/features/notepad/data/textFiles';
import type { DesktopTextFile, TextFileId } from './desktopModels';

type TextFileState = {
  files: Record<TextFileId, DesktopTextFile>;
  lastOpenedFileId: TextFileId;
  updateFileContent: (id: TextFileId, content: string) => void;
  markFileOpened: (id: TextFileId) => void;
  resetTextFiles: () => void;
};

const DEFAULT_LAST_OPENED_FILE_ID: TextFileId = 'readme';

function cloneSystemTextFiles(): Record<TextFileId, DesktopTextFile> {
  return SYSTEM_TEXT_FILE_LIST.reduce(
    (accumulator, file) => ({
      ...accumulator,
      [file.id]: { ...file },
    }),
    {} as Record<TextFileId, DesktopTextFile>
  );
}

function normalizeFiles(
  files: Partial<Record<TextFileId, Partial<DesktopTextFile>>> | undefined
) {
  return SYSTEM_TEXT_FILE_LIST.reduce(
    (accumulator, systemFile) => ({
      ...accumulator,
      [systemFile.id]: {
        ...systemFile,
        ...files?.[systemFile.id],
        id: systemFile.id,
        title: files?.[systemFile.id]?.title ?? systemFile.title,
        description:
          files?.[systemFile.id]?.description ?? systemFile.description,
        content: files?.[systemFile.id]?.content ?? systemFile.content,
        isReadOnly:
          files?.[systemFile.id]?.isReadOnly ?? systemFile.isReadOnly,
      },
    }),
    {} as Record<TextFileId, DesktopTextFile>
  );
}

export const useDesktopTextFilesStore = create<TextFileState>()(
  persist(
    (set) => ({
      files: cloneSystemTextFiles(),
      lastOpenedFileId: DEFAULT_LAST_OPENED_FILE_ID,
      updateFileContent: (id, content) =>
        set((state) => {
          const file = state.files[id];
          if (!file || file.isReadOnly) {
            return state;
          }

          return {
            files: {
              ...state.files,
              [id]: {
                ...file,
                content,
              },
            },
          };
        }),
      markFileOpened: (id) => set({ lastOpenedFileId: id }),
      resetTextFiles: () =>
        set({
          files: cloneSystemTextFiles(),
          lastOpenedFileId: DEFAULT_LAST_OPENED_FILE_ID,
        }),
    }),
    {
      name: 'desktop_text_files',
      version: 1,
      migrate: (persistedState: unknown) => {
        const state = persistedState as
          | {
              files?: Partial<Record<TextFileId, Partial<DesktopTextFile>>>;
              lastOpenedFileId?: TextFileId;
            }
          | undefined;

        return {
          files: normalizeFiles(state?.files),
          lastOpenedFileId:
            state?.lastOpenedFileId ?? DEFAULT_LAST_OPENED_FILE_ID,
        };
      },
      merge: (persistedState, currentState) => {
        const state = persistedState as Partial<TextFileState> | undefined;
        return {
          ...currentState,
          ...state,
          files: normalizeFiles(
            state?.files as Partial<Record<TextFileId, Partial<DesktopTextFile>>> | undefined
          ),
          lastOpenedFileId:
            state?.lastOpenedFileId ?? DEFAULT_LAST_OPENED_FILE_ID,
        };
      },
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function getStoredTextFile(id: TextFileId) {
  return useDesktopTextFilesStore.getState().files[id] ?? SYSTEM_TEXT_FILES[id];
}
