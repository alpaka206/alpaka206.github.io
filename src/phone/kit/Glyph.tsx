import type { ComponentProps } from 'react';
import { Symbol } from '@/ui/Symbol';

/**
 * Sizes a Symbol by SF Symbols point size, the unit Apple's kits use.
 * Measured with AppKit: a 17 pt `circle` draws 20 pt (12 → 14, 21 → 25, so
 * about 1.18 × the point size), and Symbol's 24-unit box holds that same ink
 * in 18.6 units. A P-point symbol is therefore a Symbol 1.52 × P wide.
 */
const symbolSize = (pt: number) => Math.round(pt * 1.52 * 10) / 10;

type GlyphProps = Pick<ComponentProps<typeof Symbol>, 'name' | 'weight' | 'className'> & {
  /** SF Symbols point size, as in the kit ("symbol 18 pt Semibold"). Always decorative. */
  pt: number;
};

export function Glyph({ pt, ...symbol }: GlyphProps) {
  return <Symbol size={symbolSize(pt)} {...symbol} />;
}
