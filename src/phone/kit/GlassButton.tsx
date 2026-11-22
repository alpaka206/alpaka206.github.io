import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Glass } from '@/ui/Glass';
import type { SymbolName } from '@/ui/Symbol';
import { Glyph } from './Glyph';
import styles from './GlassButton.module.css';

/** Kit heights (ios.md §7): 44 nav bar circles, 48 bottom toolbar, 28 glass text buttons. */
type GlassButtonSize = 28 | 44 | 48;

/** Symbol point size per button height: 17 pt Medium in 44 and 48 pt buttons (K27 toolbars). */
const GLYPH_PT: Record<GlassButtonSize, number> = { 28: 13, 44: 17, 48: 17 };

interface Common {
  /** Accessible name; also the tooltip of icon-only buttons. */
  label: string;
  icon?: SymbolName;
  /** Visible text. Without it the button is a circle with just the icon. */
  children?: ReactNode;
  size?: GlassButtonSize;
  /** Tinted with the accent colour, the kit's "Prominent" style. */
  prominent?: boolean;
  className?: string;
}

type GlassButtonProps =
  | (Common & Omit<ComponentPropsWithoutRef<'button'>, keyof Common | 'type'> & { href?: undefined })
  | (Common & Omit<ComponentPropsWithoutRef<'a'>, keyof Common> & { href: string });

/** A Liquid Glass button; renders a link when given `href`. */
export function GlassButton(props: GlassButtonProps) {
  const { label, icon, children, size = 44, prominent = false, className, ...native } = props;
  const look = {
    radius: size / 2,
    variant: 'control' as const,
    className: [styles.button, children ? styles.text : styles.round, className].filter(Boolean).join(' '),
    'data-size': size,
    'data-prominent': prominent || undefined,
    'aria-label': children ? undefined : label,
    title: children ? undefined : label,
  };
  const content = (
    <>
      {icon && <Glyph name={icon} pt={GLYPH_PT[size]} weight="medium" />}
      {children}
    </>
  );
  if (native.href !== undefined) {
    return (
      <Glass as="a" {...look} {...(native as ComponentPropsWithoutRef<'a'>)}>
        {content}
      </Glass>
    );
  }
  return (
    <Glass as="button" type="button" {...look} {...(native as ComponentPropsWithoutRef<'button'>)}>
      {content}
    </Glass>
  );
}
