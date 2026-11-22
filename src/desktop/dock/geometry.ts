/**
 * Dock geometry, measured on macOS 27.2.1 (research/macos.md §8, and
 * real-capture/dock-main.png: a 2x capture of a Dock auto-shrunk to 64 pt
 * tiles). Every length is a ratio of the tile so the Dock keeps its proportions
 * at any size; the comments give the 64 pt values that were measured.
 */

/** The system draws an app icon's squircle 824 px wide on a 1024 px canvas (§9). */
export const SQUIRCLE = 824 / 1024;

/** macOS caps the magnified size (Dock settings slider, `largesize`) at 128 pt. */
const MAX_MAGNIFIED = 128;

export interface DockMetrics {
  /** Layout cell of one icon (64). */
  tile: number;
  /** Visible squircle inside the tile (51.5). */
  icon: number;
  /** Between tiles (3.6): squircles sit 67.6 apart, 16 pt between them. */
  gap: number;
  /** Shelf end to the first tile (9.75): the first squircle sits 16 pt in. */
  padX: number;
  /** Shelf top to the tiles (9.5): squircles sit 15.75 pt below the top. */
  padTop: number;
  /** Shelf height (82.5). */
  height: number;
  /** Shelf to the bottom of the screen (5.5). */
  bottom: number;
  /** Corner radius (21.5): the measured continuous corner spans ≈24 pt. */
  radius: number;
  /** Slot taken by a divider (27): squircle to line is ≈23.5 pt on each side. */
  divider: number;
  /** Divider line length (60.5), centred on the shelf. */
  dividerLine: number;
  /** Running indicator diameter, the same 4 pt at every Dock size. */
  dot: number;
  /** Dot centre below the squircle's bottom edge (10). */
  dotDrop: number;
  /** Tile size under the pointer at full magnification. */
  magnified: number;
}

export function dockMetrics(tile: number, magnification = true): DockMetrics {
  return {
    tile,
    icon: tile * SQUIRCLE,
    gap: tile * 0.05625,
    padX: tile * 0.1523,
    padTop: tile * 0.1484,
    height: tile * 1.289,
    bottom: tile * 0.086,
    radius: tile * 0.336,
    divider: tile * 0.42,
    dividerLine: tile * 0.945,
    dot: 4,
    dotDrop: tile * 0.157,
    magnified: magnification ? Math.max(tile, Math.min(tile * 2, MAX_MAGNIFIED)) : tile,
  };
}

/** Shelf width for `icons` tiles and `dividers` dividers, as a multiple of the tile. */
function widthPerTile(icons: number, dividers: number) {
  const m = dockMetrics(1);
  const items = icons + dividers;
  return 2 * m.padX + icons + dividers * m.divider + Math.max(items - 1, 0) * m.gap;
}

/**
 * The tile size the Dock actually uses: the preferred size, shrunk until the
 * shelf fits the screen with `margin` to spare on each side, as macOS does
 * (this Mac asks for 128 pt tiles and gets 64).
 */
export function fitTile(preferred: number, icons: number, dividers: number, screenWidth: number, margin = 8) {
  const fit = (screenWidth - margin * 2) / widthPerTile(icons, dividers);
  return Math.max(16, Math.min(preferred, Math.floor(fit * 2) / 2));
}

/** One item along the Dock, before magnification. `scales` is false for dividers. */
export interface Slot {
  start: number;
  size: number;
  scales: boolean;
}

/** Lays items out left to right from x = 0 (the shelf's left edge). */
export function layoutSlots(kinds: readonly ('tile' | 'divider')[], m: DockMetrics): Slot[] {
  let x = m.padX;
  return kinds.map((kind) => {
    const size = kind === 'divider' ? m.divider : m.tile;
    const slot = { start: x, size, scales: kind === 'tile' };
    x += size + m.gap;
    return slot;
  });
}

/** Un-magnified shelf width for these slots. */
export const shelfWidth = (slots: readonly Slot[], m: DockMetrics) => {
  const last = slots.at(-1);
  return last ? last.start + last.size + m.padX : m.padX * 2;
};

/**
 * How much of the extra size an icon gets at `distance` from the pointer: a
 * raised cosine that is 1 under the pointer and reaches 0 at `radius`.
 * macOS does not document its curve; this one is smooth at both ends, so icons
 * swell and settle without a visible kink.
 */
export function falloff(distance: number, radius: number) {
  if (radius <= 0 || Math.abs(distance) >= radius) return 0;
  return (1 + Math.cos((Math.PI * distance) / radius)) / 2;
}

/** Icons within three tiles of the pointer grow, as on macOS. */
const INFLUENCE_TILES = 3;

interface Magnified {
  /** Width of each item. */
  sizes: number[];
  /** How far each item's centre moves from its un-magnified place. */
  offsets: number[];
  /** Shelf edges, in the same coordinates as the slots. */
  left: number;
  right: number;
}

/**
 * Magnified layout for a pointer at x = `pointer` (slot coordinates).
 *
 * Sizes come from the pointer's distance to each icon's *un-magnified* centre,
 * so enlarging an icon never moves it away from the pointer (no feedback loop).
 * Positions are then laid out outward from the point under the pointer, which
 * stays fixed: the Dock stretches around the pointer the way a lens would.
 * `amount` (0..1) fades the whole effect in and out.
 */
export function magnify(slots: readonly Slot[], pointer: number, amount: number, m: DockMetrics): Magnified {
  const radius = INFLUENCE_TILES * (m.tile + m.gap);
  const sizes = slots.map((s) =>
    s.scales ? s.size + (m.magnified - s.size) * amount * falloff(pointer - (s.start + s.size / 2), radius) : s.size,
  );

  // Lay the magnified items out from 0, then find where the pointer lands.
  const starts: number[] = [];
  let x = 0;
  for (const size of sizes) {
    starts.push(x);
    x += size + m.gap;
  }
  let mapped: number | undefined;
  for (let i = 0; i < slots.length && mapped === undefined; i++) {
    const s = slots[i]!;
    const end = s.start + s.size;
    if (pointer < s.start) mapped = starts[i]! - (s.start - pointer);
    else if (pointer <= end) mapped = starts[i]! + ((pointer - s.start) / s.size) * sizes[i]!;
    else if (i === slots.length - 1) mapped = starts[i]! + sizes[i]! + (pointer - end);
  }
  const shift = pointer - (mapped ?? pointer);

  const offsets = slots.map((s, i) => starts[i]! + shift + sizes[i]! / 2 - (s.start + s.size / 2));
  const first = starts[0] ?? 0;
  const lastIndex = slots.length - 1;
  return {
    sizes,
    offsets,
    left: first + shift - m.padX,
    right: (lastIndex >= 0 ? starts[lastIndex]! + sizes[lastIndex]! : 0) + shift + m.padX,
  };
}
