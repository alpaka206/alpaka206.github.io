import { useEffect, type ReactNode } from 'react';
import {
  ACTIVITIES,
  AWARDS,
  CAREER,
  CERTIFICATES,
  EDUCATION,
  PROFILE,
  SKILLS,
} from '@/content/profile';
import { Picture } from '@/media/Picture';
import { copyEmail } from '@/os/actions';
import { Glyph, NavScreen, Row, Section } from '@/phone/kit';
import { usePhoneApp } from '@/phone/nav';
import type { SymbolName } from '@/ui/Symbol';
import type { PhoneAppProps } from '../registry';
import styles from './about.phone.module.css';

/**
 * 소개 on the phone: a contact card (portrait poster, name, headline, quick
 * actions) followed by inset grouped sections. /about/<section> scrolls to it.
 */
export default function View({ props }: PhoneAppProps<'about'>) {
  const { open } = usePhoneApp();
  const section = props.section;

  useEffect(() => {
    if (section && section !== 'overview')
      document
        .getElementById(`about-${section}`)
        ?.scrollIntoView({ block: 'start' });
  }, [section]);

  const current = CAREER[0];
  return (
    <NavScreen
      title={PROFILE.name}
      large={false}
      hero={
        <header className={styles.poster}>
          <Picture
            src={PROFILE.portrait}
            alt={`${PROFILE.name} 사진`}
            sizes="124px"
            priority
            className={styles.portrait}
          />
          {/* The navigation bar's title is the page heading; this is its large twin. */}
          <p className={styles.name} aria-hidden="true">
            {PROFILE.name}
          </p>
          <p className={styles.headline}>{PROFILE.headline}</p>
          <div className={styles.actions}>
            <Action icon="envelope" label="메일" onClick={() => open('mail')} />
            <Action icon="link" label="GitHub" onClick={() => open('github')} />
            <Action icon="book" label="블로그" onClick={() => open('blog')} />
            <Action
              icon="doc.text"
              label="PDF"
              onClick={() => open('preview')}
            />
          </div>
        </header>
      }
    >
      {current && (
        <Anchor id="overview">
          <Section title="현재">
            <Row
              title={`${PROFILE.current.company} ${PROFILE.current.team}`}
              subtitle={<Lines lines={[current.period, current.org]} />}
              wrap
            />
            {current.duties?.map((duty) => (
              <Row
                key={duty.service}
                title={duty.service}
                subtitle={duty.text}
                wrap
              />
            ))}
          </Section>
        </Anchor>
      )}

      <Anchor id="career">
        <Section title="경력">
          {CAREER.map((company) => (
            <Row
              key={company.name}
              title={company.name}
              subtitle={
                <Lines lines={[company.org, company.period, company.summary]} />
              }
              wrap
            />
          ))}
        </Section>
      </Anchor>

      <Anchor id="skills">
        <Section title="기술">
          {SKILLS.map((group) => (
            <Row
              key={group.title}
              title={group.title}
              subtitle={<Lines lines={group.items} />}
              wrap
            />
          ))}
        </Section>
      </Anchor>

      <Anchor id="education">
        <Section title="학력과 자격">
          <Row
            title={EDUCATION.school}
            subtitle={
              <Lines
                lines={[
                  EDUCATION.majors.join(', '),
                  `${EDUCATION.period} / ${EDUCATION.degree}`,
                  `전체 평점 ${EDUCATION.gpa}`,
                ]}
              />
            }
            wrap
          />
          {CERTIFICATES.map((certificate) => (
            <Row
              key={certificate.title}
              title={certificate.title}
              subtitle={`${certificate.date}, ${certificate.issuer}`}
              wrap
            />
          ))}
        </Section>
      </Anchor>

      <Section title="활동">
        {ACTIVITIES.map((activity) => (
          <Row
            key={activity.title}
            title={activity.title}
            subtitle={<Lines lines={[activity.period, activity.body]} />}
            wrap
          />
        ))}
      </Section>

      <Anchor id="awards">
        <Section title="수상">
          {AWARDS.map((award) => (
            <Row
              key={`${award.date}-${award.title}`}
              title={award.title}
              subtitle={`${award.date} / ${award.issuer}`}
              wrap
              onClick={() => open('finder', { location: 'awards' })}
            />
          ))}
        </Section>
      </Anchor>

      <Anchor id="contact">
        <Section title="연락">
          <Row
            title={PROFILE.email}
            subtitle="메일 쓰기"
            onClick={() => open('mail')}
          />
          <Row
            title="이메일 주소 복사"
            action
            chevron={false}
            onClick={() => void copyEmail('메일')}
          />
          <Row
            title="GitHub"
            subtitle={PROFILE.github.label}
            href={PROFILE.github.href}
          />
          <Row
            title="블로그"
            subtitle={PROFILE.blog.label}
            href={PROFILE.blog.href}
          />
        </Section>
      </Anchor>
    </NavScreen>
  );
}

/** A quick action under the name, like Contacts' message and mail buttons. */
function Action({
  icon,
  label,
  onClick,
}: {
  icon: SymbolName;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className={styles.action} onClick={onClick}>
      <Glyph name={icon} pt={17} weight="medium" />
      <span>{label}</span>
    </button>
  );
}

/** A deep-link target (/about/career); the screen's scroll padding keeps it clear of the bar. */
const Anchor = ({ id, children }: { id: string; children: ReactNode }) => <div id={`about-${id}`}>{children}</div>;

/** Several short facts under a row title, one per line. */
const Lines = ({ lines }: { lines: readonly string[] }) => (
  <span className={styles.lines}>
    {lines.map((line) => (
      <span key={line}>{line}</span>
    ))}
  </span>
);
