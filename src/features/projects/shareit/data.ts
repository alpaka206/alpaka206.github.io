import type { ProjectData } from '@/features/projects/common/types';
import {
  SHAREIT_HIGHLIGHTS,
  SHAREIT_OUTCOMES,
  SHAREIT_RESPONSIBILITIES,
  SHAREIT_SECTIONS,
  SHAREIT_SUMMARY,
} from './content';
import {
  categoryChip,
  roleChip,
  skillChip,
  toolChip,
} from '@/features/projects/common/constants';

export const SHAREIT_DATA: ProjectData = {
  title: 'Share-It',
  hero: '/assets/projects/ShareIt/main/main.webp',
  summary: SHAREIT_SUMMARY,
  highlights: SHAREIT_HIGHLIGHTS,
  responsibilities: SHAREIT_RESPONSIBILITIES,
  outcomes: SHAREIT_OUTCOMES,
  skills: [
    skillChip('React'),
    skillChip('TypeScript'),
    skillChip('Recoil'),
    skillChip('axios'),
    skillChip('SockJS'),
    skillChip('STOMP'),
  ],
  tools: [
    toolChip('Visual Studio Code'),
    toolChip('Notion'),
    toolChip('Figma'),
    toolChip('Firebase'),
  ],
  period: '2024.01.25 ~ 2024.06.03',
  members: '5명',
  roles: [
    roleChip('프론트엔드 개발'),
    roleChip('퍼블리싱'),
    roleChip('기획'),
  ],
  contribution: '100%',
  category: categoryChip('WEB'),
  githubUrl: 'https://github.com/share-it-cuk/share-it-frontend',
  sections: SHAREIT_SECTIONS,
};
