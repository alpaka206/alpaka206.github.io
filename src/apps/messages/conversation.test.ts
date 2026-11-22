import { afterEach, describe, expect, it, vi } from 'vitest';
import { TOPICS } from '@/content/conversation';
import { matchTopic, remainingTopics, useConversation } from './conversation';

describe('Messages conversation', () => {
  it('routes a typed question to the matching topic', () => {
    expect(matchTopic('삼성 QA는 어떤 일이었나요?').id).toBe('qa');
    expect(matchTopic('React 말고 무슨 기술 써요').id).toBe('stack');
    expect(matchTopic('이력서 pdf 있나요').id).toBe('pdf');
  });

  it('falls back to email for anything it cannot answer', () => {
    const topic = matchTopic('점심 뭐 드셨어요');
    expect(topic.id).toBe('fallback');
    expect(topic.attachment).toEqual({ kind: 'mail' });
  });

  it('offers only questions that were not asked yet', () => {
    expect(remainingTopics(['who', 'best']).map((t) => t.id)).not.toContain('who');
  });
});

describe('reply timing', () => {
  afterEach(() => {
    useConversation.getState().restart();
    vi.useRealTimers();
  });

  it('is replying from the question until the attachment lands', async () => {
    vi.useFakeTimers();
    const topic = TOPICS[0]!;
    useConversation.getState().ask(topic, true);
    expect(useConversation.getState().replying).toBe(true);
    await vi.runAllTimersAsync();
    const { replying, messages } = useConversation.getState();
    expect(replying).toBe(false);
    expect(messages.at(-1)?.attachment).toEqual(topic.attachment);
  });

  it('drops replies that were still typing when the conversation restarts', async () => {
    vi.useFakeTimers();
    useConversation.getState().start(true);
    useConversation.getState().restart();
    await vi.runAllTimersAsync();
    expect(useConversation.getState()).toMatchObject({ messages: [], typing: false, replying: false });
  });
});
