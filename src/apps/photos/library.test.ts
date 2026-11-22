import { describe, expect, it } from 'vitest';
import { ALBUMS, albumById, LIBRARY } from './library';

describe('photo library', () => {
  it('fills every album and lists each photo once in the library', () => {
    for (const album of ALBUMS) expect(album.photos.length, album.title).toBeGreaterThan(0);
    const keys = LIBRARY.map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('sorts images into albums by their place in the media folder', () => {
    expect(albumById('comatching')!.photos.every((p) => p.key.startsWith('projects/comatching/'))).toBe(true);
    expect(albumById('share-it')!.photos.map((p) => p.key)).toContain('projects/share-it-desktop');
    expect(albumById('apps')!.photos.map((p) => p.key)).toEqual(
      expect.arrayContaining(['projects/alarmtalk-app', 'projects/comatching-phone', 'projects/saecha-phone', 'projects/bucheon-phone']),
    );
    expect(albumById('nope')).toBeUndefined();
  });

  it('describes every photo, reusing the case studies’ alt text', () => {
    for (const photo of LIBRARY) {
      expect(photo.alt, photo.key).toMatch(/\S/);
      expect(photo.alt, photo.key).not.toMatch(/[/_]|undefined/);
    }
    const alt = (key: string) => LIBRARY.find((p) => p.key === key)?.alt;
    expect(alt('screens/mearri')).toBe('mearri.com 첫 화면');
    expect(alt('projects/comatching/matching/result')).toBe('COMATCHING 매칭 결과 화면');
    expect(alt('awards/2023-hana-social-venture-university-outstanding-team-2')).toBe(
      '하나 소셜벤처 유니버시티 이수 및 우수팀 선정 증명서 2',
    );
  });
});
