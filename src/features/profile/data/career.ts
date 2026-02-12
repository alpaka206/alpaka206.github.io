import type { CareerEntry } from '../types';

export const CAREER: CareerEntry[] = [
  {
    org: 'PTKOREA (펑타이그레이터차이나)',
    period: '2024.12 ~ 2025.09',
    role: 'DSG-T9 인턴/프로',
    highlights: [
      '글로벌 QA 자동화 시스템 2건(31개국/91개국) 구축에 참여',
      '대규모 캡처/검수 파이프라인과 운영 대시보드 구현',
      'QA 운영 효율 및 가시성 향상에 기여',
    ],
    stacks: [
      'React',
      'TypeScript',
      'Zustand',
      'React Query',
      'Puppeteer',
      'FastAPI',
      'PostgreSQL',
      'Docker',
      'Jenkins',
      'n8n',
    ],
    projects: [
      {
        title: '삼성 샵앱 31개국 이미지 사전 QA 자동화',
        summary:
          'OCR 기반 이미지 검수 자동화와 국가별 QA 운영 현황을 관리하는 대시보드 구축',
        contributions: [
          'OCR 기반 QA 화면 및 결과/수정 안내 UI 구현',
          '관리자 대시보드로 국가별 진행 현황 및 코드 관리 UI 개발',
          '회원가입/로그인, 이미지 업로드·에디터·QA 시각화 페이지 개발',
          'React Query + Zustand 상태 구조 설계',
          'FastAPI 연동 구조 설계 및 일부 백엔드/CI 참여',
        ],
        outcomes: [
          'QA 결과와 운영 현황을 통합 관리하는 구조로 운영 효율 개선',
          '수작업 검수 비용 및 확인 시간 감소',
        ],
        stacks: [
          'React',
          'TypeScript',
          'Zustand',
          'React Query',
          'FastAPI',
          'PostgreSQL',
          'Docker',
          'Jenkins',
        ],
      },
      {
        title: '삼성 글로벌 페이지 91개국 사후 QA 자동화',
        summary:
          'UI/이미지/텍스트 요소 자동 검수, QA 결과 검토 및 레포트 자동화를 포함한 운영 시스템',
        contributions: [
          'Puppeteer 기반 캡처 로직 설계 및 성능 고도화(병렬 배치, 재시도)',
          'QA 결과 검수/수정 운영자 대시보드 구현',
          '무한/가상 스크롤 적용으로 대량 데이터 UX 최적화',
          '웹 레포트 자동 생성 및 시각화 적용',
          'n8n 기반 QA → 캡처 → 레포트 → 이메일 자동화',
        ],
        outcomes: [
          '전체 캡처 2~3시간 → 10분 이내로 단축',
          'QA 처리 시간 및 운영 리소스 대폭 절감',
        ],
        stacks: [
          'React',
          'TypeScript',
          'Zustand',
          'React Query',
          'Puppeteer',
          'PostgreSQL',
          'Docker',
          'Jenkins',
          'n8n',
        ],
      },
    ],
  },
  {
    org: 'H2Biz',
    period: '2024.06 ~ 2024.08',
    role: '개발팀 학생 인턴',
    highlights: [
      '프로젝트 구조 파악 및 리팩토링 보조',
      '프론트엔드 최신 기술 습득 및 협업 프로세스 학습',
      '과제 수행 및 백엔드 기초 개발 학습',
    ],
  },
];
