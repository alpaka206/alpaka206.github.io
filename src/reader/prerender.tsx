/**
 * Build-time entry (vite build --ssr). scripts/prerender.ts calls these to put
 * real content and per-page metadata into every static HTML file.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { PROFILE } from '@/content/profile';
import { NOTES } from '@/content/notes';
import { SEQUENCE } from '@/apps/portfolio/toc';
import { pathFor, PROFILE_SECTIONS } from '@/os/routes';
import type { PageMeta } from './pageMeta';
import { Reader, ReaderProject } from './Reader';

const BASE_TITLE = `${PROFILE.name} | 프론트엔드 개발자 포트폴리오`;
const BASE_DESCRIPTION =
  'AI 기능을 실제 업무와 서비스로 연결하는 프론트엔드 개발자 김규원의 포트폴리오. React, TypeScript, Next.js로 만든 AI 더빙 플러그인, 세일즈 자동화, 자막 서비스와 알람 앱.';

export function pages(): PageMeta[] {
  const full = renderToStaticMarkup(<Reader />);
  /** A shareable window whose page carries the whole text version. */
  const page = (path: string, title: string): PageMeta => ({ path, title: `${title} | ${PROFILE.name}`, description: BASE_DESCRIPTION, html: full });
  const list: PageMeta[] = [
    { path: '/', title: BASE_TITLE, description: BASE_DESCRIPTION, html: full },
    { path: '/text', title: `${PROFILE.name} | 텍스트 버전`, description: BASE_DESCRIPTION, html: full },
    page('/projects', '프로젝트'),
    page('/awards', '수상'),
    page('/documents', '문서'),
    page('/portfolio-pdf', '포트폴리오 PDF'),
    page('/about', '소개'),
    ...PROFILE_SECTIONS.map((section) => page(pathFor('about', { view: 'profile', section }), '소개')),
    ...NOTES.map((note) => page(pathFor('notes', { note: note.id }), note.title)),
  ];
  for (const project of SEQUENCE) {
    list.push({
      path: `/projects/${project.slug}`,
      title: `${project.title} | ${PROFILE.name}`,
      description: `${project.lead.replace(/\n/g, ' ')} ${project.summary}.`,
      html: renderToStaticMarkup(
        <div className="reader">
          <p className="reader-switch">
            <a href="/text">전체 텍스트 버전</a>
          </p>
          <ReaderProject project={project} level={1} />
        </div>,
      ),
    });
  }
  return list;
}
