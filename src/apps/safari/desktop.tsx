import { useLayoutEffect, useReducer, useRef, useState } from 'react';
import { ToolbarButton, ToolbarGroup } from '@/desktop/kit/Toolbar';
import { useWindowCommands, useWindowFrame, useWindowTitle } from '@/desktop/kit/window';
import { AppIcon } from '@/ui/AppIcon';
import { Symbol } from '@/ui/Symbol';
import { share } from '../finder/share';
import type { DesktopAppProps } from '../registry';
import { AddressField } from './AddressField';
import { BlockedPage, FrameHint } from './BlockedPage';
import { siteFor, titleFor, toAddress } from './sites';
import { StartPage } from './StartPage';
import { activeTab, currentPage, initialTabs, reduceTabs, START, type Page, type Tab } from './tabs';
import styles from './Safari.module.css';

const pageFor = (url: string | undefined): Page => {
  const address = url ? toAddress(url) : null;
  return address ? { kind: 'web', url: address } : START;
};
const titleOf = (page: Page) => (page.kind === 'web' ? titleFor(page.url) : '시작 페이지');
/** A frame's identity: a new visit or ⌘R mounts a fresh one. */
const frameKey = (tab: Tab) => `${tab.index}:${tab.reloads}`;

function TabButton({ tab, onSelect, onClose }: { tab: Tab; onSelect: () => void; onClose: () => void }) {
  const page = currentPage(tab);
  const title = titleOf(page);
  const site = page.kind === 'web' ? siteFor(page.url) : undefined;
  return (
    <div className={styles.tab}>
      <button type="button" className={styles.tabButton} title={title} onClick={onSelect}>
        {site ? <AppIcon icon={site.icon} size={16} /> : page.kind === 'web' && <Symbol name="globe" size={14} />}
        <span className={styles.tabTitle}>{title}</span>
      </button>
      <button type="button" className={styles.close} aria-label={`${title} 탭 닫기`} onClick={onClose}>
        <Symbol name="xmark" size={9} weight="semibold" />
      </button>
    </div>
  );
}

function PageView({ tab, onGo, onLoad }: { tab: Tab; onGo: (input: string) => void; onLoad: () => void }) {
  const page = currentPage(tab);
  if (page.kind === 'start') return <StartPage onOpen={onGo} />;
  const site = siteFor(page.url);
  if (site && !site.frameable) return <BlockedPage site={site} url={page.url} />;
  return (
    <>
      <iframe
        key={frameKey(tab)}
        className={styles.frame}
        src={page.url}
        title={titleFor(page.url)}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={onLoad}
      />
      {!site && !page.url.startsWith('https://www.google.com/search') && <FrameHint url={page.url} />}
    </>
  );
}

/** Safari with the compact tab bar: the active tab is the address field, centred in the toolbar. */
export default function SafariWindow({ props }: DesktopAppProps<'safari'>) {
  const { active } = useWindowFrame();
  const [state, dispatch] = useReducer(reduceTabs, props.url, (url) => initialTabs(pageFor(url)));
  const [loaded, setLoaded] = useState<Record<number, string>>({});
  const address = useRef<HTMLInputElement>(null);
  const focusAddress = useRef(false);
  const tab = activeTab(state);
  const page = currentPage(tab);

  // A link opened from another app (Terminal's `open`) arrives as a new tab; `request` tells a second request for the same link apart.
  const [opened, setOpened] = useState(props);
  if (props.url !== opened.url || props.request !== opened.request) {
    setOpened(props);
    if (props.url) dispatch({ type: 'new', page: pageFor(props.url) });
  }

  useWindowTitle(titleOf(page));

  const go = (input: string) => {
    const url = toAddress(input);
    if (url) dispatch({ type: 'go', page: { kind: 'web', url } });
  };
  const newTab = () => {
    dispatch({ type: 'new' });
    focusAddress.current = true;
  };

  useWindowCommands({
    'safari.openLocation': () => address.current?.focus(),
    'safari.reload': () => dispatch({ type: 'reload' }),
    'safari.home': () => {
      if (page.kind === 'web') dispatch({ type: 'go', page: START });
    },
    'nav.back': () => dispatch({ type: 'back' }),
    'nav.forward': () => dispatch({ type: 'forward' }),
  });

  // A new tab starts with the address field ready for typing.
  useLayoutEffect(() => {
    if (!focusAddress.current) return;
    focusAddress.current = false;
    address.current?.focus();
  });

  const framing = page.kind === 'web' && siteFor(page.url)?.frameable !== false;

  return (
    <div className={styles.safari}>
      <header className={styles.toolbar} data-window-drag data-active={active || undefined}>
        <ToolbarGroup label="탐색">
          <ToolbarButton icon="chevron.left" label="뒤로" aria-keyshortcuts="Meta+[" disabled={tab.index === 0} onClick={() => dispatch({ type: 'back' })} />
          <ToolbarButton
            icon="chevron.right"
            label="앞으로"
            aria-keyshortcuts="Meta+]"
            disabled={tab.index >= tab.history.length - 1}
            onClick={() => dispatch({ type: 'forward' })}
          />
        </ToolbarGroup>
        <div className={styles.tabs} role="group" aria-label="탭">
          {state.tabs.map((t) =>
            t.id === state.active ? (
              <AddressField
                key={t.id}
                page={page}
                loading={framing && loaded[t.id] !== frameKey(t)}
                inputRef={address}
                onGo={go}
                onReload={() => dispatch({ type: 'reload' })}
                onClose={state.tabs.length > 1 ? () => dispatch({ type: 'close', id: t.id }) : undefined}
              />
            ) : (
              <TabButton
                key={t.id}
                tab={t}
                onSelect={() => dispatch({ type: 'select', id: t.id })}
                onClose={() => dispatch({ type: 'close', id: t.id })}
              />
            ),
          )}
        </div>
        <ToolbarGroup label="페이지">
          <ToolbarButton
            icon="square.and.arrow.up"
            label="공유"
            disabled={page.kind !== 'web'}
            onClick={() => page.kind === 'web' && void share(titleFor(page.url), page.url, 'safari')}
          />
          <ToolbarButton icon="plus" label="새로운 탭" onClick={newTab} />
        </ToolbarGroup>
      </header>
      {/* Every tab stays mounted, so switching tabs keeps each page where it was. */}
      {state.tabs.map((t) => (
        <div key={t.id} className={styles.page} hidden={t.id !== state.active}>
          <PageView tab={t} onGo={go} onLoad={() => setLoaded((all) => ({ ...all, [t.id]: frameKey(t) }))} />
        </div>
      ))}
    </div>
  );
}
