import type { Project } from '../types';

export const shareIt: Project = {
  slug: 'share-it',
  title: 'Share-It',
  name: 'Share-It 교내 물품 대여 플랫폼',
  group: 'team',
  meta: '팀 프로젝트 / 2024.01 - 2024.06',
  period: '2024.01 - 2024.06',
  summary: '채팅 화면, 검색어 자동완성, Kakao 로그인',
  lead: '교내 물품 대여 플랫폼의 프론트엔드 개발',
  icon: 'apps/share-it',
  cover: 'projects/share-it/main/main',
  tags: ['React', 'Recoil', 'styled-components'],
  links: [
    {
      label: 'github.com/share-it-cuk/share-it-frontend',
      href: 'https://github.com/share-it-cuk/share-it-frontend',
    },
  ],
  blocks: [
    {
      type: 'columns',
      columns: [
        [
          {
            type: 'bullets',
            items: [
              '채팅 화면, 검색어 자동완성과 최근 검색 기록, Kakao 로그인',
              '회원가입 로직을 useRegister 훅과 검증 유틸로 분리',
            ],
          },
        ],
        [{ type: 'media', src: 'projects/share-it/main/main', alt: 'Share-It 메인 화면', frame: 'browser' }],
      ],
    },
  ],
  keywords: ['쉐어잇', '대여', '중고', '채팅', '검색', '교내'],
  pdfPages: [17],
};
