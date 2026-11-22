import { banner, prompt, type Line } from './shell';

/** The scrollback and shell state of one Terminal window. Pure, driven by `reduce`. */
export interface Row {
  id: number;
  line: Line;
}

interface Session {
  rows: Row[];
  cwd: readonly string[];
  history: readonly string[];
  nextId: number;
}

export type Action =
  | { type: 'ran'; entered: string; output: Line[]; cwd: readonly string[] }
  /** ⌃C: the line stays on screen, unrun and unrecorded. */
  | { type: 'interrupt'; entered: string }
  | { type: 'clear' }
  | { type: 'restart'; now: Date };

/** Scrollback kept per window; older rows fall off the top. */
const SCROLLBACK = 2000;

function append(session: Session, lines: Line[]): Session {
  const rows = [...session.rows, ...lines.map((line, i) => ({ id: session.nextId + i, line }))];
  return { ...session, rows: rows.slice(-SCROLLBACK), nextId: session.nextId + lines.length };
}

/** zsh records every non-empty line except an immediate repeat. */
export const remember = (history: readonly string[], entered: string) =>
  !entered.trim() || history.at(-1) === entered ? history : [...history, entered];

/** A fresh login: banner, home folder, history kept (as zsh keeps ~/.zsh_history). */
export const startSession = (now: Date, history: readonly string[] = [], nextId = 0): Session =>
  append({ rows: [], cwd: [], history, nextId }, banner(now));

export function reduce(session: Session, action: Action): Session {
  switch (action.type) {
    case 'ran':
      return {
        ...append(session, [[prompt(session.cwd), action.entered], ...action.output]),
        cwd: action.cwd,
        history: remember(session.history, action.entered),
      };
    case 'interrupt':
      return append(session, [[prompt(session.cwd), action.entered]]);
    case 'clear':
      return { ...session, rows: [] };
    case 'restart':
      return startSession(action.now, session.history, session.nextId);
  }
}
