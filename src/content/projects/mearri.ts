import type { Project } from '../types';

// The repository is private: link the live service only.
export const mearri: Project = {
  slug: 'mearri',
  title: 'Mearri',
  short: 'Mearri',
  name: 'YouTube 다국어 자막 서비스 Mearri',
  group: 'estsoft',
  meta: '이스트소프트에서 Perso API 사업 모델로 개발 / mearri.com',
  summary: 'Next.js, Cloud Run 워커, YouTube API',
  highlight: '크레딧 원장, 작업 큐',
  lead: '영상을 올리면 워커가 자막을 만들어,\n26개 언어로 YouTube에 게시합니다.',
  icon: 'apps/mearri',
  cover: 'screens/mearri',
  tags: ['Next.js', 'TypeScript', 'React Query', 'Zustand', 'Zod', 'PostgreSQL', 'Cloud Run', 'YouTube API'],
  links: [{ label: 'mearri.com', href: 'https://mearri.com/' }],
  blocks: [
    {
      type: 'flow',
      title: '처리 구조',
      lanes: [
        {
          nodes: [
            { title: 'Next.js 웹', body: '자막 작업 위저드,\nOAuth와 서버 세션' },
            { title: 'Postgres 작업 큐', body: '작업 상태와\n크레딧 원장', key: true },
            { title: 'Cloud Run Job 워커', body: '음성 인식, 번역 호출,\n동시성 제한과 재시도' },
            { title: 'YouTube Data API', body: '정식 자막 트랙 게시,\nAnalytics 통계' },
          ],
          edges: ['영상 길이만큼\n크레딧 예약', 'SKIP LOCKED로\n작업을 하나씩 점유', '완성된\n자막'],
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
              '크레딧은 예약, 차감, 환불, 소멸을 한 원장에 기록하고, 결제는 PortOne V2와 KG이니시스로 연동했습니다.',
              '번역 품질을 높이기 위해 모델을 비교하고, 문맥 번역, 용어집, 자막 분할, 품질 검증 단계별로 프롬프트를 고도화했습니다.',
              'Perso API QA에서 오류를 찾아 수정하고, 기능을 제안해 개발했습니다.',
              'Zod로 요청을 검증하고, Vitest와 실제 Postgres 통합 테스트를 배포 전 실행했습니다.',
            ],
          },
        ],
        [{ type: 'media', src: 'screens/mearri', alt: 'mearri.com 첫 화면', frame: 'browser' }],
      ],
    },
  ],
  keywords: ['메아리', '자막', '번역', 'YouTube', '유튜브', '결제', '크레딧', 'SaaS'],
  pdfPages: [8],
};
