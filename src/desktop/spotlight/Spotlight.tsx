import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { registerCommand, runCommand } from '@/os/commands';
import type { SearchKind, SearchTarget } from '@/os/search';
import { focusedWindowId, useWindows } from '@/os/windows';
import { AppIcon } from '@/ui/AppIcon';
import { Glass } from '@/ui/Glass';
import { Symbol } from '@/ui/Symbol';
import { closePanel, togglePanel, toggleSelector, usePanel } from '../menubar/panels';
import { useDismiss } from '../menus/useDismiss';
import { Preview } from './Preview';
import { groupedResults } from './results';
import styles from './Spotlight.module.css';

/** The filter chips beside the field (D08). */
const FILTERS: { kind: SearchKind; label: string }[] = [
  { kind: 'project', label: '프로젝트' },
  { kind: 'action', label: '동작' },
];

/** While Hangul is being composed, the keys belong to the input method. */
const composing = (event: ReactKeyboardEvent) => event.nativeEvent.isComposing || event.keyCode === 229;

function run(target: SearchTarget) {
  closePanel();
  if (target.type === 'open') useWindows.getState().open(target.app, target.props);
  else if (target.type === 'command') runCommand(target.command, focusedWindowId());
  else window.open(target.href, '_blank', 'noopener');
}

function SpotlightPanel() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchKind | null>(null);
  const [selected, setSelected] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  useDismiss(true, root, closePanel, { ignore: toggleSelector('spotlight'), escape: false });

  const groups = useMemo(() => groupedResults(query, filter), [query, filter]);
  const results = groups.flatMap((group) => group.items);
  const index = Math.min(selected, results.length - 1);
  const current = results[index];
  const searching = query.trim() !== '' || filter !== null;

  const select = (next: number) => {
    setSelected(next);
    root.current?.querySelector(`[data-result="${next}"]`)?.scrollIntoView({ block: 'nearest' });
  };

  const onFieldKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (composing(event)) return;
    const count = results.length;
    if (event.key === 'ArrowDown' && count) select((index + 1) % count);
    else if (event.key === 'ArrowUp' && count) select((index - 1 + count) % count);
    else if (event.key === 'Enter' && current) run(current.target);
    else return;
    event.preventDefault();
  };

  // Escape anywhere in the panel. Like macOS: the first one clears the search, the second closes Spotlight.
  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key !== 'Escape' || composing(event)) return;
    event.preventDefault();
    if (!searching) closePanel();
    setQuery('');
    setFilter(null);
    setSelected(0);
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-label="Spotlight"
      // Its keys stay here: ⌘W and the other menu shortcuts must not reach the window behind it.
      data-owns-keys
      className={styles.spotlight}
      onKeyDown={onKeyDown}
    >
      <div className={styles.bar}>
        <Glass variant="panel" radius={28} className={styles.field}>
          <Symbol name="magnifyingglass" size={22} weight="medium" className={styles.fieldIcon} />
          <input
            autoFocus
            role="combobox"
            aria-label="Spotlight 검색"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={current ? `${listId}-${index}` : undefined}
            placeholder="Spotlight 검색"
            value={query}
            spellCheck={false}
            autoComplete="off"
            className={styles.input}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            onKeyDown={onFieldKeyDown}
          />
          {query.trim() && current && (
            <span className={styles.hint} aria-hidden="true">
              {current.title}
            </span>
          )}
        </Glass>
        {FILTERS.map(({ kind, label }) => (
          <Glass
            as="button"
            key={kind}
            type="button"
            variant="panel"
            radius={22}
            className={styles.chip}
            aria-pressed={filter === kind}
            onClick={() => {
              setFilter(filter === kind ? null : kind);
              setSelected(0);
            }}
          >
            {label}
          </Glass>
        ))}
      </div>

      {searching && (
        <Glass variant="panel" radius={24} className={styles.results} data-empty={results.length === 0 || undefined}>
          {current ? (
            <>
              <div id={listId} role="listbox" aria-label="검색 결과" className={styles.list}>
                {groups.map((group) => (
                  <div key={group.label} role="group" aria-label={group.label}>
                    <p className={styles.section} aria-hidden="true">
                      {group.label}
                    </p>
                    {group.items.map((item) => {
                      const at = results.indexOf(item);
                      const option = {
                        id: `${listId}-${at}`,
                        role: 'option',
                        'aria-selected': at === index,
                        'data-result': at,
                        className: styles.result,
                        onPointerMove: () => at !== index && setSelected(at),
                      };
                      const content = (
                        <>
                          <AppIcon icon={item.icon} size={26} />
                          <span className={styles.resultText}>
                            <span className={styles.resultTitle}>{item.title}</span>
                            <span className={styles.resultSubtitle}>{item.subtitle}</span>
                          </span>
                        </>
                      );
                      // A web address stays a real link, so ⌘-click and copying the link work; the browser opens it.
                      return item.target.type === 'link' ? (
                        <a key={item.id} {...option} href={item.target.href} target="_blank" rel="noopener" tabIndex={-1} onClick={closePanel}>
                          {content}
                        </a>
                      ) : (
                        <div key={item.id} {...option} onClick={() => run(item.target)}>
                          {content}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <Preview item={current} />
            </>
          ) : (
            <p className={styles.empty}>결과 없음</p>
          )}
        </Glass>
      )}
      {/* Mounted with the panel so screen readers hear every change, not only the first. */}
      <p className="visually-hidden" role="status">
        {searching && (results.length ? `결과 ${results.length}개` : '결과 없음')}
      </p>
    </div>
  );
}

/** ⌘K or the menu bar's magnifier: search the portfolio the way Spotlight searches a Mac. */
export function Spotlight() {
  const open = usePanel((s) => s.open === 'spotlight');
  useEffect(() => registerCommand('spotlight.toggle', () => togglePanel('spotlight')), []);
  return open ? <SpotlightPanel /> : null;
}
