import { describe, expect, it } from 'vitest';
import { displacement, project, rubberband, sampleSpring, springEasing, SPRINGS } from './spring';

describe('spring', () => {
  it('settles on the target without overshoot when bounce is 0', () => {
    const samples = sampleSpring(SPRINGS.smooth);
    expect(samples.at(-1)).toBe(1);
    expect(Math.max(...samples)).toBeLessThanOrEqual(1.0001);
    expect(samples.every((v, i) => i === 0 || v >= samples[i - 1]! - 1e-9)).toBe(true);
  });

  it('overshoots once when bouncy', () => {
    expect(Math.max(...sampleSpring({ duration: 0.5, bounce: 0.28 }))).toBeGreaterThan(1.02);
  });

  it('settles in roughly the stated response time', () => {
    const { duration } = springEasing(SPRINGS.smooth);
    expect(duration).toBeGreaterThan(300);
    expect(duration).toBeLessThan(1200);
  });

  it('keeps the initial velocity of a gesture', () => {
    const p = { omega: 18, zeta: 1 };
    const v0 = 4;
    const slope = (displacement(p, 0, v0, 1e-5) - displacement(p, 0, v0, 0)) / 1e-5;
    expect(slope).toBeCloseTo(v0, 2);
  });

  it('projects a flick forward and resists past the edge', () => {
    expect(project(0, 1000)).toBeCloseTo(499, 0);
    expect(rubberband(100, 300)).toBeLessThan(100);
    expect(rubberband(-100, 300)).toBeGreaterThan(-100);
  });
});
