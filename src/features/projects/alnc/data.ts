import type { ProjectData } from '@/features/projects/common/types';
import {
  ALNC_HIGHLIGHTS,
  ALNC_OUTCOMES,
  ALNC_RESPONSIBILITIES,
  ALNC_SECTIONS,
  ALNC_SUMMARY,
} from './content';
import {
  categoryChip,
  roleChip,
  skillChip,
  toolChip,
} from '@/features/projects/common/constants';

export const ALNC_DATA: ProjectData = {
  title: '새차처럼',
  hero: '/assets/projects/ALNC/main.webp',
  summary: ALNC_SUMMARY,
  highlights: ALNC_HIGHLIGHTS,
  responsibilities: ALNC_RESPONSIBILITIES,
  outcomes: ALNC_OUTCOMES,
  skills: [
    skillChip('React'),
    skillChip('JavaScript'),
  ],
  tools: [
    toolChip('Visual Studio Code'),
    toolChip('Notion'),
    toolChip('Figma'),
    toolChip('Firebase'),
  ],
  period: '2022.11.10 ~ 2023.08.25',
  membersLabel: '참가 인원',
  members: '4명',
  roles: [
    roleChip('프론트엔드 개발'),
    roleChip('퍼블리싱'),
    roleChip('기획'),
    roleChip('운영 및 홍보'),
  ],
  contribution: '100%',
  result: [
    '학생창업유망팅 선정 및 k-300 출정',
    '하나 소셜벤처 유니버시티 우수팀 선정',
    '가톨릭대학교 창업경진대회 장려상 수상',
  ],
  category: categoryChip('WEB'),
  sections: ALNC_SECTIONS,
};
