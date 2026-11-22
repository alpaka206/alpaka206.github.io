import { createElement, Fragment, type ReactNode } from 'react';
import { SEQUENCE } from '@/apps/portfolio/toc';
import { media, mediaUrl } from '@/media/Picture';
import { ACTIVITIES, AWARDS, CAREER, CERTIFICATES, EDUCATION, PROFILE, SKILLS, STATS } from '@/content/profile';
import { PROJECT_GROUPS, projectsInGroup } from '@/content/projects';
import type { Block, Project, Stat } from '@/content/types';

/**
 * The text version of the portfolio: plain semantic HTML built from the same
 * data as the desktop. It is prerendered into every page at build time (for
 * crawlers, screen readers and visitors without JavaScript) and is also the
 * /text route. Styles live in reader.css, which is part of the main bundle.
 */

/** Designed line breaks would split a run-in phrase ("Workers API: Hono, Zod, …"), so it reads as one line. */
const oneLine = (text: string) => text.replace(/\n/g, ' ');

/** h1 … h6: a project's sections sit one level under its title, wherever the project is shown. */
const Heading = ({ level, id, children }: { level: number; id?: string; children: ReactNode }) => createElement(`h${Math.min(level, 6)}`, { id }, children);

/** Headline numbers: the summary's, and a case study's metrics block. */
function Metrics({ items }: { items: readonly Stat[] }) {
  return (
    <dl className="reader-metrics">
      {items.map((stat) => (
        <div key={stat.value}>
          <dt>{stat.value}</dt>
          <dd>{stat.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** One side of a before/after comparison: its title (and caption), then its rows. */
function CompareSide({ title, caption, rows }: { title: string; caption?: string; rows: { label: string; value: string }[] }) {
  return (
    <>
      <p className="reader-label">
        {title}
        {caption && `: ${caption.replace(/\n/g, ', ')}`}
      </p>
      <ul>
        {rows.map((row) => (
          <li key={row.label}>
            <strong>{row.label}</strong> {oneLine(row.value)}
          </li>
        ))}
      </ul>
    </>
  );
}

/** Every field of a block, as text; `level` is the heading level of its title. */
function ReaderBlock({ block, level }: { block: Block; level: number }) {
  switch (block.type) {
    case 'text':
      return (
        <>
          {block.title && <Heading level={level}>{block.title}</Heading>}
          <p className="reader-lines">{block.body}</p>
        </>
      );
    case 'bullets':
      return (
        <>
          {block.title && <Heading level={level}>{block.title}</Heading>}
          <ul>
            {block.items.map((item, i) => (
              <li key={i}>{typeof item === 'string' ? item : <><strong>{item.strong}</strong> {item.text}</>}</li>
            ))}
          </ul>
        </>
      );
    case 'metrics':
      return <Metrics items={block.items} />;
    case 'callout':
      return (
        <p className="reader-callout">
          <strong>{block.title}</strong> {block.body}
        </p>
      );
    case 'flow':
      return (
        <>
          {block.title && <Heading level={level}>{block.title}</Heading>}
          {block.lanes.map((lane, i) => (
            <Fragment key={i}>
              {lane.label && <p className="reader-label">{lane.label}</p>}
              <ol className="reader-flow">
                {lane.nodes.map((node, j) => (
                  <li key={node.title}>
                    <strong>{node.title}</strong>
                    {node.body && `: ${oneLine(node.body)}`}
                    {lane.edges[j] && <span className="reader-edge"> ({oneLine(lane.edges[j])})</span>}
                    {node.stack && (
                      <ul>
                        {node.stack.map((input) => (
                          <li key={input.title}>
                            <strong>{input.title}</strong>: {input.body}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </Fragment>
          ))}
          {block.note && <p>{block.note}</p>}
        </>
      );
    case 'chart':
      return (
        <>
          <Heading level={level}>{block.title}</Heading>
          <ul>
            {block.rows.map((row) => (
              <li key={row.label}>
                {row.label}: {row.text}
              </li>
            ))}
          </ul>
        </>
      );
    case 'cards':
      return (
        <>
          {block.title && <Heading level={level}>{block.title}</Heading>}
          <ul>
            {block.items.map((card) => (
              <li key={card.title}>
                <strong>
                  {card.title}
                  {card.subtitle && `, ${card.subtitle}`}.
                </strong>{' '}
                {card.body}
              </li>
            ))}
          </ul>
        </>
      );
    case 'steps':
      return (
        <>
          {block.title && <Heading level={level}>{block.title}</Heading>}
          {block.items.map((step) => (
            <Fragment key={step.title}>
              <Heading level={block.title ? level + 1 : level}>{step.title}</Heading>
              <ul>
                {step.items.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Fragment>
          ))}
        </>
      );
    case 'compare':
      return (
        <>
          <Heading level={level}>{block.title}</Heading>
          {block.body && <p>{block.body}</p>}
          <CompareSide {...block.before} />
          <CompareSide {...block.after} />
        </>
      );
    case 'split':
      return (
        <>
          <Heading level={level}>{block.title}</Heading>
          <p>{block.body}</p>
          <ul>
            {block.columns.map((column) => (
              <li key={column.title}>
                <strong>{column.title}</strong>: {oneLine(column.body)}
              </li>
            ))}
          </ul>
        </>
      );
    case 'media': {
      const { width, height } = media(block.src);
      return <img src={mediaUrl(block.src, 960)} width={width} height={height} alt={block.alt} loading="lazy" className="reader-media" />;
    }
    case 'columns':
      return (
        <>
          {block.columns.flat().map((inner, i) => (
            <ReaderBlock key={i} block={inner} level={level} />
          ))}
        </>
      );
  }
}

/** One case study. On its own page (/projects/<slug>) the title is the page's h1; in the full text it sits under 프로젝트 as an h3. */
export function ReaderProject({ project, level = 3 }: { project: Project; level?: 1 | 3 }) {
  return (
    <article className="reader-project" id={project.slug} aria-labelledby={`${project.slug}-title`}>
      <Heading level={level} id={`${project.slug}-title`}>
        {project.title}
      </Heading>
      <p className="reader-meta">{project.meta}</p>
      <p className="reader-lead">{oneLine(project.lead)}</p>
      {project.blocks.map((block, i) => (
        <ReaderBlock key={i} block={block} level={level + 1} />
      ))}
      {project.tags.length > 0 && (
        <p className="reader-tags" translate="no">
          {project.tags.join(', ')}
        </p>
      )}
      {project.links.length > 0 && (
        <p className="reader-links">
          {project.links.map((link, i) => (
            <Fragment key={link.href}>
              {i > 0 && ', '}
              <a href={link.href}>{link.label}</a>
            </Fragment>
          ))}
        </p>
      )}
    </article>
  );
}

export function Reader() {
  return (
    <div className="reader">
      <p className="reader-switch">
        <a href="/">데스크톱 화면으로 보기</a>
      </p>
      <header className="reader-header">
        <h1>{PROFILE.name}</h1>
        <p className="reader-headline">{PROFILE.headline}</p>
        <p>
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>, <a href={PROFILE.github.href}>{PROFILE.github.label}</a>,{' '}
          <a href={PROFILE.blog.href}>{PROFILE.blog.label}</a>, <a href={PROFILE.portfolioPdf}>포트폴리오 PDF</a>
        </p>
      </header>

      <section aria-labelledby="summary">
        <h2 id="summary">요약</h2>
        <Metrics items={STATS} />
      </section>

      <section aria-labelledby="career">
        <h2 id="career">경력</h2>
        {CAREER.map((company) => (
          <div key={company.name} className="reader-company">
            <h3>{company.name}</h3>
            <p className="reader-meta">
              {company.period}, {company.org}
            </p>
            <p>{company.summary}</p>
            {company.duties && (
              <ul>
                {company.duties.map((duty) => (
                  <li key={duty.service}>
                    <strong>{duty.service}</strong> {duty.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <section aria-labelledby="projects">
        <h2 id="projects">프로젝트</h2>
        <nav aria-label="프로젝트 목록">
          <ul className="reader-toc">
            {SEQUENCE.map((p) => (
              <li key={p.slug}>
                <a href={`#${p.slug}`}>{p.title}</a> <span>{p.highlight ?? p.summary}</span>
              </li>
            ))}
          </ul>
        </nav>
        {PROJECT_GROUPS.filter((g) => g.id !== 'eastaid').map((group) => (
          <Fragment key={group.id}>
            <p className="reader-group">
              {group.title}
              {group.period && `, ${group.period}`}
            </p>
            {projectsInGroup(group.id).map((project) => (
              <ReaderProject key={project.slug} project={project} />
            ))}
          </Fragment>
        ))}
      </section>

      <section aria-labelledby="skills">
        <h2 id="skills">기술과 경험</h2>
        {SKILLS.map((group) => (
          <Fragment key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Fragment>
        ))}
      </section>

      <section aria-labelledby="education">
        <h2 id="education">학력과 활동</h2>
        <h3>{EDUCATION.school}</h3>
        <p>
          {EDUCATION.period}, {EDUCATION.degree}, {EDUCATION.majors.join(', ')}, 평점 {EDUCATION.gpa}
        </p>
        <ul>
          {CERTIFICATES.map((c) => (
            <li key={c.title}>
              {c.title}, {c.date} / {c.issuer}
            </li>
          ))}
          {ACTIVITIES.map((a) => (
            <li key={a.title}>
              <strong>{a.title}</strong> {a.period}. {a.body}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="awards">
        <h2 id="awards">수상</h2>
        <ul>
          {AWARDS.map((award) => (
            <li key={award.title}>
              {award.date} <strong>{award.title}</strong>, {award.issuer}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
