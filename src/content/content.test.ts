import { describe, expect, it } from 'vitest';
import manifest from '@/media/manifest.json';
import { TOPICS, GREETING } from './conversation';
import { NOTES } from './notes';
import { ACTIVITIES, AWARDS, CAREER, CERTIFICATES, EDUCATION, PROFILE, SKILLS, STATS } from './profile';
import { PROJECTS } from './projects';

const ALL = { PROFILE, STATS, CAREER, EDUCATION, CERTIFICATES, ACTIVITIES, SKILLS, AWARDS, PROJECTS, TOPICS, GREETING, NOTES };

function* strings(value: unknown, path = ''): Generator<[string, string]> {
  if (typeof value === 'string') yield [path, value];
  else if (Array.isArray(value)) for (const [i, v] of value.entries()) yield* strings(v, `${path}[${i}]`);
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) yield* strings(v, path ? `${path}.${k}` : k);
}

describe('copy rules from the owner style guide', () => {
  const entries = [...strings(ALL)];

  it('never uses a spaced middle dot or an em dash as a separator', () => {
    const offenders = entries.filter(([, s]) => / · |—/.test(s));
    expect(offenders).toEqual([]);
  });

  it('publishes no phone number or birth date', () => {
    const offenders = entries.filter(([, s]) => /01[016789]-?\d{3,4}-?\d{4}|2000\.05\.17/.test(s));
    expect(offenders).toEqual([]);
  });

  it('links no private repository', () => {
    const offenders = entries.filter(([, s]) => /github\.com\/(alpaka206\/(mearri|plugin)|harucut)/i.test(s));
    expect(offenders).toEqual([]);
  });
});

describe('content integrity', () => {
  it('has unique project slugs', () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('only references images the pipeline produced', () => {
    const keys = new Set(Object.keys(manifest));
    const referenced = [
      PROFILE.portrait,
      PROFILE.avatar,
      ...AWARDS.flatMap((a) => a.images),
      ...PROJECTS.flatMap((p) => [p.icon, p.cover ?? p.icon]),
      ...PROJECTS.flatMap((p) => [...strings(p.blocks)].filter(([path]) => path.endsWith('.src')).map(([, s]) => s)),
    ];
    expect(referenced.filter((key) => !keys.has(key))).toEqual([]);
  });
});
