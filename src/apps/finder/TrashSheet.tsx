import { useEffect, useId, useRef, type KeyboardEvent } from 'react';
import { Button } from '@/desktop/kit/controls';
import { useDismiss } from '@/desktop/menus/useDismiss';
import { useRestoreFocus } from '@/lib/focus';
import { APPS } from '@/os/apps';
import { AppIcon } from '@/ui/AppIcon';
import { Glass } from '@/ui/Glass';
import { COMMITS_URL } from './items';
import styles from './TrashSheet.module.css';

/**
 * The trash holds the site's previous, Windows-themed version.
 * - about: what that item is (opening or Quick Look on it);
 * - confirm: 휴지통 비우기 (⇧⌘⌫), worded as Finder's own alert
 *   (LocalizableMerged.strings A15, A16, AL1, AL10);
 * - kept: nothing is erased, because git keeps every version anyway.
 */
export type TrashSheetKind = 'about' | 'confirm' | 'kept';

/** `then`: the sheet the default button leads to; without one it closes. `commits`: the other button shows the git history (else 취소). */
const SHEETS: Record<TrashSheetKind, { title: string; message: string; primary: string; then?: TrashSheetKind; commits: boolean }> = {
  about: {
    title: '이전 포트폴리오 (Windows)',
    message: '이 사이트는 예전에 Windows 바탕화면처럼 꾸며져 있었습니다. 지금은 macOS와 iPhone처럼 새로 만들었고, 이전 버전은 git 기록에 남아 있습니다.',
    primary: '닫기',
    commits: true,
  },
  confirm: {
    title: '휴지통에 있는 항목들을 영구적으로 지우겠습니까?',
    message: '이 동작은 실행 취소할 수 없습니다.',
    primary: '휴지통 비우기',
    then: 'kept',
    commits: false,
  },
  kept: {
    title: '이전 버전은 git 기록에 남아 있습니다.',
    message: '휴지통은 비워지지 않았습니다. Windows 테마였던 이전 포트폴리오는 GitHub 커밋 기록에서 볼 수 있습니다.',
    primary: '확인',
    commits: true,
  },
};

/**
 * The sheet as an NSAlert of the window (macos.md §10, run-time values):
 * 260 pt wide, radius 26, a 64 pt app icon, Bold 13 title over Regular 13
 * text, and two 110 × 28 pill buttons 8 pt apart, the default on the right
 * (it has focus, so Return presses it). The window behind is dimmed by the
 * kit's window-modal overlay; Escape or a press outside the window closes it.
 */
export function TrashSheet({ kind, onChange }: { kind: TrashSheetKind; onChange: (next: TrashSheetKind | null) => void }) {
  const sheet = SHEETS[kind];
  const close = () => onChange(null);
  const titleId = useId();
  const messageId = useId();
  const overlay = useRef<HTMLDivElement>(null);
  useRestoreFocus();
  useDismiss(true, overlay, close);
  // An effect rather than autoFocus: it runs after useRestoreFocus's, so StrictMode's remount cannot undo it.
  useEffect(() => overlay.current?.querySelector<HTMLElement>('[data-default]')?.focus({ preventScroll: true }), []);

  // Window-modal: Tab stays inside the sheet.
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    const controls = [...(overlay.current?.querySelectorAll<HTMLElement>('button, a') ?? [])];
    const index = controls.indexOf(document.activeElement as HTMLElement);
    const next = controls[(index + (event.shiftKey ? controls.length - 1 : 1)) % controls.length];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  };

  return (
    <div ref={overlay} className={styles.overlay} onKeyDown={onKeyDown}>
      <Glass
        variant="panel"
        radius={26}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className={styles.sheet}
      >
        <AppIcon icon={APPS.finder.icon} size={64} className={styles.icon} />
        <h2 id={titleId} className={styles.title}>
          {sheet.title}
        </h2>
        <p id={messageId} className={styles.message}>
          {sheet.message}
        </p>
        <div className={styles.buttons}>
          {/* A choice that opens a page is a real link, so ⌘-click and the browser's link menu work. */}
          {sheet.commits ? (
            <a className={styles.link} data-size="large" href={COMMITS_URL} target="_blank" rel="noopener" onClick={close}>
              커밋 기록 보기
            </a>
          ) : (
            <Button size="large" onClick={close}>
              취소
            </Button>
          )}
          <Button size="large" variant="prominent" data-default onClick={() => onChange(sheet.then ?? null)}>
            {sheet.primary}
          </Button>
        </div>
      </Glass>
    </div>
  );
}
