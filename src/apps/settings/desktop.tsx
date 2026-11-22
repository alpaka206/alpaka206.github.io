import { useRef, useState, type ComponentType, type KeyboardEvent } from 'react';
import { SearchField } from '@/desktop/kit/controls';
import { Sidebar } from '@/desktop/kit/Sidebar';
import { SplitView } from '@/desktop/kit/SplitView';
import { Toolbar } from '@/desktop/kit/Toolbar';
import { useWindowCommands, useWindowTitle } from '@/desktop/kit/window';
import type { SettingsPane } from '@/os/apps';
import { matchesAny } from '@/os/search';
import { useWindows } from '@/os/windows';
import type { DesktopAppProps } from '../registry';
import { PaneBody } from './PaneLayout';
import { PaneList, ProfileRow, type Pane } from './PaneList';
import { AboutSite } from './panes/AboutSite';
import { Accessibility } from './panes/Accessibility';
import { Appearance } from './panes/Appearance';
import { DesktopDock } from './panes/DesktopDock';
import { Privacy } from './panes/Privacy';
import { Sound } from './panes/Sound';
import { Wallpaper } from './panes/Wallpaper';
import styles from './Settings.module.css';

/** Pane names as Korean macOS spells them (데스크탑, not 데스크톱). */
const PANES: readonly (Pane<SettingsPane> & { View: ComponentType })[] = [
  { id: 'appearance', label: '화면 모드', icon: 'circle.lefthalf.filled', tint: '#1d1d1f', keywords: ['다크', '라이트', '자동', '강조 색상', '테마'], View: Appearance },
  { id: 'wallpaper', label: '배경화면', icon: 'photo', tint: 'var(--teal)', keywords: ['바탕화면', '사진'], View: Wallpaper },
  { id: 'desktop-dock', label: '데스크탑 및 Dock', icon: 'dock.rectangle', tint: '#1d1d1f', keywords: ['데스크톱', '확대', '크기', '가리기', '전체 화면', '로그인'], View: DesktopDock },
  { id: 'accessibility', label: '손쉬운 사용', icon: 'accessibility', tint: 'var(--blue)', keywords: ['동작 줄이기', '투명도 줄이기', '애니메이션'], View: Accessibility },
  { id: 'sound', label: '사운드', icon: 'speaker.wave.2', tint: 'var(--red)', keywords: ['소리', '효과음', '음량', '볼륨'], View: Sound },
  { id: 'privacy', label: '개인정보 보호', icon: 'hand.raised', tint: 'var(--blue)', keywords: ['쿠키', '추적', '초기화'], View: Privacy },
  { id: 'about-site', label: '이 사이트에 관하여', icon: 'info.circle', tint: 'var(--gray)', keywords: ['버전', '소스 코드', '만든 방법'], View: AboutSite },
];

/** 시스템 설정. The open pane lives in the window's props (deep link /settings/sound, Spotlight, sidebar). */
export default function SettingsWindow({ props }: DesktopAppProps<'settings'>) {
  const pane = PANES.find((p) => p.id === props.pane) ?? PANES[0]!;
  const [query, setQuery] = useState('');
  const search = useRef<HTMLInputElement>(null);
  const shown = PANES.filter((p) => matchesAny(query, [p.label, ...(p.keywords ?? [])]));
  const select = (id: SettingsPane) => useWindows.getState().open('settings', { pane: id });

  useWindowTitle(pane.label);
  useWindowCommands({ 'edit.find': () => search.current?.select() });

  const onSearchKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Enter' && shown[0]) select(shown[0].id);
    if (event.key === 'Escape') setQuery('');
  };

  return (
    <SplitView
      sidebar={
        <Sidebar label="시스템 설정">
          <SearchField ref={search} aria-label="설정 검색" value={query} onChange={(event) => setQuery(event.currentTarget.value)} onKeyDown={onSearchKey} />
          <ProfileRow subtitle="프로필 보기" onOpen={() => useWindows.getState().open('about')} />
          {shown.length > 0 && <PaneList label="설정 항목" panes={shown} selected={pane.id} onSelect={select} />}
          <p className={styles.empty} role="status">
            {shown.length === 0 && '결과 없음'}
          </p>
        </Sidebar>
      }
      toolbar={<Toolbar title={pane.label} />}
    >
      <PaneBody key={pane.id}>
        <pane.View />
      </PaneBody>
    </SplitView>
  );
}
