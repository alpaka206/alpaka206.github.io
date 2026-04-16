import { NOTE_COLORS } from '@/features/desktop/config/shell';
import { useDesktopNotesStore, useDesktopStore } from '@/stores';
import type { NoteColorId } from '@/stores/desktopModels';

export function NoteWindowBody({ noteId }: { noteId: string }) {
  const note = useDesktopNotesStore((s) =>
    s.notes.find((entry) => entry.id === noteId)
  );
  const createNote = useDesktopNotesStore((s) => s.createNote);
  const updateNote = useDesktopNotesStore((s) => s.updateNote);
  const setNoteColor = useDesktopNotesStore((s) => s.setNoteColor);
  const removeNote = useDesktopNotesStore((s) => s.removeNote);
  const openNoteWindow = useDesktopStore((s) => s.openNoteWindow);
  const closeWindow = useDesktopStore((s) => s.closeWindow);

  if (!note) {
    return (
      <div className='grid h-full place-items-center bg-[#f8fafc] text-sm text-[#64748b]'>
        This note no longer exists.
      </div>
    );
  }

  const palette = NOTE_COLORS[note.color];

  return (
    <div
      className='flex h-full min-h-0 w-full min-w-0 flex-col'
      style={{ backgroundColor: palette.surface }}
    >
      <div className='flex flex-col gap-3 border-b border-black/10 px-4 py-3'>
        <div className='flex items-center gap-3'>
          <input
            value={note.title}
            onChange={(e) =>
              updateNote(noteId, { title: e.target.value.slice(0, 40) })
            }
            className='min-w-0 flex-1 bg-transparent text-[18px] font-semibold text-[#3b2f00] outline-none'
          />
          <div className='shrink-0 rounded-full border border-black/10 bg-white/40 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7a6200]'>
            Memo
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <button
            onClick={() => {
              const nextId = createNote(
                {
                  x: note.position.x + 24,
                  y: note.position.y + 24,
                },
                {
                  surfaceVisible: false,
                  title: 'Untitled Note',
                }
              );
              openNoteWindow(nextId);
            }}
            className='rounded-md border border-black/10 px-2 py-1 text-[12px] font-medium text-[#624800] transition-colors hover:bg-black/5'
          >
            + New
          </button>
          {!note.surfaceVisible ? (
            <button
              onClick={() => updateNote(noteId, { surfaceVisible: true })}
              className='rounded-md border border-black/10 px-2 py-1 text-[12px] font-medium text-[#624800] transition-colors hover:bg-black/5'
            >
              Pin to Desktop
            </button>
          ) : null}
          {(Object.keys(NOTE_COLORS) as NoteColorId[]).map((colorId) => (
            <button
              key={colorId}
              onClick={() => setNoteColor(noteId, colorId)}
              aria-label={NOTE_COLORS[colorId].label}
              className='size-4 shrink-0 rounded-full border border-black/10'
              style={{ background: NOTE_COLORS[colorId].tile }}
            />
          ))}
          <button
            onClick={() => {
              closeWindow(`note:${noteId}`);
              removeNote(noteId);
            }}
            className='rounded-md border border-black/10 px-2 py-1 text-[12px] font-medium text-[#624800] transition-colors hover:bg-black/5'
          >
            Delete
          </button>
        </div>
      </div>
      <textarea
        value={note.content}
        onChange={(e) => updateNote(noteId, { content: e.target.value })}
        className='min-h-0 w-full flex-1 resize-none bg-transparent px-4 py-4 text-[15px] leading-7 text-[#3b2f00] outline-none placeholder:text-[#715f2e]'
        placeholder='Write something down...'
      />
    </div>
  );
}
