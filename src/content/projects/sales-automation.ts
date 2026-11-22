import type { Project } from '../types';

// Company work: no screenshots and no repository link (owner's decision, 2026.11.14).
export const salesAutomation: Project = {
  slug: 'sales-automation',
  title: 'Sales Automation',
  name: 'B2B 고객 문의와 세일즈 자동화',
  group: 'estsoft',
  meta: '이스트소프트 / Dubbing실',
  summary: 'React 운영 콘솔, FastAPI, Gemini',
  highlight: 'HubSpot 유료 기능 대체',
  lead: '문의 대응과 계약 관리를\n운영 콘솔로 통합했습니다.',
  icon: 'icons/sales',
  tags: [
    'React 19',
    'TypeScript',
    'TanStack Query',
    'React Router',
    'SSE',
    'Vite',
    'Vitest',
    'FastAPI',
    'PostgreSQL',
    'Gemini',
    'Vertex AI',
    'HubSpot',
    'Slack',
    'Google Sheets',
  ],
  links: [],
  blocks: [
    {
      type: 'columns',
      columns: [
        [
          {
            type: 'text',
            title: '문제',
            body: '문의와 고객 정보를 손으로 기록하고 담당자 경험에 기대어, 답장이 누락되고 진행 상황을 공유하기 어려웠습니다.',
          },
          {
            type: 'text',
            title: '해결 방향',
            body: 'AI가 내부 문서를 근거로 초안을 만들고, 담당자가 승인한 뒤에만 발송되도록 했습니다. 기록은 콘솔로 모으고, 팀이 쓰던 HubSpot과 시트는 그대로 연동했습니다.',
          },
          {
            type: 'callout',
            title: 'HubSpot 유료 기능 대체로 비용 절감',
            body: 'AI 답변 초안과 후속 관리를 콘솔에 직접 구현했습니다.',
          },
        ],
        [
          {
            type: 'bullets',
            title: '내부 문서와 AI 초안',
            items: [
              '정책, 제품 문서와 메일 템플릿을 DB에 저장해 콘솔에서 편집했습니다.',
              'Gemini에 정책 원문과 최근 대화를 한 스냅샷으로 전달해, 질문별 답변 요소를 근거에서 조합한 초안을 생성했습니다.',
              '허용된 근거만 사용했는지 검사하고, 발송 직전 정책과 대화 변경을 재확인했습니다.',
            ],
          },
          {
            type: 'bullets',
            title: '기존 업무 방식 유지',
            items: [
              '기존 HubSpot Conversations 스레드에 회신해 고객과의 대화가 끊기지 않게 했습니다.',
              'HubSpot 내부 ID 별칭으로 단계명 변경에도 파이프라인 호환성을 유지했습니다.',
              'Google Sheets의 기존 양식에 맞춰 동기화하고, 리마인더 시퀀스를 유지했습니다.',
            ],
          },
        ],
      ],
    },
    {
      type: 'flow',
      title: '처리 흐름',
      lanes: [
        {
          label: '01 접수와 초안',
          nodes: [
            { title: 'HubSpot 신규 문의', body: 'New 단계 티켓' },
            { title: 'FastAPI 워커', body: '문의 분류\n정책 원문과 최근 대화 스냅샷' },
            { title: 'Gemini 초안', body: '문의 언어 초안\n외국어는 한국어 대역' },
            { title: 'Slack 알림', body: '접수 직후\n자동 메일 미발송' },
          ],
          edges: ['웹훅\n누락 대비 10분 폴링', '근거 전달', '초안 완료'],
        },
        {
          label: '02 검토와 발송',
          nodes: [
            { title: 'React 운영 콘솔', body: '수정, 서명 선택,\n담당자 승인', key: true },
            { title: 'HubSpot 회신', body: '기존 Conversations\n스레드 회신' },
            { title: '기록', body: '메시지 ID 저장,\n티켓 단계 이동' },
            { title: 'Google Sheets', body: 'Inbound DB와\n수주 DB 동기화' },
          ],
          edges: ['발송 직전\n승인, 정책, 대화 재확인', '발송 성공', '기존 양식 유지'],
        },
      ],
    },
    {
      type: 'columns',
      columns: [
        [
          {
            type: 'bullets',
            title: '운영 콘솔 기능',
            items: [
              '검토와 회신 큐, 이메일 미리보기, 고객과 회사별 이력',
              '계약 금액, 결제 예정일, 입금일, 만료일, Invoice 관리',
              '회신 누락, 장기 미접촉, 갱신 임박, 업셀 후보 식별',
            ],
          },
        ],
        [
          {
            type: 'bullets',
            title: '도입 효과',
            items: [
              '담당자 개인만 알던 고객과 영업 정보를 팀 공용 지식으로 만들었습니다.',
              '동기화와 콘솔 통합으로 수기 입력에 따른 불일치와 사이트별 확인을 없앴습니다.',
              '후속 대상과 회신 상대를 직접 분석하지 않고 콘솔에서 바로 파악하게 했습니다.',
            ],
          },
        ],
      ],
    },
    {
      type: 'text',
      title: '운영 콘솔 프론트엔드',
      body: '여러 운영자가 같은 데이터를 보고,\n실수 없이 발송하도록 콘솔을 설계했습니다.',
    },
    {
      type: 'flow',
      title: '실시간 동기화',
      lanes: [
        {
          nodes: [
            { title: 'FastAPI 이벤트', body: 'SSE 스트림 하나를\n앱 전체가 공유' },
            { title: 'TanStack Query', body: '바뀐 범위만 무효화' },
            { title: '운영자 화면', body: '필터 변경에도\n이전 행 유지' },
            { title: '초안 편집기', body: '재조회가 와도\n입력 중인 초안을 덮지 않음', key: true },
          ],
          edges: ['300ms\n묶음', '변경 반영', '재조회와 분리'],
        },
      ],
    },
    {
      type: 'columns',
      columns: [
        [
          {
            type: 'bullets',
            title: '발송 안전장치',
            items: [
              {
                strong: '중복 발송 차단.',
                text: '진행 중 재클릭을 막고, 확인 모달에서 수신자와 발신 주소, 참조를 다시 보여 줬습니다.',
              },
              {
                strong: '번역 전 발송 차단.',
                text: "본문 언어가 문의 언어와 다르면 버튼이 '번역하기'로 바뀝니다.",
              },
              {
                strong: '낙관적 업데이트.',
                text: '단계 이동 실패 시 롤백하고, 외부 반영 여부를 세 상태로 표시했습니다.',
              },
            ],
          },
        ],
        [
          {
            type: 'bullets',
            title: '공용 컴포넌트와 검증',
            items: [
              { strong: '접근성 모달과 DataTable.', text: '포커스 트랩과 입력 보호, 제네릭 표로 구현을 통합했습니다.' },
              { strong: '경로별 ErrorBoundary.', text: '한 화면이 멈춰도 다른 화면은 동작합니다.' },
              { strong: 'Vitest 약 160건.', text: '인사이트 판정을 순수 함수로 분리해 테스트했습니다.' },
            ],
          },
        ],
      ],
    },
  ],
  keywords: ['세일즈', '영업', '자동화', 'CRM', 'HubSpot', 'Gemini', '문의', 'B2B', 'SSE'],
  pdfPages: [5, 6, 7],
};
