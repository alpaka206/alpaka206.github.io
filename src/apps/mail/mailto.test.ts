import { describe, expect, it } from 'vitest';
import { mailtoHref } from './mailto';

describe('mailtoHref', () => {
  it('encodes Korean, spaces, & and line breaks', () => {
    expect(mailtoHref('a@b.com', { subject: '채용 문의 & 일정', body: '안녕하세요\n감사합니다' })).toBe(
      'mailto:a@b.com?subject=%EC%B1%84%EC%9A%A9%20%EB%AC%B8%EC%9D%98%20%26%20%EC%9D%BC%EC%A0%95&body=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94%0D%0A%EA%B0%90%EC%82%AC%ED%95%A9%EB%8B%88%EB%8B%A4',
    );
  });

  it('leaves out empty fields', () => {
    expect(mailtoHref('a@b.com', { subject: '', body: 'hi' })).toBe('mailto:a@b.com?body=hi');
    expect(mailtoHref('a@b.com', {})).toBe('mailto:a@b.com');
  });
});
