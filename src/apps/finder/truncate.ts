/**
 * Finder icon labels (macos.md §20): at most two lines; a name that still does
 * not fit is cut in the middle of the second line, so the end of the name and
 * its extension stay visible ("하나 소셜벤처 유니버시티" / "이수 및 우…선정.webp").
 * Widths come from a `measure` function so the logic is testable without a
 * browser; the views measure with canvas measureText in the label's own font.
 */
export type Measure = (text: string) => number;

const ELLIPSIS = '…';

/** ".pdf" for "김규원_포트폴리오.pdf"; '' for names without one (or dot files). */
export function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 && dot >= name.length - 6 && /^\.[\p{L}\p{N}]+$/u.test(name.slice(dot)) ? name.slice(dot) : '';
}

/** Largest n in [lo, hi] for which fits(n) holds, assuming fits is monotone and fits(lo) is true. */
function largest(lo: number, hi: number, fits: (n: number) => boolean): number {
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (fits(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/**
 * NSLineBreakByTruncatingMiddle: keep about as much of the start as of the end,
 * but never less of the end than `keepTail` (the extension).
 */
export function middleTruncate(text: string, maxWidth: number, measure: Measure, keepTail = ''): string {
  if (measure(text) <= maxWidth) return text;
  const chars = Array.from(text);
  const tailMin = Math.min(Array.from(keepTail).length, chars.length);
  const build = (kept: number) => {
    const tail = Math.min(kept, Math.max(Math.floor(kept / 2), tailMin));
    const head = kept - tail;
    return chars.slice(0, head).join('').trimEnd() + ELLIPSIS + (tail ? chars.slice(-tail).join('').trimStart() : '');
  };
  const kept = largest(0, chars.length - 1, (n) => n === 0 || measure(build(n)) <= maxWidth);
  return build(kept);
}

/**
 * Where a line may end: after a space, hyphen, underscore or slash. Not after
 * a period: UAX #14 keeps "장려상.webp" together, so the extension never
 * starts a line on its own. Korean breaks between words (hangulWordPriority).
 */
const BREAK_AFTER = /[\s\-_/]/;

/**
 * Splits a Finder label into its lines. Line 1 is the longest start that fits,
 * ending at a word boundary when there is one; line 2 is the rest, middle
 * truncated when it is still too wide.
 */
export function iconLabelLines(name: string, maxWidth: number, measure: Measure): string[] {
  if (measure(name) <= maxWidth) return [name];
  const chars = Array.from(name);
  const fitting = largest(1, chars.length - 1, (n) => measure(chars.slice(0, n).join('').trimEnd()) <= maxWidth);
  let end = fitting;
  for (let i = fitting; i > 0; i--) {
    if (BREAK_AFTER.test(chars[i - 1]!)) {
      end = i;
      break;
    }
  }
  const first = chars.slice(0, end).join('').trimEnd();
  const rest = chars.slice(end).join('').trimStart();
  return [first, middleTruncate(rest, maxWidth, measure, extensionOf(name))];
}

const widths = new Map<string, number>();
let context: CanvasRenderingContext2D | null | undefined;

/** Canvas measureText in a CSS font shorthand, cached per font and string. */
export function canvasMeasure(font: string): Measure {
  return (text) => {
    const key = `${font}\u0000${text}`;
    const cached = widths.get(key);
    if (cached !== undefined) return cached;
    context ??= document.createElement('canvas').getContext('2d');
    if (!context) return text.length * 7;
    context.font = font;
    const width = context.measureText(text).width;
    // While a web font is still loading the fallback face is measured: do not keep that.
    if (document.fonts.status === 'loaded') widths.set(key, width);
    return width;
  };
}

/** Fonts finished loading: cached widths may have been taken with a fallback face. */
export function clearMeasureCache() {
  widths.clear();
}
