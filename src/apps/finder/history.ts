/** A Finder window's back and forward stacks (이동 › 뒤로 ⌘[ / 앞으로 ⌘]). */
interface History<T> {
  back: readonly T[];
  current: T;
  forward: readonly T[];
}

export const start = <T>(current: T): History<T> => ({ back: [], current, forward: [] });

/** Going somewhere new clears the forward stack; going to the same place changes nothing. */
export function go<T>(history: History<T>, next: T): History<T> {
  if (next === history.current) return history;
  return { back: [...history.back, history.current], current: next, forward: [] };
}

export function back<T>(history: History<T>): History<T> {
  const previous = history.back.at(-1);
  if (previous === undefined) return history;
  return { back: history.back.slice(0, -1), current: previous, forward: [history.current, ...history.forward] };
}

export function forward<T>(history: History<T>): History<T> {
  const [next, ...rest] = history.forward;
  if (next === undefined) return history;
  return { back: [...history.back, history.current], current: next, forward: rest };
}
