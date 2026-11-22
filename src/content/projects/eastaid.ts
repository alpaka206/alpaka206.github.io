import type { Project } from '../types';

// No quantitative results are confirmed for the current company yet: keep it to duties.
export const eastaid: Project = {
  slug: 'eastaid',
  title: '이스트에이드',
  short: '이스트에이드',
  name: '이스트에이드 AI 프로덕트 연구소',
  group: 'eastaid',
  meta: 'AI 프로덕트 연구소 / 계약직 / 팀원',
  period: '2026.10.13 - 현재',
  summary: 'vonvon, mevu, 알려ZUM',
  highlight: '프론트엔드와 백엔드 개발, 프롬프트 고도화, 확장 프로그램과 크롤링',
  lead: '3개 서비스 개발과 운영',
  icon: 'icons/projects',
  tags: [],
  links: [],
  blocks: [
    {
      type: 'bullets',
      title: '담당 서비스',
      items: [
        { strong: 'vonvon.', text: '프론트엔드와 백엔드 개발, 새 버전 출시와 운영' },
        { strong: 'mevu.', text: '프롬프트 고도화와 영업 자동화' },
        { strong: '알려ZUM.', text: '확장 프로그램과 백엔드 개발, 크롤링' },
      ],
    },
  ],
  keywords: ['현재', '지금', '회사', 'vonvon', 'mevu', '알려줌', 'ZUM'],
  pdfPages: [2],
};
