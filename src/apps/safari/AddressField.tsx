import { useLayoutEffect, useState, type RefObject } from 'react';
import { Symbol } from '@/ui/Symbol';
import { hostOf } from './sites';
import type { Page } from './tabs';
import styles from './Safari.module.css';

interface AddressFieldProps {
  page: Page;
  loading: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onGo: (input: string) => void;
  onReload: () => void;
  /** Present when there is more than one tab. */
  onClose?: () => void;
}

/**
 * The active tab of Safari's compact tab bar: a glass capsule showing the
 * host centred with a lock; focused, it becomes the full, selected URL.
 */
export function AddressField({ page, loading, inputRef, onGo, onReload, onClose }: AddressFieldProps) {
  const url = page.kind === 'web' ? page.url : '';
  const host = url ? (hostOf(url) ?? url) : '';
  const [draft, setDraft] = useState<string | null>(null);
  const editing = draft !== null;

  // Safari selects the whole address when the field takes focus (click or ⌘L).
  useLayoutEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing, inputRef]);

  return (
    <div className={styles.address} data-editing={editing || undefined} data-loading={loading || undefined}>
      <span className={styles.progress} aria-hidden="true" />
      {onClose && !editing && (
        <button type="button" className={styles.close} aria-label="탭 닫기" onClick={onClose}>
          <Symbol name="xmark" size={9} weight="semibold" />
        </button>
      )}
      <input
        ref={inputRef}
        className={styles.addressInput}
        value={editing ? draft : host}
        placeholder="검색 또는 웹 사이트 이름 입력"
        aria-label="주소 및 검색"
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        onFocus={() => setDraft(url)}
        onBlur={() => setDraft(null)}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) return;
          if (event.key === 'Enter' && draft !== null) {
            onGo(draft);
            event.currentTarget.blur();
          }
          if (event.key === 'Escape') event.currentTarget.blur();
        }}
      />
      {host && !editing && (
        <span className={styles.addressLabel} aria-hidden="true">
          {url.startsWith('https:') && <Symbol name="lock" size={11} weight="semibold" />}
          {host}
        </span>
      )}
      {host && !editing && (
        <button type="button" className={styles.reload} aria-label="페이지 다시 로드" aria-keyshortcuts="Meta+R" title="페이지 다시 로드" onClick={onReload}>
          <Symbol name="arrow.clockwise" size={12} weight="semibold" />
        </button>
      )}
    </div>
  );
}
