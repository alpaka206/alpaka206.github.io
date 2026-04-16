import type { DesktopPosition } from '@/stores/desktopModels';

const DESKTOP_GRID_ORIGIN = { x: 28, y: 28 } as const;
const DESKTOP_GRID_STEP = { x: 110, y: 124 } as const;
const DESKTOP_SHORTCUT_BOUNDS = { x: 140, y: 180 } as const;

type Viewport = {
  width: number;
  height: number;
};

function getDefaultViewport(): Viewport {
  if (typeof window === 'undefined') {
    return { width: 1440, height: 900 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function clampGridIndex(index: number, maxIndex: number) {
  return Math.max(0, Math.min(index, maxIndex));
}

export function snapDesktopShortcutPosition(
  position: DesktopPosition,
  viewport: Viewport = getDefaultViewport()
) {
  const maxColumn = Math.max(
    0,
    Math.floor(
      (viewport.width - DESKTOP_SHORTCUT_BOUNDS.x - DESKTOP_GRID_ORIGIN.x) /
        DESKTOP_GRID_STEP.x
    )
  );
  const maxRow = Math.max(
    0,
    Math.floor(
      (viewport.height - DESKTOP_SHORTCUT_BOUNDS.y - DESKTOP_GRID_ORIGIN.y) /
        DESKTOP_GRID_STEP.y
    )
  );

  const column = clampGridIndex(
    Math.round((position.x - DESKTOP_GRID_ORIGIN.x) / DESKTOP_GRID_STEP.x),
    maxColumn
  );
  const row = clampGridIndex(
    Math.round((position.y - DESKTOP_GRID_ORIGIN.y) / DESKTOP_GRID_STEP.y),
    maxRow
  );

  return {
    x: DESKTOP_GRID_ORIGIN.x + column * DESKTOP_GRID_STEP.x,
    y: DESKTOP_GRID_ORIGIN.y + row * DESKTOP_GRID_STEP.y,
  };
}
