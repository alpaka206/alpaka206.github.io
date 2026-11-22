import { Fragment, useEffect, useLayoutEffect, useReducer, useRef, useState, type KeyboardEvent } from 'react';
import { useWindowCommands, useWindowFrame, useWindowTitle } from '@/desktop/kit/window';
import { AWARD_ITEMS, openQuickLook } from '@/desktop/quicklook/quickLook';
import { useSettings } from '@/os/settings';
import { useWindows } from '@/os/windows';
import type { DesktopAppProps } from '../registry';
import { CommandLine } from './CommandLine';
import { reduce, remember, startSession } from './session';
import { columns, complete, prompt, run, type Effect, type Line } from './shell';
import { useCellGrid } from './useCellGrid';
import styles from './Terminal.module.css';

function Output({ line }: { line: Line }) {
  return line.map((span, i) =>
    typeof span === 'string' ? (
      <Fragment key={i}>{span}</Fragment>
    ) : (
      <span key={i} className={styles[span.tone]}>
        {span.text}
      </span>
    ),
  );
}

/** Terminal with the "Clear Dark" profile: a zsh look-alike over the portfolio (see shell.ts). */
export default function TerminalWindow({ windowId }: DesktopAppProps<'terminal'>) {
  const { active } = useWindowFrame();
  const [session, dispatch] = useReducer(reduce, undefined, () => startSession(new Date()));
  const [input, setInput] = useState('');
  const [caret, setCaret] = useState(0);
  /** zsh lists ambiguous completions under the prompt until the next key. */
  const [listing, setListing] = useState<Line[]>([]);
  /** Where ↑/↓ is in the history, and the line that was being typed before. */
  const [recall, setRecall] = useState<{ index: number; draft: string } | null>(null);
  const [focused, setFocused] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Set when the line is replaced in code (history, completion); applied after render. */
  const pendingCaret = useRef<number | null>(null);
  const { cols, rows } = useCellGrid(screenRef, cellRef);

  // Terminal's default title: working directory, process, size ("gyuwon — -zsh — 80×24").
  const title = `${session.cwd.at(-1) ?? 'gyuwon'} — -zsh — ${cols}×${rows}`;
  useWindowTitle(title);

  const replaceLine = (value: string, at = value.length) => {
    setInput(value);
    setCaret(at);
    setListing([]);
    pendingCaret.current = at;
  };

  const perform = (effect: Effect | undefined) => {
    const windows = useWindows.getState();
    const settings = useSettings.getState();
    switch (effect?.type) {
      case 'clear':
        return dispatch({ type: 'clear' });
      case 'exit':
        return windows.close(windowId);
      case 'open':
        // Every `open <url>` is a new request, even for the page Safari already shows.
        return windows.open(effect.app, effect.app === 'safari' ? { ...effect.props, request: Date.now() } : effect.props);
      case 'award':
        return openQuickLook(AWARD_ITEMS, effect.index);
      case 'appearance':
        return settings.set('appearance', effect.value);
      case 'wallpaper':
        return settings.set('wallpaper', effect.value);
    }
  };

  const submit = () => {
    const { appearance, wallpaper } = useSettings.getState();
    const history = remember(session.history, input);
    const result = run(input, { cwd: session.cwd, history, now: new Date(), cols, appearance, wallpaper });
    dispatch({ type: 'ran', entered: input, output: result.lines, cwd: result.cwd });
    setRecall(null);
    replaceLine('');
    perform(result.effect);
  };

  const completeWord = () => {
    const done = complete(input.slice(0, caret), session.cwd);
    replaceLine(done.input + input.slice(caret), done.input.length);
    if (done.options.length > 1) setListing(columns(done.options, cols));
  };

  const browse = (step: -1 | 1) => {
    const { history } = session;
    if (step < 0 && history.length) {
      const index = recall ? Math.max(0, recall.index - 1) : history.length - 1;
      setRecall({ index, draft: recall?.draft ?? input });
      replaceLine(history[index] ?? '');
    } else if (step > 0 && recall) {
      const index = recall.index + 1;
      setRecall(index < history.length ? { ...recall, index } : null);
      replaceLine(index < history.length ? (history[index] ?? '') : recall.draft);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    const control = event.ctrlKey && !event.metaKey && !event.altKey;
    // Physical keys, so ⌃C still works while the Korean input source is on.
    const handlers: Record<string, () => void> = {
      Enter: submit,
      // Tab completes, as in zsh; ⇧Tab is left to the browser, so the keyboard can still leave.
      ...(!event.shiftKey && { Tab: completeWord }),
      ArrowUp: () => browse(-1),
      ArrowDown: () => browse(1),
      ...(control && {
        KeyC: () => {
          dispatch({ type: 'interrupt', entered: input });
          setRecall(null);
          replaceLine('');
        },
        KeyL: () => dispatch({ type: 'clear' }),
        KeyU: () => replaceLine(''),
      }),
    };
    const handler = handlers[event.key] ?? (control ? handlers[event.code] : undefined);
    if (!handler || event.metaKey) return;
    event.preventDefault();
    handler();
  };

  useWindowCommands({
    'terminal.clear': () => dispatch({ type: 'clear' }),
    'terminal.new': () => {
      dispatch({ type: 'restart', now: new Date() });
      replaceLine('');
    },
  });

  useLayoutEffect(() => {
    if (pendingCaret.current === null) return;
    inputRef.current?.setSelectionRange(pendingCaret.current, pendingCaret.current);
    pendingCaret.current = null;
  });

  // New output scrolls into view, as in a real terminal.
  useLayoutEffect(() => {
    const screen = screenRef.current;
    if (screen) screen.scrollTop = screen.scrollHeight;
  }, [session.rows, listing]);

  useEffect(() => {
    if (active) inputRef.current?.focus({ preventScroll: true });
  }, [active]);

  // Clicking anywhere types into the prompt, unless the click selected text to copy.
  const focusPrompt = () => {
    if (window.getSelection()?.isCollapsed !== false) inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className={styles.terminal} data-active={active || undefined}>
      <header className={styles.titlebar} data-window-drag>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <div
        ref={screenRef}
        className={styles.screen}
        // Commands and their output are code: a page translator must leave them alone.
        translate="no"
        data-cursor={active && focused ? 'block' : 'hollow'}
        onMouseUp={focusPrompt}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <span ref={cellRef} className={styles.probe} aria-hidden="true">
          0000000000
        </span>
        <div role="log" aria-label="터미널 출력">
          {session.rows.map((row) => (
            <div key={row.id} className={styles.row}>
              <Output line={row.line} />
            </div>
          ))}
        </div>
        <CommandLine
          prompt={prompt(session.cwd)}
          value={input}
          caret={caret}
          inputRef={inputRef}
          onEdit={(value, at) => {
            setInput(value);
            setCaret(at);
            setListing([]);
          }}
          onCaret={setCaret}
          onKeyDown={onKeyDown}
        />
        {listing.map((line, i) => (
          <div key={i} className={styles.row}>
            <Output line={line} />
          </div>
        ))}
      </div>
    </div>
  );
}
