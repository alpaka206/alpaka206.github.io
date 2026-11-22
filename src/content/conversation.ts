import type { ProjectSlug } from './types';

/**
 * The scripted Messages conversation. Every answer restates facts from the
 * portfolio; nothing here may say more than the project pages do.
 */
export type Attachment =
  | { kind: 'project'; slug: ProjectSlug }
  | { kind: 'note'; note: NoteId }
  | { kind: 'profile' }
  | { kind: 'pdf' }
  | { kind: 'mail' };

export type NoteId = 'how-built' | 'skills' | 'education' | 'shortcuts';

export interface Topic {
  id: string;
  question: string;
  replies: string[];
  attachment?: Attachment;
}

export const GREETING = ['안녕하세요, 김규원입니다 👋', '아래에서 궁금한 걸 골라 주세요.'];

export const TOPICS: readonly Topic[] = [
  {
    id: 'who',
    question: '어떤 일을 하세요?',
    replies: [
      'AI 기능을 실제 업무와 서비스로 연결하는 개발자예요.',
      '지금은 이스트에이드 AI 프로덕트 연구소에서 vonvon, mevu, 알려ZUM을 개발하고 운영해요.',
    ],
    attachment: { kind: 'profile' },
  },
  {
    id: 'best',
    question: '대표 프로젝트는요?',
    replies: [
      'Premiere Pro AI 더빙 플러그인이요. React UI는 원격 WebView로, Premiere 조작은 UXP 호스트로 나눴고 3개월간 840명이 썼어요.',
    ],
    attachment: { kind: 'project', slug: 'premiere-plugin' },
  },
  {
    id: 'qa',
    question: '삼성 QA 자동화는 어떤 일이었어요?',
    replies: [
      '91개국 데스크톱과 모바일 페이지 캡처가 2~3시간 걸렸어요. 네트워크와 렌더링을 분석해 Puppeteer 캡처를 개선했고, 10분 이내로 줄였어요.',
      '불필요한 요청 차단, 배치 크기 조정, repaint 감지와 재시도를 넣었어요.',
    ],
    attachment: { kind: 'project', slug: 'global-web-qa' },
  },
  {
    id: 'ai',
    question: 'AI 기능은 어떻게 붙였어요?',
    replies: [
      '세일즈 자동화에서는 Gemini가 정책 원문과 최근 대화를 근거로 초안을 쓰고, 담당자가 승인한 뒤에만 발송되게 했어요.',
      'Mearri에서는 모델을 비교하고 문맥 번역, 용어집, 자막 분할, 품질 검증 단계로 프롬프트를 고도화했어요.',
    ],
    attachment: { kind: 'project', slug: 'sales-automation' },
  },
  {
    id: 'apps',
    question: '앱도 만들어요?',
    replies: [
      '네. AlarmTalk Android 앱은 Kotlin과 Jetpack Compose로, iOS 앱은 SwiftUI로 만들었어요. 300명 이상이 썼어요.',
    ],
    attachment: { kind: 'project', slug: 'alarmtalk' },
  },
  {
    id: 'stack',
    question: '주로 쓰는 기술은요?',
    replies: [
      'React, TypeScript, Next.js App Router로 화면과 운영 콘솔을 만들어요.',
      '서버 상태는 React Query, UI 상태는 Zustand와 Recoil로 나누고, 테스트는 Jest, Vitest, Playwright를 써요.',
    ],
    attachment: { kind: 'note', note: 'skills' },
  },
  {
    id: 'site',
    question: '이 사이트는 어떻게 만들었어요?',
    replies: [
      'React와 TypeScript로 직접 만들었어요. 창 관리, Dock 확대, 스프링 애니메이션은 라이브러리 없이 구현했어요.',
    ],
    attachment: { kind: 'note', note: 'how-built' },
  },
  {
    id: 'pdf',
    question: '포트폴리오 PDF 받을 수 있어요?',
    replies: ['네, 20쪽짜리 PDF예요.'],
    attachment: { kind: 'pdf' },
  },
  {
    id: 'contact',
    question: '연락하고 싶어요',
    replies: ['gyuwon05@gmail.com으로 메일 주세요.'],
    attachment: { kind: 'mail' },
  },
];
