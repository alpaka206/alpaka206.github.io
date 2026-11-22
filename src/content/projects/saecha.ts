import type { Project } from '../types';

export const saecha: Project = {
  slug: 'saecha',
  title: '새차처럼',
  short: '새차처럼',
  name: '새차처럼 손세차 예약',
  group: 'team',
  meta: '팀 프로젝트 / 2022.10 - 2023.08',
  period: '2022.10 - 2023.08',
  summary: '위치 기반 업체 조회와 예약',
  lead: '위치 기반 손세차 업체 조회와 예약 화면 개발',
  icon: 'icons/saecha',
  cover: 'projects/saecha-phone',
  tags: ['React', 'JavaScript', 'Firebase'],
  links: [],
  blocks: [
    {
      type: 'columns',
      columns: [
        [
          {
            type: 'bullets',
            items: [
              '날짜와 시간 선택, 업체 정보와 예약 상태 관리',
              '기획자와 디자이너 피드백을 반영한 UI 개선',
            ],
          },
        ],
        [{ type: 'media', src: 'projects/saecha-phone', alt: '새차처럼 업체 목록 화면', frame: 'plain' }],
      ],
    },
  ],
  keywords: ['세차', '예약', '위치', '지도', 'Firebase', '창업'],
  pdfPages: [17],
};
