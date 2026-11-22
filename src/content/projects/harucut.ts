import type { Project } from '../types';

// No users yet: no usage numbers. No repository link (owner's decision, 2026.11.15).
export const harucut: Project = {
  slug: 'harucut',
  title: 'Harucut / 하루컷',
  short: '하루컷',
  name: '온라인 네컷 사진 서비스 하루컷',
  group: 'live',
  meta: '운영 중인 서비스 / 2024.07 - 현재 / harucut.com',
  period: '2024.07 - 현재',
  summary: 'Next.js, Konva 편집, BFF와 계약 CI',
  highlight: '2026.10 웹 출시',
  lead: '온라인 네컷 사진 서비스의 웹과 앱을 단독 개발해\n2026년 10월 웹을 출시했습니다.',
  icon: 'apps/harucut',
  cover: 'screens/harucut',
  tags: ['Next.js', 'React', 'TypeScript', 'Zustand', 'Konva', 'IndexedDB', 'Expo', 'Playwright'],
  links: [{ label: 'harucut.com', href: 'https://www.harucut.com/' }],
  blocks: [
    {
      type: 'flow',
      title: '구조',
      lanes: [
        {
          nodes: [
            { title: '촬영', body: 'getUserMedia,\nIndexedDB 24시간 보관' },
            { title: 'Konva 편집', body: '프레임, 스티커, 레이어,\n비회원 캔버스 합성' },
            { title: 'Next.js BFF', body: 'CSRF 검사, 캐시 차단,\nCI 계약 검사', key: true },
            { title: 'Spring 백엔드', body: '서버 합성과 저장,\n팀원 개발' },
          ],
          edges: ['네 컷\n선택', '회원\n원본 4장', '검증된\n요청'],
        },
      ],
    },
    {
      type: 'columns',
      columns: [
        [
          {
            type: 'bullets',
            items: [
              'Expo 웹뷰로 웹을 재사용하고, 사진첩 저장 시 blob을 base64 청크로 변환해 네이티브에 전달했습니다.',
              'Jest 단위 테스트 1,000건 이상과 Playwright E2E로 데스크톱, 모바일 Chrome, iPhone WebKit을 검사합니다.',
              '행사 촬영 기능을 웹과 백엔드(Spring Boot)에 개발 중입니다.',
            ],
          },
        ],
        [{ type: 'media', src: 'screens/harucut', alt: 'harucut.com 첫 화면', frame: 'browser' }],
      ],
    },
  ],
  keywords: ['하루컷', '네컷', '사진', '포토부스', 'Konva', 'Expo', '웹뷰'],
  pdfPages: [10],
};
