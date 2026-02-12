import type { ProjectData } from '@/features/projects/common/types';
import {
  COMATCHING_HIGHLIGHTS,
  COMATCHING_OUTCOMES,
  COMATCHING_RESPONSIBILITIES,
  COMATCHING_SECTIONS,
  COMATCHING_SUMMARY,
} from './content';
import {
  categoryChip,
  roleChip,
  skillChip,
  toolChip,
} from '@/features/projects/common/constants';

export const COMATCHING_DATA: ProjectData = {
  title: 'COMATCHING',
  hero: '/assets/projects/Comatching/main.webp',
  summary: COMATCHING_SUMMARY,
  highlights: COMATCHING_HIGHLIGHTS,
  responsibilities: COMATCHING_RESPONSIBILITIES,
  outcomes: COMATCHING_OUTCOMES,
  skills: [
    skillChip('React'),
    skillChip('TypeScript'),
    skillChip('Recoil'),
    skillChip('SockJS'),
    skillChip('STOMP'),
    skillChip('Chart.js'),
    skillChip('Storybook'),
    skillChip('vanilla-extract'),
    skillChip('Vite'),
  ],
  tools: [
    toolChip('Visual Studio Code'),
    toolChip('Notion'),
    toolChip('Figma'),
    toolChip('AWS'),
  ],
  period: '2023.09.01 ~ 2024.10.18',
  membersLabel: '개발 인원',
  members: '13명',
  roles: [
    roleChip('프론트엔드 리더'),
    roleChip('아키텍처 설계'),
    roleChip('실시간 통신'),
    roleChip('성능 최적화'),
  ],
  contribution: '80%',
  result: '실사용자 2,095명 참여',
  category: categoryChip('WEB'),
  githubUrl: 'https://github.com/COMAtching/COMAtching_FE',
  sections: COMATCHING_SECTIONS,
};
