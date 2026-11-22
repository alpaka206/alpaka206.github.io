import type { KeyboardEvent, Ref } from 'react';
import styles from './Terminal.module.css';

interface CommandLineProps {
  prompt: string;
  value: string;
  /** UTF-16 index of the cursor in `value`. */
  caret: number;
  inputRef: Ref<HTMLInputElement>;
  onEdit: (value: string, caret: number) => void;
  onCaret: (caret: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * The line being typed. A real <input> (invisible, so the IME and screen
 * readers work as usual) sits over a mirror of its text that draws Terminal's
 * block cursor on the character under the caret.
 */
export function CommandLine({ prompt, value, caret, inputRef, onEdit, onCaret, onKeyDown }: CommandLineProps) {
  const code = value.codePointAt(caret);
  const under = code === undefined ? ' ' : String.fromCodePoint(code);
  return (
    <div className={styles.commandLine}>
      <span>{prompt}</span>
      <span className={styles.field}>
        <span className={styles.mirror} aria-hidden="true">
          {value.slice(0, caret)}
          <span className={styles.cursor}>{under}</span>
          {code === undefined ? '' : value.slice(caret + under.length)}
        </span>
        <input
          ref={inputRef}
          className={styles.input}
          value={value}
          aria-label="명령 입력"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => onEdit(event.currentTarget.value, event.currentTarget.selectionStart ?? event.currentTarget.value.length)}
          onSelect={(event) => onCaret(event.currentTarget.selectionStart ?? value.length)}
          onKeyDown={onKeyDown}
        />
      </span>
    </div>
  );
}
