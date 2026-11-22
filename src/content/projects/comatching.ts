import type { Project } from '../types';

// 2,095명 = total users across all versions. 30%+ = initial load, measured with Lighthouse.
export const comatching: Project = {
  slug: 'comatching',
  title: 'COMATCHING',
  name: 'COMATCHING 축제용 실시간 매칭 서비스',
  group: 'team',
  meta: '팀 프로젝트 / 2023.09 - 2024.10',
  period: '2023.09 - 2024.10',
  summary: '프론트엔드 리더, 실시간 매칭',
  highlight: '총 사용자 2,095명',
  lead: '축제용 실시간 매칭 서비스의\n프론트엔드를 이끌었습니다.',
  icon: 'apps/comatching',
  cover: 'projects/comatching-phone',
  tags: ['React', 'TypeScript', 'Recoil', 'SockJS / STOMP', 'Vite'],
  links: [
    { label: 'github.com/COMAtching', href: 'https://github.com/COMAtching' },
    { label: 'comatching.site', href: 'https://comatching.site/' },
  ],
  blocks: [
    {
      type: 'columns',
      columns: [
        [
          {
            type: 'metrics',
            items: [
              { value: '2,095명', label: '총 사용자 / 전 버전 합산' },
              { value: '30%+', label: 'Lighthouse 기준 초기 로딩 개선' },
            ],
          },
          {
            type: 'bullets',
            title: '프론트엔드 리더',
            items: [
              '기획, 프론트엔드 설계, 사용자와 관리자 화면 개발',
              'Kakao OAuth와 JWT 역할별 라우팅, axios 인터셉터의 만료 처리',
              '사용자 QR 코드를 관리자가 스캔하면 포인트를 조회해 바로 매칭으로 진입',
              '코드 스플리팅, Lazy Loading과 Storybook UI 문서화',
            ],
          },
        ],
        [{ type: 'media', src: 'projects/comatching-phone', alt: 'COMATCHING 매칭 결과 화면', frame: 'plain' }],
      ],
    },
    {
      type: 'compare',
      title: '포인트 상태 통합',
      body: '화면마다 다르던 포인트 잔액을 공유 상태 하나로 맞췄습니다.',
      before: {
        title: '수정 전',
        rows: [
          { label: '메인', value: '이전 잔액\n화면 안에 따로 저장' },
          { label: '매칭', value: '새 잔액\n요청 후 갱신' },
          { label: '결과', value: '새 잔액\n요청 후 갱신' },
        ],
      },
      after: {
        title: '수정 후',
        caption: 'userState (Recoil atom)\n모든 화면이 같은 상태를 구독',
        rows: [
          { label: '메인', value: '같은 잔액' },
          { label: '매칭', value: '같은 잔액' },
          { label: '결과', value: '같은 잔액' },
        ],
      },
    },
    {
      type: 'cards',
      items: [
        {
          tone: 'cause',
          title: '원인',
          subtitle: '메인 화면이 사용자 정보를 따로 보관',
          body: 'QA 중 포인트가 바뀐 뒤에도 메인에만 이전 잔액이 남는 것을 발견했습니다.',
        },
        {
          tone: 'fix',
          title: '수정',
          subtitle: 'Recoil 공유 상태 하나로 통합',
          body: '매칭 요청 전에 잔액을 먼저 확인하고, 서버가 돌려준 잔액으로 상태를 한 번만 갱신했습니다.',
        },
        {
          tone: 'result',
          title: '결과',
          subtitle: '모든 화면이 같은 잔액 표시',
          body: '메인, 매칭, 결과 화면이 같은 상태를 읽어 잔액이 어긋나지 않습니다.',
        },
      ],
    },
    {
      type: 'columns',
      columns: [
        [
          {
            type: 'text',
            title: '로딩 순서 개선',
            body: '고정 2초 타이머 대신 요청이 진행되는 동안만 로더를 보여 주고, 응답 뒤 결과로 이동하게 했습니다.',
          },
        ],
        [
          {
            type: 'text',
            title: '프론트엔드 기반',
            body: 'v3를 Vite와 vanilla-extract로 새로 구성하고, 인앱 브라우저를 감지해 외부 브라우저로 열었습니다.',
          },
        ],
      ],
    },
  ],
  keywords: ['코매칭', '매칭', '축제', 'Recoil', 'STOMP', 'Lighthouse', '성능', '리더'],
  pdfPages: [14, 15],
};
