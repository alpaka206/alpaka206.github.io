import type { Project } from '../types';

// Shared work: do not present the OCR model or the whole backend as solo work.
export const imageQa: Project = {
  slug: 'image-qa',
  title: 'Image QA Console',
  short: '이미지 QA',
  name: '삼성 샵앱 31개국 이미지 QA 운영 시스템',
  group: 'ptkorea',
  meta: '펑타이그레이터차이나 / 2024.12 - 2025.09',
  period: '2024.12 - 2025.09',
  summary: 'React Query와 Zustand 운영 콘솔',
  lead: '31개국 이미지 QA\n관리 콘솔을 개발했습니다.',
  icon: 'icons/imageqa',
  tags: ['React', 'TypeScript', 'React Query', 'Zustand', 'FastAPI', 'Docker', 'Jenkins'],
  links: [],
  blocks: [
    {
      type: 'columns',
      columns: [
        [
          {
            type: 'bullets',
            title: '구현',
            items: [
              'OCR 로직을 고도화해 글자 인식률을 높였습니다.',
              '관리자와 운영자가 이미지 위에 텍스트를 넣는 캔버스 편집기를 구현했습니다.',
              '검수 결과에 오류 위치와 원인을 표시했습니다.',
              '국가별 QA 현황 화면과 관리자 대시보드를 개발했습니다.',
            ],
          },
          {
            type: 'text',
            title: '참여 범위',
            body: '프론트엔드를 맡고, FastAPI 연동, 일부 OCR 로직, Jenkins와 Docker 기반 CI/CD 구성에 참여했습니다.',
          },
        ],
        [
          {
            type: 'split',
            title: '상태의 책임 분리',
            body: '서버 검수 결과는 React Query로, 선택 이미지와 필터, 수정 중인 UI 상태는 Zustand로 나눠 관리했습니다.',
            columns: [
              { title: 'React Query', body: '서버 검수 결과\n조회와 변경 요청' },
              { title: 'Zustand', body: '선택 이미지와 필터\n비교 및 수정 UI 상태' },
            ],
          },
        ],
      ],
    },
  ],
  keywords: ['삼성', 'QA', 'OCR', '이미지', '대시보드', '캔버스', 'React Query', 'Zustand'],
  pdfPages: [13],
};
