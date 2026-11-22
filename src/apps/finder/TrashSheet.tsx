import { APPS } from '@/os/apps';
import { AlertSheet } from './AlertSheet';
import { COMMITS_URL } from './items';

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

export function TrashSheet({ kind, onChange }: { kind: TrashSheetKind; onChange: (next: TrashSheetKind | null) => void }) {
  const sheet = SHEETS[kind];
  const close = () => onChange(null);
  return (
    <AlertSheet
      icon={APPS.finder.icon}
      title={sheet.title}
      message={sheet.message}
      secondary={sheet.commits ? { label: '커밋 기록 보기', href: COMMITS_URL, onPress: close } : { label: '취소', onPress: close }}
      primary={{ label: sheet.primary, onPress: () => onChange(sheet.then ?? null) }}
      onDismiss={close}
    />
  );
}
