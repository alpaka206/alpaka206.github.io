import { describe, expect, it } from 'vitest';
import { getProject, PROJECTS } from '@/content/projects';
import { neighbours, otherProjects, SEQUENCE, tableOfContents } from './toc';

describe('portfolio table of contents', () => {
  it('lists the sections of a case study in reading order, then the tags', () => {
    const toc = tableOfContents(getProject('sales-automation')!);
    expect(toc.map((e) => e.title)).toEqual([
      '개요',
      '문제',
      '처리 흐름',
      '운영 콘솔 기능',
      '운영 콘솔 프론트엔드',
      '실시간 동기화',
      '발송 안전장치',
      '사용 기술',
    ]);
    expect(toc[1]!.child).toBe(1);
    expect(toc.at(-1)!.child).toBe(getProject('sales-automation')!.blocks.length + 1);
  });

  it('lists steps one by one and ends with the links', () => {
    const toc = tableOfContents(getProject('global-web-qa')!);
    expect(toc.filter((e) => e.item !== undefined).map((e) => e.title)).toEqual([
      '01. 병목과 캡처 실패 분석',
      '02. 캡처 속도와 정확도 개선',
      '03. QA 결과 검수 화면',
      '04. 웹 보고서와 자동 발송',
    ]);
    const mearri = getProject('mearri')!;
    expect(tableOfContents(mearri).at(-1)).toEqual({ title: '링크', child: mearri.blocks.length + 2 });
  });

  it('gives every case study more than its overview', () => {
    for (const project of SEQUENCE) expect(tableOfContents(project).length, project.slug).toBeGreaterThan(1);
  });

  it('steps through the case studies in the PDF order, without wrapping', () => {
    expect(SEQUENCE).toHaveLength(PROJECTS.length - 1);
    expect(neighbours(SEQUENCE[0]!.slug).previous).toBeUndefined();
    expect(neighbours(SEQUENCE[0]!.slug).next).toBe(SEQUENCE[1]);
    expect(neighbours(SEQUENCE.at(-1)!.slug).next).toBeUndefined();
    expect(neighbours('eastaid').next).toBe(SEQUENCE[0]);
  });

  it('groups the other case studies by company and leaves out the open one', () => {
    const others = otherProjects('mearri');
    expect(others.flatMap((g) => g.projects).some((p) => p.slug === 'mearri')).toBe(false);
    expect(others.flatMap((g) => g.projects)).toHaveLength(SEQUENCE.length - 1);
  });
});
