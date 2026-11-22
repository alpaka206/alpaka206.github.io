import type { KeyboardEvent } from 'react';

/**
 * Arrow keys move a radio group's choice and its focus, as native radios do.
 * Each radio carries `data-value`; the checked one has tabIndex 0, the rest -1,
 * so Tab enters and leaves the group in one step.
 */
export function radioArrowKeys<T extends string>(values: readonly T[], current: T, choose: (value: T) => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = Math.max(0, values.indexOf(current));
    const next = values[(index + step + values.length) % values.length]!;
    choose(next);
    event.currentTarget.querySelector<HTMLElement>(`[data-value="${CSS.escape(next)}"]`)?.focus();
  };
}

/**
 * ↑/↓ move a source list's selection and its focus, stopping at the ends as
 * AppKit's lists do (radioArrowKeys above is the wrapping, four-arrow version).
 * Each row carries `data-value`.
 */
export function listArrowKeys<T extends string>(values: readonly T[], selected: T, select: (value: T) => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    const next = step ? values[values.indexOf(selected) + step] : undefined;
    if (!next) return;
    event.preventDefault();
    select(next);
    event.currentTarget.querySelector<HTMLElement>(`[data-value="${CSS.escape(next)}"]`)?.focus();
  };
}
