import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { APPS, type AppId } from '@/os/apps';
import { registerCommand } from '@/os/commands';
import { useWindows } from '@/os/windows';
import { AppIcon } from '@/ui/AppIcon';
import { Glass } from '@/ui/Glass';
import styles from './AppSwitcher.module.css';

/** Running apps, most recently used first. Finder always runs. */
function runningApps(): AppId[] {
  const { windows, focusedApp } = useWindows.getState();
  const order: AppId[] = [focusedApp()];
  for (const window of [...windows].reverse()) if (!order.includes(window.app)) order.push(window.app);
  if (!order.includes('finder')) order.push('finder');
  return order;
}

/** Brings the app's windows forward in their own order; minimized ones stay in the Dock unless nothing else is left. */
function activate(app: AppId) {
  const { windows, focus, blur } = useWindows.getState();
  const own = windows.filter((window) => window.app === app);
  const visible = own.filter((window) => !window.minimized);
  if (!own.length) return blur();
  for (const window of visible.length ? visible : own.slice(-1)) focus(window.id);
}

interface Switching {
  apps: AppId[];
  index: number;
}

const step = (state: Switching, delta: number): Switching => ({
  ...state,
  index: (state.index + delta + state.apps.length) % state.apps.length,
});

interface SwitcherPanelProps {
  state: Switching;
  onSelect: (index: number) => void;
  onChoose: (app: AppId) => void;
}

/** The icons, as a listbox that holds focus while it is up so a screen reader follows the selection. */
function SwitcherPanel({ state, onSelect, onChoose }: SwitcherPanelProps) {
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  useEffect(() => list.current?.focus({ preventScroll: true }), []);
  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [state.index]);

  return (
    <div className={styles.layer}>
      <Glass variant="panel" radius={30} className={styles.panel}>
        <ul
          ref={list}
          role="listbox"
          tabIndex={-1}
          aria-label="실행 중인 응용 프로그램"
          aria-activedescendant={`${id}-${state.index}`}
          className={styles.apps}
        >
          {state.apps.map((app, index) => (
            <li
              key={app}
              id={`${id}-${index}`}
              role="option"
              aria-selected={index === state.index}
              className={styles.app}
              onPointerMove={() => index !== state.index && onSelect(index)}
              onClick={() => onChoose(app)}
            >
              <AppIcon icon={APPS[app].icon} size={96} />
              <span className={styles.name}>{APPS[app].name}</span>
            </li>
          ))}
        </ul>
      </Glass>
    </div>
  );
}

/**
 * ⌘⇥: while the modifier is held the icons of running apps stay on screen
 * and ⇥ moves along them (⇧⇥ back); letting go activates the choice.
 * Browsers only pass ⌘⇥ to a page in full screen with keyboard lock.
 */
export function AppSwitcher() {
  const [state, setState] = useState<Switching | null>(null);
  /** Where focus was when the switcher came up. */
  const returnTo = useRef<HTMLElement | null>(null);

  // Focus goes back first, while its window is still key (focusing a window makes it key):
  // activating another app then moves focus on; cancelling leaves it where it was.
  const finish = useCallback((app?: AppId) => {
    returnTo.current?.focus({ preventScroll: true });
    returnTo.current = null;
    setState(null);
    if (app) activate(app);
  }, []);

  useEffect(
    () =>
      registerCommand('switcher.next', () => {
        returnTo.current ??= document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setState((current) => {
          if (current) return step(current, 1);
          const apps = runningApps();
          return { apps, index: apps.length > 1 ? 1 : 0 };
        });
      }),
    [],
  );

  useEffect(() => {
    if (!state) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish();
      else if (event.key === 'Tab' && event.shiftKey) setState(step(state, -1));
      else if (event.key === 'ArrowRight') setState(step(state, 1));
      else if (event.key === 'ArrowLeft') setState(step(state, -1));
      else if (event.key === 'Enter') finish(state.apps[state.index]);
      else return;
      event.preventDefault();
      event.stopPropagation();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Meta') finish(state.apps[state.index]);
    };
    const cancel = () => finish();
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    window.addEventListener('blur', cancel);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.removeEventListener('blur', cancel);
    };
  }, [state, finish]);

  if (!state) return null;

  return <SwitcherPanel state={state} onSelect={(index) => setState({ ...state, index })} onChoose={finish} />;
}
