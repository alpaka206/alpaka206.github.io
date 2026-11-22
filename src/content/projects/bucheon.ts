import type { Project } from '../types';

// The ~3,000 figure in old material was an expected audience, not users: never shown.
export const bucheon: Project = {
  slug: 'bucheon',
  title: 'Bucheon Friend Community',
  name: '부천 Friend Community',
  group: 'team',
  meta: '외주 프로젝트 / 2024.08 - 2024.10',
  period: '2024.08 - 2024.10',
  summary: 'COMATCHING 기반 경기장 관람객 매칭 서비스',
  lead: '경기장 입장 티켓을 어떤 환경에서도\n하나의 로그인 흐름으로 받도록 만들었습니다.',
  icon: 'icons/bucheon',
  cover: 'projects/bucheon-phone',
  tags: ['React', 'TypeScript', 'vanilla-extract', 'jsQR', 'Chart.js'],
  links: [
    {
      label: 'github.com/COMAtching/COMATCHING_FC_FE',
      href: 'https://github.com/COMAtching/COMATCHING_FC_FE',
    },
  ],
  blocks: [
    {
      type: 'columns',
      columns: [
        [
          {
            type: 'flow',
            title: 'QR 티켓 입장',
            lanes: [
              {
                nodes: [
                  {
                    title: '세 가지 입력',
                    body: '',
                    stack: [
                      { title: '카메라 스캔', body: 'jsQR, 매 프레임 해석' },
                      { title: '이미지 업로드', body: '카메라를 못 쓸 때' },
                      { title: '직접 입력', body: '코드 타이핑' },
                    ],
                  },
                  { title: '형식 검증', body: '/^T\\d{10}$/' },
                  { title: '하나의 로그인 함수', body: '쿠키 인증', key: true },
                ],
                edges: ['', ''],
              },
            ],
          },
          {
            type: 'flow',
            title: '인증 만료 처리',
            lanes: [
              {
                nodes: [
                  { title: 'API 요청', body: '쿠키 인증' },
                  { title: '만료 응답', body: 'SEC-001' },
                  { title: '재발급 한 번', body: '/auth/refresh', key: true },
                  { title: '원래 요청 재전송', body: '다시 로그인 없이' },
                ],
                edges: ['', '', ''],
              },
            ],
            note: '이미 재시도한 요청은 다시 재발급하지 않아 무한 반복을 막았습니다. 관람객 성향은 Chart.js 레이더 차트로 보여 줬습니다.',
          },
        ],
        [{ type: 'media', src: 'projects/bucheon-phone', alt: '부천 Friend Community 관람객 성향 화면', frame: 'plain' }],
      ],
    },
  ],
  keywords: ['부천', 'FC', '축구', '경기장', 'QR', '외주', '인증', '토큰'],
  pdfPages: [16],
};
