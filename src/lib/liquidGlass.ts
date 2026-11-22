import { useEffect, useId, useState, type RefObject } from 'react';

/**
 * Liquid Glass refraction: the rim of a glass shape bends what is behind it.
 * Chromium can run an SVG filter on the backdrop (backdrop-filter: url(#id));
 * Safari and Firefox cannot, and no @supports query can tell the difference,
 * so the check is for User-Agent Client Hints, which only Chromium ships.
 * Everywhere else the plain blur from CSS is the (good) fallback.
 */
const canRefract = typeof navigator !== 'undefined' && 'userAgentData' in navigator;

const NEUTRAL = 128;

/** Signed distance from (x, y) to the edge of a w×h rounded rect; negative inside. */
function sdf(x: number, y: number, w: number, h: number, r: number) {
  const qx = Math.abs(x - w / 2) - (w / 2 - r);
  const qy = Math.abs(y - h / 2) - (h / 2 - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

/**
 * A displacement map (R = x, G = y, 128 = no shift) for a rounded rect. Inside a
 * `bezel`-wide band along the edge, pixels sample from further in along the
 * edge normal with a convex falloff, like light through the curved rim of a lens.
 * Rendered at half resolution; feImage stretches it back up.
 */
function displacementMap(width: number, height: number, radius: number, bezel: number): string {
  const s = 0.5;
  const w = Math.max(2, Math.round(width * s));
  const h = Math.max(2, Math.round(height * s));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const image = ctx.createImageData(w, h);
  const r = Math.min(radius, width / 2, height / 2);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const x = (i + 0.5) / s;
      const y = (j + 0.5) / s;
      const depth = -sdf(x, y, width, height, r);
      let dx = 0;
      let dy = 0;
      if (depth > 0 && depth < bezel) {
        const t = 1 - depth / bezel;
        const strength = t * t;
        const nx = sdf(x + 1, y, width, height, r) - sdf(x - 1, y, width, height, r);
        const ny = sdf(x, y + 1, width, height, r) - sdf(x, y - 1, width, height, r);
        const len = Math.hypot(nx, ny) || 1;
        dx = (-nx / len) * strength;
        dy = (-ny / len) * strength;
      }
      const p = (j * w + i) * 4;
      image.data[p] = NEUTRAL + dx * 127;
      image.data[p + 1] = NEUTRAL + dy * 127;
      image.data[p + 2] = NEUTRAL;
      image.data[p + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

function svg<K extends keyof SVGElementTagNameMap>(tag: K, attributes: Record<string, string> = {}): SVGElementTagNameMap[K] {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  return element;
}

let defs: SVGDefsElement | undefined;

function filterHost() {
  if (!defs) {
    const host = svg('svg', { 'aria-hidden': 'true', width: '0', height: '0' });
    host.style.position = 'absolute';
    defs = svg('defs');
    host.append(defs);
    document.body.append(host);
  }
  return defs;
}

interface RefractionOptions {
  radius: number;
  /** Width of the refracting rim in px. */
  bezel?: number;
  /** Maximum shift in px at the very edge. */
  strength?: number;
  enabled?: boolean;
}

/**
 * Keeps an SVG displacement filter sized to the element and returns the value
 * for `backdrop-filter` (`url(#…)`), or undefined when refraction is off.
 * The map is rebuilt after the element stops resizing (Dock magnification
 * stretches the previous map in between, which reads the same while moving).
 */
export function useRefraction(ref: RefObject<HTMLElement | null>, { radius, bezel = 18, strength = 42, enabled = true }: RefractionOptions) {
  const id = `glass${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [ready, setReady] = useState(false);
  const on = enabled && canRefract;

  useEffect(() => {
    const element = ref.current;
    if (!on || !element) return;
    const filter = svg('filter', { id, x: '0', y: '0', width: '100%', height: '100%', 'color-interpolation-filters': 'sRGB' });
    const map = svg('feImage', { result: 'map', preserveAspectRatio: 'none' });
    const displace = svg('feDisplacementMap', { in: 'SourceGraphic', in2: 'map', scale: String(strength), xChannelSelector: 'R', yChannelSelector: 'G' });
    filter.append(map, displace);
    filterHost().append(filter);

    let timer = 0;
    const rebuild = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      map.setAttribute('width', String(width));
      map.setAttribute('height', String(height));
      map.setAttribute('href', displacementMap(width, height, radius, bezel));
      setReady(true);
    };
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(rebuild, 120);
    });
    observer.observe(element);
    rebuild();
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      filter.remove();
      setReady(false);
    };
  }, [on, id, ref, radius, bezel, strength]);

  return on && ready ? `url(#${id})` : undefined;
}
