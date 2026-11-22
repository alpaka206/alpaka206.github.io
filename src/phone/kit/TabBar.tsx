import type { KeyboardEvent } from 'react';
import { Glass } from '@/ui/Glass';
import type { SymbolName } from '@/ui/Symbol';
import { Glyph } from './Glyph';
import styles from './TabBar.module.css';

interface Tab<T extends string> {
  id: T;
  label: string;
  icon: SymbolName;
}

interface TabBarProps<T extends string> {
  tabs: readonly Tab<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Shows the separate search circle next to the tabs (iOS 26 "Tab - Search"). */
  onSearch?: () => void;
  label: string;
  /** id prefix for tab/panel pairing: tab `${idPrefix}-tab-${id}` controls `${idPrefix}-panel`. */
  idPrefix: string;
}

/** The iOS 26 floating tab bar: a 62 pt glass capsule inset 21 pt, plus an optional 62 pt search button. */
export function TabBar<T extends string>({ tabs, value, onChange, onSearch, label, idPrefix }: TabBarProps<T>) {
  const index = tabs.findIndex((tab) => tab.id === value);
  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    const next = tabs[(index + step + tabs.length) % tabs.length]!;
    onChange(next.id);
    document.getElementById(`${idPrefix}-tab-${next.id}`)?.focus();
  };
  return (
    <div className={styles.bar}>
      <Glass radius={31} variant="control" className={styles.tabs}>
        <div role="tablist" aria-label={label} className={styles.list} onKeyDown={onKeyDown}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`${idPrefix}-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={tab.id === value}
              aria-controls={`${idPrefix}-panel`}
              tabIndex={tab.id === value ? 0 : -1}
              className={styles.tab}
              onClick={() => onChange(tab.id)}
            >
              <Glyph name={tab.icon} pt={18} weight="semibold" className={styles.icon} />
              <span className={styles.label}>{tab.label}</span>
            </button>
          ))}
        </div>
      </Glass>
      {onSearch && (
        <Glass as="button" type="button" radius={31} variant="control" className={styles.search} aria-label="검색" onClick={onSearch}>
          <Glyph name="magnifyingglass" pt={17} weight="semibold" />
        </Glass>
      )}
    </div>
  );
}
