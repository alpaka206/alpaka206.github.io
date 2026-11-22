import { useWindowTitles } from '@/desktop/kit/window';
import { openMissionControl } from '@/desktop/windows/overview';
import { APPS, DOCK_APPS, type AppId } from '@/os/apps';
import type { MenuEntry } from '@/os/menus';
import { useWindows } from '@/os/windows';
import type { DockItem } from './items';
import { STACKS, type StackView } from './stacks';

/**
 * Right-click menus of Dock items, in the wording of Korean macOS 27
 * (Dock.app DockMenus.strings, macos.md §16). Items without a command are the
 * ones macOS would show but this portfolio has nothing behind; they render
 * greyed out. Commands are local to the item, so each menu brings its own runner.
 */
interface DockMenu {
  entries: MenuEntry[];
  run: (command: string) => void;
}

interface Actions {
  /** Open or bring forward, as a click on the tile does. */
  activate: () => void;
  setStackView: (view: StackView) => void;
}

const sep = 'separator' as const;

function appMenu(app: AppId, actions: Actions): DockMenu {
  const windows = useWindows.getState().windows.filter((w) => w.app === app);
  const titles = useWindowTitles.getState();
  const running = windows.length > 0;
  // macOS ticks 'Dock에 유지' for a pinned app and offers 'Dock에서 제거' once it has quit.
  // The Dock here is fixed, so both stay greyed out.
  const keep = DOCK_APPS.includes(app) && !running ? 'Dock에서 제거' : 'Dock에 유지';
  const options: MenuEntry = {
    label: '옵션',
    submenu: [
      { label: keep },
      { label: '로그인 시 열기' },
      sep,
      { label: 'Finder에서 보기', command: 'reveal' },
    ],
  };
  const entries: MenuEntry[] = running
    ? [
        ...windows.map((w) => ({ label: titles[w.id] ?? APPS[app].name, command: `window:${w.id}` })),
        sep,
        options,
        sep,
        { label: '모든 윈도우 보기', command: 'expose' },
        { label: windows.every((w) => w.hidden) ? '보기' : '가리기', command: 'hide' },
        ...(app === 'finder' ? [] : [{ label: '종료', command: 'quit' }]),
      ]
    : [options, sep, { label: '열기', command: 'open' }];

  return {
    entries,
    run: (command) => {
      const store = useWindows.getState();
      if (command.startsWith('window:')) store.focus(command.slice('window:'.length));
      else if (command === 'reveal') store.open('finder', { location: 'applications' });
      else if (command === 'expose') openMissionControl(app);
      else if (command === 'hide') {
        if (windows.every((w) => w.hidden)) actions.activate();
        else store.hideApp(app);
      } else if (command === 'quit') store.quit(app);
      else if (command === 'open') actions.activate();
    },
  };
}

function stackMenu(stack: keyof typeof STACKS, actions: Actions): DockMenu {
  const { location } = STACKS[stack];
  return {
    entries: [
      {
        label: '다음으로 내용 보기',
        submenu: [
          { label: '부채 모양', command: 'view:fan' },
          { label: '격자 모양', command: 'view:grid' },
          { label: '자동', command: 'view:auto' },
        ],
      },
      sep,
      { label: '열기', command: 'open' },
    ],
    run: (command) => {
      if (command.startsWith('view:')) actions.setStackView(command.slice('view:'.length) as StackView);
      else useWindows.getState().open('finder', { location });
    },
  };
}

const trashMenu: DockMenu = {
  // The Trash holds the previous, Windows-themed portfolio: it stays.
  entries: [{ label: '열기', command: 'open' }, sep, { label: '휴지통 비우기' }],
  run: () => useWindows.getState().open('finder', { location: 'trash' }),
};

export function dockMenu(item: DockItem, actions: Actions): DockMenu | null {
  switch (item.kind) {
    case 'app':
      return appMenu(item.app, actions);
    case 'stack':
      return stackMenu(item.stack, actions);
    case 'trash':
      return trashMenu;
    default:
      return null;
  }
}
