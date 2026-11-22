import { ACTIVITIES, AWARDS, CAREER, CERTIFICATES, EDUCATION, PROFILE, SKILLS, STATS } from '@/content/profile';
import { getProject } from '@/content/projects';
import { Button } from '@/desktop/kit/controls';
import { FormRow, FormSection } from '@/desktop/kit/Form';
import { AWARD_ITEMS, openQuickLook } from '@/desktop/quicklook/quickLook';
import { Picture } from '@/media/Picture';
import { runCommand } from '@/os/commands';
import { useWindows } from '@/os/windows';
import { Symbol } from '@/ui/Symbol';
import { ExternalLink as External, Hero, Value } from '../settings/PaneLayout';
import styles from './About.module.css';

/** The six panes of the profile window. Every value is read from src/content/profile.ts. */

export function Overview() {
  return (
    <>
      <Hero
        media={<Picture src={PROFILE.portrait} alt={`${PROFILE.name} 사진`} sizes="88px" className={styles.portrait} />}
        title={PROFILE.name}
        lines={[PROFILE.role, PROFILE.headline]}
      />
      <FormSection>
        <FormRow label="지금 일하는 곳">
          <Value>
            {PROFILE.current.company} {PROFILE.current.team}, {PROFILE.current.since} 입사
          </Value>
        </FormRow>
      </FormSection>
      <FormSection title="숫자로 본 성과">
        {STATS.map((stat) => {
          const project = stat.project && getProject(stat.project);
          return (
            <FormRow key={stat.label} label={stat.label}>
              <Value>{stat.value}</Value>
              {project && (
                <button
                  type="button"
                  className={styles.disclosure}
                  aria-label={`${project.title} 프로젝트 열기`}
                  title={`${project.title} 프로젝트 열기`}
                  onClick={() => useWindows.getState().open('portfolio', { slug: project.slug })}
                >
                  <Symbol name="chevron.right" size={12} weight="semibold" />
                </button>
              )}
            </FormRow>
          );
        })}
      </FormSection>
      <FormSection title="링크">
        <FormRow label="GitHub">
          <External href={PROFILE.github.href}>{PROFILE.github.label}</External>
        </FormRow>
        <FormRow label="블로그">
          <External href={PROFILE.blog.href}>{PROFILE.blog.label}</External>
        </FormRow>
      </FormSection>
    </>
  );
}

export function Career() {
  return CAREER.map((job) => (
    <FormSection key={job.name} title={job.name}>
      <FormRow label="기간">
        <Value>{job.period}</Value>
      </FormRow>
      <FormRow label="소속">
        <Value>{job.org}</Value>
      </FormRow>
      <FormRow label="한 일">
        <Value>{job.summary}</Value>
      </FormRow>
      {job.duties?.map((duty) => (
        <FormRow key={duty.service} label={duty.service}>
          <Value>{duty.text}</Value>
        </FormRow>
      ))}
    </FormSection>
  ));
}

export function Skills() {
  return SKILLS.map((group) => (
    <FormSection key={group.title} title={group.title}>
      {group.items.map((item) => (
        <FormRow key={item} label={item} />
      ))}
    </FormSection>
  ));
}

export function Education() {
  return (
    <>
      <FormSection title="학력">
        <FormRow label={EDUCATION.school} description={EDUCATION.majors.join(', ')}>
          <Value>{EDUCATION.period}</Value>
        </FormRow>
        <FormRow label="학위">
          <Value>{EDUCATION.degree}</Value>
        </FormRow>
        <FormRow label="전체 평점">
          <Value>{EDUCATION.gpa}</Value>
        </FormRow>
      </FormSection>
      <FormSection title="자격">
        {CERTIFICATES.map((certificate) => (
          <FormRow key={certificate.title} label={certificate.title} description={certificate.issuer}>
            <Value>{certificate.date}</Value>
          </FormRow>
        ))}
      </FormSection>
      <FormSection title="활동">
        {ACTIVITIES.map((activity) => (
          <FormRow key={activity.title} label={activity.title} description={activity.body}>
            <Value>{activity.period}</Value>
          </FormRow>
        ))}
      </FormSection>
    </>
  );
}

/** Quick Look pages through every certificate from the one that was opened (here, or by the terminal's `open`). */

export function Awards() {
  return (
    <FormSection footer="상장을 누르면 크게 볼 수 있어요. ←, → 키로 넘겨 봅니다.">
      {AWARDS.map((award, index) => {
        const scan = award.images[0];
        return (
          <FormRow key={award.title} label={award.title} description={award.issuer}>
            <Value>{award.date}</Value>
            {scan && (
              <button
                type="button"
                className={styles.certificate}
                aria-label={`${award.title} 상장 보기`}
                onClick={(event) => openQuickLook(AWARD_ITEMS, index, event.currentTarget.getBoundingClientRect())}
              >
                <Picture src={scan} alt="" sizes="30px" className={styles.scan} />
              </button>
            )}
          </FormRow>
        );
      })}
    </FormSection>
  );
}

export function Contact() {
  const open = (app: 'mail' | 'messages' | 'preview') => useWindows.getState().open(app);
  return (
    <>
      <FormSection>
        <FormRow label="이메일">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <Button onClick={() => runCommand('system.copyEmail')}>복사</Button>
        </FormRow>
        <FormRow label="GitHub">
          <External href={PROFILE.github.href}>{PROFILE.github.label}</External>
        </FormRow>
        <FormRow label="블로그">
          <External href={PROFILE.blog.href}>{PROFILE.blog.label}</External>
        </FormRow>
        <FormRow label="포트폴리오 PDF">
          <a href={PROFILE.portfolioPdf} download>
            내려받기
          </a>
          <Button onClick={() => open('preview')}>미리보기로 열기</Button>
        </FormRow>
      </FormSection>
      <FormSection title="바로 연락하기">
        <FormRow label="메일 쓰기" description="Mail에서 받는 사람이 채워진 새 메시지를 엽니다.">
          <Button onClick={() => open('mail')}>새로운 메시지</Button>
        </FormRow>
        <FormRow label="메시지로 묻기" description="질문을 고르면 포트폴리오의 내용으로 답합니다.">
          <Button onClick={() => open('messages')}>메시지 열기</Button>
        </FormRow>
      </FormSection>
    </>
  );
}
