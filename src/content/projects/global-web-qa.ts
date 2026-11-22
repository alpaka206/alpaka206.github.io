import type { Project } from '../types';

// The time figure covers the full-page capture stage only, not the whole QA cycle.
// "12배 이상" is 120 minutes / 10 minutes, kept as confirmed by the owner.
export const globalWebQa: Project = {
  slug: 'global-web-qa',
  title: 'Global Web QA',
  short: '웹 QA',
  name: '삼성 글로벌 91개국 웹 QA 자동화',
  group: 'ptkorea',
  meta: '펑타이그레이터차이나 / 2025.05 - 2025.09',
  period: '2025.05 - 2025.09',
  summary: 'Puppeteer 캡처, 대시보드, 웹 보고서',
  highlight: '2~3시간 → 10분 이내',
  lead: '91개국 캡처를\n2~3시간→10분 이내로 단축했습니다.',
  icon: 'icons/webqa',
  tags: ['React', 'TypeScript', 'React Query', 'Zustand', 'Puppeteer', 'PostgreSQL', 'Docker', 'n8n'],
  links: [],
  blocks: [
    {
      type: 'metrics',
      items: [
        { value: '91개국', label: '데스크톱과 모바일 검수' },
        { value: '렌더링 분석', label: '네트워크, 리페인트, 리플로우 추적' },
        { value: '12배 이상', label: '전체 캡처 시간 단축' },
      ],
    },
    {
      type: 'columns',
      columns: [
        [
          {
            type: 'text',
            title: '문제',
            body: '91개국 데스크톱과 모바일 페이지를 캡처하는 데 2~3시간이 걸렸고, 이미지 표시 지연과 리디렉션으로 검수용 이미지의 신뢰성이 낮아졌습니다.',
          },
          {
            type: 'text',
            title: '담당 역할',
            body: '네트워크와 렌더링(리페인트, 리플로우)을\n분석해 Puppeteer 캡처를 개선했습니다.',
          },
        ],
        [
          {
            type: 'chart',
            title: '전체 캡처 소요 시간',
            unit: '분',
            ticks: [0, 60, 120, 180],
            rows: [
              { label: '개선 전', value: 120, rangeTo: 180, text: '2~3시간' },
              { label: '개선 후', value: 10, text: '10분 이내', highlight: true },
            ],
          },
        ],
      ],
    },
    {
      type: 'steps',
      items: [
        {
          title: '01. 병목과 캡처 실패 분석',
          items: [
            '요청 로그, 실패 국가, 캡처 이미지를 비교했습니다.',
            '불필요한 요청, 이미지 표시 지연과 리디렉션을 구분했습니다.',
          ],
        },
        {
          title: '02. 캡처 속도와 정확도 개선',
          items: [
            '불필요한 요청을 차단하고 배치 크기, 쿠키와 리디렉션을 제어했습니다.',
            'repaint 감지와 재시도를 적용하고 검수 대상 요소를 펼쳐 캡처했습니다.',
          ],
        },
        {
          title: '03. QA 결과 검수 화면',
          items: [
            'FAIL 요소 강조, 날짜와 국가 필터, 검토와 수정 기능을 개발했습니다.',
            '무한 스크롤과 가상 스크롤로 대량 결과 탐색을 구현했습니다.',
          ],
        },
        {
          title: '04. 웹 보고서와 자동 발송',
          items: [
            '수작업 Excel 보고를 그래프 기반 웹 보고서로 전환했습니다.',
            'n8n으로 실행, 캡처, 보고서 생성과 메일 발송을 자동화했습니다.',
          ],
        },
      ],
    },
    {
      type: 'flow',
      lanes: [
        {
          nodes: [
            { title: '01 QA 실행', body: '검수 결과 수집' },
            { title: '02 자동 캡처', body: '검수 대상 시각화', key: true },
            { title: '03 수동 검토', body: '결과 확인과 수정' },
            { title: '04 보고서 발송', body: '웹 보고와 이메일' },
          ],
          edges: ['', '', ''],
        },
      ],
    },
  ],
  keywords: ['삼성', 'QA', '캡처', 'Puppeteer', '크롤링', '자동화', 'n8n', '성능', '렌더링'],
  pdfPages: [11, 12],
};
