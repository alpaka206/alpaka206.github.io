import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { springEasing, SPRINGS } from '@/lib/spring';
import { APPS } from '@/os/apps';
import { runCommand } from '@/os/commands';
import { INDEX, KIND_LABEL, search, type SearchItem, type SearchKind } from '@/os/search';
import { motionReduced } from '@/os/theme';
import { AppIcon } from '@/ui/AppIcon';
import { useRestoreFocus } from '@/lib/focus';
import { iconRadius, rectOf } from '../geometry';
import { launchKey } from '../home/items';
import { useEscape, useKeyboardInset } from '../hooks';
import { GlassButton, Glyph, SearchField } from '../kit';
import { usePhoneNav } from '../nav';
import styles from './Spotlight.module.css';

/** Shown before anything is typed, like Siri Suggestions. */
const SUGGESTED = ['app:finder', 'app:about', 'app:messages', 'app:preview', 'action:copy-email', 'action:text', 'action:dark'];
const suggestions = SUGGESTED.map((id) => INDEX.find((item) => item.id === id)).filter((item): item is SearchItem => Boolean(item));
const ASK = INDEX.find((item) => item.id === 'app:messages');

/** The shared index speaks macOS ("Finder", "응용 프로그램"); the phone uses its Home Screen names. */
const titleOf = (item: SearchItem) => (item.kind === 'app' && item.target.type === 'open' ? (APPS[item.target.app].phoneName ?? item.title) : item.title);
const subtitleOf = (item: SearchItem) => (item.kind === 'app' ? '앱' : item.subtitle);
const kindLabel = (kind: SearchKind) => (kind === 'app' ? '앱' : KIND_LABEL[kind]);

/** Top hit first, then the rest grouped by kind in the order the kinds first appear. */
function group(results: SearchItem[]): { title: string; items: SearchItem[] }[] {
  const [top, ...rest] = results;
  if (!top) return [];
  const kinds = Map.groupBy(rest, (item) => item.kind);
  return [{ title: '최상위 결과', items: [top] }, ...[...kinds].map(([kind, items]) => ({ title: kindLabel(kind), items }))];
}

/**
 * Spotlight, iOS 26 style: the field sits at the bottom (above the keyboard)
 * over a blurred Home Screen, results above it. Matches Korean initial
 * consonants too (ㅁㅇㄹ finds 메아리); Enter opens the top hit, but never while
 * a Hangul syllable is still being composed.
 */
export function Spotlight({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const searching = query.trim();
  const results = useMemo(() => search(query, 24), [query]);
  const sections = useMemo(() => (searching ? group(results) : []), [searching, results]);
  const keyboard = useKeyboardInset();
  const layer = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  useEscape(onClose);
  useRestoreFocus();

  useLayoutEffect(() => {
    if (motionReduced()) return;
    layer.current?.animate([{ opacity: 0 }, { opacity: 1 }], springEasing(SPRINGS.smooth));
    bar.current?.animate([{ transform: 'translateY(24px)' }, { transform: 'none' }], springEasing(SPRINGS.smooth));
  }, []);

  /** Opens an app (zooming out of the row's icon), runs a command or follows a link. */
  const run = ({ target }: SearchItem, icon: Element | null | undefined) => {
    const from = icon && target.type === 'open' ? { rect: rectOf(icon, iconRadius(icon)), key: launchKey(target.app, target.props) } : null;
    onClose();
    if (target.type === 'open') usePhoneNav.getState().open(target.app, target.props ?? {}, from);
    else if (target.type === 'command') runCommand(target.command);
    else window.open(target.href, '_blank', 'noopener');
  };

  /** A result row; `ask` is the "ask in Messages" row under the results. */
  const row = (item: SearchItem, ask = false) => (
    <li key={item.id}>
      <button type="button" className={styles.row} onClick={(event) => run(item, event.currentTarget.querySelector('[data-icon]'))}>
        <span data-icon="" className={styles.icon}>
          <AppIcon icon={item.icon} size={40} />
        </span>
        <span className={styles.texts}>
          <span className={styles.title}>{ask ? '김규원에게 직접 물어보기' : titleOf(item)}</span>
          <span className={styles.subtitle}>{ask ? '메시지에서 질문을 고르거나 입력해요' : subtitleOf(item)}</span>
        </span>
        {ask && <Glyph name="chevron.right" pt={13} weight="semibold" className={styles.chevron} />}
      </button>
    </li>
  );

  return (
    <div ref={layer} className={styles.spotlight} role="dialog" aria-modal="true" aria-label="검색" style={{ '--keyboard': `${keyboard}px` } as CSSProperties}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      {/* The count alone: a live region around the results would read every row out. */}
      <p className="visually-hidden" role="status">
        {searching && (results.length ? `결과 ${results.length}개` : '결과 없음')}
      </p>
      <div className={styles.results}>
        {!searching ? (
          <section className={styles.section}>
            <h2 className={styles.heading}>제안</h2>
            <ul className={styles.card}>{suggestions.map((item) => row(item))}</ul>
          </section>
        ) : sections.length ? (
          sections.map((section) => (
            <section key={section.title} className={styles.section}>
              <h2 className={styles.heading}>{section.title}</h2>
              <ul className={styles.card}>{section.items.map((item) => row(item))}</ul>
            </section>
          ))
        ) : (
          <p className={styles.empty}>‘{searching}’ 검색 결과가 없어요.</p>
        )}
        {searching && ASK && (
          <section className={styles.section}>
            <h2 className={styles.heading}>메시지로 묻기</h2>
            <ul className={styles.card}>{row(ASK, true)}</ul>
          </section>
        )}
      </div>
      <div ref={bar} className={styles.bar}>
        <SearchField
          variant="glass"
          className={styles.field}
          value={query}
          onChange={setQuery}
          onSubmit={() => {
            const first = results[0];
            if (first) run(first, layer.current?.querySelector('[data-icon]'));
          }}
          placeholder="검색"
          autoFocus
        />
        <GlassButton icon="xmark" size={48} label="검색 닫기" onClick={onClose} />
      </div>
    </div>
  );
}
