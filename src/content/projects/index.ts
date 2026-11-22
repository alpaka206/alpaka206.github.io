import type { Project, ProjectGroup, ProjectGroupId, ProjectSlug } from '../types';
import { alarmtalk } from './alarmtalk';
import { bucheon } from './bucheon';
import { comatching } from './comatching';
import { eastaid } from './eastaid';
import { globalWebQa } from './global-web-qa';
import { harucut } from './harucut';
import { imageQa } from './image-qa';
import { mearri } from './mearri';
import { premierePlugin } from './premiere-plugin';
import { saecha } from './saecha';
import { salesAutomation } from './sales-automation';
import { shareIt } from './share-it';

/** Newest first, the same order as the portfolio PDF's table of contents. */
export const PROJECTS: readonly Project[] = [
  eastaid,
  premierePlugin,
  salesAutomation,
  mearri,
  alarmtalk,
  harucut,
  globalWebQa,
  imageQa,
  comatching,
  bucheon,
  shareIt,
  saecha,
];

export const PROJECT_GROUPS: readonly ProjectGroup[] = [
  { id: 'eastaid', title: '이스트에이드', period: '2026.10 - 현재' },
  { id: 'estsoft', title: '이스트소프트', period: '2026.04 - 2026.10, 일부 계속 운영' },
  { id: 'live', title: '운영 중인 서비스' },
  { id: 'ptkorea', title: '펑타이그레이터차이나', period: '2024.12 - 2025.09' },
  { id: 'team', title: '팀, 외주, 개인 프로젝트' },
];

const bySlug = new Map(PROJECTS.map((project) => [project.slug, project]));

export function getProject(slug: string): Project | undefined {
  return bySlug.get(slug as ProjectSlug);
}

export function projectsInGroup(group: ProjectGroupId): Project[] {
  return PROJECTS.filter((project) => project.group === group);
}

/** Featured on the desktop widget and the phone home screen. */
export const FEATURED: readonly ProjectSlug[] = [
  'premiere-plugin',
  'sales-automation',
  'mearri',
  'alarmtalk',
  'harucut',
  'global-web-qa',
];
