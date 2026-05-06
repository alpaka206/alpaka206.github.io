import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { CODE_WORKSPACES } from '@/features/desktop/config/shell';
import {
  PageScrollContainerProvider,
  PAGES_SCROLL_CONTAINER_ID,
} from '@/features/pages-window/context/PageScrollContext';
import { PageContent } from '@/features/pages-window/registry/PageContent';
import { PAGE_TABS } from '@/features/pages-window/registry/page-registry';
import { useClock } from '@/hooks/useClock';
import { useDesktopPreferencesStore } from '@/stores';
import type { TextFileId } from '@/stores';
import { useImagePreload } from '@/utils/preloadAssets';
import {
  PHONE_APP_BY_ID,
  PHONE_APPS,
  PHONE_DOCK_APP_IDS,
  PHONE_FOLDER_APP_IDS,
  PHONE_FOLDER_TITLES,
  PHONE_HOME_APP_IDS,
  PHONE_SYSTEM_ICONS,
  type PhoneApp,
  type PhoneFolderId,
  type PhoneLaunch,
} from '../config/galaxyShell';

const NotepadWindowBody = lazy(async () => {
  const module = await import(
    '@/features/notepad-window/components/NotepadWindowBody'
  );
  return { default: module.NotepadWindowBody };
});

const TerminalWindowBody = lazy(async () => {
  const module = await import(
    '@/features/terminal-window/components/TerminalWindowBody'
  );
  return { default: module.TerminalWindowBody };
});

const Github1sCodeWindow = lazy(async () => {
  const module = await import(
    '@/features/code-window/components/Github1sCodeWindow'
  );
  return { default: module.Github1sCodeWindow };
});

type RunnablePhoneLaunch = Exclude<PhoneLaunch, { kind: 'folder' }>;

export type PhoneInitialApp = RunnablePhoneLaunch;

type PhoneActiveApp = {
  key: string;
  title: string;
  icon: string;
  launch: RunnablePhoneLaunch;
};

const PHONE_IMAGE_ASSETS = PHONE_APPS.map((app) => app.icon).filter((src) =>
  src.startsWith('/')
);

const TEXT_FILE_TITLES: Record<TextFileId, string> = {
  readme: 'Notes',
  'about-file': 'About',
  contact: 'Phone',
  now: 'Messages',
  resume: 'Resume',
};

function isRunnableLaunch(launch: PhoneLaunch): launch is RunnablePhoneLaunch {
  return launch.kind !== 'folder';
}

function getLaunchKey(launch: RunnablePhoneLaunch) {
  switch (launch.kind) {
    case 'page':
      return `page:${launch.pageId}`;
    case 'text-file':
      return `text-file:${launch.fileId}`;
    case 'code':
      return `code:${launch.workspaceId}`;
    case 'terminal':
      return 'terminal:main';
  }
}

function getFallbackTitle(launch: RunnablePhoneLaunch) {
  switch (launch.kind) {
    case 'page':
      return PAGE_TABS[launch.pageId].title;
    case 'text-file':
      return TEXT_FILE_TITLES[launch.fileId];
    case 'code':
      return CODE_WORKSPACES[launch.workspaceId].title;
    case 'terminal':
      return 'Terminal';
  }
}

function getFallbackIcon(launch: RunnablePhoneLaunch) {
  switch (launch.kind) {
    case 'page':
      return PAGE_TABS[launch.pageId].icon;
    case 'text-file':
      return PHONE_SYSTEM_ICONS.notes;
    case 'code':
      return PHONE_SYSTEM_ICONS.code;
    case 'terminal':
      return PHONE_SYSTEM_ICONS.terminal;
  }
}

function getActiveAppFromLaunch(launch: RunnablePhoneLaunch): PhoneActiveApp {
  const key = getLaunchKey(launch);
  const matchedApp = PHONE_APPS.find(
    (app) => isRunnableLaunch(app.launch) && getLaunchKey(app.launch) === key
  );

  return {
    key,
    title: matchedApp?.label ?? getFallbackTitle(launch),
    icon: matchedApp?.icon ?? getFallbackIcon(launch),
    launch,
  };
}

function formatTime(now: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
}

function formatHomeDate(now: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(now);
}

function SignalIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox='0 0 18 18' className={className} aria-hidden='true'>
      <path
        d='M2 14.5h2.2V9.8H2zm4 0h2.2V7.3H6zm4 0h2.2V4.6H10zm4 0h2.2V2H14z'
        fill='currentColor'
      />
    </svg>
  );
}

function WifiIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox='0 0 18 18' className={className} aria-hidden='true'>
      <path
        d='M9 14.6 6.8 12.4a3.1 3.1 0 0 1 4.4 0zm0-4.2L4.8 6.7a6.6 6.6 0 0 1 8.4 0zm0-4.1L2 3.8a10.8 10.8 0 0 1 14 0z'
        fill='currentColor'
      />
    </svg>
  );
}

function BatteryIcon({ className = 'h-4 w-5' }: { className?: string }) {
  return (
    <svg viewBox='0 0 24 18' className={className} aria-hidden='true'>
      <rect
        x='1.5'
        y='4.2'
        width='18'
        height='9.6'
        rx='3'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
      />
      <rect x='4.1' y='6.8' width='11.4' height='4.4' rx='1.4' fill='currentColor' />
      <rect x='20.5' y='7' width='2' height='4' rx='1' fill='currentColor' />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox='0 0 24 24' className='h-6 w-6' aria-hidden='true'>
      <path
        d='M15 5 8 12l7 7'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2.4'
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox='0 0 24 24' className='h-5 w-5' aria-hidden='true'>
      <path
        d='m20 20-4.5-4.5M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeWidth='2'
      />
    </svg>
  );
}

function RecentIcon() {
  return (
    <svg viewBox='0 0 24 24' className='h-6 w-6' aria-hidden='true'>
      <rect
        x='5'
        y='5'
        width='14'
        height='14'
        rx='3.5'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox='0 0 24 24' className='h-6 w-6' aria-hidden='true'>
      <circle cx='12' cy='12' r='5.2' fill='none' stroke='currentColor' strokeWidth='2' />
    </svg>
  );
}

function DrawerIcon() {
  return (
    <svg viewBox='0 0 24 24' className='h-5 w-5' aria-hidden='true'>
      <path
        d='m7 14 5-5 5 5'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2.2'
      />
    </svg>
  );
}

function PhoneStatusBar({
  now,
  dark,
  onOpenQuickPanel,
}: {
  now: Date;
  dark: boolean;
  onOpenQuickPanel: () => void;
}) {
  return (
    <button
      type='button'
      aria-label='Open quick settings'
      onClick={onOpenQuickPanel}
      className={[
        'flex h-8 w-full shrink-0 items-center justify-between px-5 pt-1 text-[12px] font-semibold',
        dark ? 'text-[#111827]' : 'text-white drop-shadow',
      ].join(' ')}
    >
      <span>{formatTime(now)}</span>
      <span className='flex items-center gap-1.5'>
        <SignalIcon />
        <WifiIcon />
        <span className='text-[11px]'>86%</span>
        <BatteryIcon />
      </span>
    </button>
  );
}

function FolderIconPreview({ folderId }: { folderId: PhoneFolderId }) {
  const previewApps = PHONE_FOLDER_APP_IDS[folderId]
    .slice(0, 4)
    .map((id) => PHONE_APP_BY_ID.get(id))
    .filter((app): app is PhoneApp => Boolean(app));

  return (
    <div className='grid h-full w-full grid-cols-2 gap-1.5 rounded-[20px] bg-white/92 p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]'>
      {previewApps.map((app) => (
        <img
          key={app.id}
          src={app.icon}
          alt=''
          className='h-full w-full rounded-[9px] object-cover'
          draggable={false}
        />
      ))}
    </div>
  );
}

function PhoneAppIcon({
  app,
  onLaunch,
  dense = false,
}: {
  app: PhoneApp;
  onLaunch: (app: PhoneApp) => void;
  dense?: boolean;
}) {
  const isFolder = app.launch.kind === 'folder';

  return (
    <button
      type='button'
      onClick={() => onLaunch(app)}
      className='group flex min-w-0 flex-col items-center gap-1.5 text-white outline-none'
      aria-label={app.label}
    >
      <span
        className={[
          'grid shrink-0 place-items-center overflow-hidden rounded-[21px] shadow-[0_10px_22px_rgba(0,0,0,0.2)] ring-1 ring-white/16 transition-transform group-active:scale-95',
          dense ? 'h-[50px] w-[50px]' : 'h-[56px] w-[56px]',
          isFolder ? 'bg-white/16 p-0' : 'bg-white/10',
        ].join(' ')}
      >
        {isFolder ? (
          <FolderIconPreview folderId={app.launch.folderId} />
        ) : (
          <img
            src={app.icon}
            alt=''
            className='h-full w-full object-cover'
            draggable={false}
          />
        )}
      </span>
      <span
        className={[
          'max-w-[76px] text-center font-medium leading-tight drop-shadow',
          dense ? 'text-[10px]' : 'text-[11px]',
        ].join(' ')}
      >
        {app.label}
      </span>
    </button>
  );
}

function HomeScreen({
  now,
  onLaunch,
  onOpenDrawer,
  onPointerDown,
  onPointerUp,
}: {
  now: Date;
  onLaunch: (app: PhoneApp) => void;
  onOpenDrawer: () => void;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
}) {
  const homeApps = PHONE_HOME_APP_IDS.map((id) => PHONE_APP_BY_ID.get(id)).filter(
    (app): app is PhoneApp => Boolean(app)
  );
  const dockApps = PHONE_DOCK_APP_IDS.map((id) => PHONE_APP_BY_ID.get(id)).filter(
    (app): app is PhoneApp => Boolean(app)
  );

  return (
    <div
      className='flex h-full min-h-0 flex-col px-5 pb-3 pt-3'
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <section className='mb-5 mt-1 rounded-[32px] bg-black/16 px-5 py-4 text-white shadow-[0_18px_44px_rgba(0,0,0,0.18)] ring-1 ring-white/14 backdrop-blur-2xl'>
        <div className='text-[42px] font-light leading-none'>{formatTime(now)}</div>
        <div className='mt-2 text-[13px] font-medium text-white/82'>
          {formatHomeDate(now)}
        </div>
        <div className='mt-4 flex items-center justify-between gap-3 text-[12px] text-white/80'>
          <span>Seoul</span>
          <span className='rounded-full bg-white/16 px-3 py-1'>One UI Portfolio</span>
        </div>
      </section>

      <div className='grid grid-cols-4 gap-x-3 gap-y-5'>
        {homeApps.map((app) => (
          <PhoneAppIcon key={app.id} app={app} onLaunch={onLaunch} />
        ))}
      </div>

      <button
        type='button'
        onClick={onOpenDrawer}
        className='mx-auto mt-auto grid h-9 w-24 place-items-center rounded-full bg-black/14 text-white ring-1 ring-white/12 backdrop-blur-xl'
        aria-label='Open apps'
      >
        <DrawerIcon />
      </button>

      <div className='mt-3 grid grid-cols-4 gap-3 rounded-[30px] bg-black/22 px-4 py-3 shadow-[0_18px_42px_rgba(0,0,0,0.22)] ring-1 ring-white/12 backdrop-blur-2xl'>
        {dockApps.map((app) => (
          <PhoneAppIcon key={app.id} app={app} onLaunch={onLaunch} dense />
        ))}
      </div>
    </div>
  );
}

function QuickTile({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={[
        'flex h-[82px] flex-col justify-between rounded-[24px] px-4 py-3 text-left transition-colors',
        active
          ? 'bg-[#2f6cff] text-white shadow-[0_12px_28px_rgba(47,108,255,0.28)]'
          : 'bg-white/72 text-[#111827] ring-1 ring-black/5',
      ].join(' ')}
    >
      <span className='text-[22px]'>{children}</span>
      <span className='text-[12px] font-semibold'>{label}</span>
    </button>
  );
}

function QuickSettingsPanel({
  open,
  now,
  soundEnabled,
  onClose,
  onToggleSound,
  onOpenSettings,
}: {
  open: boolean;
  now: Date;
  soundEnabled: boolean;
  onClose: () => void;
  onToggleSound: () => void;
  onOpenSettings: () => void;
}) {
  if (!open) return null;

  return (
    <div className='absolute inset-0 z-[80] bg-black/32 px-3 pt-2 text-[#111827] backdrop-blur-md'>
      <button
        type='button'
        aria-label='Close quick settings'
        className='absolute inset-0 h-full w-full cursor-default'
        onClick={onClose}
      />
      <div
        className='relative rounded-[34px] bg-[#eef2f8]/96 p-4 shadow-[0_24px_72px_rgba(0,0,0,0.34)] ring-1 ring-white/70 backdrop-blur-3xl'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='flex items-start justify-between gap-4 px-1'>
          <div>
            <div className='text-[28px] font-semibold leading-none'>{formatTime(now)}</div>
            <div className='mt-2 text-[13px] text-[#475467]'>{formatHomeDate(now)}</div>
          </div>
          <button
            type='button'
            onClick={onOpenSettings}
            className='rounded-full bg-white/80 px-4 py-2 text-[12px] font-semibold text-[#111827] shadow-sm ring-1 ring-black/5'
          >
            Settings
          </button>
        </div>

        <div className='mt-5 grid grid-cols-2 gap-3'>
          <QuickTile label='Wi-Fi' active>
            <WifiIcon className='h-6 w-6' />
          </QuickTile>
          <QuickTile label='Sound' active={soundEnabled} onClick={onToggleSound}>
            {soundEnabled ? '♪' : '×'}
          </QuickTile>
          <QuickTile label='Bluetooth'>B</QuickTile>
          <QuickTile label='Location' active>
            ◇
          </QuickTile>
        </div>

        <div className='mt-4 rounded-[24px] bg-white/72 px-4 py-3 ring-1 ring-black/5'>
          <div className='mb-3 flex items-center justify-between text-[12px] font-semibold text-[#475467]'>
            <span>Brightness</span>
            <span>72%</span>
          </div>
          <div className='h-3 rounded-full bg-[#d0d5dd]'>
            <div className='h-full w-[72%] rounded-full bg-[#2f6cff]' />
          </div>
        </div>

        <div className='mt-4 rounded-[24px] bg-white/72 px-4 py-3 ring-1 ring-black/5'>
          <div className='text-[12px] font-semibold text-[#475467]'>Notifications</div>
          <div className='mt-2 text-[14px] font-semibold'>Portfolio is ready</div>
          <div className='mt-1 text-[12px] leading-5 text-[#667085]'>
            Kim GyuWon portfolio is up to date.
          </div>
        </div>
      </div>
    </div>
  );
}

function FolderOverlay({
  folderId,
  onClose,
  onLaunch,
}: {
  folderId: PhoneFolderId | null;
  onClose: () => void;
  onLaunch: (app: PhoneApp) => void;
}) {
  if (!folderId) return null;

  const apps = PHONE_FOLDER_APP_IDS[folderId]
    .map((id) => PHONE_APP_BY_ID.get(id))
    .filter((app): app is PhoneApp => Boolean(app));

  return (
    <div className='absolute inset-0 z-[60] px-4 pt-[78px] text-white'>
      <button
        type='button'
        aria-label='Close folder'
        className='absolute inset-0 h-full w-full bg-black/24 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative rounded-[34px] bg-white/18 p-5 shadow-[0_24px_72px_rgba(0,0,0,0.34)] ring-1 ring-white/28 backdrop-blur-3xl'>
        <div className='mb-5 flex items-center justify-between gap-3'>
          <div className='text-[22px] font-semibold'>{PHONE_FOLDER_TITLES[folderId]}</div>
          <button
            type='button'
            onClick={onClose}
            className='grid h-9 w-9 place-items-center rounded-full bg-white/16 text-[20px]'
            aria-label='Close'
          >
            ×
          </button>
        </div>
        <div className='grid grid-cols-3 gap-x-5 gap-y-6'>
          {apps.map((app) => (
            <PhoneAppIcon key={app.id} app={app} onLaunch={onLaunch} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppDrawer({
  open,
  query,
  onQueryChange,
  onClose,
  onLaunch,
}: {
  open: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onClose: () => void;
  onLaunch: (app: PhoneApp) => void;
}) {
  const filteredApps = PHONE_APPS.filter((app) =>
    app.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  if (!open) return null;

  return (
    <div className='absolute inset-0 z-[55] flex flex-col bg-black/34 px-5 pb-5 pt-12 text-white backdrop-blur-2xl'>
      <div className='flex items-center justify-between'>
        <div className='text-[24px] font-semibold'>Apps</div>
        <button
          type='button'
          onClick={onClose}
          className='grid h-10 w-10 place-items-center rounded-full bg-white/14 text-[22px]'
          aria-label='Close apps'
        >
          ×
        </button>
      </div>
      <label className='mt-5 flex h-12 items-center gap-3 rounded-full bg-white/18 px-4 text-white ring-1 ring-white/16'>
        <SearchIcon />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder='Finder search'
          className='min-w-0 flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:text-white/58'
        />
      </label>

      <div className='app-scroll mt-6 min-h-0 flex-1 overflow-y-auto pb-3'>
        {filteredApps.length > 0 ? (
          <div className='grid grid-cols-4 gap-x-3 gap-y-6'>
            {filteredApps.map((app) => (
              <PhoneAppIcon key={app.id} app={app} onLaunch={onLaunch} />
            ))}
          </div>
        ) : (
          <div className='rounded-[28px] bg-white/14 p-5 text-center text-sm text-white/78'>
            No results
          </div>
        )}
      </div>
    </div>
  );
}

function RecentsOverlay({
  open,
  recentApps,
  onClose,
  onResume,
}: {
  open: boolean;
  recentApps: PhoneActiveApp[];
  onClose: () => void;
  onResume: (app: PhoneActiveApp) => void;
}) {
  if (!open) return null;

  return (
    <div className='absolute inset-0 z-[70] bg-black/42 px-5 pb-20 pt-14 text-white backdrop-blur-xl'>
      <div className='mb-5 flex items-center justify-between'>
        <div className='text-[22px] font-semibold'>Recent apps</div>
        <button
          type='button'
          onClick={onClose}
          className='rounded-full bg-white/14 px-4 py-2 text-[12px] font-semibold'
        >
          Close
        </button>
      </div>
      {recentApps.length > 0 ? (
        <div className='grid grid-cols-2 gap-4'>
          {recentApps.map((app) => (
            <button
              type='button'
              key={app.key}
              onClick={() => onResume(app)}
              className='min-h-[188px] rounded-[28px] bg-white/16 p-4 text-left shadow-[0_20px_52px_rgba(0,0,0,0.24)] ring-1 ring-white/18 backdrop-blur-2xl'
            >
              <div className='flex items-center gap-3'>
                <img
                  src={app.icon}
                  alt=''
                  className='h-10 w-10 rounded-[15px] object-cover'
                />
                <span className='text-sm font-semibold'>{app.title}</span>
              </div>
              <div className='mt-5 h-24 rounded-[22px] bg-white/78 p-4 text-[#111827]'>
                <div className='text-[12px] font-semibold text-[#667085]'>Preview</div>
                <div className='mt-2 text-[20px] font-semibold'>{app.title}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className='grid h-full place-items-center text-sm text-white/74'>
          No recent apps
        </div>
      )}
    </div>
  );
}

function PhoneAppContent({ app }: { app: PhoneActiveApp }) {
  switch (app.launch.kind) {
    case 'page':
      return (
        <div
          id={PAGES_SCROLL_CONTAINER_ID}
          className='app-scroll h-full min-h-0 overflow-y-auto overscroll-y-contain bg-[#f8fafc] [&_iframe]:h-full [&_iframe]:w-full [&_img]:h-auto [&_img]:max-w-full'
        >
          <PageScrollContainerProvider>
            <PageContent pageId={app.launch.pageId} />
          </PageScrollContainerProvider>
        </div>
      );
    case 'text-file':
      return (
        <Suspense fallback={<div className='p-4 text-sm text-[#667085]'>Loading...</div>}>
          <NotepadWindowBody fileId={app.launch.fileId} />
        </Suspense>
      );
    case 'terminal':
      return (
        <Suspense fallback={<div className='p-4 text-sm text-[#667085]'>Loading...</div>}>
          <TerminalWindowBody />
        </Suspense>
      );
    case 'code': {
      const workspace = CODE_WORKSPACES[app.launch.workspaceId];
      return (
        <Suspense fallback={<div className='p-4 text-sm text-[#667085]'>Loading...</div>}>
          <Github1sCodeWindow
            owner={workspace.owner}
            repo={workspace.repo}
            branch={workspace.branch}
            path={workspace.path}
            title={workspace.title}
          />
        </Suspense>
      );
    }
  }
}

function PhoneAppScreen({
  app,
  onBack,
}: {
  app: PhoneActiveApp;
  onBack: () => void;
}) {
  return (
    <div className='flex h-full min-h-0 flex-col bg-[#f8fafc] text-[#111827]'>
      <div className='flex h-[58px] shrink-0 items-center gap-3 border-b border-black/5 bg-[#f8fafc]/96 px-3 backdrop-blur-xl'>
        <button
          type='button'
          onClick={onBack}
          className='grid h-11 w-11 place-items-center rounded-full text-[#111827] active:bg-black/6'
          aria-label='Back'
        >
          <BackIcon />
        </button>
        <img src={app.icon} alt='' className='h-9 w-9 rounded-[14px] object-cover' />
        <div className='min-w-0 flex-1 truncate text-[18px] font-semibold'>
          {app.title}
        </div>
      </div>
      <div className='min-h-0 flex-1 overflow-hidden'>
        <PhoneAppContent app={app} />
      </div>
    </div>
  );
}

function PhoneNavigationBar({
  activeApp,
  onRecents,
  onHome,
  onBack,
}: {
  activeApp: boolean;
  onRecents: () => void;
  onHome: () => void;
  onBack: () => void;
}) {
  return (
    <div
      className={[
        'flex h-11 shrink-0 items-center justify-around px-10',
        activeApp ? 'bg-[#f8fafc] text-[#111827]' : 'bg-transparent text-white',
      ].join(' ')}
    >
      <button
        type='button'
        onClick={onRecents}
        className='grid h-10 w-14 place-items-center rounded-full active:bg-black/8'
        aria-label='Recent apps'
      >
        <RecentIcon />
      </button>
      <button
        type='button'
        onClick={onHome}
        className='grid h-10 w-14 place-items-center rounded-full active:bg-black/8'
        aria-label='Home'
      >
        <HomeIcon />
      </button>
      <button
        type='button'
        onClick={onBack}
        className='grid h-10 w-14 place-items-center rounded-full active:bg-black/8'
        aria-label='Back'
      >
        <BackIcon />
      </button>
    </div>
  );
}

function sameActiveApp(a: PhoneActiveApp, b: PhoneActiveApp) {
  return a.key === b.key;
}

export function GalaxyPhoneShell({
  initialApp,
}: {
  initialApp?: PhoneInitialApp;
}) {
  const now = useClock();
  const swipeStartYRef = useRef<number | null>(null);
  const soundEnabled = useDesktopPreferencesStore((s) => s.soundEnabled);
  const toggleSound = useDesktopPreferencesStore((s) => s.toggleSound);
  const [activeApp, setActiveApp] = useState<PhoneActiveApp | null>(() =>
    initialApp ? getActiveAppFromLaunch(initialApp) : null
  );
  const [recentApps, setRecentApps] = useState<PhoneActiveApp[]>(() =>
    initialApp ? [getActiveAppFromLaunch(initialApp)] : []
  );
  const [openFolderId, setOpenFolderId] = useState<PhoneFolderId | null>(null);
  const [quickPanelOpen, setQuickPanelOpen] = useState(false);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [recentsOpen, setRecentsOpen] = useState(false);
  const [drawerQuery, setDrawerQuery] = useState('');

  const initialKey = initialApp ? getLaunchKey(initialApp) : 'home';

  useImagePreload(PHONE_IMAGE_ASSETS);

  useEffect(() => {
    if (!initialApp) return;
    const nextApp = getActiveAppFromLaunch(initialApp);
    setActiveApp(nextApp);
    setRecentApps((current) => [
      nextApp,
      ...current.filter((entry) => !sameActiveApp(entry, nextApp)),
    ].slice(0, 6));
  }, [initialApp, initialKey]);

  const statusDark = Boolean(activeApp);

  const launchRunnableApp = (nextApp: PhoneActiveApp) => {
    setActiveApp(nextApp);
    setOpenFolderId(null);
    setAppDrawerOpen(false);
    setRecentsOpen(false);
    setQuickPanelOpen(false);
    setDrawerQuery('');
    setRecentApps((current) => [
      nextApp,
      ...current.filter((entry) => !sameActiveApp(entry, nextApp)),
    ].slice(0, 6));
  };

  const launchApp = (app: PhoneApp) => {
    if (app.launch.kind === 'folder') {
      setOpenFolderId(app.launch.folderId);
      setAppDrawerOpen(false);
      setQuickPanelOpen(false);
      return;
    }

    launchRunnableApp(getActiveAppFromLaunch(app.launch));
  };

  const goHome = () => {
    setActiveApp(null);
    setOpenFolderId(null);
    setQuickPanelOpen(false);
    setAppDrawerOpen(false);
    setRecentsOpen(false);
    setDrawerQuery('');
  };

  const goBack = () => {
    if (quickPanelOpen) {
      setQuickPanelOpen(false);
      return;
    }
    if (recentsOpen) {
      setRecentsOpen(false);
      return;
    }
    if (openFolderId) {
      setOpenFolderId(null);
      return;
    }
    if (appDrawerOpen) {
      setAppDrawerOpen(false);
      setDrawerQuery('');
      return;
    }
    if (activeApp) {
      setActiveApp(null);
    }
  };

  const handleHomePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStartYRef.current = event.clientY;
  };

  const handleHomePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (swipeStartYRef.current === null) return;
    const deltaY = swipeStartYRef.current - event.clientY;
    swipeStartYRef.current = null;
    if (deltaY > 64) {
      setAppDrawerOpen(true);
    }
  };

  const resumeRecentApp = (app: PhoneActiveApp) => {
    launchRunnableApp(app);
  };

  const openSettings = () => {
    const settingsApp = PHONE_APP_BY_ID.get('settings');
    if (settingsApp) {
      launchApp(settingsApp);
    }
  };

  const wallpaperStyle = useMemo(
    () => ({
      backgroundImage:
        'linear-gradient(145deg, rgba(9,20,44,0.88) 0%, rgba(39,44,91,0.62) 34%, rgba(165,68,128,0.5) 62%, rgba(32,146,156,0.64) 100%), linear-gradient(28deg, #07111f 0%, #172554 32%, #5b2f87 58%, #0f766e 100%)',
    }),
    []
  );

  return (
    <div
      className='relative h-full w-full overflow-hidden bg-[#07111f] text-white'
      style={wallpaperStyle}
    >
      <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_22%,rgba(0,0,0,0.16)_100%)]' />
      <div className='relative z-10 flex h-full min-h-0 flex-col'>
        <div className={statusDark ? 'bg-[#f8fafc]' : 'bg-transparent'}>
          <PhoneStatusBar
            now={now}
            dark={statusDark}
            onOpenQuickPanel={() => setQuickPanelOpen(true)}
          />
        </div>

        <main className='relative min-h-0 flex-1 overflow-hidden'>
          {activeApp ? (
            <PhoneAppScreen app={activeApp} onBack={goBack} />
          ) : (
            <HomeScreen
              now={now}
              onLaunch={launchApp}
              onOpenDrawer={() => setAppDrawerOpen(true)}
              onPointerDown={handleHomePointerDown}
              onPointerUp={handleHomePointerUp}
            />
          )}
        </main>

        <PhoneNavigationBar
          activeApp={Boolean(activeApp)}
          onRecents={() => {
            setRecentsOpen(true);
            setQuickPanelOpen(false);
            setOpenFolderId(null);
            setAppDrawerOpen(false);
          }}
          onHome={goHome}
          onBack={goBack}
        />
      </div>

      <QuickSettingsPanel
        open={quickPanelOpen}
        now={now}
        soundEnabled={soundEnabled}
        onClose={() => setQuickPanelOpen(false)}
        onToggleSound={toggleSound}
        onOpenSettings={openSettings}
      />
      <FolderOverlay
        folderId={openFolderId}
        onClose={() => setOpenFolderId(null)}
        onLaunch={launchApp}
      />
      <AppDrawer
        open={appDrawerOpen}
        query={drawerQuery}
        onQueryChange={setDrawerQuery}
        onClose={() => {
          setAppDrawerOpen(false);
          setDrawerQuery('');
        }}
        onLaunch={launchApp}
      />
      <RecentsOverlay
        open={recentsOpen}
        recentApps={recentApps}
        onClose={() => setRecentsOpen(false)}
        onResume={resumeRecentApp}
      />
    </div>
  );
}
