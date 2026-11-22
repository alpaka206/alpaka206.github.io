import { create } from 'zustand';
import { GREETING, TOPICS, type Attachment, type Topic } from '@/content/conversation';
import { getNote } from '@/content/notes';
import { PROFILE } from '@/content/profile';
import { getProject } from '@/content/projects';
import type { MediaKey } from '@/content/types';
import type { AppId, AppProps } from '@/os/apps';

export interface ChatMessage {
  id: number;
  from: 'me' | 'them';
  text?: string;
  attachment?: Attachment;
  time: Date;
}

const FALLBACK: Topic = {
  id: 'fallback',
  question: '',
  replies: ['그 질문은 아직 답을 준비하지 못했어요. 메일로 물어봐 주시면 직접 답할게요.'],
  attachment: { kind: 'mail' },
};

/** Words that route a typed question to a scripted topic. */
const KEYWORDS: Record<string, string[]> = {
  who: ['누구', '어떤 일', '하는 일', '소개', '직무', '무슨 일'],
  best: ['대표', '자신', '플러그인', 'premiere', '프리미어', '더빙'],
  qa: ['삼성', 'qa', '캡처', 'puppeteer', '91'],
  ai: ['ai', 'gemini', 'llm', '프롬프트', '인공지능', '자동화'],
  apps: ['앱', 'ios', 'android', 'swift', 'kotlin', '알람', 'alarmtalk'],
  stack: ['기술', '스택', 'react', 'typescript', 'next', '프레임워크'],
  site: ['사이트', '홈페이지', '어떻게 만들', '구현'],
  pdf: ['pdf', '이력서', 'resume', '다운', '포트폴리오'],
  contact: ['연락', '메일', '이메일', '채용', '면접', '제안'],
};

/** The topic whose keywords appear most often wins; ties go to the earlier topic. */
export function matchTopic(text: string): Topic {
  const q = text.toLowerCase();
  let best: Topic = FALLBACK;
  let bestScore = 0;
  for (const topic of TOPICS) {
    const score = KEYWORDS[topic.id]?.filter((word) => q.includes(word)).length ?? 0;
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}

/** Typing time for a bubble: long enough to read as typing, short enough not to annoy. */
const delayFor = (text: string, reduced: boolean) => (reduced ? 150 : Math.min(450 + text.length * 14, 1500));

interface ConversationState {
  messages: ChatMessage[];
  typing: boolean;
  asked: string[];
  started: boolean;
  /** From a question until its last reply lands; a UI can hold new questions meanwhile. */
  replying: boolean;
  /** Plays the greeting the first time the conversation opens. */
  start: (reducedMotion: boolean) => void;
  ask: (topic: Topic, reducedMotion: boolean, asTyped?: string) => void;
  askText: (text: string, reducedMotion: boolean) => void;
  restart: () => void;
}

let nextId = 1;
const message = (from: ChatMessage['from'], body: Pick<ChatMessage, 'text' | 'attachment'>): ChatMessage => ({
  id: nextId++,
  from,
  time: new Date(),
  ...body,
});

export const useConversation = create<ConversationState>((set, get) => {
  /** Bumped by restart(): replies still typing for an earlier conversation stop there. */
  let conversation = 0;
  let inFlight = 0;

  /** Sends replies one bubble at a time with the typing indicator in between. */
  const reply = async (lines: string[], attachment: Attachment | undefined, reduced: boolean) => {
    const current = conversation;
    inFlight++;
    set({ replying: true });
    try {
      for (const line of lines) {
        set({ typing: true });
        await new Promise((resolve) => setTimeout(resolve, delayFor(line, reduced)));
        if (current !== conversation) return;
        set((s) => ({ typing: false, messages: [...s.messages, message('them', { text: line })] }));
      }
      if (attachment) set((s) => ({ messages: [...s.messages, message('them', { attachment })] }));
    } finally {
      if (current === conversation && --inFlight === 0) set({ replying: false });
    }
  };

  return {
    messages: [],
    typing: false,
    asked: [],
    started: false,
    replying: false,
    start: (reduced) => {
      if (get().started) return;
      set({ started: true });
      void reply(GREETING, undefined, reduced);
    },
    ask: (topic, reduced, asTyped) => {
      set((s) => ({ messages: [...s.messages, message('me', { text: asTyped ?? topic.question })], asked: [...s.asked, topic.id] }));
      void reply(topic.replies, topic.attachment, reduced);
    },
    askText: (text, reduced) => get().ask(matchTopic(text), reduced, text),
    restart: () => {
      conversation++;
      inFlight = 0;
      set({ messages: [], asked: [], started: false, typing: false, replying: false });
    },
  };
});

/** Topics not asked yet, for the suggestion chips. */
export const remainingTopics = (asked: string[]) => TOPICS.filter((topic) => !asked.includes(topic.id));

/** What an attachment card says and opens, the same in both shells. */
interface AttachmentPreview {
  title: string;
  /** What a tap does ("프로젝트 열기"). */
  action: string;
  icon?: MediaKey;
  /** A round photo instead of an app icon (contact cards). */
  photo?: MediaKey;
  /** A project's screenshot; the phone shows projects as large link previews. */
  cover?: MediaKey;
  open: { app: AppId; props?: Partial<AppProps[AppId]> };
}

export function describeAttachment(attachment: Attachment): AttachmentPreview | null {
  switch (attachment.kind) {
    case 'project': {
      const project = getProject(attachment.slug);
      return project ? { title: project.title, action: '프로젝트 열기', icon: project.icon, cover: project.cover, open: { app: 'portfolio', props: { slug: project.slug } } } : null;
    }
    case 'note': {
      const note = getNote(attachment.note);
      return note ? { title: note.title, action: '메모 열기', icon: 'icons/notes', open: { app: 'notes', props: { note: note.id } } } : null;
    }
    case 'pdf':
      return { title: `${PROFILE.name}_포트폴리오.pdf`, action: 'PDF 열기', icon: 'icons/resume', open: { app: 'preview' } };
    case 'profile':
      return { title: PROFILE.name, action: '프로필 보기', photo: PROFILE.portrait, open: { app: 'about', props: { view: 'profile', section: 'overview' } } };
    case 'mail':
      return { title: PROFILE.email, action: '메일 쓰기', icon: 'icons/mail', open: { app: 'mail' } };
  }
}
