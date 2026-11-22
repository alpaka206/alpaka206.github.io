import type { ComponentType } from 'react';
import { PROFILE } from '@/content/profile';
import { Sidebar } from '@/desktop/kit/Sidebar';
import { SplitView } from '@/desktop/kit/SplitView';
import { Toolbar } from '@/desktop/kit/Toolbar';
import { useWindowTitle } from '@/desktop/kit/window';
import type { ProfileSection } from '@/os/apps';
import { useWindows } from '@/os/windows';
import type { DesktopAppProps } from '../registry';
import { PaneBody } from '../settings/PaneLayout';
import { PaneList, ProfileRow, type Pane } from '../settings/PaneList';
import { Awards, Career, Contact, Education, Overview, Skills } from './panes';

const SECTIONS: readonly (Pane<ProfileSection> & { View: ComponentType })[] = [
  { id: 'overview', label: '개요', icon: 'person.crop.circle', tint: 'var(--blue)', View: Overview },
  { id: 'career', label: '경력', icon: 'briefcase', tint: 'var(--orange)', View: Career },
  { id: 'skills', label: '기술', icon: 'hammer', tint: 'var(--gray)', View: Skills },
  { id: 'education', label: '학력과 활동', icon: 'book', tint: 'var(--teal)', View: Education },
  { id: 'awards', label: '수상', icon: 'medal', tint: 'var(--yellow)', View: Awards },
  { id: 'contact', label: '연락처', icon: 'envelope', tint: 'var(--green)', View: Contact },
];

/**
 * 소개: the profile laid out like System Settings. The open pane lives in the
 * window's props, so a deep link (/about/career), Spotlight and the sidebar
 * all select it the same way.
 */
export default function AboutWindow({ props }: DesktopAppProps<'about'>) {
  const section = SECTIONS.find((s) => s.id === props.section) ?? SECTIONS[0]!;
  useWindowTitle(section.label);
  const select = (id: ProfileSection) => useWindows.getState().open('about', { view: 'profile', section: id });

  return (
    <SplitView
      sidebar={
        <Sidebar label="프로필">
          <ProfileRow subtitle={PROFILE.role} />
          <PaneList label="프로필 항목" panes={SECTIONS} selected={section.id} onSelect={select} />
        </Sidebar>
      }
      toolbar={<Toolbar title={section.label} />}
    >
      <PaneBody key={section.id}>
        <section.View />
      </PaneBody>
    </SplitView>
  );
}
