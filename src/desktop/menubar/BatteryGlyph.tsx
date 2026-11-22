import { useId } from 'react';

/** A lightning bolt centred on the battery body. */
const BOLT = 'M12.4 1.4 7.4 6.9h3.5l-.7 3.7 5-5.5h-3.5z';

/**
 * The macOS 27 menu bar battery, measured from a capture of this Mac's menu
 * bar: 23.5 pt wide with the dimmed cap, 3.6 pt body corners, filled to the
 * real level. While charging, a bolt sits over the fill with a hairline gap.
 */
export function BatteryGlyph({ level, charging }: { level: number; charging: boolean }) {
  // useId() may contain characters that url(#…) does not accept.
  const gap = `battery${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const width = 17.4 * Math.min(1, Math.max(0.06, level));
  return (
    <svg width="23.5" height="11.3" viewBox="0 0 25 12" aria-hidden="true">
      <mask id={gap}>
        <rect width="25" height="12" fill="#fff" />
        {charging && <path d={BOLT} fill="#000" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" />}
      </mask>
      <g mask={`url(#${gap})`} fill="currentColor">
        <rect x="0.6" y="0.6" width="21.6" height="10.8" rx="3.6" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
        <path d="M23.4 4.1a1.5 1.5 0 0 1 1.1 1.45v.9a1.5 1.5 0 0 1-1.1 1.45z" fillOpacity="0.4" />
        <rect x="2.5" y="2.5" width={width} height="7" rx="1.8" />
      </g>
      {charging && <path d={BOLT} fill="currentColor" />}
    </svg>
  );
}
