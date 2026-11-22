import { AWARDS, CAREER } from '@/content/profile';
import { Picture } from '@/media/Picture';
import { Row, Section } from '@/phone/kit';
import styles from './finder.phone.module.css';

/** Career, one row per company: team and period, then what was built there. */
export function CareerTab() {
  return (
    <Section>
      {CAREER.map((company) => (
        <Row
          key={company.name}
          title={company.name}
          wrap
          subtitle={
            <>
              {company.org}
              <br />
              {company.period}
              {company.duties?.map((duty) => (
                <span key={duty.service} className={styles.duty}>
                  <b>{duty.service}</b> {duty.text}
                </span>
              ))}
              {!company.duties && <span className={styles.duty}>{company.summary}</span>}
            </>
          }
        />
      ))}
    </Section>
  );
}

/** Awards, newest first; a row opens the scanned certificate. */
export function AwardsTab({ onOpen }: { onOpen: (index: number) => void }) {
  return (
    <Section footer="상장을 누르면 크게 볼 수 있어요. 한 번 더 누르면 확대돼요.">
      {AWARDS.map((award, index) => (
        <Row
          key={award.title}
          leading={<Picture src={award.images[0]!} alt="" sizes="40px" className={styles.thumb} />}
          title={award.title}
          subtitle={`${award.date} / ${award.issuer}`}
          wrap
          onClick={() => onOpen(index)}
        />
      ))}
    </Section>
  );
}
