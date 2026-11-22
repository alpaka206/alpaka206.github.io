import { useState } from 'react';
import { AWARDS } from '@/content/profile';
import type { ProjectSlug } from '@/content/types';
import { NavScreen, TabBar } from '@/phone/kit';
import { usePhoneApp } from '@/phone/nav';
import { PhotoViewer } from '../photos/phone-viewer';
import { ProjectScreen } from '../portfolio/phone-project';
import type { PhoneAppProps } from '../registry';
import { ProjectsTab } from './phone-projects';
import { AwardsTab, CareerTab } from './phone-records';
import styles from './finder.phone.module.css';

type FinderScreen = { kind: 'project'; slug: ProjectSlug } | { kind: 'award'; index: number };
type Tab = 'projects' | 'career' | 'awards';

const TABS = [
  { id: 'projects', label: '프로젝트', icon: 'folder' },
  { id: 'career', label: '경력', icon: 'briefcase' },
  { id: 'awards', label: '수상', icon: 'medal' },
] as const;

/** A certificate, full screen; a tap zooms in on it. */
function AwardScreen({ index }: { index: number }) {
  const award = AWARDS[index];
  if (!award) return null;
  const caption = `${award.date} / ${award.issuer}`;
  return (
    <PhotoViewer
      title={award.title}
      tapZooms
      start={0}
      photos={award.images.map((key) => ({ key, alt: `${award.title} 상장`, caption }))}
    />
  );
}

/**
 * The phone's "프로젝트" app: projects, career and awards as tabs. Rows
 * push a project or a certificate; the stack lives in browser history, so
 * back (button, gesture or Android) pops it.
 */
export default function FinderPhone({ props }: PhoneAppProps<'finder'>) {
  const { screens, push } = usePhoneApp<FinderScreen>();
  const [tab, setTab] = useState<Tab>(props.location === 'awards' ? 'awards' : 'projects');
  const [focusRequest, setFocusRequest] = useState(0);
  const top = screens.at(-1);

  const bar = (
    <TabBar
      tabs={TABS}
      value={tab}
      onChange={setTab}
      onSearch={() => {
        setTab('projects');
        setFocusRequest((count) => count + 1);
      }}
      label="프로젝트 보기"
      idPrefix="finder"
    />
  );

  return (
    <>
      <div className={styles.layer} inert={Boolean(top)}>
        {/* Each tab starts at its top; the tab bar floats over it, outside the panel it switches. */}
        <NavScreen key={tab} title={TABS.find((t) => t.id === tab)!.label} bottom={bar}>
          <div id="finder-panel" role="tabpanel" aria-labelledby={`finder-tab-${tab}`}>
            {tab === 'projects' && <ProjectsTab focusRequest={focusRequest} onOpen={(slug) => push({ kind: 'project', slug }, `/projects/${slug}`)} />}
            {tab === 'career' && <CareerTab />}
            {tab === 'awards' && <AwardsTab onOpen={(index) => push({ kind: 'award', index }, '/awards')} />}
          </div>
        </NavScreen>
      </div>
      {top && (
        <div key={screens.length} className={styles.pushed}>
          {top.kind === 'project' ? <ProjectScreen slug={top.slug} /> : <AwardScreen index={top.index} />}
        </div>
      )}
    </>
  );
}
