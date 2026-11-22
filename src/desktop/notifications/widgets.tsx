import { STATS } from '@/content/profile';
import type { ProjectSlug } from '@/content/types';
import { formatLongDate } from '@/lib/format';
import { Glass } from '@/ui/Glass';
import styles from './Notifications.module.css';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const monthName = new Intl.DateTimeFormat('ko-KR', { month: 'long' });

/** The small Calendar widget: this month, Sunday first, today circled in red. */
export function CalendarWidget({ now }: { now: Date }) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const leading = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array<null>(leading).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  return (
    <Glass variant="regular" radius={22} className={`${styles.widget} ${styles.calendar}`} role="img" aria-label={formatLongDate(now)}>
      <p className={styles.month} aria-hidden="true">
        {monthName.format(now)}
      </p>
      <div className={styles.days} aria-hidden="true">
        {WEEKDAYS.map((day) => (
          <span key={day} className={styles.weekday}>
            {day}
          </span>
        ))}
        {cells.map((day, i) => (
          <span key={i} className={styles.day} data-today={day === now.getDate() || undefined}>
            {day}
          </span>
        ))}
      </div>
    </Glass>
  );
}

/** "숫자로 보기": the four confirmed numbers from the portfolio, each opening its case study. */
export function StatsWidget({ onOpen }: { onOpen: (slug: ProjectSlug) => void }) {
  return (
    <Glass variant="regular" radius={22} className={`${styles.widget} ${styles.stats}`}>
      <h2 className={styles.widgetTitle}>숫자로 보기</h2>
      <ul className={styles.statList}>
        {STATS.map(({ value, label, project }) => (
          <li key={label}>
            <button type="button" className={styles.stat} disabled={!project} onClick={() => project && onOpen(project)}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </Glass>
  );
}
