import type { ComponentPropsWithoutRef } from 'react';
import { Glyph } from './Glyph';
import styles from './SearchField.module.css';

interface SearchFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'onChange' | 'type'> {
  value: string;
  onChange: (value: string) => void;
  /** Enter, but never while a Korean syllable is still being composed. */
  onSubmit?: () => void;
  /** `glass` is the bottom search field (48 pt glass capsule); `fill` sits in content. */
  variant?: 'fill' | 'glass';
}

/** iOS search field. 17 pt text also keeps iOS Safari from zooming in on focus. */
export function SearchField({ value, onChange, onSubmit, variant = 'fill', placeholder, className, ...input }: SearchFieldProps) {
  return (
    <label className={[styles.field, className].filter(Boolean).join(' ')} data-variant={variant}>
      <Glyph name="magnifyingglass" pt={17} weight="medium" className={styles.glyph} />
      <input
        {...input}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        className={styles.input}
        placeholder={placeholder}
        aria-label={input['aria-label'] ?? placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) onSubmit?.();
        }}
      />
      {value && (
        <button type="button" className={styles.clear} aria-label="검색어 지우기" onClick={() => onChange('')}>
          <Glyph name="xmark" pt={9} weight="semibold" />
        </button>
      )}
    </label>
  );
}
