import { useRef, type ComponentPropsWithoutRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { useRefraction } from '@/lib/liquidGlass';
import styles from './Glass.module.css';

type GlassVariant = 'regular' | 'clear' | 'menu' | 'panel' | 'control';

type GlassProps<T extends ElementType> = {
  as?: T;
  variant?: GlassVariant;
  /** Bend the backdrop along the rim (Chromium only, large surfaces only: it costs a filter pass). */
  refract?: boolean;
  /** Corner radius in px; also shapes the refraction map. */
  radius: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'style' | 'children'>;

/**
 * A Liquid Glass surface: tinted, blurred and saturated backdrop, a specular
 * rim and highlight, optional lensing at the edge. "Reduce Transparency"
 * (system or Settings) swaps it for an opaque material via CSS.
 */
export function Glass<T extends ElementType = 'div'>({
  as,
  variant = 'regular',
  refract = false,
  radius,
  className,
  style,
  children,
  ...rest
}: GlassProps<T>) {
  const Tag: ElementType = as ?? 'div';
  const ref = useRef<HTMLElement>(null);
  const lens = useRefraction(ref, { radius, enabled: refract });
  return (
    <Tag
      ref={ref}
      className={[styles.glass, styles[variant], className].filter(Boolean).join(' ')}
      style={{ ...style, borderRadius: radius, ...(lens && { '--lens': lens }) } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
