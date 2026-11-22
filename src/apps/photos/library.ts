import { AWARDS, PROFILE } from '@/content/profile';
import { getProject, PROJECTS } from '@/content/projects';
import type { Block, MediaKey } from '@/content/types';
import manifest from '@/media/manifest.json';

/**
 * The photo library is the site's own images, sorted into albums by where
 * they live in src/media/manifest.json, so a new screenshot appears without
 * touching this file. Alt text comes from the case studies when they describe
 * the image, otherwise from the album and the file's place in it.
 */
export type AlbumId = 'screens' | 'comatching' | 'share-it' | 'apps' | 'awards';

export interface Photo {
  key: MediaKey;
  alt: string;
}

interface Album {
  id: AlbumId;
  title: string;
  photos: Photo[];
}

const KEYS = Object.keys(manifest);

/** Alt text the case studies already give their images. */
const CONTENT_ALT = new Map<MediaKey, string>();
const collect = (blocks: readonly Block[]) => {
  for (const block of blocks) {
    if (block.type === 'media') CONTENT_ALT.set(block.src, block.alt);
    if (block.type === 'columns') block.columns.forEach(collect);
  }
};
PROJECTS.forEach((project) => collect(project.blocks));

/** What each screen of the two team projects shows (checked against the images). */
const SCREEN_NAMES: Record<string, string> = {
  charge: '포인트 충전',
  main: '메인',
  'result-overview': '매칭 결과 조회',
  'register/chat': '가입 안내',
  'register/hobby': '취미 선택',
  'register/login': '로그인',
  'register/user-info': '사용자 정보 입력',
  'matching/loading': '매칭 중',
  'matching/matching': '매칭 조건 선택',
  'matching/result': '매칭 결과',
  'admin/admin-login': '관리자 로그인',
  'admin/request': '관리자 충전 요청 목록',
  registration: '물품 등록',
  review: '리뷰',
  search: '검색어 자동완성',
  sidebar: '사이드바',
  'register/login_email': '학교 이메일 인증',
  'register/login_kakao': 'Kakao 로그인',
  'need/detail': '요청 상세',
  'need/list': '요청 목록',
  'main/main': '메인',
  'main/unlogin': '로그인 전 메인',
  'chat/chat': '채팅',
  'chat/widget': '채팅 위젯',
  'borrow/detail': '대여 상세',
  'borrow/list': '대여 목록',
};

function altFor(key: MediaKey): string {
  const known = CONTENT_ALT.get(key);
  if (known) return known;
  const [kind, ...rest] = key.split('/');
  const path = rest.join('/');
  if (kind === 'screens') {
    // The live site's address, not the repository's.
    const project = getProject(path);
    const site = project?.links.find((link) => !link.label.startsWith('github.com'))?.label ?? project?.title;
    return `${site ?? (path === 'blog' ? PROFILE.blog.label : path)} 첫 화면`;
  }
  if (kind === 'awards') {
    const award = AWARDS.find((a) => a.images.includes(key));
    if (!award) return '수상 증명서';
    const sheet = award.images.length > 1 ? ` ${award.images.indexOf(key) + 1}` : '';
    return `${award.title} 증명서${sheet}`;
  }
  const team = path.startsWith('comatching/') ? 'COMATCHING' : path.startsWith('share-it') ? 'Share-It' : undefined;
  if (team) {
    const screen = path.replace(/^(comatching|share-it)\/?/, '').replace(/^-desktop$/, '');
    return screen ? `${team} ${SCREEN_NAMES[screen] ?? screen} 화면` : `${team} 데스크톱 화면`;
  }
  const project = getProject(path.replace(/-(phone|app)$/, ''));
  return `${project?.title ?? path} 앱 화면`;
}

const photo = (key: MediaKey): Photo => ({ key, alt: altFor(key) });
const under = (prefix: string) => KEYS.filter((key) => key.startsWith(prefix));

export const ALBUMS: readonly Album[] = [
  { id: 'screens', title: '서비스 화면', photos: under('screens/').map(photo) },
  { id: 'comatching', title: 'COMATCHING', photos: under('projects/comatching/').map(photo) },
  { id: 'share-it', title: 'Share-It', photos: [...under('projects/share-it-'), ...under('projects/share-it/')].map(photo) },
  {
    id: 'apps',
    title: '앱 화면',
    photos: KEYS.filter((key) => /^projects\/[^/]+-phone$/.test(key) || key === 'projects/alarmtalk-app').map(photo),
  },
  // Newest first, as the 수상 folder and the portfolio list them.
  { id: 'awards', title: '수상', photos: AWARDS.flatMap((award) => award.images).map(photo) },
];

/** 보관함: every photo once, album by album. */
export const LIBRARY: readonly Photo[] = ALBUMS.flatMap((album) => album.photos);

export const albumById = (id: string | undefined) => ALBUMS.find((album) => album.id === id);
