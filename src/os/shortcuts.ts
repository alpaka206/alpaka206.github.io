/**
 * Shortcuts are written the way macOS menus print them ("⌥⌘H", "⇧⌘D", "⌘[")
 * and matched on the physical key (KeyboardEvent.code), so they keep working
 * while the Korean input source is active.
 */
interface Chord {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
  /** KeyboardEvent.code, e.g. "KeyW", "BracketLeft", "ArrowUp". */
  code: string;
}

const MODIFIERS: Record<string, keyof Omit<Chord, 'code'>> = { '⌃': 'ctrl', '⌥': 'alt', '⇧': 'shift', '⌘': 'meta' };

/** The non-letter keys the menus and os/keyboard.ts actually bind. */
const KEY_CODES: Record<string, string> = {
  '[': 'BracketLeft',
  ']': 'BracketRight',
  ',': 'Comma',
  '`': 'Backquote',
  '↑': 'ArrowUp',
  '↓': 'ArrowDown',
  '⌫': 'Backspace',
  '⎋': 'Escape',
  '⇥': 'Tab',
};

/** "⌥⌘H" → modifiers ["⌥", "⌘"] and key "H". */
function split(shortcut: string) {
  const [, modifiers = '', key = ''] = /^([⌃⌥⇧⌘]*)(.*)$/u.exec(shortcut) ?? [];
  return { modifiers: [...modifiers], key };
}

export function parseShortcut(shortcut: string): Chord {
  const chord: Chord = { ctrl: false, alt: false, shift: false, meta: false, code: '' };
  const { modifiers, key: rest } = split(shortcut);
  for (const modifier of modifiers) chord[MODIFIERS[modifier]!] = true;
  if (KEY_CODES[rest]) chord.code = KEY_CODES[rest]!;
  else if (/^[A-Z]$/i.test(rest)) chord.code = `Key${rest.toUpperCase()}`;
  else if (/^[1-9]$/.test(rest)) chord.code = `Digit${rest}`;
  return chord;
}

export function matches(event: Pick<KeyboardEvent, 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey' | 'code'>, shortcut: string) {
  const chord = parseShortcut(shortcut);
  return (
    chord.code === event.code &&
    chord.ctrl === event.ctrlKey &&
    chord.alt === event.altKey &&
    chord.shift === event.shiftKey &&
    chord.meta === event.metaKey
  );
}

/** Splits "⌥⌘H" into ["⌥", "⌘", "H"] for drawing each glyph in its own column like macOS menus. */
export const shortcutParts = (shortcut: string) => {
  const { modifiers, key } = split(shortcut);
  return key ? [...modifiers, key] : modifiers;
};
