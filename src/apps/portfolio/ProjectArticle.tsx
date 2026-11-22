import { Fragment } from 'react';
import { Picture } from '@/media/Picture';
import type { Block, Bullet, FlowLane, Project } from '@/content/types';
import styles from './ProjectArticle.module.css';

/**
 * A project case study, rendered from content data. Shared by the desktop
 * window and the phone screen; container queries decide between the wide
 * (two columns, horizontal diagrams) and narrow (stacked) layouts, so the
 * article also reflows while its window is being resized.
 */
export function ProjectArticle({ project, header = true }: { project: Project; header?: boolean }) {
  return (
    <article className={styles.article} aria-label={project.title}>
      {header && (
        <header className={styles.header}>
          <p className={styles.meta}>{project.meta}</p>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.lead}>{project.lead}</p>
        </header>
      )}
      {project.blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
      {project.tags.length > 0 && (
        <ul className={styles.tags} aria-label="사용 기술" translate="no">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
      {project.links.length > 0 && (
        <ul className={styles.links} aria-label="링크">
          {project.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function BulletText({ item }: { item: Bullet }) {
  if (typeof item === 'string') return item;
  return (
    <>
      <strong>{item.strong}</strong> {item.text}
    </>
  );
}

function Flow({ lanes, title, note }: { lanes: FlowLane[]; title?: string; note?: string }) {
  return (
    <figure className={styles.flow}>
      {title && <figcaption className={styles.blockTitle}>{title}</figcaption>}
      {lanes.map((lane, l) => (
        <div key={l} className={styles.lane}>
          {lane.label && <p className={styles.laneLabel}>{lane.label}</p>}
          <ol className={styles.nodes}>
            {lane.nodes.map((node, n) => (
              <Fragment key={node.title}>
                <li className={styles.node} data-key={node.key || undefined}>
                  {node.stack ? (
                    <ul className={styles.stack}>
                      {node.stack.map((input) => (
                        <li key={input.title}>
                          <b>{input.title}</b>
                          <span>{input.body}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <>
                      <b>{node.title}</b>
                      {node.body && <span>{node.body}</span>}
                    </>
                  )}
                </li>
                {n < lane.nodes.length - 1 && (
                  <li className={styles.edge} aria-hidden={!lane.edges[n]}>
                    {lane.edges[n] && <span className={styles.chip}>{lane.edges[n]}</span>}
                    <svg viewBox="0 0 24 12" className={styles.arrow} aria-hidden="true">
                      <path d="M1 6h20M16 1.5 21 6l-5 4.5" />
                    </svg>
                  </li>
                )}
              </Fragment>
            ))}
          </ol>
        </div>
      ))}
      {note && <p className={styles.note}>{note}</p>}
    </figure>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return (
        <section className={styles.text}>
          {block.title && <h2 className={styles.blockTitle}>{block.title}</h2>}
          <p>{block.body}</p>
        </section>
      );
    case 'bullets':
      return (
        <section>
          {block.title && <h2 className={styles.blockTitle}>{block.title}</h2>}
          <ul className={styles.bullets}>
            {block.items.map((item, i) => (
              <li key={i}>
                <BulletText item={item} />
              </li>
            ))}
          </ul>
        </section>
      );
    case 'metrics':
      return (
        <dl className={styles.metrics}>
          {block.items.map((stat) => (
            <div key={stat.value}>
              <dt>{stat.value}</dt>
              <dd>{stat.label}</dd>
            </div>
          ))}
        </dl>
      );
    case 'callout':
      return (
        <aside className={styles.callout}>
          <b>{block.title}</b>
          <p>{block.body}</p>
        </aside>
      );
    case 'flow':
      return <Flow lanes={block.lanes} title={block.title} note={block.note} />;
    case 'chart': {
      const max = block.ticks[block.ticks.length - 1]!;
      return (
        <figure className={styles.chart}>
          <figcaption className={styles.blockTitle}>{block.title}</figcaption>
          {block.rows.map((row) => (
            <div key={row.label} className={styles.chartRow} data-highlight={row.highlight || undefined}>
              <span className={styles.chartLabel}>{row.label}</span>
              <span className={styles.track}>
                <span className={styles.bar} style={{ width: `${(row.value / max) * 100}%` }} />
                {row.rangeTo && (
                  <span
                    className={styles.range}
                    style={{ left: `${(row.value / max) * 100}%`, width: `${((row.rangeTo - row.value) / max) * 100}%` }}
                  />
                )}
              </span>
              <span className={styles.chartValue}>{row.text}</span>
            </div>
          ))}
          <div className={styles.axis} aria-hidden="true">
            {block.ticks.map((tick) => (
              <span key={tick} style={{ left: `${(tick / max) * 100}%` }}>
                {tick}
                {tick === max && block.unit}
              </span>
            ))}
          </div>
        </figure>
      );
    }
    case 'cards':
      return (
        <ul className={styles.cards}>
          {block.items.map((card) => (
            <li key={card.title} data-tone={card.tone}>
              <span className={styles.cardTitle}>{card.title}</span>
              {card.subtitle && <b>{card.subtitle}</b>}
              <p>{card.body}</p>
            </li>
          ))}
        </ul>
      );
    case 'steps':
      return (
        <ol className={styles.steps}>
          {block.items.map((step) => (
            <li key={step.title}>
              <h2 className={styles.blockTitle}>{step.title}</h2>
              <ul className={styles.bullets}>
                {step.items.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      );
    case 'compare':
      return (
        <section className={styles.compare}>
          <h2 className={styles.blockTitle}>{block.title}</h2>
          {block.body && <p>{block.body}</p>}
          <div className={styles.compareGrid}>
            <div>
              <p className={styles.compareHead}>{block.before.title}</p>
              {block.before.rows.map((row) => (
                <p key={row.label} className={styles.compareRow}>
                  <b>{row.label}</b>
                  <span>{row.value}</span>
                </p>
              ))}
            </div>
            <div data-after>
              <p className={styles.compareHead}>{block.after.title}</p>
              <p className={styles.compareCaption}>{block.after.caption}</p>
              {block.after.rows.map((row) => (
                <p key={row.label} className={styles.compareRow}>
                  <b>{row.label}</b>
                  <span>{row.value}</span>
                </p>
              ))}
            </div>
          </div>
        </section>
      );
    case 'split':
      return (
        <section>
          <h2 className={styles.blockTitle}>{block.title}</h2>
          <p className={styles.textBody}>{block.body}</p>
          <div className={styles.split}>
            {block.columns.map((column) => (
              <div key={column.title}>
                <b>{column.title}</b>
                <span>{column.body}</span>
              </div>
            ))}
          </div>
        </section>
      );
    case 'media':
      return (
        <figure className={styles.media} data-frame={block.frame}>
          {block.frame === 'browser' && (
            <span className={styles.browserBar} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          )}
          <Picture src={block.src} alt={block.alt} sizes="(max-width: 767px) 90vw, 480px" className={styles.mediaImage} />
        </figure>
      );
    case 'columns':
      return (
        <div className={styles.columns}>
          {block.columns.map((column, i) => (
            <div key={i} className={styles.column}>
              {column.map((inner, j) => (
                <BlockView key={j} block={inner} />
              ))}
            </div>
          ))}
        </div>
      );
  }
}
